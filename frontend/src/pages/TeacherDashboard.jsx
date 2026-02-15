import React from "react";
import "./TeacherDashboard.css";
import { useNavigate } from "react-router-dom";

const TeacherDashboard = () => {
  const navigate = useNavigate(); // 🔥 added

  return (
    <div className="teacher-dashboard">

      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Teacher Dashboard</h1>
          <p className="subtitle">
            Monitor student performance and manage quizzes
          </p>
        </div>

        {/* 🔥 Updated Button */}
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
          <p className="metric">6</p>
        </div>

        <div className="overview-card">
          <h3>Most Weak Topic</h3>
          <p className="metric highlight">Operating Systems</p>
        </div>
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