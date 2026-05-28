// src/components/TypingIndicator.jsx
import React from "react";
import { motion } from "framer-motion";

export default function TypingIndicator({ username }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      className="flex items-end gap-2 mb-2"
    >
      <div className="msg-received px-4 py-3 flex items-center gap-1.5">
        <span className="text-xs text-sky-500 mr-1">{username}</span>
        <div className="typing-dot" />
        <div className="typing-dot" />
        <div className="typing-dot" />
      </div>
    </motion.div>
  );
}