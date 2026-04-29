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
      className="flex items-center gap-2 px-3 py-2 rounded-lg w-full transition-all duration-150"
      style={{
        color: 'var(--tx-2)',
        fontFamily: 'var(--font-barlow-condensed)',
        fontSize: '13px',
        fontWeight: 500,
        letterSpacing: '0.02em',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = '#EF4444';
        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.08)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = 'var(--tx-2)';
        (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
      }}
    >
      <LogOut size={13} strokeWidth={1.8} />
      Sair do Sistema
    </button>
  );
}
