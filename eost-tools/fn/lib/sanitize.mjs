import sanitizeHtml from 'sanitize-html';

const SVG_TAGS = ['svg', 'g', 'path', 'circle', 'ellipse', 'rect', 'line', 'polyline', 'polygon', 'defs', 'linearGradient', 'radialGradient', 'stop', 'use', 'text', 'tspan'];
const SVG_SELF = ['path', 'circle', 'ellipse', 'rect', 'line', 'polyline', 'polygon', 'stop', 'use'];
const SVG_ATTRS = ['viewBox', 'preserveAspectRatio', 'd', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'stroke-dasharray', 'transform', 'cx', 'cy', 'r', 'rx', 'ry', 'x', 'y', 'x1', 'y1', 'x2', 'y2', 'width', 'height', 'offset', 'stop-color', 'stop-opacity', 'opacity', 'fill-opacity', 'points', 'gradientUnits', 'gradientTransform', 'fill-rule', 'clip-rule', 'font-family', 'font-size', 'text-anchor', 'href', 'xmlns', 'focusable'];
const HTML_TAGS = ['section', 'div', 'article', 'aside', 'span', 'p', 'br', 'h1', 'h2', 'h3', 'h4', 'small', 'b', 'strong', 'i', 'em', 'u', 'sup', 'sub', 'a', 'ul', 'ol', 'li', 'figure', 'figcaption', 'img', 'button', 'form', 'label', 'input', 'select', 'option', 'textarea', 'iframe', 'blockquote', 'hr', 'table', 'thead', 'tbody', 'tr', 'td', 'th', 'code'];

const len = /^-?[\d.]+(px|rem|em|%|s)?$/;
const lenList = /^[\d.\s\-a-z%]+$/;
const color = /^(#[0-9a-fA-F]{3,8}|var\(--[a-z-]+\))$/;
const allowedStyles = {
  '*': {
    'align-items': [/^[a-z-]+$/], 'margin-bottom': [len], 'margin-top': [len], 'margin': [lenList], 'padding': [lenList], 'padding-top': [len], 'padding-bottom': [len],
    'columns': [/^[\d\s.a-z]+$/], 'column-gap': [len], 'break-inside': [/^(avoid|auto)$/], 'animation-delay': [len], 'object-fit': [/^(cover|contain|fill|none|scale-down)$/],
    'object-position': [/^[\d.\s%a-z-]+$/], 'background': [color], 'color': [color], 'width': [len], 'height': [len], 'max-width': [len],
    'display': [/^(block|inline-block|inline|none|flex|grid)$/], 'border-color': [color], 'gap': [lenList], 'font-size': [len], 'transform-box': [/^(fill-box|view-box|stroke-box)$/], 'text-align': [/^(left|right|center|justify)$/], 'transform-origin': [/^[\d.\s%a-z-]+$/], 'opacity': [/^[\d.]+$/],
  },
};

const safeUrl = (v) => {
  const s = String(v || '').trim().replace(/[\u0000-\u001f\u007f\s]+/g, '');
  return !/^(javascript|data|vbscript|file|blob):/i.test(s);
};

const allowedAttributes = { '*': ['class', 'id', 'style', 'title', 'lang', 'role', 'hidden', 'hreflang', 'aria-*', 'data-count', 'data-c', 'data-f'] };
allowedAttributes.a = ['href', 'target', 'rel', 'download'];
allowedAttributes.img = ['src', 'srcset', 'sizes', 'alt', 'width', 'height', 'loading', 'decoding'];
allowedAttributes.iframe = ['src', 'title', 'loading', 'width', 'height', 'referrerpolicy'];
allowedAttributes.form = ['action', 'method', 'name'];
allowedAttributes.input = ['type', 'name', 'required', 'autocomplete', 'value', 'placeholder', 'maxlength'];
allowedAttributes.select = ['name', 'required'];
allowedAttributes.textarea = ['name', 'rows', 'required', 'maxlength'];
allowedAttributes.label = ['for'];
allowedAttributes.button = ['type'];
allowedAttributes.option = ['value', 'selected'];
for (const t of SVG_TAGS) allowedAttributes[t] = [...SVG_ATTRS, 'class', 'id', 'style', 'aria-*', 'role'];

const FORM_ACTION = '/.netlify/functions/contact';
const OPTS = {
  allowedTags: [...HTML_TAGS, ...SVG_TAGS],
  allowedAttributes,
  allowedStyles,
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowedSchemesAppliedToAttributes: ['href', 'src'],
  allowProtocolRelative: false,
  allowedIframeHostnames: ['www.openstreetmap.org'],
  allowVulnerableTags: false,
  selfClosing: ['br', 'img', 'hr', 'input', ...SVG_SELF],
  parser: { lowerCaseTags: false, lowerCaseAttributeNames: false, recognizeSelfClosing: true },
  disallowedTagsMode: 'discard',
  transformTags: {
    a: (tag, attribs) => {
      const a = { ...attribs };
      if (a.href && !safeUrl(a.href)) delete a.href;
      if (a.target && a.target !== '_blank') delete a.target;
      if (a.target === '_blank') a.rel = 'noopener';
      return { tagName: 'a', attribs: a };
    },
    img: (tag, attribs) => {
      const a = { ...attribs };
      if (a.src && !safeUrl(a.src)) delete a.src;
      if (a.srcset && !safeUrl(a.srcset)) delete a.srcset;
      return { tagName: 'img', attribs: a };
    },
    form: (tag, attribs) => ({ tagName: 'form', attribs: { ...attribs, action: FORM_ACTION, method: 'POST' } }),
    use: (tag, attribs) => ({ tagName: 'use', attribs: attribs.href && /^#[\w-]+$/.test(attribs.href) ? attribs : {} }),
  },
};

/** Nettoie le contenu envoyé par l'espace administrateur : seules les balises et attributs de la liste sont conservés. */
export function sanitizeFragment(html) {
  return sanitizeHtml(String(html || ''), OPTS);
}
export { OPTS as SANITIZE_OPTIONS };
