import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth.jsx";
import TeacherDashboard from "./pages/TeacherDashboard.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import CreateQuiz from "./pages/CreateQuiz.jsx";

import LearningPage from "./learning/pages/learningPage.jsx";
import SubjectPage from "./learning/pages/SubjectPage.jsx";
import MissionPage from "./learning/pages/MissionPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Auth />} />

        {/* Teacher routes */}
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/create-quiz" element={<CreateQuiz />} />

        {/* Student routes */}
        <Route path="/student-dashboard" element={<StudentDashboard />} />

        {/* Learning routes */}
        <Route path="/learning" element={<LearningPage />} />
        <Route path="/subject/:id" element={<SubjectPage />} />
        <Route path="/mission/:id" element={<MissionPage />} />
      </Routes>
    </Router>
  );
}

export default App;
