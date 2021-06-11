#!/usr/bin/env node

/**
 * Imports
 */

import * as FileUtils from './utils/FileUtils';
import * as SignalUtils from './utils/SignalUtils';
import ThemelyDictionary, { FlattenOptions, InnerDictionary } from './classes/ThemelyDictionary';

/**
 * Exports
 */

export const setupThemelyGenerateStylus = function(program: any) {

    /**
	 * Program Setup (Subcommand)
	 */

	program
	.arguments('<schemaPath> <stylusPath> <stylusContainerName>')
	.description('Generates a Stylus file containing a nested dictionary of key/values, from an input schema JSON file.', {
		schemaPath: 'The path of a JSON schema file to create the Stylus file from.',
		stylusPath: 'The desired path of the Stylus file to create.',
		stylusContainerName: 'The variable name to wrap the Stylus definition in.'
	})
	.configureOutput({
		outputError: (str: string) => SignalUtils.signalError('SYNTAX ERROR', new Error(`${SignalUtils.cleanup(str)}`))
	})
	.action((schemaPath: string, stylusPath: string, stylusContainerName: string, options: any, command: any) => {
	
		/**
 		* Input Validation
 		*/

		// schemaPath
		if (schemaPath && schemaPath.length == 0) {
			SignalUtils.signalError('SYNTAX ERROR', new Error('You must specify a schema file.'));
		}
		if (!FileUtils.fileExistsAtRelativePath(schemaPath)) {
			SignalUtils.signalError('SYNTAX ERROR', new Error(`Schema file does not exist: ${ schemaPath }`));
		}
	
		// stylusPath
		if (stylusPath && stylusPath.length == 0) {
			SignalUtils.signalError('SYNTAX ERROR', new Error('The specified Stylus path is empty.'));
		}
	
		// stylusContainerName
		if (stylusContainerName && stylusContainerName.length == 0) {
			SignalUtils.signalError('SYNTAX ERROR', new Error('The specified Stylus container name is empty.'));
		}
	
		const input = { schemaPath: schemaPath, stylusPath: stylusPath, stylusContainerName: stylusContainerName }
	
		/**
 		* Greeting
 		*/

		SignalUtils.signalStatus('Themely', `Generating Stylus for ${input.schemaPath} into ${input.stylusPath}`);
		SignalUtils.newline();
	
		/**
 		* Program
 		*/

		let schema: ThemelyDictionary = ThemelyDictionary.fromFile(input.schemaPath);
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
	
		output.push(`${input.stylusContainerName} = {`);
	
		schema.visit( (key, depth) => {
			
			output.push(`${'\t'.repeat(depth + 1)}${key}: {`);
	
		}, (key, value, depth) => {
	
			output.push(`${'\t'.repeat(depth + 1)}${key}: var(${value}),`)
	
	
		}, (key, depth) => {
	
			output.push(`${'\t'.repeat(depth + 1)}},`);
			
		});
	
		output.push(`}`);
	
		let outputString = `${output.join('\n')}\n`;
		FileUtils.writeFileSync(input.stylusPath, outputString, null);

		/**
 		* Result
 		*/

		SignalUtils.signalSuccess('DONE', `Generated Stylus file ${input.stylusPath}: \n${outputString}`);
	
	});
};
