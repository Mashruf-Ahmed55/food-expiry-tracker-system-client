import axiosInstance from '@/api';
import { auth } from '@/firebase/firebase.config';
import {
  createUserWithEmailAndPassword,
  GithubAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import React, { createContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

// Types
interface User {
  id?: string;
  name: string;
  email: string;
  photo_url: string;
  password?: string;
  auth_type?: string;
}

interface AuthContextType {
  user: User | null;
  logout: () => Promise<void>;
  signInWithGoogleHandler: () => Promise<void>;
  signInWithGithubHandler: () => Promise<void>;
  signInWithEmailAndPasswordHandler: (data: {
    email: string;
    password: string;
  }) => Promise<void>;
  createUserWithEmailAndPasswordHandler: (data: User) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          name: firebaseUser.displayName as string,
          email: firebaseUser.email as string,
          photo_url: firebaseUser.photoURL as string,
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogleHandler = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const loggedInUser = result.user;

      const response = await axiosInstance.post(
        '/api/v1/users/signup',
        {
          name: loggedInUser.displayName,
          email: loggedInUser.email,
          photo_url: loggedInUser.photoURL,
          auth_type: 'google',
        },
        { withCredentials: true }
      );

      setUser({
        id: response.data.data.user._id,
        name: response.data.data.user.name,
        email: response.data.data.user.email,
        photo_url: response.data.data.user.photo_url,
      });
    } catch (error: any) {
      console.error('Google login error:', error);
      toast.error('Google sign-in failed.');
    }
  };
  const signInWithGithubHandler = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const loggedInUser = result.user;

      const response = await axiosInstance.post(
        '/api/v1/users/signup',
        {
          name: loggedInUser.displayName,
          email: loggedInUser.email,
          photo_url: loggedInUser.photoURL,
          auth_type: 'github',
        },
        { withCredentials: true }
      );

      setUser({
        id: response.data.data.user._id,
        name: response.data.data.user.name,
        email: response.data.data.user.email,
        photo_url: response.data.data.user.photo_url,
      });
    } catch (error: any) {
      console.error('Google login error:', error);
      toast.error('Google sign-in failed.');
    }
  };

  const createUserWithEmailAndPasswordHandler = async (data: User) => {
    const { email, password, name, photo_url } = data;

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password as string
      );

      await updateProfile(result.user, {
        displayName: name,
        photoURL: photo_url,
      });

      const response = await axiosInstance.post(
        '/api/v1/users/signup',
        {
          name,
          email,
          photo_url: photo_url as string,
          auth_type: 'email',
        },
        { withCredentials: true }
      );

      setUser({
        id: response.data.data.user._id,
        name: response.data.data.user.name,
        email: response.data.data.user.email,
        photo_url: response.data.data.user.photo_url,
      });
    } catch (error: any) {
      console.error('Email signup error:', error);
      toast.error('Sign up failed.');
    }
  };

  const signInWithEmailAndPasswordHandler = async (data: {
    email: string;
    password: string;
  }) => {
    const result = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
    const user = result.user;

    const response = await axiosInstance.post(
      '/api/v1/users/signin',
      { email: user.email },
      { withCredentials: true }
    );

    setUser({
      id: response.data.data.user._id,
      name: response.data.data.user.name,
      email: response.data.data.user.email,
      photo_url: response.data.data.user.photo_url,
    });

    toast.success('Signed in successfully.');
  };

  const logout = async () => {
    try {
      await signOut(auth);
      await axiosInstance
        .get('/api/v1/users/signout', {
          withCredentials: true,
        })
        .then((result) => {
          toast.success(result.data.message);
        });
      setUser(null);
    } catch (err) {
      toast.error('Logout failed.');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        logout,
        signInWithGoogleHandler,
        signInWithGithubHandler,
        signInWithEmailAndPasswordHandler,
        createUserWithEmailAndPasswordHandler,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
