// src/pages/ChatPage.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

export default function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex items-center justify-center p-2 md:p-4 relative">
      {/* Animated background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-navy-900/10 translate-x-1/3 translate-y-1/3 blur-3xl pointer-events-none" />

      {/* Main chat container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass-card rounded-2xl md:rounded-3xl w-full h-full max-w-6xl flex overflow-hidden relative"
        style={{ maxHeight: "calc(100vh - 2rem)" }}
      >
        {/* ── Desktop sidebar ── */}
        <div className="hidden md:flex w-72 flex-shrink-0 flex-col border-r border-white/20">
          <Sidebar />
        </div>

        {/* ── Mobile sidebar (drawer) ── */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="md:hidden absolute inset-0 bg-black/30 z-20"
                onClick={() => setSidebarOpen(false)}
              />
              {/* Drawer */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="md:hidden absolute left-0 top-0 bottom-0 w-72 z-30 bg-navy-400/60 backdrop-blur-2xl border-r border-white/20 flex flex-col"
              >
                <Sidebar onClose={() => setSidebarOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ── Chat area ── */}
        <div className="flex-1 flex flex-col min-w-0 relative">
          {/* Mobile topbar */}
          <div className="md:hidden flex items-center gap-3 glass border-b border-white/20 px-4 py-3 flex-shrink-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-navy-700 hover:bg-navy-200 p-2 rounded-xl transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="font-bold text-navy-700">💬 QuickChat</span>
          </div>

          {/* Chat window (messages + input) */}
          <ChatWindow />
        </div>
      </motion.div>
    </div>
  );
}