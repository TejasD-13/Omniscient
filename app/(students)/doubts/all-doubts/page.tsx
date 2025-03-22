"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/utils/client";

const ChatRooms = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchChatRooms = async () => {
      const { data, error } = await supabase.from("chatrooms").select("*");
      if (error) {
        setErrorMessage("Failed to fetch chat rooms.");
      } else {
        setChatRooms(data);
      }
      setLoading(false);
    };
    fetchChatRooms();
  }, []);

  return (
    <div className="relative bg-cover bg-center min-h-96 pt-20">
      <div className="absolute inset-0"></div>
      <div className="relative flex flex-col items-center min-h-screen p-4">
        <Card className="max-w-5xl w-full bg-opacity-90 rounded-lg p-4 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold">Chat Rooms</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-lg font-semibold">Loading chat rooms...</p>
            ) : errorMessage ? (
              <p className="text-red-500 text-center text-lg">{errorMessage}</p>
            ) : chatRooms.length === 0 ? (
              <p className="text-center text-lg">No chat rooms available.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {chatRooms.map((room) => (
                  <Card
                    key={room.id}
                    className="p-6 border shadow-md rounded-xl bg-white hover:shadow-lg transition duration-300 cursor-pointer"
                    onClick={() => router.push(`/doubts/${room.room_id}/chat`)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl font-bold text-gray-800">{room.roomName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm"><span className="font-semibold">Topic:</span> {room.topic}</p>
                      <p className="text-gray-700 text-sm mt-2"><span className="font-semibold">Doubt:</span> {room.doubt}</p>
                      <Button className="mt-4 w-full bg-blue-500 text-white hover:bg-blue-600 transition">Join Room</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatRooms;
