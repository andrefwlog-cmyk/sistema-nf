import { createClient } from '@/lib/supabase/server';
import EmbarqueTable from '@/components/EmbarqueTable';

export default async function EmbarquesPage() {
  const supabase = await createClient();
  const { data: embarques } = await supabase
    .from('embarques')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <EmbarqueTable embarques={embarques ?? []} />
    </div>
  );
}
