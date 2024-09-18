import { rollup } from 'rollup';
import { addHeadersPlugin } from './addHeaders';
import { createEsbuildConfig, getConfig } from './getConfig';
import { Config } from '../types';
import esbuild from 'esbuild';

export default function build(): Promise<Config> {
    return new Promise(async (res, rej) => {
        getConfig()
        .then(async (config) => {
            if(config.bundler === "esbuild") {
                esbuild.build(createEsbuildConfig(config))
                    .then(() => res(config))
                    .catch(rej)
            } else {
                let plugins = config.plugins ?? [];
                plugins.push(addHeadersPlugin(config));
            
                // build the plugin
                const bundle = await rollup({
                    input: config.input,
                    plugins,
                    ...config.rollupOptions
                });
            
                await bundle.write({
                    file: `build/${config.name}.js`,
                    format: 'esm',
                    ...config.outputOptions
                });

                res(config);
            }
        })
        .catch(rej);
    })
}