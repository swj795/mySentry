import { IVueInstance, IVueInitOptions, IViewModel } from '@mysentry/types';
import { ProjectType } from '@mysentry/common';
import { getFrameFlag, setFrameFlag } from '@mysentry/utils';
import { HandleEvents } from './handleEvents';
import { handleBindOptions } from './options';
import { setupReplace } from './setupReplace';

// vue项目安装此插件 install 方法
function install(app: IVueInstance, options: IVueInitOptions) {
	if (getFrameFlag(ProjectType.VUE)) return;
	setFrameFlag(ProjectType.VUE, true);
	const handler = app.config.errorHandler;
	// vue项目在Vue.config.errorHandler中上报错误
	app.config.errorHandler = function (err: Error, vm: IViewModel, info: string): void {
		console.log(err);
		HandleEvents.handleError(err);
		if (handler) handler.apply(null, [err, vm, info]);
	};
	init(options);
}

function init(options: IVueInitOptions) {
	const { reportUrl = '', apikey = '' } = options;
	if (!reportUrl || !apikey) {
		return console.error(`web-see 缺少必须配置项：${!options.reportUrl ? 'dsn' : 'apikey'} `);
	}
	handleBindOptions(options);
	// HandleEvents.handlePromiseError()
	setupReplace()
}

export default { install, init };
