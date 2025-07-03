import React, { useState, useMemo } from "react";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { Button } from "../common/Button";
import { Modal } from "../common/Modal";
import { useAuth } from "../../hooks/useAuth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = "login" | "signup" | "reset";

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login, signup, resetPassword, loading: authLoading } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const resetForm = () => {
    setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    setError("");
    setSuccess("");
    setShowPassword(false);
  };

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
    resetForm();
  };

  const validateForm = () => {
    if (!formData.email) {
      setError("Email is required");
      return false;
    }
    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address");
      return false;
    }
    if (mode !== "reset") {
      if (!formData.password) {
        setError("Password is required");
        return false;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long");
        return false;
      }
    }
    if (mode === "signup") {
      if (!formData.name) {
        setError("Name is required");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setError("");
    try {
      if (mode === "reset") {
        const result = await resetPassword(formData.email);
        if (result.success) {
          setSuccess("Password reset link sent to your email!");
          setTimeout(() => handleModeChange("login"), 2000);
        } else {
          setError(result.error || "Failed to send reset email");
        }
      } else if (mode === "signup") {
        const result = await signup(
          formData.name,
          formData.email,
          formData.password
        );
        if (result.success) {
          onClose();
          resetForm();
        } else {
          setError(
            typeof result.error === "string" ? result.error : "Signup failed"
          );
        }
      } else {
        const result = await login(formData.email, formData.password);
        if (result.success) {
          onClose();
          resetForm();
        } else {
          setError(
            typeof result.error === "string" ? result.error : "Login failed"
          );
        }
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  const formTitle = useMemo(
    () =>
      ({
        login: "Welcome Back",
        signup: "Create Account",
        reset: "Reset Password",
      }[mode]),
    [mode]
  );

  const formSubTitle = useMemo(
    () =>
      ({
        login: "Sign in to your TaskSphere account",
        signup: "Join TaskSphere and boost your productivity",
        reset: "Enter your email to receive a reset link",
      }[mode]),
    [mode]
  );

  const buttonText = useMemo(
    () =>
      ({
        login: "Sign In",
        signup: "Create Account",
        reset: "Send Reset Link",
      }[mode]),
    [mode]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="md">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-primary-600 rounded-full" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {formTitle}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">{formSubTitle}</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-700 dark:text-green-400 text-sm">
            {success}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "signup" && (
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Enter your full name"
                disabled={authLoading}
                autoComplete="name"
              />
            </div>
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Enter your email"
              disabled={authLoading}
              autoComplete="email"
            />
          </div>
        </div>

        {mode !== "reset" && (
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Enter your password"
                disabled={authLoading}
                autoComplete={
                  mode === "signup" ? "new-password" : "current-password"
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                disabled={authLoading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        )}

        {mode === "signup" && (
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Confirm your password"
                disabled={authLoading}
                autoComplete="new-password"
              />
            </div>
          </div>
        )}

        <Button
          type="submit"
          disabled={authLoading}
          className="w-full"
          size="lg"
        >
          {authLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
              {mode === "reset"
                ? "Sending..."
                : mode === "signup"
                ? "Creating Account..."
                : "Signing In..."}
            </div>
          ) : (
            buttonText
          )}
        </Button>
      </form>

      <div className="mt-4 text-center text-sm">
        {/* {mode === "login" && (
          <button
            onClick={() => handleModeChange("reset")}
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            disabled={authLoading}
          >
            Forgot your password?
          </button>
        )} */}

        {mode === "reset" && (
          <button
            onClick={() => handleModeChange("login")}
            className="flex items-center justify-center mx-auto text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            disabled={authLoading}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Sign In
          </button>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-600 dark:text-gray-400">
        {mode === "login"
          ? "Don't have an account?"
          : mode === "signup"
          ? "Already have an account?"
          : "Remember your password?"}
        <button
          onClick={() =>
            handleModeChange(mode === "login" ? "signup" : "login")
          }
          className="ml-1 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
          disabled={authLoading}
        >
          {mode === "login" ? "Sign up" : "Sign in"}
        </button>
      </div>
    </Modal>
  );
}
