import { redirect } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import NfTable from '@/components/NfTable';
import LogoutButton from '@/components/LogoutButton';

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: nfs } = await supabase
    .from('notas_fiscais')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image src="/logo.png" alt="Logo" width={120} height={40} className="object-contain" priority />
          <div className="w-px h-8 bg-gray-200" />
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Controle de Notas Fiscais</h1>
            <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
          </div>
        </div>
        <LogoutButton />
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <NfTable nfs={nfs ?? []} />
      </main>
    </div>
  );
}
