'use client';

import { useState, useEffect } from 'react';
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

export default function EmbarqueTable({ embarques }: Props) {
  const router = useRouter();
  const [showNew, setShowNew]           = useState(false);
  const [deleteId, setDeleteId]         = useState<string | null>(null);
  const [editEmbarque, setEditEmbarque] = useState<Embarque | null>(null);
  const [polFilter, setPolFilter]       = useState('');
  const [search, setSearch]             = useState('');
  const [loadingKey, setLoadingKey]     = useState<string | null>(null);
  const [polColors, setPolColors]       = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem('pol-colors');
      if (stored) setPolColors(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  function refresh() { router.refresh(); }

  const polOptions = Array.from(new Set(embarques.map((e) => e.pol))).sort();

  function setPolColor(pol: string, color: string) {
    const next = { ...polColors, [pol]: color };
    setPolColors(next);
    localStorage.setItem('pol-colors', JSON.stringify(next));
  }

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
            fontFamily: 'var(--font-poppins)',
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
            background: 'var(--blue)',
            color: '#FFFFFF',
            fontFamily: 'var(--font-poppins)',
            fontSize: '12px',
            letterSpacing: '0.08em',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--blue-dark)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--blue)'; }}
        >
          + Novo Embarque
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
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
              fontFamily: 'var(--font-poppins)',
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

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-24 text-sm" style={{ color: 'var(--tx-2)' }}>
          {embarques.length === 0 ? 'Nenhum embarque cadastrado.' : 'Nenhum resultado encontrado.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-up">
          {filtered.map((e) => {
            const accent = polColors[e.pol] || '#1D6FC4';
            return (
              <div
                key={e.id}
                className="rounded-xl flex flex-col overflow-hidden"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border-2)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}
              >
                {/* Colored accent bar */}
                <div style={{ height: '4px', background: accent }} />

                <div className="flex flex-col gap-3 p-4">
                  {/* Title + actions */}
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className="font-semibold leading-tight"
                      style={{ fontSize: '14px', color: 'var(--tx)' }}
                    >
                      {e.navio_viagem}
                    </span>
                    <div className="flex gap-0.5 shrink-0">
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
                        <Pencil size={13} />
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
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* POL → POD (dot clicável muda cor do POL) */}
                  <div className="flex items-center gap-2" style={{ fontSize: '12px', fontFamily: 'var(--font-jetbrains)' }}>
                    <label
                      className="relative flex items-center gap-1.5 cursor-pointer"
                      title="Clique para alterar a cor deste POL"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ background: accent, display: 'inline-block' }}
                      />
                      <span style={{ color: 'var(--tx)', fontWeight: 600 }}>{e.pol}</span>
                      <input
                        type="color"
                        value={accent}
                        onChange={(ev) => setPolColor(e.pol, ev.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        style={{ width: '100%', height: '100%' }}
                      />
                    </label>
                    <span style={{ color: 'var(--tx-3)' }}>→</span>
                    <span style={{ color: 'var(--sky)' }}>{e.pod}</span>
                  </div>

                  {/* Booking + ETB */}
                  <div
                    className="flex items-center gap-2"
                    style={{ fontSize: '11px', color: 'var(--tx-2)', fontFamily: 'var(--font-jetbrains)' }}
                  >
                    <span>{e.booking}</span>
                    <span style={{ color: 'var(--border-2)' }}>·</span>
                    <span>{formatDate(e.etb)}</span>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border)' }} />

                  {/* Checkboxes */}
                  <div className="flex items-center gap-3">
                    {(['pedido', 'lista', 'manifesto'] as const).map((field) => (
                      <button
                        key={field}
                        onClick={() => toggleCheck(e.id, field, e[field])}
                        disabled={loadingKey === e.id + field}
                        className="flex items-center gap-1.5 transition-all duration-150"
                        style={{
                          fontSize: '10.5px',
                          color: e[field] ? 'var(--green)' : 'var(--tx-3)',
                          opacity: loadingKey === e.id + field ? 0.4 : 1,
                        }}
                      >
                        <span
                          className="w-4 h-4 rounded flex items-center justify-center shrink-0"
                          style={{
                            background: e[field] ? 'var(--green)' : '#FFFFFF',
                            border: e[field] ? 'none' : '1.5px solid var(--border-2)',
                            color: e[field] ? '#FFFFFF' : 'transparent',
                          }}
                        >
                          <Check size={10} strokeWidth={2.5} />
                        </span>
                        <span className="capitalize">{field}</span>
                      </button>
                    ))}
                  </div>

                  <div style={{ borderTop: '1px solid var(--border)' }} />

                  {/* Status selects */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        style={{
                          fontSize: '9.5px',
                          color: 'var(--tx-3)',
                          fontWeight: 700,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                        }}
                      >
                        ADR
                      </span>
                      <select
                        value={e.status_adr}
                        onChange={(ev) => updateStatus(e.id, 'status_adr', ev.target.value)}
                        disabled={loadingKey === e.id + 'status_adr'}
                        className="sel"
                        style={{ color: STATUS_ADR_COLOR[e.status_adr] }}
                      >
                        {ADR_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span
                        style={{
                          fontSize: '9.5px',
                          color: 'var(--tx-3)',
                          fontWeight: 700,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                        }}
                      >
                        Embarque
                      </span>
                      <select
                        value={e.status_embarque}
                        onChange={(ev) => updateStatus(e.id, 'status_embarque', ev.target.value)}
                        disabled={loadingKey === e.id + 'status_embarque'}
                        className="sel"
                        style={{ color: STATUS_EMBARQUE_COLOR[e.status_embarque] }}
                      >
                        {EMBARQUE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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

      {/* Delete confirm */}
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
              style={{ fontFamily: 'var(--font-poppins)', fontSize: '16px', fontWeight: 700, color: 'var(--red)' }}
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
                style={{ color: 'var(--tx-2)', border: '1px solid var(--border-2)', background: 'transparent' }}
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-5 py-2 rounded-lg text-sm font-bold uppercase transition-all duration-150"
                style={{ background: 'var(--red)', color: '#fff', fontFamily: 'var(--font-poppins)', letterSpacing: '0.08em' }}
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
