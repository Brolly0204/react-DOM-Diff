
const REMOVE = 'REMOVE';
const INSERT = 'INSERT';

class Element {
  constructor(tagName, key, children) {
    this.tagName = tagName;
    this.key = key;
    this.children = children;
  }

  render() {
    let element = document.createElement(this.tagName);
    element.innerHTML = this.children;
    element.setAttribute('key', this.key);
    return element;
  }
}

function el(tagName, key, children) {
  return new Element(tagName, key, children);
}

let oldChildren = [
  el('li', 'A', 'A'),
  el('li', 'B', 'B'),
  el('li', 'C', 'C'),
  el('li', 'D', 'D'),
  // el('li', 'Z', 'Z'),
];

let oUl = document.createElement('ul');
oldChildren.forEach(item => oUl.appendChild(item.render()));
document.body.appendChild(oUl);

let newChildren = [
  el('li', 'D', 'D'),
  el('li', 'C', 'C'),
  el('li', 'B', 'B'),
  el('li', 'A', 'A'),
];

let patches = diff(oldChildren, newChildren);
console.log(patches);

patch(oUl, patches);

function patch(root, patches = []) {
  let nodeMap = {};
  let oldNode = null;
  let newNode = null;
  Array.from(root.childNodes).forEach(node => {
    nodeMap[node.getAttribute('key')] = node;
  });
  patches.forEach(patch => {
    switch (patch.type) {
      case INSERT:
        if (nodeMap[patch.node.key]) {
          nodeMap[patch.node.key].innerHTML = patch.node.children;
          newNode = nodeMap[patch.node.key];
        } else {
          newNode = patch.node.render();
        }
        oldNode = root.childNodes[patch.index];
        // newNode = nodeMap[patch.node.key] || patch.node.render();
        // //得到此索引对应的老节点
        // oldNode = root.childNodes[patch.index];
        if (oldNode) {
          root.insertBefore(newNode, oldNode);
        } else {
          root.appendChild(newNode);
        }
        break;
      case REMOVE:
        oldNode = root.childNodes[patch.index];
        if (oldNode) {
          root.removeChild(oldNode);
        }
        break;
      default:
        throw new Error('没有这种补丁类型');
    }
  })
}

function diff(oldChildren, newChildren) {
  let patches = [];
  let newKeys = newChildren.map(item => item.key);
  let oldIndex = 0;
  let newIndex = 0;
  while (oldIndex < oldChildren.length) {
    if (!newKeys.includes(oldChildren[oldIndex].key)) {
      remove(oldIndex);
      oldChildren.splice(oldIndex, 1);
    }
    oldIndex++;
  }

  oldIndex = 0;

  while (newIndex < newChildren.length) {
    let newKey = (newChildren[newIndex] || {}).key;
    let oldKey = (oldChildren[oldIndex] || {}).key;
    if (!oldKey) {
      insert(newIndex, newKey, newChildren[newIndex]);
      newIndex++;
    } else if (oldKey !== newKey) {
      let nextOldKey = (oldChildren[oldIndex + 1] || {}).key;
      if (nextOldKey === newKey) {
        remove(newIndex);
        oldChildren.splice(oldIndex, 1);
      } else {
        insert(newIndex, newKey);
        newIndex++;
      }
    } else {
      newIndex++;
      oldIndex++;
    }
  }

  // while (oldIndex++ < oldChildren.length) {
  //   remove(newIndex);
  // }

  function remove(index) {
    patches.push({ type: REMOVE, index });
  }

  function insert(index, key) {
    patches.push({ type: INSERT, index, key, node: newChildren[index] });
  }

  return patches;
}
