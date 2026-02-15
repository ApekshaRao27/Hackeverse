import { BrowserRouter, Routes, Route } from "react-router-dom";
import SocketProvider from "./SocketProvider";

import Auth from "./pages/Auth";
import TeacherDashboard from "./pages/TeacherDashboard";
import CreateQuiz from "./pages/CreateQuiz";
import StudentDashboard from "./pages/StudentDashboard";
import Battle from "./pages/Battle";

function App() {
  return (
    <SocketProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/create-quiz" element={<CreateQuiz />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/battle" element={<Battle />} />
        </Routes>
      </BrowserRouter>
    </SocketProvider>
  );
}

export default App;