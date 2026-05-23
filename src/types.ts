export type Role = 'Ventas' | 'Proyectista' | 'Direccion' | 'Master';

export type ProjectMagnitude = 'G' | 'M' | 'Ch';

export interface User {
  id: string;
  initials: string;
  name: string;
  role: Role;
  location: string;
  avatarColor: string;
}

export type TimelinePhaseStatus = 'done' | 'active' | 'blocked' | 'pending';

export interface TimelinePhase {
  id: string;
  title: string;
  subtitle: string;
  status: TimelinePhaseStatus;
  date?: string;
  metaMessage?: string;
  isUrgent?: boolean;
}

export type FileType = 'DWG' | 'SKP' | 'PDF' | 'IMG';

export interface ProjectFile {
  id: string;
  name: string;
  type: FileType;
  size: string;
  date: string;
  author: string;
}

export interface Request {
  id: string;
  type: 'MODIFICACION' | 'RENDER' | 'URGENTE';
  title: string;
  description: string;
  author: string;
  date: string;
  projectId: string;
  status: 'pending' | 'resolved';
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  date: string;
  text: string;
}

export interface Project {
  id: string;
  code: string;
  name: string;
  client: string;
  magnitude: ProjectMagnitude;
  status: 'Aprobado' | 'En Proceso' | 'Visto Bueno' | 'Ganado' | 'Perdido' | 'Sin Asignar';
  assignedTo: string; // user id
  advisorId: string;
  budget: string;
  style: string;
  rendersReq: string;
  virtualTour: string;
  lines: string;
  sqm: string;
  hasUrgentRequest: boolean;
  requestCount: number;
  tags?: string[];
  timeline: TimelinePhase[];
  files: ProjectFile[];
  requests: Request[];
  comments: Comment[];
  images: string[];
}
