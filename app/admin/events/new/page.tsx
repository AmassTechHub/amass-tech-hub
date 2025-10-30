'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Plus, X, Image as ImageIcon, Calendar, Clock, MapPin, Globe, DollarSign, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed';
type EventType = 'conference' | 'webinar' | 'meetup' | 'workshop';

const eventFormSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  eventType: z.enum(['conference', 'webinar', 'meetup', 'workshop']),
  date: z.date({
    required_error: 'Please select a date and time',
  }),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  timezone: z.string().default('Africa/Lagos'),
  location: z.string().min(3, 'Location is required'),
  locationUrl: z.string().url('Please enter a valid URL').or(z.literal('')),
  country: z.string().min(2, 'Country is required'),
  isVirtual: z.boolean().default(false),
  virtualMeetingUrl: z.string().url('Please enter a valid URL').or(z.literal('')).optional(),
  maxAttendees: z.number().int().positive('Must be a positive number').or(z.null()).optional(),
  price: z.number().min(0, 'Price cannot be negative').or(z.null()).optional(),
  isFeatured: z.boolean().default(false),
  status: z.enum(['draft', 'published', 'cancelled', 'completed']).default('draft'),
  image: z.string().url('Please enter a valid URL').or(z.literal('')).optional(),
  agenda: z.array(z.object({
    id: z.string(),
    time: z.string(),
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    speaker: z.string().optional(),
  })).optional(),
  speakers: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

export default function NewEventPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [agendaItems, setAgendaItems] = useState([{ id: Date.now().toString(), time: '', title: '', description: '', speaker: '' }]);
  const [previewImage, setPreviewImage] = useState('');

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      eventType: 'meetup',
      date: new Date(),
      startTime: '10:00',
      endTime: '17:00',
      timezone: 'Africa/Lagos',
      location: '',
      locationUrl: '',
      country: 'Nigeria',
      isVirtual: false,
      virtualMeetingUrl: '',
      maxAttendees: null,
      price: null,
      isFeatured: false,
      status: 'draft',
      image: '',
      agenda: [],
      speakers: [],
      tags: [],
    },
  });

  const { watch, setValue } = form;
  const watchIsVirtual = watch('isVirtual');
  const watchImage = watch('image');
  const watchTags = watch('tags');

  // Generate slug from title
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'title' && value.title) {
        const slug = value.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        setValue('slug', slug, { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  // Handle image preview
  useEffect(() => {
    if (watchImage) {
      setPreviewImage(watchImage);
    } else {
      setPreviewImage('');
    }
  }, [watchImage]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImageUploading(true);
    
    try {
      // In a real app, you would upload the file to a storage service
      // and get the URL back. For now, we'll just use a placeholder.
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const imageUrl = URL.createObjectURL(file);
      setValue('image', imageUrl);
      setPreviewImage(imageUrl);
      
      toast({
        title: 'Success',
        description: 'Image uploaded successfully',
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsImageUploading(false);
    }
  };

  const addAgendaItem = () => {
    setAgendaItems([...agendaItems, { id: Date.now().toString(), time: '', title: '', description: '', speaker: '' }]);
  };

  const removeAgendaItem = (index: number) => {
    const newAgenda = [...agendaItems];
    newAgenda.splice(index, 1);
    setAgendaItems(newAgenda);
  };

  const updateAgendaItem = (index: number, field: string, value: string) => {
    const newAgenda = [...agendaItems];
    newAgenda[index] = { ...newAgenda[index], [field]: value };
    setAgendaItems(newAgenda);
  };

  const addTag = () => {
    if (newTag.trim() && !watchTags.includes(newTag.trim())) {
      setValue('tags', [...watchTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue('tags', watchTags.filter(tag => tag !== tagToRemove));
  };

  const onSubmit = async (data: EventFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Format the date and time
      const startDateTime = new Date(data.date);
      const [startHours, startMinutes] = data.startTime.split(':').map(Number);
      startDateTime.setHours(startHours, startMinutes);
      
      const endDateTime = new Date(data.date);
      const [endHours, endMinutes] = data.endTime.split(':').map(Number);
      endDateTime.setHours(endHours, endMinutes);
      
      // Prepare the event data
      const eventData = {
        title: data.title,
        slug: data.slug,
        description: data.description,
        event_type: data.eventType,
        start_date: startDateTime.toISOString(),
        end_date: endDateTime.toISOString(),
        timezone: data.timezone,
        location: data.location,
        location_url: data.locationUrl || null,
        country: data.country,
        is_virtual: data.isVirtual,
        virtual_meeting_url: data.virtualMeetingUrl || null,
        max_attendees: data.maxAttendees || null,
        price: data.price || 0,
        is_featured: data.isFeatured,
        status: data.status,
        image: data.image || null,
        agenda: agendaItems,
        tags: data.tags,
      };
      
      // In a real app, you would save the event to your database here
      console.log('Submitting event:', eventData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Success',
        description: 'Event created successfully!',
      });
      
      // Redirect to events list
      router.push('/admin/events');
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: 'Error',
        description: 'Failed to create event. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Create New Event</h1>
          <p className="text-muted-foreground">Fill in the details below to create a new event</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            form="event-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Event'}
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} id="event-form" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Title *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter event title" {...field} />
                        </FormControl>
                        <FormDescription>
                          Make it descriptive and engaging to attract attendees.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="eventType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event Type *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select event type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="conference">Conference</SelectItem>
                              <SelectItem value="webinar">Webinar</SelectItem>
                              <SelectItem value="meetup">Meetup</SelectItem>
                              <SelectItem value="workshop">Workshop</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL Slug *</FormLabel>
                          <FormControl>
                            <div className="flex">
                              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                                /events/
                              </span>
                              <Input 
                                className="rounded-l-none" 
                                placeholder="event-slug" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell potential attendees what your event is about..." 
                            className="min-h-[120px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Provide a detailed description of your event.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-4">
                    <FormLabel>Event Image</FormLabel>
                    <div className="flex items-center gap-4">
                      <div className="relative w-32 h-32 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                        {previewImage ? (
                          <img 
                            src={previewImage} 
                            alt="Event preview" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1
                      space-y-2">
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="relative"
                            disabled={isImageUploading}
                          >
                            <input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={handleImageUpload}
                              disabled={isImageUploading}
                            />
                            {isImageUploading ? 'Uploading...' : 'Upload Image'}
                          </Button>
                          {previewImage && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setPreviewImage('');
                                setValue('image', '');
                              }}
                              disabled={isImageUploading}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Recommended size: 1200x630px. Max file size: 2MB.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Date & Time */}
              <Card>
                <CardHeader>
                  <CardTitle>Date & Time</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date *</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    'pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, 'PPP')
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Time *</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="endTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Time *</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="timezone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Timezone</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select timezone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Africa/Lagos">Lagos (WAT)</SelectItem>
                            <SelectItem value="Africa/Johannesburg">Johannesburg (SAST)</SelectItem>
                            <SelectItem value="Africa/Cairo">Cairo (EET)</SelectItem>
                            <SelectItem value="Europe/London">London (GMT/BST)</SelectItem>
                            <SelectItem value="America/New_York">New York (ET)</SelectItem>
                            <SelectItem value="America/Los_Angeles">Los Angeles (PT)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Location */}
              <Card>
                <CardHeader>
                  <CardTitle>Location</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="isVirtual"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>This is an online event</FormLabel>
                          <FormDescription>
                            Check this if your event is virtual/online.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  {watchIsVirtual ? (
                    <FormField
                      control={form.control}
                      name="virtualMeetingUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Virtual Meeting URL *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://zoom.us/j/..." 
                              {...field} 
                              value={field.value || ''}
                            />
                          </FormControl>
                          <FormDescription>
                            Enter the Zoom, Google Meet, or other meeting URL.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <>
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Venue Name *</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  placeholder="e.g., Lagos Convention Center" 
                                  className="pl-10" 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="locationUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location URL (Optional)</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input 
                                    placeholder="https://maps.google.com/..." 
                                    className="pl-10" 
                                    {...field} 
                                    value={field.value || ''}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select country" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Nigeria">Nigeria</SelectItem>
                                  <SelectItem value="Ghana">Ghana</SelectItem>
                                  <SelectItem value="Kenya">Kenya</SelectItem>
                                  <SelectItem value="South Africa">South Africa</SelectItem>
                                  <SelectItem value="Egypt">Egypt</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Agenda */}
              <Card>
                <CardHeader>
                  <CardTitle>Agenda</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Add a schedule for your event (optional)
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {agendaItems.map((item, index) => (
                    <div key={item.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">Agenda Item {index + 1}</h4>
                        {agendaItems.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => removeAgendaItem(index)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-1 block">Time</label>
                          <Input
                            type="time"
                            value={item.time}
                            onChange={(e) => updateAgendaItem(index, 'time', e.target.value)}
                            className="w-full"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium mb-1 block">Title *</label>
                          <Input
                            placeholder="e.g., Registration & Breakfast"
                            value={item.title}
                            onChange={(e) => updateAgendaItem(index, 'title', e.target.value)}
                            className="w-full"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1 block">Description (Optional)</label>
                        <Textarea
                          placeholder="Add details about this agenda item"
                          value={item.description}
                          onChange={(e) => updateAgendaItem(index, 'description', e.target.value)}
                          className="min-h-[80px]"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1 block">Speaker (Optional)</label>
                        <Input
                          placeholder="Speaker's name and title"
                          value={item.speaker}
                          onChange={(e) => updateAgendaItem(index, 'speaker', e.target.value)}
                          className="w-full"
                        />
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={addAgendaItem}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Agenda Item
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              {/* Publish */}
              <Card>
                <CardHeader>
                  <CardTitle>Publish</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Set the status of this event.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Feature this event</FormLabel>
                          <FormDescription>
                            Featured events are displayed prominently on the website.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <div className="pt-4 space-y-4">
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Saving...' : 'Save Event'}
                    </Button>
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => router.back()}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Event Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Event Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="maxAttendees"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Attendees (Optional)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                              type="number" 
                              min="1" 
                              placeholder="Leave empty for unlimited" 
                              className="pl-10"
                              value={field.value || ''}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (Optional)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                              type="number" 
                              min="0" 
                              step="0.01" 
                              placeholder="0.00" 
                              className="pl-10"
                              value={field.value || ''}
                              onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Set to 0 for free events.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              {/* Tags */}
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Add tags to help people find your event
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addTag}
                      disabled={!newTag.trim()}
                    >
                      Add
                    </Button>
                  </div>
                  
                  {watchTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {watchTags.map((tag) => (
                        <div
                          key={tag}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-muted text-muted-foreground"
                        >
                          {tag}
                          <button
                            type="button"
                            className="ml-2 hover:text-destructive"
                            onClick={() => removeTag(tag)}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
