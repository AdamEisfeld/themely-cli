#!/usr/bin/env node

/**
 * Imports
 */

import * as SignalUtils from './utils/SignalUtils';
import { setupThemelyGenerateCSS } from './themely-generate-css';
import { setupThemelyGenerateStylus } from './themely-generate-stylus';

/**
 * Exports
 */

export const setupThemelyGenerate = function(program: any) {

    /**
	 * Program Setup (Subcommand)
	 */

    program
    .configureOutput({
        outputError: (str: string) => SignalUtils.signalError('SYNTAX ERROR', new Error(`${SignalUtils.cleanup(str)}`))
    });

    /**
     * Program Subcommands
     */

    const subcommandCSS = program.command('css');
    setupThemelyGenerateCSS(subcommandCSS);

    const subcommandStylus = program.command('stylus');
    setupThemelyGenerateStylus(subcommandStylus);
};
