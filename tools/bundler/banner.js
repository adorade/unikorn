/*!
 * UniKorn (v1.0.0): tools/bundler/banner.js
 * Copyright (c) 2020 Adorade (https://adorade.ro)
 * Licensed under MIT (https://github.com/adorade/unikorn/blob/master/LICENSE)
 * ========================================================================== */

const pkg = require(`${process.cwd()}/package.json`);
const title = `${pkg.name.charAt(0).toUpperCase()}${pkg.name.slice(1,3)}${pkg.name.charAt(3).toUpperCase()}${pkg.name.slice(4)}`;

const year = new Date(
  process.env.SOURCE_DATE_EPOCH ? process.env.SOURCE_DATE_EPOCH * 1000 : new Date().getTime()
).getFullYear();

function banner (pluginFilename) {
  const filename = pluginFilename ? `${pluginFilename}` : '';
  return `/*!
 * ${title} (v${pkg.version}): ${filename}
 * ${pkg.description}
 * Copyright (c) ${year} ${pkg.author} (${pkg.homepage})
 * License under ${pkg.license} (${pkg.repository}/blob/master/LICENSE)
 * ========================================================================== */`;
}

module.exports = banner;
