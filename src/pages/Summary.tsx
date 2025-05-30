import { useState, useRef } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

import {
  FileText,
  Upload,
  File,
  X,
  Send,
  Copy,
  Check,
  Loader2,
  FileUp,
} from "lucide-react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { apiFetch } from '@/lib/api';

const Summary = () => {
  const [inputMode, setInputMode] = useState<"text" | "file">("text");
  const [textInput, setTextInput] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (inputMode === "text" && !textInput.trim()) {
      toast({
        variant: "destructive",
        title: "Missing input",
        description: "Please enter text to summarise",
      });
      return;
    }

    if (inputMode === "file" && !uploadedFile) {
      toast({
        variant: "destructive",
        title: "Missing file",
        description: "Please upload a document to summarise",
      });
      return;
    }

    setIsLoading(true);
    setSummary(null);

    try {
      const accessToken = localStorage.getItem("access_token");

      if (!accessToken) {
        throw new Error("Authentication token not found");
      }

      const formData = new FormData();

      if (inputMode === "text") {
        formData.append("content_format", "Manual");
        formData.append("content_text", textInput);
      } else if (uploadedFile) {
        formData.append("content_format", getFileFormat(uploadedFile.name));
        formData.append("content_file", uploadedFile);
      }

      const response = await apiFetch(
        "https://complain-management-be-1079206590069.europe-west1.run.app/api/v1/complaints/generate-summary",
        {
          method: "POST",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate summary");
      }

      const data = await response.json();
      setSummary(data.data.summary);

      toast({
        title: "Summary generated",
        description: "Your document has been successfully summarised",
      });
    } catch (error) {
      console.error("Error generating summary:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to generate summary",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeUploadedFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const copyToClipboard = () => {
    if (summary) {
      navigator.clipboard.writeText(summary);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Summary has been copied to clipboard",
      });

      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getFileFormat = (filename: string): string => {
    const extension = filename.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return "Pdf";
      case "docx":
        return "Docx";
      case "txt":
        return "Txt";
      default:
        return "Manual";
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Document Summary</h1>
        <p className="text-slate-500">
          Generate concise summaries from text or documents
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-teal-600" />
              Input Content
            </CardTitle>
            <CardDescription>
              Enter text or upload a document to summarise
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs
              defaultValue="text"
              onValueChange={(value) =>
                setInputMode(value as "text" | "file")
              }
            >
              <TabsList className="mb-4 w-full">
                <TabsTrigger value="text" className="flex-1">
                  Text Input
                </TabsTrigger>
                <TabsTrigger value="file" className="flex-1">
                  Document Upload
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text">
                <Textarea
                  placeholder="Enter the text you want to summarise..."
                  className="min-h-[300px] resize-none"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                />
              </TabsContent>

              <TabsContent value="file">
                <div
                  className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-slate-50 transition-colors min-h-[300px] flex flex-col items-center justify-center"
                  onDrop={handleFileDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {!uploadedFile ? (
                    <>
                      <FileUp className="h-12 w-12 text-slate-400 mb-4" />
                      <p className="text-sm text-slate-600 mb-2">
                        Drop your file here, or click to browse
                      </p>
                      <p className="text-xs text-slate-500">
                        Supports PDF, DOCX, TXT files up to 10MB
                      </p>
                    </>
                  ) : (
                    <div className="flex flex-col items-center">
                      <File className="h-12 w-12 text-teal-600 mb-4" />
                      <p className="text-sm font-medium">
                        {uploadedFile.name}
                      </p>
                      <p className="text-xs text-slate-500 mb-4">
                        {Math.round(uploadedFile.size / 1024)} KB
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={removeUploadedFile}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Remove File
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
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={
                isLoading ||
                (inputMode === "text" && !textInput.trim()) ||
                (inputMode === "file" && !uploadedFile)
              }
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
                  Generate Summary
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Output Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-teal-600" />
              Generated Summary
            </CardTitle>
            <CardDescription>
              Concise summary of your content
            </CardDescription>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
                <Loader2 className="h-8 w-8 text-teal-600 animate-spin mb-4" />
                <p className="text-slate-500">Generating summary...</p>
              </div>
            ) : summary ? (
              <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 shadow-sm min-h-[300px]">
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {summary}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center h-full min-h-[300px] text-slate-400">
                <FileText className="h-12 w-12 mb-4" />
                <p>Your summary will appear here</p>
                <p className="text-xs mt-2">
                  Submit content to generate a summary
                </p>
              </div>
            )}
          </CardContent>

          {summary && (
            <CardFooter className="flex justify-end">
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
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Summary;
