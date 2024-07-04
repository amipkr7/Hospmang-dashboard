import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import './AIBot.css';

const AIBot = () => {
  const MODEL_NAME = 'gemini-1.0-pro';
  const API_KEY = 'AIzaSyCOgQzCvfG5btY7BDnK5faw_7rEUSAPVa0';
  const GENERATION_CONFIG = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };
  const SAFETY_SETTINGS = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  ];

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chat, setChat] = useState(null);

  useEffect(() => {
    const initChat = async () => {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });

      const newChat = model.startChat({
        generationConfig: GENERATION_CONFIG,
        safetySettings: SAFETY_SETTINGS,
        history: [],
      });

      setChat(newChat);

      try {
        const initialQuery = "your name is CareConnectBot you only answer medical, hospital, diseases, and related queries.";
        await newChat.sendMessage(initialQuery);
      } catch (error) {
        console.error('Error sending initial query:', error.message);
      }
    };

    initChat();
  }, []);

  const handleSendMessage = async () => {
    if (newMessage.trim() && chat) {
      const userMessage = { text: newMessage, type: 'sent' };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setNewMessage('');

      try {
        const result = await chat.sendMessage(newMessage);
        if (result.error) {
          console.error('AI Error:', result.error.message);
          return;
        }
        const response = await result.response.text();
        const botMessage = { text: response, type: 'received' };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        console.error('An error occurred:', error.message);
      }
    }
  };

  return (
    <div className="container m-top">
      <h1 className="title m-top">CareConnectBot</h1>
      <div className="chat-box">
        <ul>
          {messages.map((message, index) => (
            <li key={index} className={`message ${message.type}`}>
              <div className="message-content">
                {message.text}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="input-area">
        <input
          type="text"
          className="input-box"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
        />
        <button className="send-button" onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default AIBot;
