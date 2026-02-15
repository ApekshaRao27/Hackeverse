import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Confetti from "react-confetti";
import { Link } from "react-router-dom";
import { XpContext } from "../XPContext.jsx";
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
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
const [aiDifficulty, setAiDifficulty] = useState("medium");
const [aiCount, setAiCount] = useState(5);



  const { xp, addXp } = useContext(XpContext);

  // Fetch existing quizzes
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
  if (!selectedQuiz || !selectedQuiz.questions) return;

  // If questions don't have difficulty, skip filtering
  const hasDifficulty =
    selectedQuiz.questions.length > 0 &&
    selectedQuiz.questions[0].difficulty;

  if (!hasDifficulty || difficultyFilter === "all") {
    setFilteredQuestions(selectedQuiz.questions);
  } else {
    setFilteredQuestions(
      selectedQuiz.questions.filter(
        (q) => q.difficulty === difficultyFilter
      )
    );
  }

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

  // 🔥 Generate AI Quiz
 // 🔥 Generate AI Quiz (FINAL FIXED VERSION)
// 🔥 Generate AI Quiz (DEBUG VERSION)
const generateAIQuiz = async () => {

  if (!aiTopic.trim()) {
  alert("Please enter a topic first");
  return;
}

  try {
    setLoadingAI(true);
    console.log("1. Requesting AI Quiz..."); // LOG 1

    const res = await axios.post(
      "http://localhost:5000/api/ai-quiz",
      {
       topic: aiTopic,
    difficulty: aiDifficulty,
    count: aiCount,
      }
    );

    console.log("2. Backend Response:", res.data); // LOG 2 - Check if this matches Postman

    // 🛠 Add difficulty field if missing
    const questionsWithDifficulty = res.data.questions.map((q) => ({
      ...q,
      difficulty: q.difficulty || "medium"
    }));

    const formattedQuiz = {
      title: res.data.title || "AI Generated Quiz",
      topic: res.data.topic || "AI Topic",
      questions: questionsWithDifficulty,
    };

    console.log("3. Formatted Quiz Object:", formattedQuiz); // LOG 3 - Is questions empty?

    // Reset everything cleanly
    setSelectedQuiz(formattedQuiz);
    setDifficultyFilter("all");
    setCurrentQuestion(0);
    setSelectedOption("");
    setScore(0);
    setShowResult(false);
    setLifelineUsed(false);

    console.log("4. All states updated!"); // LOG 4

  } catch (err) {
    console.error("AI Quiz Error:", err);
    alert("Failed to generate AI quiz");
  } finally {
    setLoadingAI(false);
  }
};


  const handleOptionSelect = (opt) => setSelectedOption(opt);

  const useFiftyFifty = () => {
    if (lifelineUsed) return;

    const correct =
      filteredQuestions[currentQuestion].correctAnswer;
    const options =
      filteredQuestions[currentQuestion].options;

    const wrongOptions = options.filter(
      (opt) => opt !== correct
    );

    const reduced = [
      correct,
      wrongOptions[Math.floor(Math.random() * wrongOptions.length)],
    ];

    setFilteredQuestions((prev) => {
      const copy = [...prev];
      copy[currentQuestion] = {
        ...copy[currentQuestion],
        options: reduced,
      };
      return copy;
    });

    setLifelineUsed(true);
  };

  const handleNext = () => {
    if (
      selectedOption ===
      filteredQuestions[currentQuestion].correctAnswer
    ) {
      let questionXP = 20;
      if (lifelineUsed) questionXP = Math.floor(questionXP / 2);
      addXp(questionXP);
      setScore((prev) => prev + 1);
    }

    if (currentQuestion + 1 < filteredQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption("");
      setLifelineUsed(false);
    } else {
      setShowResult(true);

      // Auto return to dashboard
      setTimeout(() => {
        setSelectedQuiz(null);
        setShowResult(false);
      }, 3000);
    }
  };

  const Navbar = () => (
    <nav className="navbar">
      <h2>Student Dashboard</h2>
      <ul className="navbar-links">
        <li>
          <span
            className={`nav-link ${
              activeTab === "quizzes" ? "active" : ""
            }`}
            onClick={() => {
              setActiveTab("quizzes");
              setSelectedQuiz(null);
            }}
          >
            Quiz
          </span>
        </li>
        <li>
          <Link to="/learning" className="nav-link">
            Learning Materials
          </Link>
        </li>
        <li>
          <span
            className={`nav-link ${
              activeTab === "leaderboard" ? "active" : ""
            }`}
            onClick={() => setActiveTab("leaderboard")}
          >
            Leaderboard 🏆
          </span>
        </li>
      </ul>
      <div className="xp-display">⭐ XP: {xp}</div>
    </nav>
  );

  if (activeTab === "leaderboard") {
    return (
      <>
        <Navbar />
        <Leaderboard />
      </>
    );
  }

  if (showResult) {
    return (
      <>
        <Navbar />
        <Confetti recycle={false} numberOfPieces={300} />
        <div className="quiz-result">
          <h2>🎉 Quiz Completed!</h2>
          <p>
            You scored {score} / {filteredQuestions.length}
          </p>
          <p>Returning to dashboard...</p>
        </div>
      </>
    );
  }

  if (!selectedQuiz) {
  return (
    <>
      <Navbar />
      <div className="quiz-list">
        <h2>Available Quizzes</h2>

        <div className="ai-input-section">
          
          <input
            type="text"
            placeholder="Enter topic (e.g. DBMS, OS, Java)"
            value={aiTopic}
            onChange={(e) => setAiTopic(e.target.value)}
            className="ai-input"
          />

          <select
            value={aiDifficulty}
            onChange={(e) => setAiDifficulty(e.target.value)}
            className="ai-select"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <input
            type="number"
            value={aiCount}
            min="1"
            max="10"
            onChange={(e) => setAiCount(Number(e.target.value))}
            className="ai-count-input"
          />

          <button
            className="ai-generate-btn"
            onClick={generateAIQuiz}
            disabled={loadingAI || !aiTopic}
          >
            {loadingAI ? "🤖 Generating..." : "✨ Generate AI Quiz"}
          </button>

        </div>

        {quizSets.map((q) => (
          <div
            key={q._id}
            className="quiz-card"
            onClick={() => startQuiz(q)}
          >
            <h3>{q.title}</h3>
            <p>Topic: {q.topic}</p>
            <p>Questions: {q.questions.length}</p>
          </div>
        ))}
      </div>
    </>
  );
}

  if (!filteredQuestions.length) {
  return (
    <>
      <Navbar />
      <div className="quiz-container">
        <p>Loading quiz...</p>
      </div>
    </>
  );
}

  const question = filteredQuestions[currentQuestion];
  console.log("Filtered Questions:", filteredQuestions);


  return (
    <>
      <Navbar />
      <div className="quiz-container">
        <h2>{selectedQuiz.title}</h2>

        <p>
          Question {currentQuestion + 1} of{" "}
          {filteredQuestions.length}
        </p>
        <div className="progress-bar">
  <div
    className="progress-fill"
    style={{
      width: `${((currentQuestion + 1) / filteredQuestions.length) * 100}%`
    }}
  />
</div>
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

        <div className="quiz-actions">
          <button
            onClick={useFiftyFifty}
            disabled={lifelineUsed}
            className="lifeline-btn"
          >
            50-50 Lifeline
          </button>

          <button
            onClick={handleNext}
            disabled={!selectedOption}
            className="next-button"
          >
            {currentQuestion + 1 ===
            filteredQuestions.length
              ? "Submit"
              : "Next"}
          </button>
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;



