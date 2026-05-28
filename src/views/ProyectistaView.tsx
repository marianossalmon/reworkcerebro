import React, { useState } from 'react';
import { 
  Project, Request, InboxProject, LoadCapacity, ProjectMagnitude, ProjectFile, TimelinePhase
} from '../types';
import { 
  mockProjects as initialProjects, 
  inboxProjects as initialInbox, 
  calcularCarga, 
  diasRestantes,
  users
} from '../data';
import { ProjectList } from '../components/ProjectList';
import { ProjectDetail } from '../components/ProjectDetail';
import { Semaphore } from '../components/Semaphore';
import { InboxView } from '../components/InboxView';
import { SolicitudesGlobalesView } from '../components/SolicitudesGlobalesView';
import { CalendarView } from '../components/CalendarView';
import { EntregablesView } from '../components/EntregablesView';
import { VacacionesView } from '../components/VacacionesView';
import { 
  Calendar, Inbox, AlertTriangle, Sparkles, Sliders, 
  CheckCircle2, ChevronRight, Send, HelpCircle, ArrowLeft, 
  ShieldAlert, Mail, Clock, Check, FileText, CheckCircle, 
  User, Clipboard, CalendarDays, UploadCloud, Folder, RefreshCw
} from 'lucide-react';

export type ProyectistaSubView = 'projects' | 'inbox' | 'solicitudes' | 'calendar' | 'entregables' | 'vacaciones';

export interface ProyectistaViewProps {
  externalInbox?: InboxProject[];
  activeSubView?: ProyectistaSubView;
  onSubViewChange?: (view: ProyectistaSubView) => void;
}

export function ProyectistaView({
  externalInbox,
  activeSubView = 'projects',
  onSubViewChange
}: ProyectistaViewProps) {
  const subView = activeSubView;
  const setSubView = (view: ProyectistaSubView) => {
    onSubViewChange?.(view);
  };
  
  // Real State Layers
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [inboxList, setInboxList] = useState<InboxProject[]>(initialInbox);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(initialProjects[0]?.id || '');
  const [requestsList, setRequestsList] = useState<Request[]>(
    initialProjects.flatMap(p => p.requests)
  );

  // Vacation/Backup state
  const [vacationMode, setVacationMode] = useState<boolean>(false);
  const [selectedBackup, setSelectedBackup] = useState<string>('or'); // Oscar R by default

  // Toast systems
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'warn' } | null>(null);
  const [chatFeedback, setChatFeedback] = useState<string | null>(null);

  // Active Project Selection
  const selectedProject = projects.find(p => p.id === selectedProjectId);

  // Compute stats on the fly
  const currentCarga = calcularCarga(projects);
  const activeRequests = requestsList.filter(r => r.status === 'pending');
  const urgentCount = activeRequests.filter(r => r.type === 'URGENTE').length;

  // Next delivery logic
  const getProximaEntrega = () => {
    const active = projects.filter(p => !p.isInInbox);
    if (active.length === 0) return { nombre: 'Sin asignaciones', deadline: 'Sin fecha' };
    
    // Sort by deadline urgency (Hoy -> Mañana -> Mar 27 -> Vie 30)
    const sorted = [...active].sort((a, b) => {
      const remainingA = diasRestantes(a.deliveryDeadline).dias;
      const remainingB = diasRestantes(b.deliveryDeadline).dias;
      return remainingA - remainingB;
    });
    
    return {
      nombre: `${sorted[0].code} · ${sorted[0].name}`,
      deadline: sorted[0].deliveryDeadline
    };
  };

  const proximaEntregaInfo = getProximaEntrega();

  const triggerToast = (message: string, type: 'success' | 'warn' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // 1. Accept Assignment Gating Handler
  const handleAcceptProject = (inboxProj: InboxProject) => {
    // 1. Check Completeness Score Gate (>= 70%)
    if (inboxProj.completenessScore < 70) {
      triggerToast('No se puede aceptar: El expediente debe tener mínimo 70% de completitud.', 'warn');
      return;
    }

    // 2. Check Load Limits Capacity (< 6 pts)
    const pointsToAdd = inboxProj.pointsValue;
    if (currentCarga.currentPoints + pointsToAdd > 6) {
      triggerToast('Límite de capacidad excedido (Máx 6 pts). Entrega un proyecto activo antes de aceptar otro.', 'warn');
      return;
    }

    // 3. Complete Transfer process
    const acceptedProj: Project = {
      ...inboxProj,
      isInInbox: false,
      assignedTo: 'kt', // Karen Tovar
      status: 'En Proceso', // Move from Sin Asignar
      startDate: 'Hoy',
      tags: ['En Proceso', inboxProj.magnitude === 'G' ? 'GRANDE' : inboxProj.magnitude === 'M' ? 'MEDIANO' : 'CHICO'],
      timeline: [
        { id: 't1', title: '1. Levantamiento y brief', subtitle: 'Aceptado por proyectista y validado', status: 'done', date: 'Hoy', metaMessage: '✓ Validado · Gating completo' },
        { id: 't2', title: '2. Layout inicial', subtitle: 'Diseñando planos de distribución', status: 'active', metaMessage: '→ En progreso' },
        { id: 't3', title: '3. Renders preliminares', subtitle: 'Pendiente layouts autorizados', status: 'pending', metaMessage: 'Bloqueado por fase 2' },
        { id: 't4', title: '4. Entrega final', subtitle: 'Compilación final en Bóveda', status: 'pending', metaMessage: 'Pendiente' },
      ],
      files: [
        ...(inboxProj.files || []),
        { id: `f-acc-${Math.floor(Math.random()*900)}`, name: 'brief-validado-gate.pdf', type: 'PDF', size: '124 KB', date: 'Hoy', author: 'CEREBRO Gate' }
      ]
    };

    // Update States
    setProjects(prev => [...prev, acceptedProj]);
    setInboxList(prev => prev.filter(p => p.id !== inboxProj.id));
    setSelectedProjectId(acceptedProj.id);
    triggerToast(`¡Proyecto ${inboxProj.code} asignado e integrado a tu pipeline técnico!`);
    setSubView('projects');
  };

  // Handler to request more info from Adviser (Simulation)
  const handleRequestMoreInfo = (inboxProj: InboxProject) => {
    setChatFeedback(`Notificación automática enviada al Asesor (${users[inboxProj.advisorId]?.name || 'Área de Ventas'}): "Se requiere adjuntar ${inboxProj.pendingInfoItems.join(', ')} para continuar con la aceptación del folio ${inboxProj.code}."`);
    setTimeout(() => setChatFeedback(null), 7000);
    triggerToast('Solicitud de información técnica enviada al Asesor.');
  };

  // 2. Global Request Resolver
  const handleResolveRequest = (reqId: string, itemCode: string) => {
    // Mark as resolved in request list
    setRequestsList(prev => prev.map(r => r.id === reqId ? { ...r, status: 'resolved' } : r));
    
    // Also update inside the projects array
    setProjects(prev => prev.map(p => {
      if (p.requests.some(r => r.id === reqId)) {
        return {
          ...p,
          hasUrgentRequest: false,
          requests: p.requests.map(r => r.id === reqId ? { ...r, status: 'resolved' as const } : r)
        };
      }
      return p;
    }));

    triggerToast(`Solicitud técnica en ${itemCode} resuelta exitosamente.`);
  };

  const handleResolveGlobalRequest = (projectId: string, reqId: string, replyText: string, attached: boolean) => {
    setRequestsList(prev => prev.map(r => r.id === reqId ? { ...r, status: 'resolved' } : r));

    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const newComment = {
          id: `comment-rep-${Date.now()}`,
          authorId: 'kt',
          authorName: 'Karen Tovar',
          date: 'Justo ahora',
          text: `Respuesta de solicitud: ${replyText} ${attached ? '(✓ Ficha técnica oficial adjuntada)' : ''}`
        };

        const updatedFiles = [...p.files];
        if (attached) {
          updatedFiles.unshift({
            id: `file-auto-${Date.now()}`,
            name: 'ficha-tecnica-gebesa.pdf',
            type: 'PDF',
            size: '1.2 MB',
            date: 'Hoy',
            author: 'Karen Tovar'
          });
        }

        return {
          ...p,
          hasUrgentRequest: false,
          files: updatedFiles,
          comments: [...p.comments, newComment],
          requests: p.requests.map(r => r.id === reqId ? { ...r, status: 'resolved' as const } : r)
        };
      }
      return p;
    }));

    triggerToast('Solicitud técnica resuelta con éxito (notificación y comentario integrados).');
  };

  // 3. Deliverables Proposal form submit handler
  const [selectedDeliverableProj, setSelectedDeliverableProj] = useState<string>(projects[0]?.id || '');
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDeliverableProj || !uploadedFileName) {
      triggerToast('Por favor selecciona un proyecto y escribe el nombre del archivo.', 'warn');
      return;
    }

    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        
        // Append newly created file into boveda and advance timeline!
        const ext = uploadedFileName.split('.').pop()?.toUpperCase() || 'DWG';
        const newFile: ProjectFile = {
          id: `file-up-${Math.floor(Math.random()*1000)}`,
          name: uploadedFileName,
          type: ext as any,
          size: '4.8 MB',
          date: 'Justo ahora',
          author: 'Karen Tovar'
        };

        setProjects(prev => prev.map(proj => {
          if (proj.id === selectedDeliverableProj) {
            // Unblock/Done layouts initial or renders
            const updatedTimeline = proj.timeline.map(step => {
              if (step.status === 'active') {
                return { ...step, status: 'done' as const, date: 'Hoy', metaMessage: '✓ Entregado mediante Bóveda' };
              }
              // Set the next step as active if we just completed one
              return step;
            });
            
            // Auto-advance next step
            let activated = false;
            const finalTimeline = updatedTimeline.map(step => {
              if (step.status === 'pending' && !activated) {
                activated = true;
                return { ...step, status: 'active' as const, metaMessage: '→ En progreso tras entrega anterior' };
              }
              if (step.status === 'blocked' && !activated) {
                activated = true;
                return { ...step, status: 'active' as const, metaMessage: '→ Desbloqueado y activo' };
              }
              return step;
            });

            return {
              ...proj,
              files: [newFile, ...proj.files],
              timeline: finalTimeline
            };
          }
          return proj;
        }));

        setIsUploading(false);
        setUploadedFileName('');
        setUploadProgress(0);
        triggerToast(`Entregable "${uploadedFileName}" subido y timeline técnica actualizada.`);
      }
    }, 150);
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-bg text-text-main h-full">
      {/* Dynamic Toast Feedback Banner */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded shadow-2xl border transition-all animate-bounce flex items-center gap-3 ${
          toast.type === 'success' 
            ? 'bg-[#121c17] text-emerald-400 border-emerald-500/30' 
            : 'bg-[#241717] text-rose-400 border-rose-500/30'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />}
          <div className="text-sm font-medium">{toast.message}</div>
        </div>
      )}

      {/* Debug subview badge */}
      <div className="text-[10px] font-mono text-text-muted py-2 bg-bg2 border-b border-border flex items-center justify-between px-8">
        <span>Vista Técnica ACTIVA</span>
        <span className="text-teal-400">Subvista activa desde Shell: {subView}</span>
      </div>

      {chatFeedback && (
        <div className="bg-[#18110b] border-b border-[#ffd700]/10 px-8 py-2 md:py-3 animate-in slide-in-from-top text-xs text-[#ffd700] flex items-center gap-3">
          <ShieldAlert className="w-4 h-4 text-[#ffd700] shrink-0" />
          <div className="font-mono flex-1">{chatFeedback}</div>
          <button onClick={() => setChatFeedback(null)} className="text-[10px] text-text-dim hover:text-white uppercase font-bold px-2 py-0.5 border border-white/10 rounded">ocultar</button>
        </div>
      )}

      {/* MAIN VIEW CONTENT CONDITIONAL ROUTING */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* SUBVIEW 1: Active Projects & Semaphore Panel */}
        {subView === 'projects' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Real Stats injected into high-contrast Semaphore */}
            <Semaphore 
              carga={currentCarga}
              solicitudesCount={requestsList.filter(r => r.status === 'pending').length}
              solicitudesUrgentes={requestsList.filter(r => r.status === 'pending' && r.type === 'URGENTE').length}
              proximaEntrega={proximaEntregaInfo}
              tiempoPromedio={2.8} // simulated technical SLA avg
              retrabajoPercent={4.2} // simulated revision cycle metrics
              onCardClick={(card) => {
                if (card === 'solicitudes') setSubView('solicitudes');
                else if (card === 'carga') setSubView('inbox');
                else if (card === 'entrega') setSubView('calendar');
                else triggerToast(`Tarjeta de métrica "${card}" activa · Datos validados por CEREBRO.`);
              }}
            />

            <div className="flex flex-1 overflow-hidden">
              <ProjectList
                projects={projects}
                selectedId={selectedProjectId}
                onSelect={setSelectedProjectId}
                onShowInbox={() => setSubView('inbox')}
                carga={currentCarga}
                inboxCount={inboxList.length}
                vacationMode={vacationMode}
              />
              
              {selectedProject ? (
                <ProjectDetail 
                  project={selectedProject} 
                  onUpdateProject={(updated) => {
                    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
                  }}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center text-text-dim text-xs flex-col gap-2 bg-bg p-8">
                  <div className="text-4xl">📋</div>
                  <div className="font-serif italic text-base text-text-muted">Ningún proyecto seleccionado</div>
                  <p className="max-w-xs text-center text-[11px]">Asigna folios desde tu bandeja o elige uno de la barra lateral.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SUBVIEW 2: Technical Gating / Inbox View */}
        {subView === 'inbox' && (
          <InboxView 
            carga={currentCarga}
            inboxList={inboxList}
            onBack={() => setSubView('projects')}
            onAccept={(item) => handleAcceptProject(item)}
            onSolicitarInfo={(item) => handleRequestMoreInfo(item)}
          />
        )}

        {/* SUBVIEW 3: Global Request Manager */}
        {subView === 'solicitudes' && (
          <SolicitudesGlobalesView 
            projects={projects}
            onBack={() => setSubView('projects')}
            onResolveRequest={handleResolveGlobalRequest}
            onPedirMasInfo={(req) => {
              setChatFeedback(`Notificación de más información para solicitud "${req.title}" enviada.`);
              setTimeout(() => setChatFeedback(null), 5000);
            }}
          />
        )}

        {/* SUBVIEW 4: Calendar SLA View */}
        {subView === 'calendar' && (
          <CalendarView 
            projects={projects}
            onBack={() => setSubView('projects')}
            onDeliverClick={(proj) => {
              setSelectedProjectId(proj.id);
              setSubView('entregables');
            }}
          />
        )}

        {/* SUBVIEW 5: Deliverables / Upload Panel */}
        {subView === 'entregables' && (
          <EntregablesView 
            projects={projects}
            onBack={() => setSubView('projects')}
            onUpdateProject={(updated) => {
              setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
              triggerToast('Entregable subido y timeline técnica actualizada.');
            }}
            initialSelectedProjectId={selectedProjectId}
          />
        )}

        {/* SUBVIEW 6: Vacation Mode / Workspace Balance */}
        {subView === 'vacaciones' && (
          <VacacionesView 
            vacationMode={vacationMode}
            setVacationMode={(val) => {
              setVacationMode(val);
              triggerToast(`Modo recreo asignado como ${val ? 'Activado' : 'Desactivado'}.`);
            }}
            selectedBackup={selectedBackup}
            setSelectedBackup={setSelectedBackup}
            onBack={() => setSubView('projects')}
          />
        )}

      </div>
    </div>
  );
}
