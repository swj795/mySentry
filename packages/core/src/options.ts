import { IVueInitOptions } from '@mysentry/types';
import { validateOptions, setOptionFlag } from '@mysentry/utils';
// import { userBehavior } from './userBehavior';
import { reportData } from './reportData';

// 插件配置项类
export class Options {
	reportUrl = ''; // 错误上报地址
	constructor() {}
	// 插件绑定可选项
	bingOptions(options: IVueInitOptions) {
		const { reportUrl } = options;
		// 验证所传类型是否符合要求且绑定
		validateOptions(reportUrl,'reportUrl', 'string') && (this.reportUrl = reportUrl);
	}
}

const options = new Options();

// 绑定插件、用户行为、上报错误的配置项
export function handleBindOptions(vueOptions: IVueInitOptions) {
	// 添加设置标记，以防重复绑定
	setOptionFlag(vueOptions);
	// 用户行为绑定配置项
	// userBehavior.
	// 配置上报信息
	reportData.bingOptions(vueOptions);
	options.bingOptions(vueOptions);
}

export { options };
