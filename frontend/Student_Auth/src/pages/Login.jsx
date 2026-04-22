import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const nav = useNavigate();

  const login = async () => {

    try {

      const res = await axios.post(
        "https://student-auth-system-igft.onrender.com/api/login",
        data
      );

      localStorage.setItem("token", res.data.token);

      nav("/dashboard");

    } catch (err) {

      setError("Login Failed");

    }
  };

  return (
    <div className="container">

      <div className="form-box">

        <h2>Login</h2>

        {error && (
          <p className="error">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          onChange={(e) =>
            setData({
              ...data,
              email: e.target.value,
            })
          }
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setData({
              ...data,
              password: e.target.value,
            })
          }
        />

        <button onClick={login}>
          Login
        </button>

        <div className="link">
          <Link to="/register">
            Don't have account?
          </Link>
        </div>

      </div>

    </div>
  );
}