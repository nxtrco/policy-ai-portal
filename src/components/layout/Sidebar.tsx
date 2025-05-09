
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  FileText, 
  MessageSquare, 
  BarChart, 
  Settings, 
  HelpCircle, 
  LogOut,
  FileQuestion
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  isActive?: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ icon: Icon, label, href, isActive, onClick }: SidebarItemProps) => {
  return (
    <Link
      to={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 transition-all hover:text-slate-900",
        isActive ? "bg-slate-100 text-slate-900 font-medium" : "hover:bg-slate-50"
      )}
    >
      <Icon className="h-5 w-5" />
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
  
  return (
    <div className="h-screen w-64 border-r bg-white flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2">
          <div className="bg-teal-600 h-8 w-8 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <span className="font-bold text-xl">Policy AI</span>
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
            icon={FileText} 
            label="Policies" 
            href="/policies" 
            isActive={location.pathname === "/policies"} 
          />
          <SidebarItem 
            icon={MessageSquare} 
            label="Ask Questions" 
            href="/ask" 
            isActive={location.pathname === "/ask"} 
          />
          <SidebarItem 
            icon={FileQuestion} 
            label="Questions" 
            href="/questions" 
            isActive={location.pathname === "/questions"} 
          />
          <SidebarItem 
            icon={BarChart} 
            label="Analytics" 
            href="/analytics" 
            isActive={location.pathname === "/analytics"} 
          />
        </nav>
      </div>
      
      <div className="border-t py-4 px-3">
        <nav className="space-y-1">
          <SidebarItem 
            icon={Settings} 
            label="Settings" 
            href="/settings" 
            isActive={location.pathname === "/settings"} 
          />
          <SidebarItem 
            icon={HelpCircle} 
            label="Help & Information" 
            href="/help" 
            isActive={location.pathname === "/help"} 
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
