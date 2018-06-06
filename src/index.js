const { createElement } = require('./element');
const diff = require('./diff');
const patch = require('./patch');

const ul1 = createElement('ul', {class: 'list'}, [
  createElement('li', {class: 'item'}, ['hello world!']),
  createElement('li', {class: 'item'}, ['hello world!']),
  createElement('li', {class: 'item'}, ['hello world!']),
  createElement('li', {class: 'item'}, ['1']),
]);

const root = ul1.render();
document.body.appendChild(root);

const ul2 = createElement('ul', {class: 'list'}, [
  createElement('li', {class: 'item'}, ['1']),
  createElement('li', {class: 'item'}, ['2']),
  createElement('li', {class: 'item'}, ['3']),
  createElement('li', {class: 'item'}, ['4']),
]);

let patches = diff(ul1, ul2);
console.log(patches);
patch(root, patches);