/*!
 * UniKorn (v4.0.0): banner.js
 * Copyright (c) 2018 - 2019 Adorade (https://adorade.ro)
 * Licensed under MIT (https://github.com/adorade/unikorn/blob/master/LICENSE)
 * ========================================================================== */

const pkg = require(`${process.cwd()}/package.json`);

const year = new Date(
  process.env.SOURCE_DATE_EPOCH ? process.env.SOURCE_DATE_EPOCH * 1000 : new Date().getTime()
).getFullYear();

function banner (pluginFilename) {
  const filename = pluginFilename ? `${pluginFilename}` : '';
  return `/*!
 * ${pkg.title} (v${pkg.version}): ${filename}
 * ${pkg.description}
 * Copyright (c) ${year} ${pkg.author} (${pkg.homepage})
 * License under ${pkg.license} (${pkg.repository}/blob/master/LICENSE)
 * ========================================================================== */`;
}

module.exports = banner;
