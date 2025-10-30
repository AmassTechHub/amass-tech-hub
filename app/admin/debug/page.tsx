'use client';

import { useEffect, useState } from 'react';
import { checkSupabaseConnection, fetchTableData } from '@/lib/supabase/utils';

export default function DebugPage() {
  const [connectionStatus, setConnectionStatus] = useState<any>(null);
  const [tablesData, setTablesData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tables = [
    'reviews',
    'tools',
    'tutorials',
    'services',
    'knowledge_base',
    'faqs',
    'users',
    'custom_code'
  ];

  useEffect(() => {
    const checkConnection = async () => {
      try {
        setLoading(true);
        
        // Check Supabase connection
        const connection = await checkSupabaseConnection();
        setConnectionStatus(connection);

        // Fetch data from all tables
        const data: Record<string, any> = {};
        for (const table of tables) {
          const result = await fetchTableData(table);
          data[table] = result;
        }
        setTablesData(data);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        console.error('Debug error:', err);
      } finally {
        setLoading(false);
      }
    };

    checkConnection();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Debugging Admin Panel</h1>
        <p>Checking database connection and tables...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Panel Debug Information</h1>
      
      <div className="mb-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Environment Variables</h2>
        <pre className="bg-white p-4 rounded overflow-x-auto text-sm">
          {JSON.stringify({
            'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing',
            'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
              ? '✅ Set' 
              : '❌ Missing',
          }, null, 2)}
        </pre>
      </div>

      <div className="mb-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Database Connection</h2>
        <pre className="bg-white p-4 rounded overflow-x-auto text-sm">
          {JSON.stringify(connectionStatus, null, 2)}
        </pre>
      </div>

      <div className="space-y-8">
        {tables.map((table) => (
          <div key={table} className="p-4 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Table: {table}</h2>
            <div className="bg-white p-4 rounded overflow-x-auto">
              {tablesData[table]?.error ? (
                <div className="text-red-600">
                  Error: {tablesData[table].error.message}
                </div>
              ) : (
                <pre className="text-xs">
                  {JSON.stringify(tablesData[table]?.data || 'No data', null, 2)}
                </pre>
              )}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="mt-8 p-4 bg-red-100 text-red-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <pre className="whitespace-pre-wrap">{error}</pre>
        </div>
      )}
    </div>
  );
}
