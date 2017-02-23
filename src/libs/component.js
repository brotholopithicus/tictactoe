export function createComponent(selector, parent, options) {
    let el = document.createElement(selector);
    parent.appendChild(el);
    if (typeof options.data !== 'undefined') options.data.forEach(item => el.dataset[item.key] = item.value);
    if (typeof options.id !== 'undefined') el.id = options.id;
    if (typeof options.classes !== 'undefined') options.classes.forEach(cls => el.classList.add(cls));
    if (typeof options.styles !== 'undefined') options.styles.forEach(style => el.style[style.key] = style.value);
    if (typeof options.attributes !== 'undefined') options.attributes.forEach(attr => el.setAttribute(attr.key, attr.value));
    if(typeof options.text !== 'undefined') el.textContent = options.text;
    return el;
}
