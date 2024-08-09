import { STATUS_CODE, UserBehaviorError } from '@mysentry/common';

export enum ERRORTYPES {
	XHR = 'xhr', // 请求出错
	FETCH = 'fetch', // 请求出错
	CLICK = 'click', // 点击出错-代码错误
	ERROR = 'error', // 代码错误
	RESOURCE = 'resource', // 资源错误
	HISTORY = 'history', // 路由变化
	HASHCHANGE = 'hashchange', // hash路由改变
	UNHANDLEDREJECTION = 'unhandledrejection', // 异步错误 promise
}

// 错误信息
export interface IErrorInfo {
	type: ERRORTYPES; // 错误类型
	category: UserBehaviorError; // 用户行为类型
	status: STATUS_CODE; // 行为状态
	time: number; // 发生时间
	data: any; // 错误数据内容
}

export type TReplaceCallback = (data: any) => void;