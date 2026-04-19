import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { createActivity } from "../services/activityService.js";
import { signAuthToken } from "../utils/auth.js";

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
});

export const register = async (request, response, next) => {
  try {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
      return response.status(400).json({
        success: false,
        message: "Name, email, and password are required.",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });

    if (existingUser) {
      return response.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
    });
    const token = signAuthToken(user);

    await createActivity(
      {
        type: "auth",
        title: "New account created",
        message: `${user.name} joined Smart Home Cloud.`,
        actorName: user.name,
        source: "auth",
      },
      { emit: false }
    );

    response.status(201).json({
      success: true,
      data: {
        token,
        user: sanitizeUser(user),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (request, response, next) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return response.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return response.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = signAuthToken(user);

    response.status(200).json({
      success: true,
      data: {
        token,
        user: sanitizeUser(user),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (request, response) => {
  response.status(200).json({
    success: true,
    data: {
      user: sanitizeUser(request.user),
    },
  });
};
