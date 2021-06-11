/**
 * Imports
 */

import * as FileUtils from '../utils/FileUtils';

/**
 * Exports
 */

export type InnerDictionary = { [key: string]: any; };
export type FlattenOptions = { prefix: string, separator: string, maxDepth: number | null };
export type VisitDictionaryFunction = (key: string, depth: number) => void;
export type VisitValueFunction = (key: string, value: string, depth: number) => void;

export default class ThemelyDictionary {

	values: InnerDictionary = {};
	source: string = '';

	public constructor(values: InnerDictionary, source: string) {
		this.values = values;
		this.source = source;
	};

	public static fromFile(relativePath: string): ThemelyDictionary {
		let data = FileUtils.readFileSync(relativePath);
		let values = JSON.parse(data);
		return new ThemelyDictionary(values, relativePath);
	}

	public static flattenOptionsCSS(): FlattenOptions {
		return { prefix: '--', separator: '-', maxDepth: null }
	}

	public static flattenOptionsDot(): FlattenOptions {
		return { prefix: '', separator: '.', maxDepth: null }
	}

	public keys(): any {
		return ThemelyDictionary.keysForInnerDictionary(this.values);
	}

	public static keysForInnerDictionary(innerDictionary: InnerDictionary): string[] {
		return innerDictionary.constructor == Object ? Object.keys(innerDictionary).filter(key => innerDictionary.hasOwnProperty(key)) : [];
	}

	public visit(visitDictionaryBegin: VisitDictionaryFunction, visitValue: VisitValueFunction, visitDictionaryEnd: VisitDictionaryFunction) {
		this.visitRecursive(this.values, 0, visitDictionaryBegin, visitValue, visitDictionaryEnd);
	}

	private visitRecursive(dictionary: InnerDictionary, depth: number, visitDictionaryBegin: VisitDictionaryFunction, visitValue: VisitValueFunction, visitDictionaryEnd: VisitDictionaryFunction) {
		for (var key of ThemelyDictionary.keysForInnerDictionary(dictionary)) {

			let value = dictionary[key];
			if (typeof value == 'object') {
				visitDictionaryBegin(key, depth);
				this.visitRecursive(value, depth + 1, visitDictionaryBegin, visitValue, visitDictionaryEnd);
				visitDictionaryEnd(key, depth);
			} else {
				visitValue(key, value, depth);
			}

		};
	}

	public static unflattenKey(key: string, options: FlattenOptions): string[] {
		let prefixRemoved = key.substring(options.prefix.length);
		let paths = prefixRemoved.split(options.separator);
		return paths;
	};

	public flattened(options: FlattenOptions): ThemelyDictionary {
		var result: InnerDictionary = {};
		this.flattenRecursively(options, { dictionary: this.values, currentOutput: result, currentDepth: 0, currentKey: ''});
		return new ThemelyDictionary(result, this.source);
	}

	private flattenRecursively(options: FlattenOptions, recursion: { dictionary: InnerDictionary, currentOutput: InnerDictionary, currentDepth: number, currentKey: string }) {

		ThemelyDictionary.keysForInnerDictionary(recursion.dictionary).forEach( key => {

			var value = recursion.dictionary[key];
			
			const valueIsArray = Array.isArray(value);
			const valueIsObject = typeof value === 'object' && value !== null;
			const valueHasKeyValues = ThemelyDictionary.keysForInnerDictionary(value).length;
			const hasReachedMaxDepth = options.maxDepth === null
			? false
			: options.maxDepth !== null && recursion.currentDepth < options.maxDepth
			
			const shouldStepIntoKey = 
			!valueIsArray
			&& valueIsObject
			&& valueHasKeyValues
			&& !hasReachedMaxDepth;

			var prefix = recursion.currentDepth == 0 ? options.prefix : '';
			var separator = recursion.currentDepth > 0 ? options.separator : '';
			var flattenedKey = recursion.currentKey + `${prefix}${separator}${key}`;
			
			if (shouldStepIntoKey) {
				return this.flattenRecursively(options, { dictionary: value, currentOutput: recursion.currentOutput, currentDepth: recursion.currentDepth + 1, currentKey: flattenedKey });
			} else {
				recursion.currentOutput[flattenedKey] = value;
			}
			
		});

	}


	private static isReferentialStaticValue(value: string): boolean {
		if (typeof value !== 'string') {
			return false;
		}
		const prefix: string = value.substring(0, 1);
		return prefix == '&';
	}

	private static isReferentialDynamicValue(value: string): boolean {
		if (typeof value !== 'string') {
			return false;
		}
		const prefix: string = value.substring(0, 1);
		return prefix == '$';
	}

	private static isReferentialValue(value: string): boolean {
		return this.isReferentialDynamicValue(value) || this.isReferentialStaticValue(value);
	}

	private static expandStatic(key: string, token: string, root: ThemelyDictionary): { result: string | null, errors: Error[] } {

		var errors: Error[] = [];
		var shiftingDictionary: InnerDictionary = root.values;
		var usedPaths: string[] = [];
		var index = 0;
		let trimmed: string = token.substring(1);
		let paths: string[] = trimmed.split('.');
		let pathsUntilValue = paths.slice(0, paths.length - 1);

		for (let path of pathsUntilValue) {

			usedPaths.push(path);

			let nextDictionary = shiftingDictionary[path];

			if (!nextDictionary) {
				errors.push(new Error(`Path ${usedPaths.join('.')} does not exist for referential path ${paths.join('.')} in key ${key}.`));
				break;
			}

			if (this.keysForInnerDictionary(nextDictionary).length == 0 && index < pathsUntilValue.length) {
				errors.push(new Error(`Path ${usedPaths.join('.')} does not contain a dictionary for referential path ${paths.join('.')} in key ${key}.`));
				break;
			}

			shiftingDictionary = nextDictionary;
			index += 1;
		}

		var resultValue: string | null = null;
		
		if (errors.length == 0) {

			let referencedValue: string = shiftingDictionary[paths[paths.length - 1]];

			if (!referencedValue) {

				// The references value does not exist
				errors.push(new Error(`Path ${paths.join('.')} does not exist or does not contain a value in key ${key}.`));
				resultValue = null;
				
			} else if (typeof referencedValue == 'object') {

				// The referenced value points to another dictionary or object. This is unsupported.
				errors.push(new Error(`Path ${paths.join('.')} points to another dictionary or object instead of a final value or another referential path, in key ${key}.`));
				resultValue = null;

			} else if (this.isReferentialValue(referencedValue)) {

				// The referenced value points to another referenced value, so we need to
				// repeat the process
				let recursionResult = this.expandStatic(key, referencedValue, root);
				resultValue = recursionResult.result;
				errors = errors.concat(recursionResult.errors);

			} else {
				resultValue = referencedValue;
			}

		}

		return { result: resultValue, errors: errors }
		
	}

	private static expandDynamic(token: string): string {
		let trimmed: string = token.substring(1);
		let paths: string[] = trimmed.split('.');
		let prefix: string = '--';
		let concatenated: string = paths.join('-');
		return `var(${prefix}${concatenated})`
	}

	public static expanded(flattened: ThemelyDictionary, root: ThemelyDictionary): { result: ThemelyDictionary, errors: Error[] } {
		
		let output = flattened.deepCopy().values;
		var errors: Error[] = [];

		for (var key of flattened.keys()) {
			
			let token = flattened.values[key];

			if (!this.isReferentialValue(token)) {

				// This is just a normal value
				continue;

			} else if (this.isReferentialStaticValue(token)) {

				// This is a static reference, so we need to find it's final value and replace it 
				// with that
				let staticResult = this.expandStatic(key, token, root);
				output[key] = staticResult.result;
				errors = errors.concat(staticResult.errors);

			} else if (this.isReferentialDynamicValue(token)) {
		
				// This is a dynamic reference, so we just use var() to reference it's target in CSS
				output[key] = this.expandDynamic(token);
		
			}
		}

		return { result: new ThemelyDictionary(output, root.source), errors: errors };
	}

	public deepCopy(): ThemelyDictionary {
		let copiedInnerValue = JSON.parse(JSON.stringify(this.values));
		return new ThemelyDictionary(copiedInnerValue, this.source);
	}

}
