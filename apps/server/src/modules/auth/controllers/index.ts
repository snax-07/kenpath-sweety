import type { Request, Response } from "express";
import { loginSchema, registerSchema } from "../validators/index.js";
import { loginUser, logoutUser, registerUser, findUserByEmail } from "../services/index.js";
import { decodeHash } from "../../../utils/jwt.js";

export const registerController = async (req: Request, res: Response) => {
  try {


    console.log("Request received register")
    const { name, email, password } = req.body;
    const validData = registerSchema.parse({ name, email, password });
    const accessToken = await registerUser(validData);

    return res.status(201).cookie("accessToken", accessToken, { httpOnly: true, sameSite: "lax", path: "/" }).json({
      message: "User registered successfully!",
      status: true,
      data: {
        user: { email: validData.email, name: validData.name },
      },
    });
  } catch (error) {
    return res.status(409).json({
      message: (error as Error).message || "Internal server error",
      status: false,
      error,
    });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const validData = loginSchema.parse({ email, password });
    const accessToken = await loginUser(validData);

    return res.status(200).cookie("accessToken", accessToken, { httpOnly: true, sameSite: "lax", path: "/" }).json({
      message: "User logged in successfully!",
      status: true,
      data: {
        user: { email: validData.email },
      },
    });
  } catch (error) {
    return res.status(401).json({
      message: (error as Error).message || "Internal Server error!",
      status: false,
      error,
    });
  }
};

export const logoutController = async (_req: Request, res: Response) => {
  try {
    return res.status(200).clearCookie("accessToken", { path: "/" }).json({
      message: "User logged out",
      status: true,
    });
  } catch (error) {
    return res.status(409).json({
      message: "Session is not valid",
      status: false,
      error,
    });
  }
};

export const meController = async (req: Request, res: Response) => {
  try {
    const request = req as Request & { cookies?: Record<string, string> };
    const token = request.cookies?.accessToken;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized", status: false });
    }

    const payload = (await decodeHash(token)) as { id?: string; email?: string };
    if (!payload?.id) {
      return res.status(401).json({ message: "Invalid session", status: false });
    }

    const user = await findUserByEmail(payload.email ?? "");
    if (!user) {
      return res.status(401).json({ message: "User not found", status: false });
    }

    return res.status(200).json({
      message: "User fetched successfully",
      status: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    return res.status(401).json({
      message: (error as Error).message || "Unauthorized",
      status: false,
      error,
    });
  }
};
