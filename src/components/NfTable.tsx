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

const STATUS_DOT: Record<NotaFiscal['status'], string> = {
  aprovada: '#22C55E',
  pendente: '#F59E0B',
  cancelada: '#EF4444',
};

const STATUS_LABEL_COLOR: Record<NotaFiscal['status'], string> = {
  aprovada: '#22C55E',
  pendente: '#F59E0B',
  cancelada: '#EF4444',
};

function StatusBadge({ status, comentario }: { status: NotaFiscal['status']; comentario: string | null }) {
  return (
    <span
      className="inline-flex items-center gap-1.5"
      title={status !== 'aprovada' ? (comentario ?? '') : undefined}
    >
      <span
        className="rounded-full shrink-0"
        style={{ width: '6px', height: '6px', background: STATUS_DOT[status] }}
      />
      <span
        className="text-xs font-medium"
        style={{
          color: STATUS_LABEL_COLOR[status],
          fontFamily: 'var(--font-barlow-condensed)',
          letterSpacing: '0.04em',
        }}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
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

  function refresh() { router.refresh(); }

  const filtered = nfs.filter((nf) => {
    if (search) {
      const term = search.toLowerCase();
      if (
        !nf.numero.toLowerCase().includes(term) &&
        !nf.emissor.toLowerCase().includes(term) &&
        !String(nf.valor).includes(term) &&
        !formatCurrency(nf.valor).toLowerCase().includes(term)
      ) return false;
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

  const thStyle = {
    fontFamily: 'var(--font-barlow-condensed)',
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.1em',
    color: '#3D5878',
    textTransform: 'uppercase' as const,
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2
            className="uppercase"
            style={{
              fontFamily: 'var(--font-barlow-condensed)',
              fontSize: '22px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: '#C4D4E8',
            }}
          >
            Notas Fiscais
          </h2>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="px-4 py-2 rounded-lg text-sm font-semibold uppercase tracking-wider transition-all"
          style={{
            background: '#D4932E',
            color: '#07091A',
            fontFamily: 'var(--font-barlow-condensed)',
            fontSize: '12px',
            letterSpacing: '0.08em',
          }}
        >
          + Nova NF
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: '#2D4060' }}
          />
          <input
            type="text"
            placeholder="Buscar por número, emissor ou valor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="inp"
            style={{ paddingLeft: '36px', paddingRight: search ? '32px' : '12px' }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2"
              style={{ color: '#2D4060' }}
            >
              <X size={13} />
            </button>
          )}
        </div>

        <div className="flex gap-1.5 flex-wrap">
          {(Object.keys(STATUS_LABELS) as StatusFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all"
              style={{
                fontFamily: 'var(--font-barlow-condensed)',
                fontSize: '11px',
                letterSpacing: '0.08em',
                background: statusFilter === s ? '#D4932E' : 'rgba(100,140,200,0.06)',
                color: statusFilter === s ? '#07091A' : '#3D5878',
                border: statusFilter === s ? 'none' : '1px solid rgba(100,140,200,0.1)',
              }}
            >
              {STATUS_LABELS[s]} ({counts[s]})
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div
          className="text-center py-20 text-sm"
          style={{ color: '#243448' }}
        >
          {nfs.length === 0 ? 'Nenhuma nota fiscal cadastrada.' : 'Nenhum resultado encontrado.'}
        </div>
      ) : (
        <div
          className="overflow-x-auto rounded-xl"
          style={{ border: '1px solid rgba(100,140,200,0.1)' }}
        >
          <table className="w-full text-sm text-left" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#0A1020', borderBottom: '1px solid rgba(100,140,200,0.1)' }}>
                <th className="px-4 py-3" style={thStyle}>Número</th>
                <th className="px-4 py-3" style={thStyle}>Emissor</th>
                <th className="px-4 py-3" style={thStyle}>Valor</th>
                <th className="px-4 py-3" style={thStyle}>Descrição</th>
                <th className="px-4 py-3" style={thStyle}>Dt. Emissão</th>
                <th className="px-4 py-3" style={thStyle}>Dt. Entrega</th>
                <th className="px-4 py-3" style={thStyle}>Responsável</th>
                <th className="px-4 py-3" style={thStyle}>Status</th>
                <th className="px-4 py-3 text-center" style={thStyle}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((nf, i) => (
                <tr
                  key={nf.id}
                  style={{
                    background: i % 2 === 0 ? '#07091A' : '#080B1C',
                    borderBottom: '1px solid rgba(100,140,200,0.06)',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = '#0D1528'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = i % 2 === 0 ? '#07091A' : '#080B1C'; }}
                >
                  <td
                    className="px-4 py-3 font-semibold"
                    style={{ color: '#C4D4E8', fontFamily: 'var(--font-jetbrains)', fontSize: '12.5px' }}
                  >
                    {nf.numero}
                  </td>
                  <td className="px-4 py-3" style={{ color: '#8AA8C8' }}>{nf.emissor}</td>
                  <td
                    className="px-4 py-3 font-medium"
                    style={{ color: '#C4D4E8', fontFamily: 'var(--font-jetbrains)', fontSize: '12px' }}
                  >
                    {formatCurrency(nf.valor)}
                  </td>
                  <td
                    className="px-4 py-3 max-w-[180px] truncate"
                    style={{ color: '#4E6A88' }}
                  >
                    {nf.descricao || '—'}
                  </td>
                  <td
                    className="px-4 py-3"
                    style={{ color: '#6A88A8', fontFamily: 'var(--font-jetbrains)', fontSize: '12px' }}
                  >
                    {formatDate(nf.data_emissao)}
                  </td>
                  <td
                    className="px-4 py-3"
                    style={{ color: '#6A88A8', fontFamily: 'var(--font-jetbrains)', fontSize: '12px' }}
                  >
                    {formatDate(nf.data_impressao)}
                  </td>
                  <td className="px-4 py-3" style={{ color: '#7A98C0' }}>{nf.responsavel}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={nf.status} comentario={nf.comentario} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => setEditNf(nf)}
                        className="p-1.5 rounded transition-all"
                        style={{ color: '#3D5878' }}
                        title="Editar"
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.color = '#D4932E';
                          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(212,147,46,0.1)';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.color = '#3D5878';
                          (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                        }}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteNf(nf)}
                        className="p-1.5 rounded transition-all"
                        style={{ color: '#3D5878' }}
                        title="Excluir"
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.color = '#EF4444';
                          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.08)';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.color = '#3D5878';
                          (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showNew && <NfModal nf={null} onClose={() => setShowNew(false)} onSuccess={refresh} />}
      {editNf && <NfModal nf={editNf} onClose={() => setEditNf(null)} onSuccess={refresh} />}
      {deleteNf && <DeleteConfirmModal nf={deleteNf} onClose={() => setDeleteNf(null)} onSuccess={refresh} />}
    </>
  );
}
