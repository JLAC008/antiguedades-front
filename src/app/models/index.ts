export interface Catalog {
  id: string;
  name: string;
  description: string;
  cover_image: string;
  created_by: string;
  created_at: string;
  antiques_count?: number;
}

export type AntiqueType = 'antiguedad' | 'papeleria';

export type AntiqueStatus = 'reservado' | 'pagado' | 'vendido' | 'enviado';

export const ANTIQUE_STATUS_LABELS: Record<AntiqueStatus, string> = {
  reservado: 'Reservado',
  pagado: 'Pagado',
  vendido: 'Vendido',
  enviado: 'Enviado',
};

export const DEFAULT_ANTIQUE_IMAGE = 'assets/upload-busto-card.jpg';

export interface Antique {
  id: string;
  lot_number: number;
  catalog_id: string | null;
  name: string;
  allow_duplicate_name: boolean;
  type: AntiqueType;
  subcategory: string;
  detail: string;
  country: string;
  region: string;
  element: string;
  title?: string;
  author?: string;
  editor?: string;
  imprenta?: string;
  edition?: string;
  signature?: string;
  theme?: string;
  century?: string;
  description: string;
  price: number;
  year_era: string;
  condition: string;
  status?: AntiqueStatus | null;
  material: string;
  dimensions: string;
  paper_type?: string;
  paper_format?: string;
  paper_weight?: number;
  images: string[];
  created_by: string;
  created_at: string;
  catalog?: Catalog;
}

export interface CategoryDetail {
  key: string;
  label: string;
  desc: string;
}

export interface CategorySubcategory {
  key: string;
  label: string;
  details: CategoryDetail[];
}

export interface CategoryGroup {
  type: AntiqueType;
  subcategories: CategorySubcategory[];
}

export type UserRole = 'superuser' | 'admin' | 'user';

export interface AppUser {
  id: string;
  email: string;
  password?: string;
  role: UserRole;
  name: string;
  created_at: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  username: string;
  role: string;
  user_id: string;
}

export interface ConditionItem {
  label: string;
}

export interface CountsResponse {
  antiguedad: number;
  papeleria: number;
}
