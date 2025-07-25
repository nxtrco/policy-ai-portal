import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  FileText, 
  MessageSquare,
  Settings, 
  HelpCircle, 
  LogOut,
  FileQuestion,
  Brain,
  UploadIcon,
  User as UserIcon,
  Code
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  isActive?: boolean;
  onClick?: () => void;
  highlighted?: boolean;
}

const SidebarItem = ({ icon: Icon, label, href, isActive, onClick, highlighted }: SidebarItemProps) => {
  return (
    <Link
      to={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 transition-all hover:text-slate-900",
        isActive ? "bg-slate-100 text-slate-900 font-medium" : "hover:bg-slate-50",
        highlighted && "bg-teal-600 text-white font-bold shadow-md hover:bg-teal-700 border border-teal-700"
      )}
    >
      <Icon className={cn("h-5 w-5", highlighted && "text-white")} />
      <span>{label}</span>
    </Link>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    localStorage.removeItem("access_token")
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
      variant: "destructive",
    });
    console.log("Navigating to login...");

    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 100);
  };
  
  const user = JSON.parse(localStorage.getItem("user") || '{}');
  
  return (
    <div className="h-screen w-64 border-r bg-white flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2">
          <div className="bg-teal-600 h-8 w-8 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <span className="font-bold text-xl">Complaints AI</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto py-4 px-3">
        <nav className="space-y-1">
          <SidebarItem 
            icon={Home} 
            label="Dashboard" 
            href="/dashboard" 
            isActive={location.pathname === "/dashboard"} 
          />
          <SidebarItem 
            icon={FileQuestion} 
            label="Extract Questions" 
            href="/questions" 
            isActive={location.pathname === "/questions"} 
          />
          <SidebarItem
            icon={Brain}
            label="Summarise"
            href="/summary"
            isActive={location.pathname === "/summary"}
          />
          <SidebarItem 
            icon={MessageSquare} 
            label="Draft Response" 
            href="/ask" 
            isActive={location.pathname === "/ask"} 
          />
        </nav>
      </div>
      
      <div className="py-4 px-3">
        <nav className="space-y-1">
          <SidebarItem 
            icon={UploadIcon} 
            label="Upload Policies" 
            href="/policies" 
            isActive={location.pathname === "/policies"} 
            highlighted={true}
          />
          <hr className="py-2" />
          {user.email === "admin@admin.com" && (
            <>
              <SidebarItem
                icon={UserIcon}
                label="User Management"
                href="/user-management"
                isActive={location.pathname === "/user-management"}
              />
              <SidebarItem
                icon={Code}
                label="Prompt Management"
                href="/prompt-management"
                isActive={location.pathname === "/prompt-management"}
              />
            </>
          )}
          <SidebarItem
            icon={Settings}
            label="Change Password"
            href="/change-password"
            isActive={location.pathname === "/change-password"}
          />
          <SidebarItem 
            icon={LogOut} 
            label="Log out" 
            href="#" 
            onClick={handleLogout} 
          />
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
