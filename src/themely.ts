#!/usr/bin/env node

// Imports

import * as SignalUtils from './utils/SignalUtils';
const { program } = require('commander');

program
.option('-nb, --nobanner', 'disable banner')
.option('-nc, --noclear', 'disable clear')
.command('lint', 'lint your stuff')
.command('generate', 'build a file')
.configureOutput({
    outputError: (str: string) => SignalUtils.signalError('SYNTAX ERROR', new Error(`${SignalUtils.cleanup(str)}`))
});

program.addHelpText('beforeAll', `
${SignalUtils.bannerText()}`);

program.parse(process.argv);

//SignalUtils.signalEntry();