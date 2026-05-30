// src/components/MessageBubble.jsx
import React from "react";
import { motion } from "framer-motion";

const formatTime = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export default function MessageBubble({ message, isMine }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`flex items-end gap-2 ${isMine ? "flex-row-reverse" : "flex-row"} mb-2`}
    >
      {/* Avatar */}
      <img
        src={
          isMine
            ? message.sender?.avatar
            : message.sender?.avatar ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${message.sender?.username}`
        }
        alt={message.sender?.username}
        className="w-7 h-7 rounded-full border-2 border-navy-700 flex-shrink-0 mb-1"
      />

      {/* Bubble */}
      <div className={`max-w-[70%] ${isMine ? "items-end" : "items-start"} flex flex-col`}>
        <div
          className={`px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
            isMine ? "msg-sent" : "msg-received"
          }`}
        >
          {message.content}
        </div>
        <span className="text-navy-800 text-xs mt-1 px-1">
          {formatTime(message.createdAt)}
          {isMine && (
            <span className="ml-1" title={message.isRead ? "Read" : "Delivered"}>
              {message.isRead ? "✓✓" : "✓"}
            </span>
          )}
        </span>
      </div>
    </motion.div>
  );
}