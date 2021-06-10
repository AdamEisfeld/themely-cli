import ThemelyDictionary from './ThemelyDictionary';

export type LinterResult = { rule: LinterRuleProtocol, errors: Error[] }
export default interface LinterRuleProtocol {

	readonly name: string;
	lint(theme: ThemelyDictionary, schema: ThemelyDictionary): LinterResult;

}
