/**
 * Imports
 */

import ThemelyDictionary, { InnerDictionary } from './ThemelyDictionary';
import BatchConfigTheme from './BatchConfigTheme';
import * as FileUtils from '../utils/FileUtils';
import { type } from 'os';
/**
 * Exports
 */

export default class BatchConfig {

	themeConfigs: BatchConfigTheme[];
	schemaPath: string;
	stylusPath: string;
	stylusContainerName: string;

	public constructor(themeConfigs: BatchConfigTheme[], schemaPath: string, stylusPath: string, stylusContainerName: string) {
		this.themeConfigs = themeConfigs;
		this.schemaPath = schemaPath;
		this.stylusPath = stylusPath;
		this.stylusContainerName = stylusContainerName;
	}

	public static fromFile(configPath: string): BatchConfig {

		let fileJSON = ThemelyDictionary.fromFile(configPath);

		let schemaPath = fileJSON.values['schema'];
		let stylusPath = fileJSON.values['stylus'];
		let stylusContainerName = fileJSON.values['stylusContainerName'];
		if (!stylusContainerName) {
			throw new Error(`stylusContainerName in Batch config ${configPath} must be specified`);
		}
		if (typeof stylusContainerName !== 'string') {
			throw new Error(`stylusContainerName in Batch config ${configPath} is not a string`);
		}

		let themeDefinitions: InnerDictionary[] = fileJSON.values['themes'];

		var themeConfigs: BatchConfigTheme[] = [];

		for (var themeDefinition of themeDefinitions) {
			let themePath = themeDefinition['theme'];
			if (!themePath) {
				throw new Error(`themePath in Batch config ${configPath} must be specified`);
			}
			if (typeof themePath !== 'string') {
				throw new Error(`themePath in Batch config ${configPath} is not a string`);
			}
			let cssPath = themeDefinition['cssPath'];
			if (!cssPath) {
				throw new Error(`cssPath in Batch config ${configPath} must be specified`);
			}
			if (typeof cssPath !== 'string') {
				throw new Error(`cssPath in Batch config ${configPath} is not a string`);
			}
			let cssContainerName = themeDefinition['cssContainerName'];
			if (!cssContainerName) {
				throw new Error(`cssContainerName in Batch config ${configPath} must be specified`);
			}
			if (typeof cssContainerName !== 'string') {
				throw new Error(`cssContainerName in Batch config ${configPath} is not a string`);
			}

			let configTheme = new BatchConfigTheme(themePath, cssPath, cssContainerName);
			themeConfigs.push(configTheme);
		}

		return new BatchConfig(themeConfigs, schemaPath, stylusPath, stylusContainerName);
	}

}
 