import jwt from "jsonwebtoken";
import ENV from "../config/env.js";
import type { encodeHashDto } from "../types/jwt.types.js";

export class JWT_ERROR extends Error {
  constructor(message: string, public readonly error: unknown) {
    super(message);
    this.name = "JWT_ERROR";
  }
}

export const decodeHash = async (hash: string) => {
  try {
    if (!hash) throw new Error("Hash is not valid");
    return jwt.verify(hash, ENV.JWT_SECRET || "kenpath-dev-secret");
  } catch (error) {
    throw new JWT_ERROR("JWT STRING ERROR", error);
  }
};

export const encodeHash = async (data: encodeHashDto) => {
  try {
    return jwt.sign(data, ENV.JWT_SECRET || "kenpath-dev-secret", {
      expiresIn: "7d",
    });
  } catch (error) {
    throw new JWT_ERROR("JWT STRING ERROR", error);
  }
};
