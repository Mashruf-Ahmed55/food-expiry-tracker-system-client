
import { AuthContext } from '@/context/userContext';
import { useContext } from 'react';

export default function useAuth() {
  const userContext = useContext(AuthContext);
  if (!userContext) {
    throw new Error('useAuth must be used within a UserProvider');
  }
  return userContext;
}
