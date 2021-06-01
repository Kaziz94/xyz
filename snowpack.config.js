module.exports = {
  mount: {
    lib: {
      url: '/lib',
    }
  },
  optimize: {
    bundle: true,
    minify: true,
    treeshake: true,
    entrypoints: ['./lib/mapp.mjs'],
  },
  packageOptions: {
    source: 'local',
  },
  buildOptions: {
    clean: false,
    out: './public/js',
  },
  devOptions: {
    open: 'none',
  }
}