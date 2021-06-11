/**
 * Imports
 */

import CommandProtocol from './CommandProtocol';
import CommandGenerate from './CommandGenerate';
import CommandLint from './CommandLint';
import CommandBatch from './CommandBatch';
import * as SignalUtils from '../utils/SignalUtils';

/**
 * Exports
 */

export default class CommandMain implements CommandProtocol {

	subcommands = {
		'generate': new CommandGenerate(),
		'lint': new CommandLint(),
		'batch': new CommandBatch()
	};

	configure(program: any): any {

		program
		.description('A CLI for creating and managing Themely.io themes.')
		.configureOutput({
			outputError: (str: string) => SignalUtils.signalError('SYNTAX ERROR', new Error(`${SignalUtils.cleanup(str)}`))
		})
		.addHelpText('beforeAll', `${SignalUtils.bannerText()}`)
		.action((options: any, command: any) => {
			this.invoke({}, options, command);
		});
		return program;

	};

	invoke(args: {}, options: any, command: any): void {
		command.outputHelp();
	};

}
