import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { isAuthenticated } = useContext(Context);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/v1/message/getmessage",
          { withCredentials: true }
        );
        setMessages(data.messages);
      } catch (error) {
        console.log(error.response?.data?.message || "Error fetching messages");
        toast.error("Failed to load messages.");
      }
    };
    fetchMessages();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  // Inline styles
  const pageStyle = {
    padding: "40px",
    backgroundColor: "#f5f7fa",
    fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
  };

  const headingStyle = {
    textAlign: "center",
    marginBottom: "30px",
    color: "#333",
  };

  const bannerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    alignItems: "center",
  };

  const cardStyle = {
    backgroundColor: "#ffffff",
    border: "1px solid #ddd",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.06)",
    padding: "24px",
    maxWidth: "600px",
    width: "100%",
    transition: "transform 0.2s ease-in-out",
  };

  const detailsStyle = {
    margin: "10px 0",
    fontWeight: 500,
  };

  const spanStyle = {
    fontWeight: 400,
    color: "#555",
  };

  const messageBoxStyle = {
    backgroundColor: "#f1f1f1",
    padding: "12px",
    borderLeft: "4px solid #007bff",
    borderRadius: "8px",
    marginTop: "10px",
  };

  return (
    <section style={pageStyle}>
      <h1 style={headingStyle}>MESSAGE</h1>
      <div style={bannerStyle}>
        {messages && messages.length > 0 ? (
          messages.map((element) => (
            <div style={cardStyle} key={element._id}>
              <div>
                <p style={detailsStyle}>
                  First Name: <span style={spanStyle}>{element.firstName}</span>
                </p>
                <p style={detailsStyle}>
                  Last Name: <span style={spanStyle}>{element.lastName}</span>
                </p>
                <p style={detailsStyle}>
                  Email: <span style={spanStyle}>{element.email}</span>
                </p>
                <p style={detailsStyle}>
                  Phone: <span style={spanStyle}>{element.phone}</span>
                </p>
                <p style={{ ...detailsStyle, ...messageBoxStyle }}>
                  Message: <span style={spanStyle}>{element.message}</span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <h1>No Messages!</h1>
        )}
      </div>
    </section>
  );
};

export default Messages;
