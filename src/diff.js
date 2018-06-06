const utils = require('./utils');

let keyIndex = 0;
function diff(oldTree, newTree) {
  let patches = {};
  keyIndex = 0;
  let index = 0;
  walk(oldTree, newTree, index, patches);
  return patches;
}

function walk(oldNode, newNode, index, patches) {
  let currentPatches = [];
  if (!newNode) { // 没有新节点
    currentPatches.push({type: utils.REMOVE, index});
    // 如果都是文本节点
  } else if (utils.isString(oldNode) && utils.isString(newNode)) {
    if (oldNode !== newNode) {
      currentPatches.push({type: utils.TEXT, context: newNode});
    }
  } else if (oldNode.tagName === newNode.tagName) {
    let attrsPatch = diffAttr(oldNode.attrs, newNode.attrs);
    if (Object.keys(attrsPatch).length > 0) {
      currentPatches.push({type: utils.ATTRS, attrs: attrsPatch});
    }
    diffChildren(oldNode.children, newNode.children, index, patches);
  } else {
    currentPatches.push({type: utils.REPLACE, node: newNode});
  }

  if (currentPatches.length > 0) {
    patches[index] = currentPatches;
    patches.length = keyIndex;
  }
}

function diffChildren(oldChildren, newChildren, index, patches) {
    oldChildren.forEach((child, idx) => {
      walk(child, newChildren[idx], ++keyIndex, patches)
    });
}

function diffAttr(oldAttrs, newAttrs) {
  let attrsPatch = {};
  for (let attr in oldAttrs) {
    if (oldAttrs[attr] != newAttrs[attr]) {
      attrsPatch[attr] = newAttrs[attr];
    }
  }

  for (let attr in newAttrs) {
    if (!oldAttrs.hasOwnProperty(attr)) {
      attrsPatch[attr] = newAttrs[attr];
    }
  }
  return attrsPatch;
}

module.exports = diff;