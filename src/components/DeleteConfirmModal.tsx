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
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(17,30,53,0.5)', backdropFilter: 'blur(2px)' }}>
      <div
        className="w-full max-w-sm rounded-2xl p-6"
        style={{ background: '#FFFFFF', border: '1px solid #FECACA', boxShadow: '0 24px 60px rgba(0,0,0,0.15)' }}
      >
        <h2
          className="mb-2 uppercase"
          style={{
            fontFamily: 'var(--font-barlow-condensed)',
            fontSize: '17px',
            fontWeight: 700,
            letterSpacing: '0.07em',
            color: '#B91C1C',
          }}
        >
          Excluir Nota Fiscal
        </h2>
        <p className="text-sm mb-5" style={{ color: '#5A7A96' }}>
          Tem certeza que deseja excluir a NF{' '}
          <span style={{ color: '#1E2D3D', fontFamily: 'var(--font-jetbrains)', fontSize: '12px' }}>
            {nf.numero}
          </span>
          ? Esta ação não pode ser desfeita.
        </p>

        {error && (
          <p className="text-sm rounded-lg px-3 py-2 mb-4" style={{ color: '#B91C1C', background: '#FEF2F2', border: '1px solid #FECACA' }}>
            {error}
          </p>
        )}

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose} disabled={loading}
            className="px-4 py-2 rounded-lg text-sm transition-all"
            style={{ color: '#7A95B0', border: '1px solid #D0DAE8', background: '#fff' }}
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete} disabled={loading}
            className="px-5 py-2 rounded-lg text-sm font-semibold uppercase transition-all"
            style={{
              background: loading ? '#991B1B' : '#DC2626',
              color: '#fff',
              fontFamily: 'var(--font-barlow-condensed)',
              letterSpacing: '0.06em',
              opacity: loading ? 0.75 : 1,
            }}
          >
            {loading ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>
    </div>
  );
}
