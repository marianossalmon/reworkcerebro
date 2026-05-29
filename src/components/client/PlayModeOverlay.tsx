import React, { useState, useEffect, useRef } from 'react';
import { PresentationState } from '../../types/presentation';
import { SectionMetadata } from '../../utils/getSectionsVisible';
import { Play, Pause, ChevronLeft, ChevronRight, X, Phone, Mail, MessageSquare, Landmark, HelpCircle, RotateCcw } from 'lucide-react';
import GlbViewer from './GlbViewer';

interface PlayModeOverlayProps {
  state: PresentationState;
  visibleSections: SectionMetadata[];
  onClose: () => void;
}

export default function PlayModeOverlay({ state, visibleSections, onClose }: PlayModeOverlayProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sliderIndex, setSliderIndex] = useState(0); // For multiple images in gallery
  const [selected3DIndex, setSelected3DIndex] = useState(0); // Selected 3D model index
  const [isLightboxOpen, setIsLightboxOpen] = useState(false); // Render zoom image lightbox modal
  const [lightboxUrl, setLightboxUrl] = useState(''); // Target zoom image url
  const [isGlbLightboxOpen, setIsGlbLightboxOpen] = useState(false); // GLB zoom lightbox modal
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentSection = visibleSections[currentIndex];

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        handleNext();
      }, state.config.autoplaySpeed || 3000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentIndex, visibleSections]);

  const handleNext = () => {
    setCurrentIndex((prev) => {
      if (prev === visibleSections.length - 1) {
        setIsPlaying(false); // Stop autoplay at end
        return prev;
      }
      return prev + 1;
    });
  };

  const handleManualNext = () => {
    setIsPlaying(false);
    handleNext();
  };

  const handleManualPrev = () => {
    setIsPlaying(false);
    setCurrentIndex((prev) => (prev === 0 ? 0 : prev - 1));
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const selectIndex = (idx: number) => {
    setCurrentIndex(idx);
    setIsPlaying(false); // Pause on manual jump
  };

  // Helper filters
  const renders = state.archivos.filter(a => a.categoria === 'renders').sort((a, b) => {
    const isVideoA = a.type?.startsWith('video/') || a.nombre.toLowerCase().endsWith('.mp4');
    const isVideoB = b.type?.startsWith('video/') || b.nombre.toLowerCase().endsWith('.mp4');
    
    if (isVideoA && !isVideoB) return -1;
    if (!isVideoA && isVideoB) return 1;
    return 0;
  });
  const planos = state.archivos.filter(a => a.categoria === 'planos');
  const modelos3d = state.archivos.filter(a => a.categoria === 'modelos3d');

  return (
    <div className="fixed inset-0 z-50 bg-[#0f0f0f] text-white flex flex-col justify-between overflow-hidden font-sans">
      
      {/* Play Mode Header HUD */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-[#0f0f0f]/80 backdrop-blur-md z-12">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-[#0EC4C4]">Gebesa Narrator</h4>
            <p className="text-[10px] text-gray-400 font-mono truncate max-w-sm">{state.proyecto.nombreCliente} • {state.proyecto.nombreProyecto}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Autoplay playback Button */}
          <button 
            type="button" 
            onClick={togglePlay}
            className="w-8 h-8 rounded-full border border-white/10 hover:border-white/20 hover:bg-white/5 flex items-center justify-center text-gray-300 transition-colors cursor-pointer"
            title={isPlaying ? 'Pausar Narración' : 'Reanudar Narración'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white ml-0.5" />}
          </button>

          {/* Reset timeline */}
          <button 
            type="button" 
            onClick={() => { setCurrentIndex(0); setIsPlaying(true); }}
            className="w-8 h-8 rounded-full border border-white/10 hover:border-white/20 hover:bg-white/5 flex items-center justify-center text-gray-300 transition-colors cursor-pointer"
            title="Reiniciar Presentación"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Close HUD */}
          <button 
            type="button" 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            title="Salir de Play Mode"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Slide Carousel Viewport Area */}
      <div className="flex-1 flex items-center justify-center p-4 relative bg-[#0a0a0a]" onClick={() => setIsPlaying(false)}>
        
        {/* Previous Button wrapper */}
        {currentIndex > 0 && (
          <button 
            type="button" 
            onClick={handleManualPrev}
            className="absolute left-4 z-40 w-12 h-12 rounded-full border border-white/5 hover:border-white/10 hover:bg-white/5 flex items-center justify-center text-white cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Next Button wrapper */}
        {currentIndex < visibleSections.length - 1 && (
          <button 
            type="button" 
            onClick={handleManualNext}
            className="absolute right-4 z-40 w-12 h-12 rounded-full border border-white/5 hover:border-white/10 hover:bg-white/5 flex items-center justify-center text-white cursor-pointer transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Render Active Slide */}
        <div className="w-full max-w-2xl mx-auto h-full flex flex-col justify-center select-none overflow-hidden py-4">
          
          {currentSection.id === 'portada' && (
            <div className="space-y-6 text-center">
              {state.proyecto.logoClienteUrl && (
                <div className="w-24 h-24 bg-white rounded-2xl p-3 flex items-center justify-center mx-auto border border-white/10 shadow-lg animate-in fade-in zoom-in duration-500 mb-2">
                  <img 
                    src={state.proyecto.logoClienteUrl} 
                    alt="Logo Cliente" 
                    className="max-w-full max-h-full object-contain" 
                    referrerPolicy="no-referrer" 
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              )}
              <div className="inline-block bg-[#0EC4C4]/15 border border-[#0EC4C4]/30 px-3 py-1 rounded-full text-[10px] font-bold text-[#0EC4C4] tracking-[0.2em] uppercase">
                Propuesta Corporativa Exclusiva
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight text-white px-2">
                {state.proyecto.nombreProyecto || 'Especificación de Espacios'}
              </h1>
              <p className="text-sm text-gray-400 font-medium max-w-lg mx-auto">
                Diseñado exclusivamente para <strong className="text-white font-bold">{state.proyecto.nombreCliente}</strong>
              </p>
              
              <div className="pt-8 border-t border-white/5 max-w-xs mx-auto flex items-center justify-center gap-3">
                <img 
                  src={state.asesor.fotoUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=128&auto=format&fit=crop'} 
                  alt={state.asesor.nombre} 
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-[#0EC4C4]/35"
                  referrerPolicy="no-referrer"
                />
                <div className="text-left">
                  <p className="text-xs font-bold text-white">{state.asesor.nombre}</p>
                  <p className="text-[10px] text-gray-400 font-semibold">{state.asesor.puesto}</p>
                </div>
              </div>
            </div>
          )}

          {currentSection.id === 'descripcion' && (
            <div className="space-y-4 max-w-lg mx-auto text-center">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#0EC4C4]">02 • Concepto Creativo</span>
              <h2 className="text-xl font-bold flex items-center justify-center gap-2">
                <Landmark className="w-5 h-5 text-[#0EC4C4]" /> Resumen de Distribución y Alcance
              </h2>
              <div className="bg-white/3 border border-white/8 p-5 rounded-2xl text-left shadow-2xl relative">
                <p className="text-xs text-gray-350 leading-relaxed font-medium whitespace-pre-wrap">
                  {state.proyecto.descripcion}
                </p>
                <div className="absolute -bottom-4 -right-2 bg-gradient-to-r from-emerald-55 to-[#0EC4C4] text-black text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-lg">
                  Integración Gebesa
                </div>
              </div>
            </div>
          )}

          {currentSection.id === 'cotizacion' && (
            <div className="space-y-4 max-w-lg mx-auto text-center animate-in fade-in duration-300">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#0EC4C4]">03 • Propuesta Económica</span>
              <h2 className="text-xl font-bold flex items-center justify-center gap-1.5 font-sans">
                💰 Inversión Total del Proyecto
              </h2>
              
              <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl text-left">
                <div className="p-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-gray-500">Inversión Estimada</span>
                    <h4 className="text-xl font-black text-[#0EC4C4] font-mono leading-none mt-1">{state.proyecto.montoEstimado || '$0.00 MXN'}</h4>
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/20 uppercase tracking-wide">
                    Precios Especiales
                  </span>
                </div>
                
                <div className="divide-y divide-white/5 max-h-[220px] overflow-y-auto custom-scrollbar">
                  {state.proyecto.cotizacionPartidas && state.proyecto.cotizacionPartidas.length > 0 ? (
                    state.proyecto.cotizacionPartidas.map((area, idx) => (
                      <div key={idx} className="p-3.5 border-b border-white/5">
                        <p className="font-bold text-gray-200 mb-2">{area.area}</p>
                        {area.conceptoItems.map((item, iIdx) => (
                          <div key={iIdx} className="flex justify-between text-xs py-1">
                            <p className="text-gray-400">{item.concepto} ({item.cantidad} pza)</p>
                            <span className="font-bold text-[#0EC4C4]">{item.total}</span>
                          </div>
                      ))}
                      </div>
                    ))
                  ) : (
                    <div className="px-5 py-6 text-center text-xs text-gray-400 font-semibold">
                      Se proyecta un total referenciado de {state.proyecto.montoEstimado || 'Monto por definir'}.
                    </div>
                  )}
                </div>
              </div>
              
              <p className="text-[9px] text-gray-500 italic">Desgloses correspondientes a estimaciones comerciales exclusivas para el cliente.</p>
              {state.proyecto.cotizacionPdfUrl && (
                <button 
                  onClick={() => {
                      const pdfIndex = visibleSections.findIndex(s => s.id === 'cotizacionPdf');
                      if (pdfIndex !== -1) {
                        selectIndex(pdfIndex);
                      }
                  }}
                  className="w-full bg-[#0EC4C4]/10 text-[#0EC4C4] font-bold text-xs py-3 rounded-xl border border-[#0EC4C4]/20 hover:bg-[#0EC4C4]/20 transition-all cursor-pointer"
                >
                  Ver Cotización Formal en PDF
                </button>
              )}
            </div>
          )}

          {currentSection.id === 'cotizacionPdf' && (
            <div className="space-y-4 max-w-lg mx-auto text-center h-full flex flex-col justify-center">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#0EC4C4]">03 • Cotización Formal</span>
              <h2 className="text-xl font-bold font-sans">Archivo PDF de Cotización</h2>
                <div className="border border-white/10 rounded-2xl overflow-hidden bg-zinc-950 aspect-[3/4] shadow-2xl relative w-full flex-1">
                  <iframe 
                    src={state.proyecto.cotizacionPdfUrl} 
                    className="w-full h-full border-0 bg-white" 
                    title="Cotización"
                  />
                </div>
                <a 
                   href={state.proyecto.cotizacionPdfUrl} 
                   target="_blank" 
                   rel="noreferrer" 
                   className="text-[#0EC4C4] font-bold hover:underline py-2"
                >
                   Descargar / Abrir en pestaña nueva ↗
                </a>
            </div>
          )}

          {currentSection.id === 'renders' && (
            <div className="space-y-4 text-center h-full flex flex-col justify-center">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#0EC4C4]">04 • Galería del Proyecto</span>
                <h2 className="text-base font-bold mt-1">Renderizados Fotorrealistas</h2>
              </div>
              
              {renders.length > 0 ? (
                (() => {
                  const activeItem = renders[sliderIndex];
                  const isVideo = activeItem?.nombre.toLowerCase().endsWith('.mp4') || 
                                  activeItem?.nombre.toLowerCase().endsWith('.mov') || 
                                  activeItem?.nombre.toLowerCase().endsWith('.webm') || 
                                  activeItem?.type?.startsWith('video/') || 
                                  activeItem?.url.toLowerCase().includes('video');
                  
                  return (
                    <div className="relative group max-w-lg mx-auto w-full border border-white/8 rounded-2xl overflow-hidden aspect-video bg-black flex items-center justify-center shadow-2xl">
                      {isVideo ? (
                        <>
                          <video 
                            key={activeItem.id}
                            src={activeItem.url} 
                            autoPlay
                            muted
                            playsInline
                            onEnded={() => setSliderIndex(prev => (prev < renders.length - 1 ? prev + 1 : prev))}
                            className="w-full h-full object-contain bg-black"
                            referrerPolicy="no-referrer"
                          />
                          <button 
                            onClick={() => {
                              const video = document.querySelector('video');
                              if (video?.requestFullscreen) video.requestFullscreen();
                            }}
                            className="absolute top-2 left-2 bg-black/70 text-[9px] font-bold text-[#0EC4C4] px-2 py-1 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                          >
                            ⛶ Pantalla Completa
                          </button>
                        </>
                      ) : (
                        <img 
                          src={activeItem.url} 
                          alt={activeItem.nombre} 
                          onClick={() => {
                            setIsLightboxOpen(true);
                            setLightboxUrl(activeItem.url);
                          }}
                          className="w-full h-full object-cover transition-all duration-500 cursor-zoom-in hover:scale-102"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      
                      {renders.length > 1 && (
                        <>
                          <button 
                            type="button" 
                            onClick={() => setSliderIndex(prev => (prev === 0 ? renders.length - 1 : prev - 1))}
                            className="absolute left-2 w-8 h-8 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white cursor-pointer hover:bg-black/80 z-10 text-sm font-bold"
                          >
                            ‹
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setSliderIndex(prev => (prev === renders.length - 1 ? 0 : prev + 1))}
                            className="absolute right-2 w-8 h-8 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white cursor-pointer hover:bg-black/80 z-10 text-sm font-bold"
                          >
                            ›
                          </button>
                        </>
                      )}
                      
                      {!isVideo && (
                        <div className="absolute top-2 right-2 bg-black/70 text-[9px] font-bold text-[#0EC4C4] px-2 py-1 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          🔍 Ver pantalla grande
                        </div>
                      )}
                      
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-left text-[10px] truncate">
                        {activeItem.nombre} {isVideo ? '(Video)' : ''}
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="text-xs text-gray-500">No se encontraron renders de simulación.</div>
              )}
            </div>
          )}

          {currentSection.id === 'planos' && (
            <div className="space-y-4 text-center">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#0EC4C4]">05 • Planimetría</span>
                <h2 className="text-base font-bold mt-1">Plano Arquitectónico Oficial</h2>
              </div>
              
              {planos.length > 0 ? (
                <div className="space-y-3 max-w-lg mx-auto w-full">
                  <div className="border border-white/10 rounded-2xl overflow-hidden bg-zinc-950 aspect-video shadow-2xl relative">
                    <iframe 
                      src={`${planos[0].url}#toolbar=0&navpanes=0`} 
                      className="w-full h-full border-0 bg-zinc-950" 
                      title="Plano de Distribución y Flujos"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-gray-400">
                    <span className="font-mono max-w-[70%] truncate block">{planos[0].nombre}</span>
                    <a 
                      href={planos[0].url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-[#0EC4C4] font-bold hover:underline"
                    >
                      Pantalla completa ↗
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-gray-500">No se encontraron planos de distribución.</div>
              )}
            </div>
          )}

          {currentSection.id === 'modelos3d' && (
            <div className="space-y-4 text-center flex flex-col justify-center h-full">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#0EC4C4]">06 • Espacio Tridimensional</span>
                <h2 className="text-base font-bold mt-1">Modelos 3D Interactivos Integrados</h2>
                <p className="text-[10px] text-gray-400 mt-0.5">Explora las configuraciones disponibles</p>
              </div>

              {modelos3d.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-lg mx-auto w-full">
                  {modelos3d.map((mod, idx) => (
                    <button
                      key={mod.id}
                      onClick={() => {
                        setSelected3DIndex(idx);
                        setIsPlaying(false);
                      }}
                      className={`group relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                        idx === selected3DIndex
                          ? 'border-[#0EC4C4] shadow-[0_0_20px_rgba(14,196,196,0.3)]'
                          : 'border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center flex-col p-2 space-y-1">
                        <span className="text-2xl">📦</span>
                        <span className="text-[9px] font-bold text-white truncate w-full">{mod.nombre}</span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-gray-500">Modelo 3D no incorporado.</div>
              )}
              
              {/* Selected model preview area */}
              <div 
                className="relative border border-white/8 bg-[#111] rounded-2xl overflow-hidden aspect-video max-w-lg mx-auto w-full shadow-2xl flex items-center justify-center cursor-zoom-in group"
                onClick={() => setIsGlbLightboxOpen(true)}
              >
                <GlbViewer url={modelos3d[selected3DIndex].url} />
                <div className="absolute top-2 right-2 bg-black/70 text-[9px] font-bold text-[#0EC4C4] px-2 py-1 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  🔍 Ver pantalla grande
                </div>
              </div>
            </div>
          )}

          {currentSection.id === 'contacto' && (
            <div className="space-y-6 text-center max-w-md mx-auto">
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#0EC4C4]">07 • Próximos pasos</span>
                <h2 className="text-xl font-bold">¿Tienes dudas o deseas autorizar este proyecto?</h2>
                <p className="text-xs text-gray-400">Ponte en contacto directo con tu asesor premium asignado para agendar una cita o pre-autorizar los despieces.</p>
              </div>

              <div className="bg-white/3 border border-white/8 rounded-2xl p-5 shadow-xl flex items-center gap-4 text-left">
                <img 
                  src={state.asesor.fotoUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=128&auto=format&fit=crop'} 
                  alt={state.asesor.nombre} 
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-[#0EC4C4]/20"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <span className="text-[9px] uppercase font-bold text-[#0EC4C4] bg-[#0EC4C4]/15 px-2 py-0.5 rounded">Ejecutivo de Cuenta</span>
                  <h4 className="text-sm font-bold text-white mt-1">{state.asesor.nombre}</h4>
                  <p className="text-[10.5px] text-gray-400">{state.asesor.puesto} • {state.asesor.sucursal}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Whatsapp direct link */}
                <a 
                  href={`https://wa.me/${state.asesor.telefono.replace(/\s+/g, '')}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-[#25D366] hover:bg-emerald-600 font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-1 text-white cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" /> WhatsApp
                </a>

                {/* Direct Mail */}
                <a 
                  href={`mailto:${state.asesor.email}?subject=Cotizacion%20de%20Mobiliario%20Gobesa`} 
                  className="bg-white hover:bg-gray-100 text-black font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Mail className="w-4 h-4" /> Enviar Correo
                </a>

                {/* Call direct */}
                <a 
                  href={`tel:${state.asesor.telefono}`} 
                  className="border border-white/20 hover:bg-white/5 font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-1 text-white cursor-pointer"
                >
                  <Phone className="w-4 h-4" /> Llamar directo
                </a>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Play Mode Footer Navigation Indicators */}
      <div className="px-6 py-5 bg-[#0f0f0f] border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 z-12">
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
          Slide {currentIndex + 1} de {visibleSections.length} • {currentSection.label}
        </span>

        {/* Bullet index position dots */}
        <div className="flex items-center gap-2">
          {visibleSections.map((sect, idx) => (
            <button 
              key={sect.id}
              onClick={() => selectIndex(idx)}
              className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all cursor-pointer hover:scale-110 ${
                idx === currentIndex 
                  ? 'bg-[#0EC4C4] ring-2 ring-[#0EC4C4]/20 scale-105' 
                  : 'bg-white/10 hover:bg-white/20'
              }`}
              title={sect.label}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${idx === currentIndex ? 'bg-black' : 'bg-transparent'}`} />
            </button>
          ))}
        </div>

        <p className="text-[9.5px] text-gray-400 font-medium font-mono">Barra espaciadora: Auto-Play</p>
      </div>

      {/* Full Resolution Image Lightbox Zoom Modal Component */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-55 bg-black/95 flex items-center justify-center p-4" onClick={() => setIsLightboxOpen(false)}>
          <button 
            type="button" 
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 w-11 h-11 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center text-xl font-bold cursor-pointer transition-all hover:scale-105 z-55"
            title="Cerrar Zoom"
          >
            ×
          </button>
          <div 
            className="max-w-[90vw] max-h-[85vh] overflow-hidden rounded-xl border border-white/10 shadow-2xl relative select-none flex items-center justify-center bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={lightboxUrl} 
              alt="Visualización Ampliada" 
              className="max-w-full max-h-full object-contain cursor-zoom-out"
              onClick={() => setIsLightboxOpen(false)}
            />
          </div>
        </div>
      )}

      {/* GLB Lightbox Zoom Modal Component */}
      {isGlbLightboxOpen && (
        <div className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4">
          <button 
            type="button" 
            onClick={() => setIsGlbLightboxOpen(false)}
            className="absolute top-6 right-6 w-11 h-11 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center text-xl font-bold cursor-pointer transition-all hover:scale-105 z-[65]"
          >
            ×
          </button>
          <div 
            className="w-full h-full p-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <GlbViewer url={modelos3d[selected3DIndex].url} />
          </div>
        </div>
      )}

    </div>
  );
}
