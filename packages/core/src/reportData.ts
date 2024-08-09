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
	// 绑定错误信息的配置
	bingOptions(options: IVueInitOptions) {
		const { reportUrl } = options;
		validateOptions(reportUrl, 'reportUrl', 'string') && (this.reportUrl = reportUrl);
	}

	// 上报错误信息
	send(data: any): void {
		this.beacon(this.reportUrl, data);
	}
}

const reportData = new ReportData();
export { reportData };
