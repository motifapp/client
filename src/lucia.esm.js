const DIRECTIVE_PREFIX = 'l-';
var DIRECTIVE_SHORTHANDS;
(function (DIRECTIVE_SHORTHANDS) {
    DIRECTIVE_SHORTHANDS["@"] = "on";
    DIRECTIVE_SHORTHANDS[":"] = "bind";
})(DIRECTIVE_SHORTHANDS || (DIRECTIVE_SHORTHANDS = {}));

const rawDirectiveSplitRE = () => /:|\./gim;
const semicolonCaptureRE = () => /(;)/gim;
const arrayIndexCaptureRE = () => /\[(\d+)\]/gim;
const eventDirectivePrefixRE = () => /on|@/gim;
const parenthesisWrapReplaceRE = () => /\(|\)/gim;
const hasDirectiveRE = () => {
    return new RegExp(`(${DIRECTIVE_PREFIX}|${Object.keys(DIRECTIVE_SHORTHANDS).join('|')})\\w+`, 'gim');
};
const expressionPropRE = (key) => {
    return new RegExp(`\\b${key}\\b`, 'gim');
};

const bindDirective = ({ el, name, data, state }) => {
    switch (name.split(':')[1]) {
        case 'class':
            const hydratedClasses = data.compute(state);
            if (typeof hydratedClasses === 'string') {
                return el.setAttribute('class', `${el.className} ${hydratedClasses}`.trim());
            }
            else if (hydratedClasses instanceof Array) {
                return el.setAttribute('class', `${el.className} ${hydratedClasses.join(' ')}`.trim());
            }
            else {
                const classes = [];
                for (const key in hydratedClasses) {
                    if (hydratedClasses[key])
                        classes.push(key);
                }
                if (classes.length > 0) {
                    return el.setAttribute('class', `${el.className} ${classes.join(' ')}`.trim());
                }
                else if (el.className.trim().length > 0) {
                    return el.setAttribute('class', el.className);
                }
                else {
                    return el.removeAttribute('class');
                }
            }
        case 'style':
            const hydratedStyles = data.compute(state);
            el.removeAttribute('style');
            for (const key in hydratedStyles) {
                el.style[key] = hydratedStyles[key];
            }
            break;
        default:
            const hydratedAttributes = data.compute(state);
            if (typeof hydratedAttributes === 'object' && hydratedAttributes !== null) {
                for (const key in hydratedAttributes) {
                    if (hydratedAttributes[key]) {
                        el.setAttribute(key, hydratedAttributes[key]);
                    }
                    else {
                        el.removeAttribute(key);
                    }
                }
            }
            else if (hydratedAttributes) {
                el.setAttribute(name.split(':')[1], hydratedAttributes);
            }
            else {
                el.removeAttribute(name.split(':')[1]);
            }
            break;
    }
};

const computeExpression = (expression, el, returnable) => {
    let formattedExpression = `with($state){${returnable || true ? `return ${expression}` : expression}}`;
    return (state) => {
        try {
            const strippedExpression = expression.replace(/(\[\d+\])|(\$state\.)|(\(\))|;*/gim, '');
            const positionInState = returnable ? Object.keys(state).indexOf(strippedExpression) : -1;
            if (positionInState !== -1) {
                const value = Object.values(state)[positionInState];
                const arrayIndex = arrayIndexCaptureRE().exec(expression);
                if (arrayIndex &&
                    arrayIndex[1] &&
                    value instanceof Array &&
                    !isNaN(arrayIndex[1])) {
                    return value[Number(arrayIndex[1])];
                }
                else if (expression.endsWith('()')) {
                    return value();
                }
                else
                    return value;
            }
            else {
                return new Function('$state', '$el', formattedExpression)(state, el || null);
            }
        }
        catch (err) {
            console.warn(`Lucia Error: "${err}"\n\nExpression: "${expression}"\nElement:`, el || null);
        }
    };
};

const removeDupesFromArray = (array) => [...new Set(array)];
const collectAndInitDirectives = (el, state = {}) => {
    const directives = {};
    const nodeKeys = [];
    if (el.attributes) {
        for (const { name, value } of el.attributes) {
            const keysInFunctions = [];
            const keysInState = Object.keys(state);
            let returnable = true;
            const keys = keysInState.filter((key) => {
                const hasKey = expressionPropRE(key).test(String(value));
                if (typeof state[key] === 'function' && hasKey) {
                    const keysInFunction = keysInState.filter((k) => expressionPropRE(k).test(String(state[key])));
                    keysInFunctions.push(...keysInFunction);
                }
                return hasKey;
            });
            if (eventDirectivePrefixRE().test(name))
                returnable = false;
            if (name.includes('for') && el.__l_for_template === undefined) {
                el.__l_for_template = String(el.innerHTML).trim();
                returnable = false;
            }
            const uniqueCompiledKeys = removeDupesFromArray([...keys, ...keysInFunctions]);
            nodeKeys.push(...uniqueCompiledKeys);
            const directiveData = {
                compute: computeExpression(value, el, returnable),
                keys: uniqueCompiledKeys,
                value,
            };
            if (name.startsWith(DIRECTIVE_PREFIX)) {
                directives[name.slice(DIRECTIVE_PREFIX.length)] = directiveData;
            }
            else if (Object.keys(DIRECTIVE_SHORTHANDS).includes(name[0])) {
                directives[`${DIRECTIVE_SHORTHANDS[name[0]]}:${name.slice(1)}`] = directiveData;
            }
        }
    }
    return [directives, removeDupesFromArray(nodeKeys)];
};

const createASTNode = (el, state) => {
    const [directives, keys] = collectAndInitDirectives(el, state);
    const hasDirectives = Object.keys(directives).length > 0;
    const hasKeyInDirectives = Object.values(directives).some(({ value }) => Object.keys(state).some((key) => expressionPropRE(key).test(value)));
    if (!hasDirectives)
        return null;
    return {
        el,
        keys: keys,
        directives: directives,
        type: hasKeyInDirectives ? 1 : 0,
    };
};
const isListRenderScope = (el) => {
    return el.hasAttribute(`${DIRECTIVE_PREFIX}for`);
};
const isUnderListRenderScope = (el) => {
    if (!el.parentElement)
        return false;
    return el.parentElement.hasAttribute(`${DIRECTIVE_PREFIX}for`);
};
const extractNodeChildrenAsCollection = (rootNode, isListGroup = false) => {
    const collection = [];
    const isList = isListRenderScope(rootNode);
    const isUnderList = isUnderListRenderScope(rootNode);
    if (!isListGroup && (isList || isUnderList))
        return collection;
    if (!isListGroup || !isList)
        collection.push(rootNode);
    for (const childNode of rootNode.childNodes) {
        if (childNode.nodeType === Node.ELEMENT_NODE) {
            if (!isListGroup && isListRenderScope(childNode))
                collection.push(childNode);
            else {
                collection.push(...extractNodeChildrenAsCollection(childNode, true));
            }
        }
    }
    return collection;
};
const compile = (el, state = {}) => {
    if (!el)
        throw new Error('Please provide a Element');
    const ast = [];
    const isListGroup = el.__l !== undefined && isListRenderScope(el);
    const nodes = extractNodeChildrenAsCollection(el, isListGroup);
    for (const node of nodes) {
        if (hasDirectiveRE().test(node.outerHTML)) {
            if (node.hasAttribute(`${DIRECTIVE_PREFIX}state`)) {
                continue;
            }
            const newASTNode = createASTNode(node, state);
            if (newASTNode)
                ast.push(newASTNode);
        }
    }
    return ast;
};

const patch = (ast, directives, state = {}, changedKeys = []) => {
    let nodeTrashQueue = [];
    for (let i = 0; i < ast.length; i++) {
        const node = ast[i];
        if (node.type === 0)
            nodeTrashQueue.push(i);
        const nodeHasKey = changedKeys.some((key) => node.keys.includes(key));
        if (!nodeHasKey)
            continue;
        for (const [directiveName, directiveData] of Object.entries(node.directives)) {
            const directiveHasKey = changedKeys.some((key) => directiveData.keys.includes(key));
            if (directiveHasKey || node.type === 0) {
                renderDirective({ el: node.el, name: directiveName, data: directiveData, state }, { ...directives });
            }
        }
    }
    for (const i of nodeTrashQueue) {
        ast.splice(i, 1);
    }
};

const htmlDirective = ({ el, data, state }) => {
    const key = data.value.replace(semicolonCaptureRE(), '');
    if (key in state)
        el.innerHTML = String(state[key]);
    el.innerHTML = data.compute(state) ?? data.value;
    el.__l = {};
    const ast = compile(el, state);
    patch(ast, directives, state, data.keys);
};

const ifDirective = ({ el, name, data, state }) => {
    const modifier = name.split(':')[1];
    const key = data.value.replace(semicolonCaptureRE(), '');
    let hydratedConditional = true;
    if (key in state)
        hydratedConditional = !!state[key];
    else
        hydratedConditional = !!data.compute(state);
    if (modifier === 'hidden')
        el.hidden = !hydratedConditional;
    else
        el.style.display = hydratedConditional === false ? 'none' : null;
};

const inputCallback = (el, hydratedValue, data, state) => {
    const isNumber = typeof hydratedValue === 'number' && !isNaN(el.value);
    const isBoolean = typeof hydratedValue === 'boolean' && (el.value === 'true' || el.value === 'false');
    const isNullish = (hydratedValue === null || hydratedValue === undefined) &&
        (el.value === 'null' || el.value === 'undefined');
    let payload;
    if (isNumber) {
        payload = Number(el.value).toPrecision();
    }
    else if (isBoolean) {
        payload = el.value === 'true';
    }
    else if (isNullish) {
        if (el.value === 'null')
            payload = null;
        else
            payload = undefined;
    }
    else {
        payload = String(el.value);
    }
    if (Object.keys(state).includes(data.value))
        state[data.value] = payload;
    else {
        computeExpression(`${data.value} = ${typeof payload === 'string' ? `'${payload}'` : payload}`)(state);
    }
};
const modelDirective = ({ el: awaitingTypecastEl, name, data, state }) => {
    const el = awaitingTypecastEl;
    const hydratedValue = data.compute(state);
    if (el.value !== hydratedValue) {
        el.value = hydratedValue;
    }
    const [, prop] = name.split('.');
    const callback = () => inputCallback(el, hydratedValue, data, state);
    if (prop === 'debounce')
        el.onchange = callback;
    else
        el.oninput = callback;
};

const onDirective = ({ el, name, data, state }) => {
    const options = {};
    if (el.__l_on_registered)
        return;
    const [directiveAndEventName, prop] = name.split('.');
    const eventName = directiveAndEventName.split(':')[1];
    const eventProp = prop || null;
    const handler = ($event) => {
        if (eventProp === 'prevent')
            $event.preventDefault();
        if (eventProp === 'stop')
            $event.stopPropagation();
        data.compute(state);
    };
    options.once = eventProp === 'once';
    options.passive = eventProp === 'passive';
    el.addEventListener(eventName, handler, options);
    el.__l_on_registered = handler;
};

const textDirective = ({ el, data, state }) => {
    const key = data.value.replace(semicolonCaptureRE(), '');
    if (key in state)
        el.textContent = String(state[key]);
    else
        el.textContent = data.compute(state) ?? data.value;
};

const forDirective = ({ el, data, state }) => {
    const [expression, target] = data.value.split(/in +/g);
    const [item, index] = expression.replace(parenthesisWrapReplaceRE(), '').split(',');
    const currArray = state[target];
    let template = String(el.__l_for_template);
    if (el.innerHTML.trim() === template)
        el.innerHTML = '';
    const arrayDiff = currArray.length - el.children.length;
    if (currArray.length === 0)
        el.innerHTML = '';
    else if (arrayDiff !== 0) {
        for (let i = Math.abs(arrayDiff); i > 0; i--) {
            if (arrayDiff < 0)
                el.removeChild(el.lastChild);
            else {
                const temp = document.createElement('div');
                let content = template;
                if (item) {
                    content = content.replace(expressionPropRE(item.trim()), `${target}[${currArray.length - i}]`);
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
    const ast = compile(el, state);
    patch(ast, directives, state, data.keys);
};

const directives = {
    BIND: bindDirective,
    HTML: htmlDirective,
    IF: ifDirective,
    MODEL: modelDirective,
    ON: onDirective,
    TEXT: textDirective,
    FOR: forDirective,
};
const renderDirective = (props, directives) => {
    const name = props.name.split(rawDirectiveSplitRE())[0];
    directives[name.toUpperCase()](props);
};

const arrayEquals = (firstArray, secondArray) => {
    return (firstArray instanceof Array &&
        secondArray instanceof Array &&
        firstArray.length === secondArray.length &&
        firstArray.every((value, i) => value === secondArray[i]));
};

const reactive = (state, callback) => {
    const handler = {
        get(target, key) {
            if (typeof target[key] === 'object' && target[key] !== null) {
                return new Proxy(target[key], handler);
            }
            else {
                return target[key];
            }
        },
        set(target, key, value) {
            const hasArrayMutationKey = !isNaN(Number(key)) || key === 'length';
            if (typeof state[key] === 'function') {
                return false;
            }
            else if (target instanceof Array && hasArrayMutationKey) {
                target[key] = value;
                const keys = Object.keys(state).filter((k) => arrayEquals(state[k], target));
                if (keys.length !== 0)
                    callback(keys);
            }
            else {
                target[key] = value;
                if (Object.keys(state).some((key) => !target[key])) {
                    callback(Object.keys(state).filter((key) => typeof state[key] === 'object'));
                }
                else {
                    callback([key]);
                }
            }
            return true;
        },
    };
    return new Proxy(Object.seal(state), handler);
};

class App {
    constructor(state = {}) {
        this.state = state;
        this.directives = {};
    }
    mount(el) {
        const rootEl = typeof el === 'string' ? document.querySelector(el) : el;
        this.ast = compile(rootEl, this.state);
        this.state = reactive(this.state, this.render.bind(this));
        this.directives = { ...this.directives, ...directives };
        this.render(Object.keys(this.state));
        rootEl.__l = this;
        return this.state;
    }
    directive(name, callback) {
        this.directives[name.toUpperCase()] = callback;
    }
    render(keys) {
        patch(this.ast, directives, this.state, keys || Object.keys(this.state));
    }
}
const createApp = (state) => new App(state);

const stateDirective = `${DIRECTIVE_PREFIX}state`;
const init = (element = document) => {
    const elements = [...element.querySelectorAll(`[${stateDirective}]`)];
    elements
        .filter((el) => el.__l === undefined)
        .map((el) => {
        const expression = el.getAttribute(stateDirective);
        try {
            const state = new Function(`return ${expression}`)();
            const app = createApp(state || {});
            app.mount(el);
        }
        catch (err) {
            console.warn(`Lucia Error: "${err}"\n\nExpression: "${expression}"\nElement:`, el);
        }
    });
};
const listen = (callback, element = document) => {
    const observer = new MutationObserver((mutations) => {
        mutations.map((mut) => {
            if (mut.addedNodes.length > 0) {
                mut.addedNodes.forEach((node) => {
                    if (node.nodeType !== 1)
                        return;
                    if (node.parentElement && node.parentElement.closest(`[${stateDirective}]`))
                        return;
                    if (!node.getAttribute(stateDirective))
                        return;
                    callback(node.parentElement);
                });
            }
            else if (mut.type === 'attributes') {
                if (mut.target.parentElement && mut.target.parentElement.closest(`[${stateDirective}]`))
                    return;
                callback(mut.target.parentElement);
            }
        });
    });
    observer.observe(element, {
        childList: true,
        attributes: true,
        subtree: true,
    });
};

export { compile, createApp, directives, init, listen, patch, reactive, renderDirective };
