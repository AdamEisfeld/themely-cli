/**
 * Imports
 */

import CommandProtocol from './CommandProtocol';
import * as FileUtils from '../utils/FileUtils';
import * as SignalUtils from '../utils/SignalUtils';
import ThemelyDictionary, { FlattenOptions, InnerDictionary } from '../classes/ThemelyDictionary';

/**
 * Exports
 */

export default class CommandStylus implements CommandProtocol {

	subcommands = {};

	configure(program: any): any {

		let stylus = program.command('stylus');
		stylus
		.arguments('<schemaPath> <stylusPath> <stylusContainerName>')
		.description('Generates a Stylus file containing a nested dictionary of key/values, from an input schema JSON file.', {
			schemaPath: 'The path of a JSON schema file to create the Stylus file from.',
			stylusPath: 'The desired path of the Stylus file to create.',
			stylusContainerName: 'The variable name to wrap the Stylus definition in.'
		})
		.action((schemaPath: string, stylusPath: string, stylusContainerName: string, options: any, command: any) => {
			this.invoke({ schemaPath: schemaPath, stylusPath: stylusPath, stylusContainerName: stylusContainerName }, options, command);
		});
		return stylus;

	};

	invoke(args: { schemaPath: string, stylusPath: string, stylusContainerName: string }, options: any, command: any): void {

		/**
 		* Greeting
 		*/

		SignalUtils.signalStatus('Themely', `Generating Stylus for ${args.schemaPath} into ${args.stylusPath}`);
	
		/**
 		* Input Validation
 		*/
		
		// schemaPath
		if (args.schemaPath && args.schemaPath.length == 0) {
			SignalUtils.signalError('SYNTAX ERROR', new Error('The specified Schema path is empty.'));
		}
		
		// stylusPath
		if (args.stylusPath && args.stylusPath.length == 0) {
			SignalUtils.signalError('SYNTAX ERROR', new Error('The specified Stylus path is empty.'));
		}
		
		// stylusContainerName
		if (args.stylusContainerName && args.stylusContainerName.length == 0) {
			SignalUtils.signalError('SYNTAX ERROR', new Error('The specified Stylus container name is empty.'));
		}

		/**
 		* Program
 		*/

		let schema: ThemelyDictionary;

		try {
			schema = ThemelyDictionary.fromFile(args.schemaPath);
		}
		catch (error: unknown) {
			SignalUtils.signalUnknownError('JSON ERROR', error, `When deserializing JSON Schema at ${args.schemaPath}`);
			return;
		}
		
		let flattenOptions: FlattenOptions = ThemelyDictionary.flattenOptionsCSS();
		let flattenedSchema = schema.flattened(flattenOptions);
	
		for (let flattenedKey of flattenedSchema.keys()) {
	
			// Unflatten the key into a path we can use on the original schema dictionary
			let paths = ThemelyDictionary.unflattenKey(flattenedKey, flattenOptions);
			let pathsUntilValue = paths.slice(0, paths.length - 1);
			var referenceDictionary: InnerDictionary = schema.values;
			for (let path of pathsUntilValue) {
				referenceDictionary = referenceDictionary[path];
			};
	
			referenceDictionary[paths[paths.length - 1]] = flattenedKey;
			
		};
	
		var output: string[] = [];
	
		output.push(`${args.stylusContainerName} = {`);
	
		schema.visit( (key, depth) => {
			
			output.push(`${'\t'.repeat(depth + 1)}${key}: {`);
	
		}, (key, value, depth) => {
	
			output.push(`${'\t'.repeat(depth + 1)}${key}: var(${value}),`)
	
	
		}, (key, depth) => {
	
			output.push(`${'\t'.repeat(depth + 1)}},`);
			
		});
	
		output.push(`}`);
	
		let outputString = `${output.join('\n')}\n`;

		try {
			FileUtils.writeFileSync(args.stylusPath, outputString, null);
		}
		catch (error: unknown) {
			SignalUtils.signalUnknownError('FILE ERROR', error, `When writing Stylus file at ${args.stylusPath}.`);
			return;
		}

		/**
 		* Result
 		*/

		SignalUtils.signalSuccess('DONE', `Generated Stylus file ${args.stylusPath}.`);

	};

}
