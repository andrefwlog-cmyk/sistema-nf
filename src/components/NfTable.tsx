'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2 } from 'lucide-react';
import type { NotaFiscal } from '@/lib/types';
import NfModal from './NfModal';
import DeleteConfirmModal from './DeleteConfirmModal';

interface Props {
  nfs: NotaFiscal[];
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function NfTable({ nfs }: Props) {
  const router = useRouter();
  const [editNf, setEditNf] = useState<NotaFiscal | null>(null);
  const [deleteNf, setDeleteNf] = useState<NotaFiscal | null>(null);
  const [showNew, setShowNew] = useState(false);

  function refresh() {
    router.refresh();
  }

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

      {nfs.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          Nenhuma nota fiscal cadastrada.
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
                <th className="px-4 py-3 font-medium">Dt. Impressão</th>
                <th className="px-4 py-3 font-medium">Responsável</th>
                <th className="px-4 py-3 font-medium text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {nfs.map((nf) => (
                <tr key={nf.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{nf.numero}</td>
                  <td className="px-4 py-3 text-gray-700">{nf.emissor}</td>
                  <td className="px-4 py-3 text-gray-700">{formatCurrency(nf.valor)}</td>
                  <td className="px-4 py-3 text-gray-500 max-w-48 truncate">{nf.descricao || '—'}</td>
                  <td className="px-4 py-3 text-gray-700">{formatDate(nf.data_emissao)}</td>
                  <td className="px-4 py-3 text-gray-700">{formatDate(nf.data_impressao)}</td>
                  <td className="px-4 py-3 text-gray-700">{nf.responsavel}</td>
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
