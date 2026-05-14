import type { ComponentType, ReactNode } from 'react';

/**
 * Общие типы.
 * ИИ расширяет этот файл при необходимости.
 */

// ── Pagination ─────────────────────────────────────────────────

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ── API Response ───────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
}

// ── UI ─────────────────────────────────────────────────────────

export type Status = 'idle' | 'loading' | 'success' | 'error';

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type Variant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'ghost'
  | 'link';

export type ColorToken =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'destructive'
  | 'info'
  | 'muted';

// ── Navigation ─────────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  icon?: ComponentType<{ className?: string }>;
  badge?: string | number;
  children?: NavItem[];
}

// ── Table ──────────────────────────────────────────────────────

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  width?: number | string;
  render?: (value: unknown, row: T) => ReactNode;
}

// ── Select options ─────────────────────────────────────────────

export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
  icon?: ComponentType<{ className?: string }>;
}

// ── Map ───────────────────────────────────────────────────────

export interface LatLng {
  lat: number;
  lng: number;
}

export interface MapMarker extends LatLng {
  id: string;
  title?: string;
  description?: string;
  color?: string;
}
