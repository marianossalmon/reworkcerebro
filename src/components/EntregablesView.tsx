import React, { useState, useEffect } from 'react';
import { Project, DeliveryEvent } from '../types';
import { ArrowLeft, Clock, Info, CheckCircle2, CheckCircle, UploadCloud, FileText, ChevronRight } from 'lucide-react';

interface EntregablesViewProps {
  projects: Project[];
  onBack: () => void;
  onUpdateProject: (updated: Project) => void;
  initialSelectedProjectId?: string;
}

export function EntregablesView({ projects, onBack, onUpdateProject, initialSelectedProjectId }: EntregablesViewProps) {
  const activeProjects = projects.filter(p => !p.isInInbox);
  
  // Choose project in state
  const [selectedId, setSelectedId] = useState<string>(
    initialSelectedProjectId || activeProjects[0]?.id || ''
  );

  const selectedProject = activeProjects.find(p => p.id === selectedId) || activeProjects[0];

  // Checklist states
  const [delivPlanos, setDelivPlanos] = useState(true);
  const [delivRenders, setDelivRenders] = useState(false);
  const [delivVirtual, setDelivVirtual] = useState(false);
  const [delivEsps, setDelivEsps] = useState(false);
  const [deliveryNote, setDeliveryNote] = useState('');
  const [deliverySuccess, setDeliverySuccess] = useState(false);
  
  // File drag & drop simulator states
  const [simulatedFiles, setSimulatedFiles] = useState<{ name: string; size: string }[]>([]);
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'warn' } | null>(null);

  // Sync state if project changes
  useEffect(() => {
    if (selectedProject) {
      setDelivPlanos(true);
      setDelivRenders(!!selectedProject.requiresRenders);
      setDelivVirtual(!!selectedProject.requiresVirtualTour);
      setDelivEsps(false);
      setDeliveryNote('');
      setDeliverySuccess(false);
      setSimulatedFiles([]);
    }
  }, [selectedId, selectedProject?.id]);

  const triggerToast = (text: string, type: 'success' | 'warn' = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) {
      triggerToast('Por favor selecciona un proyecto primero.', 'warn');
      return;
    }

    const deliverablesList: string[] = [];
    if (delivPlanos) deliverablesList.push("Planos técnicos DWG + PDF");
    if (delivRenders && selectedProject.requiresRenders) deliverablesList.push(`Renders 3D (${selectedProject.renderCount || 3} vistas)`);
    if (delivVirtual && selectedProject.requiresVirtualTour) deliverablesList.push("Recorrido Virtual 360°");
    if (delivEsps) deliverablesList.push("Lista de especificaciones");

    if (deliverablesList.length === 0) {
      triggerToast("Selecciona al menos un entregable de la lista.", "warn");
      return;
    }

    // Create a delivery history event
    const newDeliveryEvent: DeliveryEvent = {
      id: `deliv-view-${Date.now()}`,
      date: 'Hoy',
      author: 'Karen Tovar',
      description: deliveryNote || 'Entrega técnica consolidada mediante el Panel de Envíos Globales.',
      items: deliverablesList,
      status: 'delivered'
    };

    // Update Project timeline
    const updatedTimeline = selectedProject.timeline.map(phase => {
      if (phase.status === 'active') {
        return { ...phase, status: 'done' as const, date: 'Hoy', metaMessage: '✓ Entregado mediante panel Envíos' };
      }
      return phase;
    });

    // Invoke update project callback
    onUpdateProject({
      ...selectedProject,
      status: 'Visto Bueno',
      deliveryHistory: [newDeliveryEvent, ...(selectedProject.deliveryHistory || [])],
      timeline: updatedTimeline
    });

    setDeliverySuccess(true);
    triggerToast("¡Módulos de propuesta publicados! Asesor comercial notificado.", "success");
  };

  const handleSimulatedDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const mockFileName = `plano-area-${Math.floor(Math.random()*200+100)}.dwg`;
    setSimulatedFiles(prev => [...prev, { name: mockFileName, size: '8.4 MB' }]);
    triggerToast(`Archivo "${mockFileName}" listo para el paquete de entrega.`);
  };

  return (
    <div className="flex-1 flex flex-col bg-bg p-8 overflow-y-auto custom-scrollbar animate-in fade-in duration-300">
      {/* Toast Feedback */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded shadow-2xl border transition-all animate-bounce flex items-center gap-2 ${
          toast.type === 'success' ? 'bg-[#121c17] border-emerald-500/20 text-emerald-400' : 'bg-[#241717] border-rose-500/20 text-rose-400'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <span>⚠️</span>}
          <span className="text-xs font-semibold">{toast.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-border/60">
        <div>
          <button 
            id="entregables-back-btn"
            onClick={onBack} 
            className="flex items-center gap-1 text-text-dim hover:text-text-main text-xs uppercase font-extrabold tracking-wider mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← Mis Proyectos</span>
          </button>
          <h2 className="text-3xl font-serif text-text-main tracking-tight leading-tight">Consola de Envíos y Entregables</h2>
          <p className="text-xs text-text-muted mt-1 font-sans">Compila entregables técnicos, adjunta planos de planta y notifica firmas de autorización.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Layout izquierdo: Selector + Formulario */}
        <div className="bg-bg2/40 border border-border/80 rounded-xl p-6 flex flex-col gap-4 text-xs font-normal">
          {/* Selector de Proyecto */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-bold text-text-dim tracking-wider font-mono">1. Seleccionar Proyecto Activo</label>
            <select 
              id="entregas-project-select"
              value={selectedId}
              onChange={e => setSelectedId(e.target.value)}
              className="w-full bg-[#1c212b] border border-border p-3 text-xs rounded-xl text-text-main font-semibold focus:outline-none focus:border-teal-400 transition-colors cursor-pointer"
            >
              <option value="" disabled>Selecciona un folio activo...</option>
              {activeProjects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.code} — {p.name} ({p.deliveryDeadline})
                </option>
              ))}
            </select>
          </div>

          {selectedProject ? (
            <div className="space-y-4">
              {/* Divider */}
              <div className="border-t border-border/30 my-2"></div>

              {/* Checklist */}
              <div>
                <label className="text-[10px] uppercase font-bold text-text-dim tracking-wider font-mono mb-2 block">2. ¿Qué tipos de material entregas?</label>
                <div className="space-y-2 text-xs">
                  <label className="flex items-start gap-3 bg-bg/85 cursor-pointer p-3 border border-border hover:border-border2 transition-all rounded-lg select-none">
                    <input 
                      type="checkbox" 
                      checked={delivPlanos} 
                      disabled={deliverySuccess}
                      onChange={e => setDelivPlanos(e.target.checked)}
                      className="mt-0.5 accent-teal-400 w-3.5 h-3.5"
                    />
                    <div>
                      <div className="font-bold text-text-main">📐 Planos técnicos DWG + PDF</div>
                      <div className="text-[10px] text-text-dim mt-0.5">Trazos de plantas de áreas para cotización de m².</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 bg-bg/85 cursor-pointer p-3 border border-border hover:border-border2 transition-all rounded-lg select-none">
                    <input 
                      type="checkbox" 
                      checked={delivRenders} 
                      disabled={!selectedProject.requiresRenders || deliverySuccess}
                      onChange={e => setDelivRenders(e.target.checked)}
                      className="mt-0.5 accent-teal-400 w-3.5 h-3.5"
                    />
                    <div>
                      <div className="font-bold text-text-main">🖼 Renders 3D ({selectedProject.renderCount || 3} vistas)</div>
                      <div className="text-[10px] text-text-dim mt-0.5">Fotorrealismo. {selectedProject.requiresRenders ? '✓ Requerido' : 'No solicitado en brief.'}</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 bg-bg/85 cursor-pointer p-3 border border-border hover:border-border2 transition-all rounded-lg select-none">
                    <input 
                      type="checkbox" 
                      checked={delivVirtual} 
                      disabled={!selectedProject.requiresVirtualTour || deliverySuccess}
                      onChange={e => setDelivVirtual(e.target.checked)}
                      className="mt-0.5 accent-teal-400 w-3.5 h-3.5"
                    />
                    <div>
                      <div className="font-bold text-text-main">🥽 Recorrido Virtual 360°</div>
                      <div className="text-[10px] text-text-dim mt-0.5">Recorrido inmersivo. {selectedProject.requiresVirtualTour ? '✓ Requerido' : 'No solicitado en brief.'}</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 bg-bg/85 cursor-pointer p-3 border border-border hover:border-border2 transition-all rounded-lg select-none">
                    <input 
                      type="checkbox" 
                      checked={delivEsps} 
                      disabled={deliverySuccess}
                      onChange={e => setDelivEsps(e.target.checked)}
                      className="mt-0.5 accent-teal-400 w-3.5 h-3.5"
                    />
                    <div>
                      <div className="font-bold text-text-main">📋 Lista de especificaciones</div>
                      <div className="text-[10px] text-text-dim mt-0.5">Estructura de códigos Gebesa oficiales asociados.</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Drag Zone */}
              <div>
                <label className="text-[10px] uppercase font-bold text-text-dim tracking-wider font-mono mb-1 block">3. Bóveda Drop Zone</label>
                <div 
                  onDragOver={e => e.preventDefault()}
                  onDrop={handleSimulatedDrop}
                  onClick={() => {
                    const mockFileName = `plano-distribucion-${Math.floor(Math.random()*150+100)}.dwg`;
                    setSimulatedFiles(prev => [...prev, { name: mockFileName, size: '6.2 MB' }]);
                    triggerToast(`Paquete "${mockFileName}" vinculado.`);
                  }}
                  className="bg-bg/90 border-2 border-dashed border-border hover:border-teal-500/50 p-6 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all gap-1.5"
                >
                  <UploadCloud className="w-7 h-7 text-text-dim" />
                  <span className="font-semibold text-text-main">Arrastra archivos planos aquí o haz clic</span>
                  <span className="text-[10px] text-text-faint">Formatos admitidos: .DWG, .PDF, .SKP. Máx 50MB</span>
                </div>

                {simulatedFiles.length > 0 && (
                  <div className="mt-2 space-y-1 bg-[#12141c] p-2 rounded border border-border">
                    <span className="text-[9px] font-mono text-text-dim block uppercase">Archivos listos para enviar:</span>
                    {simulatedFiles.map((f, i) => (
                      <div key={i} className="flex justify-between text-xs font-mono text-emerald-400">
                        <span>📎 {f.name}</span>
                        <span>{f.size}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Note */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-text-dim tracking-wider font-mono">4. Nota para el Asesor</label>
                <textarea 
                  placeholder="Escribe comentarios técnicos de apoyo / alternativas (ej: Líneas Nova)."
                  value={deliveryNote}
                  disabled={deliverySuccess}
                  onChange={e => setDeliveryNote(e.target.value)}
                  className="w-full bg-[#1c212b] border border-border p-3 text-xs rounded-xl text-text-main focus:outline-none focus:border-teal-400 transition-colors h-[75px]"
                />
              </div>

              {/* Error/Success display or Confirmation buttons */}
              {deliverySuccess ? (
                <div className="bg-[#121c17] text-emerald-400 border border-emerald-500/20 p-4 rounded-xl text-xs flex gap-3 shadow-lg shadow-emerald-500/5 items-start">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
                  <div>
                    <strong className="block uppercase font-bold tracking-wide text-xs">PROPUESTA DE EXPEDIENTE PUBLICADA</strong>
                    <p className="mt-1 leading-normal text-[#beebcd] font-sans text-xs">
                      Se ha modificado el folio comercial a "Visto Bueno". Los asesores de ventas han sido alertados y disponen ya de los accesos a la propuesta técnica.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2 justify-start pt-2">
                  <button 
                    id="btn-global-confirm-delivery"
                    onClick={handlePublish}
                    className="bg-emerald-500 hover:bg-emerald-400 text-bg text-black font-extrabold uppercase text-[10px] tracking-widest py-3 px-5 rounded-md transition-all shadow-lg shadow-emerald-500/10 flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" /> Publicar y notificar
                  </button>
                  <button 
                    onClick={() => triggerToast("Enlace de presentación de renders generada para asesor.", "success")}
                    className="bg-transparent border border-border2 hover:bg-white/5 text-text-main text-[10px] uppercase font-bold py-3 px-4 rounded-md transition-all"
                  >
                    Generar link presentación
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-text-dim">Ningún proyecto activo para entregar.</div>
          )}
        </div>

        {/* Layout derecho: Callouts y historial */}
        <div className="flex flex-col gap-4">
          {/* Gold Warning / Explanatory box */}
          <div className="bg-[#1c1610] border border-amber-500/20 text-[#ebdcb5] p-5 rounded-xl text-xs flex gap-3">
            <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <strong className="block uppercase font-bold text-amber-400">¿Qué pasa cuando publicas?</strong>
              <p className="mt-1 leading-relaxed opacity-95 text-[11px] font-sans">
                La publicación en consola consolida el paquete técnico para la toma de decisión comercial del cliente final de Gebesa:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2 font-mono text-[9.5px] opacity-80 leading-relaxed">
                <li>Se actualiza la barra de fases a estatus "Visto Bueno".</li>
                <li>Se disparan los correos de integración de archivos y cotizaciones.</li>
                <li>Se habilitan los accesos para visores WebGL interactivos de renders de forma automatizada por el CEREBRO.</li>
              </ul>
            </div>
          </div>

          {/* Historial del proyecto seleccionado */}
          <div className="bg-bg2/40 border border-border rounded-xl p-5 flex-1 flex flex-col min-h-[180px]">
            <h4 className="text-xs uppercase tracking-widest text-[#d39c3e] font-bold mb-3 font-mono">
              Historial de Entregas — {selectedProject?.code || 'Folio'}
            </h4>
            
            {selectedProject && selectedProject.deliveryHistory && selectedProject.deliveryHistory.length > 0 ? (
              <div className="space-y-4 overflow-y-auto pr-1 flex-1 custom-scrollbar">
                {selectedProject.deliveryHistory.map(del => (
                  <div key={del.id} className="border-b border-border/50 pb-3 last:border-b-0 last:pb-0 text-xs text-text-main">
                    <div className="flex justify-between text-[10px] font-mono text-text-dim mb-1">
                      <strong>👤 Karen Tovar</strong>
                      <span>{del.date}</span>
                    </div>
                    <p className="text-text-muted italic leading-relaxed font-serif text-xs mb-2">
                      "{del.description}"
                    </p>
                    <div className="flex gap-1.5 flex-wrap">
                      {del.items.map((it, idx) => (
                        <span key={idx} className="bg-emerald-500/10 text-emerald-400 text-[9px] font-mono border border-emerald-500/5 px-2 py-0.5 rounded">
                          ✓ {it}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-text-dim text-xs py-8 my-auto font-sans font-normal">
                Sin registros de entregas previas para {selectedProject?.code}.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
