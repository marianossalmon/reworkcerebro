import { Project, User, Request } from './types';

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
    timeline: [
      { id: 't1', title: '1. Levantamiento y brief', subtitle: 'Formulario completo · Archivos recibidos', status: 'done', date: '12 May', metaMessage: '✓ Completado' },
      { id: 't2', title: '2. Propuesta inicial', subtitle: 'Layout presentado · Aprobado por asesor', status: 'done', date: '15 May', metaMessage: '✓ Completado' },
      { id: 't3', title: '3. Modificaciones', subtitle: 'Cambio de mesa de juntas solicitado · Pendiente', status: 'active', metaMessage: '⚠ Solicitud abierta — requiere respuesta hoy', isUrgent: true },
      { id: 't4', title: '4. Renders finales', subtitle: '3 vistas acordadas · Pendiente inicio', status: 'blocked', metaMessage: '🔒 Bloqueado por fase 3' },
      { id: 't5', title: '5. Presentación al cliente', subtitle: 'Via presentador Gebesa', status: 'pending', metaMessage: '—' },
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
    timeline: [],
    files: [],
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
    timeline: [],
    files: [],
    requests: [],
    comments: [],
    images: []
  }
];

export const allRequests: Request[] = mockProjects.flatMap(p => p.requests);
