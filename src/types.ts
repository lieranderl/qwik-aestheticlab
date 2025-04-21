export interface ServiceFiltered {
	id: string;
	name: string;
	duration: number;
	price: number;
	description: string;
	created_at: string;
	priority: number;
	category_id: ServiceCategory["id"];
}

export interface Service extends ServiceFiltered {
	name_ru: string;
	name_nl: string;
	name_fr: string;
	active: boolean;
}

export interface ServiceCategoryFiltered {
	id: string;
	name: string;
}

export interface ServiceCategory extends ServiceCategoryFiltered {
	name_ru: string;
	name_nl: string;
	name_fr: string;
	active: boolean;
}

export interface TimeSlot {
	start: string;
	end: string;
	status: "available" | "busy";
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
	about_ru: string;
	about_nl: string;
	about_fr: string;
	role: string;
}

export interface TechnicianSlots {
	tech: Technician;
	slots: TimeSlot[];
}

export interface Booking {
	id: string;
	technician_id: Technician["id"];
	client_id: string;
	services: string[];
	services_names: string[];
	duration: number;
	price: number;
	datetime: string;
	calendar_id: string;
	event_id: string;
}
