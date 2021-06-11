/**
 * Imports
 */



 /**
  * Exports
  */
 
export default interface CommandProtocol {

	subcommands: { [key: string]: CommandProtocol; };
	configure(program: any): any;
	invoke(args: any, options: any, command: any): void;

}
 