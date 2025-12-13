const esbuild = require('esbuild');

esbuild.build({
	entryPoints: ['src/ui/main.tsx'],
	bundle: true,
	outfile: 'build/bundle.js',
	platform: 'browser',
	loader: { '.png': 'file', '.svg': 'file' },
	target: ['chrome110'],
}).catch(() => process.exit(1));

esbuild.build({
	entryPoints: [
		'src/main/main.ts',
		'src/main/preload.ts'
	],
	bundle: true,
	outdir: 'build',
	platform: 'node',
	external: ['electron'],
	target: ['node18'],
}).catch(() => process.exit(1));