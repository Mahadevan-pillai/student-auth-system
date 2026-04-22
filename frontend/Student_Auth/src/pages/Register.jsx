import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    course: "",
  });

  const [error, setError] = useState("");

  const nav = useNavigate();

  const submit = async () => {

    try {

      await axios.post(
        "https://student-auth-system-igft.onrender.com/api/register",
        form
      );

      alert("Registered Successfully");

      nav("/login");

    } catch (err) {

      setError(
        err.response?.data?.message || "Error"
      );

    }
  };

  return (
    <div className="container">

      <div className="form-box">

        <h2>Register</h2>

        {error && (
          <p className="error">{error}</p>
        )}

        <input
          type="text"
          placeholder="Name"
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />

        <input
          type="email"
          placeholder="Email"
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Course"
          onChange={(e) =>
            setForm({
              ...form,
              course: e.target.value,
            })
          }
        />

        <button onClick={submit}>
          Register
        </button>

        <div className="link">
          <Link to="/login">
            Already have account?
          </Link>
        </div>

      </div>

    </div>
  );
}