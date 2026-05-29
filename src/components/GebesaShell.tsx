import React, { useState, useRef, useEffect } from 'react';
import { Home, Briefcase, Settings, Target, Users, LayoutDashboard, ChevronRight, ChevronDown, Sun, Plus, LayoutGrid, X } from 'lucide-react';
import GebesaPresenterMain from './wizard/GebesaPresenterMain';

export type ProyectistaSubView =
  | 'projects'
  | 'inbox'
  | 'solicitudes'
  | 'chat'
  | 'calendar'
  | 'entregables'
  | 'boveda'
  | 'vacaciones';

interface GebesaShellProps {
  currentView: string;
  onViewChange: (view: string) => void;
  proyectistaSubView: ProyectistaSubView;
  onProyectistaSubViewChange: (view: ProyectistaSubView) => void;
  children?: React.ReactNode;
}

export function GebesaShell({
  currentView,
  onViewChange,
  proyectistaSubView,
  onProyectistaSubViewChange,
  children
}: GebesaShellProps) {
  // Local active subnav state for Ventas view only
  const [ventasActiveSubNav, setVentasActiveSubNav] = useState('Mis Negocios (Home)');
  const [direccionSubView, setDireccionSubView] = useState('dashboard');
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Sync iframe role when currentView changes
  useEffect(() => {
    if (!isIframeLoaded || !iframeRef.current || !iframeRef.current.contentWindow) return;
    
    let targetRole = 'ventas';
    if (currentView === 'Proyectos') targetRole = 'proyectista';
    else if (currentView === 'Direccion') targetRole = 'master';
    
    iframeRef.current.contentWindow.postMessage({ type: 'SWITCH_ROLE', role: targetRole }, '*');

    // Also sync current subviews immediately upon role change
    if (currentView === 'Proyectos') {
      let targetSection = 'proyectos';
      if (proyectistaSubView === 'inbox') targetSection = 'inbox';
      else if (proyectistaSubView === 'projects') targetSection = 'proyectos';
      else if (proyectistaSubView === 'solicitudes') targetSection = 'solicitudes';
      else if (proyectistaSubView === 'chat') targetSection = 'chat';
      else if (proyectistaSubView === 'calendar') targetSection = 'calendar';
      else if (proyectistaSubView === 'entregables') targetSection = 'entregables';
      else if (proyectistaSubView === 'boveda') targetSection = 'boveda';
      else if (proyectistaSubView === 'vacaciones') targetSection = 'vacaciones';
      iframeRef.current.contentWindow.postMessage({ type: 'NAVIGATE_SECTION', section: targetSection }, '*');
    } else if (currentView === 'Direccion') {
      iframeRef.current.contentWindow.postMessage({ type: 'NAVIGATE_SECTION', section: direccionSubView }, '*');
    }
  }, [currentView, isIframeLoaded]);

  // Sync iframe section when proyectistaSubView changes
  useEffect(() => {
    if (!isIframeLoaded || !iframeRef.current || !iframeRef.current.contentWindow) return;
    if (currentView === 'Proyectos') {
      let targetSection = 'proyectos';
      if (proyectistaSubView === 'inbox') targetSection = 'inbox';
      else if (proyectistaSubView === 'projects') targetSection = 'proyectos';
      else if (proyectistaSubView === 'solicitudes') targetSection = 'solicitudes';
      else if (proyectistaSubView === 'chat') targetSection = 'chat';
      else if (proyectistaSubView === 'calendar') targetSection = 'calendar';
      else if (proyectistaSubView === 'entregables') targetSection = 'entregables';
      else if (proyectistaSubView === 'boveda') targetSection = 'boveda';
      else if (proyectistaSubView === 'vacaciones') targetSection = 'vacaciones';
      
      iframeRef.current.contentWindow.postMessage({ type: 'NAVIGATE_SECTION', section: targetSection }, '*');
    }
  }, [proyectistaSubView, currentView, isIframeLoaded]);

  // Sync iframe section when direccionSubView changes
  useEffect(() => {
    if (!isIframeLoaded || !iframeRef.current || !iframeRef.current.contentWindow) return;
    if (currentView === 'Direccion') {
      iframeRef.current.contentWindow.postMessage({ type: 'NAVIGATE_SECTION', section: direccionSubView }, '*');
    }
  }, [direccionSubView, currentView, isIframeLoaded]);

  // Hear message back from inside the iframe (e.g. role-selector changes inside)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;
      if (event.data.type === 'ENV_CHANGE') {
        const env = event.data.environment;
        if (env === 'Proyectista' && currentView !== 'Proyectos') {
          onViewChange('Proyectos');
        } else if (env === 'Ventas' && currentView !== 'Ventas') {
          onViewChange('Ventas');
        } else if (env === 'Direccion' && currentView !== 'Direccion') {
          onViewChange('Direccion');
        }
      } else if (event.data.type === 'VENTAS_SUBNAV_CHANGE') {
        setVentasActiveSubNav(event.data.subNav);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [currentView, onViewChange, setVentasActiveSubNav]);

  const handleIframeLoad = () => {
    setIsIframeLoaded(true);
    // Give document a tiny fraction to prepare listeners
    setTimeout(() => {
      if (!iframeRef.current || !iframeRef.current.contentWindow) return;
      
      // 1. Sync active role
      let targetRole = 'ventas';
      if (currentView === 'Proyectos') targetRole = 'proyectista';
      else if (currentView === 'Direccion') targetRole = 'master';
      iframeRef.current.contentWindow.postMessage({ type: 'SWITCH_ROLE', role: targetRole }, '*');

      // 2. Sync open sections if we are in Proyectos or Direccion
      if (currentView === 'Proyectos') {
        let targetSection = 'proyectos';
        if (proyectistaSubView === 'inbox') targetSection = 'inbox';
        else if (proyectistaSubView === 'projects') targetSection = 'proyectos';
        else if (proyectistaSubView === 'solicitudes') targetSection = 'solicitudes';
        else if (proyectistaSubView === 'chat') targetSection = 'chat';
        else if (proyectistaSubView === 'calendar') targetSection = 'calendar';
        else if (proyectistaSubView === 'entregables') targetSection = 'entregables';
        else if (proyectistaSubView === 'boveda') targetSection = 'boveda';
        else if (proyectistaSubView === 'vacaciones') targetSection = 'vacaciones';
        iframeRef.current.contentWindow.postMessage({ type: 'NAVIGATE_SECTION', section: targetSection }, '*');
      } else if (currentView === 'Direccion') {
        iframeRef.current.contentWindow.postMessage({ type: 'NAVIGATE_SECTION', section: direccionSubView }, '*');
      }
    }, 80);
  };

  return (
    <div className="flex h-full w-full bg-[#f8f9fa] overflow-hidden text-gray-800 font-sans">
      {/* Gebesa Sidebar */}
      <div className="w-[260px] bg-white border-r border-gray-200 flex flex-col shrink-0 relative z-20 animate-in slide-in-from-left duration-300">
        
        {/* Logo Area */}
        <div className="h-[72px] px-6 flex items-center justify-between border-b border-transparent shrink-0">
          <div className="flex flex-col">
            <span className="text-[32px] font-bold leading-none tracking-tight text-gray-900 font-sans" style={{ letterSpacing: '-1px' }}>Gebesa</span>
            <span className="text-[7.5px] uppercase tracking-[0.2em] text-gray-500 font-semibold mt-1">Creating Amazing Spaces</span>
          </div>
          <button className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50">
            <ChevronRight className="w-3 h-3 rotate-180" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-5 px-3 flex flex-col gap-1">
          <NavItem icon={<Home className="w-[18px] h-[18px]"/>} label="Inicio" />
          <NavItem icon={<Briefcase className="w-[18px] h-[18px]"/>} label="Comercial" hasChevron />
          <NavItem icon={<Settings className="w-[18px] h-[18px]"/>} label="Operaciones" hasChevron />
          
          <div className="mt-2 flex flex-col">
            <NavItem icon={<Target className="w-[18px] h-[18px]"/>} label="Cerebro" hasChevron expanded isFolder />
            <div className="flex flex-col ml-4 mt-1 space-y-1 border-l pl-2">
              {currentView === 'Ventas' ? (
                <>
                  <SubNavItem 
                    label="Mis Negocios (Home)" 
                    active={ventasActiveSubNav === 'Mis Negocios (Home)'} 
                    onClick={() => {
                      setVentasActiveSubNav('Mis Negocios (Home)');
                      onViewChange('Ventas');
                    }} 
                  />
                  <SubNavItem 
                    label="Mis Presentaciones" 
                    active={ventasActiveSubNav === 'Mis Presentaciones'} 
                    onClick={() => {
                      setVentasActiveSubNav('Mis Presentaciones');
                      onViewChange('Ventas');
                    }} 
                  />
                  <SubNavItem 
                    label="Agenda de Proyectos" 
                    active={ventasActiveSubNav === 'Agenda de Proyectos'} 
                    onClick={() => {
                      setVentasActiveSubNav('Agenda de Proyectos');
                      onViewChange('Ventas');
                    }} 
                  />
                </>
              ) : currentView === 'Proyectos' ? (
                <>
                  <div className="text-[10px] text-gray-400 mt-2 ml-2 font-bold uppercase tracking-wider">Recibir</div>
                  <SubNavItem 
                    label="Bandeja de proyectos nuevos" 
                    active={proyectistaSubView === 'inbox'} 
                    onClick={() => onProyectistaSubViewChange('inbox')} 
                  />
                  
                  <div className="text-[10px] text-gray-400 mt-2 ml-2 font-bold uppercase tracking-wider">Trabajar</div>
                  <SubNavItem 
                    label="Mis Proyectos" 
                    active={proyectistaSubView === 'projects'} 
                    onClick={() => onProyectistaSubViewChange('projects')} 
                  />
                  <SubNavItem 
                    label="Solicitudes entrantes" 
                    active={proyectistaSubView === 'solicitudes'} 
                    onClick={() => onProyectistaSubViewChange('solicitudes')} 
                  />
                  <SubNavItem 
                    label="Chat coordinación" 
                    active={proyectistaSubView === 'chat'} 
                    onClick={() => onProyectistaSubViewChange('chat')} 
                  />
                  
                  <div className="text-[10px] text-gray-400 mt-2 ml-2 font-bold uppercase tracking-wider">Entregar</div>
                  <SubNavItem 
                    label="Mi Calendario" 
                    active={proyectistaSubView === 'calendar'} 
                    onClick={() => onProyectistaSubViewChange('calendar')} 
                  />
                  <SubNavItem 
                    label="Bóveda técnica" 
                    active={proyectistaSubView === 'boveda'} 
                    onClick={() => onProyectistaSubViewChange('boveda')} 
                  />
                  
                  <div className="text-[10px] text-gray-400 mt-2 ml-2 font-bold uppercase tracking-wider">Gestión</div>
                  <SubNavItem 
                    label="Modo Vacaciones" 
                    active={proyectistaSubView === 'vacaciones'} 
                    onClick={() => onProyectistaSubViewChange('vacaciones')} 
                  />
                </>
              ) : (
                <>
                  <SubNavItem 
                    label="📊 Dashboard Ejecutivo" 
                    active={direccionSubView === 'dashboard'} 
                    onClick={() => setDireccionSubView('dashboard')} 
                  />
                  <SubNavItem 
                    label="🌐 Dashboard Nacional" 
                    active={direccionSubView === 'dashboard_nacional'} 
                    onClick={() => setDireccionSubView('dashboard_nacional')} 
                  />
                  <SubNavItem 
                    label="📊 Reportes y Rendimiento" 
                    active={direccionSubView === 'reportes'} 
                    onClick={() => setDireccionSubView('reportes')} 
                  />
                  <SubNavItem 
                    label="📈 Semáforo de Ocupación" 
                    active={direccionSubView === 'semaforo'} 
                    onClick={() => setDireccionSubView('semaforo')} 
                  />
                  <SubNavItem 
                    label="📋 Kanban" 
                    active={direccionSubView === 'kanban'} 
                    onClick={() => setDireccionSubView('kanban')} 
                  />
                  <SubNavItem 
                    label="🏗️ Gestión de Proyectos" 
                    active={direccionSubView === 'proyectos'} 
                    onClick={() => setDireccionSubView('proyectos')} 
                  />
                  <SubNavItem 
                    label="🧑‍🤝‍🧑 Gestión de Equipo" 
                    active={direccionSubView === 'equipo'} 
                    onClick={() => setDireccionSubView('equipo')} 
                  />
                </>
              )}
            </div>
          </div>

          <NavItem icon={<Users className="w-[18px] h-[18px]"/>} label="Personas" hasChevron />
          <NavItem icon={<LayoutDashboard className="w-[18px] h-[18px]"/>} label="Dashboard PO" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#f0f2f5]">
        {/* Inner layout wrapper */}
        <div className="flex-1 overflow-hidden relative flex bg-bg text-text-main m-4 rounded-b-xl border border-border shadow-2xl rounded-t-lg">
          {currentView === 'Ventas' && ventasActiveSubNav === 'Mis Presentaciones' ? (
            <GebesaPresenterMain />
          ) : (
            <iframe 
              ref={iframeRef} 
              src={currentView === 'Ventas' && ventasActiveSubNav === 'Agenda de Proyectos' ? '/cerebro-calendar.html' : '/cerebro.html'} 
              className="w-full h-full border-none bg-[#0d1117]" 
              title="Cerebro App" 
              onLoad={handleIframeLoad}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, hasChevron, expanded, isFolder }: any) {
  return (
    <button className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-[13.5px] font-medium transition-colors ${isFolder ? 'bg-teal-50 text-teal-700' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'} mb-0.5`}>
      <div className={`shrink-0 ${isFolder ? 'text-teal-600' : 'text-gray-500'}`}>{icon}</div>
      <span className="flex-1 text-left">{label}</span>
      {hasChevron && (
        <ChevronDown className={`w-4 h-4 transition-transform ${isFolder ? 'text-teal-600' : 'text-gray-400'} ${expanded ? '' : '-rotate-90'}`} />
      )}
    </button>
  );
}

function SubNavItem({ label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-[13.2px] rounded-md transition-colors ${active ? 'bg-teal-500 text-white font-semibold shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium'}`}
    >
      <div className={`w-2 h-2 rounded-full border-[1.5px] ${active ? 'border-white bg-transparent' : 'border-gray-400 bg-transparent'}`}></div>
      <span>{label}</span>
    </button>
  );
}

function Tab({ label, active }: any) {
  return (
    <div className={`group flex items-center gap-3 px-4 h-[38px] rounded-t-lg min-w-[160px] max-w-[220px] cursor-pointer select-none transition-colors border-t border-x ${active ? 'bg-[#f0f2f5] border-transparent text-gray-800' : 'bg-transparent border-transparent text-gray-500 hover:bg-gray-50'}`}>
       <div className={`w-2 h-2 rounded-full border border-gray-400 hidden`}></div>
       {active && <div className="w-2.5 h-2.5 rounded-full border-[2px] border-gray-400 opacity-60"></div>}
       {!active && <div className="w-2.5 h-2.5 rounded-full border-[2px] border-gray-300"></div>}
       <span className="flex-1 truncate text-[13px] font-medium">{label}</span>
       <button className={`w-5 h-5 flex items-center justify-center rounded-sm transition-all ${active ? 'text-gray-400 hover:bg-gray-200 hover:text-gray-700' : 'text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-gray-200 hover:text-gray-700'}`}>
          <X className="w-3.5 h-3.5" />
       </button>
    </div>
  )
}
