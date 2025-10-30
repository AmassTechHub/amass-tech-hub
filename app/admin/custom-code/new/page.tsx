'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { CodeSnippet } from '../page';
import CodeEditor from '@/components/admin/CodeEditor';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NewCustomCodePage() {
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSave = async (data: Omit<CodeSnippet, 'id' | 'created_at' | 'updated_at'>) => {
    setIsSaving(true);
    try {
      const { data: newSnippet, error } = await supabase
        .from('custom_code')
        .insert([
          {
            ...data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ])
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Snippet created successfully');
      router.push(`/admin/custom-code/${newSnippet.id}`);
      router.refresh();
    } catch (err) {
      console.error('Error creating snippet:', err);
      toast.error('Failed to create snippet');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">New Code Snippet</h1>
          <p className="text-muted-foreground">
            Create a new code snippet to inject into your site
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/custom-code">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Snippets
          </Link>
        </Button>
      </div>

      <div className="bg-background rounded-lg border p-6">
        <CodeEditor 
          onSave={handleSave} 
          isSaving={isSaving}
        />
      </div>
    </div>
  );
}
