export const LENGTH_SCHEMA = {
	type: 'object',
	properties: {
		maxStackLength: { type: 'number' },
	},
	required: ['context'],
};

export const BEFORE_PUSH_SCHEMA = {
	type: 'object',
	properties: {
		beforePushHook: { isFunction: true },
	},
	required: ['beforePushHook'],
};
