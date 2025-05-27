import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Search,
  MessageSquare,
  Shield,
  Clock,
  ArrowRight,
  Sparkles,
  BookOpen,
  CheckCircle
} from "lucide-react";

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: any; 
  title: string; 
  description: string;
}) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardContent className="pt-6">
      <div className="flex items-start space-x-4">
        <div className="bg-teal-100 p-3 rounded-full">
          <Icon className="h-5 w-5 text-teal-600" />
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">{title}</h3>
          <p className="text-slate-600 text-sm">{description}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FileText,
      title: "Complaint Document Analysis",
      description: "Upload and analyze complaint documents with our advanced AI system. Get instant insights and interpretations of complex complaint details."
    },
    {
      icon: Search,
      title: "Smart Complaint Processing",
      description: "Process complaints efficiently with AI-powered analysis. Get accurate categorization and priority assessment based on complaint content."
    },
    {
      icon: MessageSquare,
      title: "Response Generation",
      description: "Generate professional, compliant responses to complaints using our AI-powered system. Save time while maintaining quality and consistency."
    },
    {
      icon: Shield,
      title: "Compliance Assurance",
      description: "Ensure all responses align with official guidelines and regulations. Our system maintains consistency and compliance in complaint handling."
    }
  ];

  const benefits = [
    "Reduced response time for complaints",
    "Consistent and accurate complaint handling",
    "Automated response generation",
    "Improved compliance with regulations",
    "Enhanced efficiency in complaint management",
    "24/7 availability for complaint processing"
  ];

  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Welcome to Complaints Management Portal</h1>
        <p className="text-slate-600 max-w-3xl">
          Your intelligent assistant for complaint management, response generation, and automated handling. 
          Streamline your workflow and ensure consistent, compliant communications for all complaints.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg mb-2">Process Complaint</h3>
                <p className="text-slate-600 text-sm mb-4">
                  Upload and process new complaints with AI assistance
                </p>
                <Button 
                  onClick={() => navigate("/ask")}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  Start Processing <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <Sparkles className="h-12 w-12 text-teal-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg mb-2">Generate Response</h3>
                <p className="text-slate-600 text-sm mb-4">
                  Create compliant responses to complaints automatically
                </p>
                <Button 
                  onClick={() => navigate("/ask")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Generate Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <MessageSquare className="h-12 w-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="h-5 w-5 text-teal-600 mr-2" />
            System Benefits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                <span className="text-slate-600">{benefit}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Dashboard;
