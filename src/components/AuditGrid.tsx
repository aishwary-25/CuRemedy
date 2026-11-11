'use client';
import { AgGridReact } from 'ag-grid-react';
import { useMemo } from 'react';
import type { ColDef, ICellRendererParams } from 'ag-grid-community';
import type { CPTLineItem } from '@/lib/types';
import type { DisplayCurrency } from '@/lib/currency';
import { formatMoney } from '@/lib/currency';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
export default function AuditGrid({ rows, currency }: { rows: CPTLineItem[]; currency: DisplayCurrency }) {
  const columns = useMemo<ColDef<CPTLineItem>[]>(() => [
    { field: 'code', headerName: 'CPT CODE', width: 126, filter: true, pinned: 'left', cellRenderer: (p: ICellRendererParams<CPTLineItem>) => <span className="code-pill">{p.value}</span> },
    { field: 'description', headerName: 'SERVICE / FINDING', flex: 1.35, minWidth: 205, filter: true, cellRenderer: (p: ICellRendererParams<CPTLineItem>) => <div className="service-cell"><b>{p.value}</b><small>{p.data?.citation}</small></div> },
    { field: 'billedCents', headerName: 'BILLED', width: 126, valueFormatter: p => formatMoney(p.value ?? 0, currency), cellClass: 'billed-cell' },
    { field: 'fairCents', headerName: 'FAIR PRICE', width: 126, valueFormatter: p => formatMoney(p.value ?? 0, currency), cellClass: 'fair-cell' },
    { field: 'savingsCents', headerName: 'SAVINGS', width: 135, cellRenderer: (p: ICellRendererParams<CPTLineItem>) => { const pct = p.data?.billedCents ? Math.round((Number(p.value) / p.data.billedCents) * 100) : 0; return <div className="variance-cell"><b>{formatMoney(Number(p.value) || 0, currency)}</b><span>{pct}% variance</span></div>; } },
    { field: 'status', headerName: 'AUDIT FLAG', width: 140, filter: true, cellRenderer: (p: ICellRendererParams<CPTLineItem>) => <span className={`badge badge-${String(p.value).toLowerCase()}`}>{String(p.value).replace('_', ' ')}</span> }
  ], [currency]);
  return <div className="ag-theme-quartz audit-grid"><AgGridReact<CPTLineItem> rowData={rows} columnDefs={columns} defaultColDef={{ sortable: true, resizable: true }} animateRows pagination paginationPageSize={6} /></div>;
}
