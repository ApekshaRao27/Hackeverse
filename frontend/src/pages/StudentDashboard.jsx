import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  const navigate = useNavigate();

  const [quizSets, setQuizSets] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const [xp, setXp] = useState(120);
  const [streak] = useState(4);

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
      setXp((prev) => prev + 10); // XP reward
    }

    if (currentQuestion + 1 < selectedQuiz.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption("");
    } else {
      setShowResult(true);
    }
  };

  const handleBattle = () => {
    navigate("/battle");
  };

  // NAVBAR
  const Navbar = () => (
    <nav className="navbar">
      <h2 className="navbar-brand">🚀 QuizMaster</h2>
      <ul className="navbar-links">
        <li>Quizzes</li>
        <li>Leaderboard</li>
        <li>Profile</li>
      </ul>
    </nav>
  );

  /* ========================= */
  /* QUIZ RESULT */
  /* ========================= */
  if (showResult)
    return (
      <div>
        <Navbar />
        <div className="quiz-container">
          <h2>{selectedQuiz.title}</h2>
          <p className="result-score">
            🎯 Your Score: {score} / {selectedQuiz.questions.length}
          </p>
          <button className="primary-btn" onClick={() => setSelectedQuiz(null)}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );

  /* ========================= */
  /* QUIZ VIEW */
  /* ========================= */
  if (selectedQuiz) {
    const question = selectedQuiz.questions[currentQuestion];

    return (
      <div>
        <Navbar />
        <div className="quiz-container">
          <h2>{selectedQuiz.title}</h2>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${
                  ((currentQuestion + 1) /
                    selectedQuiz.questions.length) *
                  100
                }%`,
              }}
            ></div>
          </div>

          <p>
            Question {currentQuestion + 1} of{" "}
            {selectedQuiz.questions.length}
          </p>

          <h3>{question.questionText}</h3>

          <ul className="options-list">
            {question.options.map((opt) => (
              <li key={opt}>
                <button
                  className={`option-button ${
                    selectedOption === opt ? "selected" : ""
                  }`}
                  onClick={() => handleOptionSelect(opt)}
                >
                  {opt}
                </button>
              </li>
            ))}
          </ul>

          <button
            className="primary-btn"
            onClick={handleNext}
            disabled={!selectedOption}
          >
            {currentQuestion + 1 === selectedQuiz.questions.length
              ? "Submit"
              : "Next"}
          </button>
        </div>
      </div>
    );
  }

  /* ========================= */
  /* DASHBOARD VIEW */
  /* ========================= */
  return (
    <div>
      <Navbar />

      <div className="dashboard-container">
        {/* XP Section */}
        <div className="xp-card">
          <h3>🔥 {streak} Day Streak</h3>
          <p>Total XP: {xp}</p>
          <div className="xp-bar">
            <div
              className="xp-fill"
              style={{ width: `${xp % 100}%` }}
            ></div>
          </div>
        </div>

        {/* Battle Section */}
        <div className="battle-card">
          <h2>⚔️ Battle Mode</h2>
          <p>Compete with students in real-time quiz battles!</p>
          <button className="battle-btn" onClick={handleBattle}>
            Enter Battle
          </button>
        </div>

        {/* Quiz List */}
        <div className="quiz-list">
          <h2>📚 Available Quizzes</h2>
          <div className="quiz-grid">
            {quizSets.map((q) => (
              <div
                key={q._id}
                className="quiz-card"
                onClick={() => startQuiz(q)}
              >
                <h3>{q.title}</h3>
                <p>Topic: {q.topic}</p>
                <p>{q.questions.length} Questions</p>
                <span className="start-label">Start →</span>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="leaderboard">
          <h2>🏆 Leaderboard</h2>
          <ul>
            <li>1️⃣ Rahul - 890 XP</li>
            <li>2️⃣ Ananya - 850 XP</li>
            <li>3️⃣ Vikram - 820 XP</li>
            <li>4️⃣ You - {xp} XP</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;