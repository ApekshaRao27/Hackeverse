import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth.jsx";
import TeacherDashboard from "./pages/TeacherDashboard.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import CreateQuiz from "./pages/CreateQuiz";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/create-quiz" element={<CreateQuiz />} />
      </Routes>
    </Router>
  );
}

export default App;
