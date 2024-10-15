// Initialize user initials
let userInitials = "";

// Disclaimer Modal and Initials Modal Handling
document.addEventListener("DOMContentLoaded", function () {
    const disclaimerModal = new bootstrap.Modal(document.getElementById('disclaimerModal'));
    const initialsModal = new bootstrap.Modal(document.getElementById('initialsModal'));
    const joinChatButton = document.getElementById("joinChat");
    const initialsInput = document.getElementById("initialsInput");

    // Show disclaimer modal on load
    disclaimerModal.show();

    // On clicking join chat
    joinChatButton.addEventListener("click", function () {
        userInitials = initialsInput.value.trim();
        if (userInitials) {
            initialsModal.hide();
        } else {
            alert("Please enter your initials to join the chat.");
        }
    });

    loadMessages();
});

// Function to create message HTML
function createMessageElement(message) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", "list-group-item");

    // Check if the message is mine based on initials
    if (message.initial == userInitials) {
        messageDiv.classList.add("my-message");
    } else {
        messageDiv.classList.add("other-message");
    }

    const nameP = document.createElement("p");
    nameP.classList.add("name");
    nameP.textContent = message.initial;

    const timeP = document.createElement("p");
    timeP.classList.add("time");
    timeP.textContent = message.create_time;

    const messageP = document.createElement("p");
    messageP.textContent = message.message;

    messageDiv.appendChild(nameP);
    messageDiv.appendChild(timeP);
    messageDiv.appendChild(messageP);

    return messageDiv;
}

// Function to load messages from API
function loadMessages() {
    // Remember the user's current scroll position
    const chatContainer = document.getElementById("chatContainer");
    const isAtBottom = chatContainer.scrollHeight - chatContainer.scrollTop === chatContainer.clientHeight;

    // Simulate API call to fetch message list
    fetch("http://localhost:3000/getMessageList")
        .then(response => response.json())
        .then(messages => {
            console.log("messages", messages);
            const messageList = document.getElementById("messageList");
            messageList.innerHTML = ""; // Clear the chat
            messages.reverse().forEach(message => {
                const messageElement = createMessageElement(message);
                messageList.appendChild(messageElement);
            });

            // Only scroll to the bottom if the user is already near the bottom
            if (isAtBottom) {
                scrollToBottom();
            }
        });
}

// Function to scroll to the latest message (bottom of the chat)
function scrollToBottom() {
    const chatContainer = document.getElementById("chatContainer");
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Function to post a new message
function postMessage(text) {
    // Simulate API call to add a message
    fetch("http://localhost:3000/addMessage", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            initial: userInitials,
            message: text
        })
    }).then(() => {
        loadMessages(); // Reload the messages after posting
    });
}

// Auto-refresh messages
setInterval(loadMessages, 2000);

// **Sending a message by pressing Enter key**
document.getElementById("messageInput").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        const messageInput = document.getElementById("messageInput");
        const messageText = messageInput.value.trim();

        if (messageText) {
            postMessage(messageText);
            messageInput.value = ""; // Clear the input field
        } else {
            alert("Please type a message.");
        }

        // Prevent the form submission or default action when Enter is pressed
        event.preventDefault();
    }
});

// Sending a new message
document.getElementById("sendMessage").addEventListener("click", function () {
    const messageInput = document.getElementById("messageInput");
    const messageText = messageInput.value.trim();

    if (messageText) {
        postMessage(messageText);
        messageInput.value = ""; // Clear the input field
    } else {
        alert("Please type a message.");
    }
});

// Initial load of messages
loadMessages();
