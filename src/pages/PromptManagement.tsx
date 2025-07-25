import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiFetch, buildApiUrl } from "@/lib/api";
import { Input } from "@/components/ui/input";

interface PromptVariable {
  name: string;
  description: string;
  required: boolean;
  example: string;
}

interface PromptValidationResponse {
  is_valid: boolean;
  missing_variables: string[];
  missing_required_variables: string[];
  extra_variables: string[];
  expected_variables: string[];
  actual_variables: string[];
  variables_info: Record<string, PromptVariable>;
}



interface PromptData {
  generation_prompt: string;
  extraction_prompt: string;
  summarization_prompt: string;
}

const PromptManagement = () => {
  const [prompts, setPrompts] = useState<PromptData>({
    generation_prompt: "",
    extraction_prompt: "",
    summarization_prompt: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [validating, setValidating] = useState(false);
  const [activeTab, setActiveTab] = useState("generation_prompt");
  const [validationResult, setValidationResult] = useState<PromptValidationResponse | null>(null);
  const [variablesInfo, setVariablesInfo] = useState<Record<string, PromptVariable>>({});
  const { toast } = useToast();
  const user = JSON.parse(localStorage.getItem("user") || '{}');

  useEffect(() => {
    if (user.email !== "admin@admin.com") return;
    fetchPrompts();
    // Initialize the first tab
    handleTabChange("generation_prompt");
    // eslint-disable-next-line
  }, []);

  const fetchPrompts = async () => {
    setLoading(true);
    try {
      const response = await apiFetch(
        buildApiUrl("/admin/prompts"),
        { method: "GET" }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch prompts");
      setPrompts(data.data || {});
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to load prompts",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSavePrompt = async () => {
    setSaving(true);
    try {
      const response = await apiFetch(
        buildApiUrl(`/admin/prompts/${activeTab}`),
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: prompts[activeTab as keyof PromptData] }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update prompt");
      
      toast({
        title: "Prompt updated",
        description: `${activeTab.replace('_', ' ')} has been updated successfully.`,
      });
      setValidationResult(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to update prompt",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleValidatePrompt = async () => {
    setValidating(true);
    try {
      const response = await apiFetch(
        buildApiUrl(`/admin/prompts/${activeTab}/validate`),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: prompts[activeTab as keyof PromptData] }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to validate prompt");
      
      setValidationResult(data.data);
      toast({
        title: "Validation completed",
        description: data.data.is_valid ? "Prompt is valid!" : "Prompt has validation issues.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Validation failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setValidating(false);
    }
  };



  const getVariableInfo = async (promptType: string) => {
    try {
      const response = await apiFetch(
        buildApiUrl(`/admin/prompts/${promptType}/variables`),
        { method: "GET" }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch variable info");
      return data.data.variables_info;
    } catch (error) {
      console.error("Failed to fetch variable info:", error);
      return {};
    }
  };

  const handleTabChange = async (value: string) => {
    setActiveTab(value);
    setValidationResult(null);
    
    // Load variable info
    const variablesInfo = await getVariableInfo(value);
    console.log('Variables info for', value, ':', variablesInfo);
    setVariablesInfo(variablesInfo);
  };

  if (user.email !== "admin@admin.com") {
    return (
      <DashboardLayout>
        <div className="text-center py-20 text-xl font-semibold">Access Denied</div>
      </DashboardLayout>
    );
  }

  const promptTypes = [
    { value: "generation_prompt", label: "Generation Prompt" },
    { value: "extraction_prompt", label: "Extraction Prompt" },
    { value: "summarization_prompt", label: "Summarization Prompt" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>AI Prompt Management (JSON-Based)</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                {promptTypes.map((type) => (
                  <TabsTrigger key={type.value} value={type.value}>
                    {type.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {promptTypes.map((type) => (
                <TabsContent key={type.value} value={type.value} className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`prompt-${type.value}`}>
                        {type.label} Content
                      </Label>
                      <Textarea
                        id={`prompt-${type.value}`}
                        value={prompts[type.value as keyof PromptData]}
                        onChange={(e) =>
                          setPrompts(prev => ({
                            ...prev,
                            [type.value]: e.target.value
                          }))
                        }
                        placeholder={`Enter ${type.label.toLowerCase()} content...`}
                        className="min-h-[200px] font-mono text-sm"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={handleValidatePrompt}
                        disabled={validating || loading}
                        variant="outline"
                      >
                        {validating ? "Validating..." : "Validate"}
                      </Button>
                      <Button
                        onClick={handleSavePrompt}
                        disabled={saving || loading}
                        className="bg-teal-600 hover:bg-teal-700"
                      >
                        {saving ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>

                    {validationResult && (
                      <Alert className={validationResult.is_valid ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                        <AlertDescription>
                          <div className="space-y-2">
                            <div className="font-semibold">
                              {validationResult.is_valid ? "✅ Valid" : "❌ Invalid"}
                            </div>
                            {validationResult.missing_required_variables && validationResult.missing_required_variables.length > 0 && (
                              <div>
                                <span className="font-medium">Missing required variables:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {validationResult.missing_required_variables.map((variable) => (
                                    <Badge key={variable} variant="destructive">
                                      {variable}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            {validationResult.missing_variables && validationResult.missing_variables.length > 0 && (
                              <div>
                                <span className="font-medium">Missing variables:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {validationResult.missing_variables.map((variable) => (
                                    <Badge key={variable} variant="destructive">
                                      {variable}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            {validationResult.extra_variables && validationResult.extra_variables.length > 0 && (
                              <div>
                                <span className="font-medium">Extra variables:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {validationResult.extra_variables.map((variable) => (
                                    <Badge key={variable} variant="secondary">
                                      {variable}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            {validationResult.expected_variables && (
                              <div>
                                <span className="font-medium">Expected variables:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {validationResult.expected_variables.map((variable) => (
                                    <Badge key={variable} variant="outline">
                                      {variable}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}



                    {/* Variable Information Panel */}
                    {Object.keys(variablesInfo).length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Available Variables</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {Object.entries(variablesInfo).map(([variable, info]) => (
                              <div key={variable} className="border rounded p-3">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant={info.required ? "destructive" : "secondary"}>
                                    {variable}
                                  </Badge>
                                  {info.required && (
                                    <Badge variant="outline" className="text-xs">
                                      Required
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{info.description}</p>
                                <div className="text-xs text-gray-500">
                                  <strong>Example:</strong> {info.example}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PromptManagement; 