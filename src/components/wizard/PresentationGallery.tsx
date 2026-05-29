import React, { useState } from 'react';
import { usePresentation } from '../../context/PresentationContext';
import { 
  Plus, 
  Search, 
  Folder, 
  Eye, 
  Edit3, 
  Copy, 
  Trash2, 
  Check, 
  ArrowRight, 
  Layers, 
  Calendar, 
  User, 
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { SavedPresentation } from '../../types/presentation';

interface PresentationGalleryProps {
  onLaunchClientView: () => void;
}

export default function PresentationGallery({ onLaunchClientView }: PresentationGalleryProps) {
  const { state, dispatch } = usePresentation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'has3d' | 'high_value'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const { galeria } = state;

  // Handles copying simulated link
  const handleCopyLink = (id: string) => {
    const fakeLink = `${window.location.origin}/presentacion/${id}`;
    navigator.clipboard.writeText(fakeLink).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  const handleEdit = (id: string) => {
    // 1. Load the presentation into active draft
    dispatch({ type: 'LOAD_FROM_GALLERY', payload: id });
    // 2. Set the step to step 1 (Advisor Info) or 2 (Project details) for editing
    dispatch({ type: 'SET_STEP', payload: 1 });
  };

  const handleOpenClientView = (id: string) => {
    // 1. Load into active state
    dispatch({ type: 'LOAD_FROM_GALLERY', payload: id });
    // 2. Trigger the callback that toggles viewMode inside inner
    onLaunchClientView();
  };

  const handleDelete = (id: string) => {
    dispatch({ type: 'DELETE_FROM_GALLERY', payload: id });
    setDeleteConfirmId(null);
  };

  // Filter and search logic
  const filteredPresentations = galeria.filter(pres => {
    // 1. Search Query
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      pres.proyecto.nombreCliente.toLowerCase().includes(query) ||
      pres.proyecto.nombreProyecto.toLowerCase().includes(query) ||
      pres.proyecto.contactoNombre.toLowerCase().includes(query) ||
      pres.id.toLowerCase().includes(query);

    // 2. Quick filters
    if (!matchesSearch) return false;

    if (filterType === 'has3d') {
      return pres.archivos.some(a => a.categoria === 'modelos3d');
    }

    if (filterType === 'high_value') {
      // Parse numeric characters from amount
      const valStr = pres.proyecto.montoEstimado || '';
      const num = parseInt(valStr.replace(/[^0-9]/g, ''), 10);
      return !isNaN(num) && num >= 1000000; // Over 1M MXN
    }

    return true;
  });

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300 pb-10">
      
      {/* Dynamic Statistics Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-3xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0EC4C4] flex items-center justify-center font-bold">
            <Folder className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Presentaciones</p>
            <p className="text-lg font-extrabold text-[#0D1E3A]">{galeria.length}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-gray-100 pt-3 md:pt-0 md:pl-5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Modelos 3D Activos</p>
            <p className="text-lg font-extrabold text-indigo-950">
              {galeria.filter(p => p.archivos.some(a => a.categoria === 'modelos3d')).length} Propuestas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-gray-100 pt-3 md:pt-0 md:pl-5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Trato Promedio</p>
            <p className="text-lg font-extrabold text-amber-950">$928K MXN</p>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-gray-100 pt-3 md:pt-0 md:pl-5 justify-end">
          <button
            type="button"
            onClick={() => dispatch({ type: 'NEW_PRESENTATION' })}
            className="w-full md:w-auto bg-[#0EC4C4] hover:bg-[#0CA3A3] text-white font-extrabold text-xs py-3 px-4.5 rounded-xl shadow-md shadow-teal-500/20 flex items-center justify-center gap-1.5 transition-all text-center cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Crear Propuesta
          </button>
        </div>
      </div>

      {/* Filter and Search Controller */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search bar */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por cliente, proyecto o folio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-gray-700 outline-hidden focus:border-[#0EC4C4] focus:ring-1 focus:ring-[#0EC4C4] transition-all"
          />
        </div>

        {/* Tab filters */}
        <div className="flex gap-1.5 p-1 bg-gray-100 rounded-xl w-full md:w-auto">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`flex-1 md:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterType === 'all' 
                ? 'bg-white text-gray-900 shadow-3xs' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Todas
          </button>
          <button
            type="button"
            onClick={() => setFilterType('has3d')}
            className={`flex-1 md:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterType === 'has3d' 
                ? 'bg-white text-gray-900 shadow-3xs' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Con Modelo 3D
          </button>
          <button
            type="button"
            onClick={() => setFilterType('high_value')}
            className={`flex-1 md:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterType === 'high_value' 
                ? 'bg-white text-gray-900 shadow-3xs' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Alto Valor (&gt;$1M)
          </button>
        </div>
      </div>

      {/* Main Grid / Blank State */}
      {filteredPresentations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center flex flex-col items-center justify-center gap-4 shadow-3xs">
          <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="max-w-md">
            <h3 className="text-sm font-bold text-gray-900">No se encontraron presentaciones</h3>
            <p className="text-xs text-gray-400 mt-1">
              Prueba modificando los filtros de búsqueda o haz clic en el siguiente botón para crear una nueva especificación de proyecto desde cero.
            </p>
          </div>
          <button
            type="button"
            onClick={() => dispatch({ type: 'NEW_PRESENTATION' })}
            className="mt-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-extrabold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Nueva Especificación
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Map existing presentations */}
          {filteredPresentations.map((pres) => {
            const numRenders = pres.archivos.filter(a => a.categoria === 'renders').length;
            const numPlanos = pres.archivos.filter(a => a.categoria === 'planos').length;
            const num3d = pres.archivos.filter(a => a.categoria === 'modelos3d').length;
            const clientInitial = pres.proyecto.nombreCliente.charAt(0) || 'C';

            // Distinct, professional background color for customer icon depending on name
            const iconBgColors = [
              'bg-blue-500/10 text-blue-600',
              'bg-teal-500/10 text-teal-600',
              'bg-[#0EC4C4]/10 text-[#0EC4C4]',
              'bg-indigo-500/10 text-indigo-600',
              'bg-purple-500/10 text-purple-600'
            ];
            const bgClass = iconBgColors[pres.proyecto.nombreCliente.length % iconBgColors.length];

            return (
              <div 
                key={pres.id}
                className="bg-white rounded-2xl border border-gray-250/50 flex flex-col hover:shadow-md transition-all relative overflow-hidden group shadow-3xs"
              >
                {/* Header info */}
                <div className="p-5 flex-1 flex flex-col gap-3">
                  
                  {/* Top line with Folio and creation date */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[9.5px] bg-gray-100 text-gray-500 font-extrabold px-1.8 py-0.6 rounded font-mono uppercase tracking-wider">
                      {pres.id}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {pres.fechaCreacion}
                    </span>
                  </div>

                  {/* Client with dynamic logo */}
                  <div className="flex items-start gap-3 mt-1 select-none">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0 shadow-3xs ${bgClass}`}>
                      {clientInitial}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-gray-900 truncate" title={pres.proyecto.nombreCliente}>
                        {pres.proyecto.nombreCliente}
                      </h4>
                      <p className="text-[10.5px] text-gray-400 font-medium truncate mt-0.5" title={pres.proyecto.nombreProyecto}>
                        {pres.proyecto.nombreProyecto}
                      </p>
                    </div>
                  </div>

                  {/* Brief description truncation */}
                  <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed bg-gray-50/50 p-2.5 rounded-lg border border-gray-100 mt-1 select-none">
                    {pres.proyecto.descripcion || 'Sin descripción detallada registrada para este proyecto.'}
                  </p>

                  {/* Delivery assets indicators */}
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {numRenders > 0 && (
                      <span className="text-[9.5px] bg-amber-50 text-amber-700 font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1 border border-amber-100 shadow-3xs">
                        📸 {numRenders} Render{numRenders > 1 ? 's' : ''}
                      </span>
                    )}
                    {numPlanos > 0 && (
                      <span className="text-[9.5px] bg-blue-50 text-blue-700 font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1 border border-blue-100 shadow-3xs">
                        📐 {numPlanos} Plano{numPlanos > 1 ? 's' : ''}
                      </span>
                    )}
                    {num3d > 0 && (
                      <span className="text-[9.5px] bg-indigo-50 text-indigo-700 font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1 border border-indigo-100 shadow-3xs">
                        📦 {num3d} Modelo 3D
                      </span>
                    )}
                  </div>
                </div>

                {/* Amount and quick action deck */}
                <div className="bg-gray-50/70 border-t border-gray-100 px-5 py-3.5 flex items-center justify-between gap-2.5 select-none">
                  
                  {/* Price tag */}
                  <div>
                    <span className="text-[8.5px] text-gray-400 font-black uppercase tracking-wider block">Monto Estimado</span>
                    <span className="text-[11.5px] font-black text-gray-800">
                      {pres.proyecto.montoEstimado || 'N/A'}
                    </span>
                  </div>

                  {/* Intersecting actions */}
                  <div className="flex items-center gap-1 relative">
                    
                    {/* View Play Mode Client View */}
                    <button
                      type="button"
                      onClick={() => handleOpenClientView(pres.id)}
                      className="w-8 h-8 rounded-lg bg-teal-50 hover:bg-[#0EC4C4] text-[#0EC4C4] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                      title="Presentar / Vista Cliente Implacable (Play Mode)"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() => handleEdit(pres.id)}
                      className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 flex items-center justify-center transition-colors cursor-pointer"
                      title="Editar Propuesta"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    {/* Copy simulated share link */}
                    <button
                      type="button"
                      onClick={() => handleCopyLink(pres.id)}
                      className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-250/70 text-gray-600 hover:text-gray-900 flex items-center justify-center transition-all relative cursor-pointer"
                      title="Copiar Enlace Directo"
                    >
                      {copiedId === pres.id ? (
                        <Check className="w-3.5 h-3.5 text-teal-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}

                      {copiedId === pres.id && (
                        <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-gray-900 text-white font-black text-[9px] px-2 py-0.8 rounded-md shadow-lg flex items-center gap-1 shrink-0 whitespace-nowrap z-50">
                          ¡Copiado!
                        </span>
                      )}
                    </button>

                    {/* Delete */}
                    {deleteConfirmId === pres.id ? (
                      <div className="absolute right-0 bottom-full mb-1 bg-white p-2 rounded-xl border border-red-100 shadow-xl flex flex-col items-center gap-1.5 z-40">
                        <span className="text-[10px] font-bold text-red-600 whitespace-nowrap px-1">¿Eliminar propuesta?</span>
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleDelete(pres.id)}
                            className="bg-red-500 hover:bg-red-600 text-white font-extrabold text-[9px] px-2 py-1 rounded-md cursor-pointer"
                          >
                            Sí, borrar
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(null)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-extrabold text-[9px] px-2 py-1 rounded-md cursor-pointer"
                          >
                            No
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(pres.id)}
                        className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 flex items-center justify-center transition-colors cursor-pointer"
                        title="Eliminar de mi galería"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}
