'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { NotaFiscal } from '@/lib/types';

interface Props {
  nf: NotaFiscal;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteConfirmModal({ nf, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleDelete() {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from('notas_fiscais').delete().eq('id', nf.id);
    if (error) {
      setError('Erro ao excluir. Tente novamente.');
      setLoading(false);
      return;
    }
    onSuccess();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-fade-in"
      style={{ background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6 animate-fade-up"
        style={{
          background: 'var(--surface)',
          border: '1px solid rgba(220,38,38,0.2)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
        }}
      >
        <h2
          className="mb-2"
          style={{
            fontFamily: 'var(--font-syne)',
            fontSize: '16px',
            fontWeight: 700,
            color: 'var(--red)',
          }}
        >
          Excluir Nota Fiscal
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--tx-2)', lineHeight: 1.6 }}>
          Tem certeza que deseja excluir a NF{' '}
          <span style={{ color: 'var(--tx)', fontFamily: 'var(--font-jetbrains)', fontSize: '12px' }}>
            {nf.numero}
          </span>
          ? Esta ação não pode ser desfeita.
        </p>

        {error && (
          <p
            className="text-sm rounded-lg px-3 py-2 mb-4"
            style={{ color: 'var(--red)', background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.18)' }}
          >
            {error}
          </p>
        )}

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose} disabled={loading}
            className="px-4 py-2 rounded-lg text-sm transition-all duration-150"
            style={{ color: 'var(--tx-2)', border: '1px solid var(--border-2)', background: 'transparent' }}
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete} disabled={loading}
            className="px-5 py-2 rounded-lg text-sm font-bold uppercase transition-all duration-150"
            style={{
              background: 'var(--red)',
              color: '#fff',
              fontFamily: 'var(--font-barlow-condensed)',
              letterSpacing: '0.08em',
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>
    </div>
  );
}
