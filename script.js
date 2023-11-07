// script.js in the 'public' directory

document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const playButton = document.getElementById('playButton');
    const audioPlayer = document.getElementById('audioPlayer');
    const messages = document.getElementById('messages');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';

    playButton.addEventListener('click', function() {
        audioPlayer.src = '/start-audio-stream';
        audioPlayer.load();
        audioPlayer.play();
        playButton.style.display = 'none';
        audioPlayer.style.display = 'block';
    });

    sendButton.addEventListener('click', function() {
        const message = messageInput.value.trim();
        if (message) {
            appendMessage(message, 'Me');
            socket.emit('chat message', message);
            messageInput.value = '';
        }
    });

    messageInput.addEventListener('keypress', () => {
        socket.emit('typing');
    });

    socket.on('chat message', (msg) => {
        appendMessage(msg, 'Someone');
    });

    socket.on('typing', () => {
        messages.appendChild(typingIndicator);
        typingIndicator.textContent = 'Someone is typing...';
        messages.scrollTop = messages.scrollHeight;
    });

    messageInput.addEventListener('input', () => {
        if (messageInput.value.length === 0) {
            typingIndicator.remove();
        }
    });

    function appendMessage(msg, sender) {
        const item = document.createElement('div');
        const date = new Date();
        const time = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        item.innerHTML = `<strong>${sender}:</strong> ${msg} <span class="timestamp">${time}</span>`;
        item.classList.add(sender === 'Me' ? 'own-message' : 'other-message');
        messages.appendChild(item);
        messages.scrollTop = messages.scrollHeight;
    }
});
