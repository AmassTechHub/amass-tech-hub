'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Phone, FileText, Calendar, Briefcase, GraduationCap, MapPin, Link as LinkIcon, Download, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  cover_letter: string;
  status: ApplicationStatus;
  created_at: string;
  notes: string;
  skills: string[];
  experience: Array<{
    id: string;
    company: string;
    position: string;
    start_date: string;
    end_date: string | null;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field_of_study: string;
    start_date: string;
    end_date: string | null;
    current: boolean;
  }>;
  links: Array<{
    name: string;
    url: string;
  }>;
}

export default function ApplicationDetail() {
  const router = useRouter();
  const { id, applicationId } = useParams();
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<ApplicationStatus>('new');

  useEffect(() => {
    fetchData();
  }, [id, applicationId]);

  const fetchData = async () => {
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

      // Fetch application details
      const { data: applicationData, error: applicationError } = await supabase
        .from('job_applications')
        .select('*')
        .eq('id', applicationId)
        .single();

      if (applicationError) throw applicationError;
      if (!applicationData) throw new Error('Application not found');

      setApplication(applicationData);
      setStatus(applicationData.status);
      setNotes(applicationData.notes || '');
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load application details. Please try again.',
        variant: 'destructive',
      });
      router.push(`/admin/jobs/${id}/applications`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: ApplicationStatus) => {
    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from('job_applications')
        .update({ status: newStatus })
        .eq('id', applicationId);

      if (error) throw error;

      setStatus(newStatus);
      if (application) {
        setApplication({ ...application, status: newStatus });
      }

      toast({
        title: 'Success',
        description: 'Application status updated successfully.',
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update application status. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotes = async () => {
    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from('job_applications')
        .update({ notes })
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Notes saved successfully.',
      });
    } catch (error) {
      console.error('Error saving notes:', error);
      toast({
        title: 'Error',
        description: 'Failed to save notes. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  if (isLoading || !application) {
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
          onClick={() => router.push(`/admin/jobs/${id}/applications`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Applications
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{application.full_name}</h1>
            <p className="text-muted-foreground">
              Application for {job?.title} at {job?.company}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Status:</span>
            <Select
              value={status}
              onValueChange={(value) => handleStatusChange(value as ApplicationStatus)}
              disabled={isSaving}
            >
              <SelectTrigger className="w-[180px]">
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
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Applicant Information */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Applicant Information</CardTitle>
                  <CardDescription>Personal and contact details</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={`mailto:${application.email}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </a>
                  </Button>
                  {application.phone && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={`tel:${application.phone}`}>
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="" alt={application.full_name} />
                  <AvatarFallback className="text-2xl">
                    {getInitials(application.full_name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="space-y-2">
                  <div>
                    <h3 className="text-lg font-medium">{application.full_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Applied on {formatDate(application.created_at)}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <a 
                      href={`mailto:${application.email}`} 
                      className="text-sm text-primary hover:underline flex items-center"
                    >
                      <Mail className="h-4 w-4 mr-1" />
                      {application.email}
                    </a>
                  </div>
                  
                  {application.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{application.phone}</span>
                    </div>
                  )}
                  
                  {application.links && application.links.length > 0 && (
                    <div className="pt-2">
                      <h4 className="text-sm font-medium mb-1">Links</h4>
                      <div className="flex flex-wrap gap-2">
                        {application.links.map((link, index) => (
                          <a 
                            key={index} 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-primary hover:underline"
                          >
                            <LinkIcon className="h-3 w-3 mr-1" />
                            {link.name || 'Link'}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resume & Cover Letter */}
          <Tabs defaultValue="resume" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="resume">Resume</TabsTrigger>
              <TabsTrigger value="cover-letter">Cover Letter</TabsTrigger>
            </TabsList>
            <TabsContent value="resume" className="pt-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Resume</CardTitle>
                    <Button variant="outline" size="sm" asChild>
                      <a 
                        href={application.resume_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </a>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[600px] w-full bg-muted/50 rounded-md flex items-center justify-center">
                    <div className="text-center p-6 max-w-md">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="font-medium mb-1">Resume Preview</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        This is a preview of the applicant's resume. Click the download button above to view the full document.
                      </p>
                      <Button variant="outline" asChild>
                        <a 
                          href={application.resume_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center mx-auto"
                        >
                          <ArrowUpRight className="h-4 w-4 mr-2" />
                          Open in new tab
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="cover-letter" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Cover Letter</CardTitle>
                </CardHeader>
                <CardContent>
                  {application.cover_letter ? (
                    <div className="prose max-w-none">
                      {application.cover_letter}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>No cover letter was submitted with this application.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Experience */}
          {application.experience && application.experience.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Work Experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {application.experience.map((exp, index) => (
                  <div key={index} className="relative pb-6 last:pb-0">
                    {index < application.experience.length - 1 && (
                      <div className="absolute left-5 top-4 -ml-px h-full w-0.5 bg-border" />
                    )}
                    <div className="relative flex items-start">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Briefcase className="h-5 w-5" />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-medium">{exp.position}</h3>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(exp.start_date)} - {exp.current ? 'Present' : exp.end_date ? formatDate(exp.end_date) : 'N/A'}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">{exp.company}</div>
                        {exp.description && (
                          <p className="mt-2 text-sm">{exp.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Education */}
          {application.education && application.education.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Education</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {application.education.map((edu, index) => (
                  <div key={index} className="relative pb-6 last:pb-0">
                    {index < application.education.length - 1 && (
                      <div className="absolute left-5 top-4 -ml-px h-full w-0.5 bg-border" />
                    )}
                    <div className="relative flex items-start">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <GraduationCap className="h-5 w-5" />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-medium">{edu.degree}</h3>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(edu.start_date)} - {edu.current ? 'Present' : edu.end_date ? formatDate(edu.end_date) : 'N/A'}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {edu.institution}
                          {edu.field_of_study && `, ${edu.field_of_study}`}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Application Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Current Status</span>
                  <Badge 
                    variant={
                      application.status === 'hired' ? 'default' :
                      application.status === 'rejected' ? 'destructive' :
                      application.status === 'interviewing' ? 'outline' :
                      application.status === 'reviewed' ? 'secondary' : 'default'
                    }
                  >
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Applied On</span>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(application.created_at)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2 pt-2">
                <Label htmlFor="status">Update Status</Label>
                <Select
                  value={status}
                  onValueChange={(value) => setStatus(value as ApplicationStatus)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="interviewing">Interviewing</SelectItem>
                    <SelectItem value="hired">Hired</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  className="w-full mt-2"
                  onClick={() => handleStatusChange(status)}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Update Status'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Private Notes</CardTitle>
              <CardDescription>Only visible to your team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Textarea
                  placeholder="Add notes about this applicant..."
                  className="min-h-[120px]"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button 
                    size="sm" 
                    onClick={handleSaveNotes}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save Notes'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">{job?.title}</h3>
                <p className="text-sm text-muted-foreground">{job?.company}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{job?.location}, {job?.country}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Briefcase className="h-4 w-4 mr-2" />
                  <span className="capitalize">{job?.jobType?.replace('-', ' ')}</span>
                </div>
                {job?.salary && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <span>{job.salary}</span>
                  </div>
                )}
              </div>
              
              <Button 
                variant="outline" 
                className="w-full mt-2"
                onClick={() => router.push(`/admin/jobs/${id}`)}
              >
                View Job Posting
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
