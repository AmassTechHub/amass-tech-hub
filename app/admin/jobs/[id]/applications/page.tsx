'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Phone, FileText, Search, Filter, Download, Check, X, Clock, User, Calendar, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

type ApplicationStatus = 'new' | 'reviewed' | 'interviewing' | 'hired' | 'rejected';

interface JobApplication {
  id: string;
  job_id: string;
  full_name: string;
  email: string;
  phone: string;
  resume_url: string;
  cover_letter?: string;
  status: ApplicationStatus;
  created_at: string;
  notes?: string;
  skills: string[];
  experience: string;
  education: string;
}

export default function JobApplications() {
  const router = useRouter();
  const { id } = useParams();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [isBulkActionLoading, setIsBulkActionLoading] = useState(false);

  useEffect(() => {
    fetchJobAndApplications();
  }, [id]);

  const fetchJobAndApplications = async () => {
    try {
      setIsLoading(true);
      
      // Fetch job details
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();

      if (jobError) throw jobError;
      setJob(jobData);

      // Fetch applications
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('job_applications')
        .select('*')
        .eq('job_id', id)
        .order('created_at', { ascending: false });

      if (applicationsError) throw applicationsError;
      setApplications(applicationsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load job applications. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredApplications = applications.filter(application => {
    const matchesSearch = 
      application.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || application.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = async (applicationId: string, newStatus: ApplicationStatus) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ status: newStatus })
        .eq('id', applicationId);

      if (error) throw error;

      setApplications(applications.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));

      toast({
        title: 'Success',
        description: 'Application status updated successfully.',
      });
    } catch (error) {
      console.error('Error updating application status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update application status. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleBulkStatusUpdate = async (newStatus: ApplicationStatus) => {
    if (selectedApplications.length === 0) return;

    try {
      setIsBulkActionLoading(true);
      
      const { error } = await supabase
        .from('job_applications')
        .update({ status: newStatus })
        .in('id', selectedApplications);

      if (error) throw error;

      setApplications(applications.map(app => 
        selectedApplications.includes(app.id) ? { ...app, status: newStatus } : app
      ));

      setSelectedApplications([]);
      
      toast({
        title: 'Success',
        description: `Updated status for ${selectedApplications.length} application(s).`,
      });
    } catch (error) {
      console.error('Error updating applications:', error);
      toast({
        title: 'Error',
        description: 'Failed to update applications. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsBulkActionLoading(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedApplications.length === filteredApplications.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(filteredApplications.map(app => app.id));
    }
  };

  const toggleSelectApplication = (applicationId: string) => {
    setSelectedApplications(prev => 
      prev.includes(applicationId)
        ? prev.filter(id => id !== applicationId)
        : [...prev, applicationId]
    );
  };

  const getStatusBadgeVariant = (status: ApplicationStatus) => {
    switch (status) {
      case 'new':
        return 'default';
      case 'reviewed':
        return 'secondary';
      case 'interviewing':
        return 'outline';
      case 'hired':
        return 'default';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const exportToCSV = () => {
    // Create CSV header
    let csvContent = 'Name,Email,Phone,Status,Applied On\n';
    
    // Add application data
    const applicationsToExport = statusFilter === 'all' 
      ? applications 
      : applications.filter(app => app.status === statusFilter);
    
    applicationsToExport.forEach(app => {
      const row = [
        `"${app.full_name}"`,
        `"${app.email}"`,
        `"${app.phone || 'N/A'}"`,
        `"${app.status.charAt(0).toUpperCase() + app.status.slice(1)}"`,
        `"${formatDate(app.created_at)}"`
      ];
      csvContent += row.join(',') + '\n';
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `job-applications-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.push(`/admin/jobs/${id}`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Job
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Applications</h1>
            <p className="text-muted-foreground">
              {job?.title} at {job?.company}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search applicants..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as ApplicationStatus | 'all')}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="interviewing">Interviewing</SelectItem>
                <SelectItem value="hired">Hired</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    Bulk Actions
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[200px]">
                  <DropdownMenuItem 
                    onClick={() => handleBulkStatusUpdate('reviewed')}
                    disabled={selectedApplications.length === 0 || isBulkActionLoading}
                  >
                    Mark as Reviewed
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleBulkStatusUpdate('interviewing')}
                    disabled={selectedApplications.length === 0 || isBulkActionLoading}
                  >
                    Mark as Interviewing
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleBulkStatusUpdate('hired')}
                    disabled={selectedApplications.length === 0 || isBulkActionLoading}
                  >
                    Mark as Hired
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleBulkStatusUpdate('rejected')}
                    disabled={selectedApplications.length === 0 || isBulkActionLoading}
                    className="text-destructive"
                  >
                    Reject Applications
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Job Applications</CardTitle>
              <p className="text-sm text-muted-foreground">
                {filteredApplications.length} {filteredApplications.length === 1 ? 'application' : 'applications'} found
              </p>
            </div>
            {selectedApplications.length > 0 && (
              <div className="text-sm text-muted-foreground">
                {selectedApplications.length} {selectedApplications.length === 1 ? 'application' : 'applications'} selected
              </div>
            )}
          </div>
        </CardHeader>
        
        {filteredApplications.length > 0 ? (
          <div className="relative overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedApplications.length === filteredApplications.length && filteredApplications.length > 0}
                      onCheckedChange={toggleSelectAll}
                      className="h-4 w-4"
                    />
                  </TableHead>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedApplications.includes(application.id)}
                        onCheckedChange={() => toggleSelectApplication(application.id)}
                        className="h-4 w-4"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{application.full_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {application.skills?.slice(0, 2).join(', ')}
                        {application.skills?.length > 2 && '...'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <a 
                          href={`mailto:${application.email}`} 
                          className="hover:underline flex items-center text-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Mail className="h-4 w-4 mr-1" />
                          <span className="truncate max-w-[150px]">{application.email}</span>
                        </a>
                      </div>
                      {application.phone && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Phone className="h-4 w-4 mr-1" />
                          {application.phone}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={application.status}
                        onValueChange={(value) => handleStatusUpdate(application.id, value as ApplicationStatus)}
                      >
                        <SelectTrigger className="w-[150px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="reviewed">Reviewed</SelectItem>
                          <SelectItem value="interviewing">Interviewing</SelectItem>
                          <SelectItem value="hired">Hired</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{formatDate(application.created_at)}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(application.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => router.push(`/admin/jobs/${id}/applications/${application.id}`)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No applications found</h3>
            <p className="text-muted-foreground mt-1">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'No one has applied to this job yet.'}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
