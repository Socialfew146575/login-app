import User from "../model/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ENV from "../config.js";

import otpGenerator from "otp-generator";

export async function verifyUser(req, res, next) {
  try {
    const { username } = req.method == "GET" ? req.query : req.body;

    let exist = await User.findOne({ username });

    if (!exist) return res.status(404).send({ error: "Can't find User!" });

    next();
  } catch (error) {
    return res.status(404).send({ error: "Authentication Error" });
  }
}

// Register a new user
export const register = async (req, res) => {
  try {
    const { username, password, profile, email } = req.body;

    // Check if the email or username already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      return res
        .status(400)
        .send({ error: "Username or email already exists" });
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        username,
        password: hashedPassword,
        email,
        profile: profile || "",
      });

      const result = await user.save();

      res
        .status(201)
        .json({ message: "User Registered Successfully", user: result });
    } else {
      return res.status(400).send({ error: "Password is required" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Login a user
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "Username not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ error: "Password does not match" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
      },
      ENV.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      message: "Login successful",
      username: user.username,
      token: token,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getUser = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({ error: "Invalid username" });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { password, ...rest } = Object.assign({}, user.toJSON());

    return res.status(200).json({ user: rest });
  } catch (error) {
    console.error("Error in getUser:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Update user information
export const updateUser = async (req, res) => {
  try {
    console.log("Updating User");

    const { userId } = req.user;

    if (userId) {
      const body = req.body;
      console.log("body", body);

      const user = await User.updateOne({ _id: userId }, body);

      if (!user) res.status(500).send({ error: "Something went wrong...!" });

      console.log("User", user);

      return res.status(201).send({ msg: "Record Updated ...!" });
    } else {
      return res.status(401).send({ error: "User not Found...!" });
    }
  } catch (error) {
    return res.status(401).send({ error });
  }
};

// Generate OTP
export const generateOTP = async (req, res) => {
  req.app.locals.OTP = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  res.status(201).send({ code: req.app.locals.OTP });
};

// Verify OTP
export const verifyOTP = async (req, res) => {
  const { code } = req.query;
  console.log(code);

  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    req.app.locals.OTP = null;
    req.app.locals.resetSession = true;

    return res.status(201).send({ msg: "Verified Successfully" });
  }

  return res.status(400).send({ error: "Invalid OTP" });
};

// Create reset session
export const createResetSession = async (req, res) => {
  if (req.app.locals.resetSession) {
    return res.status(201).send({ flag: req.app.locals.resetSession });
  }
  return res.status(440).send({ error: "Session expired" });
};

// Reset password

export const resetPassword = async (req, res) => {
  try {
    if (!req.app.locals.resetSession) {
      return res.status(404).send({ error: "Session expired!" });
    }

    const { username, password } = req.body;

    // Check if the username exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "Username not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!hashedPassword) {
      return res.status(500).json({ error: "Unable to hash password" });
    }

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
