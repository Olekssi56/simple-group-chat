var firebaseConfig = {
    apiKey: "AIzaSyCA90MHtjC6oS1PAhxL3QWWf44C2EhmrJA",
    authDomain: "chatting-f0ed6.firebaseapp.com",
    projectId: "chatting-f0ed6",
    storageBucket: "chatting-f0ed6.appspot.com",
    messagingSenderId: "728407264195",
    appId: "1:728407264195:web:4762c8777313f3fbf50b76",
    measurementId: "G-SJMM1VC6KR"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();

const username = prompt("Please Tell Us Your Name");

// Adding event listener for form submission  
document.getElementById('message-form').addEventListener('submit', (e) => {  
    e.preventDefault();
    
    // get values to be submitted
    const timestamp = Date.now();
    const messageInput = document.getElementById("message-input");
    const message = messageInput.value;

    // clear the input box
    messageInput.value = "";

    //auto scroll to bottom
    document
        .getElementById("messages")
        .scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });

    // create db collection and send in the data
    db.ref("messages/" + timestamp).set({
        username,
        message,
    });
});  

const fetchChat = db.ref("messages/");

fetchChat.on("child_added", function (snapshot) {
    const messages = snapshot.val();
    const message = `<li class=${username === messages.username ? "sent" : "receive"
        }><span>${messages.username}: </span>${messages.message}</li>`;
    // append the message on the page
    document.getElementById("messages").innerHTML += message;
});