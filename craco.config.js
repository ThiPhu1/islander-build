const CracoLessPlugin = require('craco-less');

module.exports = {
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: {
                            '@primary-color': '#3d3660',
                            '@checkbox-color': '#f09c74',
                            '@border-radius-base': '5px',
                            '@input-addon-bg': '#fff',
                            '@input-height-base': '48px',
                            '@input-height-lg': '48px',
                            '@btn-height-base': '48px',
                        },
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
};
