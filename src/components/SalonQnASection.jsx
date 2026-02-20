import React, { useState } from 'react';
import { motion } from 'framer-motion';

const questions = [
  'Do you offer discounts or is price negotiable?',
  'Can I choose my own staff member/specific stylist?',
  'Where are you located / Do you service my area?',
  'What are your opening hours?',
  'Do you offer at-home services?',
  'What hair types and conditions do you specialize in?',
  'Do you use Kevin Murphy exclusively or other brands?',
  'How far in advance should I book an appointment?'
];

export default function SalonQnASection() {
  const [selected, setSelected] = useState([]);

  const toggleQuestion = (index) => {
    setSelected((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const handleGetAnswers = () => {
    if (selected.length === 0) return;

    const selectedQuestions = selected.map((i) => questions[i]).join('\n• ');
    const message = encodeURIComponent(
      `Hi, I have the following questions:\n\n• ${selectedQuestions}\n\nPlease help me with answers. Thank you!`
    );

    window.open(
      `https://wa.me/?text=${message}`,
      '_blank'
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white p-8 rounded-lg border border-neutral-200 max-w-2xl mx-auto"
    >
      <h3 className="font-serif text-2xl text-neutral-900 mb-2">
        What would you like to know?
      </h3>
      <p className="text-neutral-500 text-sm mb-8">
        Everything you need can be answered here. Select the boxes below and our staff will respond.
      </p>

      <div className="space-y-3 mb-8">
        {questions.map((question, index) => (
          <label
            key={index}
            className="flex items-start gap-3 p-4 rounded-lg border border-neutral-200 hover:bg-neutral-50 cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              checked={selected.includes(index)}
              onChange={() => toggleQuestion(index)}
              className="mt-1 w-5 h-5 cursor-pointer"
            />
            <span className="text-neutral-700 text-sm leading-relaxed">
              {question}
            </span>
          </label>
        ))}
      </div>

      <button
        onClick={handleGetAnswers}
        disabled={selected.length === 0}
        className="w-full bg-neutral-900 text-white py-4 px-6 text-[11px] tracking-[0.25em] uppercase font-medium hover:bg-neutral-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
      >
        {selected.length > 0
          ? `Get Answers (${selected.length} selected)`
          : 'Select questions to continue'}
      </button>

      <p className="text-center text-neutral-500 text-xs mt-4">
        ✓ Our staff is available and ready to respond 24/7
      </p>
    </motion.div>
  );
}
