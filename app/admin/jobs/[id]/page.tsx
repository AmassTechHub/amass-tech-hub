'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit, ExternalLink, Calendar, MapPin, Briefcase, Globe, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { JobListing } from '@/lib/types';

export default function JobDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [job, setJob] = useState<JobListing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Job not found');

        setJob(data);
      } catch (error) {
        console.error('Error fetching job:', error);
        toast({
          title: 'Error',
          description: 'Failed to load job details. Please try again.',
          variant: 'destructive',
        });
        router.push('/admin/jobs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [id, router]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this job listing? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Job listing deleted successfully.',
      });

      router.push('/admin/jobs');
    } catch (error) {
      console.error('Error deleting job:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete job listing. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getJobTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'full-time':
        return 'default';
      case 'part-time':
        return 'secondary';
      case 'contract':
        return 'outline';
      case 'remote':
        return 'default';
      default:
        return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Job Not Found</h2>
        <p className="text-muted-foreground mt-2">The requested job could not be found.</p>
        <Button className="mt-4" onClick={() => router.push('/admin/jobs')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.push('/admin/jobs')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{job.title}</h1>
            <div className="flex items-center mt-2 text-muted-foreground">
              <span>at {job.company}</span>
              <span className="mx-2">•</span>
              <Badge variant={getJobTypeBadgeVariant(job.jobType)} className="capitalize">
                {job.jobType.replace('-', ' ')}
              </Badge>
              {job.isFeatured && (
                <Badge variant="secondary" className="ml-2">
                  Featured
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/admin/jobs/${job.id}/edit`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Job Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Job Type</p>
                    <p className="font-medium capitalize">{job.jobType.replace('-', ' ')}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">
                      {job.location}, {job.country}
                      {job.jobType === 'remote' && ' (Remote)'}
                    </p>
                  </div>
                </div>

                {job.salary && (
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Salary</p>
                      <p className="font-medium">{job.salary}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Posted</p>
                    <p className="font-medium">
                      {formatDate(job.posted_at || job.created_at)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Expires</p>
                    <p className="font-medium">
                      {job.expires_at ? formatDate(job.expires_at) : 'No expiry date'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    {job.is_active ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium">
                      {job.is_active ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
              </div>

              {job.applyUrl && (
                <div className="pt-4">
                  <Button asChild>
                    <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
                      Apply Now <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Job Description */}
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            </CardContent>
          </Card>

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {job.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>{requirement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => router.push(`/admin/jobs/${job.id}/edit`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Job
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => window.open(`/jobs/${job.slug}`, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Site
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/jobs/${job.slug}`);
                  toast({
                    title: 'Link copied to clipboard',
                    description: 'Share this job with others!',
                  });
                }}
              >
                <Link className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
              <Button 
                variant={job.is_active ? 'outline' : 'default'} 
                className="w-full justify-start"
                onClick={async () => {
                  try {
                    const { error } = await supabase
                      .from('jobs')
                      .update({ is_active: !job.is_active })
                      .eq('id', job.id);

                    if (error) throw error;

                    setJob({ ...job, is_active: !job.is_active });
                    toast({
                      title: 'Success',
                      description: `Job ${job.is_active ? 'deactivated' : 'activated'} successfully.`,
                    });
                  } catch (error) {
                    console.error('Error updating job status:', error);
                    toast({
                      title: 'Error',
                      description: 'Failed to update job status. Please try again.',
                      variant: 'destructive',
                    });
                  }
                }}
              >
                {job.is_active ? (
                  <XCircle className="h-4 w-4 mr-2" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                {job.is_active ? 'Deactivate' : 'Activate'}
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Job
              </Button>
            </CardContent>
          </Card>

          {/* Job Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
              <CardDescription>Job performance metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Views</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Applications</p>
                </div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold">0%</p>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
