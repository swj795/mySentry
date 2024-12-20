import { addReplaceHandle } from './replace';
import { EVENT_TYPES } from '@mysentry/types';
import { HandleEvents } from './handleEvents';

export function setupReplace() {
	// 捕获fetch请求错误
	addReplaceHandle({
		type: EVENT_TYPES.FETCH,
		callback: (data: any) => {
			HandleEvents.handleXhrError(data);
		},
	});
	// 重写XHR
	addReplaceHandle({
		type: EVENT_TYPES.XHR,
		callback: (data: any) => {
			HandleEvents.handleXhrError(data);
		},
	});
	// 捕获error事件
	addReplaceHandle({
		type: EVENT_TYPES.ERROR,
		callback: data => {
			console.log(data, '<==data');

			HandleEvents.handleError(data);
		},
	});
	// 捕获promise错误
	addReplaceHandle({
		type: EVENT_TYPES.UNHANDLEDREJECTION,
		callback: data => {
			HandleEvents.handlePromiseError(data);
		},
	});
	// 捕获history路由变化信息
	addReplaceHandle({
		type: EVENT_TYPES.HISTRORYCHANGE,
		callback: data => {
			HandleEvents.handleHistory(data);
		},
	});

	// 捕获hash路由变化信息
	addReplaceHandle({
		type: EVENT_TYPES.HASHCHANGE,
		callback: data => {
			console.log(data, '<==hashchange');

			HandleEvents.handleHash(data);
		},
	});

	// 捕获全局click事件
	addReplaceHandle({
		type: EVENT_TYPES.CLICK,
		callback: data => {
			console.log(data, '<==click');

			HandleEvents.handleClick(data);
		},
	});
}
