"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/utils/client";

const ChatPage = () => {
  const staticRoomId = "4c856711-66d4-4f2e-97e7-094606455fc4"; // Static room_id
  const [messages, setMessages] = useState([]); // State to store messages
  const [newMessage, setNewMessage] = useState(""); // State for the new message input
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State to handle errors

  // Fetch messages for the static room_id
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("message")
        .select("*")
        .eq("room_id", staticRoomId) // Use static room_id
        .order("created_at", { ascending: true }); // Fetch messages in chronological order

      if (error) {
        setErrorMessage("Failed to fetch messages.");
      } else {
        setMessages(data);
      }
      setLoading(false);
    };

    fetchMessages();

    // Set up real-time subscription for new messages
    const subscription = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "message", filter: `room_id=eq.${staticRoomId}` },
        (payload) => {
          setMessages((prevMessages) => [...prevMessages, payload.new]); // Append new message
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription); // Clean up subscription
    };
  }, [staticRoomId]);

  // Function to send a new message
  const sendMessage = async () => {
    if (!newMessage.trim()) return; // Ignore empty messages

    const { error } = await supabase
      .from("message")
      .insert([
        {
          room_id: staticRoomId, // Use static room_id
          body: newMessage,
          sendername: "User", // Replace with actual sender name (e.g., from user session)
          created_at: new Date().toISOString(),
        },
      ]);

    if (error) {
      setErrorMessage("Failed to send message.");
    } else {
      setNewMessage(""); // Clear the input field
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4">
      {/* Chat Header */}
      <div className="bg-white p-4 rounded-t-lg shadow">
        <h1 className="text-xl font-bold">Chat Room: {staticRoomId}</h1>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <p className="text-center">Loading messages...</p>
        ) : errorMessage ? (
          <p className="text-red-500 text-center">{errorMessage}</p>
        ) : messages.length === 0 ? (
          <p className="text-center">No messages yet. Start the conversation!</p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sendername === "User" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg ${
                  message.sendername === "User"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <p className="text-sm">{message.body}</p>
                <p className="text-xs mt-1 text-gray-400">
                  {message.sendername} • {new Date(message.created_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <div className="bg-white p-4 rounded-b-lg shadow">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;