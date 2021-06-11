/**
 * Imports
 */

import LinterRuleProtocol, { LinterResult } from './LinterRuleProtocol';
import ThemelyDictionary from './ThemelyDictionary';

/**
 * Exports
 */

export default class LinterRuleCheckExpansion implements LinterRuleProtocol {

	name: string = 'Check Expansion';

	public lint(theme: ThemelyDictionary, schema: ThemelyDictionary): LinterResult {

		let flattened = theme.flattened(ThemelyDictionary.flattenOptionsCSS());
		let expandedResult = ThemelyDictionary.expanded(flattened, theme);

		return { rule: this, errors: expandedResult.errors }

	}

}
