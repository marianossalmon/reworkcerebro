import React, { useState, useRef, useEffect } from 'react';
import { Project, ProjectFile, Request, Comment, DeliveryEvent } from '../types';
import { users } from '../data';
import { 
  Check, Info, Paperclip, Mail, MessageSquare, Plus, File, Download, Trash2, 
  Send, FileText, CheckCircle2, AlertTriangle, ExternalLink, Calendar, 
  ChevronRight, CheckCircle, Award, Target, Folder, Upload, Sliders
} from 'lucide-react';

interface ProjectDetailProps {
  project: Project;
  onUpdateProject?: (updated: Project) => void;
}

export function ProjectDetail({ project, onUpdateProject }: ProjectDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'brief' | 'fases' | 'solicitudes' | 'boveda' | 'entregar' | 'chat'>('overview');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'warn' } | null>(null);

  // States for Requests replying
  const [replyingRequestId, setReplyingRequestId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [fichaAttached, setFichaAttached] = useState(false);

  // States for Deliveries Tab
  const [delivPlanos, setDelivPlanos] = useState(true);
  const [delivRenders, setDelivRenders] = useState(project.requiresRenders);
  const [delivVirtual, setDelivVirtual] = useState(project.requiresVirtualTour);
  const [delivEsps, setDelivEsps] = useState(false);
  const [deliveryNote, setDeliveryNote] = useState('');
  const [deliverySuccess, setDeliverySuccess] = useState(false);

  // States for Chat
  const [commentText, setCommentText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // File upload input
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerToast = (message: string, type: 'success' | 'warn' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (activeTab === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [project.comments, activeTab]);

  // Reset delivery success banner when project changes
  useEffect(() => {
    setDeliverySuccess(false);
    setDeliveryNote('');
    setDelivPlanos(true);
    setDelivRenders(project.requiresRenders);
    setDelivVirtual(project.requiresVirtualTour);
    setDelivEsps(false);
    setReplyingRequestId(null);
  }, [project.id]);

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  // File Handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const name = file.name;
    const size = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    const ext = name.split('.').pop()?.toUpperCase() || 'DWG';
    const type: any = ['DWG', 'SKP', 'PDF', 'IMG'].includes(ext) ? ext : 'PDF';

    const newFile: ProjectFile = {
      id: `f-${Date.now()}`,
      name,
      type,
      size,
      date: 'Hoy',
      author: 'Karen Tovar'
    };

    onUpdateProject?.({
      ...project,
      files: [newFile, ...project.files]
    });
    triggerToast(`Archivo "${name}" cargado a la Bóveda con éxito.`, 'success');
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const size = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    const ext = file.name.split('.').pop()?.toUpperCase() || 'DWG';
    const type: any = ['DWG', 'SKP', 'PDF', 'IMG'].includes(ext) ? ext : 'PDF';

    const newFile: ProjectFile = {
      id: `f-${Date.now()}`,
      name: file.name,
      type,
      size,
      date: 'Hoy',
      author: 'Karen Tovar'
    };

    onUpdateProject?.({
      ...project,
      files: [newFile, ...project.files]
    });
    triggerToast(`Archivo "${file.name}" cargado mediante arrastre.`, 'success');
  };

  const handleSendComment = () => {
    if (!commentText.trim()) return;
    const newComment: Comment = {
      id: `comm-${Date.now()}`,
      authorId: 'kt',
      authorName: 'Karen Tovar',
      date: 'ahora mismo',
      text: commentText.trim()
    };
    onUpdateProject?.({
      ...project,
      comments: [...project.comments, newComment]
    });
    setCommentText('');
    triggerToast('Comentario enviado al chat técnico.', 'success');
  };

  // Header helpers
  const pendingRequests = project.requests.filter(r => r.status === 'pending');
  const urgentRequest = pendingRequests.find(r => r.type === 'URGENTE');

  return (
    <div className="flex-1 flex flex-col bg-bg overflow-y-auto custom-scrollbar relative">
      {/* Toast notifications */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3.5 rounded shadow-2xl border transition-all animate-bounce flex items-center gap-2.5 text-xs font-semibold ${
          toast.type === 'success' 
            ? 'bg-[#121c17] text-teal-400 border-teal-500/30' 
            : 'bg-[#241717] text-rose-400 border-rose-500/30'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-teal-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
          <div>{toast.message}</div>
        </div>
      )}

      {/* TABS NAVBAR */}
      <div className="flex border-b border-border bg-[#0f1118] px-6 py-1 gap-1 sticky top-0 z-20 overflow-x-auto shrink-0 custom-scrollbar">
        <button onClick={() => setActiveTab('overview')} className={`text-xs px-3.5 py-3 flex items-center gap-1.5 font-semibold border-b-2 transition-all shrink-0 ${activeTab === 'overview' ? 'text-teal-400 border-teal-400 font-bold bg-white/5' : 'text-text-muted border-transparent hover:text-text-main'}`}>
          <Info className="w-3.5 h-3.5 text-teal-400" /> Resumen
        </button>
        <button onClick={() => setActiveTab('brief')} className={`text-xs px-3.5 py-3 flex items-center gap-1.5 font-semibold border-b-2 transition-all shrink-0 ${activeTab === 'brief' ? 'text-teal-400 border-teal-400 font-bold bg-white/5' : 'text-text-muted border-transparent hover:text-text-main'}`}>
          <FileText className="w-3.5 h-3.5 text-[#569ff4]" /> 📋 Brief completo
        </button>
        <button onClick={() => setActiveTab('fases')} className={`text-xs px-3.5 py-3 flex items-center gap-1.5 font-semibold border-b-2 transition-all shrink-0 ${activeTab === 'fases' ? 'text-teal-400 border-teal-400 font-bold bg-white/5' : 'text-text-muted border-transparent hover:text-text-main'}`}>
          <Sliders className="w-3.5 h-3.5 text-[#cf8ff9]" /> 📌 Fases
        </button>
        <button onClick={() => setActiveTab('solicitudes')} className={`text-xs px-3.5 py-3 flex items-center gap-1.5 font-semibold border-b-2 transition-all shrink-0 ${activeTab === 'solicitudes' ? 'text-teal-400 border-teal-400 font-bold bg-white/5' : 'text-text-muted border-transparent hover:text-text-main'}`}>
          <Mail className="w-3.5 h-3.5 text-rose-400" /> 📨 Solicitudes 
          {pendingRequests.length > 0 && (
            <span className="bg-rose-500 text-bg text-[9px] font-extrabold px-1.5 py-[0.5px] rounded-full text-white">
              {pendingRequests.length}
            </span>
          )}
        </button>
        <button onClick={() => setActiveTab('boveda')} className={`text-xs px-3.5 py-3 flex items-center gap-1.5 font-semibold border-b-2 transition-all shrink-0 ${activeTab === 'boveda' ? 'text-teal-400 border-teal-400 font-bold bg-white/5' : 'text-text-muted border-transparent hover:text-text-main'}`}>
          <Paperclip className="w-3.5 h-3.5 text-amber-400" /> 📁 Bóveda 
          <span className="bg-bg4 border border-border2 text-text-dim text-[9px] px-1.5 rounded-full">{project.files.length}</span>
        </button>
        <button onClick={() => setActiveTab('entregar')} className={`text-xs px-3.5 py-3 flex items-center gap-1.5 font-semibold border-b-2 transition-all shrink-0 ${activeTab === 'entregar' ? 'text-teal-400 border-teal-400 font-bold bg-white/5' : 'text-text-muted border-transparent hover:text-text-main'}`}>
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> 📦 Entregar
        </button>
        <button onClick={() => setActiveTab('chat')} className={`text-xs px-3.5 py-3 flex items-center gap-1.5 font-semibold border-b-2 transition-all shrink-0 ${activeTab === 'chat' ? 'text-teal-400 border-teal-400 font-bold bg-white/5' : 'text-text-muted border-transparent hover:text-text-main'}`}>
          <MessageSquare className="w-3.5 h-3.5 text-[#5ea4df]" /> 💬 Chat
        </button>
      </div>

      {/* PARENT CONTAINER WITH TAB BODY RENDERING */}
      <div className="p-8 flex flex-col gap-6 flex-1">
        
        {/* =============== TAB: OVERVIEW / RESUMEN =============== */}
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-5 animate-in fade-in duration-300">
            {/* Extended Gorgeous Header */}
            <div className="bg-gradient-to-r from-bg2 to-bg border border-border p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider block mb-1">
                  CEREBRO Mapeo Comercial · {project.code}
                </span>
                <h3 className="text-3xl font-serif text-text-main tracking-tight leading-tight mb-2">
                  {project.name}
                </h3>
                <p className="text-xs text-text-muted">
                  Cliente: <strong className="text-text-main">{project.client}</strong>
                </p>
              </div>

              <div className="flex gap-2 flex-wrap shrink-0">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-bg4 text-text-main uppercase tracking-wider border border-border">
                  {project.status}
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded border tracking-wider ${
                  project.magnitude === 'G' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : project.magnitude === 'M' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-teal-500/10 text-teal-400 border-teal-500/20'
                }`}>
                  {project.magnitude === 'G' ? '3 PTS · GRANDE' : project.magnitude === 'M' ? '2 PTS · MEDIANO' : '1 PT · CHICO'}
                </span>
                <span className="text-[10px] font-mono font-bold text-amber-400 px-2.5 py-1 rounded bg-amber-500/5 border border-amber-500/10">
                  {project.budget}
                </span>
              </div>
            </div>

            {/* Urgency Alert Callout */}
            {urgentRequest ? (
              <div className="bg-[#241717] border border-rose-500/25 rounded-xl p-4 flex gap-3 text-rose-400">
                <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
                <div>
                  <div className="font-bold text-xs uppercase tracking-wider">⚠️ Solicitud Urgente de Modificación</div>
                  <p className="text-xs mt-1 leading-relaxed text-[#f4c8c8]">
                    <strong>{urgentRequest.title}</strong>: {urgentRequest.description} (De: {urgentRequest.author})
                  </p>
                </div>
              </div>
            ) : pendingRequests.length > 0 ? (
              <div className="bg-[#221c12] border border-amber-500/20 rounded-xl p-4 flex gap-3 text-amber-400">
                <Info className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
                <div>
                  <div className="font-bold text-xs uppercase tracking-wider">⚠️ Solicitud Técnica Abierta</div>
                  <p className="text-xs mt-1 leading-relaxed text-[#ebdfc1]">
                    El asesor comercial solicita cambios o tiene dudas técnicas pendientes. Responde en la pestaña de solicitudes.
                  </p>
                </div>
              </div>
            ) : null}

            {/* 3 Column Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-bg2 border border-border rounded-xl p-4 flex flex-col gap-1">
                <span className="text-[9px] uppercase font-bold tracking-widest text-text-dim">Asesor</span>
                <span className="text-xs font-semibold text-text-main">{users[project.advisorId]?.name || project.advisorId}</span>
              </div>
              <div className="bg-bg2 border border-border rounded-xl p-4 flex flex-col gap-1">
                <span className="text-[9px] uppercase font-bold tracking-widest text-text-dim">Presupuesto Comercial</span>
                <span className="text-xs font-semibold text-text-main">{project.budget}</span>
              </div>
              <div className="bg-bg2 border border-border rounded-xl p-4 flex flex-col gap-1">
                <span className="text-[9px] uppercase font-bold tracking-widest text-text-dim">Área en Metros m²</span>
                <span className="text-xs font-semibold text-text-main">{project.sqm || "45 m²"}</span>
              </div>
              <div className="bg-bg2 border border-border rounded-xl p-4 flex flex-col gap-1">
                <span className="text-[9px] uppercase font-bold tracking-widest text-text-dim">Plazo de entrega</span>
                <span className="text-xs font-semibold text-text-main">{project.deliveryDeadline}</span>
              </div>
              <div className="bg-bg2 border border-border rounded-xl p-4 flex flex-col gap-1">
                <span className="text-[9px] uppercase font-bold tracking-widest text-text-dim">Fecha Vencimiento</span>
                <span className="text-xs font-semibold text-text-main">{project.deliveryDeadline === 'Hoy' ? 'Entrega HOY' : project.deliveryDeadline}</span>
              </div>
              <div className="bg-bg2 border border-border rounded-xl p-4 flex flex-col gap-1">
                <span className="text-[9px] uppercase font-bold tracking-widest text-text-dim">Entregables Requeridos</span>
                <span className="text-xs font-semibold text-text-main flex flex-wrap gap-1.5 mt-0.5">
                  <span className="bg-bg4 px-1.5 py-0.5 rounded text-[9.5px]">📐 Planos CAD</span>
                  {project.requiresRenders && (
                    <span className="bg-[#482a5c]/25 border border-purple-500/10 text-purple-300 px-1.5 py-0.5 rounded text-[9.5px]">
                      🖼 {project.renderCount || 3} Renders
                    </span>
                  )}
                  {project.requiresVirtualTour && (
                    <span className="bg-[#193a3a] text-[#5cd6d6] px-1.5 py-0.5 rounded text-[9.5px]">
                      🥽 Recorrido 360°
                    </span>
                  )}
                </span>
              </div>
            </div>

            {/* Premium Buttons */}
            <div className="flex gap-3 justify-start mt-2">
              <button 
                id="btn-overview-pres"
                onClick={() => triggerToast("¡Enlace dinámico de presentación generado y copiado al portapapeles CEREBRO!", "success")}
                className="bg-transparent hover:bg-white/5 border border-border2 text-[#99b5ff] hover:text-white font-extrabold uppercase tracking-widest text-[10px] px-5 py-3 rounded-md transition-colors flex items-center gap-2"
              >
                <Target className="w-3.5 h-3.5 text-[#5487ff]" />
                <span>🎯 Presentación</span>
              </button>
              <button 
                id="btn-overview-deliver"
                onClick={() => setActiveTab('entregar')}
                className="bg-teal-500 hover:bg-teal-400 text-bg text-black font-extrabold uppercase tracking-widest text-[10px] px-6 py-3 rounded-md transition-colors flex items-center gap-2 shadow-lg shadow-teal-500/10"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>📦 Entregar</span>
              </button>
            </div>
          </div>
        )}

        {/* =============== TAB: BRIEF COMPLETO =============== */}
        {activeTab === 'brief' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            {/* Seccion Cliente */}
            <div className="bg-bg2/40 border border-border rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-teal-400 font-bold text-xs uppercase tracking-wider">Sección Cliente</span>
                <span className="h-[1px] bg-border flex-1"></span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-text-muted block text-[10px] mb-0.5 uppercase tracking-wide">Nombre</span>
                  <strong className="text-text-main">{project.client}</strong>
                </div>
                <div>
                  <span className="text-text-muted block text-[10px] mb-0.5 uppercase tracking-wide">Tipo de Proceso</span>
                  <strong className="text-text-main">Venta Directa B2B</strong>
                </div>
                <div>
                  <span className="text-text-muted block text-[10px] mb-0.5 uppercase tracking-wide">Asesor Comercial</span>
                  <strong className="text-text-main">{users[project.advisorId]?.name || project.advisorId}</strong>
                </div>
                <div>
                  <span className="text-text-muted block text-[10px] mb-0.5 uppercase tracking-wide">Unidad de Negocio</span>
                  <strong className="text-text-main">{users[project.advisorId]?.location || "CDMX"}</strong>
                </div>
              </div>
            </div>

            {/* Seccion Espacio */}
            <div className="bg-bg2/40 border border-border rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">Sección Espacio</span>
                <span className="h-[1px] bg-border flex-1"></span>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-text-muted block text-[10px] mb-0.5 uppercase tracking-wide">Tipo de Asset</span>
                  <strong className="text-text-main">Sala ejecutiva / Oficinas</strong>
                </div>
                <div>
                  <span className="text-text-muted block text-[10px] mb-0.5 uppercase tracking-wide">Área total en m²</span>
                  <strong className="text-text-main">{project.sqm}</strong>
                </div>
                <div>
                  <span className="text-text-muted block text-[10px] mb-0.5 uppercase tracking-wide">Densidad de Clientes</span>
                  <strong className="text-text-main">Uso rudo (12-30 personas)</strong>
                </div>
                <div>
                  <span className="text-text-muted block text-[10px] mb-0.5 uppercase tracking-wide">Condición de obra</span>
                  <strong className="text-text-main">Acondicionado / Obra Gris</strong>
                </div>
                <div className="col-span-2">
                  <span className="text-text-muted block text-[10px] mb-0.5 uppercase tracking-wide">Estilo visual acordado</span>
                  <strong className="text-text-main">{project.style}</strong>
                </div>
                <div className="col-span-2">
                  <span className="text-text-muted block text-[10px] mb-0.5 uppercase tracking-wide">Líneas Preferidas Gebesa</span>
                  <strong className="text-text-main">{project.lines}</strong>
                </div>
              </div>
            </div>

            {/* Seccion Entregables */}
            <div className="bg-bg2/40 border border-border rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[#bf8cfb] font-bold text-xs uppercase tracking-wider">Sección Entregables</span>
                <span className="h-[1px] bg-border flex-1"></span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-text-muted block text-[10px] mb-0.5 uppercase tracking-wide">Soporte renders 3D</span>
                  <strong className="text-text-main">{project.requiresRenders ? `Sí (${project.renderCount || 3} vistas)` : 'No'}</strong>
                </div>
                <div>
                  <span className="text-text-muted block text-[10px] mb-0.5 uppercase tracking-wide">Recorrido Virtual 360°</span>
                  <strong className="text-text-main">{project.requiresVirtualTour ? 'Sí (Tope 7d)' : 'No'}</strong>
                </div>
                <div>
                  <span className="text-text-muted block text-[10px] mb-0.5 uppercase tracking-wide">Asesoría de diseño</span>
                  <strong className="text-text-main">Sí (Estudio ergonómico incluido)</strong>
                </div>
              </div>
            </div>

            {/* Comentarios del Asesor */}
            <div className="bg-bg3 border border-border rounded-xl p-4 text-xs text-text-main italic font-serif leading-relaxed">
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-text-dim block mb-1 not-italic">
                Comentarios Originales del Asesor para Diseño Técnico:
              </span>
              "El cliente requiere maximizar la iluminación natural del ala norte de oficinas. Prefieren amueblado con escritorios lineales de canalización compartida. Las tapicerías deben combinar bases oscuras (grafito) con detalles vibrantes según la guía corporativa de la marca. Mesa principal con caja de conectividad oculta."
            </div>

            {/* Checklist of files received */}
            <div className="border-t border-border pt-5">
              <h4 className="text-xs font-bold text-text-main uppercase tracking-wider mb-3">Checklist de Calidad y Expediente Recibido</h4>
              <div className="space-y-2">
                {/* 1 */}
                <div className="flex items-center justify-between p-3 bg-[#111915] border border-emerald-500/10 text-emerald-400 rounded-lg text-xs leading-none">
                  <div className="flex items-center gap-2">
                    <span>✅</span>
                    <span><strong>Brief de ventas</strong> — Formulario de calidad capturado (100%)</span>
                  </div>
                  <span className="text-[9px] font-mono tracking-widest opacity-80">completo</span>
                </div>

                {/* 2 */}
                <div className="flex items-center justify-between p-3 bg-[#111915] border border-emerald-500/10 text-emerald-400 rounded-lg text-xs leading-none">
                  <div className="flex items-center gap-2">
                    <span>✅</span>
                    <span><strong>Cotización preliminar de ventas</strong> — {project.budget}</span>
                  </div>
                  <span className="text-[9px] font-mono tracking-widest opacity-80">vínculada</span>
                </div>

                {/* 3 */}
                {(() => {
                  const hasImages = project.images && project.images.length > 0;
                  return (
                    <div className={`flex items-center justify-between p-3 rounded-lg text-xs border leading-none ${
                      hasImages ? 'bg-[#111915] border-emerald-500/10 text-emerald-400' : 'bg-[#1c1611] border-[#d39c3e]/15 text-[#d39c3e]'
                    }`}>
                      <div className="flex items-center gap-2">
                        <span>{hasImages ? '✅' : '⚠️'}</span>
                        <span><strong>Imágenes de referencia del cliente</strong> — {hasImages ? `${project.images.length} archivos en carrete` : "Sin archivos visuales de referencia del cliente"}</span>
                      </div>
                      {!hasImages ? (
                        <button 
                          onClick={() => triggerToast(`Se solicitó imágenes adicionales al asesor ${users[project.advisorId]?.name || ''}.`, 'success')}
                          className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded"
                        >
                          Solicitar
                        </button>
                      ) : (
                        <span className="text-[9px] font-mono tracking-widest opacity-80">adjuntadas</span>
                      )}
                    </div>
                  );
                })()}

                {/* 4 */}
                {(() => {
                  const hasDwg = project.files && project.files.some(f => f.type === 'DWG');
                  return (
                    <div className={`flex items-center justify-between p-3 rounded-lg text-xs border leading-none ${
                      hasDwg ? 'bg-[#111915] border-emerald-500/10 text-emerald-400' : 'bg-[#1c1611] border-[#d39c3e]/15 text-[#d39c3e]'
                    }`}>
                      <div className="flex items-center gap-2">
                        <span>{hasDwg ? '✅' : '⚠️'}</span>
                        <span><strong>Planos de planta técnicos (AutoCAD)</strong> — {hasDwg ? "Archivo de planta .DWG validado" : "Pendiente archivo original de obra gris (.DWG o Croquis)"}</span>
                      </div>
                      {!hasDwg ? (
                        <button 
                          onClick={() => triggerToast(`Alerta de planos DWG faltantes enviada al asesor.`, 'success')}
                          className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded"
                        >
                          Solicitar
                        </button>
                      ) : (
                        <span className="text-[9px] font-mono tracking-widest opacity-80">completo</span>
                      )}
                    </div>
                  );
                })()}

                {/* 5 */}
                <div className="flex items-center justify-between p-3 bg-[#111915] border border-emerald-500/10 text-emerald-400 rounded-lg text-xs leading-none">
                  <div className="flex items-center gap-2">
                    <span>✅</span>
                    <span><strong>Gating SLA Institucional</strong> — Computado: {project.pointsValue} {project.pointsValue === 1 ? 'punto' : 'puntos'} hábil(es) · Vence {project.deliveryDeadline}</span>
                  </div>
                  <span className="text-[9px] font-mono tracking-widest opacity-80">validado</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =============== TAB: TIMELINE DE FASES =============== */}
        {activeTab === 'fases' && (
          <div className="flex flex-col gap-1.5 animate-in fade-in duration-300">
            {project.timeline.map((phase, idx) => {
              let dotColorClass = 'bg-bg5 border-border';
              let cardStyleClass = 'border-border bg-bg2/40 opacity-70';
              let metaColorClass = 'text-text-dim';

              if (phase.status === 'done') {
                dotColorClass = 'bg-teal-400 border-teal-400';
              } else if (phase.status === 'active') {
                dotColorClass = 'bg-amber-400 border-amber-400 animate-pulse';
                cardStyleClass = 'border-amber-500/40 bg-amber-500/5 text-text-main font-semibold';
              } else if (phase.status === 'blocked') {
                cardStyleClass = 'border-rose-500/30 bg-[#201414] opacity-80';
              }

              if (phase.isUrgent) {
                cardStyleClass += ' border-l-4 border-l-rose-500';
                metaColorClass = 'text-rose-400 font-bold';
              }

              return (
                <div key={phase.id} className="flex">
                  <div className="flex flex-col items-center mr-4 w-6 shrink-0 relative">
                    <div className={`w-3.5 h-3.5 rounded-full border-2 mt-2 z-10 flex items-center justify-center shrink-0 ${dotColorClass}`}>
                      {phase.status === 'done' && <Check className="w-2 h-2 text-bg font-bold" />}
                    </div>
                    {idx < project.timeline.length - 1 && (
                      <div className="absolute top-6 bottom-0 w-[1.5px] bg-border z-0"></div>
                    )}
                  </div>

                  <div className={`flex-1 border rounded-xl p-4 mb-4 transition-all ${cardStyleClass}`}>
                    <div className="flex justify-between items-start mb-1 flex-wrap gap-2 text-xs">
                      <h4 className="font-bold text-text-main tracking-wide uppercase">
                        {phase.title}
                        {phase.status === 'active' && <span className="bg-amber-500 text-bg text-[9px] font-bold px-1.5 py-0.5 rounded ml-2 uppercase">ACTIVO</span>}
                      </h4>
                      {phase.date && <span className="text-[10px] font-mono text-text-dim">{phase.date}</span>}
                    </div>
                    <p className="text-xs text-text-muted mt-1 leading-relaxed">{phase.subtitle}</p>
                    {phase.metaMessage && (
                      <em className={`text-[10px] font-mono block mt-2 ${metaColorClass}`}>
                        👁 {phase.metaMessage}
                      </em>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* =============== TAB: SOLICITUDES =============== */}
        {activeTab === 'solicitudes' && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-300">
            {project.requests.length === 0 ? (
              <div className="p-12 text-center text-xs text-text-muted border border-border rounded-xl">
                ✨ Ninguna solicitud técnica o rediseño activo en este proyecto.
              </div>
            ) : (
              project.requests.map(r => {
                const isResolved = r.status === 'resolved';
                return (
                  <div key={r.id} className={`border rounded-xl p-5 ${
                    isResolved 
                      ? 'bg-bg2/30 border-border opacity-70' 
                      : r.type === 'URGENTE' 
                        ? 'border-l-4 border-l-rose-500 bg-rose-500/[0.01] border-y-border border-r-border' 
                        : 'border-l-4 border-l-amber-500 bg-amber-500/[0.01] border-y-border border-r-border'
                  }`}>
                    <div className="flex justify-between items-start gap-2 mb-2 text-xs">
                      <span className={`text-[9px] font-bold tracking-wide uppercase px-2 py-0.5 rounded ${
                        isResolved 
                          ? 'bg-emerald-500/10 text-emerald-400' 
                          : r.type === 'URGENTE' 
                            ? 'bg-rose-500/15 text-rose-400 animate-pulse' 
                            : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {isResolved ? 'Respondida ✓' : r.type}
                      </span>
                      <span className="font-mono text-[10px] text-text-dim">{r.date}</span>
                    </div>

                    <h4 className="text-sm font-bold text-text-main mb-1">{r.title}</h4>
                    <p className="text-xs text-text-muted leading-relaxed mb-3">{r.description}</p>
                    <div className="text-[10px] text-text-dim mb-4 flex justify-between items-center">
                      <span>De: <strong>{r.author}</strong></span>
                      {isResolved && <span className="text-emerald-400 font-bold">Resuelta en CEREBRO</span>}
                    </div>

                    {!isResolved && (
                      <div className="border-t border-border/50 pt-4 mt-2">
                        {replyingRequestId === r.id ? (
                          <div className="space-y-3">
                            <textarea
                              value={replyText}
                              onChange={e => setReplyText(e.target.value)}
                              placeholder="Redacta los ajustes técnicos realizados (ej: Amueblado con cambio en línea Nova)..."
                              className="w-full bg-[#1c212b] border border-border p-3 text-xs rounded-xl text-text-main focus:outline-none focus:border-teal-400 transition-colors h-[80px]"
                            />
                            <div className="flex justify-between items-center text-xs">
                              <button 
                                onClick={() => {
                                  setFichaAttached(!fichaAttached);
                                  triggerToast(fichaAttached ? "Ficha técnica desasociada." : "Ficha técnica de mobiliario Gebesa adjuntada con éxito.");
                                }}
                                className={`px-2.5 py-1.5 rounded text-[10px] font-bold flex items-center gap-1.5 transition-all ${
                                  fichaAttached ? 'bg-emerald-500/20 text-emerald-400' : 'bg-transparent text-text-dim border border-border hover:text-text-main'
                                }`}
                              >
                                <Paperclip className="w-3 h-3" />
                                {fichaAttached ? '✓ Ficha Adjuntada' : 'Adjuntar ficha técnica'}
                              </button>
                              <div className="flex gap-2">
                                <button onClick={() => setReplyingRequestId(null)} className="text-[10px] uppercase font-bold text-text-dim px-2 py-1">
                                  Cancelar
                                </button>
                                <button 
                                  onClick={() => {
                                    if (!replyText.trim()) {
                                      triggerToast("Escribe un comentario explicativo antes de enviar.", "warn");
                                      return;
                                    }
                                    const updatedReqs = project.requests.map(req => req.id === r.id ? { ...req, status: 'resolved' as const } : req);
                                    
                                    // Complete any pending timeline stages
                                    const updatedPhases = project.timeline.map(p => {
                                      if (p.status === 'active' && p.isUrgent) {
                                        return { ...p, status: 'done' as const, date: 'Hoy', metaMessage: '✓ Ajustes resueltos y guardados' };
                                      }
                                      return p;
                                    });

                                    onUpdateProject?.({
                                      ...project,
                                      hasUrgentRequest: updatedReqs.some(req => req.type === 'URGENTE' && req.status === 'pending'),
                                      requests: updatedReqs,
                                      timeline: updatedPhases
                                    });
                                    setReplyingRequestId(null);
                                    setReplyText('');
                                    setFichaAttached(false);
                                    triggerToast(`Respuesta guardada. Solicitud ${r.id} resuelta.`, 'success');
                                  }}
                                  className="bg-emerald-500 hover:bg-emerald-400 text-bg text-black font-extrabold uppercase text-[10px] py-1.5 px-4 rounded"
                                >
                                  Enviar Respuesta
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <button
                            id={`btn-reply-req-${r.id}`}
                            onClick={() => setReplyingRequestId(r.id)}
                            className="bg-teal-400/10 hover:bg-teal-400/20 border border-teal-400/20 text-teal-400 font-extrabold text-[10px] uppercase tracking-wider px-3.5 py-2 rounded-lg transition-colors"
                          >
                            Responder
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* =============== TAB: BÓVEDA =============== */}
        {activeTab === 'boveda' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            {/* Header section with + Upload file option */}
            <div className="flex justify-between items-center border-b border-border/60 pb-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-text-main flex items-center gap-2">
                <Folder className="w-4 h-4 text-amber-400" /> Bóveda de Planos y Modelados Técnicos (CEREBRO)
              </h3>
              
              <button 
                id="btn-boveda-upload"
                onClick={handleTriggerUpload}
                className="bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/25 text-[10px] uppercase tracking-wider font-extrabold px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Subir Archivo
              </button>
            </div>

            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
              accept=".dwg,.skp,.pdf,.png,.jpg,.jpeg"
            />

            {/* Grid 3 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.files.map(f => {
                let badgeStyle = 'bg-teal-500/10 text-teal-400 border border-teal-500/20';
                let typeEmoji = '📐';

                if (f.type === 'DWG') {
                  badgeStyle = 'bg-amber-400/15 text-amber-400 border border-amber-500/20';
                  typeEmoji = '📐';
                } else if (f.type === 'SKP') {
                  badgeStyle = 'bg-[#cb88f9]/15 text-[#cb88f9] border border-purple-500/20';
                  typeEmoji = '🏗';
                } else if (f.type === 'PDF') {
                  badgeStyle = 'bg-rose-500/15 text-rose-400 border border-rose-500/20';
                  typeEmoji = '📄';
                } else {
                  badgeStyle = 'bg-emerald-500/15 text-[#3ee099] border border-emerald-500/20';
                  typeEmoji = '🖼';
                }

                return (
                  <div key={f.id} className="bg-bg2 border border-border hover:border-border2 p-4 rounded-xl flex flex-col justify-between group transition-all">
                    <div className="flex flex-col gap-1 text-xs">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-2xl">{typeEmoji}</span>
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-extrabold ${badgeStyle}`}>
                          {f.type}
                        </span>
                      </div>
                      <h5 className="font-bold text-text-main truncate max-w-full leading-normal text-[11.5px]" title={f.name}>
                        {f.name}
                      </h5>
                      <p className="text-[10px] text-text-dim mt-1 font-mono">
                        {f.size} · {f.date}
                      </p>
                      <p className="text-[9px] text-text-faint">Por: {f.author}</p>
                    </div>

                    <div className="mt-4 border-t border-border/40 pt-3 flex items-center justify-between text-xs">
                      <a 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); triggerToast(`Descargando "${f.name}" de forma local...`); }}
                        className="text-[9px] text-teal-400 hover:text-teal-300 font-bold uppercase tracking-wider flex items-center gap-1"
                      >
                        <Download className="w-2.5 h-2.5" /> Descargar
                      </a>

                      <button 
                        onClick={() => {
                          onUpdateProject?.({
                            ...project,
                            files: project.files.filter(fileItem => fileItem.id !== f.id)
                          });
                          triggerToast("Archivo de planos eliminado de la Bóveda técnica.", "success");
                        }}
                        className="text-[9px] text-rose-400 hover:text-rose-300 opacity-0 group-hover:opacity-100 transition-opacity font-bold uppercase tracking-wider flex items-center gap-1"
                      >
                        <Trash2 className="w-2.5 h-2.5" /> Eliminar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Drop Zone */}
            <div 
              onDragOver={handleDragOver} 
              onDrop={handleDrop}
              onClick={handleTriggerUpload}
              className="mt-2 border border-dashed border-border2 bg-bg2/10 hover:bg-bg3/20 rounded-xl p-6 text-center cursor-pointer text-text-dim text-xs hover:border-teal-400 hover:text-teal-400 transition-all flex flex-col gap-1 items-center justify-center"
            >
              <Upload className="w-6 h-6 mb-1 text-text-dim" />
              <span>↑ Arrastra archivos aquí · DWG · SKP · PDF · Imágenes</span>
              <span className="text-[10px] opacity-75">Máx 50MB por archivo · Registro inmediato de firma digital</span>
            </div>
          </div>
        )}

        {/* =============== TAB: ENTREGAR =============== */}
        {activeTab === 'entregar' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-300">
            {/* Panel izquierdo: Qué vas a entregar */}
            <div className="bg-bg2/30 border border-border rounded-xl p-5 flex flex-col gap-4 text-xs font-normal">
              <div>
                <h3 className="text-xs uppercase tracking-widest text-teal-400 font-extrabold mb-1">¿Qué vas a entregar?</h3>
                <p className="text-[11px] text-text-dim mb-3">Marca los planos y materiales terminados de este expediente comercial.</p>
                
                <div className="space-y-2 text-xs">
                  <label className="flex items-start gap-3 bg-bg cursor-pointer p-3 border border-border hover:border-border2 transition-all rounded-lg select-none">
                    <input 
                      type="checkbox" 
                      checked={delivPlanos} 
                      disabled={deliverySuccess}
                      onChange={e => setDelivPlanos(e.target.checked)}
                      className="mt-0.5 accent-teal-400 w-3.5 h-3.5"
                    />
                    <div>
                      <div className="font-bold text-text-main">📐 Planos técnicos DWG + PDF</div>
                      <div className="text-[10px] text-text-dim mt-0.5">Indispensable. Trazos vectorizados de planta.</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 bg-bg cursor-pointer p-3 border border-border hover:border-border2 transition-all rounded-lg select-none">
                    <input 
                      type="checkbox" 
                      checked={delivRenders} 
                      disabled={!project.requiresRenders || deliverySuccess}
                      onChange={e => setDelivRenders(e.target.checked)}
                      className="mt-0.5 accent-teal-400 w-3.5 h-3.5"
                    />
                    <div>
                      <div className="font-bold text-text-main">🖼 Renders 3D ({project.renderCount || 3} vistas)</div>
                      <div className="text-[10px] text-text-dim mt-0.5">Perspectivas fotorrealistas acordadas (+3d días calendario).</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 bg-bg cursor-pointer p-3 border border-border hover:border-border2 transition-all rounded-lg select-none">
                    <input 
                      type="checkbox" 
                      checked={delivVirtual} 
                      disabled={!project.requiresVirtualTour || deliverySuccess}
                      onChange={e => setDelivVirtual(e.target.checked)}
                      className="mt-0.5 accent-teal-400 w-3.5 h-3.5"
                    />
                    <div>
                      <div className="font-bold text-text-main">🥽 Recorrido Virtual 360°</div>
                      <div className="text-[10px] text-text-dim mt-0.5">Solo proyectos Premium. Recorrido aéreo inmersivo.</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 bg-bg cursor-pointer p-3 border border-border hover:border-border2 transition-all rounded-lg select-none">
                    <input 
                      type="checkbox" 
                      checked={delivEsps} 
                      disabled={deliverySuccess}
                      onChange={e => setDelivEsps(e.target.checked)}
                      className="mt-0.5 accent-teal-400 w-3.5 h-3.5"
                    />
                    <div>
                      <div className="font-bold text-text-main">📋 Lista de especificaciones</div>
                      <div className="text-[10px] text-text-dim mt-0.5">Asociar códigos SKU oficiales de Gebesa catálogo (+0.5d).</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase font-bold text-text-dim">Escribir nota para el asesor comercial</label>
                <textarea 
                  placeholder="Escribe comentarios técnicos de apoyo (ej: amueblado de áreas listo)..."
                  value={deliveryNote}
                  disabled={deliverySuccess}
                  onChange={e => setDeliveryNote(e.target.value)}
                  className="w-full bg-[#1c212b] border border-border p-3 text-xs rounded-xl text-text-main focus:outline-none focus:border-teal-400 transition-colors h-[80px]"
                />
              </div>

              {deliverySuccess ? (
                <div className="bg-[#121c17] text-emerald-400 border border-emerald-500/20 p-4 rounded-xl text-xs flex gap-3 shadow-lg shadow-emerald-500/5 animate-pulse">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                  <div>
                    <strong className="block uppercase font-bold tracking-wide">¡ENTREGA REALIZADA CON ÉXITO!</strong>
                    <p className="mt-1 leading-relaxed text-[#beebcd]">
                      El proyecto ha sido catalogado como "Visto Bueno". Los asesores comerciales han recibido correo con código y enlaces de DWG de forma automática.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2 justify-start mt-2">
                  <button 
                    id="btn-confirm-delivery"
                    onClick={() => {
                      const deliverablesList: string[] = [];
                      if (delivPlanos) deliverablesList.push("Planos técnicos DWG + PDF");
                      if (delivRenders && project.requiresRenders) deliverablesList.push(`Renders 3D (${project.renderCount || 3} vistas)`);
                      if (delivVirtual && project.requiresVirtualTour) deliverablesList.push("Recorrido Virtual 360°");
                      if (delivEsps) deliverablesList.push("Lista de especificaciones");

                      if (deliverablesList.length === 0) {
                        triggerToast("Selecciona al menos un entregable de la lista.", "warn");
                        return;
                      }

                      // Create Delivery History block
                      const newDeliveryEvent: DeliveryEvent = {
                        id: `deliv-${Date.now()}`,
                        date: 'Hoy',
                        author: 'Karen Tovar',
                        description: deliveryNote || 'Entrega técnica final con propuesta de distribución de mobiliario terminada.',
                        items: deliverablesList,
                        status: 'delivered'
                      };

                      // Auto-advance timeline steps to done
                      const updatedTimeline = project.timeline.map(phase => {
                        if (phase.status === 'active') {
                          return { ...phase, status: 'done' as const, date: 'Hoy', metaMessage: '✓ Entregado mediante panel Entregar' };
                        }
                        return phase;
                      });

                      onUpdateProject?.({
                        ...project,
                        status: 'Visto Bueno',
                        deliveryHistory: [newDeliveryEvent, ...(project.deliveryHistory || [])],
                        timeline: updatedTimeline
                      });

                      setDeliverySuccess(true);
                      triggerToast("¡Módulos de propuesta publicados! Notificaciones enviadas.", "success");
                    }}
                    className="bg-emerald-500 hover:bg-emerald-400 text-bg text-black font-extrabold uppercase text-[10px] tracking-widest py-3 px-5 rounded-md transition-all shadow-lg shadow-emerald-500/10 flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" /> Entregar y notificar
                  </button>
                  <button 
                    onClick={() => triggerToast("Enlace premium visualizador copia en portapapeles.", "success")}
                    className="bg-transparent border border-border2 hover:bg-white/5 text-text-main text-[10px] uppercase font-bold py-3 px-4 rounded-md transition-all"
                  >
                    Generar link presentación
                  </button>
                </div>
              )}
            </div>

            {/* Panel derecho: Explicación y Historial */}
            <div className="flex flex-col gap-4 text-xs font-normal">
              {/* Gold Box */}
              <div className="bg-[#1c1610] border border-amber-500/20 text-[#ebdcb5] p-5 rounded-xl text-xs flex gap-3">
                <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="block uppercase font-bold text-amber-400">Entrega Integrada</strong>
                  <p className="mt-1 leading-relaxed opacity-95 text-[11px]">
                    Un solo clic en el botón de entrega efectúa de forma paralela tres acciones técnicas:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 mt-2 font-mono text-[9.5px] opacity-80 leading-relaxed">
                    <li>Dispara alerta visual inmediata al asesor y oficina de ventas.</li>
                    <li>Registra la Bóveda de archivos con trazos DWG fijos.</li>
                    <li>Sube el estatus del proyecto de forma oficial a "Visto Bueno".</li>
                  </ol>
                </div>
              </div>

              {/* Delivery History Loop */}
              <div className="bg-bg2/40 border border-border rounded-xl p-5 flex-1 flex flex-col">
                <h4 className="text-xs uppercase tracking-widest text-[#d39c3e] font-bold mb-3">Historial de Entregas Recientes</h4>
                {project.deliveryHistory && project.deliveryHistory.length > 0 ? (
                  <div className="space-y-4 overflow-y-auto pr-1 flex-1 custom-scrollbar">
                    {project.deliveryHistory.map(del => (
                      <div key={del.id} className="border-b border-border/50 pb-3 last:border-b-0 last:pb-0 text-xs">
                        <div className="flex justify-between text-[10px] font-mono text-text-dim mb-1">
                          <strong>📦 Karen Tovar</strong>
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
                  <div className="p-8 text-center text-text-dim text-xs my-auto">
                    Sin registros de entregas previas en este folio.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =============== TAB: CHAT =============== */}
        {activeTab === 'chat' && (
          <div className="flex flex-col gap-4 h-[420px] justify-between animate-in fade-in duration-300">
            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-2 custom-scrollbar">
              {project.comments.length === 0 ? (
                <div className="p-12 text-center text-text-dim text-xs">
                  Sin comentarios recientes. Comunícate directamente con el asesor.
                </div>
              ) : (
                project.comments.map(c => {
                  const u = users[c.authorId];
                  const isMe = c.authorId === 'kt';
                  return (
                    <div key={c.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 shadow ${
                        isMe ? 'bg-blue-900 text-blue-300' : u?.avatarColor || 'bg-bg3 text-text-muted'
                      }`}>
                        {u ? u.initials : '??'}
                      </div>
                      
                      <div className={`max-w-[75%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <span className="text-[9px] text-text-dim mb-1 font-mono">
                          <strong className="text-text-muted font-normal">{c.authorName}</strong> · {c.date}
                        </span>
                        <div className={`text-xs px-3.5 py-2.5 rounded-2xl leading-relaxed border ${
                          isMe 
                            ? 'bg-teal-500/10 border-teal-500/20 text-[#cefbf1] rounded-tr-none shadow-sm' 
                            : 'bg-bg2 border-border text-text-main rounded-tl-none'
                        }`}>
                          {c.text}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Send Area */}
            <div className="flex gap-2.5 items-end border-t border-border pt-4 mt-1 bg-bg z-10 shrink-0">
              <div className="w-7 h-7 rounded-full bg-blue-900 text-blue-300 font-bold flex items-center justify-center text-[10px] font-mono shrink-0 mb-1">
                KT
              </div>
              <div className="flex-1 relative">
                <textarea 
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendComment();
                    }
                  }}
                  placeholder="Redacta un mensaje de coordinación técnica... (Enter para enviar)"
                  className="w-full bg-[#1c212b] border border-border text-xs rounded-xl pl-4 pr-12 py-3 resize-none h-[42px] focus:outline-none focus:border-teal-400 text-text-main transition-colors"
                />
                <button 
                  onClick={handleSendComment}
                  className="absolute right-3.5 top-2 p-1 text-teal-400 hover:text-teal-300 transition-colors"
                  title="Enviar"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
