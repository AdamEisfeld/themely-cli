#!/usr/bin/env node

// Imports

import * as FileUtils from './utils/FileUtils';
import ThemelyDictionary, { FlattenOptions, InnerDictionary } from './classes/ThemelyDictionary';
import * as SignalUtils from './utils/SignalUtils';





export const setupThemelyGenerateStylus = function(program: any) {

	program
	.arguments('<schemaPath> <stylusPath> <stylusContainerName>')
	.configureOutput({
		outputError: (str: string) => SignalUtils.signalError('SYNTAX ERROR', new Error(`${SignalUtils.cleanup(str)}`))
	})
	.action((schemaPath: string, stylusPath: string, stylusContainerName: string, options: any, command: any) => {
	
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
	
		// result
		const input = { schemaPath: schemaPath, stylusPath: stylusPath, stylusContainerName: stylusContainerName }
	
		SignalUtils.signalStatus('Themely', `Generating Stylus for ${input.schemaPath} into ${input.stylusPath}`);
		SignalUtils.newline();
	
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
		SignalUtils.signalSuccess('DONE', `Generated Stylus file ${input.stylusPath}: \n${outputString}`);
	
	});
};

// const { program } = require('commander');

// program
// .arguments('<schemaPath> <stylusPath> <stylusContainerName>')
// .configureOutput({
// 	outputError: (str: string) => SignalUtils.signalError('SYNTAX ERROR', new Error(`${SignalUtils.cleanup(str)}`))
// })
// .action((schemaPath: string, stylusPath: string, stylusContainerName: string, options: any, command: any) => {

// 	// schemaPath
// 	if (schemaPath && schemaPath.length == 0) {
// 		SignalUtils.signalError('SYNTAX ERROR', new Error('You must specify a schema file.'));
// 	}
// 	if (!FileUtils.fileExistsAtRelativePath(schemaPath)) {
// 		SignalUtils.signalError('SYNTAX ERROR', new Error(`Schema file does not exist: ${ schemaPath }`));
// 	}

// 	// stylusPath
// 	if (stylusPath && stylusPath.length == 0) {
// 		SignalUtils.signalError('SYNTAX ERROR', new Error('The specified Stylus path is empty.'));
// 	}

// 	// stylusContainerName
// 	if (stylusContainerName && stylusContainerName.length == 0) {
// 		SignalUtils.signalError('SYNTAX ERROR', new Error('The specified Stylus container name is empty.'));
// 	}

// 	// result
// 	const input = { schemaPath: schemaPath, stylusPath: stylusPath, stylusContainerName: stylusContainerName }

// 	SignalUtils.signalStatus('Themely', `Generating Stylus for ${input.schemaPath} into ${input.stylusPath}`);
// 	SignalUtils.newline();

// 	let schema: ThemelyDictionary = ThemelyDictionary.fromFile(input.schemaPath);
// 	let flattenOptions: FlattenOptions = ThemelyDictionary.flattenOptionsCSS();
// 	let flattenedSchema = schema.flattened(flattenOptions);

// 	for (let flattenedKey of flattenedSchema.keys()) {

// 		// Unflatten the key into a path we can use on the original schema dictionary
// 		let paths = ThemelyDictionary.unflattenKey(flattenedKey, flattenOptions);
// 		let pathsUntilValue = paths.slice(0, paths.length - 1);
// 		var referenceDictionary: InnerDictionary = schema.values;
// 		for (let path of pathsUntilValue) {
// 			referenceDictionary = referenceDictionary[path];
// 		};

// 		referenceDictionary[paths[paths.length - 1]] = flattenedKey;
		
// 	};

// 	var output: string[] = [];

// 	output.push(`${input.stylusContainerName} = {`);

// 	schema.visit( (key, depth) => {
		
// 		output.push(`${'\t'.repeat(depth + 1)}${key}: {`);

// 	}, (key, value, depth) => {

// 		output.push(`${'\t'.repeat(depth + 1)}${key}: var(${value}),`)


// 	}, (key, depth) => {

// 		output.push(`${'\t'.repeat(depth + 1)}},`);
		
// 	});

// 	output.push(`}`);

// 	let outputString = `${output.join('\n')}\n`;
// 	FileUtils.writeFileSync(input.stylusPath, outputString, null);
// 	SignalUtils.signalSuccess('DONE', `Generated Stylus file ${input.stylusPath}: \n${outputString}`);

// });

// program.parse(process.argv);

// // Program

