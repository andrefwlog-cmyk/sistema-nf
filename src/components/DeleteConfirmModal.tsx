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
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0,0,0,0.75)' }}>
      <div
        className="w-full max-w-sm rounded-2xl p-6"
        style={{
          background: '#0B1020',
          border: '1px solid rgba(239,68,68,0.2)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
        }}
      >
        <h2
          className="mb-2 uppercase"
          style={{
            fontFamily: 'var(--font-barlow-condensed)',
            fontSize: '17px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: '#EF4444',
          }}
        >
          Excluir Nota Fiscal
        </h2>
        <p className="text-sm mb-5" style={{ color: '#5E7A9A' }}>
          Tem certeza que deseja excluir a NF{' '}
          <span style={{ color: '#C4D4E8', fontFamily: 'var(--font-jetbrains)', fontSize: '12px' }}>
            {nf.numero}
          </span>
          ? Esta ação não pode ser desfeita.
        </p>

        {error && (
          <p
            className="text-sm rounded-lg px-3 py-2 mb-4"
            style={{ color: '#F87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            {error}
          </p>
        )}

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-sm transition-all"
            style={{ color: '#4E6A88', border: '1px solid rgba(100,140,200,0.15)' }}
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-5 py-2 rounded-lg text-sm font-semibold uppercase tracking-wider transition-all"
            style={{
              background: loading ? '#7A1A1A' : '#EF4444',
              color: '#fff',
              fontFamily: 'var(--font-barlow-condensed)',
              letterSpacing: '0.06em',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>
    </div>
  );
}
