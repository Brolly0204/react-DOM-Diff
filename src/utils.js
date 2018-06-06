
let utils = {
  REPLACE: 'REPLACE',
  REMOVE: 'REMOVE',
  TEXT: 'TEXT',
  ATTRS: 'ATTRS',
  setAttr(element, attr, value) {
    switch(attr) {
      case 'style':
        element.style.cssText += value;
        break;
      case 'value':
        let tagName = element.tagName.toLowerCase();
        if (tagName === 'input' || tagName === 'textarea') {
          element.value = value;
        } else {
          element.setAttribute(attr, value);
        }
        break;
      default:
        element.setAttribute(attr, value);
        break;
    }
  },
  type(obj) {
    return Object.prototype.toString.call(obj).replace(/\[object\s|\]/g, '');
  },
  isString(str) {
    return  utils.type(str) === 'String';
  }
};

module.exports = utils;