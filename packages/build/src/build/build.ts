import type { Config } from '../types.js';
import { createEsbuildConfig, getConfig } from './getConfig.js';
import esbuild from 'esbuild';

export default function build(): Promise<Config> {
    return new Promise(async (res, rej) => {
        getConfig()
        .then(async (config) => {
            esbuild.build(createEsbuildConfig(config))
                .then(() => res(config))
                .catch(rej);
        })
        .catch(rej);
    })
}