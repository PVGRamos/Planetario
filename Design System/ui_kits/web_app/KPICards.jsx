// Planeta Cargas — KPI Cards for Dashboard

const CARGAS_DATA = [
  { code: 'PC-08421', client: 'Metalúrgica Souza',     from: 'São Paulo, SP',     to: 'Curitiba, PR',       status: 'Em transporte', updated: '26 abr, 09:15' },
  { code: 'PC-08420', client: 'Distribuidora Norte',   from: 'Campinas, SP',      to: 'Manaus, AM',         status: 'Atrasado',      updated: '26 abr, 07:42' },
  { code: 'PC-08419', client: 'TechParts Ind.',        from: 'Guarulhos, SP',     to: 'Porto Alegre, RS',   status: 'Em coleta',     updated: '26 abr, 10:01' },
  { code: 'PC-08418', client: 'LogFlex Comércio',      from: 'Rio de Janeiro, RJ',to: 'Belo Horizonte, MG', status: 'Finalizado',    updated: '25 abr, 18:30' },
  { code: 'PC-08417', client: 'Agro Sul Exportações',  from: 'Londrina, PR',      to: 'Santos, SP',         status: 'Atenção',       updated: '26 abr, 08:00' },
  { code: 'PC-08416', client: 'Indústria Alfa',        from: 'Recife, PE',        to: 'Salvador, BA',       status: 'Em entrega',    updated: '26 abr, 11:20' },
  { code: 'PC-08415', client: 'Comercial BRT',         from: 'Fortaleza, CE',     to: 'Teresina, PI',       status: 'Pendente',      updated: '26 abr, 06:50' },
  { code: 'PC-08414', client: 'Frigorífico Matos',     from: 'Campo Grande, MS',  to: 'São Paulo, SP',      status: 'Finalizado',    updated: '25 abr, 22:10' },
];

function KPICard({ label, value, sub, deltaText, deltaUp }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 8, border: '1px solid #E8EDF2',
      boxShadow: '0 1px 3px rgba(0,0,0,0.07)', padding: '16px 20px', flex: 1, minWidth: 140,
    }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 700, color: '#0F1C2E', lineHeight: 1.1, marginTop: 4 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: '#64748B', marginTop: 3 }}>{sub}</div>}
      {deltaText && (
        <div style={{ fontSize: 12, fontWeight: 600, marginTop: 6, color: deltaUp ? '#16A34A' : '#C94B4B' }}>
          {deltaUp ? '↑' : '↓'} {deltaText}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { KPICard, CARGAS_DATA });
