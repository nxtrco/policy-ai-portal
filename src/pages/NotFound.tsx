
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center max-w-md px-4">
        <h1 className="text-6xl font-bold text-teal-600 mb-4">404</h1>
        <p className="text-xl text-slate-700 mb-6">Oops! Page not found</p>
        <p className="text-slate-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="space-x-4">
          <Button 
            onClick={() => navigate("/")}
            className="bg-teal-600 hover:bg-teal-700"
          >
            Go to Home
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
