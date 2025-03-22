"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/utils/client";
import { useAuth } from "@/context/UserContext";

const CreateChatRoom = () => {
  const [formData, setFormData] = useState({
    roomName: "",
    topic: "",
    doubt: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const router = useRouter();
  const { user } = useAuth();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (!formData.roomName || !formData.topic || !formData.doubt) {
        throw new Error("All fields are required.");
      }

      const { error } = await supabase.from("chatrooms").insert([
        {
          roomName: formData.roomName,
          topic: formData.topic,
          doubt: formData.doubt,
        },
      ]);

      if (error) throw error;

      setSuccessMessage("Chat room created successfully!");
      router.push("/doubts/all-doubts");
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-cover bg-center min-h-96 pt-20">
      <div className="absolute inset-0"></div>
      <div className="relative flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-2xl w-full bg-opacity-90 rounded-lg p-2 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-3xl">
              Create a Chat Room
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="roomName">Room Name *</Label>
                <Input
                  id="roomName"
                  name="roomName"
                  type="text"
                  placeholder="Enter room name"
                  value={formData.roomName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="topic">Topic *</Label>
                <Input
                  id="topic"
                  name="topic"
                  type="text"
                  placeholder="Enter topic"
                  value={formData.topic}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="doubt">Doubt *</Label>
                <Textarea
                  id="doubt"
                  name="doubt"
                  placeholder="Enter your doubt"
                  value={formData.doubt}
                  onChange={handleInputChange}
                  rows={4}
                  required
                />
              </div>
              {errorMessage && (
                <p className="text-red-500 text-center">{errorMessage}</p>
              )}
              {successMessage && (
                <p className="text-blue-500 text-center">{successMessage}</p>
              )}
              <div className="flex justify-center">
                <Button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-3"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Chat Room"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateChatRoom;
