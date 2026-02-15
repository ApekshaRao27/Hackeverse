import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";

const WeakPoints = () => {
  const navigate = useNavigate();
  const [weakPoints, setWeakPoints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeakPoints = async () => {
      try {
        const raw = localStorage.getItem("user");
        if (!raw) {
          navigate("/");
          return;
        }
        const storedUser = JSON.parse(raw);
        const userData = Array.isArray(storedUser) ? storedUser[0] : storedUser;
        const studentId = userData?._id || userData?.id;
        if (!studentId) {
          navigate("/");
          return;
        }

        const res = await axios.get(`http://localhost:5000/api/attempts/weak-points/${studentId}?by=topic`);
        setWeakPoints(res.data || []);
      } catch (err) {
        console.error("Error fetching weak points:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeakPoints();
  }, [navigate]);

  return (
    <div>
      <nav className="navbar">
        <h2 className="navbar-brand">Student Dashboard</h2>
        <ul className="navbar-links">
          <li>
            <span 
              className="nav-link"
              onClick={() => navigate("/student-dashboard")}
              style={{cursor: 'pointer'}}
            >
              Quiz
            </span>
          </li>
          <li>
            <span style={{cursor: 'pointer', color: '#FFD700'}}>Weak Points</span>
          </li>
        </ul>
      </nav>

      <div className="quiz-list">
        <h2>📊 Your Weak Points</h2>
        
        {loading ? (
          <p>Loading...</p>
        ) : weakPoints && weakPoints.length > 0 ? (
          <div style={{ maxWidth: "600px", margin: "20px auto" }}>
            {weakPoints.map((w, i) => (
              <div 
                key={i}
                style={{
                  padding: "15px",
                  marginBottom: "15px",
                  backgroundColor: "#fff3cd",
                  borderRadius: "8px",
                  border: "1px solid #ffc107"
                }}
              >
                <h3 style={{ margin: "0 0 10px 0", color: "#856404" }}>{w.topic}</h3>
                <p style={{ margin: "5px 0", color: "#856404" }}>
                  <strong>Incorrect Rate:</strong> {Math.round((w.incorrectRate || w.incorrect / w.total) * 100)}%
                </p>
                <p style={{ margin: "5px 0", color: "#856404" }}>
                  <strong>Questions Answered:</strong> {w.total}
                </p>
                <p style={{ margin: "5px 0", color: "#856404" }}>
                  <strong>Incorrect:</strong> {w.incorrect} / {w.total}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: "center", color: "#28a745", marginTop: "40px" }}>
            ✅ No weak points detected! Great job!
          </p>
        )}
      </div>
    </div>
  );
};

export default WeakPoints;
