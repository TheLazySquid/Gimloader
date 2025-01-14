import { createEsbuildConfig, getConfig } from './getConfig';
import { Config } from '../types';
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