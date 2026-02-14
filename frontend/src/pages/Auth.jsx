import { useState } from "react";
import axios from "axios";
import "./Auth.css";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate(); 

  // State for login/register toggle
  const [isLogin, setIsLogin] = useState(true);

  // Form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "student",
  });

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isLogin
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/users";

      const payload = isLogin ? { email: form.email } : form;

      const res = await axios.post(url, payload);

      const user = res.data;

      // Redirect based on role
      if (isLogin) {
        if (user.role === "teacher") navigate("/teacher-dashboard");
        else navigate("/student-dashboard");
      } else {
        // after register, redirect to login
        setIsLogin(true);
        alert("Account created! Please login.");
      }

    } catch (err) {
      alert(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">{isLogin ? "Welcome Back 👋" : "Create Account 🚀"}</h2>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
                className="auth-input"
              />

              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="auth-input"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            className="auth-input"
          />

          <button type="submit" className="auth-button">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="auth-toggle" onClick={() => setIsLogin(!isLogin)}>
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
};

export default Auth;
