export enum TransformType {
	NONE = 'none',
	ADD = 'add',
	MULTIPLY = 'multiply',
}

export enum CurveType {
	LINEAR = 'linear',
	SQUARED = 'squared',
}

export class ControllerInfo {
	id: number;
	name: string;
	defaultValue: number;
	min: number;
	max: number;
	transform: TransformType;
	curve: CurveType;

	constructor(
		id: number,
		name: string,
		defaultValue: number,
		min: number,
		max: number,
		transform: TransformType,
		curve: CurveType,
	) {
		this.id = id;
		this.name = name;
		this.defaultValue = defaultValue;
		this.min = min;
		this.max = max;
		this.transform = transform;
		this.curve = curve;
	}
}

export enum ControllerId {
	Freq = 0,
	Speed,
	Sharp,
	X,
	Y,
	R,
	G,
	B,
	NumControllers,
}

export const controllerInfo: ControllerInfo[] = [
	new ControllerInfo(
		ControllerId.Freq,
		'Freq',
		1,
		0,
		10,
		TransformType.MULTIPLY,
		CurveType.LINEAR,
	),
	new ControllerInfo(
		ControllerId.Speed,
		'Speed',
		1,
		0,
		30,
		TransformType.MULTIPLY,
		CurveType.LINEAR,
	),
	new ControllerInfo(
		ControllerId.Sharp,
		'Sharp',
		1,
		1,
		4,
		TransformType.ADD,
		CurveType.LINEAR,
	),
	new ControllerInfo(
		ControllerId.X,
		'X',
		0,
		-100,
		100,
		TransformType.ADD,
		CurveType.LINEAR,
	),
	new ControllerInfo(
		ControllerId.Y,
		'Y',
		0,
		-100,
		100,
		TransformType.ADD,
		CurveType.LINEAR,
	),
	new ControllerInfo(
		ControllerId.R,
		'R',
		0,
		0,
		1,
		TransformType.ADD,
		CurveType.LINEAR,
	),
	new ControllerInfo(
		ControllerId.G,
		'G',
		0,
		0,
		1,
		TransformType.ADD,
		CurveType.LINEAR,
	),
	new ControllerInfo(
		ControllerId.B,
		'B',
		0,
		0,
		1,
		TransformType.ADD,
		CurveType.LINEAR,
	),
];

if (controllerInfo.length !== ControllerId.NumControllers) {
	throw new Error('Controller info length does not match NUM_CONTROLLERS');
}
