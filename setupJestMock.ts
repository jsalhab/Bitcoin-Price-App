const obj = require('@svgdotjs/svg.js');
const SVG = (arg) => {
    return obj.SVG(arg)
};

Object.assign(SVG, obj);

(global as any).SVG = SVG;