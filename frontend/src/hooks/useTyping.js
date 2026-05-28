// src/hooks/useTyping.js
import { useState, useEffect, useRef, useCallback } from "react";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";

export const useTyping = (selectedUser) => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [isTyping, setIsTyping] = useState(false);   // remote user typing
  const typingTimerRef = useRef(null);
  const isEmittingRef = useRef(false);

  // Listen for remote typing events
  useEffect(() => {
    if (!socket || !selectedUser) return;

    const onStart = ({ senderId }) => {
      if (senderId === selectedUser._id) setIsTyping(true);
    };
    const onStop = ({ senderId }) => {
      if (senderId === selectedUser._id) setIsTyping(false);
    };

    socket.on("typing:start", onStart);
    socket.on("typing:stop", onStop);
    return () => {
      socket.off("typing:start", onStart);
      socket.off("typing:stop", onStop);
    };
  }, [socket, selectedUser]);

  // Emit typing events
  const onInputChange = useCallback(() => {
    if (!socket || !selectedUser || !user) return;

    if (!isEmittingRef.current) {
      isEmittingRef.current = true;
      socket.emit("typing:start", {
        senderId: user._id,
        receiverId: selectedUser._id,
      });
    }

    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      isEmittingRef.current = false;
      socket.emit("typing:stop", {
        senderId: user._id,
        receiverId: selectedUser._id,
      });
    }, 1500);
  }, [socket, selectedUser, user]);

  return { isTyping, onInputChange };
};