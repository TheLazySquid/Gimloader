import { rollup } from 'rollup';
import addHeadersPlugin from './addHeadersPlugin';
import getConfig from './getConfig';
import { Config } from '../types';

export default function build(): Promise<Config> {
    return new Promise(async (res, rej) => {
        getConfig()
        .then(async (config) => {
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
        })
        .catch(rej);
    })
}