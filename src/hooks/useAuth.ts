import { useState, useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  points: number;
  streak: number;
  hashedPassword?: string;
}

interface SessionToken {
  token: string;
  expires: string; // ISO date string
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey(
    "raw",
    data,
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );
  const hash = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    key,
    256
  );
  const hashArray = Array.from(new Uint8Array(hash));
  const saltArray = Array.from(salt);
  return btoa(String.fromCharCode(...saltArray, ...hashArray));
}

async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  try {
    const combined = Uint8Array.from(atob(storedHash), (c) => c.charCodeAt(0));
    const salt = combined.slice(0, 16);
    const originalHash = combined.slice(16);
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const key = await crypto.subtle.importKey(
      "raw",
      data,
      { name: "PBKDF2" },
      false,
      ["deriveBits"]
    );
    const hash = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      key,
      256
    );
    const hashArray = Array.from(new Uint8Array(hash));
    return hashArray.every((byte, i) => byte === originalHash[i]);
  } catch {
    return false;
  }
}

export function useAuth() {
  const [user, setUser] = useLocalStorage<User | null>("user", null);
  const [sessionToken, setSessionToken] = useLocalStorage<SessionToken | null>(
    "sessionToken",
    null
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const generateSessionToken = () => {
    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    return { token, expires };
  };

  const isValidSessionToken = (token: SessionToken | null) => {
    if (!token) return false;
    const expiryDate = new Date(token.expires);
    const isValid = expiryDate > new Date();
    return isValid;
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (user && sessionToken && isValidSessionToken(sessionToken)) {
          setIsAuthenticated(true);
        } else {
          setSessionToken(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("useAuth: Auth check failed:", error);
        setSessionToken(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [setSessionToken, user, sessionToken]);

  const login = async (email: string, password: string) => {
    try {
      console.log("useAuth: Login attempt with email:", email);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check localStorage for existing user
      const storedUser =
        typeof window !== "undefined" ? localStorage.getItem("user") : null;
      console.log("useAuth: Stored user from localStorage:", storedUser);

      if (!storedUser) {
        console.log("useAuth: No user found in localStorage");
        return { success: false, error: "User not found" };
      }

      let existingUser: User;
      try {
        existingUser = JSON.parse(storedUser);
      } catch (error) {
        console.error("useAuth: Error parsing stored user:", error);
        return { success: false, error: "Invalid user data" };
      }

      if (existingUser.email !== email) {
        console.log(
          "useAuth: Email mismatch, expected:",
          existingUser.email,
          "got:",
          email
        );
        return { success: false, error: "User not found" };
      }

      if (
        !existingUser.hashedPassword ||
        !(await verifyPassword(password, existingUser.hashedPassword))
      ) {
        console.log("useAuth: Invalid password for email:", email);
        return { success: false, error: "Invalid password" };
      }

      const userData: User = { ...existingUser };
      const newSessionToken = generateSessionToken();

      console.log("useAuth: Setting user during login:", userData);
      setUser(userData);
      console.log(
        "useAuth: Setting sessionToken during login:",
        newSessionToken
      );
      setSessionToken(newSessionToken);
      setIsAuthenticated(true);

      // Verify storage
      if (typeof window !== "undefined") {
        console.log(
          "useAuth: After login, stored user:",
          localStorage.getItem("user")
        );
        console.log(
          "useAuth: After login, stored sessionToken:",
          localStorage.getItem("sessionToken")
        );
      }

      return { success: true, token: newSessionToken.token };
    } catch (error) {
      console.error("useAuth: Login error:", error);
      return { success: false, error: "Login failed" };
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      console.log("useAuth: Signup attempt with email:", email, "name:", name);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check if user already exists in localStorage
      const storedUser =
        typeof window !== "undefined" ? localStorage.getItem("user") : null;
      if (storedUser) {
        let existingUser: User;
        try {
          existingUser = JSON.parse(storedUser);
          if (existingUser.email === email) {
            console.log("useAuth: User already exists with email:", email);
            return { success: false, error: "Email already registered" };
          }
        } catch (error) {
          console.error(
            "useAuth: Error parsing stored user during signup:",
            error
          );
        }
      }

      const hashedPassword = await hashPassword(password);
      const userData: User = {
        id: crypto.randomUUID(),
        name,
        email,
        points: 0,
        streak: 0,
        hashedPassword,
      };
      const newSessionToken = generateSessionToken();

      console.log("useAuth: Setting user during signup:", userData);
      setUser(userData);
      console.log(
        "useAuth: Setting sessionToken during signup:",
        newSessionToken
      );
      setSessionToken(newSessionToken);
      setIsAuthenticated(true);

      // Verify storage
      if (typeof window !== "undefined") {
        console.log(
          "useAuth: After signup, stored user:",
          localStorage.getItem("user")
        );
        console.log(
          "useAuth: After signup, stored sessionToken:",
          localStorage.getItem("sessionToken")
        );
      }

      return { success: true, token: newSessionToken.token };
    } catch (error) {
      console.error("useAuth: Signup error:", error);
      return { success: false, error: "Signup failed" };
    }
  };

  const logout = () => {
    console.log("useAuth: Logging out, clearing sessionToken only");
    setSessionToken(null);
    setIsAuthenticated(false);
    console.log(
      "useAuth: After logout, user remains:",
      localStorage.getItem("user")
    );
    console.log(
      "useAuth: After logout, sessionToken:",
      localStorage.getItem("sessionToken")
    );
  };

  const resetPassword = async (email: string) => {
    try {
      console.log("useAuth: Reset password attempt for email:", email);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true };
    } catch (error) {
      console.error("useAuth: Reset password error:", error);
      return { success: false, error: "Failed to send reset email" };
    }
  };

  return {
    user,
    sessionToken,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
    resetPassword,
  };
}
