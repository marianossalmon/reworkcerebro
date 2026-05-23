import React, { useState } from 'react';
import { Project, TimelinePhase } from '../types';
import { users } from '../data';
import { Check, Info, Paperclip, Mail, Image as ImageIcon, MessageSquare, Plus, File, Download, PenTool, LayoutDashboard } from 'lucide-react';

interface ProjectDetailProps {
  project: Project;
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'archivos' | 'solicitudes' | 'galeria' | 'comentarios'>('overview');

  let magBadge = '';
  if (project.magnitude === 'G') magBadge = 'bg-red-400/15 text-red-400 border-red-400/20';
  else if (project.magnitude === 'M') magBadge = 'bg-amber-400/15 text-amber-400 border-amber-400/20';
  else magBadge = 'bg-teal-400/15 text-teal-400 border-teal-400/20';

  return (
    <div className="flex-1 flex flex-col bg-bg overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="px-8 pt-8 pb-6 border-b border-border flex flex-col gap-6">
        <div className="flex justify-between items-start">
          <div className="max-w-md">
            <span className="text-[11px] text-teal-400 font-bold uppercase tracking-[0.2em] mb-2 block">Proyecto Focus Activo</span>
            <h2 className="text-5xl font-serif italic text-text-main leading-none mb-4">{project.name}</h2>
            <p className="text-sm text-text-muted leading-relaxed">
              📍 Cliente: <strong className="text-text-main">{project.client}</strong> · {project.code}
            </p>
          </div>

          <div className="flex gap-4">
             <div className="flex flex-col gap-2 bg-bg2 p-4 rounded-sm border border-border">
               <span className="text-[10px] text-text-dim uppercase tracking-widest block font-bold">Estado</span>
               <span className="text-[10px] font-bold px-3 py-1 rounded bg-bg4 text-text-main text-center uppercase tracking-wider">{project.status}</span>
             </div>
             
             <div className="flex flex-col gap-2 bg-bg2 p-4 rounded-sm border border-border">
               <span className="text-[10px] text-text-dim uppercase tracking-widest block font-bold">Magnitud</span>
               <span className={`text-[10px] font-bold px-3 py-1 rounded tracking-wider text-center ${project.magnitude === 'G' ? 'bg-red-500/20 text-red-400' : project.magnitude === 'M' ? 'bg-amber-500/20 text-amber-400' : 'bg-teal-500/20 text-teal-400'}`}>
                 {project.magnitude === 'G' ? 'GRANDE' : project.magnitude === 'M' ? 'MEDIANO' : 'CHICO'}
               </span>
             </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end items-center mt-4">
           {project.hasUrgentRequest && (
              <span className="bg-red-500/10 text-red-500 text-[10px] font-mono px-3 py-1.5 rounded border border-red-500/20 uppercase">
                ⚠ Solicitud urgente pendiente
              </span>
           )}
           <span className="text-[11px] text-text-muted font-mono bg-bg4 px-3 py-1.5 rounded">{project.budget}</span>
           
           <div className="flex gap-2 shrink-0 ml-auto hidden md:flex">
             <button className="bg-white/5 border border-white/10 text-text-main font-bold uppercase tracking-widest text-[10px] px-4 py-2.5 rounded-sm hover:bg-white/10 transition-colors">Targeta Reporte</button>
             <button className="bg-text-main text-black font-bold uppercase tracking-widest text-[10px] px-6 py-2.5 rounded-sm hover:bg-teal-400 transition-colors">Ver Presentador</button>
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border px-4 gap-1">
        <button onClick={() => setActiveTab('overview')} className={`text-xs px-2.5 py-2.5 flex items-center gap-1.5 font-medium border-b-2 transition-colors ${activeTab === 'overview' ? 'text-teal-400 border-teal-400' : 'text-text-muted border-transparent hover:text-text-main'}`}>
          <Info className="w-3.5 h-3.5" /> Resumen
        </button>
        <button onClick={() => setActiveTab('archivos')} className={`text-xs px-2.5 py-2.5 flex items-center gap-1.5 font-medium border-b-2 transition-colors ${activeTab === 'archivos' ? 'text-teal-400 border-teal-400' : 'text-text-muted border-transparent hover:text-text-main'}`}>
          <Paperclip className="w-3.5 h-3.5" /> Bóveda <span className="text-[9px] font-bold bg-red-500 text-white px-1.5 py-[1px] rounded-full">{project.files.length}</span>
        </button>
        <button onClick={() => setActiveTab('solicitudes')} className={`text-xs px-2.5 py-2.5 flex items-center gap-1.5 font-medium border-b-2 transition-colors ${activeTab === 'solicitudes' ? 'text-teal-400 border-teal-400' : 'text-text-muted border-transparent hover:text-text-main'}`}>
          <Mail className="w-3.5 h-3.5" /> Solicitudes <span className="text-[9px] font-bold bg-red-500 text-white px-1.5 py-[1px] rounded-full">{project.requests.length}</span>
        </button>
        <button onClick={() => setActiveTab('galeria')} className={`text-xs px-2.5 py-2.5 flex items-center gap-1.5 font-medium border-b-2 transition-colors ${activeTab === 'galeria' ? 'text-teal-400 border-teal-400' : 'text-text-muted border-transparent hover:text-text-main'}`}>
          <ImageIcon className="w-3.5 h-3.5" /> Galería
        </button>
        <button onClick={() => setActiveTab('comentarios')} className={`text-xs px-2.5 py-2.5 flex items-center gap-1.5 font-medium border-b-2 transition-colors ${activeTab === 'comentarios' ? 'text-teal-400 border-teal-400' : 'text-text-muted border-transparent hover:text-text-main'}`}>
          <MessageSquare className="w-3.5 h-3.5" /> Chat
        </button>
      </div>

      {/* Body */}
      <div className="p-[18px] flex flex-col gap-4">
        {activeTab === 'overview' && <OverviewTab project={project} />}
        {activeTab === 'archivos' && <ArchivosTab project={project} />}
        {activeTab === 'solicitudes' && <SolicitudesTab project={project} />}
        {activeTab === 'galeria' && <GaleriaTab project={project} />}
        {activeTab === 'comentarios' && <ComentariosTab project={project} />}
      </div>
    </div>
  );
}

function OverviewTab({ project }: { project: Project }) {
  return (
    <>
      <div className="flex flex-col gap-2">
         <div className="flex items-center gap-2 mb-1">
           <span className="text-[11px] font-semibold text-text-muted tracking-[0.04em] uppercase">Magnitud del proyecto</span>
         </div>
         <div className="flex items-center gap-2 bg-bg2 border border-border rounded-xl p-3">
            <div className="text-2xl mr-2">🔴</div>
            <div className="flex-1">
               <div className="text-xs font-semibold">{project.magnitude === 'G' ? 'GRANDE' : project.magnitude === 'M' ? 'MEDIANO' : 'CHICO'} — {project.budget}</div>
               <div className="text-[10px] text-text-muted">Umbral según tabulador · Tiempo estimado asignado</div>
            </div>
         </div>
      </div>

      <div className="flex flex-col gap-2">
         <div className="flex items-center gap-2 mb-1">
           <span className="text-[11px] font-semibold text-text-muted tracking-[0.04em] uppercase">Información del proyecto</span>
         </div>
         <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex flex-col gap-[2px]">
              <span className="text-[10px] text-text-dim uppercase tracking-[0.04em] font-semibold">Asesor</span>
              <span>{users[project.advisorId]?.name || 'N/A'}</span>
            </div>
            <div className="flex flex-col gap-[2px]">
              <span className="text-[10px] text-text-dim uppercase tracking-[0.04em] font-semibold">Estilo</span>
              <span>{project.style}</span>
            </div>
            <div className="flex flex-col gap-[2px]">
              <span className="text-[10px] text-text-dim uppercase tracking-[0.04em] font-semibold">Renders</span>
              <span>{project.rendersReq}</span>
            </div>
            <div className="flex flex-col gap-[2px]">
              <span className="text-[10px] text-text-dim uppercase tracking-[0.04em] font-semibold">Líneas Preferidas</span>
              <span>{project.lines}</span>
            </div>
         </div>
      </div>

      <div className="h-[1px] bg-border my-2"></div>

      <div className="flex flex-col gap-2">
         <div className="flex items-center gap-2 mb-1">
           <span className="text-[11px] font-semibold text-text-muted tracking-[0.04em] uppercase">Fases del Proyecto</span>
         </div>
         
         <div className="flex flex-col gap-[1px]">
           {project.timeline.map((phase, idx) => (
             <div key={phase.id} className="flex items-stretch gap-3">
               <div className="flex flex-col items-center w-5 shrink-0">
                 <div className={`w-3 h-3 rounded-full shrink-0 border-2 mt-1 ${phase.status === 'done' ? 'bg-teal-400 border-teal-400' : phase.status === 'active' ? 'bg-amber-400 border-amber-400' : 'bg-bg5 border-border2'}`}></div>
                 {idx < project.timeline.length - 1 && (
                   <div className="flex-1 w-[1.5px] bg-border2 mt-1"></div>
                 )}
               </div>
               <div className={`flex-1 bg-bg2 border rounded-[10px] p-2.5 mb-2 ${phase.status === 'done' ? 'opacity-65 border-border' : phase.status === 'active' ? 'border-teal-400 bg-teal-400/10' : phase.status === 'blocked' ? 'border-red-400/50' : 'border-border'}`}>
                 <div className="text-xs font-semibold mb-[2px]">{phase.title} {phase.status === 'active' && '← EN CURSO'}</div>
                 <div className="text-[11px] text-text-muted">{phase.subtitle}</div>
                 <div className={`text-[10px] mt-1.5 ${phase.isUrgent ? 'text-red-400' : 'text-text-dim'}`}>
                   {phase.metaMessage}
                 </div>
               </div>
             </div>
           ))}
         </div>
      </div>
    </>
  );
}

function ArchivosTab({ project }: { project: Project }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[11px] font-semibold text-text-muted tracking-[0.04em] uppercase flex-1">Archivos del proyecto</span>
        <button className="bg-transparent border border-border text-text-dim text-[10px] px-2 py-1 rounded-[6px] hover:bg-bg3 hover:text-text-muted transition-colors">+ Subir archivo</button>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {project.files.map(f => (
          <div key={f.id} className="bg-bg2 border border-border rounded-xl p-2.5 cursor-pointer hover:border-border2 hover:bg-bg3 transition-colors flex flex-col gap-1">
            <div className="text-2xl mb-1">
              {f.type === 'DWG' ? '📐' : f.type === 'SKP' ? '🏗' : f.type === 'PDF' ? '📄' : '🖼'}
            </div>
            <span className={`text-[9px] px-1.5 py-[1px] rounded-lg self-start ${f.type === 'DWG' ? 'bg-amber-400/15 text-amber-400' : f.type === 'SKP' ? 'bg-purple-500/15 text-purple-400' : f.type === 'PDF' ? 'bg-red-400/15 text-red-400' : 'bg-teal-400/15 text-teal-400'}`}>
              {f.type}
            </span>
            <div className="text-[11px] font-medium leading-snug break-all">{f.name}</div>
            <div className="text-[9px] text-text-dim">{f.size} · {f.date} · {f.author}</div>
          </div>
        ))}
      </div>
      
      <div className="mt-2 border border-dashed border-border2 rounded-xl p-4 text-center cursor-pointer text-text-dim text-[11px] hover:border-teal-400 hover:text-teal-400 hover:bg-teal-400/10 transition-colors">
        ↑ Arrastra archivos aquí · DWG, SKP, PDF, imágenes · máx 50MB por archivo
      </div>
    </div>
  );
}

function SolicitudesTab({ project }: { project: Project }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[11px] font-semibold text-text-muted tracking-[0.04em] uppercase flex-1">Solicitudes activas en este proyecto</span>
      </div>

      {project.requests.length === 0 ? (
        <div className="text-[11px] text-text-dim text-center p-4">No hay solicitudes activas para este proyecto.</div>
      ) : (
        project.requests.map(r => (
           <div key={r.id} className={`bg-bg2 border border-border rounded-xl p-3 ${r.type === 'URGENTE' ? 'border-l-[3px] border-l-red-500 pl-3' : 'border-l-[3px] border-l-amber-500 pl-3'}`}>
              <div className={`text-[9px] font-bold tracking-[0.06em] uppercase mb-1 ${r.type === 'URGENTE' ? 'text-red-400' : 'text-purple-400'}`}>
                {r.type === 'URGENTE' ? '🔴 URGENTE — MODIFICACIÓN' : r.type}
              </div>
              <div className="text-xs font-medium mb-1">{r.title}</div>
              <div className="text-[11px] text-text-muted leading-relaxed mb-2">{r.description}</div>
              <div className="flex items-center gap-2 mt-2">
                 <span className="text-[10px] text-text-dim">📤 {r.author} · {r.date}</span>
                 <div className="flex gap-1.5 ml-auto">
                    <button className="bg-teal-400/15 text-teal-400 border border-teal-400/30 font-sans text-[11px] px-2.5 py-1 rounded-[6px] hover:bg-teal-400 hover:text-bg2 transition-colors">Aceptar y responder</button>
                    <button className="bg-transparent text-text-dim border border-border font-sans text-[11px] px-2.5 py-1 rounded-[6px] hover:text-red-400 hover:border-red-400 transition-colors">Pedir más info</button>
                 </div>
              </div>
           </div>
        ))
      )}
    </div>
  );
}

function GaleriaTab({ project }: { project: Project }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[11px] font-semibold text-text-muted tracking-[0.04em] uppercase flex-1">Galería de renders e imágenes</span>
        <button className="bg-transparent border border-border text-text-dim text-[10px] px-2 py-1 rounded-[6px] hover:bg-bg3 hover:text-text-muted transition-colors">+ Subir</button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {project.images.map((img, i) => (
           <div key={i} className="aspect-[4/3] bg-bg3 border border-border rounded-xl cursor-pointer flex items-center justify-center text-3xl relative overflow-hidden hover:border-border2 transition-colors">
              {img.includes('render') ? '🖥' : '🪑'}
              <div className="absolute bottom-0 left-0 right-0 bg-[#0d1117]/85 px-2 py-1 text-[9px] text-text-muted truncate">
                {img}
              </div>
           </div>
        ))}
         <div className="aspect-[4/3] bg-transparent border border-dashed border-text-dim rounded-xl cursor-pointer flex flex-col items-center justify-center text-text-dim hover:text-teal-400 hover:border-teal-400 hover:bg-teal-400/10 transition-colors gap-1 text-[11px]">
            <span>+</span>
            <span>Subir</span>
         </div>
      </div>
    </div>
  );
}

function ComentariosTab({ project }: { project: Project }) {
  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[11px] font-semibold text-text-muted tracking-[0.04em] uppercase flex-1">Chat interno del proyecto</span>
      </div>

      <div className="flex-1 flex flex-col gap-3">
        {project.comments.map(c => {
           const u = users[c.authorId];
           return (
             <div key={c.id} className="flex gap-2">
                <div className={`w-[26px] h-[26px] rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${u?.avatarColor || 'bg-bg3 text-text-muted'}`}>
                  {u ? u.initials : '??'}
                </div>
                <div className="flex-1">
                   <div className="text-[10px] text-text-dim mb-[2px]">
                     <strong className="text-text-muted">{c.authorName}</strong> · {c.date}
                   </div>
                   <div className="text-xs text-text-main leading-relaxed bg-bg2 border border-border rounded-xl px-2.5 py-2">
                     {c.text}
                   </div>
                </div>
             </div>
           );
        })}
      </div>

      <div className="flex gap-2 mt-4 items-end">
         <div className={`w-[26px] h-[26px] rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${users['kt'].avatarColor} mb-2`}>
           {users['kt'].initials}
         </div>
         <textarea 
           placeholder="Escribe aquí... todo queda registrado en CEREBRO" 
           className="flex-1 bg-bg2 border border-border text-text-main font-sans text-xs px-2.5 py-2 rounded-xl resize-none h-[60px] focus:outline-none focus:border-teal-400 transition-colors"
         ></textarea>
         <button className="bg-teal-400 border-none text-slate-900 font-sans text-[11px] font-semibold px-3 py-1.5 rounded-[6px] cursor-pointer mb-2">
           Enviar
         </button>
      </div>
    </div>
  );
}
