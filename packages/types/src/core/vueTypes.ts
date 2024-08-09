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
