#!/usr/bin/env node
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import init from './init/init';
import build from './build/build';
import serve from './serve/serve'
import serveFile from './serve/servefile'

yargs(hideBin(process.argv))
    .scriptName('gl')
    .command('build', 'Builds the plugin', {}, () => {
        build()
            .then(() => {
                console.log('Build complete!')
                process.exit(0);
            })
            .catch(console.error)
    })
    .command('init', 'Creates a blank GL.config.js', {}, init)
    .command('serve', 'Serves the plugin to be tested in the browser', {
        manual: {
            alias: 'm',
            description: 'Only re-build the plugin when sending an input in the terminal'
        }
    }, serve)
    .command('servefile <file>', 'Serves a plugin from a file to be tested in the browser', (yargs) => {
        yargs.positional('file', {
            describe: 'The file to serve',
            type: 'string'
        })

        yargs.option('manual', {
            alias: 'm',
            description: 'Only re-build the plugin when sending an input in the terminal'
        })
    }, serveFile)
    .demandCommand(1)
    .help()
    .argv;