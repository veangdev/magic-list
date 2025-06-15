import { useState } from 'react';
import { X, Eye, EyeOff, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: any) => void;
}

type AuthMode = 'login' | 'signup' | 'reset';

export function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setError('');
    setSuccess('');
    setShowPassword(false);
  };

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
    resetForm();
  };

  const validateForm = () => {
    if (!formData.email) {
      setError('Email is required');
      return false;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }

    if (mode !== 'reset') {
      if (!formData.password) {
        setError('Password is required');
        return false;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return false;
      }
    }

    if (mode === 'signup') {
      if (!formData.name) {
        setError('Name is required');
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (mode === 'reset') {
        setSuccess('Password reset link sent to your email!');
        setTimeout(() => {
          handleModeChange('login');
        }, 2000);
      } else {
        // Simulate successful authentication
        const user = {
          id: 'user-1',
          name: mode === 'signup' ? formData.name : 'John Doe',
          email: formData.email,
          avatar: null,
          points: mode === 'signup' ? 0 : 1250,
          streak: mode === 'signup' ? 0 : 7,
        };

        onAuthSuccess(user);
        onClose();
        resetForm();
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Welcome Back';
      case 'signup': return 'Create Account';
      case 'reset': return 'Reset Password';
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'login': return 'Sign in to your TaskSphere account';
      case 'signup': return 'Join TaskSphere and boost your productivity';
      case 'reset': return 'Enter your email to receive a reset link';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="md">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-primary-600 rounded-full" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {getTitle()}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {getSubtitle()}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg">
          <p className="text-error-700 dark:text-error-400 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-lg">
          <p className="text-success-700 dark:text-success-400 text-sm">{success}</p>
        </div>
      )}

      <div className="space-y-4">
        {mode === 'signup' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Enter your full name"
                disabled={loading}
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>
        </div>

        {mode !== 'reset' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Enter your password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        )}

        {mode === 'signup' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Confirm your password"
                disabled={loading}
              />
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 space-y-4">
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
              {mode === 'reset' ? 'Sending...' : mode === 'signup' ? 'Creating Account...' : 'Signing In...'}
            </div>
          ) : (
            mode === 'reset' ? 'Send Reset Link' : mode === 'signup' ? 'Create Account' : 'Sign In'
          )}
        </Button>

        {mode === 'login' && (
          <div className="text-center">
            <button
              onClick={() => handleModeChange('reset')}
              className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              disabled={loading}
            >
              Forgot your password?
            </button>
          </div>
        )}

        {mode === 'reset' && (
          <div className="text-center">
            <button
              onClick={() => handleModeChange('login')}
              className="text-sm text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex items-center justify-center"
              disabled={loading}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Sign In
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          {mode === 'login' ? "Don't have an account?" : mode === 'signup' ? "Already have an account?" : "Remember your password?"}
          <button
            onClick={() => handleModeChange(mode === 'login' ? 'signup' : 'login')}
            className="ml-1 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
            disabled={loading}
          >
            {mode === 'login' ? 'Sign up' : mode === 'signup' ? 'Sign in' : 'Sign in'}
          </button>
        </div>
      </div>
    </Modal>
  );
}