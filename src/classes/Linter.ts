import LinterRuleProtocol, { LinterResult } from './LinterRuleProtocol';
import ThemelyDictionary from './ThemelyDictionary';

export default class Linter {

	theme: ThemelyDictionary;
	schema: ThemelyDictionary;

	public constructor(theme: ThemelyDictionary, schema: ThemelyDictionary) {
		this.theme = theme;
		this.schema = schema;
	}

	public lint(rules: LinterRuleProtocol[]): LinterResult[] {

		var results: LinterResult[] = [];

		for (var rule of rules) {
			let result = rule.lint(this.theme, this.schema);
			results = results.concat(result);
		}

		return results;
		
	}

}
