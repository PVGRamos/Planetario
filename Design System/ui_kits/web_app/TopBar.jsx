// Planeta Cargas — TopBar Component

function TopBar({ title, subtitle, actions }) {
  return (
    <div style={{
      height: 60, background: '#fff', borderBottom: '1px solid #D1D9E0',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', flexShrink: 0,
    }}>
      <div>
        <div style={{ fontSize: 17, fontWeight: 700, color: '#0F1C2E', lineHeight: 1.2 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: '#64748B', marginTop: 1 }}>{subtitle}</div>}
      </div>
      {actions && <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>{actions}</div>}
    </div>
  );
}

function PrimaryBtn({ children, onClick, small }) {
  const [hov, setHov] = React.useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        fontFamily: "'Manrope', sans-serif",
        fontSize: small ? 12 : 14, fontWeight: 500,
        background: hov ? '#163D6E' : '#1A5FB4', color: '#fff',
        border: 'none', borderRadius: 6,
        padding: small ? '5px 12px' : '8px 18px',
        cursor: 'pointer', transition: 'background 150ms',
        display: 'inline-flex', alignItems: 'center', gap: 6,
      }}>{children}</button>
  );
}

function GhostBtn({ children, onClick }) {
  const [hov, setHov] = React.useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        fontFamily: "'Manrope', sans-serif",
        fontSize: 14, fontWeight: 400,
        background: hov ? '#F4F6F8' : '#fff', color: '#334155',
        border: '1px solid #D1D9E0', borderRadius: 6,
        padding: '7px 14px', cursor: 'pointer', transition: 'background 150ms',
        display: 'inline-flex', alignItems: 'center', gap: 6,
      }}>{children}</button>
  );
}

Object.assign(window, { TopBar, PrimaryBtn, GhostBtn });
