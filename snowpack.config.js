// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    lib: {
      url: '/lib',
    }
  },
  plugins: [
    /* ... */
  ],
  packageOptions: {
    source: 'local',
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /*out: './public/js/snowpack',*/
  },
};
