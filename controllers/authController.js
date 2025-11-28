import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'

export const oauthLogin = async (req, res) => {
  console.log("I am calling here in the controller");

  try {
    const { name, email, image, provider } = req.body;

 
    let user = await User.findOne({ email });

 
    if (!user) {
      user = await User.create({ name, email, image, provider });
    }

  
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } 
    );

 
    res.status(200).json({
      message: "OAuth login success",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image || "",
        provider: user.provider,
      },
      token, 
    });
  } catch (err) {
    console.error("OAuth Login Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};




export const registerUser = async (req, res) => {
  console.log("I am calling here in the controller for register");

  try {
    const { name, email, password } = req.body;

  
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

 
    const hashedPassword = await bcrypt.hash(password, 10);

  
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      provider: "credentials", 
    });

    console.log(newUser,'thsi is the new user after rgister')

   
    res.status(201).json({
      message: "User created",
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (err) {
    console.error("Register User Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};





export const loginUser = async (req, res) => {
  console.log("i am here in login");

  try {
    const { email, password } = req.body;


    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

  
    const user = await User.findOne({ email });
    console.log(user, "this is the user");

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

 
    if (user.provider === "credentials") {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ error: "Invalid password" });
      }
    }

 
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

 
    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image || "",
        provider: user.provider,
      },
      token,
    });

  } catch (err) {
    console.error("Login Error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
};