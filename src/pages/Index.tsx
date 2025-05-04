
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
            Policy AI Portal
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Upload your council policies and get AI-powered insights and answers to your policy questions.
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
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-teal-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Upload Policies</h3>
            <p className="text-slate-600">Easily upload and manage your council policy documents in one place.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-teal-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
            <p className="text-slate-600">Get powerful AI-driven insights and analysis of your policy documents.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-teal-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Ask Questions</h3>
            <p className="text-slate-600">Ask questions about your policies and get accurate answers instantly.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
