import { IErrorInfo, ERRORTYPES } from '@mysentry/types';
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
	getCategory(type: ERRORTYPES): UserBehaviorError {
		switch (type) {
			case ERRORTYPES.FETCH:
			case ERRORTYPES.XHR:
				return UserBehaviorError.HTTP;
			case ERRORTYPES.CLICK:
				return UserBehaviorError.CLICK;
			case ERRORTYPES.HISTORY:
			case ERRORTYPES.HASHCHANGE:
				return UserBehaviorError.ROUTE;
			case ERRORTYPES.RESOURCE:
				return UserBehaviorError.RESOURCE;
			case ERRORTYPES.ERROR:
			case ERRORTYPES.UNHANDLEDREJECTION:
				return UserBehaviorError.CODEERROR;
			default:
				return UserBehaviorError.CUSTOM;
		}
	}
}

const userBehavior = new UserBehavior();
export { userBehavior };
