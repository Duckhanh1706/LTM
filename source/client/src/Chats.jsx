import React, { useEffect, useState, useRef } from "react";

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import "./styles/Chats.css";

const ALL_CHATS = gql`
  query allChats {
    getChats {
      id
      name
      message
    }
  }
`;

const CHATS_SUBSCRIPTION = gql`
  subscription OnNewChat {
    messageSent {
      id
      name
      message
    }
  }
`;

const Chats = ({ currentUser }) => {
  const { loading, error, data, subscribeToMore } = useQuery(ALL_CHATS);
  const [chats, setChats] = useState([]);
  const bottomRef = useRef(null); // ref để scroll

  useEffect(() => {
    if (data?.getChats) setChats(data.getChats);

    const unsubscribe = subscribeToMore({
      document: CHATS_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newChat = subscriptionData.data.messageSent;

        setChats((prevChats) => [...prevChats, newChat]);

        return {
          getChats: [...prev.getChats, newChat],
        };
      },
    });

    return () => unsubscribe();
  }, [data, subscribeToMore]);

  // Scroll xuống dưới mỗi khi danh sách chats thay đổi
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error! {error.message}</p>;

  return (
    <div className="chats-wrapper">
      {chats.map((chat) => (
        <div
          key={chat.id}
          className={`chat-message ${
            chat.name === currentUser ? "self" : "other"
          }`}
        >
          <div className="bubble">
            {chat.name !== currentUser && <strong>{chat.name}: </strong>}
            {chat.message}
          </div>
        </div>
      ))}
      <div ref={bottomRef} /> {/* invisible div để scroll tới */}
    </div>
  );
};

export default Chats;