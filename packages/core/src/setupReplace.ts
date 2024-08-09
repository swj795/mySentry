import { addReplaceHandle } from './replace';
import { ERRORTYPES } from '@mysentry/types';
import { HandleEvents } from './handleEvents';

export function setupReplace() {
    // 捕获fetch请求错误
	addReplaceHandle({
        type: ERRORTYPES.FETCH,
        callback: (data: any) => {
            HandleEvents.handleXhrError(data);
        }
})
	// 重写XHR
	addReplaceHandle({
		type: ERRORTYPES.XHR,
		callback: (data: any) => {
			HandleEvents.handleXhrError(data);
		},
	});
	// 捕获error事件
	addReplaceHandle({
		type: ERRORTYPES.ERROR,
		callback: data => {
			HandleEvents.handleError(data);
		},
    });
    // 捕获promise错误
	addReplaceHandle({
		type: ERRORTYPES.UNHANDLEDREJECTION,
		callback: data => {
			HandleEvents.handlePromiseError(data);
		},
    });
    
}
