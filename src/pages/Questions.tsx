import { useState, useRef } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Send, 
  MessageSquare,
  Upload,
  X,
  File,
  PenLine,
  CheckCircle,
  HelpCircle
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ExtractedData {
  extracted_reasons: string[];
  actionable_questions: string[];
}

interface Message {
  id: number;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  extractedData?: ExtractedData;
}

const Questions = () => {
  // State for general questions
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hello! I can help you extract key issues and actionable questions from your complaint text or document. Please enter your complaint or upload a document.",
      sender: "ai",
      timestamp: new Date()
    }
  ]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [inputMode, setInputMode] = useState<"text" | "file">("text");
  
  const handleSendMessage = async () => {
    if ((!query.trim() && inputMode === "text") || (inputMode === "file" && !uploadedFile)) {
      toast({
        variant: "destructive",
        title: "Missing input",
        description: inputMode === "text" ? "Please enter a complaint text" : "Please upload a document",
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
      
      if (inputMode === "text") {
        formData.append("complaint_format", "Manual");
        formData.append("complaint_text", query);
      } else if (uploadedFile) {
        formData.append("complaint_format", getFileFormat(uploadedFile.name));
        formData.append("complaint_file", uploadedFile);
      }
      
      // Make API request
      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/api/v1/complaints/extract-questions",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "accept": "application/json"
          },
          body: formData,
        }
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to extract questions");
      }
      
      // Create AI response with extracted data
      const aiResponse: Message = {
        id: messages.length + 2,
        content: "I've analyzed your complaint and extracted the following information:",
        sender: "ai",
        timestamp: new Date(),
        extractedData: data.data
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
      console.error("Error extracting questions:", error);
      
      // Add error message
      const errorMessage: Message = {
        id: messages.length + 2,
        content: `Error: ${error instanceof Error ? error.message : "Failed to extract questions. Please try again."}`,
        sender: "ai",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
    } finally {
      setIsLoading(false);
    }
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Questions</h1>
        <p className="text-slate-500">Extract key issues and actionable questions from complaints</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 h-[calc(100vh-180px)]">
        <Card className="flex-1 flex flex-col overflow-hidden">
          <CardHeader className="py-4 px-6">
            <CardTitle className="text-lg flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-teal-600" />
              Complaint Analysis
            </CardTitle>
            <CardDescription>
              Enter complaint text or upload a document to extract key issues and questions
            </CardDescription>
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
                  
                  {/* Display extracted data if available */}
                  {message.extractedData && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <h4 className="text-sm font-medium flex items-center mb-2">
                          <CheckCircle className="h-4 w-4 mr-1 text-teal-600" />
                          Extracted Issues:
                        </h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {message.extractedData.extracted_reasons.map((reason, index) => (
                            <li key={index} className="text-sm">{reason}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium flex items-center mb-2">
                          <HelpCircle className="h-4 w-4 mr-1 text-teal-600" />
                          Actionable Questions:
                        </h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {message.extractedData.actionable_questions.map((question, index) => (
                            <li key={index} className="text-sm">{question}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  
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
                <PenLine className="h-4 w-4 mr-2" />
                Write Complaint
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
              <div className="space-y-3">
                <Textarea
                  placeholder="Enter your complaint text here..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex justify-end">
                  <Button 
                    className="bg-teal-600 hover:bg-teal-700" 
                    onClick={handleSendMessage}
                    disabled={!query.trim() || isLoading}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Analyze
                  </Button>
                </div>
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
                    <Send className="h-4 w-4 mr-2" />
                    Analyze Document
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Questions;
