// src/components/Sidebar.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { useChat } from "../context/ChatContext";
import { getUsers, getUnreadCounts } from "../services/api";
import toast from "react-hot-toast";

// Skeleton loader for user list
const UserSkeleton = () => (
  <div className="flex items-center gap-3 p-3">
    <div className="skeleton w-10 h-10 rounded-full" />
    <div className="flex-1 space-y-2">
      <div className="skeleton h-3 w-24 rounded" />
      <div className="skeleton h-3 w-16 rounded" />
    </div>
  </div>
);

export default function Sidebar({ onClose }) {
  const { user, logout } = useAuth();
  const { onlineUsers } = useSocket();
  const { selectedUser, setSelectedUser, unreadCounts, setUnreadCounts, clearUnread } = useChat();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);

  // Load users + unread counts
  useEffect(() => {
    const load = async () => {
      try {
        const [usersRes, unreadRes] = await Promise.all([
          getUsers(search),
          getUnreadCounts(),
        ]);
        setUsers(usersRes.data);
        setUnreadCounts(unreadRes.data);
      } catch {
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(load, search ? 400 : 0);
    return () => clearTimeout(timer);
  }, [search]);

  const handleSelectUser = (u) => {
    setSelectedUser(u);
    clearUnread(u._id);
    onClose?.();
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out!");
  };

  const isOnline = (userId) => onlineUsers.includes(userId);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="glass border-b border-white/20 p-4">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-navy-600 drop-shadow">
            🗪 QuickChat
          </h1>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="relative"
          >
            <img
              src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
              alt={user?.username}
              className="w-9 h-9 rounded-full border-2 border-navy-700 hover:border-navy-400 transition-all cursor-pointer"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white online-pulse" />
          </button>
        </div>

        {/* Profile Dropdown */}
        <AnimatePresence>
          {showProfile && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="glass rounded-xl p-3 mb-3"
            >
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
                  alt={user?.username}
                  className="w-12 h-12 rounded-full border-2 border-navy-700"
                />
                <div>
                  <div className="font-bold text-navy-500">{user?.username}</div>
                  <div className="text-navy-600 text-xs">{user?.email}</div>
                  <div className="text-green-500 text-xs flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    Online
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-center text-red-500 hover:text-red-600 text-sm font-medium py-1 hover:bg-red-200/20 rounded-lg transition-all border border-red-500 cursor-pointer"
              >
                🚪 Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search users..."
          className="input-glass text-navy-900 text-sm"
        />
      </div>

      {/* User list */}
      <div className="flex-1 overflow-y-auto py-2">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <UserSkeleton key={i} />)
        ) : users.length === 0 ? (
          <div className="text-center text-navy-600 py-10 text-sm">
            {search ? "No users found 🔍" : "No other users yet 👤"}
          </div>
        ) : (
          <AnimatePresence>
            {users.map((u, i) => {
              const online = isOnline(u._id);
              const unread = unreadCounts[u._id] || 0;
              const isSelected = selectedUser?._id === u._id;

              return (
                <motion.div
                  key={u._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleSelectUser(u)}
                  className={`flex items-center gap-3 mx-2 p-3 rounded-xl cursor-pointer transition-all duration-200 border border-navy-700 ${
                    isSelected
                      ? "bg-white/40 shadow-lg"
                      : "hover:bg-white/20"
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`}
                      alt={u.username}
                      className="w-10 h-10 rounded-full border-2 border-navy-700"
                    />
                    {online && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-navy-400 online-pulse" />
                    )}
                  </div>

                  {/* Name & status */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-navy-600 text-sm truncate">
                        {u.username}
                      </span>
                      {unread > 0 && (
                        <span className="bg-navy-800 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold flex-shrink-0">
                          {unread > 9 ? "9+" : unread}
                        </span>
                      )}
                    </div>
                    <span className={`text-xs ${online ? "text-green-500" : "text-navy-800"}`}>
                      {online ? "● Online" : "○ Offline"}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* Footer */}
      <div className="glass border-t border-navy-200/20 p-3 text-center">
        <p className="text-navy-600 text-s">
          {onlineUsers.length} user{onlineUsers.length !== 1 ? "s" : ""} online
        </p>
      </div>
    </div>
  );
}