
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Clock, 
  BarChart, 
  Search,
  ChevronDown, 
  Plus,
  AlertCircle,
  CheckCircle,
  PauseCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

// Mock data for the performance chart
const performanceData = [
  { day: "01", hours: 2 },
  { day: "02", hours: 3 },
  { day: "03", hours: 5 },
  { day: "04", hours: 4 },
  { day: "05", hours: 7 },
  { day: "06", hours: 6 },
  { day: "07", hours: 8 },
];

// Mock data for current tasks
const tasksData = [
  { 
    id: 1, 
    title: "Policy Review for Public Safety",
    status: "in progress", 
    timeLeft: "4h",
    icon: Search 
  },
  { 
    id: 2, 
    title: "Environmental Policy Update",
    status: "on hold", 
    timeLeft: "8h",
    icon: AlertCircle 
  },
  { 
    id: 3, 
    title: "Housing Development Guidelines",
    status: "done", 
    timeLeft: "32h",
    icon: CheckCircle 
  },
];

// Mock data for recent activity
const activityData = [
  {
    id: 1,
    user: "John Smith",
    action: "Commented on",
    policy: "Public Safety Policy",
    time: "10:15 AM",
    userInitial: "J"
  },
  {
    id: 2,
    user: "Sarah Johnson",
    action: "Added a file to",
    policy: "Environmental Policy",
    time: "10:15 AM",
    userInitial: "S"
  },
  {
    id: 3,
    user: "Alex Williams",
    action: "Commented on",
    policy: "Urban Planning Policy",
    time: "10:15 AM",
    userInitial: "A"
  }
];

const StatusIcon = ({ status }: { status: string }) => {
  if (status === "in progress") {
    return <div className="text-amber-500 w-2 h-2 rounded-full bg-amber-500 mr-2" />;
  } else if (status === "on hold") {
    return <div className="text-orange-500 w-2 h-2 rounded-full bg-orange-500 mr-2" />;
  } else if (status === "done") {
    return <div className="text-green-500 w-2 h-2 rounded-full bg-green-500 mr-2" />;
  }
  return null;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [uploadedPolicies, setUploadedPolicies] = useState(18);
  const [policyQuestions, setPolicyQuestions] = useState(31);
  const [avgResponseTime, setAvgResponseTime] = useState(93);
  
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="bg-teal-100 p-3 rounded-full">
                <FileText className="h-5 w-5 text-teal-600" />
              </div>
              <div className="ml-4">
                <p className="text-slate-500 text-sm">Uploaded Policies</p>
                <div className="flex items-baseline">
                  <h3 className="text-3xl font-bold">{uploadedPolicies}</h3>
                  <span className="ml-2 text-xs text-emerald-500">+4 policies</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <Search className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-slate-500 text-sm">Policy Questions</p>
                <div className="flex items-baseline">
                  <h3 className="text-3xl font-bold">{policyQuestions}</h3>
                  <span className="ml-2 text-xs text-emerald-500">+6 hours</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="bg-violet-100 p-3 rounded-full">
                <Clock className="h-5 w-5 text-violet-600" />
              </div>
              <div className="ml-4">
                <p className="text-slate-500 text-sm">Response Efficiency</p>
                <div className="flex items-baseline">
                  <h3 className="text-3xl font-bold">{avgResponseTime}%</h3>
                  <span className="ml-2 text-xs text-emerald-500">+12%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Performance</CardTitle>
            <Button variant="outline" size="sm">
              01-07 May <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="hours" stroke="#14b8a6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {activityData.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div className="bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center text-slate-600 font-medium mr-3">
                    {activity.userInitial}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activity.user}</p>
                    <p className="text-xs text-slate-500">
                      {activity.action} <span className="text-teal-600">{activity.policy}</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Current Tasks</CardTitle>
          <div className="flex items-center gap-2">
            <div className="text-sm text-slate-500">Done: 30%</div>
            <Button variant="outline" size="sm">
              Week <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tasksData.map((task) => (
              <div key={task.id} className="p-3 rounded-lg bg-slate-50 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-white p-2 rounded mr-3">
                    <task.icon className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <div className="flex items-center text-xs text-slate-500 mt-1">
                      <StatusIcon status={task.status} />
                      <span className="capitalize">{task.status}</span>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-slate-500">{task.timeLeft}</div>
              </div>
            ))}
            
            <Button variant="outline" className="w-full" onClick={() => navigate("/policies")}>
              <Plus className="h-4 w-4 mr-2" /> Add New Policy
            </Button>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Dashboard;
