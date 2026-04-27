'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-3 py-2 rounded-lg w-full transition-all"
      style={{
        color: '#3D5878',
        fontFamily: 'var(--font-barlow-condensed)',
        fontSize: '13px',
        fontWeight: 500,
        letterSpacing: '0.02em',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = '#F87171';
        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.1)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = '#3D5878';
        (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
      }}
    >
      <LogOut size={14} strokeWidth={1.8} />
      Sair do Sistema
    </button>
  );
}
