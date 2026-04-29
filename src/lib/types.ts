export interface NotaFiscal {
  id: string;
  numero: string;
  emissor: string;
  valor: number;
  descricao: string | null;
  data_emissao: string;
  data_impressao: string | null;
  responsavel: string;
  status: 'aprovada' | 'pendente' | 'cancelada';
  comentario: string | null;
  created_at: string;
  user_id: string;
}

export type NotaFiscalInsert = Omit<NotaFiscal, 'id' | 'created_at' | 'user_id'>;

export interface Embarque {
  id: string;
  navio_viagem: string;
  pol: string;
  pod: string;
  volume: string;
  booking: string;
  etb: string | null;
  pedido: boolean;
  lista: boolean;
  manifesto: boolean;
  status_adr: 'em_andamento' | 'finalizado';
  status_embarque: 'em_andamento' | 'finalizado' | 'cancelado';
  comentarios: string | null;
  created_at: string;
  user_id: string;
}

export type EmbarqueInsert = Omit<Embarque, 'id' | 'created_at' | 'user_id'>;
