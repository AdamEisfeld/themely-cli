/**
 * Imports
 */

import CommandProtocol from './CommandProtocol';
import * as FileUtils from '../utils/FileUtils';
import * as SignalUtils from '../utils/SignalUtils';
import ThemelyDictionary from '../classes/ThemelyDictionary';
import Linter from '../classes/Linter';
import LinterRuleCheckSchema from '../classes/LinterRuleCheckSchema';
import LinterRuleCheckExpansion from '../classes/LinterRuleCheckExpansion';

/**
 * Exports
 */

export default class CommandLint implements CommandProtocol {

	subcommands = {};

	configure(program: any): any {

		let lint = program.command('lint');
		lint
		.arguments('<themePath> <schemaPath>')
		.description('Checks a theme file for any issues that would cause file generation to break.', {
			themePath: 'The path of a JSON file to construct a theme from.',
			schemaPath: 'The path of a JSON file to check against the themePath looking for missing keypaths.'
		})
		.action((themePath: string, schemaPath: string, options: any, command: any) => {
			this.invoke({ themePath: themePath, schemaPath: schemaPath }, options, command);
		});
		return lint;

	};

	invoke(args: { themePath: string, schemaPath: string }, options: any, command: any): void {

		/**
		* Greeting
		*/

		SignalUtils.signalStatus('Themely', `Linting ${args.themePath} against ${args.schemaPath}`);

		/**
		* Program
		*/

		let theme: ThemelyDictionary;

		try {
			theme = ThemelyDictionary.fromFile(args.themePath);
		}
		catch (error: unknown) {
			SignalUtils.signalUnknownError('JSON ERROR', error, `When deserializing Theme JSON file at ${args.themePath}`);
			return;
		}

		let schema: ThemelyDictionary;

		try {
			schema = ThemelyDictionary.fromFile(args.schemaPath);
		}
		catch (error: unknown) {
			SignalUtils.signalUnknownError('JSON ERROR', error, `When deserializing Schema JSON file at ${args.schemaPath}`);
			return;
		}

		let linter = new Linter(theme, schema);
		let results = linter.lint([
			new LinterRuleCheckSchema(),
			new LinterRuleCheckExpansion()
		]);

		var passed: boolean = true;

		for (var result of results) {
			if (result.errors.length == 0) {
				continue;
			}
			SignalUtils.signalWarning('FAILED', `${result.rule.name}`)
			for (var error of result.errors) {
				passed = false;
				SignalUtils.signalError(' => ', error, '', false);
			}
		}

		/**
		* Result
		*/

		if (passed) {
			SignalUtils.signalSuccess('PASSED', 'Linting Passed');
		} else {
			SignalUtils.signalError('FAILED', new Error('Linting Failed'));
		}
	};

}
