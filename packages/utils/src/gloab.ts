import { IMySentryOptions, ERRORTYPES, IAnyObject, IAnyFun } from '@mysentry/types';

const globalMySentryOptions: IMySentryOptions = {} as IMySentryOptions;

globalMySentryOptions.frameFlag = {}; // 项目框架
globalMySentryOptions.optionFlag = {}; // 配置项

const currentFrameFlag = globalMySentryOptions.frameFlag;

export function getFrameFlag(frameType: string) {
	return currentFrameFlag[frameType] ? true : false;
}

export function setFrameFlag(frameType: string, isSet: boolean) {
	if (currentFrameFlag[frameType]) return;
	currentFrameFlag[frameType] = isSet;
}

// 获取当前的时间戳
export function getTimestamp(): number {
	return Date.now();
}

// 判断类型
export function typeofAny(value: any) {
	return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}

// 验证所需的参数是否符合类型
export function validateOptions(option: any, optionName: string, expectedType: string) {
	if (!option) return false;
	console.log(option, expectedType, '111');

	if (typeofAny(option) === expectedType) {
		return true;
	} else {
		console.log(`The ${optionName} is not of type ${expectedType}, please check the configuration`);
		return false;
	}
}

const currentOptionFlag = globalMySentryOptions.optionFlag;
// 配置项设置绑定信息
export const setFlag = (optionName: string, flag: boolean) => {
	if (currentOptionFlag[optionName]) return;
	currentOptionFlag[optionName] = flag;
};

// 设置配置项是否绑定的标记
export const setOptionFlag = ({
	silentXhr = true,
	silentFetch = true,
	silentClick = true,
	silentHistory = true,
	silentError = true,
	silentHashchange = true,
	silentUnhandledrejection = true,
	// silentWhiteScreen = false,
}) => {
	setFlag(ERRORTYPES.XHR, !silentXhr);
	setFlag(ERRORTYPES.FETCH, !silentFetch);
	setFlag(ERRORTYPES.CLICK, !silentClick);
	setFlag(ERRORTYPES.HISTORY, !silentHistory);
	setFlag(ERRORTYPES.ERROR, !silentError);
	setFlag(ERRORTYPES.HASHCHANGE, !silentHashchange);
	setFlag(ERRORTYPES.UNHANDLEDREJECTION, !silentUnhandledrejection);
	// setFlag(ERRORTYPES.WHITE_SCREEN, !silentWhiteScreen);
};

// 使用AOP重写对象上的属性
/**
 *
 * @param source 原始对象
 * @param name 属性
 * @param replacement 以原有的方法作为参数，执行并且重写该方法
 * @isForced 是否强制重写
 */
export function replaceAop(
	source: IAnyObject,
	name: string,
	replacement: IAnyFun,
	isForced = false,
) {
	if (source === undefined) return;
	if (name in source || isForced) {
		const original = source[name];
		const wrapped = replacement(original);
		if (typeof wrapped === 'function') {
			source[name] = wrapped;
		}
	}
}

/**
 * 添加事件监听器
 * @param target 对象
 * @param eventName 事件名称
 * @param handler 回调函数
 * @param opitons
 */
export function on(
  target: Window | Document,
  eventName: string,
  handler: IAnyFun,
  opitons = false
): void {
  target.addEventListener(eventName, handler, opitons)
}

// 解析get请求中的参数
export function parseParamsInGet(url: string) {
	const params: IAnyObject = {};
	if (url.indexOf('?') === -1) return params;
	const search = url.split('?')[1];
	const searchArr = search.split('&');
	searchArr.forEach((item) => {
		const [key, value] = item.split('=');
		params[key] = value;
	});
	return params;
}