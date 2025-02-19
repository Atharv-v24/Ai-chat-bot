const API_KEY = "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"; // Replace with your actual API key securely
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

const chatDisplay = document.getElementById("chat-display");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");
async function fetchGroqData(messages) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`, // Corrected template literal
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `HTTP error! Status: ${response.status}, body: ${errorBody}`
      );
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Sorry, I encountered an error. Please try again later.");
  }
}

function appendMessage(content, isUser = false, isError = false) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");
  messageElement.classList.add(
    isUser ? "user-message" : isError ? "error-message" : "bot-message"
  );
  messageElement.textContent = content;
  chatDisplay.appendChild(messageElement);
  chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

async function handleUserInput() {
  const userMessage = userInput.value.trim();
  if (userMessage) {
    appendMessage(userMessage, true); // Append user message
    userInput.value = ""; // Clear input field

    try {
      const messages = [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: userMessage },
      ];

      const botResponse = await fetchGroqData(messages);
      appendMessage(botResponse); // Append bot response
    } catch (error) {
      appendMessage(error.message, false, true); // Append error message
    }
  }
}

// Event listener for button click
sendButton.addEventListener("click", handleUserInput);

// Event listener for Enter key press
userInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    handleUserInput();
  }
});

// Clear chat display initially (optional)
chatDisplay.innerHTML = "";

// Optional: Append a welcome message
// appendMessage("Welcome to the chat! How can I assist you?");
