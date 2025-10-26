import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* ----------------------------- Register a user ---------------------------- */
export const register = async (req, res) => {
  try {
    // Extract name, email, and password from the request body
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({
        success: false,
        message: "Missing required fields",
      });
    }
    // Check if a user with the provided email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exists",
      });
    }
    // Hash the password using bcrypt for security
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    // Generate a JWT token for the newly created user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      // Prevents client-side JS from reading the cookie
      httpOnly: true,
      // Secure flag ensures the cookie is sent over HTTPS in production
      secure: process.env.NODE_ENV === "production",
      // SameSite attribute to control cross-site sending of the cookie
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      // Cookie expiration set to 7 days in milliseconds
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      user: { email: user.email, name: user.name },
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

/* ------------------------------ Login a user ------------------------------ */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({
        success: false,
        message: "Missing required fields",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "User does not exist",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({
        success: false,
        message: "Invalid credentials",
      });
    }
    // Generate a JWT token for the newly created user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      // Prevents client-side JS from reading the cookie
      httpOnly: true,
      // Secure flag ensures the cookie is sent over HTTPS in production
      secure: process.env.NODE_ENV === "production",
      // SameSite attribute to control cross-site sending of the cookie
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      // Cookie expiration set to 7 days in milliseconds
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      user: { email: user.email, name: user.name },
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

/* --------------------------------- Check auth api/user/is-auth -------------------------------- */
export const isAuth = async (req, res) => {
  try {
    console.log(req.body);
    const { userId } = req.body;
    const user = await User.findById(userId).select("-password");
    return res.json({ success: true, user });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

/* -------------------------------- Logout user /api/user/logout -------------------------------- */
export const logout = async (req, res) => {
    try {
        // You MUST match the options used during res.cookie() exactly.
        // The SameSite value used for setting should be repeated here.
        // The maxAge/expires parameter is crucial for clearing.
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            
            // 🎯 CRITICAL: Use the same SameSite value used during login. 
            // If you use "none" (for cross-site) you MUST use "secure: true".
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", 
            
            // 🎯 FIX: You must include maxAge/expires to ensure the cookie is cleared.
            // Setting expires to a time in the past is the most reliable way.
            expires: new Date(0), 
        });

        return res.json({ success: true, message: "Logout success" });
        
    } catch (error) {
        console.log(error.message);
        res.json({
            success: false,
            message: error.message,
        });
    }
};