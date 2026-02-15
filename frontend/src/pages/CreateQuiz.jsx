import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CreateQuiz.css";

const CreateQuiz = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");

  const [questions, setQuestions] = useState([
    {
      questionText: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      difficulty: "easy", // must be lowercase
    },
  ]);

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;

    // If option changed and it was correct answer, reset
    if (updated[qIndex].correctAnswer === value) {
      updated[qIndex].correctAnswer = "";
    }

    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        difficulty: "easy",
      },
    ]);
  };

  const removeQuestion = (index) => {
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
  };

  const validateForm = () => {
    if (!title.trim()) {
      alert("Title is required");
      return false;
    }

    if (!topic.trim()) {
      alert("Topic is required");
      return false;
    }

    if (questions.length === 0) {
      alert("At least one question required");
      return false;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];

      if (!q.questionText.trim()) {
        alert(`Question ${i + 1} text required`);
        return false;
      }

      if (q.options.some((opt) => !opt.trim())) {
        alert(`All 4 options required for Question ${i + 1}`);
        return false;
      }

      if (!q.correctAnswer.trim()) {
        alert(`Select correct answer for Question ${i + 1}`);
        return false;
      }

      if (!["easy", "medium", "hard"].includes(q.difficulty)) {
        alert(`Invalid difficulty for Question ${i + 1}`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const payload = {
        title: title.trim(),
        topic: topic.trim(),
        questions,
      };

      console.log("SENDING:", payload);

      await axios.post("http://localhost:5000/api/questions", payload);

      alert("Quiz Created Successfully!");
      navigate("/teacher");

    } catch (err) {
      console.log("BACKEND ERROR:", err.response?.data);
      alert(JSON.stringify(err.response?.data, null, 2));
    }
  };

  return (
    <div className="create-quiz-container">
      <h1>Create Quiz</h1>

      <input
        type="text"
        placeholder="Quiz Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="text"
        placeholder="Topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />

      {questions.map((q, qIndex) => (
        <div key={qIndex} className="question-box">

          <input
            type="text"
            placeholder="Question"
            value={q.questionText}
            onChange={(e) =>
              handleQuestionChange(qIndex, "questionText", e.target.value)
            }
          />

          {q.options.map((opt, optIndex) => (
            <input
              key={optIndex}
              type="text"
              placeholder={`Option ${optIndex + 1}`}
              value={opt}
              onChange={(e) =>
                handleOptionChange(qIndex, optIndex, e.target.value)
              }
            />
          ))}

          <select
            value={q.correctAnswer}
            onChange={(e) =>
              handleQuestionChange(qIndex, "correctAnswer", e.target.value)
            }
          >
            <option value="">Select Correct Answer</option>
            {q.options.map((opt, i) => (
              <option key={i} value={opt}>
                {opt || `Option ${i + 1}`}
              </option>
            ))}
          </select>

          <select
            value={q.difficulty}
            onChange={(e) =>
              handleQuestionChange(qIndex, "difficulty", e.target.value)
            }
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          {questions.length > 1 && (
            <button onClick={() => removeQuestion(qIndex)}>
              Remove Question
            </button>
          )}
        </div>
      ))}

      <button onClick={addQuestion}>+ Add Question</button>
      <button onClick={handleSubmit}>Submit Quiz</button>
    </div>
  );
};

export default CreateQuiz;