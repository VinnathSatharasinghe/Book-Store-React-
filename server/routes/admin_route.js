const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const Admin = require("../models/admin");
const verifyToken = require("../middleware/verifyToken");;

// Sign up
router.post("/admin-signup", async (req, res) => {
  try {
    const { username, password } = req.body;


    if (!username) {
      return res.status(200).json({ message: "noadmin" });

    }

    if (!password) {
      return res.status(200).json({ message: "nopass" });

    } 

    const hashedPassword = bcrypt.hashSync(password, 10);

    const isMatch = bcrypt.compareSync(password, admin.password);
    if (!isMatch) {
      return res.status(200).json({ message: "casepass" });
    }

    const adminExists = await Admin.findOne({ username: username });
    
    if (adminExists) {
      return res.status(200).json({ message: "caseadmin" });
    }

    const newAdmin = new Admin({
      username: username,
      password: hashedPassword,
    });

    await newAdmin.save();
    return res.status(200).json({ message: "adminok" });
  } catch (error) {
    res.status(500).json({ message: "INTERNAL ERROR" });
    console.error(error);
  }
});

// Admin-Login
router.post("/admin-login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username) {
      return res.status(200).json({ message: "noadmin" });

    }
    if (!password) {
      return res.status(200).json({ message: "nopass" });
    }

    const admin = await Admin.findOne({ username: username });

    if (!admin) {
      return res.status(200).json({ message: "caseadmin" });
    }

    const isMatch = bcrypt.compareSync(password, admin.password);
    if (!isMatch) {
      return res.status(200).json({ message: "casepass" });
    }

    const token = jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_PRIVATE_KEY, {
      expiresIn: "10 minutes",
    });

    const decodedToken = jwt.decode(token);
    const expiresAt = new Date(decodedToken.exp * 1000); // Convert to milliseconds
    const currentTime = new Date();

  const calculateTimeLeft = (expiresAt, currentTime) => {
    const timeLeft = expiresAt - currentTime;
    
    const secondsLeft = Math.floor(timeLeft / 1000);
    const minutesLeft = Math.floor(secondsLeft / 60);
    const hoursLeft = Math.floor(minutesLeft / 60);
  
    return `Time left: ${hoursLeft} hours, ${minutesLeft % 60} minutes, ${secondsLeft % 60} seconds`;
  };


  const timeLeftMessage = calculateTimeLeft(expiresAt, currentTime);


    return res.status(200).json({
      message: "adminloginok",
      token,
      username,
      id: admin._id,
      role: admin.role,
      expiresAt,
      timeLeftMessage,
  
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
    console.error("Login error:", error);
    console.log("JWT_SECRET:", process.env.JWT_PRIVATE_KEY);
  }
});

// Protected route example
router.get("/protected", verifyToken, (req, res) => {
  res.status(200).json({ message: "This is a protected route", user: req.user });
});



router.get('/user-info/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params; // Extract the user ID from the request parameters
    const data = await User.findById(id);

    if (!data) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ message: "Internal error" });
  }
});

module.exports = router;

