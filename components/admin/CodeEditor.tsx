'use client';

import { useState, useEffect } from 'react';
import { Loader2, Save, Code as CodeIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodeSnippet, CodeSnippetLocation, DeviceType, CodeSnippetStatus } from '@/app/admin/custom-code/page';

interface CodeEditorProps {
  snippet?: CodeSnippet;
  onSave: (snippet: Omit<CodeSnippet, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onCancel?: () => void;
  isSaving: boolean;
}

export default function CodeEditor({ snippet, onSave, onCancel, isSaving }: CodeEditorProps) {
  const [formData, setFormData] = useState<Omit<CodeSnippet, 'id' | 'created_at' | 'updated_at'>>(
    snippet || {
      name: '',
      description: '',
      code: '',
      location: 'head',
      device_type: 'all',
      status: 'draft',
      priority: 0,
      meta: {},
      conditions: {},
    }
  );

  const [activeTab, setActiveTab] = useState('code');
  const [isPreview, setIsPreview] = useState(false);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConditionChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Snippet Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g., Google Analytics"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleChange('status', value as CodeSnippetStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="What does this code do?"
            rows={2}
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="conditions">Conditions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="code" className="pt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Code Snippet</Label>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <input
                      type="checkbox"
                      id="preview"
                      checked={isPreview}
                      onChange={(e) => setIsPreview(e.target.checked)}
                      className="sr-only"
                    />
                    <Button
                      type="button"
                      variant={isPreview ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setIsPreview(!isPreview)}
                      className="h-8"
                    >
                      {isPreview ? 'Edit Code' : 'Preview'}
                    </Button>
                  </div>
                </div>
              </div>
              
              {isPreview ? (
                <div className="bg-gray-900 text-gray-100 p-4 rounded-md font-mono text-sm overflow-auto">
                  <pre>{formData.code}</pre>
                </div>
              ) : (
                <Textarea
                  value={formData.code}
                  onChange={(e) => handleChange('code', e.target.value)}
                  placeholder="Paste your HTML, CSS, or JavaScript code here..."
                  className="font-mono text-sm min-h-[300px]"
                  spellCheck={false}
                />
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Select
                    value={formData.location}
                    onValueChange={(value) => handleChange('location', value as CodeSnippetLocation)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="head">Head (before &lt;/head&gt;)</SelectItem>
                      <SelectItem value="body_start">Body Start (after &lt;body&gt;)</SelectItem>
                      <SelectItem value="body_end">Body End (before &lt;/body&gt;)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="device_type">Device Type</Label>
                  <Select
                    value={formData.device_type}
                    onValueChange={(value) => handleChange('device_type', value as DeviceType)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select device type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Devices</SelectItem>
                      <SelectItem value="desktop">Desktop Only</SelectItem>
                      <SelectItem value="tablet">Tablet Only</SelectItem>
                      <SelectItem value="mobile">Mobile Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="pt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Input
                    id="priority"
                    type="number"
                    value={formData.priority}
                    onChange={(e) => handleChange('priority', parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                  <p className="text-xs text-muted-foreground">
                    Higher numbers execute first (useful for dependencies)
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Schedule</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label htmlFor="start_date" className="text-xs">Start Date</Label>
                      <Input
                        id="start_date"
                        type="datetime-local"
                        value={formData.start_date || ''}
                        onChange={(e) => handleChange('start_date', e.target.value || null)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="end_date" className="text-xs">End Date</Label>
                      <Input
                        id="end_date"
                        type="datetime-local"
                        value={formData.end_date || ''}
                        onChange={(e) => handleChange('end_date', e.target.value || null)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Execution Options</Label>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <Label htmlFor="execute_once">Execute Once per Session</Label>
                      <p className="text-xs text-muted-foreground">
                        Only run this code once per browser session
                      </p>
                    </div>
                    <Switch
                      id="execute_once"
                      checked={!!formData.meta?.execute_once}
                      onCheckedChange={(checked) => 
                        handleChange('meta', { ...formData.meta, execute_once: checked })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <Label htmlFor="minify">Minify Code</Label>
                      <p className="text-xs text-muted-foreground">
                        Remove comments and whitespace when possible
                      </p>
                    </div>
                    <Switch
                      id="minify"
                      checked={!!formData.meta?.minify}
                      onCheckedChange={(checked) => 
                        handleChange('meta', { ...formData.meta, minify: checked })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="conditions" className="pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Page Conditions</Label>
                <Textarea
                  value={formData.conditions?.pages?.join('\n') || ''}
                  onChange={(e) => 
                    handleConditionChange('pages', 
                      e.target.value.split('\n').filter(Boolean)
                    )
                  }
                  placeholder="Enter one URL path per line (e.g., /about, /blog/*)"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty to run on all pages. Use * as a wildcard.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>User Conditions</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <Label htmlFor="logged_in">Only show to logged-in users</Label>
                      <p className="text-xs text-muted-foreground">
                        Only execute this code for authenticated users
                      </p>
                    </div>
                    <Switch
                      id="logged_in"
                      checked={!!formData.conditions?.logged_in}
                      onCheckedChange={(checked) => 
                        handleConditionChange('logged_in', checked)
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="user_roles" className="text-sm">User Roles</Label>
                    <Input
                      id="user_roles"
                      value={formData.conditions?.user_roles?.join(', ') || ''}
                      onChange={(e) => 
                        handleConditionChange('user_roles', 
                          e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                        )
                      }
                      placeholder="admin, editor, subscriber"
                    />
                    <p className="text-xs text-muted-foreground">
                      Comma-separated list of user roles that should see this code
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Query Parameters</Label>
                <Textarea
                  value={formData.conditions?.query_params ? 
                    Object.entries(formData.conditions.query_params)
                      .map(([key, value]) => `${key}=${value}`)
                      .join('\n') 
                    : ''
                  }
                  onChange={(e) => {
                    const params = e.target.value
                      .split('\n')
                      .reduce<Record<string, string>>((acc, line) => {
                        const [key, value] = line.split('=');
                        if (key && value) acc[key.trim()] = value.trim();
                        return acc;
                      }, {});
                    handleConditionChange('query_params', Object.keys(params).length ? params : undefined);
                  }}
                  placeholder="utm_source=google\nref=newsletter"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Only execute when these query parameters are present. One key=value per line.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4 border-t">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSaving}
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {snippet ? 'Update' : 'Create'} Snippet
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
