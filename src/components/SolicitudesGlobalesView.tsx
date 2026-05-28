import React, { useState } from 'react';
import { Project, Request } from '../types';
import { ArrowLeft, Mail, AlertTriangle, Paperclip, Send, CheckCircle2, CheckCircle, Info } from 'lucide-react';

interface SolicitudesGlobalesViewProps {
  projects: Project[];
  onBack: () => void;
  onResolveRequest: (projectId: string, reqId: string, replyText: string, attached: boolean) => void;
  onPedirMasInfo?: (req: Request) => void;
}

export function SolicitudesGlobalesView({ projects, onBack, onResolveRequest, onPedirMasInfo }: SolicitudesGlobalesViewProps) {
  // Extract all requests from all projects
  const allRequests: (Request & { projectCode: string; projectName: string })[] = [];
  
  projects.forEach(p => {
    p.requests.forEach(r => {
      allRequests.push({
        ...r,
        projectCode: p.code,
        projectName: p.name
      });
    });
  });

  // Sort them: pending first, then urgent first
  const sortedRequests = [...allRequests].sort((a, b) => {
    // pending first
    if (a.status === 'pending' && b.status === 'resolved') return -1;
    if (a.status === 'resolved' && b.status === 'pending') return 1;
    // urgent first
    if (a.type === 'URGENTE' && b.type !== 'URGENTE') return -1;
    if (a.type !== 'URGENTE' && b.type === 'URGENTE') return 1;
    return 0;
  });

  const activeCount = allRequests.filter(r => r.status === 'pending').length;
  const urgentCount = allRequests.filter(r => r.status === 'pending' && r.type === 'URGENTE').length;

  // Toggle reply box states
  const [replyingReqId, setReplyingReqId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [fichaAttached, setFichaAttached] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleSendResponse = (projectId: string, reqId: string) => {
    if (!replyText.trim()) {
      setToast('Ingresa un comentario detallado para enviar la respuesta.');
      setTimeout(() => setToast(null), 3000);
      return;
    }
    onResolveRequest(projectId, reqId, replyText.trim(), fichaAttached);
    setReplyingReqId(null);
    setReplyText('');
    setFichaAttached(false);
  };

  const handleMoreInfoClick = (req: Request) => {
    if (onPedirMasInfo) {
      onPedirMasInfo(req);
    } else {
      setToast(`Solicitud de más información enviada al asesor comercial de ${req.projectId}`);
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-bg p-8 overflow-y-auto custom-scrollbar animate-in fade-in duration-300">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-5 py-3 rounded shadow-2xl bg-[#241717] border border-rose-500/25 text-rose-400 text-xs font-semibold animate-bounce flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-border/60">
        <div>
          <button 
            id="solicitudes-back-btn"
            onClick={onBack} 
            className="flex items-center gap-1 text-text-dim hover:text-text-main text-xs uppercase font-extrabold tracking-wider mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← Mis Proyectos</span>
          </button>
          <h2 className="text-3xl font-serif text-text-main tracking-tight leading-tight">Bandeja de proyectos nuevos Global</h2>
          <p className="text-xs text-text-muted mt-1">Re-diseños técnicos, cambios prioritarios de layouts, y correcciones SLA solicitadas por ventas.</p>
        </div>

        <div className="flex gap-2 font-mono text-[10px] font-bold">
          <span className="bg-rose-500/10 text-rose-400 border border-rose-500/15 px-3 py-1.5 rounded uppercase">
            🚨 {urgentCount} Urgente{urgentCount !== 1 ? 's' : ''}
          </span>
          <span className="bg-amber-400/10 text-amber-400 border border-amber-500/15 px-3 py-1.5 rounded uppercase">
            📨 {activeCount} Activa{activeCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Flat List */}
      <div className="space-y-4">
        {sortedRequests.length === 0 ? (
          <div className="p-12 text-center text-xs text-text-muted border border-border rounded-xl bg-bg2/40 flex flex-col gap-2 items-center justify-center">
            <Mail className="w-8 h-8 text-text-dim mb-1" />
            <span className="font-bold text-[#beebcd]">Garantía SLA al 100%</span>
            <span>Estás libre de solicitudes de rediseño pendientes. ¡Excelente coordinación con ventas!</span>
          </div>
        ) : (
          sortedRequests.map(req => {
            const isResolved = req.status === 'resolved';
            const isUrgent = req.type === 'URGENTE';
            const isRender = req.type === 'RENDER';
            
            let borderClass = 'border-l-4 border-l-amber-500';
            if (isResolved) {
              borderClass = 'border-l-4 border-l-emerald-500 opacity-60';
            } else if (isUrgent) {
              borderClass = 'border-l-4 border-l-rose-500';
            } else if (isRender) {
              borderClass = 'border-l-4 border-l-sky-500';
            }

            return (
              <div 
                key={req.id} 
                className={`bg-bg2/40 border border-border rounded-xl p-5 flex flex-col gap-4 relative transition-all ${borderClass}`}
              >
                <div className="flex justify-between items-start gap-4 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase ${
                      isResolved 
                        ? 'bg-emerald-500/15 text-emerald-400' 
                        : isUrgent 
                          ? 'bg-rose-500/15 text-rose-400 animate-pulse' 
                          : isRender 
                            ? 'bg-sky-500/15 text-sky-400' 
                            : 'bg-amber-500/15 text-amber-400'
                    }`}>
                      {isResolved ? 'Respondida ✓' : req.type}
                    </span>
                    <span className="text-[11px] text-text-dim">
                      Proyecto: <strong className="text-text-main">{req.projectCode} · {req.projectName}</strong>
                    </span>
                  </div>

                  <span className="text-[10px] text-text-faint font-mono font-medium">{req.date}</span>
                </div>

                <div>
                  <h4 className="text-base font-semibold text-text-main mb-1.5 leading-snug">{req.title}</h4>
                  <p className="text-xs text-text-muted leading-relaxed font-normal">{req.description}</p>
                </div>

                {/* Footer and interactive triggers */}
                <div className="flex justify-between items-center flex-wrap gap-3 border-t border-border/30 pt-3.5 text-xs text-text-dim">
                  <div>
                    Solicitado por: <span className="text-[#eee] font-bold">{req.author}</span> · {req.projectCode}
                  </div>

                  {!isResolved && (
                    <div className="flex gap-2">
                      <button 
                        id={`global-req-info-${req.id}`}
                        onClick={() => handleMoreInfoClick(req)}
                        className="bg-transparent hover:bg-white/5 border border-border2 text-[#99b5ff] hover:text-white font-extrabold uppercase tracking-widest text-[9px] px-3.5 py-2.5 rounded transition-colors"
                      >
                        Pedir más info
                      </button>
                      <button 
                        id={`global-req-reply-btn-${req.id}`}
                        onClick={() => {
                          if (replyingReqId === req.id) {
                            setReplyingReqId(null);
                          } else {
                            setReplyingReqId(req.id);
                            setReplyText('');
                            setFichaAttached(false);
                          }
                        }}
                        className="bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/20 font-extrabold uppercase tracking-widest text-[9px] px-4 py-2.5 rounded transition-colors"
                      >
                        Responder
                      </button>
                    </div>
                  )}
                </div>

                {/* Inline reply Box inside global list */}
                {replyingReqId === req.id && !isResolved && (
                  <div className="bg-[#12141c]/90 border border-teal-500/20 p-4 rounded-lg mt-2 flex flex-col gap-3 animate-in slide-in-from-top-2 duration-200">
                    <span className="text-[9px] font-bold text-teal-400 uppercase tracking-widest">Enviar Respuesta Técnica</span>
                    <textarea 
                      placeholder="Redacta la respuesta técnica detallada (ej: Ajustes listos sobre línea Nova)..."
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      className="w-full bg-[#1c212b] border border-border p-3 text-xs rounded-xl text-text-main focus:outline-none focus:border-teal-400 transition-colors h-[80px]"
                    />
                    <div className="flex justify-between items-center gap-3">
                      <button 
                        onClick={() => {
                          setFichaAttached(!fichaAttached);
                          setToast(fichaAttached ? "Ficha desvinculada" : "Ficha técnica oficial Gebesa adjuntada.");
                          setTimeout(() => setToast(null), 1500);
                        }}
                        className={`text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 rounded border transition-colors flex items-center gap-1.5 ${
                          fichaAttached ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-transparent text-text-dim border-border hover:text-text-main'
                        }`}
                      >
                        <Paperclip className="w-3.5 h-3.5" />
                        {fichaAttached ? '✓ Ficha Técnica Adjunta' : '📎 Adjuntar ficha técnica'}
                      </button>

                      <div className="flex gap-2">
                        <button onClick={() => setReplyingReqId(null)} className="text-[10px] font-bold uppercase text-text-dim px-3 py-1.5 hover:text-text-main transition-colors">
                          Cancelar
                        </button>
                        <button 
                          id={`global-req-submit-${req.id}`}
                          onClick={() => handleSendResponse(req.projectId, req.id)}
                          className="bg-emerald-500 hover:bg-emerald-400 font-extrabold text-bg text-black uppercase tracking-widest text-[9.5px] py-1.5 px-4 rounded shadow shadow-emerald-500/10 transition-colors"
                        >
                          Enviar respuesta
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
