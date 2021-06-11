#!/usr/bin/env node

// Imports

import * as SignalUtils from './utils/SignalUtils';
const { program } = require('commander');

program
.command('css', 'build a css file', { executableFile: 'themely-generate-css' })
.command('stylus', 'build a stylus file', { executableFile: 'themely-generate-stylus' })
.configureOutput({
    outputError: (str: string) => SignalUtils.signalError('SYNTAX ERROR', new Error(`${SignalUtils.cleanup(str)}`))
});

program.parse(process.argv);
