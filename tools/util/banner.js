/*!
 * UniKorn (v1.1.1): tools/util/banner.js
 * Copyright (c) 2020 Adorade (https://adorade.ro)
 * Licensed under MIT (https://github.com/adorade/unikorn/blob/master/LICENSE)
 * ========================================================================== */

const pkg = require(`${process.cwd()}/package.json`);
const title = `${pkg.name.charAt(0).toUpperCase()}${pkg.name.slice(1,3)}${pkg.name.charAt(3).toUpperCase()}${pkg.name.slice(4)}`;

const year = new Date(
  process.env.SOURCE_DATE_EPOCH ? process.env.SOURCE_DATE_EPOCH * 1000 : new Date().getTime()
).getFullYear();

export function banner () {
  let result = '';

  try {
    result = [
      '/*!',
      ` * ${title} (v${pkg.version}): <%= file.relative %>`,
      ` * ${pkg.description}`,
      ` * Copyright (c) ${year} ${pkg.author} (${pkg.homepage})`,
      ` * License under ${pkg.license} (${pkg.repository}/blob/master/LICENSE)`,
      ' * ========================================================================== */',
      '' // new line
    ].join('\n');
  } catch (err) {
    console.error(err);
  }

  return result;
}
