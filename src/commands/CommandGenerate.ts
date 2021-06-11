/**
 * Imports
 */

import CommandProtocol from './CommandProtocol';
import CommandCSS from './CommandCSS';
import CommandStylus from './CommandStylus';
import * as SignalUtils from '../utils/SignalUtils';

/**
 * Exports
 */

export default class CommandGenerate implements CommandProtocol {

	subcommands = {
		'css': new CommandCSS(),
		'stylus': new CommandStylus()
	};

	configure(program: any): any {
		
		let generate = program.command('generate');
		generate
		.description('Creates various files from theme JSON files.')
		.action((options: any, command: any) => {
			this.invoke({}, options, command);
		});
		return generate;

	};

	invoke(args: {}, options: any, command: any): void {
		command.outputHelp();
	};

}
