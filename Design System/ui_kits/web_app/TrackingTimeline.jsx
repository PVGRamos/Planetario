// Planeta Cargas — Tracking Timeline Component

const TIMELINE_EVENTS = [
  { time: '26 abr, 11:20', label: 'Em entrega', desc: 'Saiu para entrega — motorista: J. Silva', status: 'active', icon: 'truck' },
  { time: '26 abr, 08:42', label: 'Chegou ao CD Curitiba', desc: 'Carga recebida no centro de distribuição', status: 'done', icon: 'package' },
  { time: '26 abr, 03:15', label: 'Em trânsito', desc: 'Partiu de São Paulo rumo a Curitiba', status: 'done', icon: 'arrow-right' },
  { time: '25 abr, 22:00', label: 'Coleta realizada', desc: 'Carga coletada na origem', status: 'done', icon: 'check-circle' },
  { time: '25 abr, 18:30', label: 'Pedido confirmado', desc: 'Cotação aprovada e pedido criado', status: 'done', icon: 'file-text' },
];

const FUTURE_EVENTS = [
  { time: 'Prev: 14:30', label: 'Entrega finalizada', desc: 'Entrega prevista ao destinatário', status: 'future', icon: 'flag' },
];

function TrackingTimeline({ cargo }) {
  const dotColor = { active: '#1A5FB4', done: '#16A34A', future: '#D1D9E0' };
  const lineColor = { active: '#1A5FB4', done: '#16A34A', future: '#E8EDF2' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {[...TIMELINE_EVENTS, ...FUTURE_EVENTS].map((ev, i, arr) => (
        <div key={i} style={{ display: 'flex', gap: 14, position: 'relative' }}>
          {/* Left: dot + line */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 20, flexShrink: 0 }}>
            <div style={{
              width: ev.status === 'active' ? 14 : 10,
              height: ev.status === 'active' ? 14 : 10,
              borderRadius: '50%',
              background: dotColor[ev.status],
              border: ev.status === 'future' ? '2px solid #D1D9E0' : 'none',
              boxShadow: ev.status === 'active' ? '0 0 0 4px rgba(26,95,180,0.15)' : 'none',
              flexShrink: 0, marginTop: ev.status === 'active' ? 2 : 4,
              zIndex: 1,
            }}></div>
            {i < arr.length - 1 && (
              <div style={{ flex: 1, width: 2, background: lineColor[ev.status], minHeight: 28, marginTop: 2 }}></div>
            )}
          </div>
          {/* Right: content */}
          <div style={{ paddingBottom: i < arr.length - 1 ? 20 : 0, flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{
                fontSize: 13, fontWeight: ev.status === 'active' ? 700 : 500,
                color: ev.status === 'future' ? '#94A3B8' : '#0F1C2E',
              }}>{ev.label}</div>
              <div style={{ fontSize: 11, color: '#94A3B8', fontFamily: "'IBM Plex Mono',monospace", whiteSpace: 'nowrap', marginLeft: 8 }}>{ev.time}</div>
            </div>
            <div style={{ fontSize: 12, color: ev.status === 'future' ? '#CBD5E1' : '#64748B', marginTop: 2 }}>{ev.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { TrackingTimeline, TIMELINE_EVENTS });
