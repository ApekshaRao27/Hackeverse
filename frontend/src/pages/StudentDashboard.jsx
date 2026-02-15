import { useState, useEffect } from "react";
import axios from "axios";
import Confetti from "react-confetti";
import "./StudentDashboard.css"; 
import { Link } from "react-router-dom";
const StudentDashboard = () => {
  const [quizSets, setQuizSets] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [filteredQuestions, setFilteredQuestions] = useState([]);

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

  // Apply difficulty filter when quiz or filter changes
  useEffect(() => {
    if (!selectedQuiz) return;

    if (difficultyFilter === "all") setFilteredQuestions(selectedQuiz.questions);
    else
      setFilteredQuestions(
        selectedQuiz.questions.filter((q) => q.difficulty === difficultyFilter)
      );
    
    setCurrentQuestion(0);
    setSelectedOption("");
  }, [selectedQuiz, difficultyFilter]);

  if (!quizSets) return <div>Loading...</div>;

  const startQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setDifficultyFilter("all");
    setCurrentQuestion(0);
    setSelectedOption("");
    setScore(0);
    setShowResult(false);
  };

  const handleOptionSelect = (opt) => setSelectedOption(opt);

  const handleNext = () => {
    if (selectedOption === filteredQuestions[currentQuestion].correctAnswer) {
      setScore((prev) => prev + 1);
    }

    if (currentQuestion + 1 < filteredQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption("");
    } else {
      setShowResult(true);
    }
  };

  const Navbar = () => (
    <nav className="navbar">
      <h2 className="navbar-brand">Student Dashboard</h2>
      <ul className="navbar-links">
        <li>
          <Link to="/student-dashboard" className="nav-link">
            Quiz
          </Link>
        </li>
        <Link to="/learning" className="nav-link">
  Learning Materials
</Link>

        <li>
          <Link to="/" className="nav-link">
            Profile
          </Link>
        </li>
      </ul>
    </nav>
  );

  // ===== Result Screen =====
  if (showResult)
    return (
      <div>
        <Navbar />
        <Confetti recycle={false} numberOfPieces={300} />
        <div className="quiz-result">
          <h2>🎉 Congratulations! 🎉</h2>
          <p className="score">
            You scored {score} / {filteredQuestions.length}
          </p>
          <button
  className="next-button"
  onClick={() => {
    setSelectedQuiz(null);
    setCurrentQuestion(0);
    setSelectedOption("");
    setScore(0);
    setShowResult(false);
  }}
>
  Back to Quiz
</button>

        </div>
      </div>
    );

  // ===== Quiz Selection =====
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

  const question = filteredQuestions[currentQuestion];

  return (
    <div>
      <Navbar />
      <div className="quiz-container">
        <h2>{selectedQuiz.title}</h2>

        {/* Difficulty Filter */}
        <div className="difficulty-filter">
          <span>Filter by difficulty: </span>
          {["all", "easy", "medium", "hard"].map((level) => (
            <button
              key={level}
              className={`filter-btn ${
                difficultyFilter === level ? "active" : ""
              }`}
              onClick={() => setDifficultyFilter(level)}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>

        {filteredQuestions.length === 0 ? (
          <p>No questions for this difficulty</p>
        ) : (
          <>
            <p>
              Question {currentQuestion + 1} of {filteredQuestions.length}
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
              onClick={handleNext}
              disabled={!selectedOption}
              className="next-button"
            >
              {currentQuestion + 1 === filteredQuestions.length
                ? "Submit"
                : "Next"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
