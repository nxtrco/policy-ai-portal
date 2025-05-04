
import { useState } from "react";
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
  MoreHorizontal,
  FileUp
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// Mock policy data
const policiesData = [
  {
    id: 1,
    title: "Public Safety Guidelines",
    category: "Safety",
    uploadDate: "2023-04-15",
    status: "Active",
    questions: 12
  },
  {
    id: 2,
    title: "Environmental Protection Policy",
    category: "Environment",
    uploadDate: "2023-05-01",
    status: "Active",
    questions: 8
  },
  {
    id: 3,
    title: "Urban Development Framework",
    category: "Planning",
    uploadDate: "2023-05-10",
    status: "Draft",
    questions: 5
  },
  {
    id: 4,
    title: "Community Engagement Standards",
    category: "Community",
    uploadDate: "2023-04-22",
    status: "Active",
    questions: 9
  },
  {
    id: 5,
    title: "Council Meeting Procedures",
    category: "Governance",
    uploadDate: "2023-05-05",
    status: "Active",
    questions: 3
  }
];

const PolicyCard = ({ policy }: { policy: typeof policiesData[0] }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium">{policy.title}</h3>
              <div className="flex items-center space-x-3 mt-1">
                <span className="text-xs px-2 py-1 bg-slate-100 rounded-full text-slate-600">
                  {policy.category}
                </span>
                <span className="text-xs text-slate-500">
                  Uploaded: {new Date(policy.uploadDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center space-x-3 mt-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  policy.status === "Active" 
                    ? "bg-green-100 text-green-600" 
                    : "bg-amber-100 text-amber-600"
                }`}>
                  {policy.status}
                </span>
                <span className="text-xs text-slate-500">
                  {policy.questions} questions asked
                </span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const UploadDialog = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [policyName, setPolicyName] = useState("");
  const [category, setCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(e.target.files);
    }
  };
  
  const handleUpload = () => {
    if (!files || !policyName || !category) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill all required fields",
      });
      return;
    }
    
    setIsUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      toast({
        title: "Policy uploaded",
        description: `"${policyName}" has been successfully uploaded.`,
      });
      
      setIsUploading(false);
      setPolicyName("");
      setCategory("");
      setFiles(null);
    }, 1500);
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-teal-600 hover:bg-teal-700">
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
          <Button variant="outline" disabled={isUploading}>
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

const Policies = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter policies based on search query
  const filteredPolicies = policiesData.filter(policy => 
    policy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    policy.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
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
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" /> New Category
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPolicies.map(policy => (
          <PolicyCard key={policy.id} policy={policy} />
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
    </DashboardLayout>
  );
};

export default Policies;
