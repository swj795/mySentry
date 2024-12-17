export interface IBehaviorInfo {
	category: string;
	time: number;
	status: BEHAVIOR_STATUS;
	content?: HTMLElement; // 点击的元素
	behaviorClickErrorInfo?: Partial<IBehaviorClickErrorInfo>; // 代码错误信息
	behaviorHistoryInfo?: IBehaviorHistoryInfo; // history路由跳转行为信息
}

export enum BEHAVIOR_STATUS {
	SUCCESS = 'success',
	FAIL = 'fail',
}

export interface IBehaviorClickErrorInfo {
	message: string;
	fileName: string;
	line: number;
	column: number;
}

export interface IBehaviorHistoryInfo {
	form: string;
	to: string;
}
