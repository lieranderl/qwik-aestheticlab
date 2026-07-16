export interface Staff {
	id: number;
	name: string;
	photo_url: string;
	about: string;
	role: string;
}

export interface Contact {
	email: string;
	open_hours: {
		start_week_day: string;
		end_week_day: string;
		from: string;
		to: string;
	};
	location: {
		name: string;
		address: string;
		link: string;
	};
	parking: {
		name: string;
		link: string;
	}[];
}

export interface ServiceGroup {
	id: string;
	name: string;
	name_en: string;
	priority: number;
}

export interface Service {
	id: string;
	group_id: ServiceGroup["id"];
	name: string;
	description: string;
	duration: number;
	price: number;
}
