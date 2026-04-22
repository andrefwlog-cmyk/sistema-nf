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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Excluir Nota Fiscal</h2>
        <p className="text-sm text-gray-600 mb-4">
          Tem certeza que deseja excluir a NF <span className="font-semibold">{nf.numero}</span>? Esta ação não pode ser desfeita.
        </p>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 mb-4">{error}</p>
        )}

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-60 transition-colors"
          >
            {loading ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>
    </div>
  );
}
