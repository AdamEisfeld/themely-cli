#!/usr/bin/env node

// Imports

import * as CommanderUtils from './utils/CommanderUtils';
import * as SignalUtils from './utils/SignalUtils';

CommanderUtils.program
.description('themely description')
.option('-nb, --nobanner', 'disable banner')
.option('-nc, --noclear', 'disable clear')
.command('lint', 'lint your stuff')
.command('generate', 'build a file')
.configureOutput({
    outputError: (str: string) => SignalUtils.signalError('SYNTAX ERROR', new Error(`${SignalUtils.cleanup(str)}`))
});

CommanderUtils.program.addHelpText('beforeAll', `
${SignalUtils.bannerText()}`);

CommanderUtils.program.parse(process.argv);

SignalUtils.signalEntry();