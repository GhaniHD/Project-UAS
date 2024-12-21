import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ element }) => {
  const { auth, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!auth) return <Navigate to="/login" replace />;

  return element;
};

PrivateRoute.propTypes = {
  element: PropTypes.node.isRequired, // Validasi untuk elemen React
};

export default PrivateRoute;
