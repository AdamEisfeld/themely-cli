/**
 * Imports
 */

import CommandProtocol from './CommandProtocol';
import * as FileUtils from '../utils/FileUtils';
import * as SignalUtils from '../utils/SignalUtils';
import ThemelyDictionary from '../classes/ThemelyDictionary';
import Linter from '../classes/Linter';
import LinterRuleCheckSchema from '../classes/LinterRuleCheckSchema';
import LinterRuleCheckExpansion from '../classes/LinterRuleCheckExpansion';
import BatchConfig from '../classes/BatchConfig';
import CommandLint from './CommandLint';
import CommandCSS from './CommandCSS';
import CommandStylus from './CommandStylus';

/**
 * Exports
 */

export default class CommandBatch implements CommandProtocol {

	subcommands = {};

	configure(program: any): any {

		let batch = program.command('batch');
		batch
		.arguments('<configPath>')
		.description('Lints a set of theme JSON files against a schema JSON file, constructs CSS files for each theme, then constructs a Stylus file based off of the schema.', {
			configPath: 'The path of a JSON file describing the batch to run.',
		})
		.action((configPath: string, options: any, command: any) => {
			this.invoke({ configPath: configPath }, options, command);
		});
		return batch;

	};

	invoke(args: { configPath: string }, options: any, command: any): void {
		
		/**
 		* Input Validation
 		*/
		
		// configPath
		if (args.configPath && args.configPath.length == 0) {
			SignalUtils.signalError('SYNTAX ERROR', new Error('You must specify a configuration file.'));
		}
				
		/**
 		* Greeting
 		*/

		SignalUtils.signalStatus('Themely', `Running batch for ${args.configPath}`);
		
		/**
		* Program
		*/

		let batchConfig: BatchConfig;
		
		try {
			batchConfig = BatchConfig.fromFile(args.configPath);
		}
		catch (error: unknown) {
			SignalUtils.signalUnknownError('BATCH ERROR', error, `When deserializing Config JSON file at ${args.configPath}`);
			return;
		}

		let commandLint = new CommandLint();
		let commandGenerateCSS = new CommandCSS();
		let commandGenerateStylus = new CommandStylus();

		SignalUtils.shift('Batching ↴', ()=> {

			SignalUtils.shift('Linting ↴', ()=> {
				for (var themeConfig of batchConfig.themeConfigs) {
					commandLint.invoke( { themePath: themeConfig.themePath, schemaPath: batchConfig.schemaPath }, options, command);
				}
			});
			SignalUtils.signalSuccess('DONE', 'Linting Complete');

			SignalUtils.shift('Generating CSS ↴', ()=> {
				for (var themeConfig of batchConfig.themeConfigs) {
					commandGenerateCSS.invoke( { themePath: themeConfig.themePath, cssPath: themeConfig.cssPath, cssContainerName: themeConfig.cssContainerName }, options, command);
				}
			});
			SignalUtils.signalSuccess('DONE', 'CSS Generation Complete');

			SignalUtils.shift('Generating Stylus ↴', ()=> {
				// Generate Stylus
				commandGenerateStylus.invoke( { schemaPath: batchConfig.schemaPath, stylusPath: batchConfig.stylusPath, stylusContainerName: batchConfig.stylusContainerName }, options, command);
			});
			SignalUtils.signalSuccess('DONE', 'Stylus Generation Complete');

		});

		SignalUtils.signalSuccess('DONE', 'Batch Complete');

	};

}
 