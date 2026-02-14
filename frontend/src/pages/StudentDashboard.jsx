import { useState, useEffect } from "react";
import axios from "axios";
import "./StudentDashboard.css"; // make a CSS file for styling

const StudentDashboard = () => {
  const [quizSets, setQuizSets] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/questions");
        setQuizSets(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuizzes();
  }, []);

  if (!quizSets) return <div>Loading...</div>;

  const startQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestion(0);
    setSelectedOption("");
    setScore(0);
    setShowResult(false);
  };

  const handleOptionSelect = (opt) => setSelectedOption(opt);

  const handleNext = () => {
    if (selectedOption === selectedQuiz.questions[currentQuestion].correctAnswer) {
      setScore((prev) => prev + 1);
    }

    if (currentQuestion + 1 < selectedQuiz.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption("");
    } else {
      setShowResult(true);
    }
  };

  // NAVBAR
  const Navbar = () => (
    <nav className="navbar">
      <h2 className="navbar-brand">Student Dashboard</h2>
      <ul className="navbar-links">
        <li>Quizzes</li>
        <li>Learning Materials</li>
        <li>Profile</li>
      </ul>
    </nav>
  );

  if (!selectedQuiz)
    return (
      <div>
        <Navbar />
        <div className="quiz-list">
          <h2>Available Quizzes</h2>
          {quizSets.map((q) => (
            <div key={q._id} className="quiz-card" onClick={() => startQuiz(q)}>
              <h3>{q.title}</h3>
              <p>Topic: {q.topic}</p>
              <p>Questions: {q.questions.length}</p>
            </div>
          ))}
        </div>
      </div>
    );

  if (showResult)
    return (
      <div>
        <Navbar />
        <div className="quiz-container">
          <h2>{selectedQuiz.title}</h2>
          <p>
            Your Score: {score} / {selectedQuiz.questions.length}
          </p>
          <button onClick={() => setSelectedQuiz(null)}>Back to Quizzes</button>
        </div>
      </div>
    );

  const question = selectedQuiz.questions[currentQuestion];

  return (
    <div>
      <Navbar />
      <div className="quiz-container">
        <h2>{selectedQuiz.title}</h2>
        <p>
          Question {currentQuestion + 1} of {selectedQuiz.questions.length}
        </p>
        <h3>{question.questionText}</h3>
        <ul className="options-list">
          {question.options.map((opt) => (
            <li key={opt}>
              <button
                className={`option-button ${selectedOption === opt ? "selected" : ""}`}
                onClick={() => handleOptionSelect(opt)}
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
        <button onClick={handleNext} disabled={!selectedOption}>
          {currentQuestion + 1 === selectedQuiz.questions.length ? "Submit" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default StudentDashboard;