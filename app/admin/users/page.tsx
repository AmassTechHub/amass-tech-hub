"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Plus, 
  Loader2, 
  Search, 
  Edit, 
  Trash2, 
  User, 
  Shield, 
  Mail, 
  Calendar, 
  UserPlus, 
  Filter, 
  X, 
  Check, 
  XCircle,
  MoreVertical,
  MailCheck,
  ShieldCheck,
  ShieldOff,
  UserCheck,
  UserX,
  RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { formatDistanceToNow, format } from "date-fns"
import { cn } from "@/lib/utils"

type UserRole = 'user' | 'editor' | 'admin'

interface UserProfile {
  id: string
  email: string
  role: UserRole
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
  last_sign_in_at: string | null
  is_active: boolean
  email_confirmed_at: string | null
  phone: string | null
  metadata: Record<string, any> | null
}

const roleOptions = [
  { value: 'user', label: 'User', icon: User },
  { value: 'editor', label: 'Editor', icon: Edit },
  { value: 'admin', label: 'Admin', icon: Shield },
]

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdatingRole, setIsUpdatingRole] = useState<string | null>(null)
  const [isTogglingStatus, setIsTogglingStatus] = useState<string | null>(null)
  
  const router = useRouter()
  const supabase = createClient()

  // Fetch users from Supabase
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers()
      
      if (authError) throw authError
      
      // Get additional user data from public.users table
      const { data: userProfiles, error: profileError } = await supabase
        .from('users')
        .select('*')
      
      if (profileError) throw profileError
      
      // Merge auth and profile data
      const mergedUsers = authUsers.map(authUser => {
        const profile = userProfiles?.find(up => up.id === authUser.id) || {}
        return {
          id: authUser.id,
          email: authUser.email || '',
          role: authUser.user_metadata?.role || 'user',
          full_name: authUser.user_metadata?.full_name || '',
          avatar_url: authUser.user_metadata?.avatar_url || null,
          created_at: authUser.created_at,
          updated_at: authUser.updated_at,
          last_sign_in_at: authUser.last_sign_in_at,
          is_active: authUser.user_metadata?.is_active ?? true,
          email_confirmed_at: authUser.email_confirmed_at,
          phone: authUser.phone,
          metadata: authUser.user_metadata,
          ...profile
        }
      })
      
      setUsers(mergedUsers)
      setFilteredUsers(mergedUsers)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    let result = [...users]
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(user => 
        (user.email?.toLowerCase().includes(query)) ||
        (user.full_name?.toLowerCase().includes(query))
      )
    }
    
    // Apply role filter
    if (roleFilter) {
      result = result.filter(user => user.role === roleFilter)
    }
    
    // Apply status filter
    if (statusFilter === 'active') {
      result = result.filter(user => user.is_active)
    } else if (statusFilter === 'inactive') {
      result = result.filter(user => !user.is_active)
    } else if (statusFilter === 'unconfirmed') {
      result = result.filter(user => !user.email_confirmed_at)
    }
    
    setFilteredUsers(result)
  }, [searchQuery, roleFilter, statusFilter, users])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data: { users }, error } = await supabase.auth.admin.listUsers()
      
      if (error) throw error
      
      // Transform the user data to match our UserProfile interface
      const userProfiles = users.map(user => ({
        id: user.id,
        email: user.email || '',
        role: user.user_metadata?.role || 'user',
        full_name: user.user_metadata?.full_name || null,
        avatar_url: user.user_metadata?.avatar_url || null,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        is_active: !user.banned_at,
        email_confirmed_at: user.email_confirmed_at
      }))
      
      setUsers(userProfiles)
      setFilteredUsers(userProfiles)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        user_metadata: { role: newRole }
      })
      
      if (error) throw error
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole as any } : user
      ))
      
      toast({
        title: "Success",
        description: "User role updated successfully.",
      })
    } catch (error) {
      console.error("Error updating user role:", error)
      toast({
        title: "Error",
        description: "Failed to update user role. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleStatusChange = async (userId: string, isActive: boolean) => {
    try {
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        ban_duration: isActive ? 'none' : 'permanent'
      })
      
      if (error) throw error
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_active: !isActive } : user
      ))
      
      toast({
        title: "Success",
        description: `User ${isActive ? 'deactivated' : 'activated'} successfully.`,
      })
    } catch (error) {
      console.error(`Error ${isActive ? 'deactivating' : 'activating'} user:`, error)
      toast({
        title: "Error",
        description: `Failed to ${isActive ? 'deactivate' : 'activate'} user. Please try again.`,
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId)
      
      if (error) throw error
      
      // Update local state
      setUsers(users.filter(user => user.id !== userId))
      
      toast({
        title: "Success",
        description: "User deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    }
    return email.substring(0, 2).toUpperCase()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>
        <Button onClick={() => router.push("/admin/users/invite")}>
          <Plus className="mr-2 h-4 w-4" />
          Invite User
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="unconfirmed">Unconfirmed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        {user.avatar_url ? (
                          <AvatarImage src={user.avatar_url} alt={user.full_name || user.email} />
                        ) : (
                          <AvatarFallback>
                            {getInitials(user.full_name, user.email)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.full_name || 'No Name'}</div>
                        <div className="text-sm text-muted-foreground">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span>{user.is_active ? 'Active' : 'Inactive'}</span>
                      {!user.email_confirmed_at && (
                        <Badge variant="outline" className="ml-2">Unverified</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={user.role} 
                      onValueChange={(value) => handleRoleChange(user.id, value)}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-muted-foreground">
                      <Mail className="w-4 h-4 mr-1" />
                      <span className="truncate max-w-[150px]" title={user.email}>
                        {user.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/admin/users/${user.id}`)}
                        aria-label="Edit user"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleStatusChange(user.id, user.is_active)}
                        className={user.is_active ? "text-yellow-600 hover:text-yellow-700" : "text-green-600 hover:text-green-700"}
                        aria-label={user.is_active ? "Deactivate user" : "Activate user"}
                      >
                        {user.is_active ? (
                          <Shield className="w-4 h-4" />
                        ) : (
                          <User className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(user.id)}
                        className="text-destructive hover:text-destructive/80"
                        aria-label="Delete user"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  {users.length === 0 ? 'No users found.' : 'No users match your search criteria.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
