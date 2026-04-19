import User from "../models/User.js";
import { verifyAuthToken } from "../utils/auth.js";

const extractToken = (request) => {
  const authorization = request.headers.authorization || "";

  if (authorization.startsWith("Bearer ")) {
    return authorization.slice(7).trim();
  }

  return null;
};

export const optionalAuth = async (request, _response, next) => {
  try {
    const token = extractToken(request);

    if (!token) {
      request.user = null;
      next();
      return;
    }

    const payload = verifyAuthToken(token);
    const user = await User.findById(payload.sub).select("_id name email").lean();
    request.user = user || null;
    next();
  } catch (_error) {
    request.user = null;
    next();
  }
};

export const authenticateRequest = async (request, response, next) => {
  try {
    const token = extractToken(request);

    if (!token) {
      response.status(401).json({
        success: false,
        message: "Authentication required.",
      });
      return;
    }

    const payload = verifyAuthToken(token);
    const user = await User.findById(payload.sub).select("_id name email").lean();

    if (!user) {
      response.status(401).json({
        success: false,
        message: "Your session is no longer valid. Please sign in again.",
      });
      return;
    }

    request.user = user;
    next();
  } catch (error) {
    error.statusCode = 401;
    error.message = "Invalid or expired token.";
    next(error);
  }
};
