/* eslint-disable no-bitwise */
/* eslint-disable import/prefer-default-export */

// from https://stackoverflow.com/a/21648508/1720985
export const hexToRgbA = (hex) => {
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    let c = hex.substring(1).split('');
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = `0x${c.join('')}`;
    return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',')},0.5)`;
  }
  return false;
};
