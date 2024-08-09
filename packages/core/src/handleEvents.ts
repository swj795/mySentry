import ErrorStackParser from 'error-stack-parser';
import { IErrorTarget, ERRORTYPES, IXhrData } from '@mysentry/types';
import { STATUS_CODE } from '@mysentry/common';
import { getTimestamp } from '@mysentry/utils';
import { userBehavior } from './userBehavior';
import { reportData } from './reportData';

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
		if (!target || (ev.target && !ev.target.localName)) {
			// vue捕获的报错使用ev解析，异步错误使用ev.error解析
			const stackFrame = ErrorStackParser.parse(!target ? ev : ev.error)[0];
			console.log(stackFrame, '<++++stackFrame');
			
			const { fileName, columnNumber, lineNumber } = stackFrame;
			const errorData = {
				type: ERRORTYPES.ERROR,
				status: STATUS_CODE.ERROR,
				time: getTimestamp(),
				message: ev.message,
				fileName,
				line: lineNumber,
				column: columnNumber,
			};
			console.log(errorData, '<==errorData');
			// 此时错误为代码错误
			userBehavior.push({
				type: ERRORTYPES.ERROR,
				category: userBehavior.getCategory(ERRORTYPES.ERROR),
				data: errorData,
				time: getTimestamp(),
				status: STATUS_CODE.ERROR,
			});
			// 上报错误
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
		// const data1 = handlePromiseData(data);
		// console.log(data1, '<==data1');
	},
	// 监听xhr
	handleXhrError(data: any) {
		console.log(data, '<====data');
		const errorInfo = handleXhrData(data);
		console.log(errorInfo, '<===data1');
		const errorData = {
			type: ERRORTYPES.XHR,
			status: STATUS_CODE.ERROR,
			time: getTimestamp(),
			interface: errorInfo.url,
			method: errorInfo.method,
		};
		// 上报错误
		if (errorInfo.status !== 'ok') {
		reportData.send(errorData);
		}

	},
};

export { HandleEvents };
