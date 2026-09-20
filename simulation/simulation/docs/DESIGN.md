---
name: Accounting OS Simulator
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#44474c'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#75777d'
  outline-variant: '#c5c6cd'
  surface-tint: '#525f75'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#0e1c2f'
  on-primary-container: '#77849c'
  inverse-primary: '#bac7e1'
  secondary: '#426086'
  on-secondary: '#ffffff'
  secondary-container: '#b3d1fd'
  on-secondary-container: '#3b5a7f'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#002114'
  on-tertiary-container: '#069669'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3fe'
  primary-fixed-dim: '#bac7e1'
  on-primary-fixed: '#0e1c2f'
  on-primary-fixed-variant: '#3a475c'
  secondary-fixed: '#d3e4ff'
  secondary-fixed-dim: '#aac9f4'
  on-secondary-fixed: '#001c38'
  on-secondary-fixed-variant: '#29486d'
  tertiary-fixed: '#85f8c4'
  tertiary-fixed-dim: '#68dba9'
  on-tertiary-fixed: '#002114'
  on-tertiary-fixed-variant: '#005137'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: ibmPlexSans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
  display-lg-mobile:
    fontFamily: ibmPlexSans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-lg:
    fontFamily: ibmPlexSans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: ibmPlexSans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
  headline-sm:
    fontFamily: ibmPlexSans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  title-md:
    fontFamily: ibmPlexSans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  title-sm:
    fontFamily: ibmPlexSans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  body-lg:
    fontFamily: ibmPlexSans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: ibmPlexSans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: ibmPlexSans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: ibmPlexSans
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  label-sm:
    fontFamily: ibmPlexSans
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
  num-display:
    fontFamily: jetbrainsMono
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  num-table:
    fontFamily: jetbrainsMono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: -0.01em
  num-table-bold:
    fontFamily: jetbrainsMono
    fontSize: 13px
    fontWeight: '700'
    lineHeight: 18px
    letterSpacing: -0.01em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  space-2xs: 0.125rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-base: 1rem
  space-lg: 1.25rem
  space-xl: 1.5rem
  space-2xl: 2rem
  space-3xl: 3rem
  table-row-h-dense: 2rem
  table-row-h-normal: 2.5rem
  sidebar-width: 18rem
  inspector-width: 22rem
---

## Brand & Style

This design system establishes an ultra-premium, high-density financial operating environment tailored for corporate accounting simulation, forensic financial modeling, and university/enterprise bookkeeping mastery. The identity merges the structural rigor and telemetry of a Bloomberg terminal with the refined usability of modern cloud ERP platforms (SAP S/4HANA, NetSuite) and precision fintech workstations.

The user experience evokes absolute mathematical confidence, institutional credibility, and operational authority. It balances intense data density with immaculate visual breathing room, allowing users to analyze ledgers, resolve reconciliation disputes, construct trial balances, and inspect interactive T-accounts without cognitive fatigue.

The design movement is **Corporate Precision Minimalist with High-Density Data Scaffolding**:
- Strict structural alignment utilizing razor-thin slate dividers and structured cell boundaries.
- High-contrast visual hierarchy tuned for rapid numeric scanning and audit trail verification.
- Native Arabic-first (RTL) ergonomics, ensuring ledger debit/credit conventions follow standard Arab accounting standards while maintaining bidirectional integrity for financial codes and Latin alphanumeric accounts.

## Colors

The color palette reflects institutional financial discipline. Color is never applied decoratively; it is strictly semantic and functional, signaling audit validity, financial flow direction, and reconciliation states.

### Core Architecture
- **Primary Navy (`#0B192C`)**: Used for top-level navigation, primary ledger headers, critical system callouts, and prominent monetary figures.
- **Secondary Slate Blue (`#1E3E62`)**: Employed for active viewports, secondary control surfaces, interactive T-account headers, and active tab indicators.
- **Tertiary Financial Emerald (`#059669`)**: Communicates balanced ledgers, verified reconciliation states, net profits, and credit surplus.

### Semantic & Ledger Signaling
- **Balanced / Credit Flow (`#059669` / `#10B981`)**: Denotes positive variance, balanced debit-credit equations, verified double-entry states, and cash inflows.
- **Pending Review / Difference Variance (`#D97706` / `#F59E0B`)**: Signals unmatched bank reconciliations, unposted adjusting journal entries, and suspense accounts.
- **Debit Burden / Discrepancy Crimson (`#DC2626`)**: Identifies trial balance imbalances, debit-credit mismatch errors, expense overruns, and critical entry rejections.
- **Structural Neutral & Slate Borders (`#E2E8F0`, `#CBD5E1`, `#F8FAFC`)**: Canvas foundations that separate financial rows, tabular cells, and docking panels without visual friction.

## Typography

Typography prioritizes bilingual clarity (Arabic and English) alongside flawless tabular alignment for financial computing:
- **Primary Typeface**: `ibmPlexSans` (paired with IBM Plex Sans Arabic in production) offers clean geometric counters, authoritative vertical metrics, and neutral terminal strokes suitable for corporate enterprise software.
- **Data & Monospace Typeface**: `jetbrainsMono` handles financial ledger numbers, transactional hashes, general ledger codes (e.g., `1010-01`), debit/credit tables, and formula calculations.
- **Tabular Figures Engine**: All monetary values, exchange rates, and financial indicators must strictly enforce tabular lining (`font-feature-settings: "tnum" 1, "lnum" 1`). This guarantees that decimal points and unit columns align across stacked journal entries and multi-row balance sheets.
- **RTL Typesetting Rules**: For Arabic ledger viewports, debit (مدين) is placed on the right and credit (دائن) on the left to reflect native T-account flow in Arab accounting curricula, while monetary digits preserve clean Western/Eastern Arabic numeral consistency without layout flipping.

## Layout & Spacing

The layout model is an ERP docking system constructed with a high-density, multi-pane workbench optimized for 1440px+ enterprise displays while gracefully collapsing down to mobile viewports.

### Layout Philosophy
- **Workbench Multi-Pane Shell**: A persistent collapsible navigation tree on the start edge (right in RTL), an expansive central calculation canvas for the active accounting tool (General Journal, Trial Balance, T-Account Visualizer, or Ledger Explorer), and an optional contextual audit inspector panel on the end edge (left in RTL).
- **Compact Density Rhythm**: Based on a base 4px/8px micro-grid. In transactional tables, row heights default to `table-row-h-dense` (32px) or `table-row-h-normal` (40px) to maximize on-screen records without requiring deep scrolling.
- **Form Factor Adaptation**:
  - **Desktop (≥ 1280px)**: 3-pane view enabled simultaneously: Navigation Tree + Double Entry Grid / Interactive T-Account + Reconciliation Audit Inspector.
  - **Tablet (768px - 1279px)**: Drawer-based navigation, collapsible audit inspector docked at the screen bottom or accessible via sliding sheet.
  - **Mobile (< 768px)**: Stacked single-pane layout with a sticky bottom summary bar displaying `Total Debits`, `Total Credits`, and `Balance Delta (الفرق)`.

## Elevation & Depth

To emulate high-end financial operating systems, visual hierarchy relies on subtle tonal containment, surface framing, and razor-sharp border definition rather than exaggerated drop shadows.

- **Level 0 (Canvas Base)**: `#0F172A` (Dark mode) or `#F8FAFC` (Light mode). Foundational backdrop for the entire accounting workspace.
- **Level 1 (Working Surfaces & Worksheets)**: Pure `#FFFFFF` (Light mode) or `#1E293B` (Dark mode). Encased with a `1px` border of `#E2E8F0` / `#334155`. Used for ledger sheets, interactive T-account boxes, and reconciliation matrices.
- **Level 2 (Active Floating Panels & Modals)**: Lifted using low-profile ambient depth: `box-shadow: 0 4px 16px -2px rgba(11, 25, 44, 0.08), 0 1px 2px 0 rgba(11, 25, 44, 0.04)`. Used for account selector popovers, chart of accounts lookup, and validation warning sheets.
- **Level 3 (Simulation Educational Hints & Alert Toasts)**: Floating guidance overlays that provide real-time didactic correction: `box-shadow: 0 12px 32px -4px rgba(11, 25, 44, 0.14)`.
- **Active Selection & Cell Focus**: Zero fuzzy halos; focused cells and active rows use a crisp `2px` inset outline of `#1E3E62` or `#059669` matching Excel/Bloomberg grid precision.

## Shapes

The design system employs a soft-architectural shape system (`roundedness: 1`). Financial platforms demand structured, disciplined geometries:
- Form fields, input cells, table rows, and status tags feature `4px` (`0.25rem`) radii, preserving an authentic ERP feel.
- Interactive cards, T-account enclosures, and docking panes utilize `8px` (`0.5rem`) outer container corners to soften the overall dashboard frame without sacrificing space efficiency.
- Pills and circles are strictly reserved for unread status counters, circular step indicators, and balance badges.

## Components

### Buttons & Interactive Triggers
- **Primary Financial Action ("Post Entry" / "ترحيل القيد")**: Solid Navy background (`#0B192C`), crisp white text, 4px border radius, 36px height. Hover state shifts to `#1E3E62`.
- **Verification / Reconcile Action**: Solid Emerald background (`#059669`), hover `#047857`. Triggers real-time balance audit checks.
- **Secondary Grid Action**: Outlined 1px `#CBD5E1`, transparent background, text `#1E293B`, subtle hover background `#F1F5F9`.
- **Destructive ("Void Journal" / "إلغاء القيد")**: Ghost button with crimson text (`#DC2626`), transitioning to `#FEF2F2` background on interaction.

### Ledger & Journal Data Grid
- **Header Cells**: 32px height, `#F1F5F9` background, uppercase tracking for Latin, solid bold weight for Arabic headers. Separated by `1px` vertical borders in `#E2E8F0`.
- **Data Cells**: Right-aligned for text (in RTL), strictly left-aligned for numeric tabular currency strings (or reversed consistently per regional preference). Active focused cells have a high-contrast `2px` border.
- **Total/Balancing Row**: Thick double-underline bottom border (accounting standard rule: `border-bottom: 3px double #0B192C`). Displays dynamic delta pill showing exact difference if out of balance.

### Interactive T-Account Visualizer
- **Structure**: A sharp visual "T" container with a prominent account title header banner (e.g., `1010 - النقدية وما في حكمها / Cash & Equivalents`).
- **Divided Columns**: Right column for Debit (مدين), Left column for Credit (دائن) under RTL rules.
- **Interactive Drag/Match Target**: Dotted drop areas allowing students to drag journal lines directly into the T-account ledger sides.
- **Balance Footing**: Clear baseline footer computing `رصيد مدين` (Debit Balance) or `رصيد دائن` (Credit Balance) automatically color-coded with green or warning amber.

### Split Reconciliation Cards
- **Dual Column Layout**: Bank Statement entries on the right, Internal General Ledger on the left.
- **Matching Mechanism**: Interactive check-target connecting line that highlights matching amounts in emerald green while tagging mismatched fees or transit items with amber variance chips.

### Educational Guidance Hint Cards
- **Visuals**: Left/Right border accent stripe (3px) in `#1E3E62` on a soft ice-blue surface (`#F8FAFC`).
- **Content Hierarchy**: Includes an icon indicator, reference to standard accounting standards (SOCPA / IFRS principles), and concise contextual guidance explaining why a debit or credit is required for the specific transaction scenario.

### Status Chips & Financial Badges
- **Balanced (متزن)**: Background `#ECFDF5`, text `#065F46`, border 1px `#A7F3D0`.
- **Unbalanced (غير متزن)**: Background `#FEF2F2`, text `#991B1B`, border 1px `#FECACA`.
- **Pending Review (قيد المراجعة)**: Background `#FFFBEB`, text `#92400E`, border 1px `#FDE68A`.