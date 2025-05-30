import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
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

  if (user.email !== "admin@admin.com") {
    return (
      <DashboardLayout>
        <div className="text-center py-20 text-xl font-semibold">Access Denied</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
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
                  {/* <th className="px-4 py-2 text-left">Approved</th> */}
                  <th className="px-4 py-2 text-left">Approved</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="px-4 py-2">{u.username}</td>
                    <td className="px-4 py-2">{u.email}</td>
                    <td className="px-4 py-2">{u.role}</td>
                    {/* <td className="px-4 py-2">{u.is_active ? "Yes" : "No"}</td> */}
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
    </DashboardLayout>
  );
};

export default UserManagement; 