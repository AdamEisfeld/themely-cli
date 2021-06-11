/**
 * Imports
 */

const chalk = require('chalk');
const figlet = require('figlet');
const gradient = require('gradient-string');

/**
 * Exports
 */

const logMessage = function(message: string) {
	console.log(`${message}`);
};

const logError = function(message: string) {
	console.error(`${message}`);
};

export const shift = function(label: string, execute: ()=>void) {
	console.group(label);
	execute();
	console.groupEnd();
};

export const bannerText = function(): string {
	return gradient(['#FCEE88', '#F09A7E', '#E4556B', '#8D4662', '#414467', '#FFFFFF']).multiline((figlet.textSync('themely', { font: 'roman', verticalLayout: 'fitted', horizontalLayout: 'fitted' })));
};

export const cleanup = function(errorString: string): string {
	if (errorString.substring(0, 7).toLowerCase() == 'error: ') {
		errorString = errorString.slice(7);
	} else if (errorString.substring(0, 9).toLowerCase() == 'warning: ') {
		errorString = errorString.slice(9);
	}
	return errorString;
};

export const newline = function() {
	logMessage('');
};

export const signalError = function(title: string, error: Error, additional: string = '', exit: boolean = true) {
	let errorString = `${error.message}`;

	logError(
		chalk.red.bold(`${title}`)
		+ ' ' + chalk.red(errorString)
	);

	if (additional.length > 0) {
		logError(
			chalk.red.bold(`↳`)
			+ ' ' + chalk.red(additional)
		);
	}

	if (exit) {
		process.exit(1);
	}
};

export const signalErrors = function(title: string, errors: Error[]) {
	for (let error of errors) {
		signalError(title, error, '', false);
	}
	process.exit(1);
};

export const signalUnknownError = function(title: string, error: unknown, additional: string) {
	if (typeof error === 'string') {
		signalError(title, new Error(error), additional);
	} else if (error instanceof Error) {
		signalError(title, error, additional);
	} else {
		signalError(title, new Error(`${error}`), additional);
	}
};

export const signalStatus = function(title: string, status: string) {
	logMessage(
		chalk.blue.bold(`${title}`)
		+ ' ' + chalk.white(status)
	);
};

export const signalWarning = function(title: string, warning: string) {
	logMessage(
		chalk.yellow.bold(`${title}`)
		+ ' ' + chalk.yellow(warning)
	);
};

export const signalSuccess = function(title: string, message: string) {
	logMessage(
		chalk.green.bold(`${title}`)
		+ ' ' + chalk.green(message)
	);
};
