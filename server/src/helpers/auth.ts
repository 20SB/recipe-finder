// src\helpers\auth.ts
import { ApolloError } from "apollo-server";
import jwt from "jsonwebtoken";

// Middleware function to check authentication
export const isAuthenticated = (context: any) => {
  if (!context.user) {
    throw new ApolloError("UNAUTHORIZED! You must be logged in", "UNAUTHORIZED");
  }
  return context.user;
};

// Middleware function to check authorization (for specific roles)
export const hasRole = (role: string) => (context: any) => {
  if (context.user.role !== role) {
    throw new ApolloError("FORBIDDEN! Access denied", "FORBIDDEN");
  }
};

// Generate token
export const generateToken = (payload: { userId: number }) => {
    const SECRET_KEY = "mysecretkey";
    return jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
}

import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export const hash = async (data: string) => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedData = await bcrypt.hash(data, salt);
    return hashedData;
  } catch (error: any) {
    throw new Error(`Error hashing data: ${error.message}`);
  }
};

export const compare = async (data: string, hashedData: string) => {
  try {
    const isMatch = await bcrypt.compare(data, hashedData);
    return isMatch;
  } catch (error: any) {
    throw new Error(`Error comparing data: ${error.message}`);
  }
};
