'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Check, Search, X, Pencil } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Embarque } from '@/lib/types';
import EmbarqueModal from './EmbarqueModal';
import EmbarqueEditModal from './EmbarqueEditModal';

interface Props {
  embarques: Embarque[];
}

const ADR_OPTIONS: { value: Embarque['status_adr']; label: string }[] = [
  { value: 'em_andamento', label: 'Em andamento' },
  { value: 'finalizado',   label: 'Finalizado' },
];

const EMBARQUE_OPTIONS: { value: Embarque['status_embarque']; label: string }[] = [
  { value: 'em_andamento', label: 'Em andamento' },
  { value: 'finalizado',   label: 'Finalizado' },
  { value: 'cancelado',    label: 'Cancelado' },
];

const STATUS_EMBARQUE_COLOR: Record<Embarque['status_embarque'], string> = {
  em_andamento: 'var(--sky)',
  finalizado:   'var(--green)',
  cancelado:    'var(--red)',
};

const STATUS_ADR_COLOR: Record<Embarque['status_adr'], string> = {
  em_andamento: 'var(--sky)',
  finalizado:   'var(--green)',
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
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

export default function EmbarqueTable({ embarques }: Props) {
  const router = useRouter();
  const [showNew, setShowNew] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editEmbarque, setEditEmbarque] = useState<Embarque | null>(null);
  const [polFilter, setPolFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  function refresh() { router.refresh(); }

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
      ) return false;
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

  async function updateStatus(id: string, field: 'status_adr' | 'status_embarque', value: string) {
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
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2
          style={{
            fontFamily: 'var(--font-syne)',
            fontSize: '22px',
            fontWeight: 700,
            color: 'var(--tx)',
            letterSpacing: '-0.01em',
          }}
        >
          Controle de Embarque
        </h2>
        <button
          onClick={() => setShowNew(true)}
          className="px-4 py-2 rounded-lg transition-all duration-150 font-bold uppercase"
          style={{
            background: 'var(--navy)',
            color: '#FFFFFF',
            fontFamily: 'var(--font-barlow-condensed)',
            fontSize: '12px',
            letterSpacing: '0.08em',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#1a2e4a'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--navy)'; }}
        >
          + Novo Embarque
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--tx-3)' }}
          />
          <input
            type="text"
            placeholder="Buscar por navio, booking, POL, POD..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="inp"
            style={{ paddingLeft: '36px', paddingRight: search ? '32px' : '12px' }}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--tx-3)' }}>
              <X size={13} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <label
            style={{
              color: 'var(--tx-2)',
              fontFamily: 'var(--font-barlow-condensed)',
              fontSize: '10.5px',
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
            }}
          >
            POL
          </label>
          <select value={polFilter} onChange={(e) => setPolFilter(e.target.value)} className="sel">
            <option value="">Todos</option>
            {polOptions.map((pol) => <option key={pol} value={pol}>{pol}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-24 text-sm" style={{ color: 'var(--tx-2)' }}>
          {embarques.length === 0 ? 'Nenhum embarque cadastrado.' : 'Nenhum resultado encontrado.'}
        </div>
      ) : (
        <div
          className="overflow-x-auto rounded-xl animate-fade-up"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border-2)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}
        >
          <table className="w-full text-sm text-left" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border-2)' }}>
                <th className="px-4 py-3" style={thStyle}>Navio + Viagem</th>
                <th className="px-4 py-3" style={thStyle}>POL</th>
                <th className="px-4 py-3" style={thStyle}>POD</th>
                <th className="px-4 py-3" style={thStyle}>Volume</th>
                <th className="px-4 py-3" style={thStyle}>Booking</th>
                <th className="px-4 py-3" style={thStyle}>ETB</th>
                <th className="px-4 py-3 text-center" style={thStyle}>Pedido</th>
                <th className="px-4 py-3 text-center" style={thStyle}>Lista</th>
                <th className="px-4 py-3 text-center" style={thStyle}>Manifesto</th>
                <th className="px-4 py-3" style={thStyle}>ADR</th>
                <th className="px-4 py-3" style={thStyle}>Embarque</th>
                <th className="px-4 py-3 text-center" style={thStyle}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e, i) => (
                <tr
                  key={e.id}
                  className="transition-all duration-100"
                  style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}
                  onMouseEnter={(ev) => { (ev.currentTarget as HTMLTableRowElement).style.background = 'var(--surface-2)'; }}
                  onMouseLeave={(ev) => { (ev.currentTarget as HTMLTableRowElement).style.background = 'transparent'; }}
                >
                  <td className="px-4 py-3 font-semibold whitespace-nowrap" style={{ color: 'var(--tx)' }}>
                    {e.navio_viagem}
                  </td>
                  <td
                    className="px-4 py-3 font-semibold"
                    style={{ color: 'var(--navy)', fontFamily: 'var(--font-jetbrains)', fontSize: '11.5px' }}
                  >
                    {e.pol}
                  </td>
                  <td
                    className="px-4 py-3"
                    style={{ color: 'var(--sky)', fontFamily: 'var(--font-jetbrains)', fontSize: '11.5px' }}
                  >
                    {e.pod}
                  </td>
                  <td className="px-4 py-3" style={{ color: 'var(--tx)' }}>{e.volume}</td>
                  <td
                    className="px-4 py-3"
                    style={{ color: 'var(--tx-2)', fontFamily: 'var(--font-jetbrains)', fontSize: '11.5px' }}
                  >
                    {e.booking}
                  </td>
                  <td
                    className="px-4 py-3 whitespace-nowrap"
                    style={{ color: 'var(--tx-2)', fontFamily: 'var(--font-jetbrains)', fontSize: '11.5px' }}
                  >
                    {formatDate(e.etb)}
                  </td>

                  {(['pedido', 'lista', 'manifesto'] as const).map((field) => (
                    <td key={field} className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleCheck(e.id, field, e[field])}
                        disabled={loadingKey === e.id + field}
                        className="w-6 h-6 rounded-md flex items-center justify-center mx-auto transition-all duration-150"
                        style={{
                          background: e[field] ? 'var(--green)' : '#FFFFFF',
                          border: e[field] ? 'none' : '1.5px solid var(--border-2)',
                          color: e[field] ? '#FFFFFF' : 'transparent',
                          opacity: loadingKey === e.id + field ? 0.4 : 1,
                        }}
                      >
                        <Check size={12} strokeWidth={2.5} />
                      </button>
                    </td>
                  ))}

                  <td className="px-4 py-3">
                    <select
                      value={e.status_adr}
                      onChange={(ev) => updateStatus(e.id, 'status_adr', ev.target.value)}
                      disabled={loadingKey === e.id + 'status_adr'}
                      className="sel"
                      style={{ color: STATUS_ADR_COLOR[e.status_adr] }}
                    >
                      {ADR_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </td>

                  <td className="px-4 py-3">
                    <select
                      value={e.status_embarque}
                      onChange={(ev) => updateStatus(e.id, 'status_embarque', ev.target.value)}
                      disabled={loadingKey === e.id + 'status_embarque'}
                      className="sel"
                      style={{ color: STATUS_EMBARQUE_COLOR[e.status_embarque] }}
                    >
                      {EMBARQUE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-1">
                      <button
                        onClick={() => setEditEmbarque(e)}
                        className="p-1.5 rounded-lg transition-all duration-100"
                        style={{ color: 'var(--tx-3)' }}
                        title="Editar"
                        onMouseEnter={(ev) => {
                          (ev.currentTarget as HTMLButtonElement).style.color = 'var(--sky)';
                          (ev.currentTarget as HTMLButtonElement).style.background = 'rgba(37,99,235,0.08)';
                        }}
                        onMouseLeave={(ev) => {
                          (ev.currentTarget as HTMLButtonElement).style.color = 'var(--tx-3)';
                          (ev.currentTarget as HTMLButtonElement).style.background = 'transparent';
                        }}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteId(e.id)}
                        className="p-1.5 rounded-lg transition-all duration-100"
                        style={{ color: 'var(--tx-3)' }}
                        title="Excluir"
                        onMouseEnter={(ev) => {
                          (ev.currentTarget as HTMLButtonElement).style.color = 'var(--red)';
                          (ev.currentTarget as HTMLButtonElement).style.background = 'rgba(220,38,38,0.08)';
                        }}
                        onMouseLeave={(ev) => {
                          (ev.currentTarget as HTMLButtonElement).style.color = 'var(--tx-3)';
                          (ev.currentTarget as HTMLButtonElement).style.background = 'transparent';
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

      {showNew && <EmbarqueModal onClose={() => setShowNew(false)} onSuccess={refresh} />}
      {editEmbarque && (
        <EmbarqueEditModal
          embarque={editEmbarque}
          onClose={() => setEditEmbarque(null)}
          onSuccess={refresh}
        />
      )}

      {/* Delete modal */}
      {deleteId && (
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
              className="mb-2 uppercase"
              style={{
                fontFamily: 'var(--font-syne)',
                fontSize: '16px',
                fontWeight: 700,
                color: 'var(--red)',
              }}
            >
              Excluir Embarque
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--tx-2)', lineHeight: 1.6 }}>
              Tem certeza que deseja excluir este embarque? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-lg text-sm transition-all duration-150"
                style={{
                  color: 'var(--tx-2)',
                  border: '1px solid var(--border-2)',
                  background: 'transparent',
                }}
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-5 py-2 rounded-lg text-sm font-bold uppercase transition-all duration-150"
                style={{
                  background: 'var(--red)',
                  color: '#fff',
                  fontFamily: 'var(--font-barlow-condensed)',
                  letterSpacing: '0.08em',
                }}
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
