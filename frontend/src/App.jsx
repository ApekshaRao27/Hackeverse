import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth.jsx";
import TeacherDashboard from "./pages/TeacherDashboard.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import WeakPoints from "./pages/WeakPoints.jsx";
import CreateQuiz from "./pages/CreateQuiz.jsx";

import LearningPage from "./learning/pages/learningPage.jsx";
import SubjectPage from "./learning/pages/SubjectPage.jsx";
import MissionPage from "./learning/pages/MissionPage.jsx";
import { XpProvider } from "./XPContext.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
function App() {
  return (
    <XpProvider>
      <Router>
        <Routes>
          {/* Auth */}
          <Route path="/" element={<Auth />} />

          {/* Teacher routes */}
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/create-quiz" element={<CreateQuiz />} />

          {/* Student routes */}
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/weak-points" element={<WeakPoints />} />

          {/* Learning routes */}
          <Route path="/learning" element={<LearningPage />} />
          <Route path="/subject/:id" element={<SubjectPage />} />
          <Route path="/mission/:id" element={<MissionPage />} />
          <Route path="leaderboard" element={<Leaderboard/>}/>
        </Routes>
      </Router>
    </XpProvider>
  );
}

export default App;
