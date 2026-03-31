/*!
 * SVG/attribute allowlists and URI sanitization approach derived from DOMPurify.
 * DOMPurify — MIT License, Copyright (c) 2015 Mario Heiderich
 * https://github.com/cure53/DOMPurify/blob/main/LICENSE
 */
const ALLOWED_SVG_TAGS = /* @__PURE__ */ new Set([
  "svg",
  "a",
  "altglyph",
  "altglyphdef",
  "altglyphitem",
  "animate",
  "animatecolor",
  "animatemotion",
  "animatetransform",
  "circle",
  "clippath",
  "defs",
  "desc",
  "ellipse",
  "feblend",
  "fecolormatrix",
  "fecomponenttransfer",
  "fecomposite",
  "feconvolvematrix",
  "fediffuselighting",
  "fedisplacementmap",
  "fedistantlight",
  "fedropshadow",
  "feflood",
  "fefunca",
  "fefuncb",
  "fefuncg",
  "fefuncr",
  "fegaussianblur",
  "feimage",
  "femerge",
  "femergenode",
  "femorphology",
  "feoffset",
  "fepointlight",
  "fespecularlighting",
  "fespotlight",
  "fetile",
  "feturbulence",
  "filter",
  "font",
  "foreignobject",
  "g",
  "glyph",
  "glyphref",
  "hkern",
  "image",
  "line",
  "lineargradient",
  "marker",
  "mask",
  "metadata",
  "mpath",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "radialgradient",
  "rect",
  "set",
  "stop",
  "style",
  "switch",
  "symbol",
  "text",
  "textpath",
  "title",
  "tref",
  "tspan",
  "use",
  "view",
  "vkern"
]);
const ALLOWED_HTML_TAGS = /* @__PURE__ */ new Set([
  "a",
  "b",
  "blockquote",
  "body",
  "br",
  "code",
  "del",
  "div",
  "em",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "i",
  "li",
  "mark",
  "ol",
  "p",
  "pre",
  "span",
  "strong",
  "s",
  "sub",
  "sup",
  "table",
  "tbody",
  "td",
  "th",
  "thead",
  "tr",
  "u",
  "ul"
]);
const BLOCKED_HTML_TAGS = /* @__PURE__ */ new Set([
  "script",
  "iframe",
  "object",
  "embed",
  "form",
  "input",
  "textarea",
  "select",
  "button",
  "link",
  "meta",
  "base",
  "img",
  // onerror vector
  "video",
  "audio",
  "source",
  "picture",
  "svg"
  // no nested SVG inside foreignObject
]);
const ALLOWED_SVG_ATTRS = /* @__PURE__ */ new Set([
  "accent-height",
  "accumulate",
  "additive",
  "alignment-baseline",
  "amplitude",
  "ascent",
  "attributename",
  "attributetype",
  "azimuth",
  "basefrequency",
  "baseline-shift",
  "begin",
  "bias",
  "by",
  "class",
  "clip",
  "clip-path",
  "clip-rule",
  "clippathunits",
  "color",
  "color-interpolation",
  "color-interpolation-filters",
  "color-profile",
  "color-rendering",
  "cx",
  "cy",
  "d",
  "diffuseconstant",
  "direction",
  "display",
  "divisor",
  "dominant-baseline",
  "dur",
  "dx",
  "dy",
  "edgemode",
  "elevation",
  "end",
  "exponent",
  "fill",
  "fill-opacity",
  "fill-rule",
  "filter",
  "filterunits",
  "flood-color",
  "flood-opacity",
  "font-family",
  "font-size",
  "font-size-adjust",
  "font-stretch",
  "font-style",
  "font-variant",
  "font-weight",
  "from",
  "fx",
  "fy",
  "g1",
  "g2",
  "glyph-name",
  "glyphref",
  "gradienttransform",
  "gradientunits",
  "height",
  "href",
  "id",
  "image-rendering",
  "in",
  "in2",
  "intercept",
  "k",
  "k1",
  "k2",
  "k3",
  "k4",
  "kerning",
  "kernelmatrix",
  "kernelunitlength",
  "keypoints",
  "keysplines",
  "keytimes",
  "lang",
  "lengthadjust",
  "letter-spacing",
  "lighting-color",
  "local",
  "marker-end",
  "marker-mid",
  "marker-start",
  "markerheight",
  "markerunits",
  "markerwidth",
  "mask",
  "mask-type",
  "maskcontentunits",
  "maskunits",
  "max",
  "media",
  "method",
  "min",
  "mode",
  "name",
  "numoctaves",
  "offset",
  "opacity",
  "operator",
  "order",
  "orient",
  "orientation",
  "origin",
  "overflow",
  "paint-order",
  "path",
  "pathlength",
  "patterncontentunits",
  "patterntransform",
  "patternunits",
  "pointer-events",
  "points",
  "preservealpha",
  "preserveaspectratio",
  "primitiveunits",
  "r",
  "radius",
  "refx",
  "refy",
  "repeatcount",
  "repeatdur",
  "requiredfeatures",
  "restart",
  "result",
  "role",
  "rotate",
  "rx",
  "ry",
  "scale",
  "seed",
  "shape-rendering",
  "slope",
  "specularconstant",
  "specularexponent",
  "spreadmethod",
  "startoffset",
  "stddeviation",
  "stitchtiles",
  "stop-color",
  "stop-opacity",
  "stroke",
  "stroke-dasharray",
  "stroke-dashoffset",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-miterlimit",
  "stroke-opacity",
  "stroke-width",
  "style",
  "surfacescale",
  "systemlanguage",
  "tabindex",
  "tablevalues",
  "targetx",
  "targety",
  "text-anchor",
  "text-decoration",
  "text-rendering",
  "textlength",
  "to",
  "transform",
  "transform-origin",
  "type",
  "u1",
  "u2",
  "unicode",
  "values",
  "version",
  "vert-adv-y",
  "vert-origin-x",
  "vert-origin-y",
  "viewbox",
  "visibility",
  "width",
  "word-spacing",
  "wrap",
  "writing-mode",
  "x",
  "x1",
  "x2",
  "xchannelselector",
  "xlink:href",
  "xml:id",
  "xml:space",
  "xlink:title",
  "xmlns",
  "xmlns:xlink",
  "y",
  "y1",
  "y2",
  "z",
  "zoomandpan"
]);
const ALLOWED_HTML_ATTRS = /* @__PURE__ */ new Set([
  "class",
  "dir",
  "href",
  // only on <a>
  "id",
  "lang",
  "role",
  "style",
  "tabindex",
  "title"
]);
const DATA_ATTR_PATTERN = /^data-/;
const ARIA_ATTR_PATTERN = /^aria-/;
const INVISIBLE_WHITESPACE = /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g;
const SAFE_LINK_PROTOCOLS = /^(?:https?:|mailto:)/i;
const DATA_URI = /^data:/i;
const RASTER_DATA_URI = /^data:image\/(?:png|jpeg|jpg|gif|webp|avif|bmp|tiff|x-icon|vnd\.microsoft\.icon)[;,]/i;
const SVG_DATA_URI = /^data:image\/svg\+xml[;,]/i;
const FRAGMENT_REF = /^#/;
function decodeCssEscapes(css) {
  return css.replace(/\\([0-9a-fA-F]{1,6})\s?|\\([^\n])/g, (_, hex, literal) => {
    if (hex) {
      const codePoint = parseInt(hex, 16);
      if (codePoint > 1114111 || codePoint === 0) return "�";
      return String.fromCodePoint(codePoint);
    }
    return literal;
  });
}
const SAFE_CSS_DATA_MIME = /^data:(?:image\/(?:png|jpeg|jpg|gif|webp|avif)|font\/(?:woff2?|opentype|truetype|sfnt)|application\/(?:x-font-woff|font-woff2?|x-font-ttf|x-font-opentype|font-sfnt))[;,]/i;
function sanitizeCssValue(css) {
  let decoded = decodeCssEscapes(css);
  decoded = decoded.replace(
    /@import\s+(?:url\s*\([^)]*\)|"[^"]*"|'[^']*')[^;]*;?|@import\b[^;]*;?/gi,
    ""
  );
  decoded = decoded.replace(/expression\s*\([^)]*\)/gi, "");
  decoded = decoded.replace(/-moz-binding\s*:[^;]*/gi, "");
  decoded = decoded.replace(/behavior\s*:[^;]*/gi, "");
  decoded = decoded.replace(/url\s*\(\s*(['"]?)(.*?)\1\s*\)/gis, (match, _quote, uri) => {
    const stripped = uri.replace(INVISIBLE_WHITESPACE, "");
    if (SAFE_CSS_DATA_MIME.test(stripped) || FRAGMENT_REF.test(stripped)) {
      return match;
    }
    return "";
  });
  return decoded;
}
function sanitizeStyleElement(textContent) {
  return sanitizeCssValue(textContent);
}
const ANIMATION_TAGS = /* @__PURE__ */ new Set(["animate", "set", "animatecolor", "animatetransform"]);
const DANGEROUS_ANIMATION_TARGETS = /^(?:href|xlink:href|on)/i;
function isAnimationDangerous(el) {
  const attrName = el.getAttribute("attributeName");
  if (!attrName) return false;
  return DANGEROUS_ANIMATION_TARGETS.test(attrName.replace(INVISIBLE_WHITESPACE, ""));
}
const EVENT_HANDLER_PATTERN = /^on/i;
const URL_BEARING_SVG_ATTRS = /* @__PURE__ */ new Set([
  "clip-path",
  "cursor",
  "fill",
  "filter",
  "marker-end",
  "marker-mid",
  "marker-start",
  "mask",
  "stroke"
]);
const MAX_EMBED_DEPTH = 10;
function decodeDataUri(value) {
  const base64Idx = value.search(/;base64,/i);
  if (base64Idx >= 0) {
    const base64 = value.slice(base64Idx + 8);
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }
  const commaIdx = value.indexOf(",");
  if (commaIdx < 0) return null;
  return decodeURIComponent(value.slice(commaIdx + 1));
}
function encodeAsSvgDataUri(svgText) {
  const bytes = new TextEncoder().encode(svgText);
  const binaryStr = Array.from(bytes, (b) => String.fromCharCode(b)).join("");
  return "data:image/svg+xml;base64," + btoa(binaryStr);
}
function sanitizeEmbeddedSvgDataUri(value, depth) {
  if (depth >= MAX_EMBED_DEPTH) {
    console.warn(`Embedded SVG data URI recursion depth limit (${MAX_EMBED_DEPTH}) reached`);
    return null;
  }
  let svgText;
  try {
    const decoded = decodeDataUri(value);
    if (decoded === null) return null;
    svgText = decoded;
  } catch {
    return null;
  }
  const sanitized = sanitizeSvgInner(svgText, depth + 1);
  if (!sanitized) return null;
  return encodeAsSvgDataUri(sanitized);
}
function sanitizeUri(el, attrName, value, depth) {
  const stripped = value.replace(INVISIBLE_WHITESPACE, "");
  const tagName = el.tagName.toLowerCase();
  if (tagName === "image" || tagName === "feimage") {
    if (RASTER_DATA_URI.test(stripped)) return value;
    if (SVG_DATA_URI.test(stripped)) return sanitizeEmbeddedSvgDataUri(stripped, depth);
    return null;
  }
  if (tagName === "use") {
    if (FRAGMENT_REF.test(stripped)) return value;
    return null;
  }
  if (tagName === "a") {
    if (SAFE_LINK_PROTOCOLS.test(stripped)) return value;
    return null;
  }
  if (DATA_URI.test(stripped) || FRAGMENT_REF.test(stripped)) return value;
  return null;
}
function sanitizeSvgAttributes(el, depth) {
  for (let i = el.attributes.length - 1; i >= 0; i--) {
    const attr = el.attributes[i];
    const name = attr.name.toLowerCase();
    const normalized = name.replace(INVISIBLE_WHITESPACE, "");
    if (EVENT_HANDLER_PATTERN.test(normalized)) {
      el.removeAttribute(attr.name);
      continue;
    }
    if (DATA_ATTR_PATTERN.test(name) || ARIA_ATTR_PATTERN.test(name)) {
      continue;
    }
    if (!ALLOWED_SVG_ATTRS.has(name)) {
      el.removeAttribute(attr.name);
      continue;
    }
    if (name === "href" || name === "xlink:href") {
      const sanitized = sanitizeUri(el, name, attr.value, depth);
      if (sanitized === null) {
        el.removeAttribute(attr.name);
      } else if (sanitized !== attr.value) {
        attr.value = sanitized;
      }
      continue;
    }
    if (name === "style") {
      attr.value = sanitizeCssValue(attr.value);
      continue;
    }
    if (URL_BEARING_SVG_ATTRS.has(name) && /url\s*\(/i.test(attr.value)) {
      attr.value = sanitizeCssValue(attr.value);
    }
  }
}
function sanitizeHtmlAttributes(el) {
  const tagName = el.tagName.toLowerCase();
  for (let i = el.attributes.length - 1; i >= 0; i--) {
    const attr = el.attributes[i];
    const name = attr.name.toLowerCase();
    const normalized = name.replace(INVISIBLE_WHITESPACE, "");
    if (EVENT_HANDLER_PATTERN.test(normalized)) {
      el.removeAttribute(attr.name);
      continue;
    }
    if (DATA_ATTR_PATTERN.test(name) || ARIA_ATTR_PATTERN.test(name)) {
      continue;
    }
    if (!ALLOWED_HTML_ATTRS.has(name)) {
      el.removeAttribute(attr.name);
      continue;
    }
    if (name === "href") {
      if (tagName !== "a") {
        el.removeAttribute(attr.name);
        continue;
      }
      const stripped = attr.value.replace(INVISIBLE_WHITESPACE, "");
      if (!SAFE_LINK_PROTOCOLS.test(stripped)) {
        el.removeAttribute(attr.name);
      }
      continue;
    }
    if (name === "style") {
      attr.value = sanitizeCssValue(attr.value);
    }
  }
}
function sanitizeNode(node, mode, depth) {
  for (let i = node.children.length - 1; i >= 0; i--) {
    const child = node.children[i];
    const tag = child.tagName.toLowerCase();
    if (mode === "svg") {
      if (tag === "foreignobject") {
        sanitizeSvgAttributes(child, depth);
        sanitizeNode(child, "html", depth);
      } else if (tag === "style") {
        sanitizeSvgAttributes(child, depth);
        if (child.textContent) {
          child.textContent = sanitizeStyleElement(child.textContent);
        }
      } else if (ANIMATION_TAGS.has(tag) && isAnimationDangerous(child)) {
        child.remove();
      } else if (ALLOWED_SVG_TAGS.has(tag)) {
        sanitizeSvgAttributes(child, depth);
        sanitizeNode(child, "svg", depth);
      } else {
        child.remove();
      }
    } else {
      if (BLOCKED_HTML_TAGS.has(tag)) {
        child.remove();
      } else if (ALLOWED_HTML_TAGS.has(tag)) {
        sanitizeHtmlAttributes(child);
        sanitizeNode(child, "html", depth);
      } else {
        child.remove();
      }
    }
  }
}
function sanitizeSvgInner(svgText, depth) {
  const doc = new DOMParser().parseFromString(svgText, "image/svg+xml");
  const parseError = doc.querySelector("parsererror");
  if (parseError) return "";
  const svg = doc.documentElement;
  if (svg.tagName.toLowerCase() !== "svg") return "";
  sanitizeSvgAttributes(svg, depth);
  sanitizeNode(svg, "svg", depth);
  if (svg.children.length === 0) return "";
  return new XMLSerializer().serializeToString(svg);
}
function sanitizeSvg(svgText) {
  return sanitizeSvgInner(svgText, 0);
}
export {
  sanitizeSvg
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FuaXRpemVTdmcuanMiLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy90bGRyYXcvZGlzdC1lc20vbGliL3V0aWxzL3N2Zy9zYW5pdGl6ZVN2Zy5tanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohXG4gKiBTVkcvYXR0cmlidXRlIGFsbG93bGlzdHMgYW5kIFVSSSBzYW5pdGl6YXRpb24gYXBwcm9hY2ggZGVyaXZlZCBmcm9tIERPTVB1cmlmeS5cbiAqIERPTVB1cmlmeSDigJQgTUlUIExpY2Vuc2UsIENvcHlyaWdodCAoYykgMjAxNSBNYXJpbyBIZWlkZXJpY2hcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9jdXJlNTMvRE9NUHVyaWZ5L2Jsb2IvbWFpbi9MSUNFTlNFXG4gKi9cbmNvbnN0IEFMTE9XRURfU1ZHX1RBR1MgPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldChbXG4gIFwic3ZnXCIsXG4gIFwiYVwiLFxuICBcImFsdGdseXBoXCIsXG4gIFwiYWx0Z2x5cGhkZWZcIixcbiAgXCJhbHRnbHlwaGl0ZW1cIixcbiAgXCJhbmltYXRlXCIsXG4gIFwiYW5pbWF0ZWNvbG9yXCIsXG4gIFwiYW5pbWF0ZW1vdGlvblwiLFxuICBcImFuaW1hdGV0cmFuc2Zvcm1cIixcbiAgXCJjaXJjbGVcIixcbiAgXCJjbGlwcGF0aFwiLFxuICBcImRlZnNcIixcbiAgXCJkZXNjXCIsXG4gIFwiZWxsaXBzZVwiLFxuICBcImZlYmxlbmRcIixcbiAgXCJmZWNvbG9ybWF0cml4XCIsXG4gIFwiZmVjb21wb25lbnR0cmFuc2ZlclwiLFxuICBcImZlY29tcG9zaXRlXCIsXG4gIFwiZmVjb252b2x2ZW1hdHJpeFwiLFxuICBcImZlZGlmZnVzZWxpZ2h0aW5nXCIsXG4gIFwiZmVkaXNwbGFjZW1lbnRtYXBcIixcbiAgXCJmZWRpc3RhbnRsaWdodFwiLFxuICBcImZlZHJvcHNoYWRvd1wiLFxuICBcImZlZmxvb2RcIixcbiAgXCJmZWZ1bmNhXCIsXG4gIFwiZmVmdW5jYlwiLFxuICBcImZlZnVuY2dcIixcbiAgXCJmZWZ1bmNyXCIsXG4gIFwiZmVnYXVzc2lhbmJsdXJcIixcbiAgXCJmZWltYWdlXCIsXG4gIFwiZmVtZXJnZVwiLFxuICBcImZlbWVyZ2Vub2RlXCIsXG4gIFwiZmVtb3JwaG9sb2d5XCIsXG4gIFwiZmVvZmZzZXRcIixcbiAgXCJmZXBvaW50bGlnaHRcIixcbiAgXCJmZXNwZWN1bGFybGlnaHRpbmdcIixcbiAgXCJmZXNwb3RsaWdodFwiLFxuICBcImZldGlsZVwiLFxuICBcImZldHVyYnVsZW5jZVwiLFxuICBcImZpbHRlclwiLFxuICBcImZvbnRcIixcbiAgXCJmb3JlaWdub2JqZWN0XCIsXG4gIFwiZ1wiLFxuICBcImdseXBoXCIsXG4gIFwiZ2x5cGhyZWZcIixcbiAgXCJoa2VyblwiLFxuICBcImltYWdlXCIsXG4gIFwibGluZVwiLFxuICBcImxpbmVhcmdyYWRpZW50XCIsXG4gIFwibWFya2VyXCIsXG4gIFwibWFza1wiLFxuICBcIm1ldGFkYXRhXCIsXG4gIFwibXBhdGhcIixcbiAgXCJwYXRoXCIsXG4gIFwicGF0dGVyblwiLFxuICBcInBvbHlnb25cIixcbiAgXCJwb2x5bGluZVwiLFxuICBcInJhZGlhbGdyYWRpZW50XCIsXG4gIFwicmVjdFwiLFxuICBcInNldFwiLFxuICBcInN0b3BcIixcbiAgXCJzdHlsZVwiLFxuICBcInN3aXRjaFwiLFxuICBcInN5bWJvbFwiLFxuICBcInRleHRcIixcbiAgXCJ0ZXh0cGF0aFwiLFxuICBcInRpdGxlXCIsXG4gIFwidHJlZlwiLFxuICBcInRzcGFuXCIsXG4gIFwidXNlXCIsXG4gIFwidmlld1wiLFxuICBcInZrZXJuXCJcbl0pO1xuY29uc3QgQUxMT1dFRF9IVE1MX1RBR1MgPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldChbXG4gIFwiYVwiLFxuICBcImJcIixcbiAgXCJibG9ja3F1b3RlXCIsXG4gIFwiYm9keVwiLFxuICBcImJyXCIsXG4gIFwiY29kZVwiLFxuICBcImRlbFwiLFxuICBcImRpdlwiLFxuICBcImVtXCIsXG4gIFwiaDFcIixcbiAgXCJoMlwiLFxuICBcImgzXCIsXG4gIFwiaDRcIixcbiAgXCJoNVwiLFxuICBcImg2XCIsXG4gIFwiaVwiLFxuICBcImxpXCIsXG4gIFwibWFya1wiLFxuICBcIm9sXCIsXG4gIFwicFwiLFxuICBcInByZVwiLFxuICBcInNwYW5cIixcbiAgXCJzdHJvbmdcIixcbiAgXCJzXCIsXG4gIFwic3ViXCIsXG4gIFwic3VwXCIsXG4gIFwidGFibGVcIixcbiAgXCJ0Ym9keVwiLFxuICBcInRkXCIsXG4gIFwidGhcIixcbiAgXCJ0aGVhZFwiLFxuICBcInRyXCIsXG4gIFwidVwiLFxuICBcInVsXCJcbl0pO1xuY29uc3QgQkxPQ0tFRF9IVE1MX1RBR1MgPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldChbXG4gIFwic2NyaXB0XCIsXG4gIFwiaWZyYW1lXCIsXG4gIFwib2JqZWN0XCIsXG4gIFwiZW1iZWRcIixcbiAgXCJmb3JtXCIsXG4gIFwiaW5wdXRcIixcbiAgXCJ0ZXh0YXJlYVwiLFxuICBcInNlbGVjdFwiLFxuICBcImJ1dHRvblwiLFxuICBcImxpbmtcIixcbiAgXCJtZXRhXCIsXG4gIFwiYmFzZVwiLFxuICBcImltZ1wiLFxuICAvLyBvbmVycm9yIHZlY3RvclxuICBcInZpZGVvXCIsXG4gIFwiYXVkaW9cIixcbiAgXCJzb3VyY2VcIixcbiAgXCJwaWN0dXJlXCIsXG4gIFwic3ZnXCJcbiAgLy8gbm8gbmVzdGVkIFNWRyBpbnNpZGUgZm9yZWlnbk9iamVjdFxuXSk7XG5jb25zdCBBTExPV0VEX1NWR19BVFRSUyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KFtcbiAgXCJhY2NlbnQtaGVpZ2h0XCIsXG4gIFwiYWNjdW11bGF0ZVwiLFxuICBcImFkZGl0aXZlXCIsXG4gIFwiYWxpZ25tZW50LWJhc2VsaW5lXCIsXG4gIFwiYW1wbGl0dWRlXCIsXG4gIFwiYXNjZW50XCIsXG4gIFwiYXR0cmlidXRlbmFtZVwiLFxuICBcImF0dHJpYnV0ZXR5cGVcIixcbiAgXCJhemltdXRoXCIsXG4gIFwiYmFzZWZyZXF1ZW5jeVwiLFxuICBcImJhc2VsaW5lLXNoaWZ0XCIsXG4gIFwiYmVnaW5cIixcbiAgXCJiaWFzXCIsXG4gIFwiYnlcIixcbiAgXCJjbGFzc1wiLFxuICBcImNsaXBcIixcbiAgXCJjbGlwLXBhdGhcIixcbiAgXCJjbGlwLXJ1bGVcIixcbiAgXCJjbGlwcGF0aHVuaXRzXCIsXG4gIFwiY29sb3JcIixcbiAgXCJjb2xvci1pbnRlcnBvbGF0aW9uXCIsXG4gIFwiY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzXCIsXG4gIFwiY29sb3ItcHJvZmlsZVwiLFxuICBcImNvbG9yLXJlbmRlcmluZ1wiLFxuICBcImN4XCIsXG4gIFwiY3lcIixcbiAgXCJkXCIsXG4gIFwiZGlmZnVzZWNvbnN0YW50XCIsXG4gIFwiZGlyZWN0aW9uXCIsXG4gIFwiZGlzcGxheVwiLFxuICBcImRpdmlzb3JcIixcbiAgXCJkb21pbmFudC1iYXNlbGluZVwiLFxuICBcImR1clwiLFxuICBcImR4XCIsXG4gIFwiZHlcIixcbiAgXCJlZGdlbW9kZVwiLFxuICBcImVsZXZhdGlvblwiLFxuICBcImVuZFwiLFxuICBcImV4cG9uZW50XCIsXG4gIFwiZmlsbFwiLFxuICBcImZpbGwtb3BhY2l0eVwiLFxuICBcImZpbGwtcnVsZVwiLFxuICBcImZpbHRlclwiLFxuICBcImZpbHRlcnVuaXRzXCIsXG4gIFwiZmxvb2QtY29sb3JcIixcbiAgXCJmbG9vZC1vcGFjaXR5XCIsXG4gIFwiZm9udC1mYW1pbHlcIixcbiAgXCJmb250LXNpemVcIixcbiAgXCJmb250LXNpemUtYWRqdXN0XCIsXG4gIFwiZm9udC1zdHJldGNoXCIsXG4gIFwiZm9udC1zdHlsZVwiLFxuICBcImZvbnQtdmFyaWFudFwiLFxuICBcImZvbnQtd2VpZ2h0XCIsXG4gIFwiZnJvbVwiLFxuICBcImZ4XCIsXG4gIFwiZnlcIixcbiAgXCJnMVwiLFxuICBcImcyXCIsXG4gIFwiZ2x5cGgtbmFtZVwiLFxuICBcImdseXBocmVmXCIsXG4gIFwiZ3JhZGllbnR0cmFuc2Zvcm1cIixcbiAgXCJncmFkaWVudHVuaXRzXCIsXG4gIFwiaGVpZ2h0XCIsXG4gIFwiaHJlZlwiLFxuICBcImlkXCIsXG4gIFwiaW1hZ2UtcmVuZGVyaW5nXCIsXG4gIFwiaW5cIixcbiAgXCJpbjJcIixcbiAgXCJpbnRlcmNlcHRcIixcbiAgXCJrXCIsXG4gIFwiazFcIixcbiAgXCJrMlwiLFxuICBcImszXCIsXG4gIFwiazRcIixcbiAgXCJrZXJuaW5nXCIsXG4gIFwia2VybmVsbWF0cml4XCIsXG4gIFwia2VybmVsdW5pdGxlbmd0aFwiLFxuICBcImtleXBvaW50c1wiLFxuICBcImtleXNwbGluZXNcIixcbiAgXCJrZXl0aW1lc1wiLFxuICBcImxhbmdcIixcbiAgXCJsZW5ndGhhZGp1c3RcIixcbiAgXCJsZXR0ZXItc3BhY2luZ1wiLFxuICBcImxpZ2h0aW5nLWNvbG9yXCIsXG4gIFwibG9jYWxcIixcbiAgXCJtYXJrZXItZW5kXCIsXG4gIFwibWFya2VyLW1pZFwiLFxuICBcIm1hcmtlci1zdGFydFwiLFxuICBcIm1hcmtlcmhlaWdodFwiLFxuICBcIm1hcmtlcnVuaXRzXCIsXG4gIFwibWFya2Vyd2lkdGhcIixcbiAgXCJtYXNrXCIsXG4gIFwibWFzay10eXBlXCIsXG4gIFwibWFza2NvbnRlbnR1bml0c1wiLFxuICBcIm1hc2t1bml0c1wiLFxuICBcIm1heFwiLFxuICBcIm1lZGlhXCIsXG4gIFwibWV0aG9kXCIsXG4gIFwibWluXCIsXG4gIFwibW9kZVwiLFxuICBcIm5hbWVcIixcbiAgXCJudW1vY3RhdmVzXCIsXG4gIFwib2Zmc2V0XCIsXG4gIFwib3BhY2l0eVwiLFxuICBcIm9wZXJhdG9yXCIsXG4gIFwib3JkZXJcIixcbiAgXCJvcmllbnRcIixcbiAgXCJvcmllbnRhdGlvblwiLFxuICBcIm9yaWdpblwiLFxuICBcIm92ZXJmbG93XCIsXG4gIFwicGFpbnQtb3JkZXJcIixcbiAgXCJwYXRoXCIsXG4gIFwicGF0aGxlbmd0aFwiLFxuICBcInBhdHRlcm5jb250ZW50dW5pdHNcIixcbiAgXCJwYXR0ZXJudHJhbnNmb3JtXCIsXG4gIFwicGF0dGVybnVuaXRzXCIsXG4gIFwicG9pbnRlci1ldmVudHNcIixcbiAgXCJwb2ludHNcIixcbiAgXCJwcmVzZXJ2ZWFscGhhXCIsXG4gIFwicHJlc2VydmVhc3BlY3RyYXRpb1wiLFxuICBcInByaW1pdGl2ZXVuaXRzXCIsXG4gIFwiclwiLFxuICBcInJhZGl1c1wiLFxuICBcInJlZnhcIixcbiAgXCJyZWZ5XCIsXG4gIFwicmVwZWF0Y291bnRcIixcbiAgXCJyZXBlYXRkdXJcIixcbiAgXCJyZXF1aXJlZGZlYXR1cmVzXCIsXG4gIFwicmVzdGFydFwiLFxuICBcInJlc3VsdFwiLFxuICBcInJvbGVcIixcbiAgXCJyb3RhdGVcIixcbiAgXCJyeFwiLFxuICBcInJ5XCIsXG4gIFwic2NhbGVcIixcbiAgXCJzZWVkXCIsXG4gIFwic2hhcGUtcmVuZGVyaW5nXCIsXG4gIFwic2xvcGVcIixcbiAgXCJzcGVjdWxhcmNvbnN0YW50XCIsXG4gIFwic3BlY3VsYXJleHBvbmVudFwiLFxuICBcInNwcmVhZG1ldGhvZFwiLFxuICBcInN0YXJ0b2Zmc2V0XCIsXG4gIFwic3RkZGV2aWF0aW9uXCIsXG4gIFwic3RpdGNodGlsZXNcIixcbiAgXCJzdG9wLWNvbG9yXCIsXG4gIFwic3RvcC1vcGFjaXR5XCIsXG4gIFwic3Ryb2tlXCIsXG4gIFwic3Ryb2tlLWRhc2hhcnJheVwiLFxuICBcInN0cm9rZS1kYXNob2Zmc2V0XCIsXG4gIFwic3Ryb2tlLWxpbmVjYXBcIixcbiAgXCJzdHJva2UtbGluZWpvaW5cIixcbiAgXCJzdHJva2UtbWl0ZXJsaW1pdFwiLFxuICBcInN0cm9rZS1vcGFjaXR5XCIsXG4gIFwic3Ryb2tlLXdpZHRoXCIsXG4gIFwic3R5bGVcIixcbiAgXCJzdXJmYWNlc2NhbGVcIixcbiAgXCJzeXN0ZW1sYW5ndWFnZVwiLFxuICBcInRhYmluZGV4XCIsXG4gIFwidGFibGV2YWx1ZXNcIixcbiAgXCJ0YXJnZXR4XCIsXG4gIFwidGFyZ2V0eVwiLFxuICBcInRleHQtYW5jaG9yXCIsXG4gIFwidGV4dC1kZWNvcmF0aW9uXCIsXG4gIFwidGV4dC1yZW5kZXJpbmdcIixcbiAgXCJ0ZXh0bGVuZ3RoXCIsXG4gIFwidG9cIixcbiAgXCJ0cmFuc2Zvcm1cIixcbiAgXCJ0cmFuc2Zvcm0tb3JpZ2luXCIsXG4gIFwidHlwZVwiLFxuICBcInUxXCIsXG4gIFwidTJcIixcbiAgXCJ1bmljb2RlXCIsXG4gIFwidmFsdWVzXCIsXG4gIFwidmVyc2lvblwiLFxuICBcInZlcnQtYWR2LXlcIixcbiAgXCJ2ZXJ0LW9yaWdpbi14XCIsXG4gIFwidmVydC1vcmlnaW4teVwiLFxuICBcInZpZXdib3hcIixcbiAgXCJ2aXNpYmlsaXR5XCIsXG4gIFwid2lkdGhcIixcbiAgXCJ3b3JkLXNwYWNpbmdcIixcbiAgXCJ3cmFwXCIsXG4gIFwid3JpdGluZy1tb2RlXCIsXG4gIFwieFwiLFxuICBcIngxXCIsXG4gIFwieDJcIixcbiAgXCJ4Y2hhbm5lbHNlbGVjdG9yXCIsXG4gIFwieGxpbms6aHJlZlwiLFxuICBcInhtbDppZFwiLFxuICBcInhtbDpzcGFjZVwiLFxuICBcInhsaW5rOnRpdGxlXCIsXG4gIFwieG1sbnNcIixcbiAgXCJ4bWxuczp4bGlua1wiLFxuICBcInlcIixcbiAgXCJ5MVwiLFxuICBcInkyXCIsXG4gIFwielwiLFxuICBcInpvb21hbmRwYW5cIlxuXSk7XG5jb25zdCBBTExPV0VEX0hUTUxfQVRUUlMgPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldChbXG4gIFwiY2xhc3NcIixcbiAgXCJkaXJcIixcbiAgXCJocmVmXCIsXG4gIC8vIG9ubHkgb24gPGE+XG4gIFwiaWRcIixcbiAgXCJsYW5nXCIsXG4gIFwicm9sZVwiLFxuICBcInN0eWxlXCIsXG4gIFwidGFiaW5kZXhcIixcbiAgXCJ0aXRsZVwiXG5dKTtcbmNvbnN0IERBVEFfQVRUUl9QQVRURVJOID0gL15kYXRhLS87XG5jb25zdCBBUklBX0FUVFJfUEFUVEVSTiA9IC9eYXJpYS0vO1xuY29uc3QgSU5WSVNJQkxFX1dISVRFU1BBQ0UgPSAvW1xcdTAwMDAtXFx1MDAyMFxcdTAwQTBcXHUxNjgwXFx1MTgwRVxcdTIwMDAtXFx1MjAyOVxcdTIwNUZcXHUzMDAwXS9nO1xuY29uc3QgU0FGRV9MSU5LX1BST1RPQ09MUyA9IC9eKD86aHR0cHM/OnxtYWlsdG86KS9pO1xuY29uc3QgREFUQV9VUkkgPSAvXmRhdGE6L2k7XG5jb25zdCBSQVNURVJfREFUQV9VUkkgPSAvXmRhdGE6aW1hZ2VcXC8oPzpwbmd8anBlZ3xqcGd8Z2lmfHdlYnB8YXZpZnxibXB8dGlmZnx4LWljb258dm5kXFwubWljcm9zb2Z0XFwuaWNvbilbOyxdL2k7XG5jb25zdCBTVkdfREFUQV9VUkkgPSAvXmRhdGE6aW1hZ2VcXC9zdmdcXCt4bWxbOyxdL2k7XG5jb25zdCBGUkFHTUVOVF9SRUYgPSAvXiMvO1xuZnVuY3Rpb24gZGVjb2RlQ3NzRXNjYXBlcyhjc3MpIHtcbiAgcmV0dXJuIGNzcy5yZXBsYWNlKC9cXFxcKFswLTlhLWZBLUZdezEsNn0pXFxzP3xcXFxcKFteXFxuXSkvZywgKF8sIGhleCwgbGl0ZXJhbCkgPT4ge1xuICAgIGlmIChoZXgpIHtcbiAgICAgIGNvbnN0IGNvZGVQb2ludCA9IHBhcnNlSW50KGhleCwgMTYpO1xuICAgICAgaWYgKGNvZGVQb2ludCA+IDExMTQxMTEgfHwgY29kZVBvaW50ID09PSAwKSByZXR1cm4gXCJcXHVGRkZEXCI7XG4gICAgICByZXR1cm4gU3RyaW5nLmZyb21Db2RlUG9pbnQoY29kZVBvaW50KTtcbiAgICB9XG4gICAgcmV0dXJuIGxpdGVyYWw7XG4gIH0pO1xufVxuY29uc3QgU0FGRV9DU1NfREFUQV9NSU1FID0gL15kYXRhOig/OmltYWdlXFwvKD86cG5nfGpwZWd8anBnfGdpZnx3ZWJwfGF2aWYpfGZvbnRcXC8oPzp3b2ZmMj98b3BlbnR5cGV8dHJ1ZXR5cGV8c2ZudCl8YXBwbGljYXRpb25cXC8oPzp4LWZvbnQtd29mZnxmb250LXdvZmYyP3x4LWZvbnQtdHRmfHgtZm9udC1vcGVudHlwZXxmb250LXNmbnQpKVs7LF0vaTtcbmZ1bmN0aW9uIHNhbml0aXplQ3NzVmFsdWUoY3NzKSB7XG4gIGxldCBkZWNvZGVkID0gZGVjb2RlQ3NzRXNjYXBlcyhjc3MpO1xuICBkZWNvZGVkID0gZGVjb2RlZC5yZXBsYWNlKFxuICAgIC9AaW1wb3J0XFxzKyg/OnVybFxccypcXChbXildKlxcKXxcIlteXCJdKlwifCdbXiddKicpW147XSo7P3xAaW1wb3J0XFxiW147XSo7Py9naSxcbiAgICBcIlwiXG4gICk7XG4gIGRlY29kZWQgPSBkZWNvZGVkLnJlcGxhY2UoL2V4cHJlc3Npb25cXHMqXFwoW14pXSpcXCkvZ2ksIFwiXCIpO1xuICBkZWNvZGVkID0gZGVjb2RlZC5yZXBsYWNlKC8tbW96LWJpbmRpbmdcXHMqOlteO10qL2dpLCBcIlwiKTtcbiAgZGVjb2RlZCA9IGRlY29kZWQucmVwbGFjZSgvYmVoYXZpb3JcXHMqOlteO10qL2dpLCBcIlwiKTtcbiAgZGVjb2RlZCA9IGRlY29kZWQucmVwbGFjZSgvdXJsXFxzKlxcKFxccyooWydcIl0/KSguKj8pXFwxXFxzKlxcKS9naXMsIChtYXRjaCwgX3F1b3RlLCB1cmkpID0+IHtcbiAgICBjb25zdCBzdHJpcHBlZCA9IHVyaS5yZXBsYWNlKElOVklTSUJMRV9XSElURVNQQUNFLCBcIlwiKTtcbiAgICBpZiAoU0FGRV9DU1NfREFUQV9NSU1FLnRlc3Qoc3RyaXBwZWQpIHx8IEZSQUdNRU5UX1JFRi50ZXN0KHN0cmlwcGVkKSkge1xuICAgICAgcmV0dXJuIG1hdGNoO1xuICAgIH1cbiAgICByZXR1cm4gXCJcIjtcbiAgfSk7XG4gIHJldHVybiBkZWNvZGVkO1xufVxuZnVuY3Rpb24gc2FuaXRpemVTdHlsZUVsZW1lbnQodGV4dENvbnRlbnQpIHtcbiAgcmV0dXJuIHNhbml0aXplQ3NzVmFsdWUodGV4dENvbnRlbnQpO1xufVxuY29uc3QgQU5JTUFUSU9OX1RBR1MgPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldChbXCJhbmltYXRlXCIsIFwic2V0XCIsIFwiYW5pbWF0ZWNvbG9yXCIsIFwiYW5pbWF0ZXRyYW5zZm9ybVwiXSk7XG5jb25zdCBEQU5HRVJPVVNfQU5JTUFUSU9OX1RBUkdFVFMgPSAvXig/OmhyZWZ8eGxpbms6aHJlZnxvbikvaTtcbmZ1bmN0aW9uIGlzQW5pbWF0aW9uRGFuZ2Vyb3VzKGVsKSB7XG4gIGNvbnN0IGF0dHJOYW1lID0gZWwuZ2V0QXR0cmlidXRlKFwiYXR0cmlidXRlTmFtZVwiKTtcbiAgaWYgKCFhdHRyTmFtZSkgcmV0dXJuIGZhbHNlO1xuICByZXR1cm4gREFOR0VST1VTX0FOSU1BVElPTl9UQVJHRVRTLnRlc3QoYXR0ck5hbWUucmVwbGFjZShJTlZJU0lCTEVfV0hJVEVTUEFDRSwgXCJcIikpO1xufVxuY29uc3QgRVZFTlRfSEFORExFUl9QQVRURVJOID0gL15vbi9pO1xuY29uc3QgVVJMX0JFQVJJTkdfU1ZHX0FUVFJTID0gLyogQF9fUFVSRV9fICovIG5ldyBTZXQoW1xuICBcImNsaXAtcGF0aFwiLFxuICBcImN1cnNvclwiLFxuICBcImZpbGxcIixcbiAgXCJmaWx0ZXJcIixcbiAgXCJtYXJrZXItZW5kXCIsXG4gIFwibWFya2VyLW1pZFwiLFxuICBcIm1hcmtlci1zdGFydFwiLFxuICBcIm1hc2tcIixcbiAgXCJzdHJva2VcIlxuXSk7XG5jb25zdCBNQVhfRU1CRURfREVQVEggPSAxMDtcbmZ1bmN0aW9uIGRlY29kZURhdGFVcmkodmFsdWUpIHtcbiAgY29uc3QgYmFzZTY0SWR4ID0gdmFsdWUuc2VhcmNoKC87YmFzZTY0LC9pKTtcbiAgaWYgKGJhc2U2NElkeCA+PSAwKSB7XG4gICAgY29uc3QgYmFzZTY0ID0gdmFsdWUuc2xpY2UoYmFzZTY0SWR4ICsgOCk7XG4gICAgY29uc3QgYnl0ZXMgPSBVaW50OEFycmF5LmZyb20oYXRvYihiYXNlNjQpLCAoYykgPT4gYy5jaGFyQ29kZUF0KDApKTtcbiAgICByZXR1cm4gbmV3IFRleHREZWNvZGVyKCkuZGVjb2RlKGJ5dGVzKTtcbiAgfVxuICBjb25zdCBjb21tYUlkeCA9IHZhbHVlLmluZGV4T2YoXCIsXCIpO1xuICBpZiAoY29tbWFJZHggPCAwKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudCh2YWx1ZS5zbGljZShjb21tYUlkeCArIDEpKTtcbn1cbmZ1bmN0aW9uIGVuY29kZUFzU3ZnRGF0YVVyaShzdmdUZXh0KSB7XG4gIGNvbnN0IGJ5dGVzID0gbmV3IFRleHRFbmNvZGVyKCkuZW5jb2RlKHN2Z1RleHQpO1xuICBjb25zdCBiaW5hcnlTdHIgPSBBcnJheS5mcm9tKGJ5dGVzLCAoYikgPT4gU3RyaW5nLmZyb21DaGFyQ29kZShiKSkuam9pbihcIlwiKTtcbiAgcmV0dXJuIFwiZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxcIiArIGJ0b2EoYmluYXJ5U3RyKTtcbn1cbmZ1bmN0aW9uIHNhbml0aXplRW1iZWRkZWRTdmdEYXRhVXJpKHZhbHVlLCBkZXB0aCkge1xuICBpZiAoZGVwdGggPj0gTUFYX0VNQkVEX0RFUFRIKSB7XG4gICAgY29uc29sZS53YXJuKGBFbWJlZGRlZCBTVkcgZGF0YSBVUkkgcmVjdXJzaW9uIGRlcHRoIGxpbWl0ICgke01BWF9FTUJFRF9ERVBUSH0pIHJlYWNoZWRgKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBsZXQgc3ZnVGV4dDtcbiAgdHJ5IHtcbiAgICBjb25zdCBkZWNvZGVkID0gZGVjb2RlRGF0YVVyaSh2YWx1ZSk7XG4gICAgaWYgKGRlY29kZWQgPT09IG51bGwpIHJldHVybiBudWxsO1xuICAgIHN2Z1RleHQgPSBkZWNvZGVkO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBjb25zdCBzYW5pdGl6ZWQgPSBzYW5pdGl6ZVN2Z0lubmVyKHN2Z1RleHQsIGRlcHRoICsgMSk7XG4gIGlmICghc2FuaXRpemVkKSByZXR1cm4gbnVsbDtcbiAgcmV0dXJuIGVuY29kZUFzU3ZnRGF0YVVyaShzYW5pdGl6ZWQpO1xufVxuZnVuY3Rpb24gc2FuaXRpemVVcmkoZWwsIGF0dHJOYW1lLCB2YWx1ZSwgZGVwdGgpIHtcbiAgY29uc3Qgc3RyaXBwZWQgPSB2YWx1ZS5yZXBsYWNlKElOVklTSUJMRV9XSElURVNQQUNFLCBcIlwiKTtcbiAgY29uc3QgdGFnTmFtZSA9IGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcbiAgaWYgKHRhZ05hbWUgPT09IFwiaW1hZ2VcIiB8fCB0YWdOYW1lID09PSBcImZlaW1hZ2VcIikge1xuICAgIGlmIChSQVNURVJfREFUQV9VUkkudGVzdChzdHJpcHBlZCkpIHJldHVybiB2YWx1ZTtcbiAgICBpZiAoU1ZHX0RBVEFfVVJJLnRlc3Qoc3RyaXBwZWQpKSByZXR1cm4gc2FuaXRpemVFbWJlZGRlZFN2Z0RhdGFVcmkoc3RyaXBwZWQsIGRlcHRoKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBpZiAodGFnTmFtZSA9PT0gXCJ1c2VcIikge1xuICAgIGlmIChGUkFHTUVOVF9SRUYudGVzdChzdHJpcHBlZCkpIHJldHVybiB2YWx1ZTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBpZiAodGFnTmFtZSA9PT0gXCJhXCIpIHtcbiAgICBpZiAoU0FGRV9MSU5LX1BST1RPQ09MUy50ZXN0KHN0cmlwcGVkKSkgcmV0dXJuIHZhbHVlO1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGlmIChEQVRBX1VSSS50ZXN0KHN0cmlwcGVkKSB8fCBGUkFHTUVOVF9SRUYudGVzdChzdHJpcHBlZCkpIHJldHVybiB2YWx1ZTtcbiAgcmV0dXJuIG51bGw7XG59XG5mdW5jdGlvbiBzYW5pdGl6ZVN2Z0F0dHJpYnV0ZXMoZWwsIGRlcHRoKSB7XG4gIGZvciAobGV0IGkgPSBlbC5hdHRyaWJ1dGVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgY29uc3QgYXR0ciA9IGVsLmF0dHJpYnV0ZXNbaV07XG4gICAgY29uc3QgbmFtZSA9IGF0dHIubmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIGNvbnN0IG5vcm1hbGl6ZWQgPSBuYW1lLnJlcGxhY2UoSU5WSVNJQkxFX1dISVRFU1BBQ0UsIFwiXCIpO1xuICAgIGlmIChFVkVOVF9IQU5ETEVSX1BBVFRFUk4udGVzdChub3JtYWxpemVkKSkge1xuICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKGF0dHIubmFtZSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgaWYgKERBVEFfQVRUUl9QQVRURVJOLnRlc3QobmFtZSkgfHwgQVJJQV9BVFRSX1BBVFRFUk4udGVzdChuYW1lKSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmICghQUxMT1dFRF9TVkdfQVRUUlMuaGFzKG5hbWUpKSB7XG4gICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoYXR0ci5uYW1lKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAobmFtZSA9PT0gXCJocmVmXCIgfHwgbmFtZSA9PT0gXCJ4bGluazpocmVmXCIpIHtcbiAgICAgIGNvbnN0IHNhbml0aXplZCA9IHNhbml0aXplVXJpKGVsLCBuYW1lLCBhdHRyLnZhbHVlLCBkZXB0aCk7XG4gICAgICBpZiAoc2FuaXRpemVkID09PSBudWxsKSB7XG4gICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShhdHRyLm5hbWUpO1xuICAgICAgfSBlbHNlIGlmIChzYW5pdGl6ZWQgIT09IGF0dHIudmFsdWUpIHtcbiAgICAgICAgYXR0ci52YWx1ZSA9IHNhbml0aXplZDtcbiAgICAgIH1cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAobmFtZSA9PT0gXCJzdHlsZVwiKSB7XG4gICAgICBhdHRyLnZhbHVlID0gc2FuaXRpemVDc3NWYWx1ZShhdHRyLnZhbHVlKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAoVVJMX0JFQVJJTkdfU1ZHX0FUVFJTLmhhcyhuYW1lKSAmJiAvdXJsXFxzKlxcKC9pLnRlc3QoYXR0ci52YWx1ZSkpIHtcbiAgICAgIGF0dHIudmFsdWUgPSBzYW5pdGl6ZUNzc1ZhbHVlKGF0dHIudmFsdWUpO1xuICAgIH1cbiAgfVxufVxuZnVuY3Rpb24gc2FuaXRpemVIdG1sQXR0cmlidXRlcyhlbCkge1xuICBjb25zdCB0YWdOYW1lID0gZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICBmb3IgKGxldCBpID0gZWwuYXR0cmlidXRlcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIGNvbnN0IGF0dHIgPSBlbC5hdHRyaWJ1dGVzW2ldO1xuICAgIGNvbnN0IG5hbWUgPSBhdHRyLm5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBub3JtYWxpemVkID0gbmFtZS5yZXBsYWNlKElOVklTSUJMRV9XSElURVNQQUNFLCBcIlwiKTtcbiAgICBpZiAoRVZFTlRfSEFORExFUl9QQVRURVJOLnRlc3Qobm9ybWFsaXplZCkpIHtcbiAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShhdHRyLm5hbWUpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmIChEQVRBX0FUVFJfUEFUVEVSTi50ZXN0KG5hbWUpIHx8IEFSSUFfQVRUUl9QQVRURVJOLnRlc3QobmFtZSkpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAoIUFMTE9XRURfSFRNTF9BVFRSUy5oYXMobmFtZSkpIHtcbiAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShhdHRyLm5hbWUpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGlmIChuYW1lID09PSBcImhyZWZcIikge1xuICAgICAgaWYgKHRhZ05hbWUgIT09IFwiYVwiKSB7XG4gICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShhdHRyLm5hbWUpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHN0cmlwcGVkID0gYXR0ci52YWx1ZS5yZXBsYWNlKElOVklTSUJMRV9XSElURVNQQUNFLCBcIlwiKTtcbiAgICAgIGlmICghU0FGRV9MSU5LX1BST1RPQ09MUy50ZXN0KHN0cmlwcGVkKSkge1xuICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoYXR0ci5uYW1lKTtcbiAgICAgIH1cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBpZiAobmFtZSA9PT0gXCJzdHlsZVwiKSB7XG4gICAgICBhdHRyLnZhbHVlID0gc2FuaXRpemVDc3NWYWx1ZShhdHRyLnZhbHVlKTtcbiAgICB9XG4gIH1cbn1cbmZ1bmN0aW9uIHNhbml0aXplTm9kZShub2RlLCBtb2RlLCBkZXB0aCkge1xuICBmb3IgKGxldCBpID0gbm9kZS5jaGlsZHJlbi5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIGNvbnN0IGNoaWxkID0gbm9kZS5jaGlsZHJlbltpXTtcbiAgICBjb25zdCB0YWcgPSBjaGlsZC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgaWYgKG1vZGUgPT09IFwic3ZnXCIpIHtcbiAgICAgIGlmICh0YWcgPT09IFwiZm9yZWlnbm9iamVjdFwiKSB7XG4gICAgICAgIHNhbml0aXplU3ZnQXR0cmlidXRlcyhjaGlsZCwgZGVwdGgpO1xuICAgICAgICBzYW5pdGl6ZU5vZGUoY2hpbGQsIFwiaHRtbFwiLCBkZXB0aCk7XG4gICAgICB9IGVsc2UgaWYgKHRhZyA9PT0gXCJzdHlsZVwiKSB7XG4gICAgICAgIHNhbml0aXplU3ZnQXR0cmlidXRlcyhjaGlsZCwgZGVwdGgpO1xuICAgICAgICBpZiAoY2hpbGQudGV4dENvbnRlbnQpIHtcbiAgICAgICAgICBjaGlsZC50ZXh0Q29udGVudCA9IHNhbml0aXplU3R5bGVFbGVtZW50KGNoaWxkLnRleHRDb250ZW50KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChBTklNQVRJT05fVEFHUy5oYXModGFnKSAmJiBpc0FuaW1hdGlvbkRhbmdlcm91cyhjaGlsZCkpIHtcbiAgICAgICAgY2hpbGQucmVtb3ZlKCk7XG4gICAgICB9IGVsc2UgaWYgKEFMTE9XRURfU1ZHX1RBR1MuaGFzKHRhZykpIHtcbiAgICAgICAgc2FuaXRpemVTdmdBdHRyaWJ1dGVzKGNoaWxkLCBkZXB0aCk7XG4gICAgICAgIHNhbml0aXplTm9kZShjaGlsZCwgXCJzdmdcIiwgZGVwdGgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2hpbGQucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChCTE9DS0VEX0hUTUxfVEFHUy5oYXModGFnKSkge1xuICAgICAgICBjaGlsZC5yZW1vdmUoKTtcbiAgICAgIH0gZWxzZSBpZiAoQUxMT1dFRF9IVE1MX1RBR1MuaGFzKHRhZykpIHtcbiAgICAgICAgc2FuaXRpemVIdG1sQXR0cmlidXRlcyhjaGlsZCk7XG4gICAgICAgIHNhbml0aXplTm9kZShjaGlsZCwgXCJodG1sXCIsIGRlcHRoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNoaWxkLnJlbW92ZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuZnVuY3Rpb24gc2FuaXRpemVTdmdJbm5lcihzdmdUZXh0LCBkZXB0aCkge1xuICBjb25zdCBkb2MgPSBuZXcgRE9NUGFyc2VyKCkucGFyc2VGcm9tU3RyaW5nKHN2Z1RleHQsIFwiaW1hZ2Uvc3ZnK3htbFwiKTtcbiAgY29uc3QgcGFyc2VFcnJvciA9IGRvYy5xdWVyeVNlbGVjdG9yKFwicGFyc2VyZXJyb3JcIik7XG4gIGlmIChwYXJzZUVycm9yKSByZXR1cm4gXCJcIjtcbiAgY29uc3Qgc3ZnID0gZG9jLmRvY3VtZW50RWxlbWVudDtcbiAgaWYgKHN2Zy50YWdOYW1lLnRvTG93ZXJDYXNlKCkgIT09IFwic3ZnXCIpIHJldHVybiBcIlwiO1xuICBzYW5pdGl6ZVN2Z0F0dHJpYnV0ZXMoc3ZnLCBkZXB0aCk7XG4gIHNhbml0aXplTm9kZShzdmcsIFwic3ZnXCIsIGRlcHRoKTtcbiAgaWYgKHN2Zy5jaGlsZHJlbi5sZW5ndGggPT09IDApIHJldHVybiBcIlwiO1xuICByZXR1cm4gbmV3IFhNTFNlcmlhbGl6ZXIoKS5zZXJpYWxpemVUb1N0cmluZyhzdmcpO1xufVxuZnVuY3Rpb24gc2FuaXRpemVTdmcoc3ZnVGV4dCkge1xuICByZXR1cm4gc2FuaXRpemVTdmdJbm5lcihzdmdUZXh0LCAwKTtcbn1cbmV4cG9ydCB7XG4gIHNhbml0aXplU3ZnXG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2FuaXRpemVTdmcubWpzLm1hcFxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFLQSxNQUFNLG1CQUFtQyxvQkFBSSxJQUFJO0FBQUEsRUFDL0M7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUNGLENBQUM7QUFDRCxNQUFNLG9CQUFvQyxvQkFBSSxJQUFJO0FBQUEsRUFDaEQ7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFDRixDQUFDO0FBQ0QsTUFBTSxvQkFBb0Msb0JBQUksSUFBSTtBQUFBLEVBQ2hEO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUE7QUFBQSxFQUVBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBO0FBRUYsQ0FBQztBQUNELE1BQU0sb0JBQW9DLG9CQUFJLElBQUk7QUFBQSxFQUNoRDtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQ0YsQ0FBQztBQUNELE1BQU0scUJBQXFDLG9CQUFJLElBQUk7QUFBQSxFQUNqRDtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUE7QUFBQSxFQUVBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFB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
