import { Navigate } from "react-router-dom";
import type { UserDataType } from "../App";

export type ProtectedRouteProps = {
  user: UserDataType | null;
  children: React.ReactNode;
};

const ProtectedRoute = ({ user, children }: ProtectedRouteProps) => {
  if (!user) {
    return;
    <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;
