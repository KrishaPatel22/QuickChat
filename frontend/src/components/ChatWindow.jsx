// src/components/ChatWindow.jsx
import React, { useRef, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import EmojiPicker from "emoji-picker-react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { useChat } from "../context/ChatContext";
import { useMessages } from "../hooks/useMessages";
import { useTyping } from "../hooks/useTyping";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

export default function ChatWindow() {
  const { user } = useAuth();
  const { onlineUsers } = useSocket();
  const { selectedUser } = useChat();
  const { messages, send } = useMessages();
  const { isTyping, onInputChange } = useTyping(selectedUser);
  const [input, setInput] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;
    const ok = await send(input);
    if (ok) {
      setInput("");
      setShowEmoji(false);
      inputRef.current?.focus();
    }
  };

  const handleEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
    inputRef.current?.focus();
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    onInputChange();
  };

  const isOnline = onlineUsers.includes(selectedUser?._id);

  if (!selectedUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <div className="text-7xl mb-6 drop-shadow-lg">💬</div>
          <h2 className="text-2xl font-bold text-navy-500 mb-2">
            Start a Conversation
          </h2>
          <p className="text-navy-600">
            Select a user from the sidebar to begin chatting
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Chat header */}
      <div className="glass border-b border-white/20 px-4 py-3 flex items-center gap-3 flex-shrink-0">
        <div className="relative">
          <img
            src={selectedUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.username}`}
            alt={selectedUser.username}
            className="w-10 h-10 rounded-full border-2 border-navy-700"
          />
          {isOnline && (
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
          )}
        </div>
        <div>
          <div className="font-bold text-navy-500">{selectedUser.username}</div>
          <div className={`text-xs ${isOnline ? "text-green-300" : "text-navy-700"}`}>
            {isTyping ? (
              <span className="text-navy-600 animate-pulse">typing...</span>
            ) : isOnline ? (
              "● Online"
            ) : (
              "○ Offline"
            )}
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-white/50"
            >
              <div className="text-4xl mb-2">👋</div>
              <p className="text-sm text-navy-600">
                Say hi to {selectedUser.username}!
              </p>
            </motion.div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble
                key={msg._id}
                message={msg}
                isMine={msg.sender._id === user._id || msg.sender === user._id}
              />
            ))}
            <AnimatePresence>
              {isTyping && (
                <TypingIndicator username={selectedUser.username} />
              )}
            </AnimatePresence>
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Emoji picker */}
      <AnimatePresence>
        {showEmoji && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-20 right-4 z-50 shadow-2xl rounded-2xl overflow-hidden"
          >
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              theme="light"
              height={350}
              width={300}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message input */}
      <div className="glass border-t border-white/20 px-4 py-3 flex-shrink-0 relative">
        <form
          onSubmit={handleSend}
          className="flex items-center gap-2"
        >
          {/* Emoji toggle */}
          <button
            type="button"
            onClick={() => setShowEmoji(!showEmoji)}
            className="text-2xl hover:scale-110 transition-transform flex-shrink-0"
            title="Emoji picker"
          >
            😀
          </button>

          {/* Text input */}
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend(e)}
            placeholder={`Message ${selectedUser.username}...`}
            className="input-glass flex-1 text-navy-900 text-sm"
          />

          {/* Send button */}
          <button
            type="submit"
            disabled={!input.trim()}
            className="btn-primary px-4 py-2.5 rounded-xl flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            title="Send message"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}