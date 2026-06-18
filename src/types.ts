export interface Staff {
	id: number;
	name: string;
	photo_url: string;
	email: string;
	active: boolean;
	about: string;
	about_ru: string;
	about_nl: string;
	about_fr: string;
	about_uk: string;
	role: string;
}

export interface Contact {
	id: number;
	created_at: string;
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
	name_ru: string;
	name_nl: string;
	name_fr: string;
	name_uk: string;
	name_en: string;
	active: boolean;
	priority: number;
}

export interface Service {
	id: string;
	group_id: ServiceGroup["id"];
	category: ServiceGroup["name"];
	name: string;
	name_ru: string;
	name_nl: string;
	name_fr: string;
	name_uk: string;
	description: string;
	description_ru: string;
	description_nl: string;
	description_fr: string;
	description_uk: string;
	duration: number;
	price: number;
	priority: number;
	active: boolean;
}
