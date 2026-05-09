# Planeta Cargas — Design System v1.0

## Company Overview

**Planeta Cargas** is a Brazilian logistics company focused on freight transport and cargo tracking. Their core value proposition is giving clients **control, predictability, and security** over logistics operations — transforming transport into a transparent, traceable, and reliable process.

**Website:** https://planetacargas.com.br

### Core Promise
> "Informação em tempo real não é diferencial, é obrigação."
> (Real-time information is not a differentiator, it is an obligation.)

---

## Sources

No external codebase or Figma link was provided. This design system was built from the brand brief provided by the team. Visual assets were created from scratch based on brand direction.

---

## Product Context

Planeta Cargas operates a logistics management system (SaaS) for freight operations. The system covers:

1. **Cotação / Pedido** — Quote entry and order creation
2. **Operação logística** — Processing and dispatch
3. **Rastreamento** — Real-time cargo tracking
4. **Comprovantes / CDE** — Delivery confirmation
5. **Histórico / Relatórios** — Post-operation reporting and history

The primary users are logistics operators and client-side managers who need to monitor active shipments, handle exceptions, and generate reports.

---

## Content Fundamentals

### Tone of Voice
- **Direct, objective, operational** — no marketing fluff
- **No vague language.** Status must always be specific.
- **Brazilian Portuguese** primary
- No emoji in operational contexts
- Sentence case for UI labels; ALL CAPS only for status badges when appropriate

### Copy Examples
| ❌ Wrong | ✅ Correct |
|---|---|
| "Sua carga está sendo cuidadosamente tratada" | "Carga em transporte" |
| "Em breve você receberá sua entrega" | "Saiu para entrega às 08:42" |
| "Identificamos um problema" | "Atraso identificado — nova previsão: 14:30" |

### Casing Rules
- Navigation items: Title Case
- CTA buttons: Sentence case with verb-first ("Enviar cotação", "Ver detalhes")
- Status labels: Sentence case ("Em transporte", "Finalizado")
- Table headers: Sentence case

---

## Visual Foundations

### Colors
- **Primary Dark Blue** `#0F2A4A` — trust, control, authority
- **Primary Blue** `#1A5FB4` — action, interaction, links
- **Accent Blue** `#2D9CDB` — highlights, in-progress state
- **Neutral White** `#FFFFFF` — base background
- **Neutral Light** `#F4F6F8` — page background, zebra rows
- **Neutral Mid** `#D1D9E0` — borders, dividers
- **Neutral Dark** `#64748B` — secondary text, labels
- **Foreground** `#0F1C2E` — primary text

### Status Colors (always color + text)
- **Green** `#16A34A` — Concluído, Entregue
- **Yellow** `#D97706` — Atenção, Pendente
- **Red** `#DC2626` — Atrasado, Erro
- **Blue** `#1A5FB4` — Em andamento, Em transporte

### Typography
- **Primary Font:** Manrope (self-hosted in `/fonts`) — humanist geometric, full weight range 200–800
- **Mono Font:** IBM Plex Mono — tracking numbers, codes
- Scale: 12 / 14 / 16 / 20 / 24 / 32 / 40px
- Line heights: tight (1.2) for headings, normal (1.5) for body, relaxed (1.6) for reading text

### Spacing
- **Base:** 8px grid
- All spacing values: 4, 8, 12, 16, 24, 32, 48, 64px
- Components: 16px internal padding standard
- Tables: 12px vertical cell padding

### Corner Radii
- Buttons: 6px
- Cards: 8px
- Badges/Tags: 4px
- Modals: 12px
- Inputs: 6px

### Shadows
- Card: `0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)`
- Elevated (dropdown, modal): `0 4px 16px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.08)`
- Focus ring: `0 0 0 3px rgba(26,95,180,0.25)`

### Backgrounds & Surfaces
- Page background: `#F4F6F8` (neutral light)
- Card/panel surface: `#FFFFFF`
- Sidebar: `#0F2A4A` (dark blue)
- Table header: `#F4F6F8`
- No gradients in UI (only allowed in brand/marketing contexts)
- No full-bleed hero images in the app

### Animation
- Functional only — no decorative animation
- Transitions: 150ms ease-out for hover states
- Loading spinners for async actions
- No bounces or elastic effects — this is an operational tool

### Hover / Press States
- Buttons: darken 10% on hover, darken 15% on press
- Table rows: `#F4F6F8` background on hover
- Links: underline on hover
- Cards: slight shadow lift on hover (elevation increase)

### Borders
- Standard: `1px solid #D1D9E0`
- Focus: `1px solid #1A5FB4` + focus ring
- Error: `1px solid #DC2626`

---

## Iconography

**Icon System:** Lucide Icons (CDN-linked — `https://unpkg.com/lucide@latest`)

Lucide is a clean, consistent stroke-based icon set that matches the operational aesthetic. Stroke width 1.5px, size 16px in UI, 20px for actions, 24px for empty states.

**No emoji** in the application UI. No decorative icons. Every icon has a functional purpose.

Common icons used:
- `package` — cargo / freight
- `map-pin` — location / origin / destination
- `truck` — transport in progress
- `check-circle` — completed
- `alert-triangle` — warning / delay
- `x-circle` — error
- `clock` — timestamps / ETA
- `filter` — table filters
- `search` — search inputs
- `download` — export / reports
- `eye` — view details
- `refresh-cw` — update / reload

---

## File Index

```
README.md                    — This file (design system overview)
SKILL.md                     — Agent skill definition
colors_and_type.css          — CSS custom properties (tokens)
assets/
  logo.svg                   — Primary logo (light bg)
  logo-dark.svg              — Logo for dark backgrounds
  logo-mark.svg              — Icon/mark only
preview/
  color-primary.html         — Primary color swatches
  color-neutral.html         — Neutral color swatches
  color-status.html          — Status color swatches
  type-scale.html            — Typography scale specimen
  type-specimens.html        — Type in context
  spacing.html               — Spacing tokens
  shadows.html               — Shadow & radius tokens
  brand-logo.html            — Logo variants
  btn-components.html        — Button components
  badge-components.html      — Status badges
  input-components.html      — Form inputs
  card-components.html       — Card components
  table-component.html       — Table component
ui_kits/
  web_app/
    README.md                — Web app UI kit notes
    index.html               — Main interactive prototype
    Sidebar.jsx              — Navigation sidebar
    TopBar.jsx               — Top bar / header
    StatusBadge.jsx          — Status badge component
    DataTable.jsx            — Core data table
    TrackingTimeline.jsx     — Cargo tracking timeline
    KPICards.jsx             — Dashboard KPI cards
```

---

## UI Kits

| Kit | Path | Description |
|---|---|---|
| Web App | `ui_kits/web_app/index.html` | Full logistics dashboard prototype with sidebar nav, tracking, tables |

