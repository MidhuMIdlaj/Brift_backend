// ─── Add Module ───────────────────────────────────────────────────────────────
export interface AddModuleRequestDTO {
  key:           string;
  name:          string;
  description:   string;
  pricePerMonth: number;
  status?:       'active' | 'inactive';
}

export interface AddModuleResponseDTO {
  _id:           string;
  key:           string;
  name:          string;
  description:   string;
  pricePerMonth: number;
  status:        string;
  message:       string;
}

// ─── Edit Module ──────────────────────────────────────────────────────────────
export interface EditModuleRequestDTO {
  moduleId:       string;
  name?:          string;
  description?:   string;
  pricePerMonth?: number;
  status?:        'active' | 'inactive';
}

export interface EditModuleResponseDTO {
  _id:           string;
  key:           string;
  name:          string;
  description:   string;
  pricePerMonth: number;
  status:        string;
  message:       string;
}

// ─── Delete Module ────────────────────────────────────────────────────────────
export interface DeleteModuleRequestDTO {
  moduleId: string;
}

export interface DeleteModuleResponseDTO {
  moduleId: string;
  message:  string;
}

// ─── Get Module ───────────────────────────────────────────────────────────────
export interface GetModuleResponseDTO {
  _id:           string;
  key:           string;
  name:          string;
  description:   string;
  pricePerMonth: number;
  status:        string;
  createdAt?:    Date;
}