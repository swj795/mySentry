import { IBehaviorInfo, EVENT_TYPES, IVueInitOptions } from '@mysentry/types';
import { getTimestamp, validSomething } from '@mysentry/utils';
import { UserBehaviorError } from '@mysentry/common';
import { LENGTH_SCHEMA, BEFORE_PUSH_SCHEMA } from './scheam';
// 行为栈
const stack: IBehaviorInfo[] = [];
export const userBehavior = () => {
	// 行为栈的默认长度
	let stackLength: number = 100;
	// 添加至栈前自定义操作
	let beforePush: any = null;

	// 	初始化行为配置项
	const initBehavior = (options: IVueInitOptions) => {
		const { maxStackLength, beforePushHook } = options;
		validSomething(LENGTH_SCHEMA as any, { maxStackLength }) &&
			(stackLength = maxStackLength || stackLength);
		validSomething(BEFORE_PUSH_SCHEMA as any, { beforePushHook }) &&
			(beforePush = beforePushHook || beforePush);
	};

	const immediatePush = (data: IBehaviorInfo) => {
		data.time || (data.time = getTimestamp());
		if (stack.length >= stackLength) {
			stack.shift();
		}
		stack.push(data);
		stack.sort((a, b) => a.time - b.time); // 对用户行为通过时间进行排序
	};

	// 将行为内容添加到行为栈中
	const pushBehavior = (behavior: IBehaviorInfo) => {
		if (validSomething(BEFORE_PUSH_SCHEMA as any, { beforePush })) {
			const result = beforePush(behavior);
			immediatePush(result);
			return;
		}
		immediatePush(behavior);
	};

	// 获取用户行为栈
	const getStack = () => {
		return stack;
	};

	// 获取用户行为的类型
	const getBehaviorCategory = (type: EVENT_TYPES) => {
		switch (type) {
			case EVENT_TYPES.FETCH:
			case EVENT_TYPES.XHR:
				return UserBehaviorError.HTTP;
			case EVENT_TYPES.CLICK:
				return UserBehaviorError.CLICK;
			case EVENT_TYPES.HISTRORYCHANGE:
			case EVENT_TYPES.HASHCHANGE:
				return UserBehaviorError.ROUTE;
			case EVENT_TYPES.RESOURCE:
				return UserBehaviorError.RESOURCE;
			case EVENT_TYPES.ERROR:
			case EVENT_TYPES.UNHANDLEDREJECTION:
				return UserBehaviorError.CODEERROR;
			default:
				return UserBehaviorError.CUSTOM;
		}
	};

	return {
		stack,
		initBehavior,
		pushBehavior,
		immediatePush,
		getStack,
		getBehaviorCategory,
	};
};
