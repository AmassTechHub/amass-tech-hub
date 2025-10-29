'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Save, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

const jobFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  company: z.string().min(2, 'Company name is required'),
  location: z.string().min(2, 'Location is required'),
  country: z.string().min(2, 'Country is required'),
  jobType: z.enum(['full-time', 'part-time', 'contract', 'remote']),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  requirements: z.array(z.string().min(1, 'Requirement cannot be empty')),
  salary: z.string().optional(),
  applyUrl: z.string().url('Please enter a valid URL').or(z.literal('')),
  expiresAt: z.string().min(1, 'Expiry date is required'),
  isFeatured: z.boolean().default(false),
});

type JobFormValues = z.infer<typeof jobFormSchema>;

export default function EditJobPage() {
  const router = useRouter();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newRequirement, setNewRequirement] = useState('');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      requirements: [],
      jobType: 'full-time',
      isFeatured: false,
    },
  });

  const requirements = watch('requirements') || [];

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data: job, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (!job) throw new Error('Job not found');

        // Format dates for the date input
        const formattedJob = {
          ...job,
          expiresAt: job.expires_at ? new Date(job.expires_at).toISOString().split('T')[0] : '',
          requirements: job.requirements || [],
        };

        reset(formattedJob);
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
  }, [id, reset, router]);

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setValue('requirements', [...requirements, newRequirement.trim()]);
      setNewRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    setValue(
      'requirements',
      requirements.filter((_, i) => i !== index)
    );
  };

  const onSubmit = async (data: JobFormValues) => {
    try {
      setIsSubmitting(true);
      
      const jobData = {
        ...data,
        slug: data.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
        updated_at: new Date().toISOString(),
        expires_at: new Date(data.expiresAt).toISOString(),
      };

      const { error } = await supabase
        .from('jobs')
        .update(jobData)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Job listing updated successfully!',
      });

      router.push('/admin/jobs');
    } catch (error) {
      console.error('Error updating job:', error);
      toast({
        title: 'Error',
        description: 'Failed to update job listing. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this job listing? This action cannot be undone.')) {
      return;
    }

    try {
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
    }
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
          onClick={() => router.push('/admin/jobs')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Button>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Edit Job Listing</h1>
            <p className="text-muted-foreground">
              Update the job details below
            </p>
          </div>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isSubmitting}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Job
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Job Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Job Title *</Label>
            <Input
              id="title"
              placeholder="e.g. Senior Frontend Developer"
              {...register('title')}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Company */}
          <div className="space-y-2">
            <Label htmlFor="company">Company *</Label>
            <Input
              id="company"
              placeholder="Company name"
              {...register('company')}
            />
            {errors.company && (
              <p className="text-sm text-red-500">{errors.company.message}</p>
            )}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              placeholder="e.g. Lagos, Nigeria"
              {...register('location')}
            />
            {errors.location && (
              <p className="text-sm text-red-500">{errors.location.message}</p>
            )}
          </div>

          {/* Country */}
          <div className="space-y-2">
            <Label htmlFor="country">Country *</Label>
            <Input
              id="country"
              placeholder="e.g. Nigeria"
              {...register('country')}
            />
            {errors.country && (
              <p className="text-sm text-red-500">{errors.country.message}</p>
            )}
          </div>

          {/* Job Type */}
          <div className="space-y-2">
            <Label>Job Type *</Label>
            <div className="grid grid-cols-2 gap-2">
              {['full-time', 'part-time', 'contract', 'remote'].map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={type}
                    value={type}
                    className="h-4 w-4 text-primary focus:ring-primary"
                    {...register('jobType')}
                  />
                  <Label htmlFor={type} className="capitalize">
                    {type.split('-').join(' ')}
                  </Label>
                </div>
              ))}
            </div>
            {errors.jobType && (
              <p className="text-sm text-red-500">{errors.jobType.message}</p>
            )}
          </div>

          {/* Salary */}
          <div className="space-y-2">
            <Label htmlFor="salary">Salary (optional)</Label>
            <Input
              id="salary"
              placeholder="e.g. $50,000 - $70,000"
              {...register('salary')}
            />
            {errors.salary && (
              <p className="text-sm text-red-500">{errors.salary.message}</p>
            )}
          </div>

          {/* Apply URL */}
          <div className="space-y-2">
            <Label htmlFor="applyUrl">Application URL (optional)</Label>
            <Input
              id="applyUrl"
              type="url"
              placeholder="https://example.com/apply"
              {...register('applyUrl')}
            />
            {errors.applyUrl && (
              <p className="text-sm text-red-500">{errors.applyUrl.message}</p>
            )}
          </div>

          {/* Expiry Date */}
          <div className="space-y-2">
            <Label htmlFor="expiresAt">Application Deadline *</Label>
            <Input
              id="expiresAt"
              type="date"
              min={new Date().toISOString().split('T')[0]}
              {...register('expiresAt')}
            />
            {errors.expiresAt && (
              <p className="text-sm text-red-500">{errors.expiresAt.message}</p>
            )}
          </div>

          {/* Featured */}
          <div className="flex items-center space-x-2">
            <Checkbox id="isFeatured" {...register('isFeatured')} />
            <Label htmlFor="isFeatured" className="font-normal">
              Feature this job listing
            </Label>
          </div>
        </div>

        {/* Job Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Job Description *</Label>
          <Textarea
            id="description"
            placeholder="Detailed job description, responsibilities, and requirements..."
            rows={6}
            {...register('description')}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        {/* Requirements */}
        <div className="space-y-2">
          <Label>Requirements *</Label>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Add a requirement (e.g. 3+ years of experience)"
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addRequirement();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={addRequirement}
              >
                Add
              </Button>
            </div>
            {errors.requirements && (
              <p className="text-sm text-red-500">
                {errors.requirements.message || 'At least one requirement is required'}
              </p>
            )}
            <div className="space-y-2 mt-2">
              {requirements.map((req, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-muted/50 rounded-md"
                >
                  <span>{req}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground"
                    onClick={() => removeRequirement(index)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    <span className="sr-only">Remove requirement</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/jobs')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <div className="space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.open(`/jobs/${watch('slug')}`, '_blank')}
              disabled={isSubmitting}
            >
              Preview
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
