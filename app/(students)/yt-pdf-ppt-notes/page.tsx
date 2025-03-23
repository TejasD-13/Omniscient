"use client";

import { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input, FileInput } from "@/components/ui/input";

export default function YtPdfPptNotesPage() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleYoutubeUrlChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setYoutubeUrl(event.target.value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleYoutubeSubmit = async () => {
    setIsLoading(true);
    setExplanation('');
    try {
      const response = await fetch('http://127.0.0.1:8000/api/summarize/youtube/v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: youtubeUrl }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setExplanation(data.explanation);
    } catch (error: any) {
      setExplanation(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSubmit = async () => {
    setIsLoading(true);
    setExplanation('');

    if (!selectedFile) {
      setExplanation('Please select a file.');
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('http://127.0.0.1:8000/api/extract/document', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setExplanation(data.explanation);
    } catch (error: any) {
      setExplanation(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">YT, PDF, PPT Notes</h1>

      {/* YouTube URL Input */}
      <div className="mb-4">
        <label htmlFor="youtubeUrl" className="block text-gray-700 text-sm font-bold mb-2">
          YouTube URL:
        </label>
        <Textarea
          id="youtubeUrl"
          placeholder="Enter YouTube URL"
          value={youtubeUrl}
          onChange={handleYoutubeUrlChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <Button onClick={handleYoutubeSubmit} disabled={isLoading} className="mt-2">
          {isLoading ? 'Loading...' : 'Generate Explanation'}
        </Button>
      </div>

      {/* File Upload */}
      <div className="mb-4">
        <label htmlFor="fileUpload" className="block text-gray-700 text-sm font-bold mb-2">
          Upload PDF, PPT, or DOCX File:
        </label>
        <input
          type="file"
          id="fileUpload"
          onChange={handleFileChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <Button onClick={handleFileSubmit} disabled={isLoading} className="mt-2">
          {isLoading ? 'Loading...' : 'Generate Explanation'}
        </Button>
      </div>

      {/* Explanation Display */}
      {explanation && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Explanation:</h2>
          <div className="text-gray-800 border p-4 rounded-md">{explanation}</div>
        </div>
      )}
    </div>
  );
}
