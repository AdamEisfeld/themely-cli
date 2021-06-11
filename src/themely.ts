#!/usr/bin/env node

/**
 * Imports
 */

const commander = require('commander');

import * as SignalUtils from './utils/SignalUtils';
import { setupThemelyLint } from './themely-lint';
import { setupThemelyGenerate } from './themely-generate';

/**
 * Program Setup (Main Entry Point)
 */

const program = new commander.Command();

program
.description('A CLI for creating and managing Themely.io themes.')
.configureOutput({
    outputError: (str: string) => SignalUtils.signalError('SYNTAX ERROR', new Error(`${SignalUtils.cleanup(str)}`))
})
.addHelpText('beforeAll', `${SignalUtils.bannerText()}`);

/**
 * Program Subcommands
 */

const subcommandLint = program.command('lint');
setupThemelyLint(subcommandLint);

const subcommandGenerate = program.command('generate');
setupThemelyGenerate(subcommandGenerate);

/**
 * Program Run
 */

program.parse(process.argv);
