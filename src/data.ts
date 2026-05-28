import { Project, User, Request, InboxProject, LoadCapacity, ProjectMagnitude } from './types';

export const users: Record<string, User> = {
  'kt': { id: 'kt', initials: 'KT', name: 'Karen Tovar', role: 'Proyectista', location: 'CDMX', avatarColor: 'bg-blue-900 text-blue-300' },
  'ms': { id: 'ms', initials: 'MS', name: 'Mariano Sanchez', role: 'Ventas', location: 'Laguna', avatarColor: 'bg-teal-900 text-teal-300' },
  'or': { id: 'or', initials: 'OR', name: 'Oscar Rodriguez', role: 'Proyectista', location: 'Monterrey', avatarColor: 'bg-red-900 text-red-300' },
  'rv': { id: 'rv', initials: 'RV', name: 'Rodrigo Vergara', role: 'Proyectista', location: 'Querétaro', avatarColor: 'bg-amber-900 text-amber-300' },
};

export const currentUser = users['kt'];

export const mockProjects: Project[] = [
  {
    id: 'p1',
    code: 'LAG-011',
    name: 'Sala de Juntas Saulo',
    client: 'Autosistemas de Torreón',
    magnitude: 'G',
    status: 'Aprobado',
    assignedTo: 'kt',
    advisorId: 'ms',
    budget: '$620,000 MXN',
    style: 'Corporativo Moderno',
    rendersReq: 'Sí — 3 vistas',
    virtualTour: 'No',
    lines: 'Nova, Kenza, Mesas de Juntas',
    sqm: '280 m²',
    hasUrgentRequest: true,
    requestCount: 1,
    tags: ['Aprobado', 'GRANDE'],
    deliveryDeadline: 'Vie 30 Mayo',
    startDate: '12 May',
    completenessScore: 80,
    pendingInfoItems: ['planos actualizados (v2 solicitada)'],
    pointsValue: 3,
    requiresVirtualTour: true,
    requiresRenders: true,
    renderCount: 3,
    isInInbox: false,
    deliveryHistory: [
      { id: 'dh1', date: '15 May', author: 'Karen Tovar', description: 'Propuesta v1 — layout inicial', items: ['Layout DWG', 'Propuesta PDF'], status: 'delivered' }
    ],
    timeline: [
      { id: 't1', title: '1. Levantamiento y brief', subtitle: 'Formulario completo · Archivos recibidos · Magnitud asignada', status: 'done', date: '12 May', metaMessage: '✓ Completado · Karen Tovar' },
      { id: 't2', title: '2. Layout inicial', subtitle: 'Propuesta en DWG · Aprobada por asesor', status: 'done', date: '15 May', metaMessage: '✓ Completado' },
      { id: 't3', title: '3. Modificaciones', subtitle: 'Cambio de mesa de juntas solicitado — pendiente de respuesta', status: 'active', metaMessage: '⚠ Solicitud urgente · 1h sin responder · vence hoy', isUrgent: true },
      { id: 't4', title: '4. Renders finales (3 vistas)', subtitle: '3 vistas acordadas · Pendiente de inicio', status: 'blocked', metaMessage: '🔒 Bloqueado por fase 3 · Plazo: 7 días hábiles' },
      { id: 't5', title: '5. Recorrido Virtual 360°', subtitle: 'Producción premium · Tope de 7 días', status: 'blocked', metaMessage: '🔒 Bloqueado' },
      { id: 't6', title: '6. Subida de entregables y notificación', subtitle: 'Un clic → asesor notificado → estado actualizado', status: 'pending', metaMessage: 'Pendiente' },
      { id: 't7', title: '7. Presentación al cliente via Presentador Gebesa', subtitle: 'El asesor genera el link desde CEREBRO', status: 'pending', metaMessage: 'Pendiente' },
    ],
    files: [
      { id: 'f1', name: 'planta-arq-saulo-v2.dwg', type: 'DWG', size: '2.4 MB', date: '16 May', author: 'Karen T.' },
      { id: 'f2', name: 'mobiliario-layout-v3.skp', type: 'SKP', size: '18.2 MB', date: '17 May', author: 'Karen T.' },
      { id: 'f3', name: 'cotizacion-saulo-620k.pdf', type: 'PDF', size: '840 KB', date: '15 May', author: 'Mariano S.' },
      { id: 'f4', name: 'propuesta-v1-saulo.pdf', type: 'PDF', size: '3.1 MB', date: '15 May', author: 'Karen T.' },
      { id: 'f5', name: 'referencia-cliente-01.jpg', type: 'IMG', size: '1.2 MB', date: '13 May', author: 'Mariano S.' },
    ],
    requests: [
      { id: 'r1', type: 'URGENTE', title: 'Cambio de mesa de juntas — de rectangular a tipo barco', description: 'El cliente revisó la propuesta v1 y pide que la mesa sea tipo barco. ¿Podemos ver alternativa en línea Nova o Kenza? Necesita medidas similares para 10 personas. La presentación al cliente es el viernes.', author: 'Mariano Sanchez', date: 'hace 1h', projectId: 'p1', status: 'pending' }
    ],
    comments: [
      { id: 'c1', authorId: 'ms', authorName: 'Mariano Sanchez', date: 'ayer 14:32', text: 'Karen, el cliente de Saulo pregunta si podemos tener los renders para el viernes. ¿Es posible?' },
      { id: 'c2', authorId: 'kt', authorName: 'Karen Tovar', date: 'ayer 16:10', text: 'Mariano, sí es posible pero necesito que me confirme si la mesa de juntas va con cambio (tu solicitud de hoy) porque eso cambia el layout y los renders. Dame el OK y arranco.' },
      { id: 'c3', authorId: 'ms', authorName: 'Mariano Sanchez', date: 'hoy 09:15', text: 'Correcto, el cliente confirmó el cambio. Mesa tipo barco para 10 personas, línea Nova si tienen la medida correcta. Enviando la solicitud formal ahora.' },
    ],
    images: ['render-saulo-opcion-A.png', 'render-saulo-lateral.png', 'referencia-cliente-01.jpg']
  },
  {
    id: 'p2',
    code: 'QRO-022',
    name: 'Oficinas Mexi Energi',
    client: 'Coipa Grupo Constructor',
    magnitude: 'M',
    status: 'Visto Bueno',
    assignedTo: 'kt',
    advisorId: 'ms',
    budget: '$340,000 MXN',
    style: 'Industrial',
    rendersReq: 'Sí — 1 vista',
    virtualTour: 'No',
    lines: 'Ascend, Urban',
    sqm: '120 m²',
    hasUrgentRequest: false,
    requestCount: 0,
    tags: ['Visto Bueno', '🎨 Render req.'],
    deliveryDeadline: 'Mar 27 Mayo',
    startDate: '16 May',
    completenessScore: 100,
    pendingInfoItems: [],
    pointsValue: 2,
    requiresVirtualTour: false,
    requiresRenders: true,
    renderCount: 2,
    isInInbox: false,
    deliveryHistory: [],
    timeline: [
      { id: 't1', title: '1. Brief y levantamiento', subtitle: 'Completo · Referencias recibidas', status: 'done', date: '16 May', metaMessage: '✓ Completado' },
      { id: 't2', title: '2. Layout inicial', subtitle: 'En proceso', status: 'active', metaMessage: '→ En revisión con asesor' },
      { id: 't3', title: '3. Renders (2 opciones: claro vs grafito)', subtitle: 'Pendiente aprobación layout', status: 'blocked', metaMessage: '🔒 Bloqueado por fase 2' },
      { id: 't4', title: '4. Entrega final', subtitle: 'Pendiente', status: 'pending', metaMessage: 'Pendiente' },
    ],
    files: [
      { id: 'f1', name: 'brief-mexi-energi.pdf', type: 'PDF', size: '320 KB', date: '16 May', author: 'Mariano S.' },
      { id: 'f2', name: 'referencia-oscuro-01.jpg', type: 'IMG', size: '2.1 MB', date: '18 May', author: 'Mariano S.' },
    ],
    requests: [],
    comments: [],
    images: []
  },
  {
    id: 'p3',
    code: 'CDMX-001',
    name: 'Remodelación Oficinas Huehuetoca',
    client: 'Turbo Control',
    magnitude: 'Ch',
    status: 'En Proceso',
    assignedTo: 'kt',
    advisorId: 'kt',
    budget: '$95,000 MXN',
    style: 'Básico',
    rendersReq: 'No',
    virtualTour: 'No',
    lines: 'Basic',
    sqm: '45 m²',
    hasUrgentRequest: false,
    requestCount: 0,
    tags: ['En Proceso'],
    deliveryDeadline: 'Hoy',
    startDate: '19 May',
    completenessScore: 100,
    pendingInfoItems: [],
    pointsValue: 1,
    requiresVirtualTour: false,
    requiresRenders: false,
    isInInbox: false,
    deliveryHistory: [],
    timeline: [
      { id: 't1', title: '1. Brief', subtitle: 'Completo · Planos recibidos (2 archivos)', status: 'done', date: '19 May', metaMessage: '✓ Completado' },
      { id: 't2', title: '2. Planos técnicos', subtitle: 'En proceso · Entrega hoy', status: 'active', metaMessage: '⚠ Entrega hoy', isUrgent: true },
      { id: 't3', title: '3. Entrega final', subtitle: 'Pendiente', status: 'pending', metaMessage: 'Pendiente' },
    ],
    files: [
      { id: 'f1', name: 'brief-huehuetoca-v1.pdf', type: 'PDF', size: '320 KB', date: '19 May', author: 'Rodrigo V.' },
    ],
    requests: [],
    comments: [],
    images: []
  }
];

export const inboxProjects: InboxProject[] = [
  {
    id: 'inbox-1',
    code: 'QRO-041',
    name: 'Corporativo Torre Norte — Remodelación integral',
    client: 'Grupo Financiero Banorte',
    magnitude: 'G',
    status: 'Sin Asignar',
    assignedTo: '',
    advisorId: 'al', // Ariadna Ladrón
    budget: '$820,000 MXN',
    style: 'Corporativo moderno',
    rendersReq: 'Sí · 5 vistas',
    virtualTour: 'Sí',
    lines: 'Nova, Prime, Kenza',
    sqm: '650 m²',
    hasUrgentRequest: false,
    requestCount: 0,
    tags: [],
    timeline: [],
    files: [],
    requests: [],
    comments: [],
    images: [],
    deliveryDeadline: '7 días hábiles',
    startDate: '',
    completenessScore: 60,
    pendingInfoItems: ['planos de planta', 'referencias visuales del cliente'],
    pointsValue: 3,
    requiresVirtualTour: true,
    requiresRenders: true,
    renderCount: 5,
    isInInbox: true,
    deliveryHistory: [],
    inboxAssignedBy: 'Ariadna Ladrón',
    inboxAssignedAt: 'hace 2h',
  },
  {
    id: 'inbox-2',
    code: 'LAG-031',
    name: 'Oficina Privada — Coordinación Logística',
    client: 'DHL México',
    magnitude: 'Ch',
    status: 'Sin Asignar',
    assignedTo: '',
    advisorId: 'ms',
    budget: '$68,000 MXN',
    style: 'Minimalista',
    rendersReq: 'No',
    virtualTour: 'No',
    lines: 'Start, Basic',
    sqm: '55 m²',
    hasUrgentRequest: false,
    requestCount: 0,
    tags: [],
    timeline: [],
    files: [
      { id: 'ib2f1', name: 'plano-ref-dhl-01.pdf', type: 'PDF', size: '1.1 MB', date: 'hace 4h', author: 'Mariano S.' },
      { id: 'ib2f2', name: 'plano-ref-dhl-02.pdf', type: 'PDF', size: '980 KB', date: 'hace 4h', author: 'Mariano S.' },
    ],
    requests: [],
    comments: [],
    images: [],
    deliveryDeadline: '1-2 días hábiles',
    startDate: '',
    completenessScore: 100,
    pendingInfoItems: [],
    pointsValue: 1,
    requiresVirtualTour: false,
    requiresRenders: false,
    isInInbox: true,
    deliveryHistory: [],
    inboxAssignedBy: 'Mariano Sanchez',
    inboxAssignedAt: 'hace 4h',
  }
];

export const allRequests: Request[] = mockProjects.flatMap(p => p.requests);

// Helper: calcular puntos totales de carga
export function calcularCarga(proyectos: Project[]): LoadCapacity {
  const PUNTOS = { G: 3, M: 2, Ch: 1 };
  const assigned = proyectos.filter(p => p.assignedTo === currentUser.id && !p.isInInbox);
  const currentPoints = assigned.reduce((acc, p) => acc + (PUNTOS[p.magnitude] || 0), 0);
  return {
    projectistId: currentUser.id,
    currentPoints,
    maxPoints: 6,
    breakdown: assigned.map(p => ({ projectId: p.id, projectCode: p.code, points: PUNTOS[p.magnitude], magnitude: p.magnitude }))
  };
}

// Helper: días restantes hábiles hasta deadline (simulado)
export function diasRestantes(deadline: string): { dias: number; esUrgente: boolean } {
  const map: Record<string, number> = { 'Hoy': 0, 'Mañana': 1, 'Mar 27 Mayo': 4, 'Vie 30 Mayo': 7 };
  const dias = map[deadline] ?? 5;
  return { dias, esUrgente: dias <= 1 };
}
