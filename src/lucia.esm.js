
var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

var DIRECTIVE_PREFIX = 'l-';
var DIRECTIVE_SHORTHANDS;

(function (DIRECTIVE_SHORTHANDS) {
  DIRECTIVE_SHORTHANDS["@"] = "on";
  DIRECTIVE_SHORTHANDS[":"] = "bind";
})(DIRECTIVE_SHORTHANDS || (DIRECTIVE_SHORTHANDS = {}));

var rawDirectiveSplitRE = function rawDirectiveSplitRE() {
  return /:|\./gim;
};
var semicolonCaptureRE = function semicolonCaptureRE() {
  return /(;)/gim;
};
var arrayIndexCaptureRE = function arrayIndexCaptureRE() {
  return /\[(\d+)\]/gim;
};
var eventDirectivePrefixRE = function eventDirectivePrefixRE() {
  return /on|@/gim;
};
var parenthesisWrapReplaceRE = function parenthesisWrapReplaceRE() {
  return /\(|\)/gim;
};
var hasDirectiveRE = function hasDirectiveRE() {
  return new RegExp("(" + DIRECTIVE_PREFIX + "|" + Object.keys(DIRECTIVE_SHORTHANDS).join('|') + ")\\w+", 'gim');
};
var expressionPropRE = function expressionPropRE(key) {
  return new RegExp("\\b" + key + "\\b", 'gim');
};

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

var bindDirective = function bindDirective(_a) {
  var el = _a.el,
      name = _a.name,
      data = _a.data,
      state = _a.state;

  switch (name.split(':')[1]) {
    case 'class':
      var hydratedClasses = data.compute(state);

      if (typeof hydratedClasses === 'string') {
        return el.setAttribute('class', (el.className + " " + hydratedClasses).trim());
      } else if (hydratedClasses instanceof Array) {
        return el.setAttribute('class', (el.className + " " + hydratedClasses.join(' ')).trim());
      } else {
        var classes = [];

        for (var key in hydratedClasses) {
          if (hydratedClasses[key]) classes.push(key);
        }

        if (classes.length > 0) {
          return el.setAttribute('class', (el.className + " " + classes.join(' ')).trim());
        } else if (el.className.trim().length > 0) {
          return el.setAttribute('class', el.className);
        } else {
          return el.removeAttribute('class');
        }
      }

    case 'style':
      var hydratedStyles = data.compute(state);
      el.removeAttribute('style');

      for (var key in hydratedStyles) {
        el.style[key] = hydratedStyles[key];
      }

      break;

    default:
      var hydratedAttributes = data.compute(state);

      if (_typeof(hydratedAttributes) === 'object' && hydratedAttributes !== null) {
        for (var key in hydratedAttributes) {
          if (hydratedAttributes[key]) {
            el.setAttribute(key, hydratedAttributes[key]);
          } else {
            el.removeAttribute(key);
          }
        }
      } else if (hydratedAttributes) {
        el.setAttribute(name.split(':')[1], hydratedAttributes);
      } else {
        el.removeAttribute(name.split(':')[1]);
      }

      break;
  }
};

var computeExpression = function computeExpression(expression, el, returnable) {
  var formattedExpression = "with($state){" + (returnable || true ? "return " + expression : expression) + "}";
  return function (state) {
    try {
      var strippedExpression = expression.replace(/(\[\d+\])|(\$state\.)|(\(\))|;*/gim, '');
      var positionInState = returnable ? Object.keys(state).indexOf(strippedExpression) : -1;

      if (positionInState !== -1) {
        var value = Object.values(state)[positionInState];
        var arrayIndex = arrayIndexCaptureRE().exec(expression);

        if (arrayIndex && arrayIndex[1] && value instanceof Array && !isNaN(arrayIndex[1])) {
          return value[Number(arrayIndex[1])];
        } else if (expression.endsWith('()')) {
          return value();
        } else return value;
      } else {
        return new Function('$state', '$el', formattedExpression)(state, el || null);
      }
    } catch (err) {
      console.warn("Lucia Error: \"" + err + "\"\n\nExpression: \"" + expression + "\"\nElement:", el || null);
    }
  };
};

var removeDupesFromArray = function removeDupesFromArray(array) {
  return __spread(new Set(array));
};
var collectAndInitDirectives = function collectAndInitDirectives(el, state) {
  var e_1, _a;

  if (state === void 0) {
    state = {};
  }

  var directives = {};
  var nodeKeys = [];

  if (el.attributes) {
    var _loop_1 = function _loop_1(name_1, value) {
      var keysInFunctions = [];
      var keysInState = Object.keys(state);
      var returnable = true;
      var keys = keysInState.filter(function (key) {
        var hasKey = expressionPropRE(key).test(String(value));

        if (typeof state[key] === 'function' && hasKey) {
          var keysInFunction = keysInState.filter(function (k) {
            return expressionPropRE(k).test(String(state[key]));
          });
          keysInFunctions.push.apply(keysInFunctions, __spread(keysInFunction));
        }

        return hasKey;
      });
      if (eventDirectivePrefixRE().test(name_1)) returnable = false;

      if (name_1.includes('for') && el.__l_for_template === undefined) {
        el.__l_for_template = String(el.innerHTML).trim();
        returnable = false;
      }

      var uniqueCompiledKeys = removeDupesFromArray(__spread(keys, keysInFunctions));
      nodeKeys.push.apply(nodeKeys, __spread(uniqueCompiledKeys));
      var directiveData = {
        compute: computeExpression(value, el, returnable),
        keys: uniqueCompiledKeys,
        value: value
      };

      if (name_1.startsWith(DIRECTIVE_PREFIX)) {
        directives[name_1.slice(DIRECTIVE_PREFIX.length)] = directiveData;
      } else if (Object.keys(DIRECTIVE_SHORTHANDS).includes(name_1[0])) {
        directives[DIRECTIVE_SHORTHANDS[name_1[0]] + ":" + name_1.slice(1)] = directiveData;
      }
    };

    try {
      for (var _b = __values(el.attributes), _c = _b.next(); !_c.done; _c = _b.next()) {
        var _d = _c.value,
            name_1 = _d.name,
            value = _d.value;

        _loop_1(name_1, value);
      }
    } catch (e_1_1) {
      e_1 = {
        error: e_1_1
      };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
  }

  return [directives, removeDupesFromArray(nodeKeys)];
};

var createASTNode = function createASTNode(el, state) {
  var _a = __read(collectAndInitDirectives(el, state), 2),
      directives = _a[0],
      keys = _a[1];

  var hasDirectives = Object.keys(directives).length > 0;
  var hasKeyInDirectives = Object.values(directives).some(function (_a) {
    var value = _a.value;
    return Object.keys(state).some(function (key) {
      return expressionPropRE(key).test(value);
    });
  });
  if (!hasDirectives) return null;
  return {
    el: el,
    keys: keys,
    directives: directives,
    type: hasKeyInDirectives ? 1 : 0
  };
};
var isListRenderScope = function isListRenderScope(el) {
  return el.hasAttribute(DIRECTIVE_PREFIX + "for");
};
var isUnderListRenderScope = function isUnderListRenderScope(el) {
  if (!el.parentElement) return false;
  return el.parentElement.hasAttribute(DIRECTIVE_PREFIX + "for");
};
var extractNodeChildrenAsCollection = function extractNodeChildrenAsCollection(rootNode, isListGroup) {
  var e_1, _a;

  if (isListGroup === void 0) {
    isListGroup = false;
  }

  var collection = [];
  var isList = isListRenderScope(rootNode);
  var isUnderList = isUnderListRenderScope(rootNode);
  if (!isListGroup && (isList || isUnderList)) return collection;
  if (!isListGroup || !isList) collection.push(rootNode);

  try {
    for (var _b = __values(rootNode.childNodes), _c = _b.next(); !_c.done; _c = _b.next()) {
      var childNode = _c.value;

      if (childNode.nodeType === Node.ELEMENT_NODE) {
        if (!isListGroup && isListRenderScope(childNode)) collection.push(childNode);else {
          collection.push.apply(collection, __spread(extractNodeChildrenAsCollection(childNode, true)));
        }
      }
    }
  } catch (e_1_1) {
    e_1 = {
      error: e_1_1
    };
  } finally {
    try {
      if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
    } finally {
      if (e_1) throw e_1.error;
    }
  }

  return collection;
};
var compile = function compile(el, state) {
  var e_2, _a;

  if (state === void 0) {
    state = {};
  }

  if (!el) throw new Error('Please provide a Element');
  var ast = [];
  var isListGroup = el.__l !== undefined && isListRenderScope(el);
  var nodes = extractNodeChildrenAsCollection(el, isListGroup);

  try {
    for (var nodes_1 = __values(nodes), nodes_1_1 = nodes_1.next(); !nodes_1_1.done; nodes_1_1 = nodes_1.next()) {
      var node = nodes_1_1.value;

      if (hasDirectiveRE().test(node.outerHTML)) {
        if (node.hasAttribute(DIRECTIVE_PREFIX + "state")) {
          continue;
        }

        var newASTNode = createASTNode(node, state);
        if (newASTNode) ast.push(newASTNode);
      }
    }
  } catch (e_2_1) {
    e_2 = {
      error: e_2_1
    };
  } finally {
    try {
      if (nodes_1_1 && !nodes_1_1.done && (_a = nodes_1["return"])) _a.call(nodes_1);
    } finally {
      if (e_2) throw e_2.error;
    }
  }

  return ast;
};

var patch = function patch(ast, directives, state, changedKeys) {
  var e_1, _a;

  if (state === void 0) {
    state = {};
  }

  if (changedKeys === void 0) {
    changedKeys = [];
  }

  var nodeTrashQueue = [];

  var _loop_1 = function _loop_1(i) {
    var e_2, _a;

    var node = ast[i];
    if (node.type === 0) nodeTrashQueue.push(i);
    var nodeHasKey = changedKeys.some(function (key) {
      return node.keys.includes(key);
    });
    if (!nodeHasKey) return "continue";

    var _loop_2 = function _loop_2(directiveName, directiveData) {
      var directiveHasKey = changedKeys.some(function (key) {
        return directiveData.keys.includes(key);
      });

      if (directiveHasKey || node.type === 0) {
        renderDirective({
          el: node.el,
          name: directiveName,
          data: directiveData,
          state: state
        }, __assign({}, directives));
      }
    };

    try {
      for (var _b = (e_2 = void 0, __values(Object.entries(node.directives))), _c = _b.next(); !_c.done; _c = _b.next()) {
        var _d = __read(_c.value, 2),
            directiveName = _d[0],
            directiveData = _d[1];

        _loop_2(directiveName, directiveData);
      }
    } catch (e_2_1) {
      e_2 = {
        error: e_2_1
      };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
      } finally {
        if (e_2) throw e_2.error;
      }
    }
  };

  for (var i = 0; i < ast.length; i++) {
    _loop_1(i);
  }

  try {
    for (var nodeTrashQueue_1 = __values(nodeTrashQueue), nodeTrashQueue_1_1 = nodeTrashQueue_1.next(); !nodeTrashQueue_1_1.done; nodeTrashQueue_1_1 = nodeTrashQueue_1.next()) {
      var i = nodeTrashQueue_1_1.value;
      ast.splice(i, 1);
    }
  } catch (e_1_1) {
    e_1 = {
      error: e_1_1
    };
  } finally {
    try {
      if (nodeTrashQueue_1_1 && !nodeTrashQueue_1_1.done && (_a = nodeTrashQueue_1["return"])) _a.call(nodeTrashQueue_1);
    } finally {
      if (e_1) throw e_1.error;
    }
  }
};

var htmlDirective = function htmlDirective(_a) {
  var _b;

  var el = _a.el,
      data = _a.data,
      state = _a.state;
  var key = data.value.replace(semicolonCaptureRE(), '');
  if (key in state) el.innerHTML = String(state[key]);
  el.innerHTML = (_b = data.compute(state)) !== null && _b !== void 0 ? _b : data.value;
  el.__l = {};
  var ast = compile(el, state);
  patch(ast, directives, state, data.keys);
};

var ifDirective = function ifDirective(_a) {
  var el = _a.el,
      name = _a.name,
      data = _a.data,
      state = _a.state;
  var modifier = name.split(':')[1];
  var key = data.value.replace(semicolonCaptureRE(), '');
  var hydratedConditional = true;
  if (key in state) hydratedConditional = !!state[key];else hydratedConditional = !!data.compute(state);
  if (modifier === 'hidden') el.hidden = !hydratedConditional;else el.style.display = hydratedConditional === false ? 'none' : null;
};

var inputCallback = function inputCallback(el, hydratedValue, data, state) {
  var isNumber = typeof hydratedValue === 'number' && !isNaN(el.value);
  var isBoolean = typeof hydratedValue === 'boolean' && (el.value === 'true' || el.value === 'false');
  var isNullish = (hydratedValue === null || hydratedValue === undefined) && (el.value === 'null' || el.value === 'undefined');
  var payload;

  if (isNumber) {
    payload = Number(el.value).toPrecision();
  } else if (isBoolean) {
    payload = el.value === 'true';
  } else if (isNullish) {
    if (el.value === 'null') payload = null;else payload = undefined;
  } else {
    payload = String(el.value);
  }

  if (Object.keys(state).includes(data.value)) state[data.value] = payload;else {
    computeExpression(data.value + " = " + (typeof payload === 'string' ? "'" + payload + "'" : payload))(state);
  }
};
var modelDirective = function modelDirective(_a) {
  var awaitingTypecastEl = _a.el,
      name = _a.name,
      data = _a.data,
      state = _a.state;
  var el = awaitingTypecastEl;
  var hydratedValue = data.compute(state);

  if (el.value !== hydratedValue) {
    el.value = hydratedValue;
  }

  var _b = __read(name.split('.'), 2),
      prop = _b[1];

  var callback = function callback() {
    return inputCallback(el, hydratedValue, data, state);
  };

  if (prop === 'debounce') el.onchange = callback;else el.oninput = callback;
};

var onDirective = function onDirective(_a) {
  var el = _a.el,
      name = _a.name,
      data = _a.data,
      state = _a.state;
  var options = {};
  if (el.__l_on_registered) return;

  var _b = __read(name.split('.'), 2),
      directiveAndEventName = _b[0],
      prop = _b[1];

  var eventName = directiveAndEventName.split(':')[1];
  var eventProp = prop || null;

  var handler = function handler($event) {
    if (eventProp === 'prevent') $event.preventDefault();
    if (eventProp === 'stop') $event.stopPropagation();
    data.compute(state);
  };

  options.once = eventProp === 'once';
  options.passive = eventProp === 'passive';
  el.addEventListener(eventName, handler, options);
  el.__l_on_registered = handler;
};

var textDirective = function textDirective(_a) {
  var _b;

  var el = _a.el,
      data = _a.data,
      state = _a.state;
  var key = data.value.replace(semicolonCaptureRE(), '');
  if (key in state) el.textContent = String(state[key]);else el.textContent = (_b = data.compute(state)) !== null && _b !== void 0 ? _b : data.value;
};

var forDirective = function forDirective(_a) {
  var el = _a.el,
      data = _a.data,
      state = _a.state;

  var _b = __read(data.value.split(/in +/g), 2),
      expression = _b[0],
      target = _b[1];

  var _c = __read(expression.replace(parenthesisWrapReplaceRE(), '').split(','), 2),
      item = _c[0],
      index = _c[1];

  var currArray = state[target];
  var template = String(el.__l_for_template);
  if (el.innerHTML.trim() === template) el.innerHTML = '';
  var arrayDiff = currArray.length - el.children.length;
  if (currArray.length === 0) el.innerHTML = '';else if (arrayDiff !== 0) {
    for (var i = Math.abs(arrayDiff); i > 0; i--) {
      if (arrayDiff < 0) el.removeChild(el.lastChild);else {
        var temp = document.createElement('div');
        var content = template;

        if (item) {
          content = content.replace(expressionPropRE(item.trim()), target + "[" + (currArray.length - i) + "]");
        }

        if (index) {
          content = content.replace(expressionPropRE(index.trim()), String(currArray.length - i));
        }

        temp.innerHTML = content;
        el.appendChild(temp.firstChild);
      }
    }
  }
  el.__l = {};
  var ast = compile(el, state);
  patch(ast, directives, state, data.keys);
};

var directives = {
  BIND: bindDirective,
  HTML: htmlDirective,
  IF: ifDirective,
  MODEL: modelDirective,
  ON: onDirective,
  TEXT: textDirective,
  FOR: forDirective
};
var renderDirective = function renderDirective(props, directives) {
  var name = props.name.split(rawDirectiveSplitRE())[0];
  directives[name.toUpperCase()](props);
};

var arrayEquals = function arrayEquals(firstArray, secondArray) {
  return firstArray instanceof Array && secondArray instanceof Array && firstArray.length === secondArray.length && firstArray.every(function (value, i) {
    return value === secondArray[i];
  });
};

var reactive = function reactive(state, callback) {
  var handler = {
    get: function get(target, key) {
      if (_typeof(target[key]) === 'object' && target[key] !== null) {
        return new Proxy(target[key], handler);
      } else {
        return target[key];
      }
    },
    set: function set(target, key, value) {
      var hasArrayMutationKey = !isNaN(Number(key)) || key === 'length';

      if (typeof state[key] === 'function') {
        return false;
      } else if (target instanceof Array && hasArrayMutationKey) {
        target[key] = value;
        var keys = Object.keys(state).filter(function (k) {
          return arrayEquals(state[k], target);
        });
        if (keys.length !== 0) callback(keys);
      } else {
        target[key] = value;

        if (Object.keys(state).some(function (key) {
          return !target[key];
        })) {
          callback(Object.keys(state).filter(function (key) {
            return _typeof(state[key]) === 'object';
          }));
        } else {
          callback([key]);
        }
      }

      return true;
    }
  };
  return new Proxy(Object.seal(state), handler);
};

var App = function () {
  function App(state) {
    if (state === void 0) {
      state = {};
    }

    this.state = state;
    this.directives = {};
  }

  App.prototype.mount = function (el) {
    var rootEl = typeof el === 'string' ? document.querySelector(el) : el;
    this.ast = compile(rootEl, this.state);
    this.state = reactive(this.state, this.render.bind(this));
    this.directives = __assign(__assign({}, this.directives), directives);
    this.render(Object.keys(this.state));
    rootEl.__l = this;
    return this.state;
  };

  App.prototype.directive = function (name, callback) {
    this.directives[name.toUpperCase()] = callback;
  };

  App.prototype.render = function (keys) {
    patch(this.ast, directives, this.state, keys || Object.keys(this.state));
  };

  return App;
}();
var createApp = function createApp(state) {
  return new App(state);
};

var stateDirective = DIRECTIVE_PREFIX + "state";
var init = function init(element) {
  if (element === void 0) {
    element = document;
  }

  var elements = __spread(element.querySelectorAll("[" + stateDirective + "]"));

  elements.filter(function (el) {
    return el.__l === undefined;
  }).map(function (el) {
    var expression = el.getAttribute(stateDirective);

    try {
      var state = new Function("return " + expression)();
      var app = createApp(state || {});
      app.mount(el);
    } catch (err) {
      console.warn("Lucia Error: \"" + err + "\"\n\nExpression: \"" + expression + "\"\nElement:", el);
    }
  });
};
var listen = function listen(callback, element) {
  if (element === void 0) {
    element = document;
  }

  var observer = new MutationObserver(function (mutations) {
    mutations.map(function (mut) {
      if (mut.addedNodes.length > 0) {
        mut.addedNodes.forEach(function (node) {
          if (node.nodeType !== 1) return;
          if (node.parentElement && node.parentElement.closest("[" + stateDirective + "]")) return;
          if (!node.getAttribute(stateDirective)) return;
          callback(node.parentElement);
        });
      } else if (mut.type === 'attributes') {
        if (mut.target.parentElement && mut.target.parentElement.closest("[" + stateDirective + "]")) return;
        callback(mut.target.parentElement);
      }
    });
  });
  observer.observe(element, {
    childList: true,
    attributes: true,
    subtree: true
  });
};

export { compile, createApp, directives, init, listen, patch, reactive, renderDirective };
