// The Elevate compiler was written for Node. In the browser it only needs a
// harmless `process` object, since nothing here writes files or exits.
const g = globalThis as any;
if (!g.process) {
	g.process = { on() {}, exit() {}, env: {}, platform: 'browser', cwd: () => '/' };
}
export {};
