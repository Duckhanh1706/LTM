import React, { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import "./styles/SendMessage.css"; // import CSS

// Mutation gửi tin nhắn
const SEND_MESSAGE = gql`
  mutation createChat($name: String!, $message: String!) {
    createChat(name: $name, message: $message) {
      id
      name
      message
    }
  }
`;

// Fragment để cache Apollo biết cấu trúc dữ liệu
const CHAT_FRAGMENT = gql`
  fragment NewChat on Chat {
    id
    name
    message
  }
`;

const SendMessage = ({ name }) => {
  const [input, setInput] = useState("");

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    // update cache sau khi gửi message
    update(cache, { data: { createChat } }) {
      cache.modify({
        fields: {
          getChats(existingChats = []) {
            const newChatRef = cache.writeFragment({
              data: createChat,
              fragment: CHAT_FRAGMENT,
            });
            return [...existingChats, newChatRef];
          },
        },
      });
    },
  });

  const handleSend = () => {
    if (!input) return;
    sendMessage({ variables: { name, message: input } });
    setInput(""); // reset input sau khi gửi
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="send-message">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type a message..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default SendMessage;
