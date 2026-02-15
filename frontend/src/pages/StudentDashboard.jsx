import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Confetti from "react-confetti";
import { Link } from "react-router-dom";
import { XpContext } from "../XPContext.jsx"; // make sure path is correct
import "./StudentDashboard.css";
import Leaderboard from "./Leaderboard";
const StudentDashboard = () => {
  const [quizSets, setQuizSets] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [lifelineUsed, setLifelineUsed] = useState(false);
  const [activeTab, setActiveTab] = useState("quizzes"); 
  const { xp, addXp, resetXp } = useContext(XpContext);

  // Fetch quizzes
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

  // Apply difficulty filter
  useEffect(() => {
    if (!selectedQuiz) return;

    if (difficultyFilter === "all") setFilteredQuestions(selectedQuiz.questions);
    else
      setFilteredQuestions(
        selectedQuiz.questions.filter((q) => q.difficulty === difficultyFilter)
      );

    setCurrentQuestion(0);
    setSelectedOption("");
    setLifelineUsed(false);
  }, [selectedQuiz, difficultyFilter]);

  // Start quiz
  const startQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setDifficultyFilter("all");
    setCurrentQuestion(0);
    setSelectedOption("");
    setScore(0);
    setShowResult(false);
    setLifelineUsed(false);

  };

  // Option select
  const handleOptionSelect = (opt) => setSelectedOption(opt);

  // Lifeline 50-50
  const useFiftyFifty = () => {
    if (lifelineUsed) return;

    const correct = filteredQuestions[currentQuestion].correctAnswer;
    const options = filteredQuestions[currentQuestion].options;
    const wrongOptions = options.filter((opt) => opt !== correct);
    const reduced = [correct, wrongOptions[Math.floor(Math.random() * wrongOptions.length)]];

    setFilteredQuestions((prev) => {
      const copy = [...prev];
      copy[currentQuestion] = { ...copy[currentQuestion], options: reduced };
      return copy;
    });

    setLifelineUsed(true);
  };

  // Next question
  const handleNext = () => {
    if (selectedOption === filteredQuestions[currentQuestion].correctAnswer) {
      // XP calculation
      let questionXP = 0;
      const difficulty = filteredQuestions[currentQuestion].difficulty;
      if (difficulty === "easy") questionXP = 10;
      else if (difficulty === "medium") questionXP = 20;
      else if (difficulty === "hard") questionXP = 30;

      if (lifelineUsed) questionXP = Math.floor(questionXP / 2);

      addXp(questionXP); // ✅ add XP to context
      setScore((prev) => prev + 1);
    }

    if (currentQuestion + 1 < filteredQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption("");
      setLifelineUsed(false);
    } else {
      setShowResult(true);
       setTimeout(() => {
    setSelectedQuiz(null);
    setShowResult(false);
  }, 3000);
    }
  };

  // Navbar
  const Navbar = () => (
    <nav className="navbar">
      <h2 className="navbar-brand">Student Dashboard</h2>
      <ul className="navbar-links">
        <li>
          {/* Clicking this sets tab back to quizzes and clears selected quiz */}
          <span 
            className={`nav-link ${activeTab === "quizzes" ? "active" : ""}`} 
            onClick={() => {
              setActiveTab("quizzes");
              setSelectedQuiz(null);
            }}
            style={{cursor: 'pointer'}}
          >
            Quiz
          </span>
        </li>
        <li>
          <Link to="/learning" className="nav-link">Learning Materials</Link>
        </li>
        <li>
          <span 
            className={`nav-link ${activeTab === "leaderboard" ? "active" : ""}`} 
            onClick={() => setActiveTab("leaderboard")}
            style={{cursor: 'pointer'}}
          >
            Leaderboard 🏆
          </span>
        </li>
      </ul>
      <div className="xp-display">⭐ Total XP: {xp}</div>
    </nav>
  );

  if (activeTab === "leaderboard") {
    return (
      <div>
        <Navbar />
        <Leaderboard /> 
      </div>
    );
  }

  // Result screen
if (showResult)
  return (
    <div>
      <Navbar />
      <Confetti recycle={false} numberOfPieces={300} />
      <div className="quiz-result">
        <h2>🎉 Quiz Completed! 🎉</h2>
        <p className="score">
          You scored {score} / {filteredQuestions.length}
        </p>
        <p>Returning to dashboard...</p>
      </div>
    </div>
  );


  // Quiz selection
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

  // Quiz question
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
              className={`filter-btn ${difficultyFilter === level ? "active" : ""}`}
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
            <p>Question {currentQuestion + 1} of {filteredQuestions.length}</p>
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

            <div className="quiz-actions">
              <button onClick={useFiftyFifty} disabled={lifelineUsed} className="lifeline-btn">
                50-50 Lifeline
              </button>
              <button
                onClick={handleNext}
                disabled={!selectedOption}
                className="next-button"
              >
                {currentQuestion + 1 === filteredQuestions.length ? "Submit" : "Next"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
