const clear = require('clear');
const chalk = require('chalk');
const figlet = require('figlet');
const gradient = require('gradient-string');
const { program } = require('commander');

export const signalEntry = function() {
	if (!program.opts().noclear) {
		clear();
	}
	if (!program.opts().nobanner) {
		console.log(
			gradient(['#FCEE88', '#F09A7E', '#E4556B', '#8D4662', '#414467', '#FFFFFF']).multiline((figlet.textSync('themely', { font: 'roman', verticalLayout: 'fitted', horizontalLayout: 'fitted' })))
		);	
	}
}

export const bannerText = function(): string {
	return gradient(['#FCEE88', '#F09A7E', '#E4556B', '#8D4662', '#414467', '#FFFFFF']).multiline((figlet.textSync('themely', { font: 'roman', verticalLayout: 'fitted', horizontalLayout: 'fitted' })));
}

export const cleanup = function(errorString: string): string {
	if (errorString.substring(0, 7).toLowerCase() == 'error: ') {
		errorString = errorString.slice(7);
	} else if (errorString.substring(0, 9).toLowerCase() == 'warning: ') {
		errorString = errorString.slice(9);
	}
	return errorString;
}

export const signalError = function(title: string, error: Error, exit: boolean = true) {
	let errorString = `${error.message}`;

	console.error(
		chalk.red.bold(`${title}`),
		chalk.red(errorString)
	);

	if (exit) {
		process.exit(1);
	}
}

export const newline = function() {
	console.log('');
}

export const signalStatus = function(title: string, status: string) {

	console.error(
		chalk.blue.bold(`${title}`),
		chalk.white(status)
	);

}

export const signalWarning = function(title: string, warning: string) {

	console.error(
		chalk.yellow.bold(`${title}`),
		chalk.yellow(warning)
	);

}

export const signalErrors = function(title: string, errors: Error[]) {
	for (let error of errors) {
		signalError(title, error, false);
	}
	process.exit(1);
}

export const signalSuccess = function(title: string, message: string) {
	console.log(
		chalk.green.bold(`${title}`),
		chalk.green(message)
	);
	process.exit(1);
}

export const signalHelp = function() {
	program.outputHelp();
	process.exit(1);
}
