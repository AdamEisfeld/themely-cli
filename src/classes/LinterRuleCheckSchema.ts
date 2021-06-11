/**
 * Imports
 */

import LinterRuleProtocol, { LinterResult } from './LinterRuleProtocol';
import ThemelyDictionary, { FlattenOptions } from './ThemelyDictionary';

/**
 * Exports
 */

export default class LinterRuleCheckSchema implements LinterRuleProtocol {

	name: string = 'Check Schema';

	public lint(theme: ThemelyDictionary, schema: ThemelyDictionary): LinterResult {

		var errors: Error[] = [];

		let flattenOptions: FlattenOptions = ThemelyDictionary.flattenOptionsDot();
		let flattenedTheme = theme.flattened(flattenOptions);
		let flattenedSchema = schema.flattened(flattenOptions);
	
		for (var key of flattenedSchema.keys()) {
			
			if (!flattenedTheme.values[key]) {
				// The JSON is missing this key path, add it to the list of issues
				errors.push(new Error(`Theme file ${theme.source} is missing keypath ${key} from schema ${schema.source}`));
			}
		};

		return { rule: this, errors: errors }

	}

}
