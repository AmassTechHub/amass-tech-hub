'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, ArrowLeft, Save, Loader2 } from 'lucide-react';
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

export default function NewJobPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newRequirement, setNewRequirement] = useState('');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
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
        posted_at: new Date().toISOString(),
        expires_at: new Date(data.expiresAt).toISOString(),
      };

      const { error } = await supabase.from('jobs').insert([jobData]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Job listing created successfully!',
      });

      router.push('/admin/jobs');
    } catch (error) {
      console.error('Error creating job:', error);
      toast({
        title: 'Error',
        description: 'Failed to create job listing. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Button>
        <h1 className="text-3xl font-bold">Create New Job Listing</h1>
        <p className="text-muted-foreground">
          Fill in the details below to create a new job listing
        </p>
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
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove requirement</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/jobs')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Create Job
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
