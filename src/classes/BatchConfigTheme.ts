/**
 * Imports
 */

import ThemelyDictionary from './ThemelyDictionary';

/**
 * Exports
 */

export default class BatchConfigTheme {

	themePath: string;
	cssPath: string
	cssContainerName: string

	public constructor(themePath: string, cssPath: string, cssContainerName: string) {
		this.themePath = themePath;
		this.cssPath = cssPath;
		this.cssContainerName = cssContainerName;
	}

}
