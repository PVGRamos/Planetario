// Planeta Cargas — Sidebar Component
// Shared via window.PCsidebar

const { useState } = React;

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
  { id: 'cargas',    label: 'Cargas',    icon: 'package' },
  { id: 'rastreamento', label: 'Rastreamento', icon: 'map-pin' },
  { id: 'cotacoes',  label: 'Cotações',  icon: 'file-text' },
  { id: 'relatorios',label: 'Relatórios',icon: 'bar-chart-2' },
];

const BOTTOM_ITEMS = [
  { id: 'configuracoes', label: 'Configurações', icon: 'settings' },
];

function SidebarIcon({ name, size = 18 }) {
  return (
    <i data-lucide={name} style={{ width: size, height: size, strokeWidth: 1.75, flexShrink: 0 }}></i>
  );
}

function Sidebar({ activePage, onNavigate }) {
  return (
    <aside style={{
      width: 220, minWidth: 220, height: '100vh',
      background: '#0F2A4A', display: 'flex', flexDirection: 'column',
      borderRight: '1px solid #163D6E', flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <img src="../../assets/logo-white.png" alt="Planeta Cargas" style={{ width: 160, display: 'block', objectFit: 'contain' }} />
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV_ITEMS.map(item => {
          const active = activePage === item.id;
          return (
            <button key={item.id} onClick={() => onNavigate(item.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
              background: active ? '#1A5FB4' : 'transparent',
              color: active ? '#fff' : 'rgba(255,255,255,0.65)',
              fontSize: 14, fontWeight: active ? 600 : 400,
              fontFamily: "'Manrope', sans-serif",
              textAlign: 'left', width: '100%',
              transition: 'all 150ms ease-out',
            }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              <SidebarIcon name={item.icon} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '10px 10px 16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        {BOTTOM_ITEMS.map(item => (
          <button key={item.id} onClick={() => onNavigate(item.id)} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
            background: activePage === item.id ? '#1A5FB4' : 'transparent',
            color: 'rgba(255,255,255,0.55)',
            fontSize: 13, fontWeight: 400,
            fontFamily: "'Manrope', sans-serif",
            textAlign: 'left', width: '100%',
          }}>
            <SidebarIcon name={item.icon} />
            {item.label}
          </button>
        ))}
        {/* User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px 0' }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: '#1A5FB4', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0,
          }}>RC</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>Ricardo C.</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 1 }}>Operador</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

Object.assign(window, { Sidebar, SidebarIcon });
