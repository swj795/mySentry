// 事件订阅与发布
// 用来监听事件，当事件触发时，执行回调函数
// 事件：xhr请求
import { ERRORTYPES, TReplaceCallback, IReplaceHandler } from '@mysentry/types';
import { getFrameFlag, setFrameFlag } from '@mysentry/utils';

const handlers: { [k in ERRORTYPES]?: TReplaceCallback[] } = {};

// 订阅事件 将监听事件后需要执行的回调函数存入handlers中
export function subscribeEvent(handler: IReplaceHandler) {
	if (!handler || getFrameFlag(handler.type)) return false;
	setFrameFlag(handler.type, true);
	handlers[handler.type] = handlers[handler.type] || [];
	handlers[handler.type]?.push(handler.callback);
	console.log(handlers, 'handlers');
	
	return true;
}

// 发布事件 当事件触发时，执行回调函数
export function publishEvent(type: ERRORTYPES, data?: any) {
	if (!handlers[type]) return;
	handlers[type]?.forEach(callback => {
		callback(data);
	});
}
