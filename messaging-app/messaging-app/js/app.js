document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("index.html")) {
        setupChat();
    }
});

function setupChat() {
    let user = localStorage.getItem("loggedInUser");
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    let contactList = document.getElementById("contact-list");

    // Populate contacts
    contactList.innerHTML = "";
    users.forEach(contact => {
        if (contact !== user) {
            let li = document.createElement("li");
            li.textContent = contact;
            li.onclick = () => selectContact(contact);
            contactList.appendChild(li);
        }
    });
}

function selectContact(contact) {
    localStorage.setItem("selectedContact", contact);
    document.getElementById("chat-with").textContent = contact;
    loadMessages();
}

function sendMessage() {
    let sender = localStorage.getItem("loggedInUser");
    let receiver = localStorage.getItem("selectedContact");
    let messageInput = document.getElementById("message-input");
    let message = messageInput.value.trim();

    if (!receiver) {
        alert("Please select a contact first.");
        return;
    }

    if (message !== "") {
        let chatKey = `chat_${sender}_${receiver}`;
        let messages = JSON.parse(localStorage.getItem(chatKey)) || [];

        messages.push({ sender, message });
        localStorage.setItem(chatKey, JSON.stringify(messages));

        messageInput.value = "";
        loadMessages();
    }
}

function loadMessages() {
    let sender = localStorage.getItem("loggedInUser");
    let receiver = localStorage.getItem("selectedContact");
    let messagesContainer = document.getElementById("messages");

    if (!receiver) return;
    messagesContainer.innerHTML = "";

    let chatKey1 = `chat_${sender}_${receiver}`;
    let chatKey2 = `chat_${receiver}_${sender}`;
    let messages = JSON.parse(localStorage.getItem(chatKey1)) || [];
    let messagesReverse = JSON.parse(localStorage.getItem(chatKey2)) || [];

    let allMessages = [...messages, ...messagesReverse];
    allMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    allMessages.forEach(msg => {
        let messageElement = document.createElement("div");
        messageElement.classList.add("message", msg.sender === sender ? "sent" : "received");
        messageElement.textContent = `${msg.sender}: ${msg.message}`;
        messagesContainer.appendChild(messageElement);
    });

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function logout() {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("selectedContact");
    window.location.href = "login.html";
}
