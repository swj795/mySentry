import { Queue } from './queue';
import { IVueInitOptions } from '@mysentry/types';
import { validateOptions } from '@mysentry/utils';

// 上报错误信息类
export class ReportData {
	queue: Queue = new Queue();
	reportUrl = '';
	constructor() {}
	// 发送错误请求
	beacon(url: string, data: any): boolean {
		console.log(data, 'data');

		return navigator.sendBeacon(url, JSON.stringify(data));
	}
	// 使用fetch请求上报信息
	reportErrorInfo(data: any, url: string) {
		console.log(data, 'data');
		console.log(url, 'url');
		fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
	}

	// 绑定错误信息的配置
	bingOptions(options: IVueInitOptions) {
		const { reportUrl } = options;
		validateOptions(reportUrl, 'reportUrl', 'string') && (this.reportUrl = reportUrl);
	}

	// 添加公共错误信息，如发生错误的网址，设备信息等
	beforeSend() {
		const commonInfo = {
			pageUrl: document.location.href,
		};
		console.log(commonInfo.pageUrl, 'commonInfo');
		
		return commonInfo;
	}

	// 上报错误信息
	send(data: any): void {
		const commonInfo = this.beforeSend();
		const sendData = { ...commonInfo, ...data };
		const sendResult = this.beacon(this.reportUrl, sendData);
		console.log(sendResult, 'sendResult');
		if (!sendResult) {
			// beacon发送失败，将错误信息使用fetch上报
			this.reportErrorInfo(data, this.reportUrl);
		}
	}
}

const reportData = new ReportData();
export { reportData };
