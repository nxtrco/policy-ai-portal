
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-slate-800">
            Complaints AI Portal
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            A GDPR-safe tool that generates professional complaint responses by drawing on guidance from the various Ombudsmen.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-teal-600 hover:bg-teal-700"
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/about")}
            >
              Learn More
            </Button>
          </div>
        </div>
        
        
      </div>
    </div>
  );
};

export default Index;
