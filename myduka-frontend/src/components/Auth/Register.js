import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css"; // Import external CSS file

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "clerk",
    token: "",
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize navigate function

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("token");
      const config =
        formData.role === "clerk"
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};

      const res = await axios.post(
        "https://my-duka-project-g25b.onrender.com/register",
        formData,
        config
      );

      setMessage({ text: res.data.message, type: "success" });

      // Redirect to login after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Registration failed",
        type: "error",
      });
    }

    setLoading(false);
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Register</h2>

        {message && <p className={`message ${message.type}`}>{message.text}</p>}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="clerk">Clerk</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {formData.role === "admin" && (
            <div className="form-group">
              <label>Admin Token</label>
              <input
                type="text"
                name="token"
                value={formData.token}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <button type="submit" className="register-button" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
