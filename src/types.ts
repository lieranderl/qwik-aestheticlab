export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
  created_at: string;
  active: boolean;
}

export interface TimeSlot {
  start: string;
  end: string;
  status: 'available' | 'busy';
}

export interface Technician {
  id: string;
  name: string;
  photo_url: string;
  email: string;
  calendar_id: string;
  services: string[];
  active: boolean;
  role: string;
}

export interface TechnicianSlots {
  technician: Technician;
  slots: TimeSlot[];
}