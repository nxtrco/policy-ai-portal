
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Send, 
  FileText, 
  Bot,
  FileQuestion,
  History,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
  id: number;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const sampleQuestions = [
  "What are the key requirements for building permits?",
  "Explain the waste management policy",
  "What are the noise restrictions in residential areas?",
  "How does the council handle planning objections?"
];

const recentPolicies = [
  {
    id: 1,
    title: "Public Safety Guidelines",
    questions: 12
  },
  {
    id: 2,
    title: "Environmental Protection Policy",
    questions: 8
  },
  {
    id: 3,
    title: "Urban Development Framework",
    questions: 5
  }
];

const Ask = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hello! I'm your AI policy assistant. How can I help you today?",
      sender: "ai",
      timestamp: new Date()
    }
  ]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSendMessage = () => {
    if (!query.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      content: query,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setQuery("");
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        content: generateAIResponse(query),
        sender: "ai",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };
  
  const handleSampleQuestion = (question: string) => {
    setQuery(question);
  };
  
  // Generate a simulated AI response based on the query
  const generateAIResponse = (query: string) => {
    if (query.toLowerCase().includes("building permit") || query.toLowerCase().includes("permits")) {
      return "According to the council's Building Permit Policy (2023), all construction projects require a permit if they involve structural changes, increase the building footprint, or alter the exterior appearance. Applications must be submitted at least 30 days before commencing work and include detailed plans, engineer certifications for larger projects, and the appropriate fees based on project value. Emergency repairs may qualify for expedited permits under section 4.3 of the policy.";
    } else if (query.toLowerCase().includes("waste") || query.toLowerCase().includes("recycling")) {
      return "The Municipal Waste Management Policy (2022) states that residential waste collection occurs weekly on designated days for each neighborhood. Recycling is collected bi-weekly, and hazardous waste must be taken to designated collection centers. The policy emphasizes reducing landfill waste through the 3Rs (Reduce, Reuse, Recycle) program. Commercial entities must arrange private waste collection services and comply with the Commercial Waste Disposal Guidelines (Section 7).";
    } else if (query.toLowerCase().includes("noise") || query.toLowerCase().includes("restriction")) {
      return "The council's Noise Control Ordinance specifies that in residential areas, noise levels must not exceed 55 decibels between 7:00 AM and 10:00 PM, and 45 decibels between 10:00 PM and 7:00 AM. Construction noise is only permitted on weekdays from 8:00 AM to 6:00 PM and Saturdays from 9:00 AM to 5:00 PM. Special permits are required for events or construction work outside these hours. Fines for violations range from $250 to $1,000 based on the severity and frequency of infractions.";
    } else if (query.toLowerCase().includes("planning") || query.toLowerCase().includes("objection")) {
      return "According to the Planning Objections Process (2023), residents can file objections to planning applications within 14 days of public notification. Objections must be submitted in writing, clearly stating the specific concerns and how the proposed development impacts the objector. The council reviews all objections and may call for a planning committee meeting where objectors can present their concerns. The policy emphasizes that objections should relate to planning considerations (e.g., traffic, environment, privacy) rather than personal preferences or property values.";
    } else {
      return "Based on our council policies, I couldn't find specific information about that query. Would you like me to search for related topics or would you prefer to rephrase your question? You can also upload additional policy documents if you believe the information should be available but isn't in our current database.";
    }
  };
  
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-140px)]">
        <div className="lg:col-span-3 flex flex-col h-full">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-slate-800">Ask About Policies</h1>
            <p className="text-slate-500">Ask questions about your council policies</p>
          </div>
          
          <Card className="flex-1 flex flex-col overflow-hidden">
            <CardHeader className="py-4 px-6">
              <CardTitle className="text-lg flex items-center">
                <Bot className="h-5 w-5 mr-2 text-teal-600" />
                AI Policy Assistant
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.sender === "user" 
                        ? "bg-teal-600 text-white" 
                        : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    {message.sender === "ai" && (
                      <div className="flex items-center mb-2">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="bg-teal-100 text-teal-600 text-xs">AI</AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium">AI Assistant</span>
                      </div>
                    )}
                    <p className={message.sender === "user" ? "text-white" : "text-slate-800"}>
                      {message.content}
                    </p>
                    <div className={`text-xs mt-1 ${message.sender === "user" ? "text-teal-100" : "text-slate-500"}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 rounded-lg p-4 max-w-[80%]">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            
            <div className="p-4 border-t bg-white">
              <div className="flex items-center">
                <Input
                  placeholder="Ask a question about your policies..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button 
                  className="ml-2 bg-teal-600 hover:bg-teal-700" 
                  onClick={handleSendMessage}
                  disabled={!query.trim() || isLoading}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-xs text-slate-500 py-1">Try asking:</span>
                {sampleQuestions.map((question, index) => (
                  <Button 
                    key={index} 
                    variant="outline" 
                    size="sm" 
                    className="text-xs py-1 h-auto"
                    onClick={() => handleSampleQuestion(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="py-4 px-6">
              <CardTitle className="text-sm flex items-center">
                <FileText className="h-4 w-4 mr-2 text-slate-500" />
                Recent Policies
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 py-2">
              <div className="space-y-3">
                {recentPolicies.map((policy) => (
                  <div key={policy.id} className="flex items-center justify-between text-sm">
                    <div className="truncate flex-1">{policy.title}</div>
                    <div className="text-xs text-slate-500">{policy.questions} Q's</div>
                  </div>
                ))}
                <Button variant="ghost" size="sm" className="w-full text-xs justify-start mt-2">
                  View all policies <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-4 px-6">
              <CardTitle className="text-sm flex items-center">
                <History className="h-4 w-4 mr-2 text-slate-500" />
                Recent Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 py-2">
              <div className="space-y-3 text-sm">
                <div className="truncate">What are the building permit requirements?</div>
                <div className="truncate">How do I appeal a planning decision?</div>
                <div className="truncate">Explain the noise restrictions in our area</div>
                <Button variant="ghost" size="sm" className="w-full text-xs justify-start mt-2">
                  View history <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-4 px-6">
              <CardTitle className="text-sm flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-slate-500" />
                AI Features
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 py-2">
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-start space-x-2">
                  <FileQuestion className="h-3 w-3 mt-0.5 text-teal-600 flex-shrink-0" />
                  <span>Ask questions in natural language</span>
                </div>
                <div className="flex items-start space-x-2">
                  <FileQuestion className="h-3 w-3 mt-0.5 text-teal-600 flex-shrink-0" />
                  <span>Reference across multiple policies</span>
                </div>
                <div className="flex items-start space-x-2">
                  <FileQuestion className="h-3 w-3 mt-0.5 text-teal-600 flex-shrink-0" />
                  <span>Get accurate policy citations</span>
                </div>
                <Separator className="my-2" />
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Upgrade for more features
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Ask;
