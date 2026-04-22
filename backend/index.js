const dns = require('dns').promises;   // or just require('dns') in older Node
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

/* =========================
   MongoDB Connection
========================= */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

/* =========================
   Student Schema
========================= */

const studentSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  course: String,
});

const Student = mongoose.model("Student", studentSchema);

/* =========================
   JWT Middleware
========================= */

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = verified.id;

    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid Token",
    });
  }
};

/* =========================
   Register API
========================= */

app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password, course } = req.body;

    const existingUser = await Student.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = new Student({
      name,
      email,
      password: hashedPassword,
      course,
    });

    await student.save();

    res.json({
      message: "Registration Successful",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
});

/* =========================
   Login API
========================= */

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    const token = jwt.sign(
      { id: student._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      token,
      student: {
        name: student.name,
        email: student.email,
        course: student.course,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
});

/* =========================
   Dashboard API
========================= */

app.get("/api/dashboard", authMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.userId).select("-password");

    res.json(student);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
});

/* =========================
   Update Password API
========================= */

app.put("/api/update-password", authMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const student = await Student.findById(req.userId);

    const isMatch = await bcrypt.compare(
      oldPassword,
      student.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Old Password Incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    student.password = hashedPassword;

    await student.save();

    res.json({
      message: "Password Updated",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
});

/* =========================
   Update Course API
========================= */

app.put("/api/update-course", authMiddleware, async (req, res) => {
  try {
    const { course } = req.body;

    const student = await Student.findById(req.userId);

    student.course = course;

    await student.save();

    res.json({
      message: "Course Updated",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
});

/* =========================
   Server Start
========================= */

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});