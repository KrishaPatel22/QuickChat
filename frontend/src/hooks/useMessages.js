// src/hooks/useMessages.js
import { useEffect, useCallback, useRef } from "react";
import { useSocket } from "../context/SocketContext";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";
import { getMessages, sendMessage, markMessagesRead } from "../services/api";
import toast from "react-hot-toast";

export const useMessages = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const {
    selectedUser,
    messages,
    setMessages,
    addMessage,
    incrementUnread,
    clearUnread,
    addNotification,
  } = useChat();

  // Ref to track current selected user for socket events
  const selectedUserRef = useRef(selectedUser);
  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  // Load messages when selected user changes
  useEffect(() => {
    if (!selectedUser) return;
    const load = async () => {
      try {
        const { data } = await getMessages(selectedUser._id);
        setMessages(data);
        clearUnread(selectedUser._id);
        await markMessagesRead(selectedUser._id);
      } catch (err) {
        toast.error("Failed to load messages");
      }
    };
    load();
  }, [selectedUser]);

  // Socket: receive new messages
  useEffect(() => {
    if (!socket) return;

    const handleReceive = (message) => {
      const isFromSelected =
        selectedUserRef.current?._id === message.sender._id;

      if (isFromSelected) {
        addMessage(message);
        // Mark as read immediately
        markMessagesRead(message.sender._id).catch(() => {});
      } else {
        // Increment unread count for other users
        incrementUnread(message.sender._id);
      }
    };

    const handleNotification = (notif) => {
      const isFromSelected =
        selectedUserRef.current?._id === notif.senderId;
      if (!isFromSelected) {
        addNotification(notif);
        toast(`💬 ${notif.senderName}: ${notif.content}`, {
          icon: "💬",
          duration: 3000,
        });
        // Play notification sound
        try {
          const audio = new Audio(
            "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAA..."
          );
          audio.volume = 0.3;
          audio.play().catch(() => {});
        } catch (e) {}
      }
    };

    socket.on("message:receive", handleReceive);
    socket.on("notification:new", handleNotification);

    return () => {
      socket.off("message:receive", handleReceive);
      socket.off("notification:new", handleNotification);
    };
  }, [socket, addMessage, incrementUnread, addNotification]);

  // Send message
  const send = useCallback(
    async (content) => {
      if (!selectedUser || !content.trim()) return;
      try {
        const { data } = await sendMessage({
          receiverId: selectedUser._id,
          content: content.trim(),
        });
        addMessage(data);
        // Emit to socket for real-time delivery
        socket?.emit("message:send", {
          message: data,
          receiverId: selectedUser._id,
        });
        return true;
      } catch (err) {
        toast.error("Failed to send message");
        return false;
      }
    },
    [selectedUser, socket, addMessage]
  );

  return { messages, send };
};