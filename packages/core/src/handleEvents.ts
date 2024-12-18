import ErrorStackParser from 'error-stack-parser';
import { IErrorTarget, EVENT_TYPES, IXhrData, IVueHistoryRouterInfo } from '@mysentry/types';
import { STATUS_CODE } from '@mysentry/common';
import { getTimestamp, parseResourceError } from '@mysentry/utils';
import { userBehavior } from './userBehavior';
import { reportData } from './reportData';
import { BEHAVIOR_STATUS } from '@mysentry/types';

const { stack, pushBehavior, getBehaviorCategory } = userBehavior();

// xhr请求数据处理
export function handleXhrData(data: IXhrData) {
	const { method, status, url, params } = data;
	let xhrStatus: STATUS_CODE;
	console.log(status, '<++++status');

	if (status === 0) {
		// 请求出错
		xhrStatus = STATUS_CODE.ERROR;
	} else if (status < 400) {
		xhrStatus = STATUS_CODE.OK;
	} else {
		xhrStatus = STATUS_CODE.ERROR;
	}
	return {
		method,
		url,
		params,
		status: xhrStatus,
	};
}

const HandleEvents = {
	// 只能监听js代码运行错误
	handleError(ev: IErrorTarget) {
		const target = ev.target;
		if (!target || (target && !target.localName)) {
			// vue捕获的报错使用ev解析，异步错误使用ev.error解析
			const stackFrame = ErrorStackParser.parse(!target ? ev : ev.error)[0];
			const { fileName, columnNumber, lineNumber } = stackFrame;
			const errorData = {
				type: EVENT_TYPES.ERROR,
				status: STATUS_CODE.ERROR,
				time: getTimestamp(),
				message: ev.message,
				fileName,
				line: lineNumber,
				column: columnNumber,
			};
			console.log(errorData, '<==errorData');
			pushBehavior({
				category: getBehaviorCategory(EVENT_TYPES.ERROR),
				status: BEHAVIOR_STATUS.FAIL,
				time: getTimestamp(),
				behaviorClickErrorInfo: {
					message: ev.message,
					fileName,
					line: lineNumber,
					column: columnNumber,
				},
			});
			// 上报错误
			reportData.send(errorData);
		}

		// 此时错误为资源错误
		if (target && target.localName) {
			// console.log(parseResourceError, '<===target');
			console.log(target, '<===message');
			const errorData = {
				type: EVENT_TYPES.RESOURCE,
				status: STATUS_CODE.ERROR,
				time: getTimestamp(),
				message: parseResourceError(target),
			};
			console.log(errorData, '<==errorData');
			reportData.send(errorData);
		}
	},
	// 监听promise错误
	// prosime错误分为： 1、reject了但是没有catch处理 2、在promise内部发生了错误
	// PromiseRejectionEvent
	handlePromiseError(data: PromiseRejectionEvent) {
		console.log(data, '<==data');
		const stackFrame = ErrorStackParser.parse(data.reason)[0];
		console.log(stackFrame, '<==stackFrame');
		const { fileName, columnNumber, lineNumber } = stackFrame;
		const errorData = {
			type: EVENT_TYPES.ERROR,
			status: STATUS_CODE.ERROR,
			time: getTimestamp(),
			message: data.reason.message,
			fileName,
			line: lineNumber,
			column: columnNumber,
		};
		reportData.send(errorData);
		// const data1 = handlePromiseData(data);
		// console.log(data1, '<==data1');
	},
	// 监听xhr
	handleXhrError(data: any) {
		console.log(data, '<====data');
		const errorInfo = handleXhrData(data);
		console.log(errorInfo, '<===data1');
		const errorData = {
			type: EVENT_TYPES.XHR,
			status: errorInfo.status,
			time: getTimestamp(),
			interface: errorInfo.url,
			method: errorInfo.method,
			message: errorInfo.url + '请求接口报错',
		};
		// 上报错误
		if (errorInfo.status !== 'ok') {
			reportData.send(errorData);
		}
	},
	// history路由change
	handleHistory(info: IVueHistoryRouterInfo) {
		console.log(info, '<==histroy data');
		pushBehavior({
			category: getBehaviorCategory(EVENT_TYPES.HISTRORYCHANGE),
			time: getTimestamp(),
			status: BEHAVIOR_STATUS.SUCCESS,
			behaviorHistoryInfo: {
				form: info.current,
				to: info.forward,
			},
		});
		console.log(stack, 'history stack');
	},

	// hash路由change
	handleHash(info: IVueHistoryRouterInfo) {
		console.log(info, '<==hash data');
		pushBehavior({
			category: getBehaviorCategory(EVENT_TYPES.HISTRORYCHANGE),
			time: getTimestamp(),
			status: BEHAVIOR_STATUS.SUCCESS,
			behaviorHistoryInfo: {
				form: info.current,
				to: info.forward,
			},
		});
	},

	// 发布全局click事件
	handleClick(data: HTMLElement) {
		// console.log(data, '<==click data');
		// 拼接用户点击行为
		// 点击body时不用记录
		console.log(data === document.body, 'body');

		if (data !== document.body) {
			pushBehavior({
				category: getBehaviorCategory(EVENT_TYPES.CLICK),
				time: getTimestamp(),
				content: data,
				status: BEHAVIOR_STATUS.SUCCESS,
			});
		}
		console.log(stack, '<==stack');
	},
};

export { HandleEvents };
