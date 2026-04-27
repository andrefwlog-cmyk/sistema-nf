'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { EmbarqueInsert } from '@/lib/types';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

const empty: EmbarqueInsert = {
  navio_viagem: '',
  pol: '',
  pod: '',
  volume: '',
  booking: '',
  etb: null,
  pedido: false,
  lista: false,
  manifesto: false,
  status_adr: 'em_andamento',
  status_embarque: 'em_andamento',
};

export default function EmbarqueModal({ onClose, onSuccess }: Props) {
  const [form, setForm] = useState<EmbarqueInsert>(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function set<K extends keyof EmbarqueInsert>(field: K, value: EmbarqueInsert[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('embarques').insert({
      ...form,
      etb: form.etb || null,
      user_id: user!.id,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    onSuccess();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Novo Embarque</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Navio + Viagem *</label>
            <input
              required
              value={form.navio_viagem}
              onChange={(e) => set('navio_viagem', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">POL *</label>
              <input
                required
                value={form.pol}
                onChange={(e) => set('pol', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">POD *</label>
              <input
                required
                value={form.pod}
                onChange={(e) => set('pod', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Volume *</label>
              <input
                required
                value={form.volume}
                onChange={(e) => set('volume', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Booking *</label>
              <input
                required
                value={form.booking}
                onChange={(e) => set('booking', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ETB</label>
            <input
              type="date"
              value={form.etb ?? ''}
              onChange={(e) => set('etb', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>
          )}

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
