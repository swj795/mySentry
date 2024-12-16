import { IErrorInfo, EVENT_TYPES } from '@mysentry/types';
import { getTimestamp } from '@mysentry/utils';
import { UserBehaviorError } from '@mysentry/common';

export class UserBehavior {
	maxBehaviorCount = 20; // 用户行为存储最大长度
	stack: IErrorInfo[]; // 用户行为栈
	constructor() {
		this.stack = [];
	}
	push(data: IErrorInfo): void {
		this.immediatePush(data);
	}
	immediatePush(data: IErrorInfo): void {
		data.time || (data.time = getTimestamp());
		if (this.stack.length >= this.maxBehaviorCount) {
			this.shift();
		}
		this.stack.push(data);
		this.stack.sort((a, b) => a.time - b.time); // 对用户行为通过时间进行排序
	}
	shift() {
		return this.stack.shift() !== undefined;
	}
	clear() {
		this.stack = [];
	}
	getStack() {
		return this.stack;
	}
	getCategory(type: EVENT_TYPES): UserBehaviorError {
		switch (type) {
			case EVENT_TYPES.FETCH:
			case EVENT_TYPES.XHR:
				return UserBehaviorError.HTTP;
			case EVENT_TYPES.CLICK:
				return UserBehaviorError.CLICK;
			case EVENT_TYPES.HISTORY:
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
	}
}

const userBehavior = new UserBehavior();
export { userBehavior };
