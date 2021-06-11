/**
 * Imports
 */

import CommandProtocol from './CommandProtocol';
import * as FileUtils from '../utils/FileUtils';
import * as SignalUtils from '../utils/SignalUtils';
import ThemelyDictionary from '../classes/ThemelyDictionary';

/**
 * Exports
 */

export default class CommandCSS implements CommandProtocol {

	subcommands = {};

	configure(program: any): any {

		let css = program.command('css');
		css
		.arguments('<themePath> <cssPath> <cssContainerName>')
		.description('Generates a CSS file from an input theme JSON file.', {
			themePath: 'The path of a JSON file to create the CSS file from.',
			cssPath: 'The desired path of the CSS file to create.',
			cssContainerName: 'The class name to wrap the CSS definition in. Specify root to expose the CSS variables globally.'
		})
		.action((themePath: string, cssPath: string, cssContainerName: string, options: any, command: any) => {
			this.invoke({ themePath: themePath, cssPath: cssPath, cssContainerName: cssContainerName }, options, command);
		});
		return css;

	};

	invoke(args: { themePath: string, cssPath: string, cssContainerName: string }, options: any, command: any): void {

		/**
 		* Input Validation
 		*/
		
		// cssPath
		if (args.cssPath && args.cssPath.length == 0) {
			SignalUtils.signalError('SYNTAX ERROR', new Error('The specified CSS path is empty.'));
		}
		
		// cssContainerName
		if (args.cssContainerName && args.cssContainerName.length == 0) {
			SignalUtils.signalError('SYNTAX ERROR', new Error('The specified name is empty.'));
		}
		
		/**
 		* Greeting
 		*/

		SignalUtils.signalStatus('Themely', `Generating CSS for ${args.themePath} into ${args.cssPath}`);
		
		/**
 		* Program
 		*/

		let original: ThemelyDictionary;

		try {
			original = ThemelyDictionary.fromFile(args.themePath);
		}
		catch (error: unknown) {
			SignalUtils.signalUnknownError('JSON ERROR', error, `When deserializing Theme JSON file at ${args.themePath}`);
			return;
		}

		let flattened = original.flattened(ThemelyDictionary.flattenOptionsCSS());
		let expandedResult = ThemelyDictionary.expanded(flattened, original);
		if (expandedResult.errors.length > 0) {
			SignalUtils.signalErrors('ERROR', expandedResult.errors);
		}
		let expanded = expandedResult.result;
		
		var className: string
		
		if (args.cssContainerName === 'root') {
			className = ':root';
		} else {
			className = `.${args.cssContainerName}`;
		}
		
		var output: string[] = [];
		
		output.push(`${className} {`);
		
		for (var key of expanded.keys()) {
			const value: string = expanded.values[key];
			var line: string = `\t${key}: ${value};`;
			output.push(line);
		};
		
		output.push(`}`);
		
		let outputString = `${output.join('\n')}\n`;

		/**
 		* Result
 		*/

		try {
			FileUtils.writeFileSync(args.cssPath, outputString, null);
		}
		catch (error: unknown) {
			SignalUtils.signalUnknownError('FILE ERROR', error, `When writing CSS file at ${args.cssPath}.`);
			return;
		}

		SignalUtils.signalSuccess('DONE', `Generated CSS file ${args.cssPath}.`);
	};

}
 