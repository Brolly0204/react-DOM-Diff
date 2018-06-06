const { setAttr } = require('./utils');

class Element {
  constructor(tagName, attrs, children) {
    this.tagName = tagName;
    this.attrs = attrs;
    this.children = children;
  }

  render() {
    let element = document.createElement(this.tagName);
    for (let attr in this.attrs) {
      setAttr(element, attr, this.attrs[attr]);
    }
    // 先序 深度优先遍历
    this.children.forEach(child => {
      let childElement = (child instanceof Element ) ? child.render() : document.createTextNode(child);
      element.appendChild(childElement);
    });
    return element;
  }
}

function createElement(tagName, attrs, children) {
  return new Element(tagName, attrs, children);
}

module.exports = { createElement };