#!/usr/bin/env node
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import init from './init.js';
import build from './build.js';

yargs(hideBin(process.argv))
    .scriptName('gl')
    .command('build', 'Builds the plugin', {}, build)
    .command('init', 'Creates a blank GL.config.js', {}, init)
    .demandCommand(1)
    .help()
    .argv;