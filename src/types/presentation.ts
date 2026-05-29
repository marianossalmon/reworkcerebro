export interface AsesorData {
  nombre: string;
  puesto: string;
  sucursal: string;
  email: string;
  telefono: string;
  fotoUrl?: string;
  perfilIncompleto: boolean;
}

export type CategoriaArchivo = 'renders' | 'planos' | 'modelos3d' | 'otros';

export interface ArchivoItem {
  id: string;
  nombre: string;
  url: string;
  size: string;
  type: string;
  categoria: CategoriaArchivo;
  fechaSubida: string;
}

export interface ProyectoData {
  idCliente: string; // ID uniquely representing suggesting clients
  nombreCliente: string;
  contactoNombre: string;
  contactoEmail: string;
  contactoTelefono: string;
  nombreProyecto: string;
  descripcion: string;
  montoEstimado?: string;
  noAplica3D: boolean;
  logoClienteUrl?: string;
  cotizacionPartidas?: { area: string; conceptoItems: { concepto: string; cantidad: number; total: string; }[]; }[];
  cotizacionPdfUrl?: string;
}

export interface SavedPresentation {
  id: string;
  fechaCreacion: string;
  asesor: AsesorData;
  proyecto: ProyectoData;
  archivos: ArchivoItem[];
}

export interface ConfigVisual {
  colorPrimario: string; // Predeterminado Teal Gebesa #0EC4C4
  modoOscuroPlay: boolean;
  autoplaySpeed: number; // En ms, predeterminado 3000
  mostrarMedidas: boolean;
}

export interface PresentationState {
  currentStep: number; // 0 (galeria), 1, 2, 3, 4 (success/share)
  asesor: AsesorData;
  proyecto: ProyectoData;
  archivos: ArchivoItem[];
  config: ConfigVisual;
  isSaving: boolean;
  lastSavedAt: string | null;
  selectedProyectoId: string | null;
  galeria: SavedPresentation[];
}

export type PresentationAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'UPDATE_ASESOR'; payload: Partial<AsesorData> }
  | { type: 'UPDATE_PROYECTO'; payload: Partial<ProyectoData> }
  | { type: 'ADD_ARCHIVOS'; payload: ArchivoItem[] }
  | { type: 'REMOVE_ARCHIVO'; payload: string }
  | { type: 'SET_NO_APLICA_3D'; payload: boolean }
  | { type: 'UPDATE_CONFIG'; payload: Partial<ConfigVisual> }
  | { type: 'SET_SAVING'; payload: boolean }
  | { type: 'SET_LAST_SAVED'; payload: string }
  | { type: 'LOAD_STATE_FROM_STORAGE'; payload: Partial<PresentationState> }
  | { type: 'RESET_PRESENTATION' }
  | { type: 'NEW_PRESENTATION' }
  | { type: 'SAVE_CURRENT_TO_GALLERY' }
  | { type: 'LOAD_FROM_GALLERY'; payload: string }
  | { type: 'DELETE_FROM_GALLERY'; payload: string };
