#!/usr/bin/env node

// Imports

import * as CommanderUtils from './utils/CommanderUtils';
import * as SignalUtils from './utils/SignalUtils';

CommanderUtils.program
.command('css', 'build a css file')
.command('stylus', 'build a stylus file')
.configureOutput({
    outputError: (str: string) => SignalUtils.signalError('SYNTAX ERROR', new Error(`${SignalUtils.cleanup(str)}`))
});
CommanderUtils.program.parse(process.argv);
