import React, { useState } from "react";
import "./AIBot.css";

const AIBot = () => {
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm CareConnectBot. Ask me anything about health and medicine.",
      type: "received",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Hardcoded API key (not recommended for production)
  const OPENAI_API_KEY =
    "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";

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    // Add user message
    const userMessage = { text: input.trim(), type: "sent" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content:
                  "You are CareConnectBot, a medical assistant. Only answer health-related questions. Be concise and accurate.",
              },
              ...messages.map((msg) => ({
                role: msg.type === "sent" ? "user" : "assistant",
                content: msg.text,
              })),
              {
                role: "user",
                content: input.trim(),
              },
            ],
            temperature: 0.7,
            max_tokens: 500,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message ||
            `API request failed with status ${response.status}`
        );
      }

      const data = await response.json();
      const botMessage = {
        text: data.choices[0].message.content,
        type: "received",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("API Error:", error);
      setError(error.message);
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I encountered an error. Please try again later.",
          type: "received",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-bot">
      <h1>CareConnectBot</h1>
      {error && <div className="error-message">{error}</div>}

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            {msg.text.split("\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        ))}
        {loading && (
          <div className="message received">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask about health, diseases, or medicine..."
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          aria-label="Send message"
        >
          {loading ? <span className="button-loader"></span> : "Send"}
        </button>
      </div>
    </div>
  );
};

export default AIBot;
