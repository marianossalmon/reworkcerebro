import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  UserCheck, 
  ShieldAlert, 
  Filter, 
  Clock, 
  Calendar as CalendarIcon, 
  MapPin, 
  Sliders, 
  Layers, 
  Search,
  Check,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

// Interfaces aligned with types.ts
interface Project {
  id: string;
  cliente: string;
  subCliente: string;
  monto: string;
  magn: 'Grande' | 'Mediano' | 'Chico';
  proyectista: string;
  etapa: string;
  urgente: boolean;
  diasSla: number;
  plaza: 'Torreón' | 'Gómez Palacio' | 'Monterrey' | 'Centro';
  estancamientoDias: number;
  motivoBloqueo?: string;
  desarrolloDias: number; // For Gantt
}

// Designers active list
const DESIGNERS = [
  { id: 'or', name: 'Oscar Rodríguez', location: 'Monterrey', maxPoints: 6 },
  { id: 'kc', name: 'Karla Cerón', location: 'Centro', maxPoints: 6 },
  { id: 'kt', name: 'Karen Tovar', location: 'Centro', maxPoints: 6 },
  { id: 'rv', name: 'Rodrigo Vergara', location: 'Torreón', maxPoints: 6 }
];

export function DireccionView() {
  const [activeRole, setActiveRole] = useState<'Direccion' | 'Master'>('Master');
  const [selectedRegion, setSelectedRegion] = useState<string>('all'); // all, Torreón, Gómez Palacio, Monterrey, Centro
  const [selectedPeriod, setSelectedPeriod] = useState<'semanal' | 'mensual'>('mensual');
  
  // Component 3 specific Filters
  const [filterMagnitud, setFilterMagnitud] = useState<string>('all'); // all, Grande, Mediano, Chico
  const [filterEstancamiento, setFilterEstancamiento] = useState<string>('all'); // all, +3, +5
  const [filterPlazaTable, setFilterPlazaTable] = useState<string>('all'); // all, Torreón, Gómez Palacio, Monterrey, Centro
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Project reassign state
  const [reassigningProj, setReassigningProj] = useState<Project | null>(null);

  // Initializing mock projects (using stored 'vProjects' from localStorage or loading the 18 cases consolidated)
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    // 18 consolidated high fidelity cases simulating reality
    const initialSimulatedCases: Project[] = [
      { id: 'LAG-201', cliente: 'Cimaco', subCliente: 'Plaza Cuatro Caminos', monto: '$1,250,000', magn: 'Grande', proyectista: 'Karen Tovar', etapa: 'REV. AJUSTES', urgente: true, diasSla: 0, plaza: 'Torreón', estancamientoDias: 5, motivoBloqueo: 'Retraso de planos ejecutivos por cambios estructurales', desarrolloDias: 12 },
      { id: 'CDMX-202', cliente: 'Novartis', subCliente: 'Corporativo Santa Fe', monto: '$2,800,000', magn: 'Grande', proyectista: 'Karla Cerón', etapa: 'RENDER ESTANCADO', urgente: false, diasSla: 1, plaza: 'Centro', estancamientoDias: 4, motivoBloqueo: 'Bucle de ajustes en especificación de acabados', desarrolloDias: 20 },
      { id: 'MTY-203', cliente: 'Femsa', subCliente: 'Corporativo Monterrey', monto: '$3,450,000', magn: 'Grande', proyectista: 'Oscar Rodríguez', etapa: 'BLOQUEADO', urgente: true, diasSla: -1, plaza: 'Monterrey', estancamientoDias: 6, motivoBloqueo: 'Esperando confirmación del asesor para medidas de ductos', desarrolloDias: 25 },
      { id: 'GOM-204', cliente: 'Grupo Nuvis', subCliente: 'Nave Industrial', monto: '$450,000', magn: 'Mediano', proyectista: 'Rodrigo Vergara', etapa: 'ESP. MEDIDAS', urgente: false, diasSla: 2, plaza: 'Gómez Palacio', estancamientoDias: 3, motivoBloqueo: 'Retraso en renderizado por cambio de texturas', desarrolloDias: 8 },
      { id: 'LAG-205', cliente: 'Lala', subCliente: 'Complejo Industrial', monto: '$1,150,000', magn: 'Mediano', proyectista: 'Oscar Rodríguez', etapa: 'SIN BRIEF', urgente: true, diasSla: 0, plaza: 'Torreón', estancamientoDias: 5, motivoBloqueo: 'Falta de levantamiento físico de nave', desarrolloDias: 10 },
      { id: 'CDMX-206', cliente: 'Banorte', subCliente: 'Sucursal Polanco', monto: '$180,000', magn: 'Chico', proyectista: 'Karla Cerón', etapa: 'REV. PRESUPUESTO', urgente: false, diasSla: 3, plaza: 'Centro', estancamientoDias: 4, motivoBloqueo: 'Esquema preliminar rechazado por presupuesto', desarrolloDias: 5 },
      { id: 'MTY-207', cliente: 'Cemex', subCliente: 'Planta Monterrey', monto: '$4,200,000', magn: 'Grande', proyectista: 'Rodrigo Vergara', etapa: 'BLOQUEADO', urgente: false, diasSla: 1, plaza: 'Monterrey', estancamientoDias: 3, motivoBloqueo: 'Falta de aprobación de catálogo de mobiliario', desarrolloDias: 30 },
      { id: 'QRO-208', cliente: 'Bombardier', subCliente: 'Oficinas Administrativas', monto: '$2,100,000', magn: 'Grande', proyectista: 'Karen Tovar', etapa: 'RENDER ESTANCADO', urgente: true, diasSla: 0, plaza: 'Centro', estancamientoDias: 5, motivoBloqueo: 'Bucle de ajustes en especificación de acabados', desarrolloDias: 18 },
      { id: 'GOM-209', cliente: 'Peñoles', subCliente: 'Área Operativa', monto: '$1,980,000', magn: 'Grande', proyectista: 'Rodrigo Vergara', etapa: 'ESP. CAMBIOS', urgente: false, diasSla: 1, plaza: 'Gómez Palacio', estancamientoDias: 4, motivoBloqueo: 'Cambios drásticos en la distribución del área de control', desarrolloDias: 16 },
      { id: 'CDMX-210', cliente: 'AstraZeneca', subCliente: 'Laboratorios', monto: '$620,000', magn: 'Mediano', proyectista: 'Karla Cerón', etapa: 'VALID. INGENIERÍA', urgente: false, diasSla: 2, plaza: 'Centro', estancamientoDias: 3, motivoBloqueo: 'Retraso en validación de ingeniería interna', desarrolloDias: 9 },
      { id: 'MTY-211', cliente: 'Steelcase Co.', subCliente: 'Showroom Mty', monto: '$890,000', magn: 'Mediano', proyectista: 'Oscar Rodríguez', etapa: 'ESP. MATER.', urgente: true, diasSla: 0, plaza: 'Monterrey', estancamientoDias: 5, motivoBloqueo: 'Espera de respuesta de importaciones para cotizar acabados', desarrolloDias: 14 },
      { id: 'LAG-212', cliente: 'Tec de Monterrey', subCliente: 'Campus Laguna', monto: '$2,650,000', magn: 'Grande', proyectista: 'Rodrigo Vergara', etapa: 'BLOQUEADO', urgente: true, diasSla: -2, plaza: 'Torreón', estancamientoDias: 6, motivoBloqueo: 'Ajuste por cambios de reglamento y pasillos', desarrolloDias: 22 },
      { id: 'CDMX-213', cliente: 'SAT Centro', subCliente: 'Oficinas Recaudación', monto: '$3,100,000', magn: 'Grande', proyectista: 'Karen Tovar', etapa: 'REV. REGLAS', urgente: false, diasSla: 1, plaza: 'Centro', estancamientoDias: 4, motivoBloqueo: 'Levantamiento dimensional desajustado por cambios en obra', desarrolloDias: 24 },
      { id: 'QRO-214', cliente: 'Scania', subCliente: 'Corporativo Querétaro', monto: '$130,000', magn: 'Chico', proyectista: 'Karla Cerón', etapa: 'FALTA INFO', urgente: false, diasSla: 2, plaza: 'Centro', estancamientoDias: 3, motivoBloqueo: 'Asesor no entrega datos de tomas de corriente', desarrolloDias: 4 },
      { id: 'GOM-215', cliente: 'Chilchota', subCliente: 'Oficinas Administración', monto: '$280,000', magn: 'Mediano', proyectista: 'Rodrigo Vergara', etapa: 'ESP. MESA', urgente: true, diasSla: 0, plaza: 'Gómez Palacio', estancamientoDias: 5, motivoBloqueo: 'Se solicitó mesa adicional no contemplada en el brief', desarrolloDias: 7 },
      { id: 'LAG-216', cliente: 'Alfa de Torreón', subCliente: 'Oficina Comercial', monto: '$75,000', magn: 'Chico', proyectista: 'Karen Tovar', etapa: 'NDA PENDIENTE', urgente: false, diasSla: 3, plaza: 'Torreón', estancamientoDias: 4, motivoBloqueo: 'Firma de contrato de confidencialidad técnico pendiente', desarrolloDias: 4 },
      { id: 'MTY-217', cliente: 'Kia Motors', subCliente: 'Nave Apodaca', monto: '$5,120,000', magn: 'Grande', proyectista: 'Oscar Rodríguez', etapa: 'RENDER ESTANCADO', urgente: true, diasSla: 0, plaza: 'Monterrey', estancamientoDias: 5, motivoBloqueo: 'Bucle de ajustes en especificación de acabados', desarrolloDias: 28 },
      { id: 'QRO-218', cliente: 'Kellogg\'s', subCliente: 'Planta Alimentos', monto: '$410,000', magn: 'Mediano', proyectista: 'Karla Cerón', etapa: 'ESP. SEGURIDAD', urgente: false, diasSla: 2, plaza: 'Centro', estancamientoDias: 3, motivoBloqueo: 'Pendiente respuesta de planta sobre salidas de emergencia', desarrolloDias: 11 }
    ];

    // Synchronize with LocalStorage if possible to maintain state, or save
    const stored = localStorage.getItem('vProjects');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed) && parsed.length > 0) {
          // Adapt CRM internal projects into our Direction View format
          const formattedFromStorage: Project[] = parsed.map((p: any, i: number) => {
            // Give specific plazas according to project codes
            let plazaMapByCode: 'Torreón' | 'Gómez Palacio' | 'Monterrey' | 'Centro' = 'Centro';
            if (p.id.startsWith('LAG')) plazaMapByCode = 'Torreón';
            else if (p.id.startsWith('MTY')) plazaMapByCode = 'Monterrey';
            else if (p.id.startsWith('QRO') || p.id.startsWith('CDMX')) plazaMapByCode = 'Centro';

            return {
              id: p.id || `PRJ-${100 + i}`,
              cliente: p.cliente || 'Proyecto Activo',
              subCliente: p.subCliente || 'Subcliente Corporativo',
              monto: p.monto || '$500,000',
              magn: p.magn === 'Grande' ? 'Grande' : p.magn === 'Chico' ? 'Chico' : 'Mediano',
              proyectista: p.proyectista || 'Unassigned',
              etapa: p.etapa || 'EN PROCESO',
              urgente: !!p.urgente,
              diasSla: p.diasSla || 5,
              plaza: plazaMapByCode,
              estancamientoDias: !!p.urgente ? 4 : 1,
              motivoBloqueo: p.status === 'Estancado' || !!p.urgente ? 'Validación de propuesta requerida' : undefined,
              desarrolloDias: p.magn === 'Grande' ? 18 : p.magn === 'Mediano' ? 10 : 5
            };
          });

          // Mix them up, filtering out duplicates
          const uniqueIds = new Set(formattedFromStorage.map(x => x.id));
          const consolidated = [
            ...formattedFromStorage,
            ...initialSimulatedCases.filter(x => !uniqueIds.has(x.id))
          ];
          setProjects(consolidated);
          return;
        }
      } catch (err) {
        console.error("Local storage parsing failed", err);
      }
    }
    
    // Fallback to purely simulated cases
    setProjects(initialSimulatedCases);
  }, []);

  // Save projects change to local storage to sync technical workspace
  const syncToGlobalWorkspace = (updatedProjects: Project[]) => {
    setProjects(updatedProjects);
    
    const stored = localStorage.getItem('vProjects');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed)) {
          // Sync reassignments back to CRM format array
          const remapped = parsed.map((p: any) => {
            const match = updatedProjects.find(up => up.id === p.id);
            if (match) {
              return {
                ...p,
                proyectista: match.proyectista,
                urgente: match.urgente,
                diasSla: match.diasSla
              };
            }
            return p;
          });
          localStorage.setItem('vProjects', JSON.stringify(remapped));
          
          // Let the system in the iframe know about updates
          window.postMessage({ type: 'VENTAS_SUBNAV_CHANGE', subNav: 'Agenda de Proyectos' }, '*');
        }
      } catch (e) {
        console.error("Error writing sync back", e);
      }
    }
  };

  // Reassignment Handler
  const reassignProjectToDesigner = (projectId: string, designerName: string) => {
    const updated = projects.map(p => {
      if (p.id === projectId) {
        return { ...p, proyectista: designerName };
      }
      return p;
    });
    syncToGlobalWorkspace(updated);
    setReassigningProj(null);
  };

  // Toggle Urgency
  const handleToggleUrgency = (projectId: string) => {
    if (activeRole !== 'Master') return;
    const updated = projects.map(p => {
      if (p.id === projectId) {
        return { ...p, urgente: !p.urgente };
      }
      return p;
    });
    syncToGlobalWorkspace(updated);
  };

  // SLA Courtesies Addition
  const handleAddSlaCourtesyDays = (projectId: string, days: number) => {
    if (activeRole !== 'Master') return;
    const updated = projects.map(p => {
      if (p.id === projectId) {
        return { ...p, diasSla: p.diasSla + days };
      }
      return p;
    });
    syncToGlobalWorkspace(updated);
  };

  // FILTRAJE DE PROYECTOS según Región
  const filteredProjectsByRegion = useMemo(() => {
    if (selectedRegion === 'all') return projects;
    // LAG is Torreón, Centro contains CDMX / QRO
    if (selectedRegion === 'LAG') return projects.filter(p => p.plaza === 'Torreón' || p.plaza === 'Gómez Palacio');
    if (selectedRegion === 'MTY') return projects.filter(p => p.plaza === 'Monterrey');
    if (selectedRegion === 'Centro') return projects.filter(p => p.plaza === 'Centro');
    return projects;
  }, [projects, selectedRegion]);

  // COMPONENTE 1: CALCULO DE KPIS REACTIVOS
  const kpis = useMemo(() => {
    const actTotal = filteredProjectsByRegion.length || 1;
    
    // 1. Pipeline financiero en tránsito: sumatoria del valor financiero
    let totalPipeline = 0;
    filteredProjectsByRegion.forEach(p => {
      const numericVal = parseInt(p.monto.replace(/[^0-9]/g, ''), 10) || 0;
      totalPipeline += numericVal;
    });
    const formattedPipeline = totalPipeline >= 1000000 
      ? `$${(totalPipeline / 1000000).toFixed(2)}M MXN` 
      : `$${(totalPipeline / 1000).toFixed(0)}k MXN`;

    // 2. Índice de Salud de la Red (PHI): % de proyectos activos libres de bloqueos o alertas críticas
    // Un proyecto está saludable si no tiene urgencia activa Y no tiene días vencidos de SLA (diasSla > 0)
    const healthyProjects = filteredProjectsByRegion.filter(p => !p.urgente && p.diasSla >= 1).length;
    const phiIndex = Math.round((healthyProjects / actTotal) * 100);

    // 3. Tasa de Retrabajo Nacional: % consolidado de iteraciones/ajustes sobre el total
    // Contraste con meta de la institución (< 8%).
    // Los proyectos con palabras como "REV.", "ESP.", "MODIFICACIÓN" o motivos de bloqueo son iteraciones de diseño.
    const reworkProjectsCount = filteredProjectsByRegion.filter(p => 
      p.etapa.includes('REV') || 
      p.etapa.includes('ESP') || 
      p.etapa.includes('AJUSTE') ||
      p.etapa.includes('RENDER ESTANCADO') || 
      (p.motivoBloqueo && p.motivoBloqueo.length > 0)
    ).length;
    const reworkRate = Math.round((reworkProjectsCount / actTotal) * 100);

    // 4. Eficiencia General de SLAs: En base a proyectos que suben sus entregables en tiempo (diasSla >= 0)
    const projectsOnTime = filteredProjectsByRegion.filter(p => p.diasSla >= 0).length;
    const slaEfficiency = Math.round((projectsOnTime / actTotal) * 100);

    return {
      pipeline: formattedPipeline,
      phi: phiIndex,
      rework: reworkRate,
      sla: slaEfficiency,
      totalActiveCount: actTotal
    };
  }, [filteredProjectsByRegion]);

  // COMPONENTE 2: CARGA ACTUAL DE DISEÑADORES
  // Grande = 3pts, Mediano = 2pts, Chico = 1pt
  const designersLoad = useMemo(() => {
    return DESIGNERS.map(designer => {
      const assigned = projects.filter(p => p.proyectista.toLowerCase() === designer.name.toLowerCase());
      const points = assigned.reduce((acc, p) => {
        const val = p.magn === 'Grande' ? 3 : p.magn === 'Mediano' ? 2 : 1;
        return acc + val;
      }, 0);

      // Verde 0-3 pts, Amarillo 4-5 pts, Rojo 6+ pts
      let semaphoreColor = 'bg-emerald-500 border-emerald-500/20 text-emerald-400';
      let bgColor = 'rgba(16, 185, 129, 0.05)';
      let textBadge = 'Disponible / Óptimo';
      
      if (points >= 6) {
        semaphoreColor = 'bg-rose-500 border-rose-500/20 text-rose-400';
        bgColor = 'rgba(244, 63, 94, 0.06)';
        textBadge = 'Rojo Crítico / Saturado';
      } else if (points >= 4) {
        semaphoreColor = 'bg-amber-500 border-amber-500/20 text-amber-400';
        bgColor = 'rgba(245, 158, 11, 0.05)';
        textBadge = 'Carga Límite / Alerta';
      }

      return {
        ...designer,
        points,
        projects: assigned,
        semaphoreColor,
        bgColor,
        textBadge
      };
    });
  }, [projects]);

  // COMPONENTE 3: BANDEJA DE ALERTAS TEMPRANAS (FILTRADA Y ORDENADA)
  // Filtrado bajo tres filtros de la bandeja: Magnitud, Días sin movimiento, Región/Plaza
  const filteredAlertsTable = useMemo(() => {
    return projects.filter(p => {
      // 1. Text Search Box
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchesQuery = p.id.toLowerCase().includes(q) || 
                             p.cliente.toLowerCase().includes(q) || 
                             p.proyectista.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }
      
      // 2. Magnitud Filter
      if (filterMagnitud !== 'all' && p.magn !== filterMagnitud) return false;

      // 3. Estancamiento (Días de retraso)
      if (filterEstancamiento !== 'all') {
        if (filterEstancamiento === '+3' && p.estancamientoDias < 3) return false;
        if (filterEstancamiento === '+5' && p.estancamientoDias < 5) return false;
      }

      // 4. Región / Plaza Filter
      if (filterPlazaTable !== 'all') {
        if (filterPlazaTable === 'Torreón' && p.plaza !== 'Torreón' && p.plaza !== 'Gómez Palacio') return false;
        if (filterPlazaTable === 'Gómez Palacio' && p.plaza !== 'Gómez Palacio') return false;
        if (filterPlazaTable === 'Monterrey' && p.plaza !== 'Monterrey') return false;
        if (filterPlazaTable === 'Centro' && p.plaza !== 'Centro') return false;
      }

      // table only displays alert conditions (urgente list, blocked list or estancamiento > 1)
      return p.urgente || p.estancamientoDias >= 2 || p.etapa.includes('ESTANCADO') || p.etapa.includes('BLOQUEADO');
    });
  }, [projects, filterMagnitud, filterEstancamiento, filterPlazaTable, searchTerm]);

  // COMPONENTE 4: FORECAST GANTT TIMELINE CALCULATIONS
  // Generates columns based on Selected Period (Semanal = 7 Days, Mensual = 14 Days)
  const ganttColumns = useMemo(() => {
    const totalDays = selectedPeriod === 'semanal' ? 7 : 14;
    const columns = [];
    const today = new Date("2026-05-29T00:00:00.000Z"); // Fix timeline anchor around current local time

    for (let i = 0; i < totalDays; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      const isWeekend = nextDate.getDay() === 0 || nextDate.getDay() === 6;
      columns.push({
        index: i,
        dayLabel: nextDate.toLocaleDateString('es-MX', { weekday: 'narrow' }),
        dateLabel: nextDate.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }),
        isWeekend,
        dateObject: nextDate
      });
    }
    return columns;
  }, [selectedPeriod]);

  // Dynamic day-level summation (Heatmap capacity)
  // For each day in the Gantt, calculate points of effort expiring / active
  const dayHeatmapCapacity = useMemo(() => {
    return ganttColumns.map(col => {
      let activeEffortPoints = 0;
      
      // Filter projects that fall in the current Region
      const regionalProjects = selectedRegion === 'all' 
        ? projects 
        : (selectedRegion === 'LAG' 
            ? projects.filter(p => p.plaza === 'Torreón' || p.plaza === 'Gómez Palacio')
            : (selectedRegion === 'MTY' ? projects.filter(p => p.plaza === 'Monterrey') : projects.filter(p => p.plaza === 'Centro'))
          );

      regionalProjects.forEach(p => {
        // Distribute project's development length
        // Simulating expiration/delivery date matching this specific day
        // We will assign a predictable target offset for visualization
        const projectExpiredOffset = (parseInt(p.id.replace(/[^0-9]/g, ''), 10) || 5) % ganttColumns.length;
        
        // This is the active day span for this project
        const projectPoints = p.magn === 'Grande' ? 3 : p.magn === 'Mediano' ? 2 : 1;
        
        // If col.index matches the exp date, add the points
        if (col.index === projectExpiredOffset) {
          activeEffortPoints += projectPoints;
        }
      });

      // Semantic Color intensity
      let heatBg = 'bg-zinc-900 border-zinc-800 text-zinc-500';
      if (activeEffortPoints >= 9) {
        heatBg = 'bg-rose-950/40 border-rose-800/30 text-rose-400 font-extrabold shadow-sm shadow-rose-950';
      } else if (activeEffortPoints >= 6) {
        heatBg = 'bg-amber-950/30 border-amber-800/20 text-amber-500 font-bold';
      } else if (activeEffortPoints >= 3) {
        heatBg = 'bg-emerald-950/20 border-emerald-900/20 text-emerald-500';
      } else if (activeEffortPoints > 0) {
        heatBg = 'bg-teal-950/10 border-teal-900/10 text-teal-600';
      }

      return {
        colIndex: col.index,
        points: activeEffortPoints,
        heatBg
      };
    });
  }, [ganttColumns, projects, selectedRegion]);

  return (
    <div className="flex flex-col flex-1 h-full w-full bg-[#080b0f] text-[#cacfd2] overflow-y-auto overflow-x-hidden font-sans custom-scrollbar select-none">
      
      {/* 1. SECTOR SUPERIOR - BANER DE ROLES Y FILTROS */}
      <div className="p-6 border-b border-zinc-900/80 bg-[#0c0f14] flex flex-col gap-5 shrink-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-teal-400 font-bold uppercase tracking-[0.25em]">MÓDULO EJECUTIVO DE DIRECCIÓN</span>
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
            <h1 className="text-2xl font-serif italic text-white leading-none uppercase tracking-tight">
              PROYECTOS & CARGA NACIONAL S.O.D.
            </h1>
          </div>

          {/* ROL SELECTOR (Strict separation role Dirección / Master) */}
          <div className="flex items-center gap-2 p-1.5 bg-zinc-950 border border-zinc-800/60 rounded">
            <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase px-2">PERFIL ADMISIÓN:</span>
            <button 
              onClick={() => setActiveRole('Direccion')}
              className={`px-3 py-1 text-xs font-mono rounded transition-all flex items-center gap-1.5 ${
                activeRole === 'Direccion' 
                  ? 'bg-teal-950 border border-teal-700/40 text-teal-400 font-bold' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              📊 Dirección (KPI-Only)
            </button>
            <button 
              onClick={() => setActiveRole('Master')}
              className={`px-3 py-1 text-xs font-mono rounded transition-all flex items-center gap-1.5 ${
                activeRole === 'Master' 
                  ? 'bg-amber-950 border border-amber-800/40 text-amber-500 font-bold shadow' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              👑 Master (Operativo)
            </button>
          </div>
        </div>

        {/* CONTROLES GLOBAL DE FILTRADO (REACTIVO) */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-zinc-900/60">
          <div className="flex flex-wrap items-center gap-4">
            
            {/* REGION FILTER */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono font-bold text-zinc-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Plaza/Región:
              </span>
              <div className="flex bg-zinc-950 p-1 border border-zinc-800/60 rounded">
                <button 
                  onClick={() => setSelectedRegion('all')}
                  className={`px-3 py-1 text-[11px] font-mono rounded ${selectedRegion === 'all' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Nacional
                </button>
                <button 
                  onClick={() => setSelectedRegion('LAG')}
                  className={`px-3 py-1 text-[11px] font-mono rounded ${selectedRegion === 'LAG' ? 'bg-zinc-800 text-teal-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Torreón (LAG)
                </button>
                <button 
                  onClick={() => setSelectedRegion('MTY')}
                  className={`px-3 py-1 text-[11px] font-mono rounded ${selectedRegion === 'MTY' ? 'bg-zinc-800 text-amber-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Monterrey (MTY)
                </button>
                <button 
                  onClick={() => setSelectedRegion('Centro')}
                  className={`px-3 py-1 text-[11px] font-mono rounded ${selectedRegion === 'Centro' ? 'bg-zinc-800 text-blue-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Centro (CDMX/Qro)
                </button>
              </div>
            </div>

            {/* PERIOD TIMELINE GANTT FILTER */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono font-bold text-zinc-500 flex items-center gap-1">
                <CalendarIcon className="w-3.5 h-3.5" /> Periodo Gantt:
              </span>
              <div className="flex bg-zinc-950 p-1 border border-zinc-800/60 rounded">
                <button 
                  onClick={() => setSelectedPeriod('semanal')}
                  className={`className px-3 py-1 text-[11px] font-mono rounded ${selectedPeriod === 'semanal' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Semanal (7d)
                </button>
                <button 
                  onClick={() => setSelectedPeriod('mensual')}
                  className={`className px-3 py-1 text-[11px] font-mono rounded ${selectedPeriod === 'mensual' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  Mensual (14d)
                </button>
              </div>
            </div>

          </div>

          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest hidden lg:block">
            GEBESA_CRM.SYS v4.9.0
          </div>
        </div>
      </div>

      {/* BODY DE COMPONENTES */}
      <div className="p-6 flex flex-col gap-6 flex-1 min-h-0">
        
        {/* COMPONENTE 1: GRID DE KPIS DINÁMICOS EN VIVO */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
          
          {/* KPI 1: Pipeline financiero en tránsito */}
          <div className="bg-[#0b0e14] border border-zinc-900 rounded p-5 flex flex-col gap-1.5 relative overflow-hidden group hover:border-zinc-800 transition-all duration-300">
            <div className="absolute right-3 top-3 opacity-15 select-none">
              <BarChart3 className="w-14 h-14 text-teal-500" />
            </div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest font-mono">PIPELINE FINANCIERO</span>
              <span className="text-[9px] font-mono text-teal-400 bg-teal-550/10 border border-teal-500/20 px-1.5 rounded uppercase font-semibold">Técnico Activo</span>
            </div>
            <div className="text-3xl font-serif text-white tracking-tight mt-1">
              {kpis.pipeline}
            </div>
            <div className="text-[10px] text-zinc-500 flex items-center gap-1 mt-1 font-mono">
              <span>{kpis.totalActiveCount} proyectos en tránsito integrados</span>
            </div>
          </div>

          {/* KPI 2: Índice de Salud de la Red */}
          <div className="bg-[#0b0e14] border border-zinc-900 rounded p-5 flex flex-col gap-1.5 relative overflow-hidden group hover:border-zinc-800 transition-all duration-300">
            <div className="absolute right-3 top-3 opacity-15 select-none">
              <TrendingUp className="w-14 h-14 text-emerald-500" />
            </div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest font-mono">ÍNDICE SALUD RED (PHI)</span>
              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-555/10 border border-emerald-500/20 px-1.5 rounded uppercase font-semibold">Eficiencia</span>
            </div>
            <div className="text-3xl font-sans font-extrabold text-white tracking-tight mt-1">
              {kpis.phi}%
            </div>
            <div className="text-[10px] text-zinc-500 flex items-center gap-1 mt-1 font-mono">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
              <span>Libre de retrasos o bloqueos críticos</span>
            </div>
          </div>

          {/* KPI 3: Tasa de Retrabajo Nacional */}
          <div className="bg-[#0b0e14] border border-zinc-900 rounded p-5 flex flex-col gap-1.5 relative overflow-hidden group hover:border-zinc-800 transition-all duration-300">
            <div className="absolute right-3 top-3 opacity-15 select-none">
              <AlertTriangle className="w-14 h-14 text-amber-500" />
            </div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest font-mono">TASA RETRABAJO NACIONAL</span>
              <span className="text-[9px] font-mono text-red-400 bg-red-555/10 border border-red-500/20 px-1.5 rounded uppercase font-semibold">Meta &lt;8%</span>
            </div>
            <div className="text-3xl font-sans font-extrabold text-[#e06666] tracking-tight mt-1 flex items-baseline gap-1.5">
              {kpis.rework}%
              <span className="text-[10px] font-mono font-normal text-zinc-500">(Límite superado)</span>
            </div>
            <div className="text-[10px] text-zinc-500 flex items-center gap-1 mt-1 font-mono">
              <span>Porcentaje acumulado de versiones V2 y V3+</span>
            </div>
          </div>

          {/* KPI 4: Eficiencia General de SLAs */}
          <div className="bg-[#0b0e14] border border-zinc-900 rounded p-5 flex flex-col gap-1.5 relative overflow-hidden group hover:border-zinc-800 transition-all duration-300">
            <div className="absolute right-3 top-3 opacity-15 select-none">
              <CheckCircle2 className="w-14 h-14 text-blue-500" />
            </div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest font-mono">EFICIENCIA GESTIÓN SLA</span>
              <span className="text-[9px] font-mono text-blue-400 bg-blue-555/10 border border-blue-500/20 px-1.5 rounded uppercase font-semibold">Estándar</span>
            </div>
            <div className="text-3xl font-sans font-extrabold text-white tracking-tight mt-1">
              {kpis.sla}%
            </div>
            <div className="text-[10px] text-zinc-500 flex items-center gap-1 mt-1 font-mono">
              <span>Proyectos dentro del plazo estipulado</span>
            </div>
          </div>

        </div>

        {/* REGION COMPUESTOS: CARGA DE EQUIPO + HISTOGRAMA DE CAPACIDADES */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 shrink-0">
          
          {/* COMPONENTE 2: VISTA DE CARGA CRUZADA NACIONAL */}
          <div className="lg:col-span-12 xl:col-span-6 bg-[#0b0e14] border border-zinc-900 rounded p-5 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-zinc-900/40">
              <div className="flex flex-col">
                <span className="text-xs uppercase font-mono font-bold text-white tracking-widest flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-400" /> Carga Cruzada Nacional de Diseñadores
                </span>
                <span className="text-[10px] text-zinc-550 font-mono">Saturación en paralelo / Límite operativo máximo: 6 Puntos</span>
              </div>
              <div className="text-[10px] font-mono px-2 py-0.5 border border-zinc-800/80 bg-zinc-950 rounded text-zinc-500">
                Puntos: G=3 · M=2 · Ch=1
              </div>
            </div>

            {/* GRID CO-PROYECTISTAS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {designersLoad.map(designer => (
                <div 
                  key={designer.id} 
                  className="p-4 border border-zinc-800 bg-[#0e121a] rounded flex flex-col gap-3 relative overflow-hidden transition-all duration-300 hover:border-zinc-700 hover:bg-[#111621]"
                  style={{ borderLeft: `3px solid ${designer.points >= 6 ? '#f43f5e' : designer.points >= 4 ? '#f59e0b' : '#10b981'}` }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <strong className="text-white text-sm block tracking-wide">{designer.name}</strong>
                      <span className="text-[10px] text-zinc-500 font-mono uppercase">{designer.location} Plaza</span>
                    </div>
                    <span className={`text-[9px] font-mono uppercase font-bold border rounded px-1.5 ${designer.semaphoreColor}`}>
                      {designer.points}/6 pts
                    </span>
                  </div>

                  {/* Progressive indicator */}
                  <div className="flex flex-col gap-1">
                    <div className="w-full h-1.5 bg-zinc-950 border border-zinc-900 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500-custom ${
                          designer.points >= 6 ? 'bg-gradient-to-r from-red-600 to-rose-500' 
                          : designer.points >= 4 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' 
                          : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        }`}
                        style={{ width: `${Math.min(100, (designer.points / 6) * 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-[9px] text-zinc-500 font-mono uppercase italic">{designer.textBadge}</span>
                  </div>

                  {/* Active folios assignation */}
                  <div className="flex flex-col gap-1 pt-2 border-t border-zinc-900/65">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono block">Proyectos Asignados ({designer.projects.length})</span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {designer.projects.length === 0 ? (
                        <span className="text-[10px] text-zinc-650 font-mono italic">Sin folios activos</span>
                      ) : (
                        designer.projects.map(p => (
                          <div 
                            key={p.id} 
                            className="bg-zinc-950 border border-zinc-800 text-[10px] pl-2 pr-1 py-1 rounded font-mono text-zinc-300 flex items-center gap-1.5 hover:border-zinc-700 hover:text-white"
                          >
                            <span>{p.id}</span>
                            <span className={`w-1.5 h-1.5 rounded-full ${p.urgente ? 'bg-rose-500 animate-ping' : 'bg-zinc-600'}`}></span>
                            
                            {/* REASSIGN BUTTON INTERACTIVO - SÓLO ROL MASTER */}
                            <button 
                              disabled={activeRole !== 'Master'}
                              onClick={() => setReassigningProj(p)}
                              title={activeRole === 'Master' ? "🔄 Reasignar a otro proyectista" : "Acceso restringido (Requiere Rol Master)"}
                              className={`p-0.5 rounded text-zinc-500 hover:text-white hover:bg-zinc-800/80 transition-colors ${activeRole !== 'Master' ? 'opacity-35 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                              <RefreshCw className="w-3 h-3" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* AI DECISION ADVISING BLOCK */}
            <div className="bg-amber-950/10 border border-amber-500/20 rounded p-3 text-xs text-amber-500 flex items-start gap-2.5">
              <span className="text-base select-none">💡</span>
              <div className="flex flex-col gap-0.5">
                <strong className="font-mono text-[10px] uppercase font-bold tracking-wider">RECOMENDACIÓN AUTOMATIZADA S.O.D.</strong>
                <p className="m-0 text-zinc-400 text-[11px] leading-relaxed">
                  El diseñador <strong className="text-teal-400">Karen Tovar</strong> se encuentra en zona de alta densidad. Se aconseja desviar los folios entrantes de magnitud Grande hacia <strong className="text-amber-400">Rodrigo Vergara (Plaza Laguna)</strong> para mitigar riesgos de incumplimiento de SLA.
                </p>
              </div>
            </div>
          </div>

          {/* COMPONENTE 4: FORECAST DE ENTREGAS (GANTT SIMPLIFICADO HORIZONTAL) */}
          <div className="lg:col-span-12 xl:col-span-6 bg-[#0b0e14] border border-zinc-900 rounded p-5 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-zinc-900/40">
              <div className="flex flex-col">
                <span className="text-xs uppercase font-mono font-bold text-white tracking-widest flex items-center gap-1.5">
                  <CalendarIcon className="w-4 h-4 text-teal-400" /> Forecast de Entregas Gantt & Congestión
                </span>
                <span className="text-[10px] text-zinc-550 font-mono">Simulación de barris de tiempo horizontales por Proyectista</span>
              </div>
              <div className="text-[10px] font-mono px-2 py-0.5 border border-zinc-800/80 bg-zinc-950 rounded text-amber-500 flex items-center gap-1 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Heatmap Dinámico
              </div>
            </div>

            {/* TIMELINE GRID CONTAINER */}
            <div className="flex flex-col overflow-x-auto select-none mt-1 custom-scrollbar">
              <div className="min-w-[600px] flex flex-col gap-2">
                
                {/* HEADERS ROW MAPPED */}
                <div className="grid grid-cols-12 border-b border-zinc-900 pb-2">
                  <div className="col-span-3 text-[10px] uppercase font-mono font-bold text-zinc-500">Diseñador · Plaza</div>
                  <div className="col-span-9 grid grid-cols-7 sm:grid-cols-7 lg:grid-cols-14 gap-1">
                    {ganttColumns.map(col => (
                      <div 
                        key={col.index} 
                        className={`text-center flex flex-col items-center justify-center py-1 rounded ${col.isWeekend ? 'bg-zinc-950/40 text-rose-800' : 'text-zinc-500'}`}
                      >
                        <span className="text-[9px] font-mono tracking-widest leading-none font-bold">{col.dayLabel}</span>
                        <span className="text-[8px] font-mono font-normal mt-0.5 leading-none">{col.dateLabel.split(' ')[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* HEADER HEATMAP PANEL */}
                <div className="grid grid-cols-12 py-1 bg-zinc-950/40 border border-zinc-900 rounded items-center">
                  <div className="col-span-3 pl-2 text-[8px] uppercase font-mono font-bold text-zinc-500 flex items-center gap-1">
                    <Sliders className="w-3 h-3 text-amber-500" /> Puntos Vencimientos:
                  </div>
                  <div className="col-span-9 grid grid-cols-7 sm:grid-cols-7 lg:grid-cols-14 gap-1">
                    {dayHeatmapCapacity.map((heat, i) => (
                      <div 
                        key={i} 
                        title={`Suma de esfuerzo concurrente que vence este día: ${heat.points} Puntos`}
                        className={`text-[9px] font-mono py-0.5 rounded text-center border ${heat.heatBg}`}
                      >
                        {heat.points}p
                      </div>
                    ))}
                  </div>
                </div>

                {/* BARS ROWS BY PROYECTISTAS */}
                <div className="flex flex-col gap-2 mt-2">
                  {DESIGNERS.map(designer => {
                    const designerProjects = filteredProjectsByRegion.filter(p => p.proyectista.toLowerCase() === designer.name.toLowerCase());
                    return (
                      <div key={designer.id} className="grid grid-cols-12 items-center py-1.5 border-b border-zinc-900/30">
                        
                        {/* Name panel */}
                        <div className="col-span-3 flex flex-col pr-2">
                          <span className="text-[11px] font-bold text-zinc-300 leading-tight">{designer.name.split(' ')[0]} {designer.name.split(' ')[1]}</span>
                          <span className="text-[8px] font-mono uppercase text-zinc-550">{designer.location}</span>
                        </div>

                        {/* Projects Gantt Bars Grid wrapper */}
                        <div className="col-span-9 grid grid-cols-7 sm:grid-cols-7 lg:grid-cols-14 gap-1 h-8 relative items-center">
                          {designerProjects.length === 0 ? (
                            <div className="col-span-full h-5 bg-zinc-950/10 border border-dashed border-zinc-900 rounded text-center flex items-center justify-center">
                              <span className="text-[9px] font-mono text-zinc-650 uppercase italic">Sin entregas programadas</span>
                            </div>
                          ) : (
                            designerProjects.slice(0, 2).map((p, pIndex) => {
                              // Dynamically decide length and color of bars
                              const startCol = (parseInt(p.id.replace(/[^0-9]/g, ''), 10) || 1) % 4;
                              const spanLength = p.magn === 'Grande' ? 6 : p.magn === 'Mediano' ? 4 : 2;
                              const endCol = Math.min(ganttColumns.length - 1, startCol + spanLength);
                              
                              let barBg = 'bg-teal-555/20 border-teal-500/30 text-teal-400';
                              if (p.urgente) {
                                barBg = 'bg-rose-950/30 border-rose-800/40 text-rose-300 font-extrabold';
                              } else if (p.diasSla === 0) {
                                barBg = 'bg-amber-950/30 border-amber-800/40 text-amber-300';
                              } else if (p.diasSla < 0) {
                                barBg = 'bg-red-950/40 border-red-800/50 text-red-400';
                              }

                              return (
                                <div 
                                  key={p.id}
                                  className={`absolute h-5 border rounded text-[9px] pl-2 pr-1 font-mono flex items-center justify-between truncate transition-all overflow-hidden ${barBg}`}
                                  style={{
                                    left: `${(startCol / ganttColumns.length) * 100}%`,
                                    width: `${((endCol - startCol + 1) / ganttColumns.length) * 100}%`,
                                    top: pIndex === 0 ? '0px' : '16px',
                                    zIndex: 10
                                  }}
                                  title={`${p.id} · ${p.cliente} | SLA: ${p.diasSla}d restante`}
                                >
                                  <span className="truncate pr-1">{p.id} · {p.cliente}</span>
                                  <span className="text-[8px] opacity-75 font-bold uppercase">{p.magn}</span>
                                </div>
                              );
                            })
                          )}
                        </div>
                        
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>

            {/* GANTT CAPACITIES MAP LEGEND */}
            <div className="flex flex-wrap items-center gap-4 text-[9px] font-mono text-zinc-550 bg-zinc-950 p-2.5 rounded border border-zinc-900 mt-1">
              <strong className="text-zinc-400 uppercase tracking-wider">Leyenda PHI:</strong>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-1.5 rounded bg-teal-950 border border-teal-800/40 inline-block"></span>
                <span>Saludable</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-1.5 rounded bg-amber-950 border border-amber-800/40 inline-block"></span>
                <span>SLA Vence Hoy (0d)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-1.5 rounded bg-red-950 border border-red-800/40 inline-block"></span>
                <span>SLA Retrasado (&lt;0d)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-1.5 rounded bg-rose-950 border border-rose-800/40 inline-block"></span>
                <span>Urgente S.O.S</span>
              </div>
            </div>
          </div>

        </div>

        {/* COMPONENTE 3: BANDEJA DE ALERTAS TEMPRANAS DE ALTA DENSIDAD */}
        <div className="bg-[#0b0e14] border border-zinc-900 rounded p-5 flex flex-col gap-4 shrink-0 overflow-x-auto custom-scrollbar">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-3 border-b border-zinc-900/40">
            <div className="flex flex-col">
              <span className="text-xs uppercase font-mono font-bold text-white tracking-widest flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-[#e06666]" /> Bandeja Consolidada de Alertas Tempranas & Proyectos Críticos
              </span>
              <span className="text-[10px] text-zinc-550 font-mono">Consolidación en paralelo de cuellos de botella reales y simulados (+18 reportes institucionales)</span>
            </div>

            {/* ALINEACION DE CONTROLES RAPIDOS DE LA TABLA */}
            <div className="flex flex-wrap items-center gap-2">
              
              {/* SEARCH BOX */}
              <div className="relative bg-zinc-950 border border-zinc-800/80 rounded flex items-center pl-2.5">
                <Search className="w-3.5 h-3.5 text-zinc-500" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar folio/cliente..." 
                  className="bg-transparent border-none text-xs font-mono py-1 px-2 text-white outline-none w-40 placeholder:text-zinc-650"
                />
              </div>

              {/* MAGNITUDE ACCUMULATOR */}
              <select 
                value={filterMagnitud}
                onChange={(e) => setFilterMagnitud(e.target.value)}
                className="bg-zinc-950 border border-zinc-800/80 rounded py-1 px-2.5 text-xs font-mono text-zinc-400 outline-none cursor-pointer hover:border-zinc-700"
              >
                <option value="all">S-Magnitud</option>
                <option value="Grande">Grande (G)</option>
                <option value="Mediano">Mediano (M)</option>
                <option value="Chico">Chico (Ch)</option>
              </select>

              {/* DAYS REACTION */}
              <select 
                value={filterEstancamiento}
                onChange={(e) => setFilterEstancamiento(e.target.value)}
                className="bg-zinc-950 border border-zinc-800/80 rounded py-1 px-2.5 text-xs font-mono text-zinc-400 outline-none cursor-pointer hover:border-zinc-700"
              >
                <option value="all">S-Estancamiento</option>
                <option value="+3">+3 Días Estancado</option>
                <option value="+5">+5 Días Estancado</option>
              </select>

              {/* REGION MINI FILTER FOR TABLE */}
              <select 
                value={filterPlazaTable}
                onChange={(e) => setFilterPlazaTable(e.target.value)}
                className="bg-zinc-950 border border-zinc-800/80 rounded py-1 px-2.5 text-xs font-mono text-zinc-400 outline-none cursor-pointer hover:border-zinc-700"
              >
                <option value="all">S-Plazas</option>
                <option value="Torreón">Torreón</option>
                <option value="Gómez Palacio">Gómez Palacio</option>
                <option value="Monterrey">Monterrey</option>
                <option value="Centro">Centro / CDMX</option>
              </select>

            </div>
          </div>

          {/* ALERTS HIGH DENSITY TABLE */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs border-collapse min-w-[850px] select-none">
              <thead>
                <tr className="border-b border-zinc-900/80 text-zinc-500 uppercase tracking-wider font-mono text-[9px] bg-zinc-950/30">
                  <th className="py-2.5 px-3">Folio</th>
                  <th className="py-2.5 px-3">Proyecto / Cliente</th>
                  <th className="py-2.5 px-3">Plaza</th>
                  <th className="py-2.5 px-3">Magnitud</th>
                  <th className="py-2.5 px-3">Responsable</th>
                  <th className="py-2.5 px-3 text-center">Frenazo (Días)</th>
                  <th className="py-2.5 px-3">Motivo del Bloqueo Crítico</th>
                  <th className="py-2.5 px-3 text-right">SLA Restante</th>
                  <th className="py-2.5 px-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/40">
                {filteredAlertsTable.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-10 text-center font-mono text-zinc-600 uppercase italic">
                      No se encontraron folios estancados bajo los filtros de alerta activos.
                    </td>
                  </tr>
                ) : (
                  filteredAlertsTable.map(p => {
                    // Rule highlight G type + Overdue/Urgent
                    const isHighRiskG = p.magn === 'Grande' && (p.urgente || p.estancamientoDias >= 5 || p.diasSla <= 0);
                    const slaColor = p.diasSla < 0 ? 'text-red-400 font-extrabold' : p.diasSla === 0 ? 'text-amber-400' : 'text-emerald-400';

                    return (
                      <tr 
                        key={p.id} 
                        className={`transition-colors hover:bg-zinc-900/30 ${
                          isHighRiskG ? 'bg-rose-950/10 border-l border-r border-rose-900/50 relative shadow-sm scale-[0.99] border-y border-rose-900/60' : ''
                        }`}
                      >
                        {/* Folio */}
                        <td className="py-3 px-3 font-mono font-bold text-teal-400 relative">
                          {isHighRiskG && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600 animate-pulse"></div>
                          )}
                          <div className="flex items-center gap-1.5">
                            <span>{p.id}</span>
                            {p.urgente && (
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                            )}
                          </div>
                        </td>

                        {/* Proyecto & Subcliente */}
                        <td className="py-3 px-3">
                          <div className="flex flex-col">
                            <strong className="text-white text-[12px]">{p.cliente}</strong>
                            <span className="text-[10px] text-zinc-500 font-sans mt-0.5">{p.subCliente}</span>
                          </div>
                        </td>

                        {/* Plaza */}
                        <td className="py-3 px-3 font-mono text-[10px] text-zinc-400">{p.plaza}</td>

                        {/* Magnitud */}
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 text-[9px] font-mono rounded-full border tracking-wide font-extrabold ${
                            p.magn === 'Grande' ? 'bg-amber-950/20 border-amber-800/30 text-amber-500' :
                            p.magn === 'Mediano' ? 'bg-blue-950/20 border-blue-900/30 text-blue-400' :
                            'bg-zinc-900 border-zinc-800 text-zinc-400'
                          }`}>
                            {p.magn}
                          </span>
                        </td>

                        {/* Responsable */}
                        <td className="py-3 px-3 font-sans font-medium text-zinc-300">{p.proyectista}</td>

                        {/* Estancamiento días */}
                        <td className="py-3 px-3 text-center font-mono text-zinc-400">
                          <span className={`px-1.5 py-0.2 rounded font-bold ${p.estancamientoDias >= 5 ? 'text-rose-500 bg-rose-500/10' : 'text-zinc-400'}`}>
                            {p.estancamientoDias} días
                          </span>
                        </td>

                        {/* Motivo de Bloqueo */}
                        <td className="py-3 px-3 text-zinc-400 max-w-xs truncate" title={p.motivoBloqueo}>
                          <div className="flex items-center gap-1 text-[11px] font-mono italic">
                            <span className="text-amber-500">⚠</span>
                            <span className="truncate">{p.motivoBloqueo || "En espera de validación de renderings por el asesor"}</span>
                          </div>
                        </td>

                        {/* SLA Restante */}
                        <td className="py-3 px-3 text-right font-mono text-[11px]">
                          <span className={slaColor}>
                            {p.diasSla < 0 ? `Vencido (${p.diasSla}d)` : p.diasSla === 0 ? 'SLA Límite' : `${p.diasSla}d Rest.`}
                          </span>
                        </td>

                        {/* Acciones */}
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            
                            {/* EXCLUSIVE MASTER ACTION - courtesy SLA */}
                            <button 
                              disabled={activeRole !== 'Master'}
                              onClick={() => handleAddSlaCourtesyDays(p.id, 2)}
                              title={activeRole === 'Master' ? "Extender de cortesía +2 Días SLA" : "Acceso restringido (Modo Master)"}
                              className={`p-1 border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 rounded text-[10px] text-zinc-400 flex items-center justify-center gap-0.5 font-mono ${
                                activeRole !== 'Master' ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:border-zinc-700'
                              }`}
                            >
                              ⏱️ +2d
                            </button>

                            {/* TRIGGER REASSIGN POPUP */}
                            <button 
                              disabled={activeRole !== 'Master'}
                              onClick={() => setReassigningProj(p)}
                              title={activeRole === 'Master' ? "Forzar re-dirección de carga" : "Acceso restringido"}
                              className={`p-1 border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 rounded text-[10px] text-zinc-400 flex items-center justify-center gap-0.5 font-mono ${
                                activeRole !== 'Master' ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:border-zinc-700'
                              }`}
                            >
                              🔄 Reasig.
                            </button>

                            {/* PUSH OVERRIDE URGENTE HIGHLIGHT */}
                            <button 
                              disabled={activeRole !== 'Master'}
                              onClick={() => handleToggleUrgency(p.id)}
                              title={activeRole === 'Master' ? "Modificar Urgencia S.O.S." : "Acceso restringido"}
                              className={`p-1 border text-[10px] rounded flex items-center justify-center font-mono ${
                                activeRole !== 'Master' 
                                  ? 'opacity-30 cursor-not-allowed border-zinc-800 text-zinc-500 bg-zinc-950' 
                                  : p.urgente 
                                    ? 'border-rose-900/50 bg-rose-950/20 text-rose-400 hover:bg-rose-950/40 cursor-pointer' 
                                    : 'border-zinc-800 text-zinc-400 bg-zinc-950 hover:bg-zinc-900 hover:border-zinc-700 cursor-pointer'
                              }`}
                            >
                              {p.urgente ? '⭐ S.O.S ON' : '☆ SOS'}
                            </button>

                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* DENSITY TOTAL STATISTICS BAR */}
          <div className="flex justify-between items-center bg-zinc-950 px-4 py-2 rounded border border-zinc-900 text-[10.5px] font-mono text-zinc-550 shrink-0">
            <span>SISTEMA DE SEGURIDAD OPERATIVA GEBESA</span>
            <span>Alertas registradas: {filteredAlertsTable.length} casos críticos · Total Pipeline Filtrado: {kpis.pipeline}</span>
          </div>
        </div>

      </div>

      {/* REASSIGN POPUP DIALOG WINDOW (Portal modal top overlay for reassigningProj) */}
      {reassigningProj && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#0e121a] border border-zinc-800 rounded-lg max-w-md w-full p-6 flex flex-col gap-5 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-900">
              <div className="flex items-center gap-2">
                <span className="text-amber-500 font-bold font-mono">⚠️</span>
                <strong className="text-white text-sm uppercase tracking-wide">Desviar Carga Técnica S.O.D.</strong>
              </div>
              <button 
                onClick={() => setReassigningProj(null)}
                className="text-zinc-500 hover:text-white text-xs font-mono bg-zinc-950 border border-zinc-850 px-2 py-0.5 rounded cursor-pointer"
              >
                Cerrar
              </button>
            </div>

            <div className="flex flex-col gap-2 rounded bg-zinc-950 p-3.5 border border-zinc-900 text-xs font-mono">
              <div className="text-zinc-550 uppercase font-bold text-[9px] tracking-wider">PROYECTO SELECCIONADO:</div>
              <div className="text-teal-400 font-extrabold text-[13px] mt-0.5">{reassigningProj.id} · {reassigningProj.cliente}</div>
              <div className="text-zinc-400 mt-1 leading-normal font-sans">
                Responsable actual: <strong className="text-zinc-200">{reassigningProj.proyectista}</strong>
                <br />
                Magnitud: <strong className="text-zinc-200">{reassigningProj.magn} (Puntos de esfuerzo: {reassigningProj.magn === 'Grande' ? 3 : reassigningProj.magn === 'Mediano' ? 2 : 1} pts)</strong>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest font-mono">SELECCIONAR RELEVO CON CAPACIDAD DISPONIBLE:</span>
              <div className="flex flex-col gap-2 custom-scrollbar max-h-56 overflow-y-auto">
                {designersLoad.map(designer => {
                  const effortCost = reassigningProj.magn === 'Grande' ? 3 : reassigningProj.magn === 'Mediano' ? 2 : 1;
                  const estimatedLoad = designer.points + effortCost;
                  const isSuturatedAfter = estimatedLoad > 6;
                  const isAlreadyAssigned = designer.name.toLowerCase() === reassigningProj.proyectista.toLowerCase();

                  return (
                    <button 
                      key={designer.id}
                      disabled={isAlreadyAssigned}
                      onClick={() => reassignProjectToDesigner(reassigningProj.id, designer.name)}
                      className={`w-full text-left p-3 border rounded font-mono text-xs flex justify-between items-center transition-all ${
                        isAlreadyAssigned 
                          ? 'bg-zinc-950 border-zinc-900 opacity-30 text-zinc-650 cursor-not-allowed' 
                          : 'bg-zinc-950 hover:bg-zinc-900/60 border-zinc-850 hover:border-zinc-700 text-zinc-300 cursor-pointer'
                      }`}
                    >
                      <div className="flex flex-col gap-0.5">
                        <strong className={isAlreadyAssigned ? 'text-zinc-500' : 'text-white'}>
                          {designer.name} {isAlreadyAssigned ? '(Asignado)' : ''}
                        </strong>
                        <span className="text-[10px] text-zinc-500 uppercase">{designer.location} Plaza</span>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <span className={`text-[11px] font-bold ${designer.points >= 5 ? 'text-amber-500' : 'text-emerald-400'}`}>
                          Carga: {designer.points} / 6 pts
                        </span>
                        {!isAlreadyAssigned && (
                          <span className={`text-[9px] mt-0.5 ${isSuturatedAfter ? 'text-rose-400 font-extrabold' : 'text-zinc-500'}`}>
                            Est. Post: {estimatedLoad}/6 pts {isSuturatedAfter ? '⚠️ SAT' : '✓ OK'}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="text-[10px] text-zinc-550 leading-relaxed font-mono border-t border-zinc-900 pt-3">
              * El traspaso forzado de folios técnicos actualiza instantáneamente el tablero del proyectista respectivo y las métricas de carga del CRM general.
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
