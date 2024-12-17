import { IAnyObject } from './base';

// vue实例
export interface IVueInstance {
	[key: string]: any;
}

// vue插件的可选配置
export interface IVueInitOptions {
	reportUrl: string; // 上报地址
	apikey: string; // 项目id
	silentXhr?: boolean;
	silentFetch?: boolean;
	silentClick?: boolean;
	silentHistory?: boolean;
	silentError?: boolean;
	silentHashchange?: boolean;
	silentUnhandledrejection?: boolean;
	maxStackLength?: number; // 行为栈长度
	beforePushHook?: (payload: any) => any; // 入栈前自定义操作
}

export interface IViewModel {
	[key: string]: any;
	$root?: Record<string, unknown>;
	$options?: {
		[key: string]: any;
		name?: string;
		propsData?: IAnyObject;
		_componentTag?: string;
		__file?: string;
		props?: IAnyObject;
	};
	$props?: Record<string, unknown>;
}
