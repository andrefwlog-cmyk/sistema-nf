import { createClient } from '@/lib/supabase/server';
import NfTable from '@/components/NfTable';

export default async function NotasFiscaisPage() {
  const supabase = await createClient();
  const { data: nfs } = await supabase
    .from('notas_fiscais')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <NfTable nfs={nfs ?? []} />
    </div>
  );
}
