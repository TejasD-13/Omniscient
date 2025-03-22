"use client";

import React, { useState } from 'react';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

const StudyPlanForm = () => {
  const [subjects, setSubjects] = useState('');
  const [timePerDay, setTimePerDay] = useState('');
  const [duration, setDuration] = useState('');
  const [goals, setGoals] = useState('');
  const [studyPlan, setStudyPlan] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!subjects || !timePerDay || !duration || !goals) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch('/api/generateStudyPlan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subjects,
          timePerDay,
          duration,
          goals,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setStudyPlan(data.studyPlan);
      } else {
        console.error('Failed to generate study plan');
        setStudyPlan('Failed to generate study plan. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setStudyPlan('An error occurred. Please try again.');
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Study Plan Generator</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="subjects">Subject(s):</Label>
          <Input
            type="text"
            id="subjects"
            value={subjects}
            onChange={(e) => setSubjects(e.target.value)}
            placeholder="e.g., Math, Physics, Chemistry"
            required
          />
        </div>
        <div>
          <Label htmlFor="timePerDay">Time Per Day (hours):</Label>
          <Input
            type="number"
            id="timePerDay"
            value={timePerDay}
            onChange={(e) => setTimePerDay(e.target.value)}
            placeholder="e.g., 3"
            required
          />
        </div>
        <div>
          <Label htmlFor="duration">Duration (weeks/months):</Label>
          <Input
            type="text"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="e.g., 2 months"
            required
          />
        </div>
        <div>
          <Label htmlFor="goals">Goals:</Label>
          <Textarea
            id="goals"
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            placeholder="e.g., Pass the exam"
            required
          />
        </div>
        <Button type="submit">Generate Study Plan</Button>
      </form>
      {studyPlan && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Generated Study Plan:</h2>
          <pre className="whitespace-pre-wrap">{studyPlan}</pre>
        </div>
      )}
    </div>
  );
};

export default StudyPlanForm;
