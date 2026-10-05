// === Справочники ===
export interface AgingType {
  id: number;
  code: string;
  name_ru: string;
  weight: number;
}

export interface SubjectiveFeature {
  id: number;
  description: string;
  aging_type_id: number;
}

export interface ObjectiveFeature {
  id: number;
  code: string;
  description: string;
  max_score: number;
  aging_type_ids: number[];
}

export interface GeneticPredisposition {
  id: number;
  name: string;
  min_score: number;
  max_score: number;
}

export interface Gene {
  id: number;
  name: string;
  genotypes: string[];
}

export interface GraphPoint {
  age: number;
  value: number;
}

export interface GraphData {
  code: string;
  name_ru: string;
  points: GraphPoint[];
}

// === Факторы ===
export interface FactorGraphEffect {
  id: number;
  graph_type_id: number;
  slope_factor: number;
  offset: number;
}

export interface DeteriorationFactor {
  id: number;
  name: string;
  effects: FactorGraphEffect[];
}

// === Расчёт ===
export interface ObjectiveScore {
  code: string;
  score: number;
}

export interface CalculateRequest {
  subjective_feature_ids: number[];
  objective_scores: ObjectiveScore[];
  user_genotypes: Record<string, string>;
  active_factor_ids?: number[];
}

export interface AgingTypeScore {
  code: string;
  name_ru: string;
  score: number;
}

export interface AgingTypeResult {
  leading_type: AgingTypeScore;
  scores: AgingTypeScore[];
}

export interface PredispositionStat {
  id: number;
  name: string;
  score: number;
  min: number;
  max: number;
  risk_percent: number;
}

export interface CalculateResponse {
  aging_type: AgingTypeResult;
  predispositions: PredispositionStat[];
  graphs: GraphData[];
}

// === Дневник ===
export type TimeOfDay = "morning" | "evening" | "both";

export interface DiaryEntryCreateRequest {
  subjective_feature_ids: number[];
  objective_scores: Record<string, number>;
  user_genotypes: Record<string, string>;
  factor_ids: number[];
  note?: string;
  recorded_at?: string;
  time_of_day?: TimeOfDay | null;
  product_ids?: number[];
  photo_id?: number | null;
}

export interface DiaryEntryUpdateRequest {
  note?: string;
  recorded_at?: string;
  time_of_day?: TimeOfDay | null;
  product_ids?: number[];
  photo_id?: number | null;
}

export interface DiaryEntryOut {
  id: number;
  user_id: number;
  recorded_at: string;
  subjective_feature_ids: number[];
  objective_scores: Record<string, number>;
  user_genotypes: Record<string, string>;
  factor_ids: number[];
  result_snapshot: CalculateResponse | null;
  note: string | null;
  created_at: string;
  time_of_day: TimeOfDay | null;
  products: ProductShort[];
  photo_path: string | null;
  photo_id: number | null;
}

export interface DiaryEntryListItem {
  id: number;
  recorded_at: string;
  note: string | null;
  leading_aging_type: string | null;
  leading_aging_score: number | null;
  photo_path: string | null;
  photo_id: number | null;
}

export interface DiaryEntryListResponse {
  total: number;
  items: DiaryEntryListItem[];
}

export interface AgingTypeTrendPoint { date: string; code: string; name_ru: string; score: number; }
export interface PredispositionTrendPoint { date: string; predisposition_id: number; name: string; score: number; risk_percent: number; }
export interface GraphTrendPoint { date: string; code: string; name_ru: string; value: number; }
export interface DiaryTrendsResponse {
  aging_type: AgingTypeTrendPoint[];
  predispositions: PredispositionTrendPoint[];
  graphs: GraphTrendPoint[];
}

// === Фото ===
export interface PhotoUploadResponse {
  id: number;
  user_id: number;
  storage_path: string;
  width: number | null;
  height: number | null;
  quality_score: number | null;
  quality_flags: Record<string, unknown>;
  uploaded_at: string;
}

export interface PhotoOut extends PhotoUploadResponse {
  landmarks: number[][] | null;
  geometry_features: Record<string, number> | null;
}

export interface FaceMapResponse {
  photo_id: number;
  landmarks: number[][];
  geometry_features: Record<string, number>;
}

export interface QualityGateResult {
  score: number;
  flags: {
    face_too_small?: boolean;
    low_light?: boolean;
    blurry?: boolean;
    multiple_faces?: boolean;
    tilted?: boolean;
  };
}

// === Aging ===
export interface AgedPhotoOut {
  id: number;
  source_photo_id: number;
  target_age: number;
  storage_path: string;
  model_name: string;
  created_at: string;
}

export interface AgingGenerateRequest {
  photo_id: number;
  target_ages: number[];
  model?: "sam" | "adfd";
}

export interface AgingGenerateResponse {
  photo_id: number;
  results: AgedPhotoOut[];
}

// === Продукты ===
export interface ProductOut {
  id: number;
  name: string;
  brand: string | null;
  category: string | null;
  description: string | null;
  photo_path: string | null;
  is_archived: boolean;
  created_at: string;
}

export interface ProductShort {
  id: number;
  name: string;
  brand: string | null;
  category: string | null;
  photo_path: string | null;
}

export interface ProductCreateRequest {
  name: string;
  brand?: string | null;
  category?: string | null;
  description?: string | null;
}

export interface ProductUpdateRequest {
  name?: string;
  brand?: string | null;
  category?: string | null;
  description?: string | null;
  is_archived?: boolean;
}

export interface ProductListResponse {
  total: number;
  items: ProductOut[];
}

// Категории для селектора
export const PRODUCT_CATEGORIES = [
  "Крем",
  "Сыворотка",
  "Тоник",
  "Лосьон",
  "Очищение",
  "Маска",
  "Санскрин",
  "Скраб",
  "Патч",
  "Другое",
] as const;