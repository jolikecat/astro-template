import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';
import { optimize } from 'svgo';

const toolDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(toolDirectory, '../..');
const inputDirectory = path.join(toolDirectory, 'input');
const outputDirectory = path.join(projectDirectory, 'public');
const configPath = path.join(toolDirectory, 'config.json');
const supportedFormats = new Set(['avif', 'gif', 'jpeg', 'png', 'svg', 'webp']);
const supportedOutputs = new Set(['source', 'webp']);

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

const loadConfig = async () => {
	let config;

	try {
		config = JSON.parse(await readFile(configPath, 'utf8'));
	} catch (error) {
		throw new Error(`config.jsonを読み込めません: ${error.message}`, { cause: error });
	}

	if (!isObject(config)) throw new Error('config.jsonのルートはオブジェクトにしてください。');
	if (!Number.isInteger(config.quality) || config.quality < 1 || config.quality > 100) throw new Error('config.jsonのqualityは1から100までの整数にしてください。');
	if (!isObject(config.formats) || Object.keys(config.formats).length === 0) throw new Error('config.jsonのformatsには1件以上の変換設定が必要です。');
	if (!isObject(config.svgo) || typeof config.svgo.multipass !== 'boolean' || !Number.isFinite(config.svgo.floatPrecision) || !Array.isArray(config.svgo.plugins)) {
		throw new Error('config.jsonのsvgo設定が不正です。');
	}

	const formatByExtension = new Map();

	for (const [format, rule] of Object.entries(config.formats)) {
		if (!supportedFormats.has(format)) throw new Error(`config.jsonのformatsに未対応の形式 ${format} があります。`);
		if (!isObject(rule) || !Array.isArray(rule.extensions) || rule.extensions.length === 0 || !Array.isArray(rule.outputs) || rule.outputs.length === 0) {
			throw new Error(`config.jsonのformats.${format}にはextensionsとoutputsの配列が必要です。`);
		}

		const outputs = new Set();

		for (const output of rule.outputs) {
			if (!supportedOutputs.has(output)) throw new Error(`config.jsonのformats.${format}.outputsに未対応の出力 ${output} があります。`);
			if (outputs.has(output)) throw new Error(`config.jsonのformats.${format}.outputsで ${output} が重複しています。`);
			if (format === 'svg' && output !== 'source') throw new Error('SVGの出力にはsourceだけを指定できます。');

			outputs.add(output);
		}

		for (const extension of rule.extensions) {
			if (typeof extension !== 'string' || !/^\.[a-z0-9]+$/i.test(extension)) throw new Error(`config.jsonのformats.${format}.extensionsに不正な拡張子があります。`);

			const normalizedExtension = extension.toLowerCase();

			if (formatByExtension.has(normalizedExtension)) throw new Error(`config.jsonで拡張子 ${normalizedExtension} が重複しています。`);

			formatByExtension.set(normalizedExtension, { format, outputs: [...outputs] });
		}
	}

	return { config, formatByExtension };
};

const collectFiles = async (directory, relativeDirectory = '') => {
	const entries = await readdir(directory, { withFileTypes: true });
	const files = [];

	for (const entry of entries) {
		const relativePath = path.join(relativeDirectory, entry.name);
		const absolutePath = path.join(directory, entry.name);

		if (entry.isDirectory()) {
			files.push(...(await collectFiles(absolutePath, relativePath)));
		} else if (entry.isFile()) {
			files.push({ absolutePath, relativePath });
		}
	}

	return files;
};

const optimizeRaster = async (inputPath, inputExtension, outputFormat, quality) => {
	const isAnimated = inputExtension === '.gif' || inputExtension === '.webp';
	let image = sharp(inputPath, { animated: isAnimated }).rotate();

	switch (outputFormat) {
		case 'jpeg':
			image = image.jpeg({ quality, mozjpeg: true });
			break;
		case 'png':
			image = image.png({ quality, compressionLevel: 9 });
			break;
		case 'webp':
			image = image.webp({ quality, effort: 6 });
			break;
		case 'avif':
			image = image.avif({ quality, effort: 9 });
			break;
		case 'gif':
			image = image.gif({ effort: 10 });
			break;
		default:
			throw new Error(`未対応のラスター出力形式です: ${outputFormat}`);
	}

	return image.toBuffer();
};

const getOutputRelativePaths = (relativePath, rule) => {
	const extension = path.extname(relativePath);

	return rule.outputs.map((output) => (output === 'source' ? relativePath : `${relativePath.slice(0, -extension.length)}.${output}`));
};

const assertNoOutputCollisions = (images, formatByExtension) => {
	const outputOwners = new Map();

	for (const { relativePath } of images) {
		const extension = path.extname(relativePath).toLowerCase();
		const rule = formatByExtension.get(extension);

		for (const outputRelativePath of getOutputRelativePaths(relativePath, rule)) {
			const collisionKey = outputRelativePath.toLowerCase();
			const existingOwner = outputOwners.get(collisionKey);

			if (existingOwner) {
				throw new Error(`出力先 ${outputRelativePath} が ${existingOwner} と ${relativePath} で重複します。入力ファイル名を変更してください。`);
			}

			outputOwners.set(collisionKey, relativePath);
		}
	}
};

const optimizeSvg = async (inputPath, svgoConfig) => {
	const source = await readFile(inputPath, 'utf8');
	const result = optimize(source, { ...svgoConfig, path: inputPath });

	return Buffer.from(result.data);
};

const formatBytes = (bytes) => {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KiB`;

	return `${(bytes / 1024 ** 2).toFixed(1)} MiB`;
};

const formatSizeChange = (inputBytes, outputBytes) => {
	if (inputBytes === 0) return '0.0% 削減';

	const changePercent = ((inputBytes - outputBytes) / inputBytes) * 100;

	return changePercent >= 0 ? `${changePercent.toFixed(1)}% 削減` : `${Math.abs(changePercent).toFixed(1)}% 増加`;
};

const writeOutput = async (relativePath, output) => {
	const outputPath = path.join(outputDirectory, relativePath);

	await mkdir(path.dirname(outputPath), { recursive: true });
	await writeFile(outputPath, output);
};

const processImage = async ({ absolutePath, relativePath }, config, formatByExtension) => {
	const extension = path.extname(relativePath).toLowerCase();
	const rule = formatByExtension.get(extension);
	const source = await readFile(absolutePath);
	const outputRelativePaths = getOutputRelativePaths(relativePath, rule);
	const outputs = [];

	if (rule.format === 'svg') {
		const optimized = await optimizeSvg(absolutePath, config.svgo);
		outputs.push({ relativePath, content: optimized.length < source.length ? optimized : source });
	} else {
		for (const [index, output] of rule.outputs.entries()) {
			const outputFormat = output === 'source' ? rule.format : output;
			const optimized = await optimizeRaster(absolutePath, extension, outputFormat, config.quality);
			const content = output === 'source' && optimized.length >= source.length ? source : optimized;

			outputs.push({ relativePath: outputRelativePaths[index], content });
		}
	}

	for (const output of outputs) {
		await writeOutput(output.relativePath, output.content);
	}

	return {
		relativePath,
		inputBytes: source.length,
		outputs: outputs.map((output) => ({ relativePath: output.relativePath, outputBytes: output.content.length })),
	};
};

const main = async () => {
	const { config, formatByExtension } = await loadConfig();

	await mkdir(inputDirectory, { recursive: true });
	const files = await collectFiles(inputDirectory);
	const images = files.filter(({ relativePath }) => formatByExtension.has(path.extname(relativePath).toLowerCase()));

	if (images.length === 0) {
		console.log('処理対象の画像がありません。tools/image-compressor/input に画像を配置してください。');
		return;
	}

	assertNoOutputCollisions(images, formatByExtension);

	const results = [];

	for (const image of images) {
		const result = await processImage(image, config, formatByExtension);

		if (result) {
			results.push(result);
			console.log(`${result.relativePath}: ${formatBytes(result.inputBytes)}`);

			for (const output of result.outputs) {
				console.log(`  -> ${output.relativePath}: ${formatBytes(output.outputBytes)} (${formatSizeChange(result.inputBytes, output.outputBytes)})`);
			}
		}
	}

	const outputCount = results.reduce((count, result) => count + result.outputs.length, 0);

	console.log(`完了: ${results.length}件の入力から${outputCount}件を出力しました。`);
};

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
