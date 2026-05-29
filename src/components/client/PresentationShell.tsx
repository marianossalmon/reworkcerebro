import React, { useState } from 'react';
import { PresentationState } from '../../types/presentation';
import { getSectionsVisible, SectionMetadata, SectionType } from '../../utils/getSectionsVisible';
import PlayModeOverlay from './PlayModeOverlay';
import { Play, Menu, X, Phone, Mail, MessageSquare, Landmark, FileText, ChevronRight, Download, Globe, Clock, ShieldCheck, ZoomIn } from 'lucide-react';

interface PresentationShellProps {
  state: PresentationState;
  onBackToWizard: () => void;
}

export default function PresentationShell({ state, onBackToWizard }: PresentationShellProps) {
  const [activeSectionId, setActiveSectionId] = useState<SectionType>('portada');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [playModeActive, setPlayModeActive] = useState(false);

  // Filter empty/skipped sections
  const visibleSections = getSectionsVisible(state);

  const renders = state.archivos.filter(a => a.categoria === 'renders');
  const planos = state.archivos.filter(a => a.categoria === 'planos');
  const modelos3d = state.archivos.filter(a => a.categoria === 'modelos3d');

  const activeSection = visibleSections.find(s => s.id === activeSectionId) || visibleSections[0];

  const handleNextSection = () => {
    const currentIndex = visibleSections.findIndex(s => s.id === activeSectionId);
    if (currentIndex < visibleSections.length - 1) {
      setActiveSectionId(visibleSections[currentIndex + 1].id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans w-full select-none text-gray-805 relative">
      
      {/* Immersive Play Mode Overlay Viewport */}
      {playModeActive && (
        <PlayModeOverlay 
          state={state} 
          visibleSections={visibleSections} 
          onClose={() => setPlayModeActive(false)} 
        />
      )}

      {/* Top Client Header */}
      <header className="bg-white border-b border-gray-100 h-16 px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center gap-3">
          {/* Switch back to adviser view button */}
          <button 
            type="button" 
            onClick={onBackToWizard}
            className="text-[10px] font-bold text-gray-400 hover:text-[#0EC4C4] border border-gray-200 hover:border-[#0EC4C4] px-2.5 py-1.5 rounded-lg mr-2 transition-colors cursor-pointer"
          >
            ← Volver a Redacción Asesor
          </button>
          
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-gray-900 leading-none">Gebesa</span>
            <span className="text-[7px] uppercase tracking-wider text-gray-400 font-semibold mt-0.5">Creating Amazing Spaces</span>
          </div>
        </div>

        {/* CTA "Play Guided Slide Mode" */}
        <div className="flex items-center gap-3">
          <button 
            type="button" 
            onClick={() => setPlayModeActive(true)}
            className="bg-gray-900 hover:bg-black text-[#0EC4C4] font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer text-center"
          >
            <Play className="w-3.5 h-3.5 fill-[#0EC4C4]" /> 
            <span className="hidden sm:inline">Modo Presentación (Auto Play)</span>
            <span className="sm:hidden">Ver Presentación</span>
          </button>

          {/* Mobile burger toggle icon */}
          <button 
            type="button" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-50 text-gray-500"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main viewport area */}
      <div className="flex-1 flex flex-col md:flex-row w-full max-w-7xl mx-auto relative overflow-hidden">
        
        {/* SIDEBAR NAVIGATION (Desktop: Persistent list, Mobile: Slide-in list index) */}
        <aside className={`
          inset-y-0 left-0 w-64 bg-white border-r border-gray-100 p-5 flex flex-col justify-between shrink-0 z-20 transition-all duration-300
          ${mobileMenuOpen ? 'fixed translate-x-0 overflow-y-auto block pt-20 shadow-2xl' : 'hidden md:flex md:sticky md:top-16 md:h-[calc(screen-16)]'}
        `}>
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400">Guía de Espacios</span>
              <p className="text-xs font-bold text-gray-900 truncate">{state.proyecto.nombreCliente}</p>
            </div>

            {/* Menu Item buttons matching getSectionsVisible list */}
            <nav className="space-y-1">
              {visibleSections.map((sect) => (
                <button
                  key={sect.id}
                  onClick={() => {
                    setActiveSectionId(sect.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-colors cursor-pointer ${
                    activeSectionId === sect.id 
                      ? 'bg-teal-50/70 text-teal-700 font-bold border-l-4 border-[#0EC4C4]' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="text-base shrink-0">{sect.icon}</span>
                  <span className="truncate">{sect.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Small corporate advisor card at bottom sidebar */}
          <div className="border-t border-gray-50 pt-4 mt-6">
            <div className="flex items-center gap-2.5">
              <img 
                src={state.asesor.fotoUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=128&auto=format&fit=crop'} 
                alt={state.asesor.nombre} 
                className="w-10 h-10 rounded-full object-cover ring-2 ring-teal-50"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-900 truncate">{state.asesor.nombre}</p>
                <p className="text-[10px] text-gray-400 font-medium truncate">{state.asesor.puesto}</p>
              </div>
            </div>
            <a 
              href={`tel:${state.asesor.telefono}`}
              className="mt-3.5 block text-center bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-[10.5px] py-1.5 px-3 rounded-lg transition-colors cursor-pointer uppercase tracking-wider"
            >
              📞 Llamar Asesor
            </a>
          </div>
        </aside>

        {/* ACTIVE SECTION MAIN RENDER CONTAINER PANEL */}
        <main className="flex-1 bg-white p-6 md:p-8 min-w-0 flex flex-col justify-between overflow-y-auto min-h-[calc(100vh-4rem)]">
          
          <div className="space-y-6 max-w-3xl mx-auto w-full">
            
            {/* PORTADA section */}
            {activeSectionId === 'portada' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-[#121824] to-[#1a2336] rounded-2xl p-8 text-white relative overflow-hidden shadow-md">
                  <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none text-9xl">🏛️</div>
                  {state.proyecto.logoClienteUrl && (
                    <div className="absolute top-6 right-6 bg-white rounded-xl p-2 max-w-[120px] max-h-[50px] flex items-center justify-center border border-white/10 shadow-lg animate-in fade-in duration-300">
                      <img src={state.proyecto.logoClienteUrl} alt="Logo Cliente" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                    </div>
                  )}
                  <span className="text-[#0EC4C4] text-[10px] uppercase font-mono tracking-[0.15em] font-semibold">WORKSPACE PRESENTATION PACKAGE</span>
                  <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mt-2 leading-tight">
                    {state.proyecto.nombreProyecto || 'Especificación Integral de Mobiliario'}
                  </h1>
                  <p className="text-sm text-gray-300 mt-2 font-medium max-w-xl">
                    Portafolio conceptual de productos, modelado volumétrico, planos técnicos de zonificación y acabados seleccionados.
                  </p>
                  
                  <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-white/10 text-xs">
                    <span className="flex items-center gap-1 text-gray-300">
                      🏢 Cuenta: <strong className="text-white font-bold">{state.proyecto.nombreCliente}</strong>
                    </span>
                    <span className="flex items-center gap-1 text-gray-300">
                      📅 Fecha: <strong className="text-white font-bold">Mayo 2026</strong>
                    </span>
                  </div>
                </div>

                {/* Scope Highlights Bento-style metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border border-gray-100 rounded-xl bg-gray-50/30">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold">Fotogalería</span>
                    <p className="text-base font-bold text-gray-900 mt-1">{renders.length} Renders Procesados</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Vistas volumétricas en 3D del showroom.</p>
                  </div>
                  <div className="p-4 border border-gray-100 rounded-xl bg-gray-50/30">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold">Planimetría</span>
                    <p className="text-base font-bold text-gray-900 mt-1">{planos.length} Plano de Distribución</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Plan de flujo peatonal y bloques.</p>
                  </div>
                  <div className="p-4 border border-gray-100 rounded-xl bg-gray-50/30">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold">Integración 3D</span>
                    <p className="text-base font-bold text-gray-900 mt-1">
                      {state.proyecto.noAplica3D ? 'Sin Requerimiento' : `${modelos3d.length} Modelo GLB`}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Maquetado digital para vista de órbita.</p>
                  </div>
                </div>
              </div>
            )}

            {/* DESCRIPCION section */}
            {activeSectionId === 'descripcion' && (
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-bold text-teal-600 tracking-wider">02 • Alcance y Justificación Técnica</span>
                <h2 className="text-lg font-bold text-gray-950 flex items-center gap-1.5Packed font-sans">
                  Descripción Conceptual del Proyecto
                </h2>
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-3xs hover:shadow-2xs transition-shadow relative overflow-hidden">
                  <div className="text-xs text-gray-700 leading-relaxed font-semibold whitespace-pre-wrap">
                    {state.proyecto.descripcion}
                  </div>
                </div>
              </div>
            )}

            {/* COTIZACION table section */}
            {activeSectionId === 'cotizacion' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div>
                  <span className="text-[10px] uppercase font-bold text-teal-600 tracking-wider">03 • Propuesta Económica</span>
                  <h2 className="text-lg font-bold text-gray-950 mt-0.5 font-sans">Desglose Técnico y Presupuesto Comercial</h2>
                  <p className="text-xs text-gray-500">Montos referenciales sujetos a cotización formal y vigencia de precios.</p>
                </div>

                <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-xs">
                  <div className="p-5 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-gray-400 block mb-0.5">Total Referenciado</span>
                      <h4 className="text-xl font-black text-gray-900 font-mono leading-none">{state.proyecto.montoEstimado || '$0.00 MXN'}</h4>
                    </div>
                    <div className="bg-teal-50 text-teal-700 text-[10px] font-bold px-3 py-1.5 rounded-xl border border-teal-100 uppercase tracking-wild shrink-0">
                      Válido por 30 Días
                    </div>
                  </div>

                  <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto">
                    {state.proyecto.cotizacionPartidas && state.proyecto.cotizacionPartidas.length > 0 ? (
                      state.proyecto.cotizacionPartidas.map((item, idX) => (
                        <div key={idX} className="px-5 py-4 flex items-center justify-between text-xs hover:bg-gray-50/50 transition-colors">
                          <div className="space-y-1 pr-4 max-w-[80%]">
                            <p className="font-bold text-gray-800 leading-snug">{item.concepto}</p>
                            <p className="text-[10px] text-gray-400 font-medium">Cantidad: <strong className="text-gray-600">{item.cantidad || 1}</strong> unidad(es)</p>
                          </div>
                          <strong className="font-bold text-gray-900 font-mono shrink-0">{item.total}</strong>
                        </div>
                      ))
                    ) : (
                      <div className="px-5 py-6 text-center text-xs text-gray-500 font-medium">
                        Sin partidas especificadas. Se cotiza un volumen estimado de {state.proyecto.montoEstimado || 'monto no definido'}.
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 text-[11px] text-amber-800 leading-relaxed flex items-start gap-2.5">
                  <span className="text-base shrink-0 leading-none">⚠️</span>
                  <p>
                    <strong>Nota comercial:</strong> El precio reflejado en esta sección es una pre-evaluación del proyecto de especificación. No incluye fletes directos, instalaciones foráneas ni maniobras especiales. Favor de confirmar con su asesor antes del cierre final.
                  </p>
                </div>
              </div>
            )}

            {/* RENDERS Gallery section */}
            {activeSectionId === 'renders' && (
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-teal-600 tracking-wider">03 • Visualización</span>
                  <h2 className="text-lg font-bold text-gray-950 mt-0.5">Galería Fotográfica y Renders del Sistema</h2>
                  <p className="text-xs text-gray-500">Haz clic en el visualizador o utiliza el Play Mode para verlos en pantalla completa.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renders.map(item => (
                    <div key={item.id} className="border border-gray-100 rounded-xl overflow-hidden bg-gray-50 flex flex-col group hover:shadow-md transition-shadow">
                      <div className="aspect-video relative overflow-hidden bg-black flex items-center justify-center">
                        <img 
                          src={item.url} 
                          alt={item.nombre} 
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        <button 
                          type="button" 
                          onClick={() => setPlayModeActive(true)}
                          className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity font-bold text-xs gap-1"
                        >
                          <ZoomIn className="w-4 h-4 text-[#0EC4C4]" /> Ampliar Render
                        </button>
                      </div>
                      <div className="p-3 bg-white flex items-center justify-between text-xs border-t border-gray-50">
                        <span className="font-semibold text-gray-800 truncate pr-4">{item.nombre}</span>
                        <span className="text-[10px] font-mono text-gray-400 shrink-0">{item.size}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PLANOS blueprint viewer section */}
            {activeSectionId === 'planos' && (
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-teal-600 tracking-wider">04 • Planimetría y Flujos</span>
                  <h2 className="text-lg font-bold text-gray-950 mt-0.5">Planos Técnicos en PDF</h2>
                  <p className="text-xs text-gray-500">Planos de modulación de sillería y áreas colaborativas autorizados por Ingeniería de Planta.</p>
                </div>

                {planos.map(item => (
                  <div key={item.id} className="border border-gray-100 rounded-xl p-5 bg-gray-50/50 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center text-red-600 font-bold text-lg shadow-3xs">
                        PDF
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-800">{item.nombre}</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">Plano oficial de zonificación • Peso: {item.size}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs py-2 px-4 rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        Ver Documento ↗
                      </a>
                      <a 
                        href={item.url} 
                        download={item.nombre}
                        className="bg-gray-900 hover:bg-black text-[#0EC4C4] font-bold text-xs py-2 px-4 rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" /> Descargar
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* MODELOS3D section */}
            {activeSectionId === 'modelos3d' && (
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-teal-600 tracking-wider">05 • Modelado Tridimensional</span>
                  <h2 className="text-lg font-bold text-gray-950 mt-0.5">Maqueta 3D Interactiva Integrada</h2>
                  <p className="text-xs text-gray-500">Interactúa con el modelado del proyecto Gebesa arrastrando y rotando la cámara.</p>
                </div>

                {modelos3d.length > 0 ? (
                  <div className="border border-gray-150 rounded-2xl overflow-hidden aspect-video relative flex items-center justify-center bg-[#fdfdfd] shadow-sm">
                    {/* Simulated beautiful mesh rendering to match enterprise software aesthetics */}
                    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-70 p-4 flex justify-between select-none">
                      <span className="text-[9px] font-mono text-gray-400">ENGINE: GEB_CAD_V3</span>
                      <span className="text-[9px] font-mono text-emerald-600">STATE: LOADED_WITHOUT_CONSTRAINTS</span>
                    </div>

                    <div className="text-center space-y-3 z-10 p-6">
                      <div className="w-16 h-16 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center font-bold text-2xl mx-auto shadow-inner">
                        🛋️
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-800">{modelos3d[0].nombre}</h4>
                        <p className="text-[10px] text-gray-500">Malla 3D Interactiva • Peso: {modelos3d[0].size}</p>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setPlayModeActive(true)}
                        className="bg-gray-900 hover:bg-black text-[#0EC4C4] border border-[#0EC4C4]/20 font-bold text-[10.5px] py-2 px-4 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1"
                      >
                        🎮 Girar en Vista Fullscreen Play Mode
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-gray-500">Modelo tridimensional no subido.</div>
                )}
              </div>
            )}

            {/* CONTACTO section */}
            {activeSectionId === 'contacto' && (
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] uppercase font-bold text-teal-600 tracking-wider">06 • Atención e Interacción Directa</span>
                  <h2 className="text-lg font-bold text-gray-950 mt-0.5">Soporte y Contacto del Asesor de Marca</h2>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-4">
                    <img 
                      src={state.asesor.fotoUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=128&auto=format&fit=crop'} 
                      alt={state.asesor.nombre} 
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-teal-150"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <span className="text-[9px] uppercase font-bold text-teal-650 bg-teal-50 px-2 py-0.5 rounded">Ejecutivo Premium Asignado</span>
                      <h4 className="text-sm font-bold text-gray-900 mt-1">{state.asesor.nombre}</h4>
                      <p className="text-xs text-gray-500 font-medium">{state.asesor.puesto} • {state.asesor.sucursal}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    <a 
                      href={`https://wa.me/${state.asesor.telefono.replace(/\s+/g, '')}`}
                      target="_blank" 
                      rel="noreferrer"
                      className="text-center bg-[#25D366] hover:bg-emerald-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 fill-white" /> WhatsApp Directo
                    </a>
                    <a 
                      href={`mailto:${state.asesor.email}?subject=Interes%20en%20Propuesta%20Mobiliario`}
                      className="text-center bg-gray-900 hover:bg-black text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Mail className="w-4 h-4" /> Correo
                    </a>
                  </div>
                </div>

                {/* Secure Trust Stamp */}
                <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 flex gap-3 text-xs text-gray-500 leading-normal">
                  <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong>Sello de Especificación Segura de Gebesa:</strong>
                    <p className="text-[11px] text-gray-450 mt-0.5">
                      Todos los componentes, acabados y modulaciones reflejados en esta propuesta se apegan estrictamente a las normativas de fabricación Gebesa, asegurando entregas a tiempo y soporte técnico en campo.
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Sequential narrative bottom navigators */}
          <div className="border-t border-gray-50 pt-5 mt-8 flex items-center justify-between max-w-3xl mx-auto w-full">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              Discurriendo: Paso {(visibleSections.findIndex(s => s.id === activeSectionId) + 1)} de {visibleSections.length}
            </span>

            {activeSectionId !== visibleSections[visibleSections.length - 1].id ? (
              <button
                type="button"
                onClick={handleNextSection}
                className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer transition-colors"
              >
                Siguiente Sección ({visibleSections[visibleSections.findIndex(s => s.id === activeSectionId) + 1].label}) <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setPlayModeActive(true)}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer transition-colors"
              >
                🎉 Iniciar Guided Play Mode desde el principio <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </main>
      </div>

    </div>
  );
}
