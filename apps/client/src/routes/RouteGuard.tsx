import { Navigate, Outlet } from 'react-router-dom';

type RouteProps = {
  isAllowed: boolean;
};

const RouteGuard = ({ isAllowed }: RouteProps) => {
  if (!isAllowed) {
    return <Navigate to={'/'} replace />;
  }
  return <Outlet />;
};

export default RouteGuard;
