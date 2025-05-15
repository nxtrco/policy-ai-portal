import { useState, useRef } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Send, 
  FileText, 
  History,
  ChevronRight,
  Sparkles,
  Upload,
  X,
  File,
  Copy,
  Check,
  Loader2
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Ask = () => {
  const [policyCategory, setPolicyCategory] = useState<"LSGO" | "HO">("LSGO");
  const [questionDocument, setQuestionDocument] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const questionFileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const handleSubmit = async () => {
    if (!questionDocument) {
      toast({
        variant: "destructive",
        title: "Missing document",
        description: "Please upload a question document",
      });
      return;
    }
    
    setIsLoading(true);
    setResponse(null);
    
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
      
      // Make API request to the correct endpoint
      const response = await fetch(
        "http://localhost:8000/api/v1/api/v1/complaints/generate-response",
        {
          method: "POST",
          headers: {
            "accept": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate response");
      }
      
      const data = await response.json();
      setResponse(data.data.formal_response);
      
      // Show success message
      toast({
        title: "Response generated",
        description: "The response has been successfully generated.",
      });
      
    } catch (error) {
      console.error("Error generating response:", error);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate response. Please try again.",
      });
      
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleQuestionFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setQuestionDocument(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleQuestionFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setQuestionDocument(e.target.files[0]);
    }
  };

  const removeQuestionDocument = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setQuestionDocument(null);
    if (questionFileInputRef.current) {
      questionFileInputRef.current.value = "";
    }
  };
  
  const copyToClipboard = () => {
    if (response) {
      navigator.clipboard.writeText(response);
      setCopied(true);
      
      toast({
        title: "Copied to clipboard",
        description: "Response has been copied to clipboard"
      });
      
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-140px)]">
        <div className={`${response ? "lg:col-span-2" : "lg:col-span-3"} flex flex-col h-full`}>
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
                  <Label htmlFor="LSGO">LGSCO</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="HO" id="HO" />
                  <Label htmlFor="HO">HO</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
          
          {/* Question document upload card */}
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
                      onClick={removeQuestionDocument}
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
              
              <div className="flex justify-end mt-4">
                <Button 
                  onClick={handleSubmit}
                  disabled={!questionDocument || isLoading}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Response display area */}
        {response && (
          <div className="lg:col-span-2 flex flex-col h-full">
            <Card className="flex-1 flex flex-col">
              <CardHeader className="py-4 px-6 border-b">
                <CardTitle className="text-lg flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-teal-600" />
                  Generated Response
                </CardTitle>
                <CardDescription>
                  Formal response based on your questions and policy
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-y-auto p-6">
                <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 shadow-sm">
                  <div className="prose prose-slate max-w-none">
                    {response.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 text-slate-700 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="border-t p-4 flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={copyToClipboard}
                  className="flex items-center"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy to Clipboard
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
        
        {!response && (
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader className="py-4 px-6">
                <CardTitle className="text-sm flex items-center">
                  <History className="h-4 w-4 mr-2 text-slate-500" />
                  Recent Submissions
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 py-2">
                <div className="space-y-3 text-sm">
                  <div className="truncate">Building Permits Questions.docx</div>
                  <div className="truncate">Planning Regulations.pdf</div>
                  <div className="truncate">Noise Restrictions.docx</div>
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
                  Features
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 py-2">
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-start space-x-2">
                    <FileText className="h-3 w-3 mt-0.5 text-teal-600 flex-shrink-0" />
                    <span>Upload question documents in various formats</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <FileText className="h-3 w-3 mt-0.5 text-teal-600 flex-shrink-0" />
                    <span>Select from different policy categories</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Ask;
