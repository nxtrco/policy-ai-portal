import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    (() => {
      const accessToken = localStorage.getItem("access_token");
      console.log({ accessToken });

      if (!accessToken) {
        // Redirect to login if there's no access token
        navigate("/login");
      }
    })();
  }, [window !== undefined]);

  return <>{children}</>;
};

export default ProtectedRoute;
