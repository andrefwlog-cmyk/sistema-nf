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
  all:      'Todos',
  aprovada: 'Aprovada',
  pendente: 'Pendente',
  cancelada:'Cancelada',
};

const STATUS_CONFIG: Record<NotaFiscal['status'], { dot: string; text: string; bg: string; border: string }> = {
  aprovada:  { dot: '#22C55E', text: '#4ADE80', bg: 'rgba(34,197,94,0.08)',  border: 'rgba(34,197,94,0.18)' },
  pendente:  { dot: '#F59E0B', text: '#FBB040', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.18)' },
  cancelada: { dot: '#EF4444', text: '#F87171', bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.18)' },
};

function StatusBadge({ status, comentario }: { status: NotaFiscal['status']; comentario: string | null }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        color: cfg.text,
        fontFamily: 'var(--font-barlow-condensed)',
        fontSize: '11px',
        letterSpacing: '0.06em',
      }}
      title={status !== 'aprovada' ? (comentario ?? '') : undefined}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: cfg.dot, boxShadow: `0 0 4px ${cfg.dot}` }}
      />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

const thStyle = {
  fontFamily: 'var(--font-barlow-condensed)',
  fontSize: '10.5px',
  fontWeight: 700,
  letterSpacing: '0.16em',
  color: 'var(--tx-2)',
  textTransform: 'uppercase' as const,
  whiteSpace: 'nowrap' as const,
};

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
    all:      nfs.length,
    aprovada: nfs.filter((n) => n.status === 'aprovada').length,
    pendente: nfs.filter((n) => n.status === 'pendente').length,
    cancelada:nfs.filter((n) => n.status === 'cancelada').length,
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2
          style={{
            fontFamily: 'var(--font-syne)',
            fontSize: '24px',
            fontWeight: 700,
            color: 'var(--tx)',
            letterSpacing: '-0.01em',
          }}
        >
          Notas Fiscais
        </h2>
        <button
          onClick={() => setShowNew(true)}
          className="px-4 py-2 rounded-lg transition-all duration-150 font-bold uppercase"
          style={{
            background: 'var(--gold)',
            color: '#060D1A',
            fontFamily: 'var(--font-barlow-condensed)',
            fontSize: '12px',
            letterSpacing: '0.08em',
            boxShadow: '0 2px 12px rgba(232,160,48,0.22)',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 20px rgba(232,160,48,0.38)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 12px rgba(232,160,48,0.22)'; }}
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
            style={{ color: 'var(--tx-2)' }}
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
              style={{ color: 'var(--tx-2)' }}
            >
              <X size={13} />
            </button>
          )}
        </div>

        <div className="flex gap-1.5 flex-wrap">
          {(Object.keys(STATUS_LABELS) as StatusFilter[]).map((s) => {
            const active = statusFilter === s;
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className="px-3 py-1.5 rounded-lg transition-all duration-150"
                style={{
                  fontFamily: 'var(--font-barlow-condensed)',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  letterSpacing: '0.07em',
                  background: active ? 'var(--gold-dim)' : 'rgba(255,255,255,0.04)',
                  color: active ? 'var(--gold)' : 'var(--tx-2)',
                  border: `1px solid ${active ? 'rgba(232,160,48,0.25)' : 'var(--border-2)'}`,
                }}
              >
                {STATUS_LABELS[s]} ({counts[s]})
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-24 text-sm" style={{ color: 'var(--tx-2)' }}>
          {nfs.length === 0 ? 'Nenhuma nota fiscal cadastrada.' : 'Nenhum resultado encontrado.'}
        </div>
      ) : (
        <div
          className="overflow-x-auto rounded-xl animate-fade-up"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
          }}
        >
          <table className="w-full text-sm text-left" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
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
                  className="transition-all duration-100"
                  style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(255,255,255,0.02)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'; }}
                >
                  <td
                    className="px-4 py-3 font-semibold"
                    style={{ color: 'var(--sky)', fontFamily: 'var(--font-jetbrains)', fontSize: '12px' }}
                  >
                    {nf.numero}
                  </td>
                  <td className="px-4 py-3" style={{ color: 'var(--tx)' }}>{nf.emissor}</td>
                  <td
                    className="px-4 py-3 font-medium"
                    style={{ color: 'var(--gold)', fontFamily: 'var(--font-jetbrains)', fontSize: '12px' }}
                  >
                    {formatCurrency(nf.valor)}
                  </td>
                  <td className="px-4 py-3 max-w-[180px] truncate" style={{ color: 'var(--tx-2)' }}>
                    {nf.descricao || '—'}
                  </td>
                  <td className="px-4 py-3" style={{ color: 'var(--tx-2)', fontFamily: 'var(--font-jetbrains)', fontSize: '11.5px' }}>
                    {formatDate(nf.data_emissao)}
                  </td>
                  <td className="px-4 py-3" style={{ color: 'var(--tx-2)', fontFamily: 'var(--font-jetbrains)', fontSize: '11.5px' }}>
                    {formatDate(nf.data_impressao)}
                  </td>
                  <td className="px-4 py-3" style={{ color: 'var(--tx)' }}>{nf.responsavel}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={nf.status} comentario={nf.comentario} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 justify-center">
                      <button
                        onClick={() => setEditNf(nf)}
                        className="p-1.5 rounded-lg transition-all duration-100"
                        style={{ color: 'var(--tx-2)' }}
                        title="Editar"
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.color = 'var(--gold)';
                          (e.currentTarget as HTMLButtonElement).style.background = 'var(--gold-dim)';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.color = 'var(--tx-2)';
                          (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                        }}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteNf(nf)}
                        className="p-1.5 rounded-lg transition-all duration-100"
                        style={{ color: 'var(--tx-2)' }}
                        title="Excluir"
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.color = '#EF4444';
                          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.08)';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.color = 'var(--tx-2)';
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
