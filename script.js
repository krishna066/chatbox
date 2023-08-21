const messageForm = document.getElementById("send-container");
const messageInput = document.getElementById("message-input");
const messageContainer = document.getElementById("message-container");

const socket = io("http://localhost:8080");

const userName = prompt("Enter your userName");
appendMessage(`${userName} Joined`);
socket.emit("new-user", userName);

socket.on("chat-message", function (data) {
  appendMessage(data);
});

socket.on("user-connected", function (user) {
  appendMessage(`${user} - connected`);
});

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  socket.emit("send-chat-message", `${userName} > ${message}`);
  messageInput.value = "";
});

function appendMessage(message) {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageContainer.append(messageElement);
}
