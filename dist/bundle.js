/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/diff.js":
/*!*********************!*\
  !*** ./src/diff.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const utils = __webpack_require__(/*! ./utils */ \"./src/utils.js\");\n\nlet keyIndex = 0;\nfunction diff(oldTree, newTree) {\n  let patches = {};\n  keyIndex = 0;\n  let index = 0;\n  walk(oldTree, newTree, index, patches);\n  return patches;\n}\n\nfunction walk(oldNode, newNode, index, patches) {\n  let currentPatches = [];\n  if (!newNode) { // 没有新节点\n    currentPatches.push({type: utils.REMOVE, index});\n    // 如果都是文本节点\n  } else if (utils.isString(oldNode) && utils.isString(newNode)) {\n    if (oldNode !== newNode) {\n      currentPatches.push({type: utils.TEXT, context: newNode});\n    }\n  } else if (oldNode.tagName === newNode.tagName) {\n    let attrsPatch = diffAttr(oldNode.attrs, newNode.attrs);\n    if (Object.keys(attrsPatch).length > 0) {\n      currentPatches.push({type: utils.ATTRS, attrs: attrsPatch});\n    }\n    diffChildren(oldNode.children, newNode.children, index, patches);\n  } else {\n    currentPatches.push({type: utils.REPLACE, node: newNode});\n  }\n\n  if (currentPatches.length > 0) {\n    patches[index] = currentPatches;\n    patches.length = keyIndex;\n  }\n}\n\nfunction diffChildren(oldChildren, newChildren, index, patches) {\n    oldChildren.forEach((child, idx) => {\n      walk(child, newChildren[idx], ++keyIndex, patches)\n    });\n}\n\nfunction diffAttr(oldAttrs, newAttrs) {\n  let attrsPatch = {};\n  for (let attr in oldAttrs) {\n    if (oldAttrs[attr] != newAttrs[attr]) {\n      attrsPatch[attr] = newAttrs[attr];\n    }\n  }\n\n  for (let attr in newAttrs) {\n    if (!oldAttrs.hasOwnProperty(attr)) {\n      attrsPatch[attr] = newAttrs[attr];\n    }\n  }\n  return attrsPatch;\n}\n\nmodule.exports = diff;\n\n//# sourceURL=webpack:///./src/diff.js?");

/***/ }),

/***/ "./src/element.js":
/*!************************!*\
  !*** ./src/element.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { setAttr } = __webpack_require__(/*! ./utils */ \"./src/utils.js\");\n\nclass Element {\n  constructor(tagName, attrs, children) {\n    this.tagName = tagName;\n    this.attrs = attrs;\n    this.children = children;\n  }\n\n  render() {\n    let element = document.createElement(this.tagName);\n    for (let attr in this.attrs) {\n      setAttr(element, attr, this.attrs[attr]);\n    }\n    // 先序 深度优先遍历\n    this.children.forEach(child => {\n      let childElement = (child instanceof Element ) ? child.render() : document.createTextNode(child);\n      element.appendChild(childElement);\n    });\n    return element;\n  }\n}\n\nfunction createElement(tagName, attrs, children) {\n  return new Element(tagName, attrs, children);\n}\n\nmodule.exports = { createElement };\n\n//# sourceURL=webpack:///./src/element.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const { createElement } = __webpack_require__(/*! ./element */ \"./src/element.js\");\nconst diff = __webpack_require__(/*! ./diff */ \"./src/diff.js\");\nconst patch = __webpack_require__(/*! ./patch */ \"./src/patch.js\");\n\nconst ul1 = createElement('ul', {class: 'list'}, [\n  createElement('li', {class: 'item'}, ['hello world!']),\n  createElement('li', {class: 'item'}, ['hello world!']),\n  createElement('li', {class: 'item'}, ['hello world!']),\n  createElement('li', {class: 'item'}, ['1']),\n]);\n\nconst root = ul1.render();\ndocument.body.appendChild(root);\n\nconst ul2 = createElement('ul', {class: 'list'}, [\n  createElement('li', {class: 'item'}, ['1']),\n  createElement('li', {class: 'item'}, ['2']),\n  createElement('li', {class: 'item'}, ['3']),\n  createElement('li', {class: 'item'}, ['4']),\n]);\n\nlet patches = diff(ul1, ul2);\nconsole.log(patches);\npatch(root, patches);\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/patch.js":
/*!**********************!*\
  !*** ./src/patch.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const utils = __webpack_require__(/*! ./utils */ \"./src/utils.js\");\n\nlet keyIndex = 0;\nlet allPatches;\n\nfunction patch(root, patches) {\n  allPatches = patches;\n  walk(root);\n}\n\nfunction walk(node) {\n  let currentPatches = allPatches[keyIndex++];\n  (node.childNodes || []).forEach(child => walk(child));\n  if (currentPatches) {\n    doPatch(node, currentPatches);\n  }\n}\n\nfunction doPatch(node, currentPatches) {\n  currentPatches.forEach(patch => {\n    switch (patch.type) {\n      case utils.ATTRS:\n        for(let attr in patch.attrs) {\n          let value = utils.ATTRS[attr];\n          if (value) {\n            utils.setAttr(node, attr, value);\n          } else {\n            node.removeAttribute(attr);\n          }\n        }\n        break;\n      case utils.TEXT:\n        console.log(patch);\n        node.textContent = patch.context;\n        break;\n      case utils.REPLACE:\n        let newNode = (patch.node instanceof Element) ? patch.node.render() : document.createTextNode(path.node);\n        node.parentNode.replaceChild(newNode, node);\n        break;\n      case utils.REMOVE:\n        node.parentNode.removeChild(node);\n        break;\n    }\n  })\n}\nmodule.exports = patch;\n\n//# sourceURL=webpack:///./src/patch.js?");

/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("\nlet utils = {\n  REPLACE: 'REPLACE',\n  REMOVE: 'REMOVE',\n  TEXT: 'TEXT',\n  ATTRS: 'ATTRS',\n  setAttr(element, attr, value) {\n    switch(attr) {\n      case 'style':\n        element.style.cssText += value;\n        break;\n      case 'value':\n        let tagName = element.tagName.toLowerCase();\n        if (tagName === 'input' || tagName === 'textarea') {\n          element.value = value;\n        } else {\n          element.setAttribute(attr, value);\n        }\n        break;\n      default:\n        element.setAttribute(attr, value);\n        break;\n    }\n  },\n  type(obj) {\n    return Object.prototype.toString.call(obj).replace(/\\[object\\s|\\]/g, '');\n  },\n  isString(str) {\n    return  utils.type(str) === 'String';\n  }\n};\n\nmodule.exports = utils;\n\n//# sourceURL=webpack:///./src/utils.js?");

/***/ })

/******/ });