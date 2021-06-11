#!/usr/bin/env node

/**
 * Imports
 */

const commander = require('commander');

import CommandProtocol from './commands/CommandProtocol';
import CommandMain from './commands/CommandMain';

const program = new commander.Command();

function register(program: any, command: CommandProtocol) {
    let subprogram = command.configure(program);
    for (var subcommandKey of Object.keys(command.subcommands)) {
        let subcommand = command.subcommands[subcommandKey];
        register(subprogram, subcommand);
    };
}

const main = new CommandMain();
register(program, main);
program.parse(process.argv);








// import * as SignalUtils from './utils/SignalUtils';
// import { setupThemelyLint } from './themely-lint';
// import { setupThemelyGenerate } from './themely-generate';
// import { setupThemelyBatch } from './themely-batch';
// import CommandProtocol from './commands/CommandProtocol';

// /**
//  * Program Setup (Main Entry Point)
//  */

// const program = new commander.Command();

// program
// .description('A CLI for creating and managing Themely.io themes.')
// .configureOutput({
//     outputError: (str: string) => SignalUtils.signalError('SYNTAX ERROR', new Error(`${SignalUtils.cleanup(str)}`))
// })
// .addHelpText('beforeAll', `${SignalUtils.bannerText()}`);

// /**
//  * Program Subcommands
//  */

// const subcommandLint = program.command('lint');
// setupThemelyLint(subcommandLint);

// const subcommandGenerate = program.command('generate');
// setupThemelyGenerate(subcommandGenerate);

// const subcommandBatch = program.command('batch');
// setupThemelyBatch(subcommandBatch);

// /**
//  * Program Run
//  */

// program.parse(process.argv);
