import { motion } from 'framer-motion';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useAuth from '@/hooks/useAuth';
import { Eye, EyeOff, Image, Lock, Mail, User } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { toast } from 'sonner';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  photo_url: string;
}

const Register = () => {
  const {
    createUserWithEmailAndPasswordHandler,
    signInWithGoogleHandler,
    signInWithGithubHandler,
  } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);

      // Validate password requirements
      const hasUppercase = /[A-Z]/.test(data.password);
      const hasLowercase = /[a-z]/.test(data.password);

      if (!hasUppercase) {
        toast.error('Password must contain at least one uppercase letter');
        setIsLoading(false);
        return;
      }

      if (!hasLowercase) {
        toast.error('Password must contain at least one lowercase letter');
        setIsLoading(false);
        return;
      }
      await createUserWithEmailAndPasswordHandler(data);
      toast.success('Account created successfully!');
      // navigate('/');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signInWithGoogleHandler()
      .then(() => {
        toast.success('Successfully registered with Google!');
        navigate('/');
      })
      .catch((error: any) => {
        toast.error('Google login failed. Please try again.');
        console.error('Google login error:', error);
        setIsLoading(false);
      });
  };
  const handleGithubSignIn = async () => {
    setIsLoading(true);
    await signInWithGithubHandler()
      .then(() => {
        toast.success('Successfully registered with Github!');
        navigate('/');
      })
      .catch((error: any) => {
        toast.error('Github login failed. Please try again.');
        console.error('Github login error:', error);
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-screen py-20 px-4 flex items-center justify-center bg-gray-50">
      <motion.div
        className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="px-6 py-8">
          <h2 className="text-center text-3xl font-bold text-gray-800 mb-6">
            Create an Account
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Join FreshTrack to start managing your food inventory
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </Label>
              <div className="relative">
                <Input
                  id="name"
                  type="text"
                  className={`pl-10 pr-4 py-2 w-full border ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                  placeholder="Your full name"
                  {...registerField('name', {
                    required: 'Name is required',
                  })}
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  className={`pl-10 pr-4 py-2 w-full border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                  placeholder="Your email address"
                  {...registerField('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="photoURL"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Profile Photo URL (optional)
              </Label>
              <div className="relative">
                <Input
                  id="photoURL"
                  type="url"
                  className={`pl-10 pr-4 py-2 w-full border ${
                    errors.photo_url ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                  placeholder="URL to your profile photo"
                  {...registerField('photo_url')}
                />
                <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
              {errors.photo_url && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.photo_url.message}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`pl-10 pr-10 py-2 w-full border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500`}
                  placeholder="Create a password"
                  {...registerField('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
              <ul className="mt-2 text-xs text-gray-500 space-y-1">
                <li className="flex items-center">
                  <span className="w-3 h-3 inline-block mr-1 bg-gray-200 rounded-full"></span>
                  At least 6 characters long
                </li>
                <li className="flex items-center">
                  <span className="w-3 h-3 inline-block mr-1 bg-gray-200 rounded-full"></span>
                  Include at least one uppercase letter
                </li>
                <li className="flex items-center">
                  <span className="w-3 h-3 inline-block mr-1 bg-gray-200 rounded-full"></span>
                  Include at least one lowercase letter
                </li>
              </ul>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white\"
                    xmlns="http://www.w3.org/2000/svg\"
                    fill="none\"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25\"
                      cx="12\"
                      cy="12\"
                      r="10\"
                      stroke="currentColor\"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white font-medium text-gray-700 hover:bg-gray-50 transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M21.8,12.1c0-0.7-0.1-1.3-0.2-2H12v3.8h5.5c-0.2,1.2-1,2.3-2.1,3v2.5h3.3C20.9,17.2,21.8,14.8,21.8,12.1z"
                  />
                  <path
                    fill="#34A853"
                    d="M12,22c2.8,0,5.1-0.9,6.8-2.5l-3.3-2.5c-0.9,0.6-2.1,1-3.5,1c-2.7,0-4.9-1.8-5.8-4.2H2.9v2.6C4.6,19.7,8,22,12,22z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M6.2,13.8c-0.2-0.6-0.3-1.2-0.3-1.8s0.1-1.2,0.3-1.8V7.6H2.9C2.3,9,2,10.4,2,12s0.3,3,0.9,4.4L6.2,13.8z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12,5.8c1.5,0,2.9,0.5,3.9,1.5l2.9-2.9C17,2.7,14.7,1.8,12,1.8C8,1.8,4.6,4.1,2.9,7.6l3.3,2.6C7.1,7.6,9.3,5.8,12,5.8z"
                  />
                </svg>
                Google
              </Button>
              <Button
                type="button"
                onClick={handleGithubSignIn}
                disabled={isLoading}
                className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white font-medium text-gray-700 hover:bg-gray-50 transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <FaGithub className="w-5 h-5 mr-2" />
                Github
              </Button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-green-600 hover:text-green-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
