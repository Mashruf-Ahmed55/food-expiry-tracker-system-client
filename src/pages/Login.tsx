import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useAuth from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaGithub } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';

interface LoginFormData {
  email: string;
  password: string;
}

const Login = () => {
  const {
    signInWithGoogleHandler,
    signInWithGithubHandler,
    signInWithEmailAndPasswordHandler,
  } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    await signInWithEmailAndPasswordHandler({
      email: data.email,
      password: data.password,
    })
      .then(() => {
        toast.success('Successfully logged in!');
        navigate('/');
      })
      .catch((error) => {
        toast.error('Login failed. Please check your credentials.');
        console.error('Login error:', error);
      });
  };

  const handleGoogleSignIn = async () => {
    await signInWithGoogleHandler()
      .then(() => {
        toast.success('Successfully logged in with Google!');
        navigate('/');
      })
      .catch((error) => {
        toast.error('Google login failed. Please try again.');
        console.error('Google login error:', error);
      });
  };
  const handleGithubSignIn = async () => {
    await signInWithGithubHandler()
      .then(() => {
        toast.success('Successfully logged in with Github!');
        navigate('/');
      })
      .catch((error) => {
        toast.error('Github login failed. Please try again.');
        console.error('Github login error:', error);
      });
  };

  return (
    <div className="min-h-screen w-full py-20 px-4 flex items-center justify-center bg-gray-50">
      <motion.div
        className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="px-6 py-8">
          <h2 className="text-center text-3xl font-bold text-gray-800 mb-6">
            Welcome Back
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Sign in to access your food inventory
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                  {...register('email', {
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
                  placeholder="Your password"
                  {...register('password', {
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
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
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
            </div>

            <Button
              type="submit"
              className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              Sign In
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
                onClick={handleGoogleSignIn}
                type="button"
                className=" py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white font-medium text-gray-700 hover:bg-gray-50 transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
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
                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white font-medium text-gray-700 hover:bg-gray-50 transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <FaGithub className="w-5 h-5 mr-2" />
                Github
              </Button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-green-600 hover:text-green-500"
            >
              Register now
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
