// Planeta Cargas — Status Badge + shared small components

function StatusBadge({ status }) {
  const configs = {
    'Em transporte':  { bg: '#DBEAFE', fg: '#1D4ED8', dot: '#1A5FB4' },
    'Em coleta':      { bg: '#E8F4FD', fg: '#163D6E', dot: '#2D9CDB' },
    'Em entrega':     { bg: '#DBEAFE', fg: '#1D4ED8', dot: '#2574D4' },
    'Finalizado':     { bg: '#DCFCE7', fg: '#15803D', dot: '#16A34A' },
    'Atrasado':       { bg: '#FDE8E8', fg: '#9B3535', dot: '#C94B4B' },
    'Atenção':        { bg: '#FEF3C7', fg: '#B45309', dot: '#D97706' },
    'Pendente':       { bg: '#E8EDF2', fg: '#334155', dot: '#94A3B8' },
    'Cancelado':      { bg: '#FDE8E8', fg: '#9B3535', dot: '#C94B4B' },
  };
  const c = configs[status] || configs['Pendente'];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: c.bg, color: c.fg,
      fontSize: 11, fontWeight: 600, borderRadius: 4,
      padding: '3px 8px', whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: c.dot, flexShrink: 0 }}></span>
      {status}
    </span>
  );
}

function MonoText({ children }) {
  return (
    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: '#64748B' }}>
      {children}
    </span>
  );
}

function Divider() {
  return <div style={{ height: 1, background: '#E8EDF2', margin: '0' }}></div>;
}

Object.assign(window, { StatusBadge, MonoText, Divider });
