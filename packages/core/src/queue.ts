// 消息队列类
export class Queue {
	private stack: any[] = [];
	// private isFlushing = false;
	constructor() {}
	clear() {
		this.stack = [];
	}
	getStack() {
		return this.stack;
	}
}
