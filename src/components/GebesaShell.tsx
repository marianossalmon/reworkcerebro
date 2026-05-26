import React, { useState } from 'react';
import { Home, Briefcase, Settings, Target, Users, LayoutDashboard, ChevronRight, ChevronDown, Sun, Plus, LayoutGrid, X } from 'lucide-react';

export function GebesaShell() {
  const [iframeSrc, setIframeSrc] = useState('/cerebro.html');
  const [activeSubNav, setActiveSubNav] = useState('Mis Negocios (Home)');

  const handleNavClick = (label: string, url: string) => {
    setActiveSubNav(label);
    setIframeSrc(url);
  };

  return (
    <div className="flex h-full w-full bg-[#f8f9fa] overflow-hidden text-gray-800 font-sans">
      {/* Gebesa Sidebar */}
      <div className="w-[260px] bg-white border-r border-gray-200 flex flex-col shrink-0 relative z-20">
        
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
               <SubNavItem 
                 label="Mis Negocios (Home)" 
                 active={activeSubNav === 'Mis Negocios (Home)'}
                 onClick={() => handleNavClick('Mis Negocios (Home)', '/cerebro.html')} 
               />
               <SubNavItem 
                 label="Mis Presentaciones" 
                 active={activeSubNav === 'Mis Presentaciones'}
                 onClick={() => handleNavClick('Mis Presentaciones', '/cerebro.html')} 
               />
               <SubNavItem 
                 label="Agenda de Proyectos" 
                 active={activeSubNav === 'Agenda de Proyectos'}
                 onClick={() => handleNavClick('Agenda de Proyectos', '/cerebro-calendar.html')} 
               />
            </div>
          </div>

          <NavItem icon={<Users className="w-[18px] h-[18px]"/>} label="Personas" hasChevron />
          <NavItem icon={<LayoutDashboard className="w-[18px] h-[18px]"/>} label="Dashboard PO" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#f0f2f5]">
        
        {/* Inner layout (Cerebro App embed) */}
        <div className="flex-1 overflow-hidden relative flex bg-bg text-text-main m-4 mt-6 rounded-b-xl border border-border shadow-2xl rounded-t-lg">
           <iframe src={iframeSrc} className="w-full h-full border-none bg-[#0d1117]" title="Cerebro App" />
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
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-[13px] rounded-md transition-colors ${active ? 'bg-teal-500 text-white font-medium shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium'}`}
    >
      <div className={`w-2 h-2 rounded-full border-[1.5px] ${active ? 'border-white bg-transparent' : 'border-gray-400 bg-transparent'}`}></div>
      {label}
    </button>
  )
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
