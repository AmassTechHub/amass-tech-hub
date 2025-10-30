'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Calendar, Clock, MapPin, Search, Filter, CalendarDays, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import Link from 'next/link';
import { TechEvent } from '@/lib/types';

type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed';

interface Event extends Omit<TechEvent, 'date'> {
  date: string;
  status: EventStatus;
  is_featured: boolean;
  max_attendees?: number;
  price?: number;
  category_id?: string;
  created_at: string;
  updated_at: string;
  _count?: {
    registrations: number;
  };
}

export default function EventsAdmin() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<EventStatus | 'all'>('all');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [isBulkActionLoading, setIsBulkActionLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          _count:registrations(count)
        `)
        .order('date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: 'Error',
        description: 'Failed to load events. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEvents(events.filter(event => event.id !== id));
      
      toast({
        title: 'Success',
        description: 'Event deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete event. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleBulkDelete = async () => {
    if (selectedEvents.length === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedEvents.length} selected events? This action cannot be undone.`)) {
      return;
    }

    try {
      setIsBulkActionLoading(true);
      
      const { error } = await supabase
        .from('events')
        .delete()
        .in('id', selectedEvents);

      if (error) throw error;

      setEvents(events.filter(event => !selectedEvents.includes(event.id)));
      setSelectedEvents([]);
      
      toast({
        title: 'Success',
        description: `${selectedEvents.length} events deleted successfully.`,
      });
    } catch (error) {
      console.error('Error deleting events:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete events. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsBulkActionLoading(false);
    }
  };

  const handleBulkStatusUpdate = async (newStatus: EventStatus) => {
    if (selectedEvents.length === 0) return;

    try {
      setIsBulkActionLoading(true);
      
      const { error } = await supabase
        .from('events')
        .update({ status: newStatus })
        .in('id', selectedEvents);

      if (error) throw error;

      setEvents(events.map(event => 
        selectedEvents.includes(event.id) ? { ...event, status: newStatus } : event
      ));
      
      setSelectedEvents([]);
      
      toast({
        title: 'Success',
        description: `Updated status for ${selectedEvents.length} events.`,
      });
    } catch (error) {
      console.error('Error updating events:', error);
      toast({
        title: 'Error',
        description: 'Failed to update events. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsBulkActionLoading(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedEvents.length === filteredEvents.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(filteredEvents.map(event => event.id));
    }
  };

  const toggleSelectEvent = (eventId: string) => {
    setSelectedEvents(prev => 
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadgeVariant = (status: EventStatus) => {
    switch (status) {
      case 'published':
        return 'default';
      case 'draft':
        return 'outline';
      case 'cancelled':
        return 'destructive';
      case 'completed':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusBadgeText = (status: EventStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-muted-foreground">Manage and create events for your community</p>
        </div>
        <Button asChild>
          <Link href="/admin/events/new">
            <Plus className="h-4 w-4 mr-2" />
            New Event
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as EventStatus | 'all')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex gap-2">
              <Select
                disabled={selectedEvents.length === 0 || isBulkActionLoading}
                onValueChange={(value) => handleBulkStatusUpdate(value as EventStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Bulk actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Publish Selected</SelectItem>
                  <SelectItem value="draft">Mark as Draft</SelectItem>
                  <SelectItem value="cancelled">Cancel Selected</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="destructive" 
                disabled={selectedEvents.length === 0 || isBulkActionLoading}
                onClick={handleBulkDelete}
              >
                {isBulkActionLoading ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events Table */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Events</CardTitle>
              <p className="text-sm text-muted-foreground">
                {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
              </p>
            </div>
            {selectedEvents.length > 0 && (
              <div className="text-sm text-muted-foreground">
                {selectedEvents.length} {selectedEvents.length === 1 ? 'event' : 'events'} selected
              </div>
            )}
          </div>
        </CardHeader>
        
        {filteredEvents.length > 0 ? (
          <div className="relative overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedEvents.length === filteredEvents.length && filteredEvents.length > 0}
                      onCheckedChange={toggleSelectAll}
                      className="h-4 w-4"
                    />
                  </TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => (
                  <TableRow key={event.id} className="hover:bg-muted/50">
                    <TableCell>
                      <Checkbox 
                        checked={selectedEvents.includes(event.id)}
                        onCheckedChange={() => toggleSelectEvent(event.id)}
                        className="h-4 w-4"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {event.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div>{formatDate(event.date)}</div>
                          <div className="text-muted-foreground">
                            {formatTime(event.date)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="line-clamp-1">
                          {event.location} {event.country ? `, ${event.country}` : ''}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {event.eventType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(event.status)}>
                        {getStatusBadgeText(event.status)}
                      </Badge>
                      {event.is_featured && (
                        <Badge variant="secondary" className="ml-2">
                          Featured
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          asChild
                          className="h-8 w-8"
                        >
                          <Link href={`/events/${event.slug}`} target="_blank">
                            <span className="sr-only">View</span>
                            <ArrowUpRight className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          asChild
                        >
                          <Link href={`/admin/events/${event.id}/edit`}>
                            <span className="sr-only">Edit</span>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(event.id)}
                        >
                          <span className="sr-only">Delete</span>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12">
            <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No events found</h3>
            <p className="text-muted-foreground mt-1">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by creating a new event.'}
            </p>
            <Button className="mt-4" asChild>
              <Link href="/admin/events/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Link>
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
