import { useState, useRef, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Send, 
  FileText, 
  Bot,
  FileQuestion,
  History,
  ChevronRight,
  Sparkles,
  Upload,
  X,
  File
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Message {
  id: number;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

// Mock policy data for UI display only
const policiesData = [
  {
    id: 1,
    title: "Public Safety Guidelines",
    uploadDate: "2023-04-15",
    status: "Active",
    questions: 12
  },
  {
    id: 2,
    title: "Environmental Protection Policy",
    uploadDate: "2023-05-01",
    status: "Active",
    questions: 8
  },
  {
    id: 3,
    title: "Urban Development Framework",
    uploadDate: "2023-05-10",
    status: "Draft",
    questions: 5
  },
  {
    id: 4,
    title: "Community Engagement Standards",
    uploadDate: "2023-04-22",
    status: "Active",
    questions: 9
  }
];

const sampleQuestions = [
  "What are the key requirements for building permits?",
  "Explain the waste management policy",
  "What are the noise restrictions in residential areas?",
  "How does the council handle planning objections?"
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
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State for policy selection
  const [policyCategory, setPolicyCategory] = useState<"LSGO" | "HO">("LSGO");
  const [selectedPolicy, setSelectedPolicy] = useState<string>("default-policy"); // Set a default value
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [inputMode, setInputMode] = useState<"text" | "file">("text");
  
  // Add state for question document
  const [questionDocument, setQuestionDocument] = useState<File | null>(null);
  const questionFileInputRef = useRef<HTMLInputElement>(null);
  
  const handleSendMessage = async () => {
    if ((!query.trim() && inputMode === "text") || (inputMode === "file" && !uploadedFile)) {
      toast({
        variant: "destructive",
        title: "Missing input",
        description: inputMode === "text" ? "Please enter a question" : "Please upload a document",
      });
      return;
    }
    
    // Add validation for question document
    if (!questionDocument) {
      toast({
        variant: "destructive",
        title: "Missing question document",
        description: "Please upload a question document",
      });
      return;
    }
    
    // Add user message
    const userMessageContent = inputMode === "text" 
      ? query 
      : `Uploaded document: ${uploadedFile?.name}`;
    
    const userMessage: Message = {
      id: messages.length + 1,
      content: userMessageContent,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Get the access token from localStorage
      const accessToken = localStorage.getItem("access_token");
      
      if (!accessToken) {
        throw new Error("Authentication token not found");
      }
      
      // Create form data for API request
      const formData = new FormData();
      
      // Add stage_one_details (empty string as shown in the example)
      formData.append("stage_one_details", "string");
      
      // Add ombudsman (policy category)
      formData.append("ombudsman", policyCategory);
      
      // Add question document
      formData.append("question_answers", questionDocument);
      
      if (inputMode === "text") {
        formData.append("complaint_format", "Manual");
        formData.append("complaint_text", query);
      } else if (uploadedFile) {
        formData.append("complaint_format", getFileFormat(uploadedFile.name));
        formData.append("complaint_file", uploadedFile);
      }
      
      // Make API request to the correct endpoint
      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/api/v1/complaints/generate-response",
        {
          method: "POST",
          headers: {
            "accept": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to generate response");
      }
      
      // Add AI response - extract formal_response from data.data
      const aiResponse: Message = {
        id: messages.length + 2,
        content: data.data?.formal_response || "I've analyzed your query but couldn't generate a specific response.",
        sender: "ai",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      
      // Reset input fields
      setQuery("");
      if (inputMode === "file") {
        setUploadedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
      
    } catch (error) {
      console.error("Error generating response:", error);
      
      // Add error message
      const errorMessage: Message = {
        id: messages.length + 2,
        content: `Error: ${error instanceof Error ? error.message : "Failed to generate response. Please try again."}`,
        sender: "ai",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSampleQuestion = (question: string) => {
    setInputMode("text");
    setQuery(question);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFile(e.target.files[0]);
      setInputMode("file");
    }
  };
  
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setUploadedFile(e.dataTransfer.files[0]);
      setInputMode("file");
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const removeUploadedFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  // Add handlers for question document upload
  const handleQuestionFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setQuestionDocument(e.target.files[0]);
    }
  };

  const handleQuestionFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setQuestionDocument(e.dataTransfer.files[0]);
    }
  };

  const removeQuestionDocument = () => {
    setQuestionDocument(null);
    if (questionFileInputRef.current) {
      questionFileInputRef.current.value = "";
    }
  };
  
  // Generate a simulated AI response based on the query
  const generateAIResponse = (query: string, policyTitle: string, questionDocName: string = "") => {
    // Include reference to the question document in responses
    const questionDocRef = questionDocName ? ` based on questions from "${questionDocName}"` : "";
    
    if (query.toLowerCase().includes("building permit") || query.toLowerCase().includes("permits")) {
      return `According to ${policyTitle}${questionDocRef}, all construction projects require a permit if they involve structural changes, increase the building footprint, or alter the exterior appearance. Applications must be submitted at least 30 days before commencing work and include detailed plans, engineer certifications for larger projects, and the appropriate fees based on project value. Emergency repairs may qualify for expedited permits under section 4.3 of the policy.`;
    } else if (query.toLowerCase().includes("waste") || query.toLowerCase().includes("recycling")) {
      return `The ${policyTitle}${questionDocRef} states that residential waste collection occurs weekly on designated days for each neighborhood. Recycling is collected bi-weekly, and hazardous waste must be taken to designated collection centers. The policy emphasizes reducing landfill waste through the 3Rs (Reduce, Reuse, Recycle) program. Commercial entities must arrange private waste collection services and comply with the Commercial Waste Disposal Guidelines (Section 7).`;
    } else if (query.toLowerCase().includes("noise") || query.toLowerCase().includes("restriction")) {
      return `The ${policyTitle}${questionDocRef} specifies that in residential areas, noise levels must not exceed 55 decibels between 7:00 AM and 10:00 PM, and 45 decibels between 10:00 PM and 7:00 AM. Construction noise is only permitted on weekdays from 8:00 AM to 6:00 PM and Saturdays from 9:00 AM to 5:00 PM. Special permits are required for events or construction work outside these hours. Fines for violations range from $250 to $1,000 based on the severity and frequency of infractions.`;
    } else if (query.toLowerCase().includes("planning") || query.toLowerCase().includes("objection")) {
      return `According to the ${policyTitle}${questionDocRef}, residents can file objections to planning applications within 14 days of public notification. Objections must be submitted in writing, clearly stating the specific concerns and how the proposed development impacts the objector. The council reviews all objections and may call for a planning committee meeting where objectors can present their concerns. The policy emphasizes that objections should relate to planning considerations (e.g., traffic, environment, privacy) rather than personal preferences or property values.`;
    } else if (query.toLowerCase().includes("document") || query.toLowerCase().includes("uploaded")) {
      return `I've analyzed the uploaded document related to ${policyTitle}${questionDocRef}. The document contains information about council procedures and policies. Key points include requirements for public consultations, environmental impact assessments, and approval workflows. The document references several sections of the Local Government Act and provides guidelines for implementation at the council level.`;
    } else {
      return `Based on ${policyTitle}${questionDocRef}, I couldn't find specific information about that query. Would you like me to search for related topics or would you prefer to rephrase your question? You can also upload additional policy documents if you believe the information should be available but isn't in our current database.`;
    }
  };
  
  // Helper function to determine file format for API
  const getFileFormat = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'Pdf';
      case 'docx':
        return 'Docx';
      case 'txt':
        return 'Txt';
      default:
        return 'Manual'; // Default
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
          
          {/* Policy selection card - simplified */}
          <Card className="mb-4">
            <CardHeader className="py-4 px-6">
              <CardTitle className="text-lg">Select Policy Category</CardTitle>
              <CardDescription>Choose which policy category to query</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={policyCategory} 
                onValueChange={(value) => setPolicyCategory(value as "LSGO" | "HO")}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="LSGO" id="LSGO" />
                  <Label htmlFor="LSGO">LSGO</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="HO" id="HO" />
                  <Label htmlFor="HO">HO</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
          
          {/* Add this card right after the policy category card */}
          <Card className="mb-4">
            <CardHeader className="py-4 px-6">
              <CardTitle className="text-lg flex items-center">
                <FileText className="h-4 w-4 mr-2 text-slate-500" />
                Upload Question Document
              </CardTitle>
              <CardDescription>
                Upload a document containing your questions (required)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-slate-50 transition-colors"
                onDrop={handleQuestionFileDrop}
                onDragOver={handleDragOver}
                onClick={() => questionFileInputRef.current?.click()}
              >
                {!questionDocument ? (
                  <>
                    <Upload className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                    <p className="text-sm text-slate-600">
                      Drop your question document here, or click to browse
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Supports PDF, DOCX, TXT files up to 10MB
                    </p>
                  </>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <File className="h-6 w-6 text-teal-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-left">{questionDocument.name}</p>
                        <p className="text-xs text-slate-500 text-left">
                          {Math.round(questionDocument.size / 1024)} KB
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeQuestionDocument();
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <input 
                  type="file"
                  ref={questionFileInputRef}
                  className="hidden"
                  accept=".pdf,.docx,.txt"
                  onChange={handleQuestionFileChange}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Chat interface */}
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
                          <AvatarImage src=""/>
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
              {/* Input mode toggle buttons */}
              <div className="flex mb-3 gap-2">
                <Button 
                  variant={inputMode === "text" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setInputMode("text")}
                  className={inputMode === "text" ? "bg-teal-600 hover:bg-teal-700" : ""}
                >
                  <FileQuestion className="h-4 w-4 mr-2" />
                  Write Question
                </Button>
                <Button 
                  variant={inputMode === "file" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setInputMode("file")}
                  className={inputMode === "file" ? "bg-teal-600 hover:bg-teal-700" : ""}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </div>
              
              {inputMode === "text" ? (
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
              ) : (
                <div>
                  <div 
                    className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-slate-50 transition-colors"
                    onDrop={handleFileDrop}
                    onDragOver={handleDragOver}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {!uploadedFile ? (
                      <>
                        <Upload className="h-8 w-8 mx-auto text-slate-400 mb-2" />
                        <p className="text-sm text-slate-600">
                          Drop your file here, or click to browse
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Supports PDF, DOCX, TXT files up to 10MB
                        </p>
                      </>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <File className="h-6 w-6 text-teal-600 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-left">{uploadedFile.name}</p>
                            <p className="text-xs text-slate-500 text-left">
                              {Math.round(uploadedFile.size / 1024)} KB
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeUploadedFile();
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <input 
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept=".pdf,.docx,.txt"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className="flex justify-end mt-2">
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!uploadedFile || isLoading}
                      className="bg-teal-600 hover:bg-teal-700"
                    >
                      Submit Document
                    </Button>
                  </div>
                </div>
              )}
              
              {inputMode === "text" && (
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
              )}
            </div>
          </Card>
        </div>
        
        {/* Right sidebar - hidden on mobile */}
        <div className={`space-y-6 ${isMobile ? 'hidden' : 'block'}`}>
          <Card>
            <CardHeader className="py-4 px-6">
              <CardTitle className="text-sm flex items-center">
                <FileText className="h-4 w-4 mr-2 text-slate-500" />
                Recent Policies
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 py-2">
              <div className="space-y-3">
                {policiesData.slice(0, 3).map((policy) => (
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
