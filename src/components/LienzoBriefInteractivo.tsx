import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Trash2, Download, Save, ArrowRight, MousePointer2, 
  DoorOpen, Layout, Ruler, 
  Pin, Type, Eraser, ZoomIn, ZoomOut, Maximize, Grid3X3,
  Hand, ChevronRight, Briefcase
} from 'lucide-react';

// --- FURNITURE DATABASE ---
const FURNITURE_DB: Record<string, any[]> = {
  oficina: [
    { id:'exec-desk',    name:'Escritorio Ejecutivo', icon:'🖥', color:'#58a6ff', users:1, w:60, h:30, badge:null },
    { id:'workstation',  name:'Estación Trabajo',     icon:'💻', color:'#58a6ff', users:1, w:50, h:25, badge:null },
    { id:'desk-l',       name:'Escritorio L',         icon:'📐', color:'#58a6ff', users:1, w:65, h:35, badge:null },
    { id:'chair-exec',   name:'Silla Ejecutiva',      icon:'💺', color:'#8b949e', users:1, w:22, h:22, badge:null },
    { id:'chair-op',     name:'Silla Operativa',      icon:'🪑', color:'#8b949e', users:1, w:18, h:18, badge:null },
    { id:'bench-2',      name:'Bench 2 Puestos',      icon:'🏚', color:'#58a6ff', users:2, w:80, h:25, badge:'Nuevo' },
    { id:'bench-4',      name:'Bench 4 Puestos',      icon:'🏗', color:'#58a6ff', users:4, w:120,h:25, badge:null },
    { id:'locker',       name:'Locker Personal',      icon:'🗄', color:'#6e7681', users:0, w:20, h:50, badge:null },
  ],
  sala: [
    { id:'conf-4',  name:'Mesa 4 pers.',  icon:'🔲', color:'#d29922', users:4,  w:60, h:35, badge:null },
    { id:'conf-6',  name:'Mesa 6 pers.',  icon:'⬛', color:'#d29922', users:6,  w:80, h:35, badge:null },
    { id:'conf-8',  name:'Mesa 8 pers.',  icon:'⬜', color:'#d29922', users:8,  w:100,h:40, badge:null },
    { id:'conf-12', name:'Mesa 12 pers.', icon:'📋', color:'#d29922', users:12, w:140,h:45, badge:null },
    { id:'board',   name:'Board Room',    icon:'🏆', color:'#c9a96e', users:20, w:180,h:60, badge:'Premium' },
    { id:'pouf',    name:'Pouf Circular', icon:'⭕', color:'#3fb950', users:4,  w:30, h:30, badge:null },
  ],
  recepcion: [
    { id:'reception-desk', name:'Recepción',     icon:'🏛', color:'#3fb950', users:1, w:80, h:40, badge:null },
    { id:'sofa-2',         name:'Sofá 2 plazas', icon:'🛋', color:'#3fb950', users:2, w:70, h:32, badge:null },
    { id:'sofa-3',         name:'Sofá 3 plazas', icon:'🛋', color:'#3fb950', users:3, w:95, h:32, badge:null },
    { id:'coffee-table',   name:'Mesa Centro',   icon:'⬡',  color:'#6e7681', users:0, w:40, h:40, badge:null },
  ],
  colaboracion: [
    { id:'altura-4',   name:'Altura 4 pers.',   icon:'🪑', color:'#f97316', users:4, w:60, h:60, badge:null },
    { id:'altura-6',   name:'Altura 6 pers.',   icon:'🍽', color:'#f97316', users:6, w:80, h:60, badge:null },
    { id:'phone-booth',name:'Cabina Teléfono',  icon:'📞', color:'#8b949e', users:1, w:28, h:28, badge:'Nuevo' },
    { id:'focus-room', name:'Focus Room',       icon:'🎯', color:'#f97316', users:2, w:50, h:40, badge:null },
    { id:'huddle',     name:'Huddle Space',     icon:'🤝', color:'#f97316', users:4, w:70, h:55, badge:null },
  ],
  servicios: [
    { id:'kitchen',    name:'Kitchenette',   icon:'☕', color:'#f85149', users:0, w:80, h:55, badge:null },
    { id:'cafeteria',  name:'Mesa Cafetería',icon:'🍽', color:'#f85149', users:4, w:70, h:70, badge:null },
    { id:'printer',    name:'Impresora',     icon:'🖨', color:'#6e7681', users:0, w:40, h:35, badge:null },
    { id:'vending',    name:'Vending',       icon:'🤖', color:'#6e7681', users:0, w:28, h:55, badge:null },
  ],
  storage: [
    { id:'bookcase',   name:'Librero',       icon:'📚', color:'#6e7681', users:0, w:80, h:30, badge:null },
    { id:'filing',     name:'Archivero',     icon:'🗂', color:'#6e7681', users:0, w:40, h:55, badge:null },
    { id:'cabinet',    name:'Gabinete',      icon:'🗄', color:'#6e7681', users:0, w:40, h:25, badge:null },
    { id:'shelf',      name:'Repisa',        icon:'📐', color:'#6e7681', users:0, w:60, h:20, badge:null },
  ],
};

interface Point { x: number; y: number; }
interface Wall { points: Point[]; }
interface PlacedItem {
  id: string;
  type?: string;
  name: string;
  icon: string;
  color: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rotation: number;
  users: number;
  zone: string;
}

export const LienzoBriefInteractivo: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- STATE ---
  const [currentCategory, setCurrentCategory] = useState('oficina');
  const [currentTool, setCurrentTool] = useState('select');
  const [selectedFurniture, setSelectedFurniture] = useState<string | null>(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
  const [walls, setWalls] = useState<Wall[]>([]);
  const [bgImageObj, setBgImageObj] = useState<HTMLImageElement | null>(null);
  const [mode, setMode] = useState<'import' | 'draw'>('import');
  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [gridVisible, setGridVisible] = useState(true);
  const [wallDrawing, setWallDrawing] = useState(false);
  const [wallPoints, setWallPoints] = useState<Point[]>([]);
  const [nextId, setNextId] = useState(1);
  const [toast, setToast] = useState<{ msg: string; icon: string } | null>(null);
  const [hint, setHint] = useState('Selecciona una herramienta para comenzar');

  // Internal drag state
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });
  const dragItem = useRef<number | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const wallPreview = useRef<Point | null>(null);

  const showToast = (msg: string, icon: string = '💡') => {
    setToast({ msg, icon });
    setTimeout(() => setToast(null), 3000);
  };

  const recalculateNextId = (items: PlacedItem[]) => {
    const ids = items.map(i => {
      const parts = i.id.split('-');
      return parseInt(parts[parts.length - 1]) || 0;
    });
    return Math.max(0, ...ids) + 1;
  };

  // --- LOCAL STORAGE ---
  const saveProject = useCallback(() => {
    const data = {
      placedItems,
      walls,
      scale,
      offsetX,
      offsetY,
      gridVisible,
      currentCategory,
      nextId,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem('cerebro_lienzo_brief', JSON.stringify(data));
    showToast('Borrador guardado', '💾');
  }, [placedItems, walls, scale, offsetX, offsetY, gridVisible, currentCategory, nextId]);

  const loadProject = () => {
    const saved = localStorage.getItem('cerebro_lienzo_brief');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        const restoredItems = data.placedItems || [];
        setPlacedItems(restoredItems);
        setWalls(data.walls || []);
        setScale(data.scale || 1);
        setOffsetX(data.offsetX || 0);
        setOffsetY(data.offsetY || 0);
        setGridVisible(data.gridVisible !== undefined ? data.gridVisible : true);
        setCurrentCategory(data.currentCategory || 'oficina');
        setNextId(data.nextId || recalculateNextId(restoredItems));
        
        if (restoredItems.length > 0 || (data.walls || []).length > 0 || data.bgImageObj) {
          setMode('draw');
        }
        
        showToast('Proyecto restaurado', '🏠');
      } catch (e) {
        console.error('Error loading project', e);
      }
    }
  };

  useEffect(() => {
    loadProject();
  }, []);

  // --- CANVAS RENDERING ---
  const drawFurnitureItem = (ctx: CanvasRenderingContext2D, item: PlacedItem, isSelected: boolean) => {
    const { x, y, w, h, rotation, color, icon, name } = item;
    ctx.save();
    ctx.translate(x + w / 2, y + h / 2);
    ctx.rotate((rotation || 0) * Math.PI / 180);
    ctx.translate(-(w / 2), -(h / 2));

    if (isSelected) {
      ctx.shadowColor = color;
      ctx.shadowBlur = 12 / scale;
    }

    // Body
    ctx.fillStyle = hexToRgba(color, 0.18);
    ctx.strokeStyle = color;
    ctx.lineWidth = (isSelected ? 2.5 : 1.5) / scale;
    roundRect(ctx, 0, 0, w, h, 4 / scale);
    ctx.fill();
    ctx.stroke();

    ctx.shadowBlur = 0;

    // Icon
    ctx.font = `${Math.min(w, h) * 0.45}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff';
    ctx.fillText(icon, w / 2, h / 2);

    // Label
    if (w > 40) {
      ctx.font = `${Math.max(7, Math.min(10, w * 0.13)) / scale}px 'IBM Plex Mono', monospace`;
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fillText(name.split(' ')[0], w / 2, h * 0.82);
    }

    if (isSelected) {
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5 / scale;
      ctx.setLineDash([4 / scale, 3 / scale]);
      ctx.strokeRect(-3 / scale, -3 / scale, w + 6 / scale, h + 6 / scale);
      ctx.setLineDash([]);
    }

    ctx.restore();
  };

  const drawTextItem = (ctx: CanvasRenderingContext2D, item: PlacedItem, isSelected: boolean) => {
    const { x, y, w, h, rotation, color, name } = item;
    ctx.save();
    ctx.translate(x + w / 2, y + h / 2);
    ctx.rotate((rotation || 0) * Math.PI / 180);
    ctx.translate(-(w / 2), -(h / 2));

    // Box
    ctx.fillStyle = 'rgba(22, 27, 34, 0.85)';
    ctx.strokeStyle = isSelected ? '#fff' : color;
    ctx.lineWidth = 1.5 / scale;
    if (isSelected) {
      ctx.setLineDash([4 / scale, 3 / scale]);
    }
    roundRect(ctx, 0, 0, w, h, 6 / scale);
    ctx.fill();
    ctx.stroke();
    ctx.setLineDash([]);

    // Text label
    ctx.fillStyle = color;
    ctx.font = `bold ${10 / scale}px 'IBM Plex Mono', monospace`;
    ctx.fillText('📝 NOTA TÉCNICA', 10 / scale, 18 / scale);

    // Content text with basic wrapping
    ctx.fillStyle = '#fff';
    ctx.font = `${12 / scale}px 'IBM Plex Sans', sans-serif`;
    const words = name.split(' ');
    let line = '';
    let iy = 34 / scale;
    const lineHeight = 16 / scale;
    const maxWidth = w - 20 / scale;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, 10 / scale, iy);
        line = words[n] + ' ';
        iy += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 10 / scale, iy);

    ctx.restore();
  };

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    ctx.scale(dpr, dpr); // DPR scaling
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    // Grid
    if (gridVisible) {
      const gridSize = 40;
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.lineWidth = 0.5 / scale;
      const startX = -offsetX / scale;
      const startY = -offsetY / scale;
      const endX = startX + (canvas.width / dpr) / scale;
      const endY = startY + (canvas.height / dpr) / scale;
      const gx0 = Math.floor(startX / gridSize) * gridSize;
      const gy0 = Math.floor(startY / gridSize) * gridSize;
      ctx.beginPath();
      for (let x = gx0; x <= endX; x += gridSize) {
        ctx.moveTo(x, startY); ctx.lineTo(x, endY);
      }
      for (let y = gy0; y <= endY; y += gridSize) {
        ctx.moveTo(startX, y); ctx.lineTo(endX, y);
      }
      ctx.stroke();
    }

    // BG Image
    if (bgImageObj) {
      ctx.globalAlpha = 0.85;
      ctx.drawImage(bgImageObj, 0, 0, bgImageObj.width * 0.5, bgImageObj.height * 0.5);
      ctx.globalAlpha = 1;
    }

    // Walls
    walls.forEach(wall => {
      ctx.strokeStyle = '#58a6ff';
      ctx.lineWidth = 4 / scale;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      wall.points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      ctx.stroke();
    });

    // Current wall
    if (wallDrawing && wallPoints.length > 0) {
      ctx.strokeStyle = '#58a6ff';
      ctx.lineWidth = 3 / scale;
      ctx.setLineDash([6 / scale, 4 / scale]);
      ctx.beginPath();
      wallPoints.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      if (wallPreview.current) {
        ctx.lineTo(wallPreview.current.x, wallPreview.current.y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Furniture & Text
    placedItems.forEach((item, i) => {
      if (item.type === 'text') {
        drawTextItem(ctx, item, i === selectedItemIndex);
      } else {
        drawFurnitureItem(ctx, item, i === selectedItemIndex);
      }
    });

    ctx.restore();
  }, [offsetX, offsetY, scale, gridVisible, bgImageObj, walls, wallDrawing, wallPoints, placedItems, selectedItemIndex]);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (canvas && container) {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = container.clientWidth * dpr;
        canvas.height = container.clientHeight * dpr;
        canvas.style.width = container.clientWidth + 'px';
        canvas.style.height = container.clientHeight + 'px';
        render();
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [render]);

  useEffect(() => {
    render();
  }, [render]);

  // --- UTILS ---
  function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }

  function hexToRgba(hex: string, alpha: number) {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  const toCanvasCoords = (e: React.MouseEvent | MouseEvent | React.WheelEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left - offsetX) / scale,
      y: (e.clientY - rect.top - offsetY) / scale,
    };
  };

  // --- HANDLERS ---
  const handleMouseDown = (e: React.MouseEvent) => {
    const pos = toCanvasCoords(e);

    if (e.button === 1 || (e.button === 0 && currentTool === 'pan')) {
      isPanning.current = true;
      panStart.current = { x: e.clientX - offsetX, y: e.clientY - offsetY };
      return;
    }

    if (currentTool === 'pin' && selectedFurniture) {
      const def = FURNITURE_DB[currentCategory].find(f => f.id === selectedFurniture);
      if (def) {
        const newItem: PlacedItem = {
          ...def,
          id: `${def.id}-${nextId}`,
          x: pos.x - def.w / 2,
          y: pos.y - def.h / 2,
          rotation: 0,
          zone: 'General',
        };
        setPlacedItems(prev => [...prev, newItem]);
        setNextId(n => n + 1);
        setSelectedItemIndex(placedItems.length);
        showToast(`${def.name} colocado`, def.icon);
      }
      return;
    }

    if (currentTool === 'wall') {
      if (!wallDrawing) {
        setWallDrawing(true);
        setWallPoints([{ ...pos }]);
        setHint('Clic para continuar el muro — Doble clic para terminar — Esc para cancelar');
      } else {
        setWallPoints(prev => [...prev, { ...pos }]);
      }
      return;
    }

    if (currentTool === 'select') {
      let hit: number | null = null;
      for (let i = placedItems.length - 1; i >= 0; i--) {
        const item = placedItems[i];
        if (pos.x >= item.x && pos.x <= item.x + item.w &&
          pos.y >= item.y && pos.y <= item.y + item.h) {
          hit = i;
          break;
        }
      }
      setSelectedItemIndex(hit);
      if (hit !== null) {
        dragItem.current = hit;
        dragOffset.current = { x: pos.x - placedItems[hit].x, y: pos.y - placedItems[hit].y };
      }
      return;
    }

    if (currentTool === 'erase') {
      let hit: number | null = null;
      for (let i = placedItems.length - 1; i >= 0; i--) {
        const item = placedItems[i];
        if (pos.x >= item.x && pos.x <= item.x + item.w &&
          pos.y >= item.y && pos.y <= item.y + item.h) {
          hit = i;
          break;
        }
      }
      if (hit !== null) {
        setPlacedItems(prev => prev.filter((_, i) => i !== hit));
        setSelectedItemIndex(null);
        showToast('Elemento eliminado', '🗑');
      }
    }

    if (currentTool === 'text') {
      const text = prompt('Nota técnica para el plano:');
      if (text && text.trim()) {
        const newItem: PlacedItem = {
          id: `text-${nextId}`,
          type: 'text',
          name: text.trim(),
          icon: '📝',
          color: '#c9a96e',
          x: pos.x, y: pos.y,
          w: 180, h: 64,
          rotation: 0,
          users: 0,
          zone: 'Notas',
        };
        setPlacedItems(prev => [...prev, newItem]);
        setNextId(n => n + 1);
        setSelectedItemIndex(placedItems.length);
        showToast('Nota agregada', '📝');
      }
      return;
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const pos = toCanvasCoords(e);
    if (isPanning.current) {
      setOffsetX(e.clientX - panStart.current.x);
      setOffsetY(e.clientY - panStart.current.y);
      return;
    }
    if (dragItem.current !== null) {
      const idx = dragItem.current;
      setPlacedItems(prev => {
        const res = [...prev];
        res[idx] = { ...res[idx], x: pos.x - dragOffset.current.x, y: pos.y - dragOffset.current.y };
        return res;
      });
      return;
    }
    if (wallDrawing) {
      wallPreview.current = pos;
      render();
    }
  };

  const handleMouseUp = () => {
    isPanning.current = false;
    dragItem.current = null;
  };

  const handleWheel = (e: React.WheelEvent) => {
    const factor = e.deltaY > 0 ? 0.9 : 1.1;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    setOffsetX(mx - factor * (mx - offsetX));
    setOffsetY(my - factor * (my - offsetY));
    setScale(s => {
      const next = s * factor;
      return Math.max(0.1, Math.min(10, next));
    });
  };

  const zoom = (factor: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    setOffsetX(prevX => cx - factor * (cx - prevX));
    setOffsetY(prevY => cy - factor * (cy - prevY));
    setScale(s => {
      const next = s * factor;
      return Math.max(0.1, Math.min(10, next));
    });
  };

  const resetView = () => {
    setScale(1);
    setOffsetX(0);
    setOffsetY(0);
  };

  const handleDoubleClick = () => {
    if (currentTool === 'wall' && wallDrawing) {
      if (wallPoints.length >= 2) {
        setWalls(prev => [...prev, { points: [...wallPoints] }]);
        showToast('Muro agregado', '✅');
      }
      setWallDrawing(false);
      setWallPoints([]);
    }
  };

  const clearCanvas = () => {
    if (confirm('¿Limpiar todo el lienzo?')) {
      setPlacedItems([]);
      setWalls([]);
      setBgImageObj(null);
      setNextId(1);
      showToast('Lienzo limpio', '🗑');
    }
  };

  const validateCanvasBeforeNext = () => {
    // 1. Que exista al menos un plano importado o muros dibujados.
    const hasBase = bgImageObj !== null || walls.length > 0;
    
    // 2. Que exista al menos un mueble colocado o una nota técnica.
    const hasFurniture = placedItems.length > 0;
    
    // 3. Que el total de usuarios sea mayor a 0 si hay mobiliario de oficina/salas.
    const furnitureItems = placedItems.filter(i => i.type !== 'text');
    const totalUsers = furnitureItems.reduce((acc, i) => acc + (i.users || 0), 0);
    const needsUsers = furnitureItems.length > 0;
    
    // 4. Que no haya wallDrawing activo al momento de avanzar.
    const isDrawingWall = wallDrawing;

    let errors = [];
    if (!hasBase) errors.push("Falta plano de fondo o muros dibujados");
    if (!hasFurniture) errors.push("No has colocado mobiliario ni notas técnicas");
    if (needsUsers && totalUsers <= 0) errors.push("El diseño requiere al menos 1 usuario para mobiliario de oficina");
    if (isDrawingWall) errors.push("Termina de dibujar el muro actual antes de continuar");

    return errors;
  };

  const nextStep = () => {
    const errors = validateCanvasBeforeNext();
    if (errors.length > 0) {
      showToast(errors[0], '⚠️');
      return;
    }
    
    saveProject();
    showToast('Lienzo validado y guardado correctamente', '🚀');
    // Here we would typically trigger the next tab in the parent app
    if (typeof window !== 'undefined' && (window as any).nextWizardStep) {
        (window as any).nextWizardStep();
    }
  };

  const exportCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'cerebro-lienzo-brief.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('Imagen exportada correctamente', '🖼️');
  };

  const handleFile = (file: File) => {
    if (file.type === 'application/pdf') {
      showToast('PDF recibido — renderizando primera página...', '📄');
      // Create a premium placeholder for PDF
      const img = new Image();
      const canvas = document.createElement('canvas');
      canvas.width = 1200; canvas.height = 1600;
      const c = canvas.getContext('2d')!;
      c.fillStyle = '#0d1117';
      c.fillRect(0,0,1200,1600);
      
      // Decorative border
      c.strokeStyle = 'rgba(201,169,110,0.3)';
      c.lineWidth = 10;
      c.strokeRect(40, 40, 1120, 1520);

      c.fillStyle = '#c9a96e';
      c.font = 'bold 48px sans-serif';
      c.textAlign = 'center';
      c.fillText('DOCUMENTO PDF', 600, 750);
      
      c.fillStyle = '#8b949e';
      c.font = '32px sans-serif';
      c.fillText('PDF CARGADO COMO REFERENCIA', 600, 810);
      c.font = 'italic 24px sans-serif';
      c.fillText('No es render técnico del documento', 600, 850);
      c.fillText(`Archivo: ${file.name}`, 600, 900);
      
      img.src = canvas.toDataURL();
      img.onload = () => {
        setBgImageObj(img);
        setMode('draw');
        setTool('pin');
      };
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          setBgImageObj(img);
          setMode('draw');
          setTool('pin');

          // Center and fit
          const canvas = canvasRef.current;
          if (canvas) {
            const scaleX = canvas.width / img.width;
            const scaleY = canvas.height / img.height;
            const fitScale = Math.min(scaleX, scaleY) * 0.85;
            setScale(fitScale * 2); // compensate the 0.5x in draw
            setOffsetX((canvas.width - img.width * 0.5 * (fitScale * 2)) / 2);
            setOffsetY((canvas.height - img.height * 0.5 * (fitScale * 2)) / 2);
          }
          
          showToast('Plano importado correctamente', '🖼️');
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const setTool = (t: string) => {
    setCurrentTool(t);
    if (t !== 'wall') {
      setWallDrawing(false);
      setWallPoints([]);
    }
    const hints: Record<string, string> = {
      select:  'Clic para seleccionar — arrastrar para mover',
      pan:     'Arrastra el lienzo para mover la vista [H]',
      wall:    'Clic para empezar muro — doble clic para terminar — Esc cancela',
      door:    'Clic sobre un muro para colocar puerta',
      window:  'Clic sobre un muro para colocar ventana',
      measure: 'Clic y arrastra para medir distancias',
      pin:     'Selecciona un mueble del panel y haz clic en el plano',
      text:    'Clic en el plano para agregar nota técnica',
      erase:   'Clic en un elemento para eliminarlo',
    };
    setHint(hints[t] || 'Selecciona una herramienta');
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput = e.target instanceof HTMLInputElement || 
                      e.target instanceof HTMLTextAreaElement || 
                      e.target instanceof HTMLSelectElement ||
                      (e.target as HTMLElement).isContentEditable;
      if (isInput) return;
      
      switch(e.key.toLowerCase()) {
        case 's': setTool('select'); break;
        case 'w': setTool('wall'); break;
        case 'f': setTool('pin'); break;
        case 't': setTool('text'); break;
        case 'e': setTool('erase'); break;
        case 'h': setTool('pan'); break;
        case 'r':
          if (selectedItemIndex !== null) {
            setPlacedItems(prev => {
              const res = [...prev];
              res[selectedItemIndex] = { ...res[selectedItemIndex], rotation: (res[selectedItemIndex].rotation + 45) % 360 };
              return res;
            });
          }
          break;
        case 'd':
          if (selectedItemIndex !== null) {
            const current = placedItems[selectedItemIndex];
            const copy = { ...current, id: `${current.id.split('-')[0]}-${nextId}`, x: current.x + 20, y: current.y + 20 };
            setPlacedItems(prev => [...prev, copy]);
            setNextId(n => n + 1);
            setSelectedItemIndex(placedItems.length);
            showToast('Duplicado', '⧉');
          }
          break;
        case 'g': setGridVisible(v => !v); break;
        case 'escape': 
          if (wallDrawing) {
            setWallDrawing(false);
            setWallPoints([]);
          }
          setSelectedItemIndex(null);
          setCurrentTool('select');
          break;
        case 'delete':
        case 'backspace':
          if (selectedItemIndex !== null) {
            setPlacedItems(prev => prev.filter((_, i) => i !== selectedItemIndex));
            setSelectedItemIndex(null);
          }
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [wallDrawing, selectedItemIndex, placedItems, nextId]);

  const selectedItem = selectedItemIndex !== null ? placedItems[selectedItemIndex] : null;

  const shouldShowImportOverlay = 
    mode === 'import' && 
    !bgImageObj && 
    walls.length === 0 && 
    placedItems.length === 0;

  return (
    <div id="lienzo-brief-module" className="flex flex-col flex-1 w-full h-full bg-[#0d1117] text-[#f0f6fc] font-['IBM_Plex_Sans',system-ui,sans-serif] overflow-hidden relative">
      <style dangerouslySetInnerHTML={{ __html: `
        #lienzo-brief-module * { box-sizing: border-box; margin: 0; padding: 0; }
        #lienzo-brief-module .cat-tab:hover { background: #1c2128; color: #f0f6fc; }
        #lienzo-brief-module .cat-tab.active { background: #1c2128; border: 1px solid rgba(255,255,255,0.15); color: #f0f6fc; }
        #lienzo-brief-module .cat-tab.active .cat-dot { opacity: 1; }
        #lienzo-brief-module .furniture-item:hover { border-color: rgba(255,255,255,0.15); background: #21262d; transform: translateY(-1px); }
        #lienzo-brief-module .furniture-item.selected-furniture { border-color: #c9a96e; background: rgba(201,169,110,0.12); }
        #lienzo-brief-module .tool-btn.active { background: #fff !important; color: #0d1117 !important; border-color: #fff !important; }
        #lienzo-brief-module .tool-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        #lienzo-brief-module .mode-btn.active { background: #21262d; color: #f0f6fc; border-color: rgba(255,255,255,0.15); }
        #lienzo-brief-module .placed-item:hover { border-color: rgba(255,255,255,0.15); background: #21262d; }
        #lienzo-brief-module .placed-item.highlighted { border-color: #c9a96e; background: rgba(201,169,110,0.12); }
        #lienzo-brief-module .grid-bg {
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        #lienzo-brief-module ::-webkit-scrollbar { width: 4px; }
        #lienzo-brief-module ::-webkit-scrollbar-track { background: transparent; }
        #lienzo-brief-module ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 2px; }
      `}} />

      <div className="h-[60px] shrink-0 border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between px-6 bg-[#0d1117] z-[110]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="font-['Playfair_Display'] text-[22px] italic font-bold text-white leading-none">Cerebro</div>
            <span className="text-[#6e7681] text-[18px]">/</span>
            <span className="font-['Playfair_Display'] text-[20px] italic text-[#8b949e] leading-none">V2.0</span>
          </div>
          <div className="h-6 w-[1px] bg-[rgba(255,255,255,0.1)] mx-2"></div>
          <div className="flex items-center gap-2 text-[12px] text-[#8b949e] font-mono whitespace-nowrap">
            <span>CEREBRO 2.0</span>
            <span className="text-[#6e7681]">/</span>
            <span>Mis Negocios</span>
            <span className="text-[#6e7681]">/</span>
            <span className="text-[#f0f6fc] font-semibold">Lienzo de Amueblado</span>
          </div>
          <div className="ml-4 px-[14px] py-[6px] rounded-full bg-[rgba(201,169,110,0.12)] border border-[rgba(201,169,110,0.3)] text-[#c9a96e] text-[12px] font-semibold font-mono flex items-center gap-2 whitespace-nowrap leading-none">
            <span>🏢</span> Ventas (Captura & Canvas)
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={clearCanvas} className="flex items-center gap-2 px-[14px] py-[6px] rounded-lg border border-[rgba(255,255,255,0.15)] bg-transparent text-[#f0f6fc] text-[12px] font-semibold hover:bg-[#21262d] transition-all">
            🗑 Limpiar
          </button>
          <button onClick={exportCanvas} className="flex items-center gap-2 px-[14px] py-[6px] rounded-lg border border-[rgba(255,255,255,0.15)] bg-transparent text-[#f0f6fc] text-[12px] font-semibold hover:bg-[#21262d] transition-all">
            📤 Exportar Imagen
          </button>
          <button onClick={saveProject} className="flex items-center gap-2 px-[14px] py-[6px] rounded-lg border border-[rgba(255,255,255,0.15)] bg-transparent text-[#f0f6fc] text-[12px] font-semibold hover:bg-[#21262d] transition-all">
            💾 Guardar borrador
          </button>
          <button onClick={nextStep} className="flex items-center gap-2 px-[14px] py-[6px] rounded-lg bg-[#c9a96e] text-[#0d1117] text-[12px] font-bold hover:bg-[#bfa065] transition-all">
            Siguiente 📋
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden border-t border-[rgba(255,255,255,0.08)]">
        {/* --- LEFT PANEL --- */}
      <div className="w-[260px] shrink-0 bg-[#0d1117] border-r border-[rgba(255,255,255,0.08)] flex flex-col overflow-hidden">
        <div className="p-[16px_16px_8px] text-[10px] font-bold uppercase tracking-[1.5px] text-[#6e7681] font-mono">Categorías</div>
        <div className="flex flex-col gap-[2px] p-[0_10px_12px]">
          {[
            { id: 'oficina', name: 'Oficina', icon: '🖥', color: '#58a6ff' },
            { id: 'sala', name: 'Sala de Juntas', icon: '🪑', color: '#d29922' },
            { id: 'recepcion', name: 'Recepción', icon: '🏛', color: '#3fb950' },
            { id: 'colaboracion', name: 'Colaboración', icon: '🤝', color: '#f97316' },
            { id: 'servicios', name: 'Servicios', icon: '☕', color: '#f85149' },
            { id: 'storage', name: 'Almacenaje', icon: '📦', color: '#6e7681' },
          ].map(cat => (
            <div 
              key={cat.id} 
              className={`flex items-center gap-[10px] p-[9px_12px] rounded-lg cursor-pointer transition-all duration-200 border border-transparent text-[#8b949e] text-[13px] cat-tab ${currentCategory === cat.id ? 'active' : ''}`}
              onClick={() => setCurrentCategory(cat.id)}
            >
              <span className="text-[16px]">{cat.icon}</span>
              <span className="flex-1">{cat.name}</span>
              <span className="w-[6px] h-[6px] rounded-full opacity-40 cat-dot" style={{ backgroundColor: cat.color }}></span>
              <span className="text-[10px] text-[#6e7681] font-mono ml-2">{FURNITURE_DB[cat.id]?.length || 0}</span>
            </div>
          ))}
        </div>
        <div className="h-[1px] bg-[rgba(255,255,255,0.08)] m-[8px_10px]"></div>
        <div className="p-[16px_16px_8px] text-[10px] font-bold uppercase tracking-[1.5px] text-[#6e7681] font-mono">Mobiliario</div>
        <div className="flex-1 overflow-y-auto p-[0_10px_10px]">
          <div className="grid grid-cols-2 gap-[8px]">
            {FURNITURE_DB[currentCategory].map(f => (
              <div 
                key={f.id} 
                className={`bg-[#1c2128] border border-[rgba(255,255,255,0.08)] rounded-xl p-[12px_8px] flex flex-col items-center gap-[8px] cursor-grab transition-all duration-200 relative furniture-item ${selectedFurniture === f.id ? 'selected-furniture' : ''}`}
                onClick={() => { setSelectedFurniture(f.id); setTool('pin'); }}
              >
                {f.badge && <span className="absolute top-[6px] right-[6px] text-[9px] p-[2px_6px] rounded bg-[rgba(63,185,80,0.15)] text-[#3fb950] font-bold uppercase tracking-[0.4px]">{f.badge}</span>}
                <div className="text-[28px] leading-none">{f.icon}</div>
                <div className="text-[10px] font-bold text-center text-[#8b949e] uppercase tracking-[0.5px] leading-[1.3]">{f.name}</div>
                {f.users > 0 && <div className="absolute top-[6px] left-[6px] text-[9px] font-mono font-bold text-[#6e7681] bg-[#161b22] p-[1px_5px] rounded border border-[rgba(255,255,255,0.08)]">{f.users}p</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- CENTER: CANVAS --- */}
      <div className="flex-1 relative overflow-hidden bg-[#1c2128] flex flex-col">
        {/* Mode Bar */}
        <div className="absolute top-[16px] left-[16px] z-[100] flex gap-[4px]">
          <button className={`p-[6px_14px] rounded-[20px] border border-[rgba(255,255,255,0.08)] bg-[#161b22] text-[#8b949e] text-[11px] font-bold cursor-pointer transition-all uppercase tracking-[0.5px] ${mode === 'import' ? 'active' : ''}`} onClick={() => setMode('import')}>📥 Importar plano</button>
          <button className={`p-[6px_14px] rounded-[20px] border border-[rgba(255,255,255,0.08)] bg-[#161b22] text-[#8b949e] text-[11px] font-bold cursor-pointer transition-all uppercase tracking-[0.5px] ${mode === 'draw' ? 'active' : ''}`} onClick={() => { setMode('draw'); setTool('wall'); }}>✏️ Dibujar</button>
        </div>

        {/* Toolbar */}
        <div className="absolute top-[16px] left-1/2 -translate-x-1/2 flex items-center gap-[4px] z-[100] bg-[#161b22] border border-[rgba(255,255,255,0.15)] rounded-xl p-[6px] shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
          <button className={`w-[38px] h-[38px] rounded border border-transparent bg-transparent text-[#8b949e] cursor-pointer flex flex-col items-center justify-center transition-all tool-btn ${currentTool === 'select' ? 'active' : ''}`} onClick={() => setTool('select')} title="Seleccionar (S)">
            <MousePointer2 size={18} />
            <span className="text-[8px] font-bold uppercase tracking-[0.5px] leading-none mt-1">Sel</span>
          </button>
          <button className={`w-[38px] h-[38px] rounded border border-transparent bg-transparent text-[#8b949e] cursor-pointer flex flex-col items-center justify-center transition-all tool-btn ${currentTool === 'pan' ? 'active' : ''}`} onClick={() => setTool('pan')} title="Pan (H)">
            <Hand size={18} />
            <span className="text-[8px] font-bold uppercase tracking-[0.5px] leading-none mt-1">Pan</span>
          </button>
          <div className="w-[1px] h-[32px] bg-[rgba(255,255,255,0.08)] m-[0_4px]"></div>
          <button className={`w-[38px] h-[38px] rounded border border-transparent bg-transparent text-[#8b949e] cursor-pointer flex flex-col items-center justify-center transition-all tool-btn ${currentTool === 'wall' ? 'active' : ''}`} onClick={() => setTool('wall')} title="Muro (W)">
            <Maximize size={18} />
            <span className="text-[8px] font-bold uppercase tracking-[0.5px] leading-none mt-1">Muro</span>
          </button>
          <button className={`w-[38px] h-[38px] rounded border border-transparent bg-transparent text-[#8b949e] cursor-pointer flex flex-col items-center justify-center transition-all tool-btn relative`} onClick={() => setTool('door')} title="Puerta (Próx.)">
            <DoorOpen size={18} />
            <span className="text-[8px] font-bold uppercase tracking-[0.5px] leading-none mt-1">Puerta</span>
            <div className="absolute top-0 right-0 text-[6px] bg-[#c9a96e] text-[#0d1117] rounded-full px-1">Próx</div>
          </button>
          <button className={`w-[38px] h-[38px] rounded border border-transparent bg-transparent text-[#8b949e] cursor-pointer flex flex-col items-center justify-center transition-all tool-btn relative`} onClick={() => setTool('window')} title="Ventana (Próx.)">
            <Layout size={18} />
            <span className="text-[8px] font-bold uppercase tracking-[0.5px] leading-none mt-1">Ventana</span>
            <div className="absolute top-0 right-0 text-[6px] bg-[#c9a96e] text-[#0d1117] rounded-full px-1">Próx</div>
          </button>
          <button className={`w-[38px] h-[38px] rounded border border-transparent bg-transparent text-[#8b949e] cursor-pointer flex flex-col items-center justify-center transition-all tool-btn relative`} onClick={() => setTool('measure')} title="Cota (Próx.)">
            <Ruler size={18} />
            <span className="text-[8px] font-bold uppercase tracking-[0.5px] leading-none mt-1">Cota</span>
            <div className="absolute top-0 right-0 text-[6px] bg-[#c9a96e] text-[#0d1117] rounded-full px-1">Próx</div>
          </button>
          <div className="w-[1px] h-[32px] bg-[rgba(255,255,255,0.08)] m-[0_4px]"></div>
          <button className={`w-[38px] h-[38px] rounded border border-transparent bg-transparent text-[#8b949e] cursor-pointer flex flex-col items-center justify-center transition-all tool-btn ${currentTool === 'pin' ? 'active' : ''}`} onClick={() => setTool('pin')} title="Colocar mobiliario (F)">
            <Pin size={18} />
            <span className="text-[8px] font-bold uppercase tracking-[0.5px] leading-none mt-1">Pin</span>
          </button>
          <button className={`w-[38px] h-[38px] rounded border border-transparent bg-transparent text-[#8b949e] cursor-pointer flex flex-col items-center justify-center transition-all tool-btn ${currentTool === 'text' ? 'active' : ''}`} onClick={() => setTool('text')} title="Texto (T)">
            <Type size={18} />
            <span className="text-[8px] font-bold uppercase tracking-[0.5px] leading-none mt-1">Texto</span>
          </button>
          <div className="w-[1px] h-[32px] bg-[rgba(255,255,255,0.08)] m-[0_4px]"></div>
          <button className={`w-[38px] h-[38px] rounded border border-transparent bg-transparent text-[#8b949e] cursor-pointer flex flex-col items-center justify-center transition-all tool-btn ${currentTool === 'erase' ? 'active' : ''}`} onClick={() => setTool('erase')} title="Borrar (E)">
            <Eraser size={18} />
            <span className="text-[8px] font-bold uppercase tracking-[0.5px] leading-none mt-1">Borrar</span>
          </button>
        </div>

        {/* Canvas Area */}
        <div ref={containerRef} className="flex-1 relative overflow-hidden">
          {shouldShowImportOverlay && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-[20px] z-[50] bg-[#1c2128]">
              <div 
                className="w-[420px] max-w-[90%] border-2 border-dashed border-[rgba(255,255,255,0.15)] rounded-[20px] p-[48px_40px] flex flex-col items-center gap-[16px] text-center cursor-pointer transition-all bg-[rgba(22,27,34,0.6)] hover:border-[#c9a96e] hover:bg-[rgba(201,169,110,0.04)]"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('bg-[rgba(201,169,110,0.08)]'); e.currentTarget.classList.add('scale-[1.02]'); }}
                onDragLeave={e => { e.currentTarget.classList.remove('bg-[rgba(201,169,110,0.08)]'); e.currentTarget.classList.remove('scale-[1.02]'); }}
                onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('bg-[rgba(201,169,110,0.08)]'); e.currentTarget.classList.remove('scale-[1.02]'); if(e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
              >
                <div className="text-[48px] opacity-50">🗺️</div>
                <div className="text-[18px] font-bold text-[#f0f6fc]">Importar plano del cliente</div>
                <div className="text-[13px] text-[#8b949e] leading-[1.6]">Arrastra aquí un PDF, PNG o JPG<br/>o haz clic para seleccionar</div>
                <button className="p-[10px_24px] rounded bg-[#c9a96e] text-[#0d1117] border-none text-[13px] font-bold cursor-pointer transition-all hover:bg-[#bfa065]">Seleccionar archivo</button>
              </div>
              <div className="text-[12px] text-[#6e7681]">— o —</div>
              <button className="p-[10px_24px] rounded bg-transparent text-[#8b949e] border border-[rgba(255,255,255,0.15)] text-[13px] font-semibold cursor-pointer transition-all hover:bg-[#21262d] hover:text-[#f0f6fc]" onClick={() => { setMode('draw'); setTool('wall'); }}>✏️ Dibujar plano desde cero</button>
            </div>
          )}

          <canvas 
            ref={canvasRef} 
            className={`w-full h-full block grid-bg ${currentTool === 'pan' ? (isPanning.current ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-crosshair'}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            onDoubleClick={handleDoubleClick}
            onContextMenu={e => e.preventDefault()}
          />
        </div>

        {/* Canvas Controls */}
        <div className="absolute bottom-[20px] left-[20px] z-[100] flex gap-[6px]">
          <button className="w-[32px] h-[32px] rounded border border-[rgba(255,255,255,0.08)] bg-[#161b22] text-[#8b949e] cursor-pointer flex items-center justify-center transition-all hover:bg-[#21262d] hover:text-[#f0f6fc]" onClick={() => zoom(1.2)} title="Zoom +"><ZoomIn size={14} /></button>
          <button className="w-[32px] h-[32px] rounded border border-[rgba(255,255,255,0.08)] bg-[#161b22] text-[#8b949e] cursor-pointer flex items-center justify-center transition-all hover:bg-[#21262d] hover:text-[#f0f6fc]" onClick={() => zoom(0.8)} title="Zoom -"><ZoomOut size={14} /></button>
          <button className="w-[32px] h-[32px] rounded border border-[rgba(255,255,255,0.08)] bg-[#161b22] text-[#8b949e] cursor-pointer flex items-center justify-center transition-all hover:bg-[#21262d] hover:text-[#f0f6fc]" onClick={resetView} title="Centrar"><Maximize size={14} /></button>
          <button className={`w-[32px] h-[32px] rounded border border-[rgba(255,255,255,0.08)] bg-[#161b22] text-[#8b949e] cursor-pointer flex items-center justify-center transition-all hover:bg-[#21262d] hover:text-[#f0f6fc] ${gridVisible ? 'text-[#c9a96e] border-[#c9a96e]' : ''}`} onClick={() => setGridVisible(!gridVisible)} title="Grid"><Grid3X3 size={14} /></button>
        </div>

        {/* Scale Badge */}
        <div className="absolute bottom-[20px] right-[20px] z-[100] bg-[#161b22] border border-[rgba(255,255,255,0.08)] rounded p-[6px_12px] font-mono text-[11px] text-[#8b949e] flex items-center gap-[8px]">
          <span>1:{Math.round(100 / scale)}</span>
          <div className="h-[2px] w-[40px] bg-[#6e7681] rounded-[1px]"></div>
          <span>{Math.round(4 / scale)}m</span>
        </div>

        {/* Hint Bar */}
        <div className={`absolute bottom-[60px] left-1/2 -translate-x-1/2 bg-[rgba(22,27,34,0.9)] border border-[rgba(255,255,255,0.08)] rounded p-[8px_16px] text-[12px] text-[#8b949e] z-[100] pointer-events-none transition-opacity duration-300 ${hint ? 'opacity-100' : 'opacity-0'}`}>{hint}</div>
      </div>

      {/* --- RIGHT PANEL --- */}
      <div className="w-[320px] shrink-0 bg-[#0d1117] border-l border-[rgba(255,255,255,0.08)] flex flex-col overflow-hidden">
        <div className="p-[16px] border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between">
          <div>
            <div className="text-[13px] font-bold text-[#f0f6fc]">Resumen de Amueblado</div>
            <div className="text-[11px] text-[#6e7681] font-mono mt-[2px]">Módulo Briefing V2.0</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-[12px]">
          {/* KPIs */}
          <div className="grid grid-cols-2 gap-[8px] mb-[12px]">
            <div className="bg-[#1c2128] border border-[rgba(255,255,255,0.08)] rounded p-[10px] text-center">
              <div className="text-[22px] font-bold text-[#f0f6fc] font-mono">{placedItems.filter(i => i.type !== 'text').length}</div>
              <div className="text-[9px] text-[#6e7681] uppercase tracking-[0.5px] mt-[2px]">Piezas totales</div>
            </div>
            <div className="bg-[#1c2128] border border-[rgba(255,255,255,0.08)] rounded p-[10px] text-center">
              <div className="text-[22px] font-bold text-[#f0f6fc] font-mono">{placedItems.reduce((s, i) => s + (i.users || 0), 0)}</div>
              <div className="text-[9px] text-[#6e7681] uppercase tracking-[0.5px] mt-[2px]">Usuarios</div>
            </div>
            <div className="bg-[#1c2128] border border-[rgba(255,255,255,0.08)] rounded p-[10px] text-center">
              <div className="text-[22px] font-bold text-[#f0f6fc] font-mono">{new Set(placedItems.filter(i => i.type !== 'text').map(i => i.zone)).size}</div>
              <div className="text-[9px] text-[#6e7681] uppercase tracking-[0.5px] mt-[2px]">Áreas</div>
            </div>
            <div className="bg-[#1c2128] border border-[rgba(255,255,255,0.08)] rounded p-[10px] text-center">
              <div className="text-[22px] font-bold text-[#f0f6fc] font-mono">—</div>
              <div className="text-[9px] text-[#6e7681] uppercase tracking-[0.5px] mt-[2px]">m² est.</div>
            </div>
          </div>

          {/* Placed Items List by Zone */}
          <div className="mb-[16px]">
            <div className="text-[10px] font-bold uppercase tracking-[1px] text-[#6e7681] font-mono p-[0_4px_8px] border-b border-[rgba(255,255,255,0.08)] mb-[8px] flex justify-between items-center">
              Mobiliario por zona
              <span className="bg-[#1c2128] border border-[rgba(255,255,255,0.08)] rounded p-[1px_6px] text-[10px] text-[#8b949e]">{placedItems.filter(i => i.type !== 'text').length} pzas</span>
            </div>
            
            {placedItems.filter(i => i.type !== 'text').length === 0 ? (
              <div className="text-center p-[12px_0] text-[12px] text-[#6e7681]">No hay mobiliario colocado</div>
            ) : (
              (Object.entries(
                placedItems.filter(i => i.type !== 'text').reduce((acc, item) => {
                  const zone = item.zone || 'General';
                  if (!acc[zone]) acc[zone] = [];
                  acc[zone].push(item);
                  return acc;
                }, {} as Record<string, PlacedItem[]>)
              ) as [string, PlacedItem[]][]).map(([zone, groupItems]) => (
                <div key={zone} className="mb-4">
                  <div className="px-2 py-1 text-[11px] font-bold text-[#c9a96e] bg-[rgba(201,169,110,0.05)] rounded mb-2 flex justify-between items-center">
                    <span>📍 {zone}</span>
                    <span className="text-[10px] opacity-70 font-mono">{groupItems.length} pzas · {groupItems.reduce((s, b) => s + (b.users || 0), 0)} usu.</span>
                  </div>
                  <div className="flex flex-col gap-[4px]">
                    {groupItems.map((item) => {
                      const idx = placedItems.findIndex(pi => pi.id === item.id);
                      return (
                        <div 
                          key={item.id} 
                          className={`flex items-center gap-[10px] p-[6px_10px] rounded border border-[rgba(255,255,255,0.05)] bg-[#1c2128] cursor-pointer transition-all placed-item ${idx === selectedItemIndex ? 'highlighted' : ''}`}
                          onClick={() => setSelectedItemIndex(idx)}
                        >
                          <div className="w-[6px] h-[6px] rounded-[1px] shrink-0" style={{ backgroundColor: item.color }}></div>
                          <div className="flex-1">
                            <div className="text-[11px] text-[#f0f6fc] font-medium">{item.icon} {item.name}</div>
                          </div>
                          <button className="w-[18px] h-[18px] rounded border-none bg-transparent text-[#6e7681] cursor-pointer flex items-center justify-center transition-all hover:text-red-500 hover:bg-red-500/10" onClick={(e) => { e.stopPropagation(); setPlacedItems(prev => prev.filter(pi => pi.id !== item.id)); if(selectedItemIndex === idx) setSelectedItemIndex(null); }}><Trash2 size={11} /></button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Technical Notes Section */}
          <div className="mb-[16px]">
            <div className="text-[10px] font-bold uppercase tracking-[1px] text-[#6e7681] font-mono p-[0_4px_8px] border-b border-[rgba(255,255,255,0.08)] mb-[8px] flex justify-between items-center">
              Notas técnicas del levantamiento
              <span className="bg-[#1c2128] border border-[rgba(255,255,255,0.08)] rounded p-[1px_6px] text-[10px] text-[#8b949e]">{placedItems.filter(i => i.type === 'text').length}</span>
            </div>
            <div className="flex flex-col gap-[4px]">
              {placedItems.filter(i => i.type === 'text').length === 0 ? (
                <div className="text-center p-[12px_0] text-[12px] text-[#6e7681]">No hay notas técnicas</div>
              ) : (
                placedItems.filter(i => i.type === 'text').map((item) => {
                  const idx = placedItems.findIndex(pi => pi.id === item.id);
                  return (
                    <div 
                      key={item.id} 
                      className={`flex items-start gap-[10px] p-[8px_10px] rounded border border-[rgba(255,255,255,0.08)] bg-[#161b22] cursor-pointer transition-all placed-item ${idx === selectedItemIndex ? 'highlighted' : ''}`}
                      onClick={() => setSelectedItemIndex(idx)}
                    >
                      <span className="mt-0.5 text-[#d29922]"><Type size={12} /></span>
                      <div className="flex-1 text-[11px] text-[#8b949e] italic leading-tight">{item.name}</div>
                      <button className="w-[18px] h-[18px] rounded border-none bg-transparent text-[#6e7681] cursor-pointer flex items-center justify-center transition-all hover:text-red-500 hover:bg-red-500/10" onClick={(e) => { e.stopPropagation(); setPlacedItems(prev => prev.filter(pi => pi.id !== item.id)); if(selectedItemIndex === idx) setSelectedItemIndex(null); }}><Trash2 size={11} /></button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Selected Item Props */}
        {selectedItem && (
          <div className="border-t border-[rgba(255,255,255,0.08)] p-[12px] bg-[#161b22]">
            <div className="text-[12px] font-bold text-[#f0f6fc] mb-[10px] flex items-center gap-[8px]">
              <span>{selectedItem.icon}</span>
              <span className="truncate max-w-[200px]">{selectedItem.name}</span>
            </div>
            
            <div className="flex flex-col gap-[8px]">
              {selectedItem.type === 'text' ? (
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] text-[#8b949e]">Contenido de nota</span>
                  <textarea 
                    className="bg-[#1c2128] border border-[rgba(255,255,255,0.08)] rounded text-[#f0f6fc] text-[12px] p-[8px] w-full h-[100px] focus:border-[#c9a96e] focus:outline-none resize-none" 
                    value={selectedItem.name} 
                    onChange={e => {
                      const val = e.target.value;
                      setPlacedItems(prev => {
                        const res = [...prev];
                        if(selectedItemIndex !== null) res[selectedItemIndex] = { ...res[selectedItemIndex], name: val };
                        return res;
                      });
                    }}
                  />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#8b949e]">Zona / Área</span>
                    <input 
                      className="bg-[#1c2128] border border-[rgba(255,255,255,0.08)] rounded text-[#f0f6fc] font-mono text-[12px] p-[4px_8px] w-[140px] text-center focus:border-[#c9a96e] focus:outline-none" 
                      value={selectedItem.zone} 
                      onChange={e => {
                        const val = e.target.value;
                        setPlacedItems(prev => {
                          const res = [...prev];
                          if(selectedItemIndex !== null) res[selectedItemIndex] = { ...res[selectedItemIndex], zone: val };
                          return res;
                        });
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#8b949e]">Usuarios</span>
                    <input 
                      type="number"
                      className="bg-[#1c2128] border border-[rgba(255,255,255,0.08)] rounded text-[#f0f6fc] font-mono text-[12px] p-[4px_8px] w-[80px] text-center focus:border-[#c9a96e] focus:outline-none" 
                      value={selectedItem.users} 
                      onChange={e => {
                        const val = parseInt(e.target.value) || 0;
                        setPlacedItems(prev => {
                          const res = [...prev];
                          if(selectedItemIndex !== null) res[selectedItemIndex] = { ...res[selectedItemIndex], users: val };
                          return res;
                        });
                      }}
                    />
                  </div>
                </>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#8b949e]">Rotación</span>
                <span className="text-[12px] text-[#f0f6fc] font-mono font-medium">{selectedItem.rotation}°</span>
              </div>

              <div className="flex gap-[6px] mt-[12px]">
                <button className="flex-1 p-[7px] rounded border border-[rgba(255,255,255,0.08)] bg-transparent text-[#8b949e] text-[11px] font-bold cursor-pointer transition-all hover:bg-[#21262d] hover:text-[#f0f6fc]" onClick={() => {
                  setPlacedItems(prev => {
                    const res = [...prev];
                    if(selectedItemIndex !== null) res[selectedItemIndex] = { ...res[selectedItemIndex], rotation: (res[selectedItemIndex].rotation + 45) % 360 };
                    return res;
                  });
                }}>↻ Rotar</button>
                <button className="flex-1 p-[7px] rounded border border-[rgba(255,255,255,0.08)] bg-transparent text-[#8b949e] text-[11px] font-bold cursor-pointer transition-all hover:bg-[#21262d] hover:text-[#f0f6fc]" onClick={() => {
                  if(selectedItemIndex !== null) {
                    const current = placedItems[selectedItemIndex];
                    const copy = { ...current, id: `${current.id.split('-')[0]}-${nextId}`, x: current.x + 20, y: current.y + 20 };
                    setPlacedItems(prev => [...prev, copy]);
                    setNextId(n => n + 1);
                    setSelectedItemIndex(placedItems.length);
                    showToast('Duplicado', '⧉');
                  }
                }}>⧉ Duplicar</button>
                <button className="flex-1 p-[7px] rounded border border-[rgba(255,255,255,0.08)] bg-transparent text-[#8b949e] text-[11px] font-bold cursor-pointer transition-all hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30" onClick={() => {
                  if(selectedItemIndex !== null) {
                    setPlacedItems(prev => prev.filter((_, i) => i !== selectedItemIndex));
                    setSelectedItemIndex(null);
                    showToast('Eliminado', '🗑');
                  }
                }}>✕ Eliminar</button>
              </div>
            </div>
          </div>
        )}

        <div className="p-[12px] border-t border-[rgba(255,255,255,0.08)] flex flex-col gap-3 items-center">
            <button 
              onClick={nextStep}
              className="w-full py-3 bg-[#c9a96e] hover:bg-[#b8985d] text-[#0d1117] font-bold text-[12px] uppercase tracking-[1px] rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-95"
            >
              Finalizar y Continuar <ArrowRight size={14} />
            </button>
            <div className="text-[10px] text-[#6e7681] font-mono uppercase tracking-[0.5px]">Cerebro 2026 · AI Assistant</div>
        </div>
      </div>
    </div>

      <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg,.webp" onChange={e => { if(e.target.files?.[0]) handleFile(e.target.files[0]); }} />

      {/* Toast */}
      <div className={`fixed bottom-[32px] left-1/2 -translate-x-1/2 bg-[#161b22] border border-[rgba(255,255,255,0.15)] rounded-xl p-[12px_20px] text-[13px] text-[#f0f6fc] font-medium shadow-[0_8px_24px_rgba(0,0,0,0.6)] z-[9999] transition-opacity duration-300 pointer-events-none flex items-center gap-[10px] ${toast ? 'opacity-100' : 'opacity-0'}`}>
        <span>{toast?.icon}</span>
        <span>{toast?.msg}</span>
      </div>
    </div>
  );
};
