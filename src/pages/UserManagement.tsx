import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/lib/api";

interface User {
  id: number;
  email: string;
  username: string;
  role: string;
  is_active: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { toast } = useToast();
  const user = JSON.parse(localStorage.getItem("user") || '{}');

  useEffect(() => {
    if (user.email !== "admin@admin.com") return;
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await apiFetch("https://complain-management-be-1079206590069.europe-west1.run.app/api/v1/admin/users", { method: "GET" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch users");
      setUsers(data.data || []);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to load users",
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprovalChange = async (userEmail: string, disapprove: boolean) => {
    try {
      const response = await apiFetch(
        `https://complain-management-be-1079206590069.europe-west1.run.app/api/v1/admin/manage-approval/user?user_email=${encodeURIComponent(userEmail)}&disapprove=${disapprove}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "",
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || `Failed to ${disapprove ? 'disapprove' : 'approve'} user`);
      
      setUsers((prev) => prev.map((u) => (u.email === userEmail ? { ...u, is_approved: !disapprove } : u)));
      toast({ 
        title: `User ${disapprove ? 'disapproved' : 'approved'}`, 
        description: `User ${userEmail} has been ${disapprove ? 'disapproved' : 'approved'}.` 
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: `Failed to ${disapprove ? 'disapprove' : 'approve'} user`,
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newUser.password !== newUser.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
      });
      return;
    }
    
    setIsCreatingUser(true);
    
    try {
      const payload = {
        email: newUser.email,
        username: newUser.username,
        password: newUser.password,
      };
      const response = await fetch(
        "https://complain-management-be-1079206590069.europe-west1.run.app/api/v1/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      if (response.ok && data.status_code === 200) {
        toast({
          title: "User created",
          description: "New user has been registered successfully.",
        });
        // Reset form
        setNewUser({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        // Refresh users list
        fetchUsers();
      } else {
        throw new Error(data.message || "User creation failed");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "User creation failed",
        description: error instanceof Error ? error.message : "Please check the information and try again",
      });
    } finally {
      setIsCreatingUser(false);
    }
  };

  if (user.email !== "admin@admin.com") {
    return (
      <DashboardLayout>
        <div className="text-center py-20 text-xl font-semibold">Access Denied</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">Manage Users</TabsTrigger>
          <TabsTrigger value="create">Create User</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div>Loading users...</div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left">Username</th>
                      <th className="px-4 py-2 text-left">Email</th>
                      <th className="px-4 py-2 text-left">Role</th>
                      <th className="px-4 py-2 text-left">Active</th>
                      <th className="px-4 py-2 text-left">Approved</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td className="px-4 py-2">{u.username}</td>
                        <td className="px-4 py-2">{u.email}</td>
                        <td className="px-4 py-2">{u.role}</td>
                        <td className="px-4 py-2">{u.is_approved ? "Yes" : "No"}</td>
                        <td className="px-4 py-2">
                          <Switch
                            checked={u.is_approved}
                            onCheckedChange={(checked) => handleApprovalChange(u.email, !checked)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create New User</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Username"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={newUser.confirmPassword}
                    onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-teal-600 hover:bg-teal-700" 
                  disabled={isCreatingUser}
                >
                  {isCreatingUser ? "Creating user..." : "Create User"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default UserManagement; 