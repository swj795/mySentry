import { EVENT_TYPES, IVoidFun, IReplaceHandler } from '@mysentry/types';
// import { replaceAop } from '@mysentry/utils';
import {
	replaceAop,
	on,
	getTimestamp,
	parseParamsInGet,
	isHistoryMode,
} from '../../utils/src/index';
// import { WHITE_URL_LIST } from '@mysentry/common';
import { WHITE_URL_LIST } from '../../common/src/index';
import { publishEvent, subscribeEvent } from './subscribe';

// 重写各种监听错误事件
export function replace(type: EVENT_TYPES) {
	console.log(type, '<===type');
	switch (type) {
		case EVENT_TYPES.FETCH:
			return replaceFetch();
		case EVENT_TYPES.ERROR:
			return replaceError();
		case EVENT_TYPES.UNHANDLEDREJECTION:
			return replaceUnhadledRejection();
		case EVENT_TYPES.XHR:
			return replaceXhr();
		case EVENT_TYPES.HISTRORYCHANGE:
			return replaceHistory();
		case EVENT_TYPES.HASHCHANGE:
			return replaceHashChange();
		case EVENT_TYPES.CLICK:
			return replaceClick();
		default:
			return () => {};
	}
}

export function isFilterUrl(url: string) {
	return WHITE_URL_LIST.includes(url);
}

// 重写fetch请求
export function replaceFetch() {
	replaceAop(window, 'fetch', originalFetch => {
		console.log(originalFetch, '<=====originalFetch');
		return function (url: string, options: Partial<Request> = {}) {
			console.log(url, options, '<=====url options');
			const { method, headers, body } = options;
			let fetchData = {
				url,
				method,
				body,
				headers,
			};
			return originalFetch
				.apply(window, [url, options])
				.then((res: Response) => {
					const tempRes = res.clone();
					console.log(tempRes, ',====tempRes');
					// 克隆一个响应对象，防止后续操作对响应对象产生影响
					fetchData = Object.assign({}, fetchData, {
						status: tempRes.status,
						url: tempRes.url,
					});
					console.log(fetchData, ',====fetchData');

					// text方法返回一个Promise对象，该对象在解析为请求的文本内容时解决
					tempRes.text().then(data => {
						console.log(data, '<=====data');
						if (isFilterUrl(url)) return;
						publishEvent(EVENT_TYPES.FETCH, fetchData);
					});
					return res;
				})
				.catch((err: Error) => {
					console.log(err.message, '<===catch err message');
					publishEvent(EVENT_TYPES.FETCH, fetchData);
					throw err;
				});
		};
	});
}

// 劫持xhr请求,重写xhr请求 获取到接口成功与否
export function replaceXhr() {
	const originXhr = window.XMLHttpRequest.prototype;
	replaceAop(originXhr, 'open', (originalOpen: IVoidFun) => {
		return function (this: any, ...args: any[]): void {
			console.log(args, '<====args');
			// 暂存请求的参数
			this.xhrParams = {
				method: args[0].toUpperCase(),
				url: args[1],
				type: EVENT_TYPES.XHR,
				createTime: getTimestamp(),
			};
			// 执行原生的open方法
			originalOpen.apply(this, args);
		};
	});
	replaceAop(originXhr, 'send', (originalSend: IVoidFun) => {
		return function (this: any, ...args: any[]) {
			const { url, method } = this.xhrParams;
			// loadend事件无论接口成功与否都会触发
			on(this, 'loadend', function (this: any) {
				console.log(this, '<====this');
				console.log(url, '<====url');
				// 判断请求地址是否需要过滤
				if (isFilterUrl(url)) return;
				const { status } = this;
				if (method === 'POST') {
					this.xhrParams.params = args[0];
					this.xhrParams.url = this.responseURL;
				} else {
					this.xhrParams.params = parseParamsInGet(url);
					this.xhrParams.url = url;
				}

				this.xhrParams.status = status;
				this.xhrParams.endTime = getTimestamp();
				// 接口请求时长
				this.xhrParams.elapsedTime = this.xhrParams.endTime - this.xhrParams.createTime;
				// 执行xhr的回掉函数
				console.log(this.xhrParams, '<====this.xhrParams');

				publishEvent(EVENT_TYPES.XHR, this.xhrParams);
			});
			// 执行原生的send方法
			originalSend.apply(this, args);
		};
	});
}

// 监听error事件
export function replaceError() {
	// 资源加载报错未监听到
	on(
		window,
		'error',
		function (e: ErrorEvent) {
			console.log('error event');

			publishEvent(EVENT_TYPES.ERROR, e);
		},
		true,
	);
}

// 监听unhandledrejection事件
export function replaceUnhadledRejection() {
	on(window, 'unhandledrejection', function (e: PromiseRejectionEvent) {
		console.log('unhandledrejection event');

		publishEvent(EVENT_TYPES.UNHANDLEDREJECTION, e);
	});
}

export function replaceHistoryFn(originHistory: any) {
	console.log(originHistory, 'originHistory');
	// this 是指路由对象
	// args 是pushState方法原本的参数
	// 这里只能this  执行原生的方法需要用history对象
	return function (this: History, ...args: any[]) {
		const { state } = this;
		const { forward, current } = state;

		publishEvent(EVENT_TYPES.HISTRORYCHANGE, { forward, current });
		console.log(history, 'history this');

		return originHistory.apply(this, args);
	};
}

export function replaceHashFn(originHash: any) {
	return function (this: History, ...args: any[]) {
		const { state } = this;
		const { forward, current } = state;

		publishEvent(EVENT_TYPES.HASHCHANGE, { forward, current });
		return originHash.apply(this, args);
	};
}

export function replaceHistory() {
	// 项目是否为history路由模式
	if (!isHistoryMode()) return;
	on(window, 'popstate', function (e: PopStateEvent) {
		console.log('popstate event');
		publishEvent(EVENT_TYPES.HISTRORYCHANGE, e);
	});
	replaceAop(window.history, 'pushState', replaceHistoryFn);
	replaceAop(window.history, 'replaceState', replaceHistoryFn);
}

export function replaceHashChange() {
	// hash路由一样样需要通过重写pushstate和replacestate方法监听
	if (isHistoryMode()) return;
	replaceAop(window.history, 'pushState', replaceHashFn);
	replaceAop(window.history, 'replaceState', replaceHashFn);
}

export function replaceClick() {
	on(document, 'click', function (e: MouseEvent) {
		publishEvent(EVENT_TYPES.CLICK, e.target);
	});
}

export function addReplaceHandle(handler: IReplaceHandler) {
	if (!subscribeEvent(handler)) return;
	replace(handler.type);
}
