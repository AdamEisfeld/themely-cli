#!/usr/bin/env node

// Imports

import * as FileUtils from './utils/FileUtils';
import * as SignalUtils from './utils/SignalUtils';
import ThemelyDictionary from './classes/ThemelyDictionary';
const { program } = require('commander');

program
.arguments('<themePath> <cssPath> <cssContainerName>')
.configureOutput({
	outputError: (str: string) => SignalUtils.signalError('SYNTAX ERROR', new Error(`${SignalUtils.cleanup(str)}`))
})
.action((themePath: string, cssPath: string, cssContainerName: string, options: any, command: any) => {

	// themePath
	if (themePath && themePath.length == 0) {
		SignalUtils.signalError('SYNTAX ERROR', new Error('You must specify a JSON file.'));
	}
	if (!FileUtils.fileExistsAtRelativePath(themePath)) {
		SignalUtils.signalError('SYNTAX ERROR', new Error(`JSON file does not exist: ${ themePath }`));
	}
	
	// cssPath
	if (cssPath && cssPath.length == 0) {
		SignalUtils.signalError('SYNTAX ERROR', new Error('The specified CSS path is empty.'));
	}
	
	// cssContainerName
	if (cssContainerName && cssContainerName.length == 0) {
		SignalUtils.signalError('SYNTAX ERROR', new Error('The specified name is empty.'));
	}
	
	const input = { themePath: themePath, cssPath: cssPath, cssContainerName: cssContainerName }
	
	SignalUtils.signalStatus('Themely', `Generating CSS for ${input.themePath} into ${input.cssPath}`);
	SignalUtils.newline();
	
	let original = ThemelyDictionary.fromFile(input.themePath);
	let flattened = original.flattened(ThemelyDictionary.flattenOptionsCSS());
	let expandedResult = ThemelyDictionary.expanded(flattened, original);
	if (expandedResult.errors.length > 0) {
		SignalUtils.signalErrors('ERROR', expandedResult.errors);
	}
	let expanded = expandedResult.result;
	
	var className: string
	
	if (input.cssContainerName === 'root') {
		className = ':root';
	} else {
		className = `.${input.cssContainerName}`;
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
	FileUtils.writeFileSync(input.cssPath, outputString, null);
	SignalUtils.signalSuccess('DONE', `Generated CSS file ${input.cssPath}: \n${outputString}`);

});
