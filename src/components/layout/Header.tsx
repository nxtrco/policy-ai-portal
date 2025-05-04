
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, MessageSquare } from "lucide-react";

const Header = () => {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);
  
  return (
    <header className="bg-white border-b p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {user ? `Hello, ${user.name}` : "Hello"}
          </h1>
          <p className="text-slate-500">
            Track policy progress here. Upload policies and ask questions.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right text-sm text-slate-500">
            {format(currentDate, "dd MMM, yyyy")}
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <MessageSquare className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex items-center gap-3 pl-3 border-l">
            <Avatar>
              <AvatarImage src="/lovable-uploads/7c46ac0b-e392-4680-8a7f-ee4353f2eb0d.png" />
              <AvatarFallback>
                {user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <div className="font-medium">{user?.name || "User"}</div>
              <div className="text-slate-500">@{user?.email?.split('@')[0] || "user"}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
