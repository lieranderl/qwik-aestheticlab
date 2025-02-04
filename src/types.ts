export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string;
  created_at: string;
  active: boolean;
  priority: number;
}

export interface TimeSlot {
  start: string;
  end: string;
  status: 'available' | 'busy';
}

export interface WorkingHours {
  monday: string[];
  tuesday: string[];
  wednesday: string[];
  thursday: string[];
  friday: string[];
  saturday: string[];
  sunday: string[];
}

export interface Technician {
  id: string;
  name: string;
  photo_url: string;
  email: string;
  calendar_id: string;
  services: string[];
  working_hours: WorkingHours;
  created_at: string;
  active: boolean;
  about: string;
  role: string;
}

export interface TechnicianSlots {
  tech: Technician;
  slots: TimeSlot[];
}