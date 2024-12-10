import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute = ({ element }) => {
  const { auth, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!auth) return <Navigate to="/login" replace />;

  return element;
};

export default PrivateRoute;
