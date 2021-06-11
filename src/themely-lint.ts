#!/usr/bin/env node

/**
 * Imports
 */

import * as FileUtils from './utils/FileUtils';
import * as SignalUtils from './utils/SignalUtils';
import ThemelyDictionary from './classes/ThemelyDictionary';
import Linter from './classes/Linter';
import LinterRuleCheckSchema from './classes/LinterRuleCheckSchema';
import LinterRuleCheckExpansion from './classes/LinterRuleCheckExpansion';

/**
 * Exports
 */

export const setupThemelyLint = function(program: any) {

	/**
	 * Program Setup (Subcommand)
	 */

	program
	.arguments('<themePath> <schemaPath>')
	.description('Checks a theme file for any issues that would cause file generation to break.', {
		themePath: 'The path of a JSON file to construct a theme from.',
		schemaPath: 'The path of a JSON file to check against the themePath looking for missing keypaths.'
	})
	.configureOutput({
		outputError: (str: string) => SignalUtils.signalError('SYNTAX ERROR', new Error(`${SignalUtils.cleanup(str)}`))
	})
	.action((themePath: string, schemaPath: string, options: any, command: any) => {

		/**
 		* Input Validation
 		*/

		// themePath
		if (themePath && themePath.length == 0) {
			SignalUtils.signalError('SYNTAX ERROR', new Error('You must specify a JSON file.'));
		}
		if (!FileUtils.fileExistsAtRelativePath(themePath)) {
			SignalUtils.signalError('SYNTAX ERROR', new Error(`JSON file does not exist: ${ themePath }`));
		}

		// schemaPath
		if (schemaPath && schemaPath.length == 0) {
			SignalUtils.signalError('SYNTAX ERROR', new Error('You must specify a schema file.'));
		}
		if (!FileUtils.fileExistsAtRelativePath(schemaPath)) {
			SignalUtils.signalError('SYNTAX ERROR', new Error(`Schema file does not exist: ${ schemaPath }`));
		}

		const input = { themePath: themePath, schemaPath: schemaPath };

		/**
 		* Greeting
 		*/

		SignalUtils.signalStatus('Themely', `Linting ${input.themePath} against ${input.schemaPath}`);
		SignalUtils.newline();

		/**
 		* Program
 		*/

		let theme: ThemelyDictionary = ThemelyDictionary.fromFile(input.themePath);
		let schema: ThemelyDictionary = ThemelyDictionary.fromFile(input.schemaPath);

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
				SignalUtils.signalError(' => ', error, false);
			}
			SignalUtils.newline();
		}

		/**
 		* Result
 		*/

		if (passed) {
			SignalUtils.signalSuccess('PASSED', 'Linting Passed');
		} else {
			SignalUtils.signalError('FAILED', new Error('Linting Failed'));
		}

	});

};
