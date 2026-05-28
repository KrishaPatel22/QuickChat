// src/context/ChatContext.jsx
import React, { createContext, useContext, useState, useCallback } from "react";

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [notifications, setNotifications] = useState([]);

  const addMessage = useCallback((message) => {
    setMessages((prev) => {
      // Avoid duplicate messages
      if (prev.find((m) => m._id === message._id)) return prev;
      return [...prev, message];
    });
  }, []);

  const clearMessages = useCallback(() => setMessages([]), []);

  const incrementUnread = useCallback((senderId) => {
    setUnreadCounts((prev) => ({
      ...prev,
      [senderId]: (prev[senderId] || 0) + 1,
    }));
  }, []);

  const clearUnread = useCallback((senderId) => {
    setUnreadCounts((prev) => ({ ...prev, [senderId]: 0 }));
  }, []);

  const addNotification = useCallback((notif) => {
    setNotifications((prev) => [notif, ...prev].slice(0, 10));
  }, []);

  return (
    <ChatContext.Provider
      value={{
        selectedUser,
        setSelectedUser,
        messages,
        setMessages,
        addMessage,
        clearMessages,
        unreadCounts,
        setUnreadCounts,
        incrementUnread,
        clearUnread,
        notifications,
        addNotification,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used inside ChatProvider");
  return ctx;
};