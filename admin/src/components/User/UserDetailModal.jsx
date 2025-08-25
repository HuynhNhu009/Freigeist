import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";

export default function UserDetailModal({ user, onClose, onUpdated }) {
  const [loading, setLoading] = useState(false);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const toggleBlockUser = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      await axios.patch(
        `http://127.0.0.1:8888/api/users/${user.id}/`,
        { user_isBlocked: !user.user_isBlocked },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);
      if (onUpdated) onUpdated(); // reload danh sách ở UserList
      onClose();
      window.location.reload(); // reload trang để cập nhật danh sách
    } catch (err) {
      console.error("Error updating user:", err);
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {user && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[9999]"
          onClick={handleOverlayClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative bg-white p-6 rounded-2xl shadow-xl w-96"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>

            <h2 className="text-xl font-bold mb-4 text-center">User Detail</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Name:</strong> {user.user_fullname || user.name}</p>
              <p><strong>Email:</strong> {user.user_email || user.email}</p>
              <p><strong>Gender:</strong> {user.user_gender || user.gender}</p>
              <p><strong>Date of Birth:</strong> {user.user_dob}</p>
              <p><strong>Interests:</strong> {user.user_interests || "N/A"}</p>
              <p>
                <strong>Status:</strong>{" "}
                {user.user_isBlocked ? (
                  <span className="text-red-500 font-semibold">Blocked</span>
                ) : (
                  <span className="text-green-600 font-semibold">Active</span>
                )}
              </p>
            </div>

            <div className="flex justify-between mt-6">
              <button
                className="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                onClick={onClose}
              >
                Close
              </button>

              <button
                className={`px-5 py-2 rounded-lg text-white ${
                  user.user_isBlocked
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
                onClick={toggleBlockUser}
                disabled={loading}
              >
                {loading
                  ? "Processing..."
                  : user.user_isBlocked
                  ? "Unblock"
                  : "Block"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
