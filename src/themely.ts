#!/usr/bin/env node

// Imports

import * as SignalUtils from './utils/SignalUtils';
const commander = require('commander');
import { setupThemelyLint } from './themely-lint';
import { setupThemelyGenerate } from './themely-generate';

const program = new commander.Command();
program
.option('-nb, --nobanner', 'disable banner')
.option('-nc, --noclear', 'disable clear')
.configureOutput({
    outputError: (str: string) => SignalUtils.signalError('SYNTAX ERROR', new Error(`${SignalUtils.cleanup(str)}`))
})
.addHelpText('beforeAll', `
${SignalUtils.bannerText()}`);

const lint = program.command('lint');
setupThemelyLint(lint);

const generate = program.command('generate');
setupThemelyGenerate(generate);



program.parse(process.argv);


// // .command('lint', 'lint your stuff', { executableFile: 'themely-lint' })
// // .command('generate', 'build a file', { executableFile: 'themely-generate' })


// const { program } = require('commander');

// program
// .option('-nb, --nobanner', 'disable banner')
// .option('-nc, --noclear', 'disable clear')
// .configureOutput({
//     outputError: (str: string) => SignalUtils.signalError('SYNTAX ERROR', new Error(`${SignalUtils.cleanup(str)}`))
// });


// program.addHelpText('beforeAll', `
// ${SignalUtils.bannerText()}`);

// program.parse(process.argv);

// //SignalUtils.signalEntry();