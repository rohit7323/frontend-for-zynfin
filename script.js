// Placeholder backend webhook URL - Replace with your actual endpoint
const API_URL = 'https://your-backend-webhook-url.com/chat';

// DOM Elements
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const chatMessages = document.getElementById('chat-messages');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Mobile navigation toggle
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Function to add a message to the chat
function addMessage(content, type) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', type);
    messageDiv.textContent = content;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to bottom
}

// Function to show loading indicator
function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('message', 'ai', 'loading');
    loadingDiv.innerHTML = '<div class="spinner"></div> Thinking...';
    loadingDiv.id = 'loading-message';
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to hide loading indicator
function hideLoading() {
    const loadingMessage = document.getElementById('loading-message');
    if (loadingMessage) {
        loadingMessage.remove();
    }
}

// Function to send message to AI and handle response
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Add user message to chat
    addMessage(message, 'user');
    userInput.value = '';

    // Show loading
    showLoading();

    try {
        // Fetch request to backend
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const aiResponse = data.response || 'Sorry, I couldn\'t process your request. Please try again.';

        // Hide loading and add AI response
        hideLoading();
        addMessage(aiResponse, 'ai');
    } catch (error) {
        // Hide loading and show error
        hideLoading();
        addMessage('Oops! Something went wrong. Please check your connection and try again.', 'ai');
        console.error('Error:', error);
    }
}

// Event listeners
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});