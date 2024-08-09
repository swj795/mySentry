import { ERRORTYPES } from './error';

export interface IMySentryOptions {
	hasError?: false; // 某段时间代码是否报错
	events?: string[]; // 存储录屏的信息
	recordScreenId?: string; // 本次录屏的id
	_loopTimer?: number; // 白屏循环检测的timer
	transportData: any; // 数据上报
	options: any; // 配置信息
	frameFlag: {
		// 框架类型
		[key: string]: any;
	};
	deviceInfo?: {
		// 设备信息
		[key: string]: any;
	};
	optionFlag?: {
		[key: string]: boolean;
	};
}

export interface IAnyObject {
	[key: string]: any;
}

export interface IErrorTarget {
	target?: {
		localName?: string;
	};
	error?: any;
	message?: string;
}

export interface IAnyFun {
	(...args: any[]): any;
}

export interface IVoidFun {
	(...args: any[]): void;
}

export interface ICallback {
	(...args: any[]): any;
}

export interface IReplaceHandler {
	type: ERRORTYPES;
	callback: ICallback;
}

export interface IXhrData {
	createTime: number;
	elapsedTime: number;
	endTime: number;
	method: string;
	status: number;
	type: string;
	url: string;
	params: IAnyObject
}