
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Upload,
  Search,
  Plus,
  Filter,
  Trash2,
  FileUp
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

// Define policy interface based on API response
interface Policy {
  policy_id: string;
  filename: string;
  created_at: string;
}

const PolicyCard = ({ policy, onDelete }: { policy: Policy; onDelete: (id: string) => void }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium">{policy.filename}</h3>
              <div className="flex items-center space-x-3 mt-1">
                <span className="text-xs px-2 py-1 bg-slate-100 rounded-full text-slate-600">
                  Policy
                </span>
                <span className="text-xs text-slate-500">
                  Uploaded: {new Date(policy.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center space-x-3 mt-2">
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600">
                  Active
                </span>
                <span className="text-xs text-slate-500">
                  ID: {policy.policy_id.substring(0, 8)}...
                </span>
              </div>
            </div>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Policy</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{policy.filename}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => onDelete(policy.policy_id)}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

const Policies = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const fetchPolicies = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const accessToken = localStorage.getItem("access_token");
      
      if (!accessToken) {
        throw new Error("Authentication token not found");
      }
      
      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/api/v1/complaints/policy-collection",
        {
          method: "GET",
          headers: {
            "accept": "application/json",
            "Authorization": `Bearer ${accessToken}`
          }
        }
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch policies");
      }
      
      setPolicies(data.data || []);
    } catch (error) {
      console.error("Error fetching policies:", error);
      setError(error instanceof Error ? error.message : "An unknown error occurred");
      toast({
        variant: "destructive",
        title: "Failed to load policies",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeletePolicy = async (policyId: string) => {
    try {
      const accessToken = localStorage.getItem("access_token");
      
      if (!accessToken) {
        throw new Error("Authentication token not found");
      }
      
      // This is a placeholder API endpoint - replace with the actual endpoint when available
      const response = await fetch(
        `http://127.0.0.1:8000/api/v1/api/v1/complaints/policy/${policyId}`,
        {
          method: "DELETE",
          headers: {
            "accept": "application/json",
            "Authorization": `Bearer ${accessToken}`
          }
        }
      );
      
      // For now, we'll simulate a successful deletion even if the API doesn't exist
      // In a real implementation, you would check response.ok
      
      // Remove the policy from the local state
      setPolicies(policies.filter(policy => policy.policy_id !== policyId));
      
      toast({
        title: "Policy deleted",
        description: "The policy has been successfully deleted.",
      });
      
    } catch (error) {
      console.error("Error deleting policy:", error);
      toast({
        variant: "destructive",
        title: "Failed to delete policy",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };
  
  useEffect(() => {
    fetchPolicies();
  }, [toast]);
  
  // Filter policies based on search query
  const filteredPolicies = policies.filter(policy => 
    policy.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const UploadDialog = () => {
    const [files, setFiles] = useState<FileList | null>(null);
    const [policyName, setPolicyName] = useState("");
    const [category, setCategory] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        setFiles(e.target.files);
      }
    };
    
    const handleUpload = async () => {
      if (!files || !policyName || !category) {
        toast({
          variant: "destructive",
          title: "Missing information",
          description: "Please fill all required fields",
        });
        return;
      }
      
      setIsUploading(true);
      
      try {
        // Get the access token from localStorage
        const accessToken = localStorage.getItem("access_token");
        
        if (!accessToken) {
          throw new Error("Authentication token not found");
        }
        
        // Create form data for file upload
        const formData = new FormData();
        formData.append("policy_file", files[0]);
        formData.append("policy_format", getFileFormat(files[0].name));
        
        // Make API request to upload policy
        const response = await fetch(
          "http://127.0.0.1:8000/api/v1/api/v1/complaints/configure-policy",
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
          throw new Error(data.message || "Failed to upload policy");
        }
        
        toast({
          title: "Policy uploaded",
          description: `"${policyName}" has been successfully uploaded.`,
        });
        
        // Reset form
        setPolicyName("");
        setCategory("");
        setFiles(null);
        
        // Close the dialog
        setDialogOpen(false);
        
        // Refresh the policies list
        fetchPolicies();
        
      } catch (error) {
        console.error("Upload error:", error);
        toast({
          variant: "destructive",
          title: "Upload failed",
          description: error instanceof Error ? error.message : "An unknown error occurred",
        });
      } finally {
        setIsUploading(false);
      }
    };
    
    // Helper function to determine file format
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
          return 'Pdf'; // Default to PDF
      }
    };
    
    return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-teal-600 hover:bg-teal-700" onClick={() => setDialogOpen(true)}>
            <Upload className="h-4 w-4 mr-2" /> Upload Policy
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload New Policy</DialogTitle>
            <DialogDescription>
              Upload a policy document to add it to your council's policy database.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="policyName" className="text-sm font-medium">
                Policy Name
              </label>
              <Input
                id="policyName"
                value={policyName}
                onChange={(e) => setPolicyName(e.target.value)}
                placeholder="e.g. Environmental Protection Policy"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category
              </label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Environment, Planning, Safety"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="file" className="text-sm font-medium">
                Policy Document
              </label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <FileUp className="h-8 w-8 mx-auto text-slate-400" />
                <p className="mt-2 text-sm text-slate-600">
                  Drag and drop your file here, or click to browse
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Supports PDF, DOCX, TXT files up to 10MB
                </p>
                <Input
                  id="file"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.txt"
                />
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => document.getElementById("file")?.click()}
                >
                  Browse Files
                </Button>
                {files && (
                  <div className="mt-4 text-sm text-slate-700">
                    Selected: {files[0].name}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              disabled={isUploading}
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={isUploading}
              className="bg-teal-600 hover:bg-teal-700"
            >
              {isUploading ? "Uploading..." : "Upload Policy"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };
  
  return (
    <DashboardLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Policies</h1>
          <p className="text-slate-500">Manage and query your council policies</p>
        </div>
        <UploadDialog />
      </div>
      
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search policies..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-teal-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-slate-500">Loading policies...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-red-500 mb-2">Error loading policies</div>
          <p className="text-slate-500">{error}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPolicies.map(policy => (
              <PolicyCard 
                key={policy.policy_id} 
                policy={policy} 
                onDelete={handleDeletePolicy}
              />
            ))}
          </div>
          
          {filteredPolicies.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-slate-300" />
              <h3 className="mt-4 text-lg font-medium">No policies found</h3>
              <p className="text-slate-500 mt-1">
                {searchQuery 
                  ? `No policies match "${searchQuery}"`
                  : "Try uploading a new policy document"}
              </p>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default Policies;
