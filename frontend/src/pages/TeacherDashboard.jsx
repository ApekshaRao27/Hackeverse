import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./TeacherDashboard.css";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

 
const user = JSON.parse(localStorage.getItem("user"));
const teacherId = user?._id;

  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!teacherId) return; // safety check
      try {
        const res = await axios.get(
          `http://localhost:5000/api/questions?createdBy=${teacherId}`
        );
        setQuizzes(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [teacherId]);

  return (
    <div className="teacher-dashboard">

      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Teacher Dashboard</h1>
          <p className="subtitle">
            Welcome {teacherId?.name || "Teacher"} — Monitor student performance and manage quizzes
          </p>
        </div>
        <button
          className="create-quiz-btn"
          onClick={() => navigate("/create-quiz")}
        >
          + Create Quiz
        </button>
      </div>

      {/* Overview Cards */}
      <div className="overview-section">
        <div className="overview-card">
          <h3>Total Students</h3>
          <p className="metric">120</p>
        </div>

        <div className="overview-card">
          <h3>Average Class Score</h3>
          <p className="metric">78%</p>
        </div>

        <div className="overview-card">
          <h3>Active Quizzes</h3>
          <p className="metric">{quizzes.length}</p>
        </div>

        <div className="overview-card">
          <h3>Most Weak Topic</h3>
          <p className="metric highlight">Operating Systems</p>
        </div>
      </div>

      {/* Active Quizzes */}
      <div className="quiz-section">
        <h2>Active Quizzes Created by You</h2>
        {loading ? (
          <p>Loading quizzes...</p>
        ) : quizzes.length === 0 ? (
          <p>No quizzes created yet.</p>
        ) : (
          <div className="quiz-grid">
            {quizzes.map((quiz) => (
              <div key={quiz._id} className="quiz-card">
                <h3>{quiz.title}</h3>
                <p>Topic: {quiz.topic}</p>
                <p>Questions: {quiz.questions.length}</p>
                <button onClick={() => navigate(`/quiz/${quiz._id}`)}>
                  View / Edit
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Analytics Section */}
      <div className="analytics-section">
        <h2>Student Performance Analytics</h2>
        <div className="analytics-grid">
          <div className="analytics-card">
            <h4>Topic-wise Accuracy</h4>
            <div className="chart-placeholder">
              [ Bar Chart Placeholder ]
            </div>
          </div>
          <div className="analytics-card">
            <h4>Performance Trend (Last 7 Days)</h4>
            <div className="chart-placeholder">
              [ Line Chart Placeholder ]
            </div>
          </div>
          <div className="analytics-card">
            <h4>Top Performers</h4>
            <ul className="list">
              <li>Rahul – 92%</li>
              <li>Ananya – 89%</li>
              <li>Vikram – 87%</li>
              <li>Sneha – 85%</li>
            </ul>
          </div>
          <div className="analytics-card">
            <h4>Weak Topics Overview</h4>
            <ul className="list weak">
              <li>Deadlock – 52%</li>
              <li>TCP/IP – 60%</li>
              <li>Probability – 58%</li>
              <li>Paging – 55%</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
