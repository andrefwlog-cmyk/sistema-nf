'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Check, Search, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Embarque } from '@/lib/types';
import EmbarqueModal from './EmbarqueModal';

interface Props {
  embarques: Embarque[];
}

const ADR_OPTIONS: { value: Embarque['status_adr']; label: string }[] = [
  { value: 'em_andamento', label: 'Em andamento' },
  { value: 'finalizado', label: 'Finalizado' },
];

const EMBARQUE_OPTIONS: { value: Embarque['status_embarque']; label: string }[] = [
  { value: 'em_andamento', label: 'Em andamento' },
  { value: 'finalizado', label: 'Finalizado' },
  { value: 'cancelado', label: 'Cancelado' },
];

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

export default function EmbarqueTable({ embarques }: Props) {
  const router = useRouter();
  const [showNew, setShowNew] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [polFilter, setPolFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  function refresh() {
    router.refresh();
  }

  const polOptions = Array.from(new Set(embarques.map((e) => e.pol))).sort();

  const filtered = embarques.filter((e) => {
    if (polFilter && e.pol !== polFilter) return false;
    if (search) {
      const term = search.toLowerCase();
      if (
        !e.navio_viagem.toLowerCase().includes(term) &&
        !e.booking.toLowerCase().includes(term) &&
        !e.pol.toLowerCase().includes(term) &&
        !e.pod.toLowerCase().includes(term)
      )
        return false;
    }
    return true;
  });

  async function toggleCheck(id: string, field: 'pedido' | 'lista' | 'manifesto', current: boolean) {
    const key = id + field;
    setLoadingKey(key);
    const supabase = createClient();
    await supabase.from('embarques').update({ [field]: !current }).eq('id', id);
    setLoadingKey(null);
    refresh();
  }

  async function updateStatus(
    id: string,
    field: 'status_adr' | 'status_embarque',
    value: string,
  ) {
    const key = id + field;
    setLoadingKey(key);
    const supabase = createClient();
    await supabase.from('embarques').update({ [field]: value }).eq('id', id);
    setLoadingKey(null);
    refresh();
  }

  async function handleDelete(id: string) {
    const supabase = createClient();
    await supabase.from('embarques').delete().eq('id', id);
    setDeleteId(null);
    refresh();
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Controle de Embarque</h2>
        <button
          onClick={() => setShowNew(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Novo Embarque
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Buscar por navio, booking, POL, POD..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 whitespace-nowrap">Filtrar por POL:</label>
          <select
            value={polFilter}
            onChange={(e) => setPolFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Todos</option>
            {polOptions.map((pol) => (
              <option key={pol} value={pol}>
                {pol}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          {embarques.length === 0
            ? 'Nenhum embarque cadastrado.'
            : 'Nenhum resultado encontrado.'}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 font-medium whitespace-nowrap">Navio + Viagem</th>
                <th className="px-4 py-3 font-medium">POL</th>
                <th className="px-4 py-3 font-medium">POD</th>
                <th className="px-4 py-3 font-medium">Volume</th>
                <th className="px-4 py-3 font-medium">Booking</th>
                <th className="px-4 py-3 font-medium">ETB</th>
                <th className="px-4 py-3 font-medium text-center">Pedido</th>
                <th className="px-4 py-3 font-medium text-center">Lista</th>
                <th className="px-4 py-3 font-medium text-center">Manifesto</th>
                <th className="px-4 py-3 font-medium">ADR</th>
                <th className="px-4 py-3 font-medium">Embarque</th>
                <th className="px-4 py-3 font-medium text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((e) => (
                <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                    {e.navio_viagem}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{e.pol}</td>
                  <td className="px-4 py-3 text-gray-700">{e.pod}</td>
                  <td className="px-4 py-3 text-gray-700">{e.volume}</td>
                  <td className="px-4 py-3 text-gray-700">{e.booking}</td>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                    {formatDate(e.etb)}
                  </td>

                  {(['pedido', 'lista', 'manifesto'] as const).map((field) => (
                    <td key={field} className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleCheck(e.id, field, e[field])}
                        disabled={loadingKey === e.id + field}
                        className={`w-7 h-7 rounded flex items-center justify-center mx-auto transition-colors ${
                          e[field]
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'border-2 border-gray-300 text-transparent hover:border-gray-400'
                        }`}
                      >
                        <Check size={14} />
                      </button>
                    </td>
                  ))}

                  <td className="px-4 py-3">
                    <select
                      value={e.status_adr}
                      onChange={(ev) => updateStatus(e.id, 'status_adr', ev.target.value)}
                      disabled={loadingKey === e.id + 'status_adr'}
                      className="border border-gray-300 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      {ADR_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="px-4 py-3">
                    <select
                      value={e.status_embarque}
                      onChange={(ev) => updateStatus(e.id, 'status_embarque', ev.target.value)}
                      disabled={loadingKey === e.id + 'status_embarque'}
                      className="border border-gray-300 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      {EMBARQUE_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      <button
                        onClick={() => setDeleteId(e.id)}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Excluir"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showNew && (
        <EmbarqueModal onClose={() => setShowNew(false)} onSuccess={refresh} />
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Excluir Embarque</h2>
            <p className="text-sm text-gray-600 mb-4">
              Tem certeza que deseja excluir este embarque? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
