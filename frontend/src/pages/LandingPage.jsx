// src/pages/LandingPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const features = [
{ icon: "⚡", title: "Real-Time", desc: "Send and receive messages instantly without any delay" },
{ icon: "🔒", title: "Secure", desc: "Your chats and account stay safe and protected" },
{ icon: "😀", title: "Emoji Support", desc: "Make conversations fun with emojis and reactions" },
{ icon: "📱", title: "Responsive", desc: "Enjoy a smooth chatting experience on any device" },
{ icon: "🟢", title: "Online Status", desc: "See when your friends are online and available" },
{ icon: "✍️", title: "Typing Indicators", desc: "Know when someone is typing a message to you" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-white/10 -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-navy-900/20 translate-x-1/3 translate-y-1/3 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="glass-card rounded-3xl p-10 max-w-4xl w-full text-center"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-6xl mb-4 bg-gradient-to-br from-navy-700 via-navy-500 to-white bg-clip-text text-transparent drop-shadow-lg"
        >
          🗪 
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-5xl font-bold text-navy-700 mb-3 drop-shadow"
        >
          Quick<span className="text-navy-500">CHAT</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-navy-700 text-lg mb-10 max-w-xl mx-auto"
        >
          A beautiful, real-time messaging platform. Connect, chat, and share
          moments — all in your browser.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex gap-4 justify-center mb-12 flex-wrap"
        >
          <Link to="/signup">
            <button className="btn-primary text-lg px-8 py-4 rounded-2xl">
              Get Started Free ➜
            </button>
          </Link>
          <Link to="/login">
            <button className="px-8 py-4 rounded-2xl font-semibold text-navy-600 border border-navy-600 hover:bg-white/20 transition-all duration-200 text-lg cursor-pointer">
              Sign In
            </button>
          </Link>
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="glass rounded-2xl p-4 text-left hover:bg-white/30 transition-all duration-200"
            >
              <div className="text-2xl mb-2">{f.icon}</div>
              <div className="font-bold text-navy-600 text-sm">{f.title}</div>
              <div className="text-navy-700 text-xs mt-1">{f.desc}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-white/50 text-sm mt-6"
      >
        Built with React · Node.js · Socket.IO · MongoDB
      </motion.p>
    </div>
  );
}