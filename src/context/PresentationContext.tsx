import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { PresentationState, PresentationAction, AsesorData, ProyectoData, SavedPresentation } from '../types/presentation';

const INITIAL_ASESOR_MOCK: AsesorData = {
  nombre: 'Ing. Francisco Ruiz Ortiz',
  puesto: 'Senior Workspace Advisor',
  sucursal: 'Querétaro Delta',
  email: 'f.ruiz@gebesa.com.mx',
  telefono: '', // Dejo el teléfono vacío para disparar de forma natural el "Banner de Perfil Incompleto"
  fotoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256&auto=format&fit=crop',
  perfilIncompleto: true, // Warns user because phone/details are missing for a perfect presentation
};

const DEFAULT_SAVED_PRESENTATIONS: SavedPresentation[] = [
  {
    id: 'PRES-0922',
    fechaCreacion: '28/05/2026',
    asesor: {
      nombre: 'Ing. Francisco Ruiz Ortiz',
      puesto: 'Senior Workspace Advisor',
      sucursal: 'Querétaro Delta',
      email: 'f.ruiz@gebesa.com.mx',
      telefono: '+52 449 123 4567',
      perfilIncompleto: false,
      fotoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256&auto=format&fit=crop'
    },
    proyecto: {
      idCliente: 'CLI-0922',
      nombreCliente: 'Grupo Financiero BanBajío S.A.',
      contactoNombre: 'Lic. Lorena Alanís Cantú',
      contactoEmail: 'lalanis@banbajio.com.mx',
      contactoTelefono: '+52 477 710 4000',
      nombreProyecto: 'Especificación de Mobiliario Corporativo - León R3',
      descripcion: 'Diseño integral de áreas abiertas con mesas de benching dinámico, oficinas directivas en chapa premium y salas de conferencias equipadas con sistemas de conectividad de última generación G-Connect.',
      montoEstimado: '$1,245,000 MXN',
      noAplica3D: false,
      cotizacionPartidas: [
        { concepto: 'Estaciones de Benching Colectivo Modulares G-Connect (48 operadores)', cantidad: 48, total: '$480,000 MXN' },
        { concepto: 'Mobiliario Directivo Alta Dirección Chapa de Nogal Reconstituido', cantidad: 4, total: '$320,000 MXN' },
        { concepto: 'Mesa de Conectividad Tecnológica Avanzada para Salas Ejecutivas', cantidad: 2, total: '$195,000 MXN' },
        { concepto: 'Sillería Operativa de Alto Desempeño Ergonómico G-Design', cantidad: 48, total: '$150,000 MXN' },
        { concepto: 'Mamparas Divisoras Acústicas de Fibra Mineral Absorbente', cantidad: 24, total: '$100,000 MXN' }
      ]
    },
    archivos: [
      {
        id: 'mock-b-r1',
        nombre: 'Showroom_Gebesa_Oficina_Abierta.jpg',
        url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop',
        size: '1.8 MB',
        type: 'image/jpeg',
        categoria: 'renders',
        fechaSubida: 'Hace unos días'
      },
      {
        id: 'mock-b-p1',
        nombre: 'Cortes_Plano_Ingenieria_GConnect.pdf',
        url: 'https://pdfobject.com/pdf/sample.pdf',
        size: '3.4 MB',
        type: 'application/pdf',
        categoria: 'planos',
        fechaSubida: 'Hace unos días'
      },
      {
        id: 'mock-b-3d1',
        nombre: 'Mesa_Conectividad_GConnect_3D.glb',
        url: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
        size: '4.8 MB',
        type: 'model/gltf-binary',
        categoria: 'modelos3d',
        fechaSubida: 'Hace unos días'
      }
    ]
  },
  {
    id: 'PRES-8409',
    fechaCreacion: '25/05/2026',
    asesor: {
      nombre: 'Ing. Francisco Ruiz Ortiz',
      puesto: 'Senior Workspace Advisor',
      sucursal: 'Querétaro Delta',
      email: 'f.ruiz@gebesa.com.mx',
      telefono: '+52 449 123 4567',
      perfilIncompleto: false,
      fotoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256&auto=format&fit=crop'
    },
    proyecto: {
      idCliente: 'CLI-8409',
      nombreCliente: 'TechLogix Global Solutions',
      contactoNombre: 'Ing. Alejandro Salazar Trejo',
      contactoEmail: 'a.salazar@techlogix.io',
      contactoTelefono: '+52 554 990 1289',
      nombreProyecto: 'Equipamiento de Oficinas Monterrey - Hub Innovación',
      descripcion: 'Suministro e instalación de mobiliario operativo funcional para 120 estaciones de trabajo. Incluye cajoneras pedestal elite, mamparas acústicas divisoras y sillería operativa ergonómica de alto desempeño.',
      montoEstimado: '$890,200 MXN',
      noAplica3D: true,
      cotizacionPartidas: [
        { concepto: 'Estaciones Operativas Integrales Funcionales Monterrey (120 mod)', cantidad: 120, total: '$490,000 MXN' },
        { concepto: 'Sillería de Tareas Ergonómica Ajustable Lumbar Elite', cantidad: 120, total: '$180,005 MXN' },
        { concepto: 'Mamparas Divisiores Acústicas Aislantes de Ruido Tech', cantidad: 60, total: '$110,195 MXN' },
        { concepto: 'Archiveros Móviles Metálicos con Llave de Seguridad Elite', cantidad: 120, total: '$110,000 MXN' }
      ]
    },
    archivos: [
      {
        id: 'mock-t-r1',
        nombre: 'Operativo_TechLogix_Prototipo.jpg',
        url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop',
        size: '2.1 MB',
        type: 'image/jpeg',
        categoria: 'renders',
        fechaSubida: 'Hace unos días'
      },
      {
        id: 'mock-t-p1',
        nombre: 'Plano_Planta_Operativa_Monterrey.pdf',
        url: 'https://pdfobject.com/pdf/sample.pdf',
        size: '2.8 MB',
        type: 'application/pdf',
        categoria: 'planos',
        fechaSubida: 'Hace unos días'
      }
    ]
  },
  {
    id: 'PRES-5521',
    fechaCreacion: '20/05/2026',
    asesor: {
      nombre: 'Ing. Francisco Ruiz Ortiz',
      puesto: 'Senior Workspace Advisor',
      sucursal: 'Querétaro Delta',
      email: 'f.ruiz@gebesa.com.mx',
      telefono: '+52 449 123 4567',
      perfilIncompleto: false,
      fotoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256&auto=format&fit=crop'
    },
    proyecto: {
      idCliente: 'CLI-5521',
      nombreCliente: 'Inmobiliaria Metrópoli',
      contactoNombre: 'Arq. Sofía Villaseñor Díaz',
      contactoEmail: 'sofia.v@metropoli.com.mx',
      contactoTelefono: '+52 331 450 8821',
      nombreProyecto: 'Mobiliario para Coworking Corporativo - Torre Centura GDL',
      descripcion: 'Espacios dinámicos híbridos utilizando mesas colectivas de altura ajustable, cabinas acústicas individuales para llamadas virtuales y zonas modulares de relajación activa (lounge areas) con acabados personalizados en roble claro.',
      montoEstimado: '$650,000 MXN',
      noAplica3D: false,
      cotizacionPartidas: [
        { concepto: 'Mesas Colectivas Ajustables Eléctricas Sit-to-Stand Premium', cantidad: 10, total: '$310,000 MXN' },
        { concepto: 'Cabinas Telefónicas Acústicas Privadas para Video-llamadas', cantidad: 4, total: '$160,000 MXN' },
        { concepto: 'Zonas Modulares de Confort Colaborativo Colección Lounge', cantidad: 1, total: '$180,000 MXN' }
      ]
    },
    archivos: [
      {
        id: 'mock-m-r1',
        nombre: 'Centura_GDL_Lounge_Concept.jpg',
        url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop',
        size: '1.9 MB',
        type: 'image/jpeg',
        categoria: 'renders',
        fechaSubida: 'Hace una semana'
      },
      {
        id: 'mock-m-p1',
        nombre: 'Planimetria_Zonificacion_Centura.pdf',
        url: 'https://pdfobject.com/pdf/sample.pdf',
        size: '1.5 MB',
        type: 'application/pdf',
        categoria: 'planos',
        fechaSubida: 'Hace una semana'
      },
      {
        id: 'mock-m-3d1',
        nombre: 'Cabina_Acustica_Lounge_3D.glb',
        url: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
        size: '3.1 MB',
        type: 'model/gltf-binary',
        categoria: 'modelos3d',
        fechaSubida: 'Hace una semana'
      }
    ]
  }
];

const INITIAL_STATE: PresentationState = {
  currentStep: 0, // Starts at the Gallery View so sellers can manage their existing files!
  asesor: INITIAL_ASESOR_MOCK,
  proyecto: {
    idCliente: '',
    nombreCliente: '',
    contactoNombre: '',
    contactoEmail: '',
    contactoTelefono: '',
    nombreProyecto: '',
    descripcion: '',
    montoEstimado: '',
    noAplica3D: false,
    logoClienteUrl: '',
    cotizacionPartidas: [],
    cotizacionPdfUrl: '',
  },
  archivos: [
    {
      id: 'pre-render-1',
      nombre: 'Render_Oficina_Presidencial_Gebesa.jpg',
      url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop',
      size: '2.4 MB',
      type: 'image/jpeg',
      categoria: 'renders',
      fechaSubida: 'Hace unos momentos'
    },
    {
      id: 'pre-plano-1',
      nombre: 'Plano_Zonificacion_Gebesa.pdf',
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      size: '1.2 MB',
      type: 'application/pdf',
      categoria: 'planos',
      fechaSubida: 'Hace unos momentos'
    }
  ],
  config: {
    colorPrimario: '#0EC4C4',
    modoOscuroPlay: true,
    autoplaySpeed: 3000,
    mostrarMedidas: true,
  },
  isSaving: false,
  lastSavedAt: null,
  selectedProyectoId: null,
  galeria: DEFAULT_SAVED_PRESENTATIONS,
};

function presentationReducer(state: PresentationState, action: PresentationAction): PresentationState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
      
    case 'UPDATE_ASESOR': {
      const mergedAsesor = { ...state.asesor, ...action.payload };
      const hasMissingInfo = !mergedAsesor.nombre || !mergedAsesor.puesto || !mergedAsesor.email || !mergedAsesor.telefono;
      mergedAsesor.perfilIncompleto = hasMissingInfo;
      return { ...state, asesor: mergedAsesor };
    }
    
    case 'UPDATE_PROYECTO':
      return { ...state, proyecto: { ...state.proyecto, ...action.payload } };
      
    case 'ADD_ARCHIVOS':
      return { ...state, archivos: [...state.archivos, ...action.payload] };
      
    case 'REMOVE_ARCHIVO':
      return { ...state, archivos: state.archivos.filter(a => a.id !== action.payload) };
      
    case 'SET_NO_APLICA_3D':
      return {
        ...state,
        proyecto: { ...state.proyecto, noAplica3D: action.payload }
      };
      
    case 'UPDATE_CONFIG':
      return { ...state, config: { ...state.config, ...action.payload } };
      
    case 'SET_SAVING':
      return { ...state, isSaving: action.payload };
      
    case 'SET_LAST_SAVED':
      return { ...state, lastSavedAt: action.payload };
      
    case 'LOAD_STATE_FROM_STORAGE':
      return { ...state, ...action.payload };
      
    case 'RESET_PRESENTATION':
      return {
        ...INITIAL_STATE,
        asesor: { ...state.asesor }, // maintain advisor profile
        galeria: state.galeria
      };

    case 'NEW_PRESENTATION':
      return {
        ...state,
        currentStep: 1,
        selectedProyectoId: null,
        proyecto: {
          idCliente: '',
          nombreCliente: '',
          contactoNombre: '',
          contactoEmail: '',
          contactoTelefono: '',
          nombreProyecto: '',
          descripcion: '',
          montoEstimado: '',
          noAplica3D: false,
          logoClienteUrl: '',
          cotizacionPartidas: [],
        },
        archivos: [],
      };

    case 'SAVE_CURRENT_TO_GALLERY': {
      const id = state.selectedProyectoId || `PRES-${Math.floor(1000 + Math.random() * 9000)}`;
      const fechaCreacion = new Date().toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
      const isExtant = state.galeria.some(p => p.id === id);
      
      const docToSave: SavedPresentation = {
        id,
        fechaCreacion: isExtant ? (state.galeria.find(p => p.id === id)?.fechaCreacion || fechaCreacion) : fechaCreacion,
        asesor: state.asesor,
        proyecto: state.proyecto,
        archivos: state.archivos
      };
      
      const updatedGaleria = isExtant 
        ? state.galeria.map(p => p.id === id ? docToSave : p)
        : [docToSave, ...state.galeria];
        
      localStorage.setItem('gebesa_presenter_gallery', JSON.stringify(updatedGaleria));
      
      return {
        ...state,
        selectedProyectoId: id,
        galeria: updatedGaleria,
        lastSavedAt: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
      };
    }

    case 'LOAD_FROM_GALLERY': {
      const pres = state.galeria.find(p => p.id === action.payload);
      if (!pres) return state;
      return {
        ...state,
        asesor: pres.asesor,
        proyecto: pres.proyecto,
        archivos: pres.archivos,
        selectedProyectoId: pres.id,
        currentStep: 4 // moves directly to the share/view options
      };
    }

    case 'DELETE_FROM_GALLERY': {
      const filtered = state.galeria.filter(p => p.id !== action.payload);
      localStorage.setItem('gebesa_presenter_gallery', JSON.stringify(filtered));
      const hasCurrentDraftDeleted = state.selectedProyectoId === action.payload;
      return {
        ...state,
        selectedProyectoId: hasCurrentDraftDeleted ? null : state.selectedProyectoId,
        galeria: filtered
      };
    }
      
    default:
      return state;
  }
}

const PresentationContext = createContext<{
  state: PresentationState;
  dispatch: React.Dispatch<PresentationAction>;
  saveToLocalStorage: (currState: PresentationState) => void;
} | undefined>(undefined);

export function PresentationProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(presentationReducer, INITIAL_STATE);

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('gebesa_presenter_draft');
    const savedGallery = localStorage.getItem('gebesa_presenter_gallery');
    
    let loadedState: Partial<PresentationState> = {};
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed.proyecto) {
          loadedState = {
            ...loadedState,
            proyecto: parsed.proyecto,
            archivos: parsed.archivos || [],
            config: parsed.config || INITIAL_STATE.config
          };
        }
      } catch (e) {
        console.error('Failed to parse draft presentation saved in localStorage', e);
      }
    }

    if (savedGallery) {
      try {
        const parsedGallery = JSON.parse(savedGallery);
        if (Array.isArray(parsedGallery)) {
          loadedState.galeria = parsedGallery;
        }
      } catch (e) {
        console.error('Failed to parse gallery saved in localStorage', e);
      }
    }

    if (Object.keys(loadedState).length > 0) {
      dispatch({ type: 'LOAD_STATE_FROM_STORAGE', payload: loadedState });
    }
  }, []);

  const saveToLocalStorage = (currentState: PresentationState) => {
    dispatch({ type: 'SET_SAVING', payload: true });
    
    setTimeout(() => {
      localStorage.setItem('gebesa_presenter_draft', JSON.stringify({
        proyecto: currentState.proyecto,
        archivos: currentState.archivos,
        config: currentState.config
      }));
      // Also automatically keep gallery updated if editing a loaded client project
      if (currentState.selectedProyectoId) {
        const isExtant = currentState.galeria.some(p => p.id === currentState.selectedProyectoId);
        if (isExtant) {
          const updatedGaleria = currentState.galeria.map(p => p.id === currentState.selectedProyectoId ? {
            id: p.id,
            fechaCreacion: p.fechaCreacion,
            asesor: currentState.asesor,
            proyecto: currentState.proyecto,
            archivos: currentState.archivos
          } : p);
          localStorage.setItem('gebesa_presenter_gallery', JSON.stringify(updatedGaleria));
        }
      }
      const timeStr = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      dispatch({ type: 'SET_SAVING', payload: false });
      dispatch({ type: 'SET_LAST_SAVED', payload: timeStr });
    }, 600);
  };

  return (
    <PresentationContext.Provider value={{ state, dispatch, saveToLocalStorage }}>
      {children}
    </PresentationContext.Provider>
  );
}

export function usePresentation() {
  const context = useContext(PresentationContext);
  if (!context) {
    throw new Error('usePresentation must be used within a PresentationProvider');
  }
  return context;
}
