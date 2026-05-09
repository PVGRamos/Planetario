# Planeta Cargas — Web App UI Kit

## Overview
High-fidelity interactive prototype of the Planeta Cargas logistics management system. Built with React + Babel, IBM Plex Sans/Mono typography, and the full design token system.

## Design Width
1280px (responsive within that)

## Screens Included
- **Dashboard** — KPI cards, alerts, recent cargo table
- **Cargas (List)** — Full data table with search, status filters, pagination
- **Rastreamento (Detail)** — Cargo detail panel + tracking timeline
- **Cotações / Relatórios / Configurações** — Empty state placeholders

## Components
| File | Exports |
|---|---|
| `Sidebar.jsx` | `Sidebar`, `SidebarIcon` |
| `TopBar.jsx` | `TopBar`, `PrimaryBtn`, `GhostBtn` |
| `StatusBadge.jsx` | `StatusBadge`, `MonoText`, `Divider` |
| `KPICards.jsx` | `KPICard`, `CARGAS_DATA` |
| `DataTable.jsx` | `DataTable` |
| `TrackingTimeline.jsx` | `TrackingTimeline` |

## Icon System
Lucide Icons via CDN (`lucide@latest`). Call `lucide.createIcons()` after DOM updates.

## Notes
- This is a UI kit / prototype — not production code
- All data is static/fake for demonstration
- Navigation is click-through only (no routing library)
