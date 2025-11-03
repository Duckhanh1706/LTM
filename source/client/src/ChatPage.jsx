import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Chats from "./Chats";
import SendMessage from "./SendMessage";

const ChatPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { name } = location.state || {};

  if (!name) {
    navigate("/", { replace: true });
    return null;
  }

  return (
    <div className="chat-page">
      <h2>Hi {name}, welcome to the chat!</h2>
      <div className="chat-container">
        <div className="chat-messages">
          <Chats currentUser={name} />
        </div>
        <div className="send-mess">
          <SendMessage name={name} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
