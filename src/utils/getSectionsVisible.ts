import { PresentationState } from '../types/presentation';

export type SectionType = 'portada' | 'descripcion' | 'cotizacion' | 'cotizacionPdf' | 'renders' | 'planos' | 'modelos3d' | 'contacto';

export interface SectionMetadata {
  id: SectionType;
  label: string;
  icon: string;
}

export const ALL_SECTIONS: SectionMetadata[] = [
  { id: 'portada', label: 'Inicio', icon: '🏠' },
  { id: 'descripcion', label: 'Descripción del Proyecto', icon: '📖' },
  { id: 'renders', label: 'Galería de Renders', icon: '🖼️' },
  { id: 'planos', label: 'Planos de Distribución', icon: '📄' },
  { id: 'modelos3d', label: 'Maqueta 3D Interactiva', icon: '📦' },
  { id: 'cotizacion', label: 'Propuesta Económica', icon: '💰' },
  { id: 'cotizacionPdf', label: 'Archivo de Cotización', icon: '📄' },
  { id: 'contacto', label: 'Contacto y Asesoría', icon: '💼' }
];

export function getSectionsVisible(state: PresentationState): SectionMetadata[] {
  return ALL_SECTIONS.filter(section => {
    switch (section.id) {
      case 'portada':
        return true;
        
      case 'descripcion':
        return !!state.proyecto.descripcion && state.proyecto.descripcion.trim() !== '';
        
      case 'cotizacion':
        // Show if estimated budget exists, or if there are partidas
        return !!state.proyecto.montoEstimado || (state.proyecto.cotizacionPartidas && state.proyecto.cotizacionPartidas.length > 0);
        
      case 'cotizacionPdf':
        return !!state.proyecto.cotizacionPdfUrl && state.proyecto.cotizacionPdfUrl.trim() !== '';
        
      case 'renders':
        return state.archivos.some(a => a.categoria === 'renders');
        
      case 'planos':
        return state.archivos.some(a => a.categoria === 'planos');
        
      case 'modelos3d':
        // If "noAplica3D" is check on the project page, immediately filter it out!
        if (state.proyecto.noAplica3D) return false;
        return state.archivos.some(a => a.categoria === 'modelos3d');
        
      case 'contacto':
        return true;
        
      default:
        return false;
    }
  });
}
