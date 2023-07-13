export type User = {
	address: Address;
	age: number;
	birthDate: string;
	bloodGroup: string;
	domain: string;
	ein: string;
	email: string;
	eyeColor: string;
	firstName: string;
	gender: string;
	height: number;
	id: number;
	image: string;
	ip: string;
	lastName: string;
	macAddress: string;
	maidenName: string;
	password: string;
	phone: string;
	ssn: string;
	university: string;
	userAgent: string;
	username: string;
	weight: number;
	bank: {
		cardExpire: string;
		cardNumber: string;
		cardType: string;
		currency: string;
		iban: string;
	};
	company: {
		address: Address;
		department: string;
		name: string;
		title: string;
	};
	hair: {
		color: string;
		type: string;
	};
};

type Address = {
	address: string;
	city: string;
	coordinates: {
		lat: number;
		lng: number;
	};
	postalCode: string;
	state: string;
};
