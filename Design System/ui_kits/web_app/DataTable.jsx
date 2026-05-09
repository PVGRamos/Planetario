// Planeta Cargas — DataTable Component

const { useState: useStateTable } = React;

function DataTable({ data, onSelectRow }) {
  const [sortCol, setSortCol] = React.useState(null);
  const [sortDir, setSortDir] = React.useState('asc');
  const [filter, setFilter] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('Todos');

  const STATUSES = ['Todos', 'Em transporte', 'Em coleta', 'Em entrega', 'Finalizado', 'Atrasado', 'Atenção', 'Pendente'];

  const filtered = data.filter(r => {
    const q = filter.toLowerCase();
    const matchText = !q || r.code.toLowerCase().includes(q) || r.client.toLowerCase().includes(q) || r.from.toLowerCase().includes(q) || r.to.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'Todos' || r.status === statusFilter;
    return matchText && matchStatus;
  });

  const cols = [
    { key: 'code', label: 'Código' },
    { key: 'client', label: 'Cliente' },
    { key: 'from', label: 'Origem' },
    { key: 'to', label: 'Destino' },
    { key: 'status', label: 'Status' },
    { key: 'updated', label: 'Última atualização' },
  ];

  const thStyle = {
    background: '#F4F6F8', padding: '10px 14px', fontSize: 11,
    fontWeight: 600, color: '#64748B', textTransform: 'uppercase',
    letterSpacing: '0.06em', textAlign: 'left', borderBottom: '1px solid #D1D9E0',
    whiteSpace: 'nowrap', cursor: 'pointer', userSelect: 'none',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <input
            value={filter} onChange={e => setFilter(e.target.value)}
            placeholder="Buscar por código, cliente ou rota..."
            style={{
              width: '100%', fontFamily: "'Manrope',sans-serif", fontSize: 13,
              padding: '8px 12px 8px 34px', border: '1px solid #D1D9E0', borderRadius: 6,
              outline: 'none', background: '#fff', color: '#0F1C2E',
            }}
          />
          <i data-lucide="search" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: '#94A3B8', strokeWidth: 2 }}></i>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {STATUSES.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} style={{
              fontFamily: "'Manrope',sans-serif", fontSize: 12, fontWeight: statusFilter === s ? 600 : 400,
              padding: '5px 10px', borderRadius: 6, cursor: 'pointer',
              border: statusFilter === s ? '1px solid #1A5FB4' : '1px solid #D1D9E0',
              background: statusFilter === s ? '#DBEAFE' : '#fff',
              color: statusFilter === s ? '#1D4ED8' : '#64748B',
            }}>{s}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #D1D9E0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {cols.map(c => (
                <th key={c.key} style={thStyle}>{c.label}</th>
              ))}
              <th style={{ ...thStyle, width: 40 }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ padding: 32, textAlign: 'center', color: '#94A3B8', fontSize: 14 }}>
                Nenhuma carga encontrada
              </td></tr>
            )}
            {filtered.map((row, i) => (
              <tr key={row.code} onClick={() => onSelectRow && onSelectRow(row)}
                style={{ borderBottom: '1px solid #E8EDF2', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = '#F4F6F8'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '10px 14px', fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: '#64748B' }}>{row.code}</td>
                <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 500, color: '#0F1C2E' }}>{row.client}</td>
                <td style={{ padding: '10px 14px', fontSize: 13, color: '#334155' }}>{row.from}</td>
                <td style={{ padding: '10px 14px', fontSize: 13, color: '#334155' }}>{row.to}</td>
                <td style={{ padding: '10px 14px' }}><StatusBadge status={row.status} /></td>
                <td style={{ padding: '10px 14px', fontSize: 12, color: '#64748B' }}>{row.updated}</td>
                <td style={{ padding: '10px 14px' }}>
                  <i data-lucide="chevron-right" style={{ width: 15, height: 15, color: '#94A3B8', strokeWidth: 2 }}></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: '10px 14px', borderTop: '1px solid #E8EDF2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: '#64748B' }}>{filtered.length} resultado{filtered.length !== 1 ? 's' : ''}</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {[1,2,3].map(p => (
              <button key={p} style={{
                fontFamily: "'Manrope',sans-serif", fontSize: 12,
                padding: '3px 9px', borderRadius: 4, border: '1px solid #D1D9E0',
                background: p === 1 ? '#1A5FB4' : '#fff', color: p === 1 ? '#fff' : '#64748B', cursor: 'pointer',
              }}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { DataTable });
