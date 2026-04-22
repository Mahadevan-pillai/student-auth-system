import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {

  const [user, setUser] = useState({});
  const [course, setCourse] = useState("");
  const [pass, setPass] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const nav = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {

    if (!token) {
      nav("/login");
      return;
    }

    fetchData();

  }, []);

  const fetchData = async () => {

    try {

      const res = await axios.get(
        "https://student-auth-system-igft.onrender.com/api/dashboard",
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setUser(res.data);

    } catch {

      alert("Unauthorized");

      nav("/login");

    }
  };

  const updateCourse = async () => {

    try {

      await axios.put(
        "https://student-auth-system-igft.onrender.com/api/update-course",
        { course },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      alert("Course Updated");

      fetchData();

    } catch {

      alert("Error");

    }
  };

  const updatePassword = async () => {

    try {

      await axios.put(
        "https://student-auth-system-igft.onrender.com/api/update-password",
        pass,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      alert("Password Updated");

    } catch {

      alert("Error");

    }
  };

  const logout = () => {

    localStorage.removeItem("token");

    nav("/login");
  };

  return (
    <div className="dashboard">

      <h1>Student Dashboard</h1>

      <div className="dashboard-box">

        <h3>Name: {user.name}</h3>

        <h3>Email: {user.email}</h3>

        <h3>Course: {user.course}</h3>

        <input
          type="text"
          placeholder="New Course"
          onChange={(e) =>
            setCourse(e.target.value)
          }
        />

        <button onClick={updateCourse}>
          Update Course
        </button>

        <input
          type="password"
          placeholder="Old Password"
          onChange={(e) =>
            setPass({
              ...pass,
              oldPassword: e.target.value,
            })
          }
        />

        <input
          type="password"
          placeholder="New Password"
          onChange={(e) =>
            setPass({
              ...pass,
              newPassword: e.target.value,
            })
          }
        />

        <button onClick={updatePassword}>
          Update Password
        </button>

        <button onClick={logout}>
          Logout
        </button>

      </div>

    </div>
  );
}