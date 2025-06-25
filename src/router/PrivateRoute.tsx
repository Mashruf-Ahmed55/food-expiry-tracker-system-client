import useAuth from '@/hooks/useAuth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

interface AuthRouteProps {
  children: React.ReactNode;
  isPrivate?: boolean;
  redirectTo?: string;
}

const AuthRoute: React.FC<AuthRouteProps> = ({
  children,
  isPrivate = false,
  redirectTo = isPrivate ? '/login' : '/',
}) => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isPrivate && !currentUser?.email) {
      navigate(redirectTo, { replace: true });
    } else if (!isPrivate && currentUser?.email) {
      navigate(redirectTo, { replace: true });
    }
  }, [currentUser, isPrivate, redirectTo, navigate]);

  return <>{children}</>;
};

export default AuthRoute;
