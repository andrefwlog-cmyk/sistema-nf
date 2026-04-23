'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, Search, X } from 'lucide-react';
import type { NotaFiscal } from '@/lib/types';
import NfModal from './NfModal';
import DeleteConfirmModal from './DeleteConfirmModal';

interface Props {
  nfs: NotaFiscal[];
}

type StatusFilter = 'all' | 'aprovada' | 'pendente' | 'cancelada';

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const STATUS_LABELS: Record<StatusFilter, string> = {
  all: 'Todos',
  aprovada: 'Aprovada',
  pendente: 'Pendente',
  cancelada: 'Cancelada',
};

function StatusBadge({ status, comentario }: { status: NotaFiscal['status']; comentario: string | null }) {
  if (status === 'aprovada') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
        Aprovada
      </span>
    );
  }
  if (status === 'cancelada') {
    return (
      <span
        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 cursor-default"
        title={comentario ?? ''}
      >
        Cancelada
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 cursor-default"
      title={comentario ?? ''}
    >
      Pendente
    </span>
  );
}

export default function NfTable({ nfs }: Props) {
  const router = useRouter();
  const [editNf, setEditNf] = useState<NotaFiscal | null>(null);
  const [deleteNf, setDeleteNf] = useState<NotaFiscal | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  function refresh() {
    router.refresh();
  }

  const filtered = nfs.filter((nf) => {
    if (search) {
      const term = search.toLowerCase();
      const matchesSearch =
        nf.numero.toLowerCase().includes(term) ||
        nf.emissor.toLowerCase().includes(term) ||
        String(nf.valor).includes(term) ||
        formatCurrency(nf.valor).toLowerCase().includes(term);
      if (!matchesSearch) return false;
    }
    if (statusFilter !== 'all' && nf.status !== statusFilter) return false;
    return true;
  });

  const counts: Record<StatusFilter, number> = {
    all: nfs.length,
    aprovada: nfs.filter((n) => n.status === 'aprovada').length,
    pendente: nfs.filter((n) => n.status === 'pendente').length,
    cancelada: nfs.filter((n) => n.status === 'cancelada').length,
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Notas Fiscais</h2>
        <button
          onClick={() => setShowNew(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Nova NF
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por número, emissor ou valor..."
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

        <div className="flex gap-1.5 flex-wrap">
          {(Object.keys(STATUS_LABELS) as StatusFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                statusFilter === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {STATUS_LABELS[s]} ({counts[s]})
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          {nfs.length === 0 ? 'Nenhuma nota fiscal cadastrada.' : 'Nenhum resultado encontrado.'}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 font-medium">Número</th>
                <th className="px-4 py-3 font-medium">Emissor</th>
                <th className="px-4 py-3 font-medium">Valor</th>
                <th className="px-4 py-3 font-medium">Descrição</th>
                <th className="px-4 py-3 font-medium">Dt. Emissão</th>
                <th className="px-4 py-3 font-medium">Dt. Entrega</th>
                <th className="px-4 py-3 font-medium">Responsável</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((nf) => (
                <tr key={nf.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{nf.numero}</td>
                  <td className="px-4 py-3 text-gray-700">{nf.emissor}</td>
                  <td className="px-4 py-3 text-gray-700">{formatCurrency(nf.valor)}</td>
                  <td className="px-4 py-3 text-gray-500 max-w-48 truncate">{nf.descricao || '—'}</td>
                  <td className="px-4 py-3 text-gray-700">{formatDate(nf.data_emissao)}</td>
                  <td className="px-4 py-3 text-gray-700">{formatDate(nf.data_impressao)}</td>
                  <td className="px-4 py-3 text-gray-700">{nf.responsavel}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={nf.status} comentario={nf.comentario} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => setEditNf(nf)}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Editar"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteNf(nf)}
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
        <NfModal nf={null} onClose={() => setShowNew(false)} onSuccess={refresh} />
      )}
      {editNf && (
        <NfModal nf={editNf} onClose={() => setEditNf(null)} onSuccess={refresh} />
      )}
      {deleteNf && (
        <DeleteConfirmModal nf={deleteNf} onClose={() => setDeleteNf(null)} onSuccess={refresh} />
      )}
    </>
  );
}
