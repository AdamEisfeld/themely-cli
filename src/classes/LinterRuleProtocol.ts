/**
 * Imports
 */

import ThemelyDictionary from './ThemelyDictionary';

/**
 * Exports
 */

export type LinterResult = { rule: LinterRuleProtocol, errors: Error[] }
export default interface LinterRuleProtocol {

	readonly name: string;
	lint(theme: ThemelyDictionary, schema: ThemelyDictionary): LinterResult;

}
