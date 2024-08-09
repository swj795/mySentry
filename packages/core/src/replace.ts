import { ERRORTYPES, IVoidFun, IReplaceHandler } from '@mysentry/types';
// import { replaceAop } from '@mysentry/utils';
import { replaceAop, on, getTimestamp, parseParamsInGet } from '../../utils/src/index';
// import { WHITE_URL_LIST } from '@mysentry/common';
import { WHITE_URL_LIST } from '../../common/src/index';
import { publishEvent, subscribeEvent } from './subscribe';

// 重写各种监听错误事件
export function replace(type: ERRORTYPES) {
	switch (type) {
		// case ERRORTYPES.CLICK:
		//     return replaceCLick()
		case ERRORTYPES.FETCH:
			return replaceFetch();
		// case ERRORTYPES.HASHCHANGE:
		//     return replaceHashchange()
		case ERRORTYPES.ERROR:
			return replaceError();
		case ERRORTYPES.UNHANDLEDREJECTION:
			return replaceUnhadledRejection();
		case ERRORTYPES.XHR:
			return replaceXhr();
		// case ERRORTYPES.HISTORY:
		//     return replaceHistory()
		// case ERRORTYPES.RESOURCE:
		//     return replaceResource()
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
				// status: 200,
			};
			return originalFetch.apply(window, [url, options]).then((res: Response) => {
				const tempRes = res.clone();
				// 克隆一个响应对象，防止后续操作对响应对象产生影响
				fetchData = Object.assign({}, fetchData, {
					status: tempRes.status,
				});
				// text方法返回一个Promise对象，该对象在解析为请求的文本内容时解决
				tempRes.text().then(data => {
					console.log(data, '<=====data');
					if (isFilterUrl(url)) return;
					publishEvent(ERRORTYPES.FETCH, fetchData);
				});
				return res;
			})
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
				type: ERRORTYPES.XHR,
				createTime: getTimestamp(),
			};
			// 执行原生的open方法
			originalOpen.apply(this, args);
		};
	});
	replaceAop(originXhr, 'send', (originalSend: IVoidFun) => {
		return function (this: any, ...args: any[]) {
			console.log(args, '<====args');

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
				} else {
					this.xhrParams.params = parseParamsInGet(url);
					this.xhrParams.url = url.split('?')[0];
				}
				this.xhrParams.status = status;
				this.xhrParams.endTime = getTimestamp();
				// 接口请求时长
				this.xhrParams.elapsedTime = this.xhrParams.endTime - this.xhrParams.createTime;
				// 执行xhr的回掉函数
				publishEvent(ERRORTYPES.XHR, this.xhrParams);
			});
			// 执行原生的send方法
			originalSend.apply(this, args);
		};
	});
}

// 监听error事件
export function replaceError() {
	// 资源加载报错未监听到
	on(window, 'error', function (e: ErrorEvent) {		
		publishEvent(ERRORTYPES.ERROR, e);
	}, true);
}

// 监听unhandledrejection事件
export function replaceUnhadledRejection() {
	on(window, 'unhandledrejection', function (e: PromiseRejectionEvent) {
		publishEvent(ERRORTYPES.UNHANDLEDREJECTION, e);
	});
}

export function addReplaceHandle(handler: IReplaceHandler) {
	if (!subscribeEvent(handler)) return;
	replace(handler.type);
}
