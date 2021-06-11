#!/usr/bin/env node

// Imports

import { setupThemelyGenerateCSS } from './themely-generate-css';
import { setupThemelyGenerateStylus } from './themely-generate-stylus';
import * as SignalUtils from './utils/SignalUtils';


export const setupThemelyGenerate = function(program: any) {
    program
    .configureOutput({
        outputError: (str: string) => SignalUtils.signalError('SYNTAX ERROR', new Error(`${SignalUtils.cleanup(str)}`))
    });

    const css = program.command('css');
    setupThemelyGenerateCSS(css);

    const stylus = program.command('stylus');
    setupThemelyGenerateStylus(stylus);
};

// const { program } = require('commander');

// program
// .command('css', 'build a css file', { executableFile: 'themely-generate-css' })
// .command('stylus', 'build a stylus file', { executableFile: 'themely-generate-stylus' })
// .configureOutput({
//     outputError: (str: string) => SignalUtils.signalError('SYNTAX ERROR', new Error(`${SignalUtils.cleanup(str)}`))
// });

// program.parse(process.argv);
