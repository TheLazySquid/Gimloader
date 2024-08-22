/**
 * @name CharacterCustomization
 * @description Allows you to use any gim or a custom gim client-side
 * @author TheLazySquid
 * @version 0.4.0
 * @reloadRequired ingame
 * @downloadUrl https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/plugins/CharacterCustomization/build/CharacterCustomization.js
 */
/** @returns {void} */
function noop() {}

function run(fn) {
	return fn();
}

function blank_object() {
	return Object.create(null);
}

/**
 * @param {Function[]} fns
 * @returns {void}
 */
function run_all(fns) {
	fns.forEach(run);
}

/**
 * @param {any} thing
 * @returns {thing is Function}
 */
function is_function(thing) {
	return typeof thing === 'function';
}

/** @returns {boolean} */
function safe_not_equal(a, b) {
	return a != a ? b == b : a !== b || (a && typeof a === 'object') || typeof a === 'function';
}

/** @returns {boolean} */
function is_empty(obj) {
	return Object.keys(obj).length === 0;
}

/**
 * @param {Node} target
 * @param {Node} node
 * @returns {void}
 */
function append(target, node) {
	target.appendChild(node);
}

/**
 * @param {Node} target
 * @param {string} style_sheet_id
 * @param {string} styles
 * @returns {void}
 */
function append_styles(target, style_sheet_id, styles) {
	const append_styles_to = get_root_for_style(target);
	if (!append_styles_to.getElementById(style_sheet_id)) {
		const style = element('style');
		style.id = style_sheet_id;
		style.textContent = styles;
		append_stylesheet(append_styles_to, style);
	}
}

/**
 * @param {Node} node
 * @returns {ShadowRoot | Document}
 */
function get_root_for_style(node) {
	if (!node) return document;
	const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
	if (root && /** @type {ShadowRoot} */ (root).host) {
		return /** @type {ShadowRoot} */ (root);
	}
	return node.ownerDocument;
}

/**
 * @param {ShadowRoot | Document} node
 * @param {HTMLStyleElement} style
 * @returns {CSSStyleSheet}
 */
function append_stylesheet(node, style) {
	append(/** @type {Document} */ (node).head || node, style);
	return style.sheet;
}

/**
 * @param {Node} target
 * @param {Node} node
 * @param {Node} [anchor]
 * @returns {void}
 */
function insert(target, node, anchor) {
	target.insertBefore(node, anchor || null);
}

/**
 * @param {Node} node
 * @returns {void}
 */
function detach(node) {
	if (node.parentNode) {
		node.parentNode.removeChild(node);
	}
}

/**
 * @returns {void} */
function destroy_each(iterations, detaching) {
	for (let i = 0; i < iterations.length; i += 1) {
		if (iterations[i]) iterations[i].d(detaching);
	}
}

/**
 * @template {keyof HTMLElementTagNameMap} K
 * @param {K} name
 * @returns {HTMLElementTagNameMap[K]}
 */
function element(name) {
	return document.createElement(name);
}

/**
 * @param {string} data
 * @returns {Text}
 */
function text(data) {
	return document.createTextNode(data);
}

/**
 * @returns {Text} */
function space() {
	return text(' ');
}

/**
 * @returns {Text} */
function empty() {
	return text('');
}

/**
 * @param {EventTarget} node
 * @param {string} event
 * @param {EventListenerOrEventListenerObject} handler
 * @param {boolean | AddEventListenerOptions | EventListenerOptions} [options]
 * @returns {() => void}
 */
function listen(node, event, handler, options) {
	node.addEventListener(event, handler, options);
	return () => node.removeEventListener(event, handler, options);
}

/**
 * @param {Element} node
 * @param {string} attribute
 * @param {string} [value]
 * @returns {void}
 */
function attr(node, attribute, value) {
	if (value == null) node.removeAttribute(attribute);
	else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
}

/**
 * @param {Element} element
 * @returns {ChildNode[]}
 */
function children(element) {
	return Array.from(element.childNodes);
}

/**
 * @param {Text} text
 * @param {unknown} data
 * @returns {void}
 */
function set_data(text, data) {
	data = '' + data;
	if (text.data === data) return;
	text.data = /** @type {string} */ (data);
}

/**
 * @returns {void} */
function set_input_value(input, value) {
	input.value = value == null ? '' : value;
}

/**
 * @returns {void} */
function set_style(node, key, value, important) {
	if (value == null) {
		node.style.removeProperty(key);
	} else {
		node.style.setProperty(key, value, '');
	}
}

/**
 * @returns {void} */
function select_option(select, value, mounting) {
	for (let i = 0; i < select.options.length; i += 1) {
		const option = select.options[i];
		if (option.__value === value) {
			option.selected = true;
			return;
		}
	}
	if (!mounting || value !== undefined) {
		select.selectedIndex = -1; // no option should be selected
	}
}

function select_value(select) {
	const selected_option = select.querySelector(':checked');
	return selected_option && selected_option.__value;
}

/**
 * @returns {void} */
function toggle_class(element, name, toggle) {
	// The `!!` is required because an `undefined` flag means flipping the current state.
	element.classList.toggle(name, !!toggle);
}

/**
 * @typedef {Node & {
 * 	claim_order?: number;
 * 	hydrate_init?: true;
 * 	actual_end_child?: NodeEx;
 * 	childNodes: NodeListOf<NodeEx>;
 * }} NodeEx
 */

/** @typedef {ChildNode & NodeEx} ChildNodeEx */

/** @typedef {NodeEx & { claim_order: number }} NodeEx2 */

/**
 * @typedef {ChildNodeEx[] & {
 * 	claim_info?: {
 * 		last_index: number;
 * 		total_claimed: number;
 * 	};
 * }} ChildNodeArray
 */

let current_component;

/** @returns {void} */
function set_current_component(component) {
	current_component = component;
}

function get_current_component() {
	if (!current_component) throw new Error('Function called outside component initialization');
	return current_component;
}

/**
 * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
 * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
 * it can be called from an external module).
 *
 * If a function is returned _synchronously_ from `onMount`, it will be called when the component is unmounted.
 *
 * `onMount` does not run inside a [server-side component](https://svelte.dev/docs#run-time-server-side-component-api).
 *
 * https://svelte.dev/docs/svelte#onmount
 * @template T
 * @param {() => import('./private.js').NotFunction<T> | Promise<import('./private.js').NotFunction<T>> | (() => any)} fn
 * @returns {void}
 */
function onMount(fn) {
	get_current_component().$$.on_mount.push(fn);
}

const dirty_components = [];
const binding_callbacks = [];

let render_callbacks = [];

const flush_callbacks = [];

const resolved_promise = /* @__PURE__ */ Promise.resolve();

let update_scheduled = false;

/** @returns {void} */
function schedule_update() {
	if (!update_scheduled) {
		update_scheduled = true;
		resolved_promise.then(flush);
	}
}

/** @returns {void} */
function add_render_callback(fn) {
	render_callbacks.push(fn);
}

// flush() calls callbacks in this order:
// 1. All beforeUpdate callbacks, in order: parents before children
// 2. All bind:this callbacks, in reverse order: children before parents.
// 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
//    for afterUpdates called during the initial onMount, which are called in
//    reverse order: children before parents.
// Since callbacks might update component values, which could trigger another
// call to flush(), the following steps guard against this:
// 1. During beforeUpdate, any updated components will be added to the
//    dirty_components array and will cause a reentrant call to flush(). Because
//    the flush index is kept outside the function, the reentrant call will pick
//    up where the earlier call left off and go through all dirty components. The
//    current_component value is saved and restored so that the reentrant call will
//    not interfere with the "parent" flush() call.
// 2. bind:this callbacks cannot trigger new flush() calls.
// 3. During afterUpdate, any updated components will NOT have their afterUpdate
//    callback called a second time; the seen_callbacks set, outside the flush()
//    function, guarantees this behavior.
const seen_callbacks = new Set();

let flushidx = 0; // Do *not* move this inside the flush() function

/** @returns {void} */
function flush() {
	// Do not reenter flush while dirty components are updated, as this can
	// result in an infinite loop. Instead, let the inner flush handle it.
	// Reentrancy is ok afterwards for bindings etc.
	if (flushidx !== 0) {
		return;
	}
	const saved_component = current_component;
	do {
		// first, call beforeUpdate functions
		// and update components
		try {
			while (flushidx < dirty_components.length) {
				const component = dirty_components[flushidx];
				flushidx++;
				set_current_component(component);
				update(component.$$);
			}
		} catch (e) {
			// reset dirty state to not end up in a deadlocked state and then rethrow
			dirty_components.length = 0;
			flushidx = 0;
			throw e;
		}
		set_current_component(null);
		dirty_components.length = 0;
		flushidx = 0;
		while (binding_callbacks.length) binding_callbacks.pop()();
		// then, once components are updated, call
		// afterUpdate functions. This may cause
		// subsequent updates...
		for (let i = 0; i < render_callbacks.length; i += 1) {
			const callback = render_callbacks[i];
			if (!seen_callbacks.has(callback)) {
				// ...so guard against infinite loops
				seen_callbacks.add(callback);
				callback();
			}
		}
		render_callbacks.length = 0;
	} while (dirty_components.length);
	while (flush_callbacks.length) {
		flush_callbacks.pop()();
	}
	update_scheduled = false;
	seen_callbacks.clear();
	set_current_component(saved_component);
}

/** @returns {void} */
function update($$) {
	if ($$.fragment !== null) {
		$$.update();
		run_all($$.before_update);
		const dirty = $$.dirty;
		$$.dirty = [-1];
		$$.fragment && $$.fragment.p($$.ctx, dirty);
		$$.after_update.forEach(add_render_callback);
	}
}

/**
 * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
 * @param {Function[]} fns
 * @returns {void}
 */
function flush_render_callbacks(fns) {
	const filtered = [];
	const targets = [];
	render_callbacks.forEach((c) => (fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c)));
	targets.forEach((c) => c());
	render_callbacks = filtered;
}

const outroing = new Set();

/**
 * @param {import('./private.js').Fragment} block
 * @param {0 | 1} [local]
 * @returns {void}
 */
function transition_in(block, local) {
	if (block && block.i) {
		outroing.delete(block);
		block.i(local);
	}
}

/** @typedef {1} INTRO */
/** @typedef {0} OUTRO */
/** @typedef {{ direction: 'in' | 'out' | 'both' }} TransitionOptions */
/** @typedef {(node: Element, params: any, options: TransitionOptions) => import('../transition/public.js').TransitionConfig} TransitionFn */

/**
 * @typedef {Object} Outro
 * @property {number} r
 * @property {Function[]} c
 * @property {Object} p
 */

/**
 * @typedef {Object} PendingProgram
 * @property {number} start
 * @property {INTRO|OUTRO} b
 * @property {Outro} [group]
 */

/**
 * @typedef {Object} Program
 * @property {number} a
 * @property {INTRO|OUTRO} b
 * @property {1|-1} d
 * @property {number} duration
 * @property {number} start
 * @property {number} end
 * @property {Outro} [group]
 */

// general each functions:

function ensure_array_like(array_like_or_iterator) {
	return array_like_or_iterator?.length !== undefined
		? array_like_or_iterator
		: Array.from(array_like_or_iterator);
}

/** @returns {void} */
function mount_component(component, target, anchor) {
	const { fragment, after_update } = component.$$;
	fragment && fragment.m(target, anchor);
	// onMount happens before the initial afterUpdate
	add_render_callback(() => {
		const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
		// if the component was destroyed immediately
		// it will update the `$$.on_destroy` reference to `null`.
		// the destructured on_destroy may still reference to the old array
		if (component.$$.on_destroy) {
			component.$$.on_destroy.push(...new_on_destroy);
		} else {
			// Edge case - component was destroyed immediately,
			// most likely as a result of a binding initialising
			run_all(new_on_destroy);
		}
		component.$$.on_mount = [];
	});
	after_update.forEach(add_render_callback);
}

/** @returns {void} */
function destroy_component(component, detaching) {
	const $$ = component.$$;
	if ($$.fragment !== null) {
		flush_render_callbacks($$.after_update);
		run_all($$.on_destroy);
		$$.fragment && $$.fragment.d(detaching);
		// TODO null out other refs, including component.$$ (but need to
		// preserve final state?)
		$$.on_destroy = $$.fragment = null;
		$$.ctx = [];
	}
}

/** @returns {void} */
function make_dirty(component, i) {
	if (component.$$.dirty[0] === -1) {
		dirty_components.push(component);
		schedule_update();
		component.$$.dirty.fill(0);
	}
	component.$$.dirty[(i / 31) | 0] |= 1 << i % 31;
}

// TODO: Document the other params
/**
 * @param {SvelteComponent} component
 * @param {import('./public.js').ComponentConstructorOptions} options
 *
 * @param {import('./utils.js')['not_equal']} not_equal Used to compare props and state values.
 * @param {(target: Element | ShadowRoot) => void} [append_styles] Function that appends styles to the DOM when the component is first initialised.
 * This will be the `add_css` function from the compiled component.
 *
 * @returns {void}
 */
function init(
	component,
	options,
	instance,
	create_fragment,
	not_equal,
	props,
	append_styles = null,
	dirty = [-1]
) {
	const parent_component = current_component;
	set_current_component(component);
	/** @type {import('./private.js').T$$} */
	const $$ = (component.$$ = {
		fragment: null,
		ctx: [],
		// state
		props,
		update: noop,
		not_equal,
		bound: blank_object(),
		// lifecycle
		on_mount: [],
		on_destroy: [],
		on_disconnect: [],
		before_update: [],
		after_update: [],
		context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
		// everything else
		callbacks: blank_object(),
		dirty,
		skip_bound: false,
		root: options.target || parent_component.$$.root
	});
	append_styles && append_styles($$.root);
	let ready = false;
	$$.ctx = instance
		? instance(component, options.props || {}, (i, ret, ...rest) => {
				const value = rest.length ? rest[0] : ret;
				if ($$.ctx && not_equal($$.ctx[i], ($$.ctx[i] = value))) {
					if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value);
					if (ready) make_dirty(component, i);
				}
				return ret;
		  })
		: [];
	$$.update();
	ready = true;
	run_all($$.before_update);
	// `false` as a special case of no DOM component
	$$.fragment = create_fragment ? create_fragment($$.ctx) : false;
	if (options.target) {
		if (options.hydrate) {
			// TODO: what is the correct type here?
			// @ts-expect-error
			const nodes = children(options.target);
			$$.fragment && $$.fragment.l(nodes);
			nodes.forEach(detach);
		} else {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			$$.fragment && $$.fragment.c();
		}
		if (options.intro) transition_in(component.$$.fragment);
		mount_component(component, options.target, options.anchor);
		flush();
	}
	set_current_component(parent_component);
}

/**
 * Base class for Svelte components. Used when dev=false.
 *
 * @template {Record<string, any>} [Props=any]
 * @template {Record<string, any>} [Events=any]
 */
class SvelteComponent {
	/**
	 * ### PRIVATE API
	 *
	 * Do not use, may change at any time
	 *
	 * @type {any}
	 */
	$$ = undefined;
	/**
	 * ### PRIVATE API
	 *
	 * Do not use, may change at any time
	 *
	 * @type {any}
	 */
	$$set = undefined;

	/** @returns {void} */
	$destroy() {
		destroy_component(this, 1);
		this.$destroy = noop;
	}

	/**
	 * @template {Extract<keyof Events, string>} K
	 * @param {K} type
	 * @param {((e: Events[K]) => void) | null | undefined} callback
	 * @returns {() => void}
	 */
	$on(type, callback) {
		if (!is_function(callback)) {
			return noop;
		}
		const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
		callbacks.push(callback);
		return () => {
			const index = callbacks.indexOf(callback);
			if (index !== -1) callbacks.splice(index, 1);
		};
	}

	/**
	 * @param {Partial<Props>} props
	 * @returns {void}
	 */
	$set(props) {
		if (this.$$set && !is_empty(props)) {
			this.$$.skip_bound = true;
			this.$$set(props);
			this.$$.skip_bound = false;
		}
	}
}

/**
 * @typedef {Object} CustomElementPropDefinition
 * @property {string} [attribute]
 * @property {boolean} [reflect]
 * @property {'String'|'Boolean'|'Number'|'Array'|'Object'} [type]
 */

// generated during release, do not modify

const PUBLIC_VERSION = '4';

if (typeof window !== 'undefined')
	// @ts-ignore
	(window.__svelte || (window.__svelte = { v: new Set() })).v.add(PUBLIC_VERSION);

var dist = {};

var core = {};

var debug = {};

Object.defineProperty(debug, "__esModule", { value: true });
debug.throwUnsupportedData = debug.throwUnknownDataType = debug.getType = void 0;
function getType(o) {
    return Object.prototype.toString.call(o);
}
debug.getType = getType;
function throwUnknownDataType(o) {
    throw new TypeError('unsupported data type: ' + getType(o));
}
debug.throwUnknownDataType = throwUnknownDataType;
function throwUnsupportedData(name) {
    throw new TypeError('unsupported data type: ' + name);
}
debug.throwUnsupportedData = throwUnsupportedData;

var encode = {};

var number = {};

Object.defineProperty(number, "__esModule", { value: true });
number.s_to_num = number.int_str_to_s = number.num_to_s = number.big_int_to_s = number.int_to_s = number.s_to_big_int = number.s_to_int = void 0;
let i_to_s = '';
for (let i = 0; i < 10; i++) {
    const c = String.fromCharCode(48 + i);
    i_to_s += c;
}
for (let i = 0; i < 26; i++) {
    const c = String.fromCharCode(65 + i);
    i_to_s += c;
}
for (let i = 0; i < 26; i++) {
    const c = String.fromCharCode(65 + 32 + i);
    i_to_s += c;
}
const N = i_to_s.length;
const s_to_i = {};
for (let i = 0; i < N; i++) {
    const s = i_to_s[i];
    s_to_i[s] = i;
}
function s_to_int(s) {
    let acc = 0;
    let pow = 1;
    for (let i = s.length - 1; i >= 0; i--) {
        const c = s[i];
        let x = s_to_i[c];
        x *= pow;
        acc += x;
        pow *= N;
    }
    return acc;
}
number.s_to_int = s_to_int;
function s_to_big_int(s) {
    let acc = BigInt(0);
    let pow = BigInt(1);
    const n = BigInt(N);
    for (let i = s.length - 1; i >= 0; i--) {
        const c = s[i];
        let x = BigInt(s_to_i[c]);
        x *= pow;
        acc += x;
        pow *= n;
    }
    return acc;
}
number.s_to_big_int = s_to_big_int;
function int_to_s(int) {
    if (int === 0) {
        return i_to_s[0];
    }
    const acc = [];
    while (int !== 0) {
        const i = int % N;
        const c = i_to_s[i];
        acc.push(c);
        int -= i;
        int /= N;
    }
    return acc.reverse().join('');
}
number.int_to_s = int_to_s;
function big_int_to_s(int) {
    const zero = BigInt(0);
    const n = BigInt(N);
    if (int === zero) {
        return i_to_s[0];
    }
    const acc = [];
    while (int !== zero) {
        const i = int % n;
        const c = i_to_s[Number(i)];
        acc.push(c);
        int /= n;
    }
    return acc.reverse().join('');
}
number.big_int_to_s = big_int_to_s;
function reverse(s) {
    return s.split('').reverse().join('');
}
function num_to_s(num) {
    if (num < 0) {
        return '-' + num_to_s(-num);
    }
    let [a, b] = num.toString().split('.');
    if (!b) {
        return int_to_s(num);
    }
    let c;
    if (b) {
        [b, c] = b.split('e');
    }
    a = int_str_to_s(a);
    b = reverse(b);
    b = int_str_to_s(b);
    let str = a + '.' + b;
    if (c) {
        str += '.';
        switch (c[0]) {
            case '+':
                c = c.slice(1);
                break;
            case '-':
                str += '-';
                c = c.slice(1);
                break;
        }
        c = int_str_to_s(c);
        str += c;
    }
    return str;
}
number.num_to_s = num_to_s;
function int_str_to_s(int_str) {
    const num = +int_str;
    if (num.toString() === int_str && num + 1 !== num && num - 1 !== num) {
        return int_to_s(num);
    }
    return ':' + big_int_to_s(BigInt(int_str));
}
number.int_str_to_s = int_str_to_s;
function s_to_int_str(s) {
    if (s[0] === ':') {
        return s_to_big_int(s.substring(1)).toString();
    }
    return s_to_int(s).toString();
}
function s_to_num(s) {
    if (s[0] === '-') {
        return -s_to_num(s.substr(1));
    }
    let [a, b, c] = s.split('.');
    if (!b) {
        return s_to_int(a);
    }
    a = s_to_int_str(a);
    b = s_to_int_str(b);
    b = reverse(b);
    let str = a + '.' + b;
    if (c) {
        str += 'e';
        let neg = false;
        if (c[0] === '-') {
            neg = true;
            c = c.slice(1);
        }
        c = s_to_int_str(c);
        str += neg ? -c : +c;
    }
    return +str;
}
number.s_to_num = s_to_num;

Object.defineProperty(encode, "__esModule", { value: true });
encode.decodeStr = encode.encodeStr = encode.decodeBool = encode.encodeBool = encode.decodeKey = encode.decodeNum = encode.encodeNum = void 0;
const number_1$1 = number;
function encodeNum(num) {
    const a = 'n|' + (0, number_1$1.num_to_s)(num);
    return a;
    // let b = num.toString()
    // return a.length < b.length ? a : num
}
encode.encodeNum = encodeNum;
function decodeNum(s) {
    s = s.replace('n|', '');
    return (0, number_1$1.s_to_num)(s);
}
encode.decodeNum = decodeNum;
function decodeKey(key) {
    return typeof key === 'number' ? key : (0, number_1$1.s_to_int)(key);
}
encode.decodeKey = decodeKey;
function encodeBool(b) {
    // return 'b|' + bool_to_s(b)
    return b ? 'b|T' : 'b|F';
}
encode.encodeBool = encodeBool;
function decodeBool(s) {
    switch (s) {
        case 'b|T':
            return true;
        case 'b|F':
            return false;
    }
    return !!s;
}
encode.decodeBool = decodeBool;
function encodeStr(str) {
    const prefix = str[0] + str[1];
    switch (prefix) {
        case 'b|':
        case 'o|':
        case 'n|':
        case 'a|':
        case 's|':
            str = 's|' + str;
    }
    return str;
}
encode.encodeStr = encodeStr;
function decodeStr(s) {
    const prefix = s[0] + s[1];
    return prefix === 's|' ? s.substr(2) : s;
}
encode.decodeStr = decodeStr;

var memory = {};

var config = {};

Object.defineProperty(config, "__esModule", { value: true });
config.config = void 0;
config.config = {
    // default will not sort the object key
    sort_key: false,
    // default will convert into null silently like JSON.stringify
    error_on_nan: false,
    error_on_infinite: false,
};

Object.defineProperty(memory, "__esModule", { value: true });
memory.addValue = memory.makeInMemoryMemory = memory.makeInMemoryCache = memory.makeInMemoryStore = memory.memToValues = void 0;
const config_1 = config;
const debug_1$1 = debug;
const encode_1$1 = encode;
const number_1 = number;
function memToValues(mem) {
    return mem.store.toArray();
}
memory.memToValues = memToValues;
function makeInMemoryStore() {
    const mem = [];
    return {
        forEach(cb) {
            for (let i = 0; i < mem.length; i++) {
                if (cb(mem[i]) === 'break') {
                    return;
                }
            }
        },
        add(value) {
            mem.push(value);
        },
        toArray() {
            return mem;
        },
    };
}
memory.makeInMemoryStore = makeInMemoryStore;
function makeInMemoryCache() {
    const valueMem = Object.create(null);
    const schemaMem = Object.create(null);
    return {
        getValue(key) {
            return valueMem[key];
        },
        getSchema(key) {
            return schemaMem[key];
        },
        forEachValue(cb) {
            for (const [key, value] of Object.entries(valueMem)) {
                if (cb(key, value) === 'break') {
                    return;
                }
            }
        },
        forEachSchema(cb) {
            for (const [key, value] of Object.entries(schemaMem)) {
                if (cb(key, value) === 'break') {
                    return;
                }
            }
        },
        setValue(key, value) {
            valueMem[key] = value;
        },
        setSchema(key, value) {
            schemaMem[key] = value;
        },
        hasValue(key) {
            return key in valueMem;
        },
        hasSchema(key) {
            return key in schemaMem;
        },
    };
}
memory.makeInMemoryCache = makeInMemoryCache;
function makeInMemoryMemory() {
    return {
        store: makeInMemoryStore(),
        cache: makeInMemoryCache(),
        keyCount: 0,
    };
}
memory.makeInMemoryMemory = makeInMemoryMemory;
function getValueKey(mem, value) {
    if (mem.cache.hasValue(value)) {
        return mem.cache.getValue(value);
    }
    const id = mem.keyCount++;
    const key = (0, number_1.num_to_s)(id);
    mem.store.add(value);
    mem.cache.setValue(value, key);
    return key;
}
/** @remark in-place sort the keys */
function getSchema(mem, keys) {
    if (config_1.config.sort_key) {
        keys.sort();
    }
    const schema = keys.join(',');
    if (mem.cache.hasSchema(schema)) {
        return mem.cache.getSchema(schema);
    }
    const key_id = addValue(mem, keys, undefined);
    mem.cache.setSchema(schema, key_id);
    return key_id;
}
function addValue(mem, o, parent) {
    if (o === null) {
        return '';
    }
    switch (typeof o) {
        case 'undefined':
            if (Array.isArray(parent)) {
                return addValue(mem, null, parent);
            }
            break;
        case 'object':
            if (o === null) {
                return getValueKey(mem, null);
            }
            if (Array.isArray(o)) {
                let acc = 'a';
                for (let i = 0; i < o.length; i++) {
                    const v = o[i];
                    const key = v === null ? '_' : addValue(mem, v, o);
                    acc += '|' + key;
                }
                if (acc === 'a') {
                    acc = 'a|';
                }
                return getValueKey(mem, acc);
            }
            else {
                const keys = Object.keys(o);
                if (keys.length === 0) {
                    return getValueKey(mem, 'o|');
                }
                let acc = 'o';
                const key_id = getSchema(mem, keys);
                acc += '|' + key_id;
                for (const key of keys) {
                    const value = o[key];
                    const v = addValue(mem, value, o);
                    acc += '|' + v;
                }
                return getValueKey(mem, acc);
            }
        case 'boolean':
            return getValueKey(mem, (0, encode_1$1.encodeBool)(o));
        case 'number':
            if (Number.isNaN(o)) {
                if (config_1.config.error_on_nan) {
                    (0, debug_1$1.throwUnsupportedData)('[number NaN]');
                }
                return ''; // treat it as null like JSON.stringify
            }
            if (Number.POSITIVE_INFINITY === o || Number.NEGATIVE_INFINITY === o) {
                if (config_1.config.error_on_infinite) {
                    (0, debug_1$1.throwUnsupportedData)('[number Infinity]');
                }
                return ''; // treat it as null like JSON.stringify
            }
            return getValueKey(mem, (0, encode_1$1.encodeNum)(o));
        case 'string':
            return getValueKey(mem, (0, encode_1$1.encodeStr)(o));
    }
    return (0, debug_1$1.throwUnknownDataType)(o);
}
memory.addValue = addValue;

Object.defineProperty(core, "__esModule", { value: true });
core.decompress = core.decode = core.compress = void 0;
const debug_1 = debug;
const encode_1 = encode;
const memory_1 = memory;
function compress(o) {
    const mem = (0, memory_1.makeInMemoryMemory)();
    const root = (0, memory_1.addValue)(mem, o, undefined);
    const values = (0, memory_1.memToValues)(mem);
    return [values, root];
}
core.compress = compress;
function decodeObject(values, s) {
    if (s === 'o|') {
        return {};
    }
    const o = {};
    const vs = s.split('|');
    const key_id = vs[1];
    let keys = decode(values, key_id);
    const n = vs.length;
    if (n - 2 === 1 && !Array.isArray(keys)) {
        // single-key object using existing value as key
        keys = [keys];
    }
    for (let i = 2; i < n; i++) {
        const k = keys[i - 2];
        let v = vs[i];
        v = decode(values, v);
        o[k] = v;
    }
    return o;
}
function decodeArray(values, s) {
    if (s === 'a|') {
        return [];
    }
    const vs = s.split('|');
    const n = vs.length - 1;
    const xs = new Array(n);
    for (let i = 0; i < n; i++) {
        let v = vs[i + 1];
        v = decode(values, v);
        xs[i] = v;
    }
    return xs;
}
function decode(values, key) {
    if (key === '' || key === '_') {
        return null;
    }
    const id = (0, encode_1.decodeKey)(key);
    const v = values[id];
    if (v === null) {
        return v;
    }
    switch (typeof v) {
        case 'undefined':
            return v;
        case 'number':
            return v;
        case 'string':
            const prefix = v[0] + v[1];
            switch (prefix) {
                case 'b|':
                    return (0, encode_1.decodeBool)(v);
                case 'o|':
                    return decodeObject(values, v);
                case 'n|':
                    return (0, encode_1.decodeNum)(v);
                case 'a|':
                    return decodeArray(values, v);
                default:
                    return (0, encode_1.decodeStr)(v);
            }
    }
    return (0, debug_1.throwUnknownDataType)(v);
}
core.decode = decode;
function decompress(c) {
    const [values, root] = c;
    return decode(values, root);
}
core.decompress = decompress;

var helpers = {};

Object.defineProperty(helpers, "__esModule", { value: true });
helpers.trimUndefinedRecursively = helpers.trimUndefined = void 0;
function trimUndefined(object) {
    for (const key in object) {
        if (object[key] === undefined) {
            delete object[key];
        }
    }
}
helpers.trimUndefined = trimUndefined;
function trimUndefinedRecursively(object) {
    trimUndefinedRecursivelyLoop(object, new Set());
}
helpers.trimUndefinedRecursively = trimUndefinedRecursively;
function trimUndefinedRecursivelyLoop(object, tracks) {
    tracks.add(object);
    for (const key in object) {
        if (object[key] === undefined) {
            delete object[key];
        }
        else {
            const value = object[key];
            if (value && typeof value === 'object' && !tracks.has(value)) {
                trimUndefinedRecursivelyLoop(value, tracks);
            }
        }
    }
}

(function (exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.config = exports.trimUndefinedRecursively = exports.trimUndefined = exports.addValue = exports.decode = exports.decompress = exports.compress = void 0;
	/* for direct usage */
	var core_1 = core;
	Object.defineProperty(exports, "compress", { enumerable: true, get: function () { return core_1.compress; } });
	Object.defineProperty(exports, "decompress", { enumerable: true, get: function () { return core_1.decompress; } });
	/* for custom wrapper */
	var core_2 = core;
	Object.defineProperty(exports, "decode", { enumerable: true, get: function () { return core_2.decode; } });
	var memory_1 = memory;
	Object.defineProperty(exports, "addValue", { enumerable: true, get: function () { return memory_1.addValue; } });
	/* to remove undefined object fields */
	var helpers_1 = helpers;
	Object.defineProperty(exports, "trimUndefined", { enumerable: true, get: function () { return helpers_1.trimUndefined; } });
	Object.defineProperty(exports, "trimUndefinedRecursively", { enumerable: true, get: function () { return helpers_1.trimUndefinedRecursively; } });
	/* to config */
	var config_1 = config;
	Object.defineProperty(exports, "config", { enumerable: true, get: function () { return config_1.config; } }); 
} (dist));

/* src\UI.svelte generated by Svelte v4.2.18 */

function add_css(target) {
	append_styles(target, "svelte-79x94m", ".colors.svelte-79x94m{display:flex;flex-wrap:wrap;gap:10px;width:100%;padding:10px}.color.svelte-79x94m{width:50px;height:50px;border:none}.color.selected.svelte-79x94m{outline:4px solid black}");
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[16] = list[i];
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[19] = list[i];
	child_ctx[21] = i;
	return child_ctx;
}

// (66:36) 
function create_if_block_3(ctx) {
	let button;
	let t0;

	let t1_value = (/*customSkinFile*/ ctx[4]
	? /*customSkinFile*/ ctx[4].name
	: "None") + "";

	let t1;
	let t2;
	let mounted;
	let dispose;

	return {
		c() {
			button = element("button");
			t0 = text("Current: ");
			t1 = text(t1_value);
			t2 = text(".\r\n            Upload skin");
		},
		m(target, anchor) {
			insert(target, button, anchor);
			append(button, t0);
			append(button, t1);
			append(button, t2);

			if (!mounted) {
				dispose = listen(button, "click", /*uploadSkin*/ ctx[7]);
				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty & /*customSkinFile*/ 16 && t1_value !== (t1_value = (/*customSkinFile*/ ctx[4]
			? /*customSkinFile*/ ctx[4].name
			: "None") + "")) set_data(t1, t1_value);
		},
		d(detaching) {
			if (detaching) {
				detach(button);
			}

			mounted = false;
			dispose();
		}
	};
}

// (51:4) {#if skinType === "id"}
function create_if_block_1(ctx) {
	let input;
	let t;
	let if_block_anchor;
	let mounted;
	let dispose;
	let if_block = /*styles*/ ctx[6] && create_if_block_2(ctx);

	return {
		c() {
			input = element("input");
			t = space();
			if (if_block) if_block.c();
			if_block_anchor = empty();
			attr(input, "type", "text");
			attr(input, "placeholder", "Skin ID");
		},
		m(target, anchor) {
			insert(target, input, anchor);
			set_input_value(input, /*skinId*/ ctx[1]);
			insert(target, t, anchor);
			if (if_block) if_block.m(target, anchor);
			insert(target, if_block_anchor, anchor);

			if (!mounted) {
				dispose = [
					listen(input, "input", /*input_input_handler*/ ctx[12]),
					listen(input, "change", /*onSkinIdEntered*/ ctx[8])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty & /*skinId*/ 2 && input.value !== /*skinId*/ ctx[1]) {
				set_input_value(input, /*skinId*/ ctx[1]);
			}

			if (/*styles*/ ctx[6]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_2(ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		d(detaching) {
			if (detaching) {
				detach(input);
				detach(t);
				detach(if_block_anchor);
			}

			if (if_block) if_block.d(detaching);
			mounted = false;
			run_all(dispose);
		}
	};
}

// (54:8) {#if styles}
function create_if_block_2(ctx) {
	let each_1_anchor;
	let each_value = ensure_array_like(/*styles*/ ctx[6].categories);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	return {
		c() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(target, anchor);
				}
			}

			insert(target, each_1_anchor, anchor);
		},
		p(ctx, dirty) {
			if (dirty & /*styles, selectedStyles*/ 96) {
				each_value = ensure_array_like(/*styles*/ ctx[6].categories);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		d(detaching) {
			if (detaching) {
				detach(each_1_anchor);
			}

			destroy_each(each_blocks, detaching);
		}
	};
}

// (58:20) {#each category.options as option, i}
function create_each_block_1(ctx) {
	let button;
	let mounted;
	let dispose;

	function click_handler() {
		return /*click_handler*/ ctx[13](/*category*/ ctx[16], /*option*/ ctx[19]);
	}

	return {
		c() {
			button = element("button");
			attr(button, "class", "color svelte-79x94m");
			set_style(button, "background-color", /*option*/ ctx[19].preview.color);

			toggle_class(button, "selected", /*selectedStyles*/ ctx[5][/*category*/ ctx[16].name]
			? /*selectedStyles*/ ctx[5][/*category*/ ctx[16].name] === /*option*/ ctx[19].name
			: /*i*/ ctx[21] === 0);
		},
		m(target, anchor) {
			insert(target, button, anchor);

			if (!mounted) {
				dispose = listen(button, "click", click_handler);
				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty & /*styles*/ 64) {
				set_style(button, "background-color", /*option*/ ctx[19].preview.color);
			}

			if (dirty & /*selectedStyles, styles*/ 96) {
				toggle_class(button, "selected", /*selectedStyles*/ ctx[5][/*category*/ ctx[16].name]
				? /*selectedStyles*/ ctx[5][/*category*/ ctx[16].name] === /*option*/ ctx[19].name
				: /*i*/ ctx[21] === 0);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(button);
			}

			mounted = false;
			dispose();
		}
	};
}

// (55:12) {#each styles.categories as category}
function create_each_block(ctx) {
	let h2;
	let t0_value = /*category*/ ctx[16].name + "";
	let t0;
	let t1;
	let div;
	let t2;
	let each_value_1 = ensure_array_like(/*category*/ ctx[16].options);
	let each_blocks = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	return {
		c() {
			h2 = element("h2");
			t0 = text(t0_value);
			t1 = space();
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t2 = space();
			attr(div, "class", "colors svelte-79x94m");
		},
		m(target, anchor) {
			insert(target, h2, anchor);
			append(h2, t0);
			insert(target, t1, anchor);
			insert(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(div, null);
				}
			}

			append(div, t2);
		},
		p(ctx, dirty) {
			if (dirty & /*styles*/ 64 && t0_value !== (t0_value = /*category*/ ctx[16].name + "")) set_data(t0, t0_value);

			if (dirty & /*styles, selectedStyles*/ 96) {
				each_value_1 = ensure_array_like(/*category*/ ctx[16].options);
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1(ctx, each_value_1, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_1(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, t2);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value_1.length;
			}
		},
		d(detaching) {
			if (detaching) {
				detach(h2);
				detach(t1);
				detach(div);
			}

			destroy_each(each_blocks, detaching);
		}
	};
}

// (80:4) {#if trailType === "id"}
function create_if_block(ctx) {
	let input;
	let mounted;
	let dispose;

	return {
		c() {
			input = element("input");
			attr(input, "type", "text");
			attr(input, "placeholder", "Trail ID");
		},
		m(target, anchor) {
			insert(target, input, anchor);
			set_input_value(input, /*trailId*/ ctx[3]);

			if (!mounted) {
				dispose = listen(input, "input", /*input_input_handler_1*/ ctx[15]);
				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty & /*trailId*/ 8 && input.value !== /*trailId*/ ctx[3]) {
				set_input_value(input, /*trailId*/ ctx[3]);
			}
		},
		d(detaching) {
			if (detaching) {
				detach(input);
			}

			mounted = false;
			dispose();
		}
	};
}

function create_fragment(ctx) {
	let h10;
	let t1;
	let div0;
	let select0;
	let option0;
	let option1;
	let option2;
	let t5;
	let t6;
	let h11;
	let t8;
	let div1;
	let select1;
	let option3;
	let option4;
	let t11;
	let mounted;
	let dispose;

	function select_block_type(ctx, dirty) {
		if (/*skinType*/ ctx[0] === "id") return create_if_block_1;
		if (/*skinType*/ ctx[0] === "custom") return create_if_block_3;
	}

	let current_block_type = select_block_type(ctx);
	let if_block0 = current_block_type && current_block_type(ctx);
	let if_block1 = /*trailType*/ ctx[2] === "id" && create_if_block(ctx);

	return {
		c() {
			h10 = element("h1");
			h10.textContent = "Skin";
			t1 = space();
			div0 = element("div");
			select0 = element("select");
			option0 = element("option");
			option0.textContent = "Unchanged";
			option1 = element("option");
			option1.textContent = "Any skin by ID";
			option2 = element("option");
			option2.textContent = "Custom";
			t5 = space();
			if (if_block0) if_block0.c();
			t6 = space();
			h11 = element("h1");
			h11.textContent = "Trail";
			t8 = space();
			div1 = element("div");
			select1 = element("select");
			option3 = element("option");
			option3.textContent = "Unchanged";
			option4 = element("option");
			option4.textContent = "Any trail by ID";
			t11 = space();
			if (if_block1) if_block1.c();
			option0.__value = "default";
			set_input_value(option0, option0.__value);
			option1.__value = "id";
			set_input_value(option1, option1.__value);
			option2.__value = "custom";
			set_input_value(option2, option2.__value);
			if (/*skinType*/ ctx[0] === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[11].call(select0));
			option3.__value = "default";
			set_input_value(option3, option3.__value);
			option4.__value = "id";
			set_input_value(option4, option4.__value);
			if (/*trailType*/ ctx[2] === void 0) add_render_callback(() => /*select1_change_handler*/ ctx[14].call(select1));
		},
		m(target, anchor) {
			insert(target, h10, anchor);
			insert(target, t1, anchor);
			insert(target, div0, anchor);
			append(div0, select0);
			append(select0, option0);
			append(select0, option1);
			append(select0, option2);
			select_option(select0, /*skinType*/ ctx[0], true);
			append(div0, t5);
			if (if_block0) if_block0.m(div0, null);
			insert(target, t6, anchor);
			insert(target, h11, anchor);
			insert(target, t8, anchor);
			insert(target, div1, anchor);
			append(div1, select1);
			append(select1, option3);
			append(select1, option4);
			select_option(select1, /*trailType*/ ctx[2], true);
			append(div1, t11);
			if (if_block1) if_block1.m(div1, null);

			if (!mounted) {
				dispose = [
					listen(select0, "change", /*select0_change_handler*/ ctx[11]),
					listen(select1, "change", /*select1_change_handler*/ ctx[14])
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*skinType*/ 1) {
				select_option(select0, /*skinType*/ ctx[0]);
			}

			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
				if_block0.p(ctx, dirty);
			} else {
				if (if_block0) if_block0.d(1);
				if_block0 = current_block_type && current_block_type(ctx);

				if (if_block0) {
					if_block0.c();
					if_block0.m(div0, null);
				}
			}

			if (dirty & /*trailType*/ 4) {
				select_option(select1, /*trailType*/ ctx[2]);
			}

			if (/*trailType*/ ctx[2] === "id") {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block(ctx);
					if_block1.c();
					if_block1.m(div1, null);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) {
				detach(h10);
				detach(t1);
				detach(div0);
				detach(t6);
				detach(h11);
				detach(t8);
				detach(div1);
			}

			if (if_block0) {
				if_block0.d();
			}

			if (if_block1) if_block1.d();
			mounted = false;
			run_all(dispose);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let { cosmeticChanger } = $$props;
	let skinType = cosmeticChanger.skinType;
	let skinId = cosmeticChanger.skinId;
	let trailType = cosmeticChanger.trailType;
	let trailId = cosmeticChanger.trailId;
	let customSkinFile = cosmeticChanger.customSkinFile;
	let selectedStyles = cosmeticChanger.selectedStyles;

	function uploadSkin() {
		let input = document.createElement("input");
		input.type = "file";
		input.accept = ".png";

		input.onchange = () => {
			let file = input.files?.[0];

			if (!file) {
				$$invalidate(4, customSkinFile = null);
			} else {
				$$invalidate(4, customSkinFile = file);
			}
		};

		input.click();
	}

	let styles;

	async function onSkinIdEntered() {
		$$invalidate(6, styles = null);
		if (!skinId) return;
		let url = `https://www.gimkit.com/assets/map/characters/spine/${skinId}.json`;
		let res = await fetch(url);

		if (res.headers.get("content-type")?.startsWith("text/html")) {
			return;
		}

		let json = await res.json();
		let skinData = dist.decompress(json);
		if (skinData.style) $$invalidate(6, styles = skinData.style);
	}

	function save() {
		cosmeticChanger.setSkin(skinType, skinId, customSkinFile, selectedStyles);
		cosmeticChanger.setTrail(trailType, trailId);
	}

	onMount(onSkinIdEntered);

	function select0_change_handler() {
		skinType = select_value(this);
		$$invalidate(0, skinType);
	}

	function input_input_handler() {
		skinId = this.value;
		$$invalidate(1, skinId);
	}

	const click_handler = (category, option) => $$invalidate(5, selectedStyles[category.name] = option.name, selectedStyles);

	function select1_change_handler() {
		trailType = select_value(this);
		$$invalidate(2, trailType);
	}

	function input_input_handler_1() {
		trailId = this.value;
		$$invalidate(3, trailId);
	}

	$$self.$$set = $$props => {
		if ('cosmeticChanger' in $$props) $$invalidate(9, cosmeticChanger = $$props.cosmeticChanger);
	};

	return [
		skinType,
		skinId,
		trailType,
		trailId,
		customSkinFile,
		selectedStyles,
		styles,
		uploadSkin,
		onSkinIdEntered,
		cosmeticChanger,
		save,
		select0_change_handler,
		input_input_handler,
		click_handler,
		select1_change_handler,
		input_input_handler_1
	];
}

class UI extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, { cosmeticChanger: 9, save: 10 }, add_css);
	}

	get save() {
		return this.$$.ctx[10];
	}
}

var atlas = "\r\nsize: 1024,832\r\nformat: RGBA8888\r\nfilter: Linear,Linear\r\nrepeat: none\r\neyes/eye1_KO\r\nbounds:265,32,30,35\r\nrotate:90\r\neyes/eye_KO\r\nbounds:265,32,30,35\r\nrotate:90\r\neyes/eye1_blink1\r\nbounds:374,26,17,29\r\nrotate:90\r\neyes/eye2_blink1\r\nbounds:374,26,17,29\r\nrotate:90\r\neyes/eye_blink1\r\nbounds:374,26,17,29\r\nrotate:90\r\neyes/eye1_blink2\r\nbounds:140,5,18,23\r\neyes/eye_blink2\r\nbounds:140,5,18,23\r\neyes/eye1_blink3\r\nbounds:160,5,23,17\r\nrotate:90\r\neyes/eye_blink3\r\nbounds:160,5,23,17\r\nrotate:90\r\neyes/eye1_closed\r\nbounds:336,45,41,17\r\neyes/eye_closed\r\nbounds:336,45,41,17\r\neyes/eye1_closed2\r\nbounds:302,32,30,32\r\nrotate:90\r\neyes/eye_closed2\r\nbounds:302,32,30,32\r\nrotate:90\r\neyes/eye1_cute\r\nbounds:464,45,17,36\r\nrotate:90\r\neyes/eye_cute\r\nbounds:464,45,17,36\r\nrotate:90\r\neyes/eye1_frown\r\nbounds:81,31,31,46\r\noffsets:0,0,31,47\r\nrotate:90\r\neyes/eye_frown\r\nbounds:81,31,31,46\r\noffsets:0,0,31,47\r\nrotate:90\r\neyes/eye1_happy\r\nbounds:129,30,42,32\r\neyes/eye_happy\r\nbounds:129,30,42,32\r\neyes/eye1_happy2\r\nbounds:81,2,37,27\r\neyes/eye_happy2\r\nbounds:81,2,37,27\r\neyes/eye1_kawaii\r\nbounds:173,37,25,44\r\nrotate:90\r\neyes/eye_kawaii\r\nbounds:173,37,25,44\r\nrotate:90\r\neyes/eye1_open\r\nbounds:336,26,17,36\r\nrotate:90\r\neyes/eye2_open\r\nbounds:336,26,17,36\r\nrotate:90\r\neyes/eye_open\r\nbounds:336,26,17,36\r\nrotate:90\r\neyes/eye1_shiny\r\nbounds:219,37,25,44\r\nrotate:90\r\neyes/eye_shiny\r\nbounds:219,37,25,44\r\nrotate:90\r\neyes/eye2_blink2\r\nbounds:179,12,18,23\r\neyes/eye2_blink3\r\nbounds:120,2,22,18\r\nrotate:90\r\neyes/eye2_closed\r\nbounds:379,45,41,17\r\neyes/eyeL_sad\r\nbounds:2,17,40,45\r\neyes/eyeR_sad\r\nbounds:44,18,35,44\r\neyes/eye_closedDown\r\nbounds:422,46,40,16\r\nfx/eyeGlow\r\nbounds:450,271,47,47\r\noffsets:10,7,63,59\r\nfx/fx_angry\r\nbounds:451,228,40,41\r\nfx/fx_blush\r\nbounds:210,183,41,38\r\noffsets:1,1,43,40\r\nfx/fx_gradientDownUp\r\nbounds:2,191,206,127\r\noffsets:0,0,206,130\r\nfx/fx_gradientUpDown\r\nbounds:2,92,196,97\r\noffsets:0,3,196,100\r\nfx/fx_line\r\nbounds:200,161,28,8\r\nrotate:90\r\nfx/fx_sparkle1\r\nbounds:31,66,20,24\r\nfx/fx_sparkle2\r\nbounds:2,66,24,27\r\nrotate:90\r\nfx/fx_sparkle3\r\nbounds:333,207,21,23\r\nfx/fx_star1\r\nbounds:253,183,38,37\r\nrotate:90\r\nfx/fx_star2\r\nbounds:356,211,19,16\r\nrotate:90\r\nfx/fx_starExpl1\r\nbounds:53,72,19,18\r\nfx/fx_starExpl2\r\nbounds:210,163,19,18\r\nfx/fx_sweatDrop\r\nbounds:292,202,39,28\r\nfx/fx_whiteDot\r\nbounds:292,188,12,12\r\nfx/leg_LongL_black\r\nbounds:210,223,80,95\r\nfx/leg_LongL_shadow1\r\nbounds:374,268,74,50\r\noffsets:6,45,80,95\r\nfx/leg_LongR_black\r\nbounds:292,232,80,86\r\noffsets:1,0,81,86\r\nfx/leg_LongR_shadow1\r\nbounds:374,219,75,47\r\noffsets:1,39,81,86\r\nskins/default_gray/body\r\nbounds:216,417,212,157\r\nskins/default_gray/legL\r\nbounds:216,322,80,93\r\nskins/default_gray/legR\r\nbounds:656,493,80,81\r\nskins/default_gray/legSittingL\r\nbounds:430,483,111,91\r\nskins/default_gray/legSittingR\r\nbounds:543,483,111,91\r\nskins/default_gray/template\r\nbounds:2,380,212,194\r\nskins/test/body\r\nbounds:2,673,212,157\r\nskins/test/legL\r\nbounds:2,578,80,93\r\nskins/test/legR\r\nbounds:329,749,80,81\r\nskins/test/legSittingL\r\nbounds:216,739,111,91\r\nskins/test/legSittingR\r\nbounds:84,580,111,91\r\n";

var json = "[[\"skeleton\",\"bones\",\"slots\",\"transform\",\"physics\",\"skins\",\"events\",\"animations\",\"a|0|1|2|3|4|5|6|7\",\"hash\",\"spine\",\"x\",\"y\",\"width\",\"height\",\"fps\",\"images\",\"audio\",\"a|9|A|B|C|D|E|F|G|H\",\"wOHcYvmceV0\",\"4.2.33\",\"n|-28.p\",\"n|-F.13\",\"n|4C.10\",\"n|36.I\",\"n|O\",\"../images/\",\"./audio\",\"o|I|J|K|L|M|N|O|P|Q|R\",\"name\",\"scaleX\",\"scaleY\",\"a|T|U|V\",\"root\",\"n|0.3\",\"o|W|X|Y|Y\",\"parent\",\"color\",\"icon\",\"a|T|a|C|b|c\",\"core/hip\",\"n|2Q\",\"ffc900ff\",\"asterisk\",\"o|d|e|X|f|g|h\",\"length\",\"rotation\",\"shearY\",\"a|T|a|j|k|C|l|b\",\"core/body\",\"n|2o.A\",\"n|1S.18\",\"n|1Y.I\",\"n|-0.A\",\"abe323ff\",\"o|m|n|e|o|p|q|r|s\",\"a|T|a|k|B|C|b|c\",\"core/blush2\",\"n|-1S\",\"n|-6.11\",\"n|-3f.1D\",\"ff4bfbff\",\"star\",\"o|u|v|n|w|x|y|z|10\",\"core/blush1\",\"n|2O.4\",\"o|u|12|n|w|x|13|z|10\",\"a|T|a|j|B|C|b\",\"core/fx\",\"n|1c\",\"n|77.N\",\"n|3B.1X\",\"o|15|16|e|17|18|19|z\",\"a|T|a|j|k|B|C|b\",\"core/fx2\",\"n|Z.1N\",\"n|6b.1W\",\"n|5U.1S\",\"o|1B|1C|e|17|1D|1E|1F|z\",\"core/fx3\",\"n|-Z\",\"n|l.5\",\"o|1B|1H|e|17|1I|1E|1J|z\",\"core/fx4\",\"n|-2L\",\"n|-7W.2\",\"o|1B|1L|e|17|1M|1N|1J|z\",\"core/fx5\",\"n|2u\",\"n|-70.1B\",\"o|1B|1P|e|17|1Q|1R|19|z\",\"core/fx6\",\"n|2B\",\"o|1B|1T|e|17|1U|1N|1F|z\",\"core/legL_1\",\"n|18.f\",\"n|-1Z.q\",\"n|-2E.1F\",\"n|1I.k\",\"ff3c3cff\",\"o|1B|1W|e|1X|1Y|1Z|1a|1b\",\"a|T|a|j|B|b\",\"core/legL_2\",\"o|1d|1e|1W|1X|1X|1b\",\"core/legL_3\",\"o|1d|1g|1e|1X|1X|1b\",\"core/legL_4\",\"n|z.x\",\"n|0.U\",\"o|15|1i|1g|1X|1j|1k|1b\",\"core/legR_1\",\"n|14.1G\",\"n|-1J.w\",\"n|2S.1J\",\"n|1I\",\"1bff33ff\",\"o|1B|1m|e|1n|1o|1p|1q|1r\",\"core/legR_2\",\"o|1d|1t|1m|1n|1n|1r\",\"core/legR_3\",\"o|1d|1v|1t|1n|1n|1r\",\"core/legR_4\",\"o|1d|1x|1v|1n|1n|1r\",\"a|T\",\"~\",\"o|1z|20\",\"core/head_inverse\",\"n|-1Q.S\",\"n|15.1X\",\"n|-g.q\",\"e322d923\",\"warning\",\"o|u|22|n|23|24|25|26|27\",\"eyes/container\",\"n|v.1O\",\"n|1c.19\",\"n|-g.P\",\"f61f1fff\",\"o|15|29|n|2A|2B|2C|2D\",\"a|T|a|k|B|C|U|V|b|c\",\"core/eyes/head_CTRL\",\"n|-1S.1M\",\"n|-W.14\",\"n|1.1E\",\"n|3.5N\",\"ff2c2cff\",\"arrows\",\"o|2F|2G|29|2H|2I|2J|2K|2K|2L|2M\",\"a|T|a|k|B|C|U|V|b\",\"core/eyeL\",\"n|1S.1M\",\"n|-U.1K\",\"n|0.Q\",\"o|2O|2P|2G|2Q|2R|2S|Y|Y|2L\",\"core/eyeR\",\"n|Y.K\",\"n|1.4\",\"o|2O|2U|2G|2Q|2V|2W|Y|Y|2L\",\"skin\",\"a|T|a|j|B|C|2Y|b\",\"core/glasses\",\"n|21.b\",\"n|1C.G\",\"n|-15.Y\",\"b|T\",\"o|2Z|2a|n|2b|2c|2d|2e|s\",\"a|Z|i|t|11|14|1A|1G|1K|1O|1S|1V|1c|1f|1h|1l|1s|1u|1w|1y|21|21|21|21|28|21|2E|2N|2T|2X|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|2f|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21|21\",\"bone\",\"attachment\",\"a|T|2h|2i\",\"core-legR\",\"o|2j|2k|e|2k\",\"core-legL\",\"o|2j|2m|e|2m\",\"core-body_below\",\"o|2j|2o|n|2o\",\"dark\",\"a|T|2h|2q|2i\",\"core-body\",\"000000\",\"core-body-basic\",\"o|2r|2s|n|2t|2u\",\"a|T|2h\",\"Above body/core-body-fx\",\"o|2w|2x|n\",\"Above body/core-eye2\",\"eye2_open\",\"o|2r|2z|2U|2t|30\",\"Above body/core-eye1\",\"eye1_open\",\"o|2r|32|2P|2t|33\",\"a|2l|2n|2p|2v|2y|31|34\",\"target\",\"a|T|1|36\",\"a|\",\"o|37|20|38|20\",\"order\",\"mixX\",\"mixScaleX\",\"mixShearY\",\"a|T|3A|1|36|B|C|3B|3C|3D\",\"core-eyeR-rotation_CNSTR\",\"n|1h\",\"a|2U\",\"n|-S.x\",\"n|-1n.L\",\"n|0\",\"o|3E|3F|3G|3H|29|3I|3J|3K|3K|3K\",\"mixRotate\",\"a|T|3A|2Y|1|36|B|3M|3C|3D\",\"core-glasses-CNSTR_120%\",\"n|1V\",\"a|2a\",\"n|6\",\"o|3N|3O|3P|2e|3Q|2G|3R|3K|3K|3K\",\"a|T|1|36|k|B|C|U|V|3M|3B|3C|3D\",\"eyes-head_inverse_CNSTR\",\"a|22\",\"n|0.s\",\"n|0.B\",\"n|-0.e\",\"n|-0.2bE\",\"n|-1\",\"o|3T|3U|3V|2G|3W|3X|3Y|3Z|3Z|3a|3a|3a|3a\",\"a|T|3A|1|36|k|B|C|U|V|3M|3B|3C|3D\",\"eyes-short-2%\",\"n|1j\",\"a|2G\",\"n|-2.1G\",\"n|-8.C\",\"n|-0.p\",\"n|0.2bE\",\"n|0.K\",\"o|3c|3d|3e|3f|22|3g|3h|3i|3j|3j|3K|3k|3K|3K\",\"a|T|3A|2Y|1|36|k|B|C|U|V|3M|3B|3C|3D\",\"eyes-short-10%\",\"n|J\",\"n|-2.5\",\"n|-0.1A\",\"n|0.1\",\"o|3m|3n|3o|2e|3f|22|3g|3p|3q|3j|3j|3K|3r|3K|3K\",\"eyes-short-15%\",\"n|K\",\"n|1.C\",\"n|-0.r\",\"n|0.p\",\"o|3m|3t|3u|2e|3f|22|3g|3v|3w|3j|3j|3K|3x|3K|3K\",\"eyes-short-25%\",\"n|w\",\"n|-2.t\",\"n|-0.1T\",\"n|0.q\",\"o|3c|3z|40|3f|22|3g|41|42|3j|3j|3K|43|3K|3K\",\"eyes-short_5%\",\"n|29\",\"n|-0.s\",\"n|-6.1X\",\"n|-0.19\",\"n|0.o\",\"o|3m|45|46|2e|3f|22|47|48|49|3j|3j|3K|4A|3K|3K\",\"eyes_short_40%\",\"n|1l\",\"n|0.4\",\"o|3m|4C|4D|2e|3f|22|3g|3v|3w|3j|3j|3K|4E|3K|3K\",\"eyes_short_CNSTR\",\"n|I\",\"o|3m|4G|4H|2e|3f|22|3g|3p|3q|3j|3j|3K|Y|3K|3K\",\"a|T|3A|2Y|1|36|3M|3B|3C|3D\",\"glasses_CNSTR\",\"n|L\",\"o|4J|4K|4L|2e|3Q|2G|3K|Y|3K|3K\",\"a|39|39|39|39|39|39|39|39|3L|3S|39|39|39|39|39|39|39|39|39|39|39|3b|3l|3s|3y|44|4B|4F|4I|39|39|39|39|39|39|39|39|4M|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39|39\",\"inertia\",\"damping\",\"a|T|3A|2h|B|C|4O|4P\",\"core-eyes-head_CTRL\",\"n|D\",\"n|0.1ua\",\"n|0.2Dw\",\"n|0.5\",\"n|0.w\",\"o|4Q|4R|4S|2G|4T|4U|4V|4W\",\"a|4X\",\"attachments\",\"a|T|4Z\",\"default\",\"o|\",\"o|4a|4b|4c\",\"customSkin\",\"a|2s|2m|2k|2x|32|2z\",\"a|2u\",\"type\",\"a|T|4h|2Y|a|D|E\",\"skins/default_gray/body\",\"linkedmesh\",\"test\",\"n|BQ\",\"n|8S\",\"o|4i|4j|4k|4l|2u|4m|4n\",\"o|4g|4o\",\"core-legL_sitting\",\"a|2m|4q\",\"skins/default_gray/legL\",\"n|4I\",\"n|4z\",\"o|4i|4s|4k|4l|2m|4t|4u\",\"skins/default_gray/legSittingL\",\"n|5y\",\"n|4s\",\"o|4i|4w|4k|4l|4q|4x|4y\",\"o|4r|4v|4z\",\"core-legR_sitting\",\"a|2k|51\",\"skins/default_gray/legR\",\"n|4M\",\"o|4i|53|4k|4l|2k|4t|54\",\"skins/default_gray/legSittingR\",\"o|4i|56|4k|4l|51|4x|4y\",\"o|52|55|57\",\"core-body-fx\",\"a|59\",\"a|T|b|B|C|k|D|E\",\"fx/fx_gradientUpDown\",\"ff5656ff\",\"n|2Q.15\",\"n|-5.p\",\"n|AX\",\"n|5O\",\"o|5B|5C|5D|5E|5F|w|5G|5H\",\"o|5A|5I\",\"eye1_blink1\",\"eye1_blink2\",\"eye1_blink3\",\"eye1_closedUp\",\"eye1_wink\",\"eye1_closedDown\",\"eye1_cute\",\"eye1_frown\",\"eye1_happy\",\"eye1_happy2\",\"eye1_kawaii\",\"eye1_KO\",\"a|33|5K|5L|5M|5N|5O|5P|5Q|5R|5S|5T|5U|5V\",\"a|T|B|C|k|D|E\",\"eyes/eye2_open\",\"n|0.10\",\"n|2.1A\",\"n|-1R.1Z\",\"n|1x\",\"o|5X|5Y|5Z|5a|5b|40|5c\",\"eyes/eye_blink1\",\"n|-1.u\",\"n|4.A\",\"n|-1S.Q\",\"n|u\",\"n|1Z\",\"o|5X|5e|5f|5g|5h|5i|5j\",\"eyes/eye_blink2\",\"n|1.1H\",\"n|4.V\",\"n|x\",\"n|1E\",\"o|5X|5l|5m|5n|5h|5o|5p\",\"eyes/eye_blink3\",\"n|-1.11\",\"n|2.D\",\"n|1D\",\"o|5X|5r|5s|5t|5h|5u|40\",\"eyes/eye_closed\",\"n|-3.1L\",\"n|6.A\",\"o|5X|5w|5x|5y|5h|1U|5i\",\"a|T|B|C|U|k|D|E\",\"eyes/eye_closed2\",\"n|-0.1b\",\"n|7.1P\",\"n|1k\",\"o|60|61|62|63|3a|5h|17|64\",\"eyes/eye_closedDown\",\"n|-1N.2\",\"n|s\",\"o|5X|66|5x|5y|67|46|68\",\"eyes/eye_cute\",\"n|-1.l\",\"n|2.18\",\"n|t\",\"n|1v\",\"o|5X|6A|6B|6C|5h|6D|6E\",\"eyes/eye_frown\",\"n|I.T\",\"n|C.J\",\"n|1g\",\"n|2V\",\"o|5X|6G|6H|6I|5h|6J|6K\",\"eyes/eye_happy\",\"n|3.j\",\"n|1.x\",\"n|2H\",\"o|5X|6M|6N|6O|5h|6P|3G\",\"eyes/eye_happy2\",\"n|6.1H\",\"n|1.1W\",\"n|1y\",\"n|1T\",\"o|5X|6R|6S|6T|5h|6U|6V\",\"eyes/eye_kawaii\",\"n|1.1T\",\"n|2.R\",\"n|1L\",\"n|2M\",\"o|5X|6X|6Y|6Z|5h|6a|6b\",\"eyes/eye_KO\",\"n|-1.v\",\"n|1.W\",\"n|1b\",\"n|1r\",\"o|5X|6d|6e|6f|5h|6g|6h\",\"o|5W|5d|5k|5q|5v|5z|65|69|6F|6L|6Q|6W|6c|6i\",\"eye2_blink1\",\"eye2_blink2\",\"eye2_blink3\",\"eye2_closed\",\"eye2_closed2\",\"eye2_closedDown\",\"eye2_cute\",\"eye2_frown\",\"eye2_happy\",\"eye2_happy2\",\"eye2_kawaii\",\"eye2_KO\",\"a|30|6k|6l|6m|6n|6o|6p|6q|6r|6s|6t|6u|6v\",\"n|0.12\",\"n|2.1S\",\"n|-1R.1J\",\"o|5X|5Y|6x|6y|6z|40|5c\",\"a|T|B|C|V|k|D|E\",\"n|-1.a\",\"n|3.17\",\"n|-1S.A\",\"o|71|5e|72|73|3a|74|5i|5j\",\"n|2.3\",\"o|71|5l|76|5n|3a|74|5o|5p\",\"n|-1.3\",\"n|2.B\",\"o|71|5r|78|79|3a|74|5u|40\",\"n|-3.j\",\"n|6.B\",\"o|60|5w|7B|7C|3a|74|1U|5i\",\"n|-0.17\",\"n|8.y\",\"o|5X|61|7E|7F|74|17|64\",\"n|-1M.1X\",\"o|5X|66|7B|7C|7H|46|68\",\"n|-1.H\",\"n|1.m\",\"o|5X|6A|7J|7K|74|6D|6E\",\"n|K.1X\",\"n|-D.l\",\"o|60|6G|7M|7N|3a|74|6J|6K\",\"n|4.K\",\"n|1.1P\",\"o|60|6M|7P|7Q|3a|74|6P|3G\",\"n|7.v\",\"n|1.N\",\"o|60|6R|7S|7T|3a|74|6U|6V\",\"n|1.1C\",\"n|2.1X\",\"o|5X|6X|7V|7W|74|6a|6b\",\"n|0.d\",\"o|5X|6d|7J|7Y|74|6g|6h\",\"o|6w|70|75|77|7A|7D|7G|7I|7L|7O|7R|7U|7X|7Z\",\"o|4f|4p|50|58|5J|6j|7a\",\"o|4a|4e|7b\",\"uvs\",\"triangles\",\"vertices\",\"hull\",\"edges\",\"a|T|4h|7d|7e|7f|7g|7h|D|E\",\"skins/test/body\",\"mesh\",\"n|0.7P9\",\"n|0.81G\",\"n|0.FNC\",\"n|0.LmL\",\"n|0.NFb\",\"n|0.2RA\",\"n|0.Q0t\",\"n|0.5pg\",\"n|0.H23\",\"n|0.7t\",\"n|0.6CT\",\"n|0.4Mw\",\"n|0.NUQ\",\"n|0.A5l\",\"n|0.MBJ\",\"n|0.Psm\",\"n|0.7ED\",\"n|0.IzL\",\"n|1\",\"n|0.E33\",\"n|0.7Ix\",\"n|0.682\",\"n|0.61r\",\"n|0.9hn\",\"n|0.CQw\",\"n|0.Pd2\",\"n|0.F4T\",\"n|0.BRg\",\"n|0.HlX\",\"n|0.6Gi\",\"n|0.OkG\",\"n|0.7eW\",\"n|0.658\",\"n|0.Lx8\",\"n|0.8t\",\"n|0.LUm\",\"n|0.9K4\",\"n|0.AvJ\",\"n|0.Hlr\",\"n|0.Nmm\",\"n|0.4y4\",\"n|0.GAy\",\"n|0.2pr\",\"n|0.C7s\",\"n|0.N7v\",\"n|0.3rJ\",\"n|0.IYh\",\"n|0.9OO\",\"n|0.LHu\",\"n|0.HSO\",\"n|0.3Nb\",\"n|0.ITv\",\"n|0.1yh\",\"n|0.2zk\",\"n|0.FPH\",\"n|0.9G\",\"n|0.JCl\",\"n|0.CV3\",\"n|0.A0u\",\"n|0.PCS\",\"n|0.Kj5\",\"n|0.9sS\",\"n|0.Om2\",\"n|0.OhV\",\"n|0.5Zh\",\"n|0.M0X\",\"n|0.FaW\",\"n|0.Y3\",\"n|0.Cn9\",\"n|0.LXN\",\"n|0.8sw\",\"n|0.CQa\",\"n|0.NNA\",\"n|0.1kz\",\"n|0.646\",\"n|0.5CY\",\"n|0.MOe\",\"n|0.1nb\",\"n|0.Kr9\",\"n|0.TL\",\"n|0.Gzm\",\"n|0.2VS\",\"n|0.BV6\",\"n|0.M0w\",\"n|0.52k\",\"n|0.80q\",\"n|0.KrZ\",\"n|0.3zw\",\"n|0.9a3\",\"n|0.KKV\",\"n|0.6uG\",\"n|0.A27\",\"n|0.DiH\",\"n|0.ARc\",\"n|0.DD9\",\"n|0.HnJ\",\"n|0.MOC\",\"n|0.DQV\",\"n|0.2EY\",\"n|0.1BB\",\"n|0.N1v\",\"n|0.4t2\",\"n|0.J3B\",\"n|0.3GE\",\"n|0.6Pr\",\"n|0.5Uh\",\"n|0.GMo\",\"n|0.M8V\",\"n|0.M9g\",\"a|7l|7m|7n|7o|7p|7q|7r|7s|7r|7t|7u|7v|7w|7x|7y|7z|80|81|82|83|84|83|85|83|86|87|88|89|8A|8B|8C|8D|8E|8F|8G|8H|8I|8J|8K|8L|8M|3K|8N|3K|8O|8P|8Q|8R|8S|8T|8U|8V|8W|8X|8Y|8Z|8a|8b|8c|8d|8e|8f|8g|8h|8i|8j|8k|8l|8m|8n|8o|8p|8q|8r|8s|8t|8u|8v|8w|8x|8y|8z|90|91|92|93|94|95|96|97|98|99|9A|9B|9C|9D|9E|9F|9G|9H|9I|9J|9K|9L|9M|9N|9O|9P|9Q|9R|9S|9T|9U|9V\",\"n|U\",\"n|Y\",\"n|N\",\"n|T\",\"n|P\",\"n|R\",\"n|Q\",\"n|W\",\"n|X\",\"n|A\",\"n|9\",\"n|c\",\"n|8\",\"n|C\",\"n|B\",\"n|b\",\"n|o\",\"n|d\",\"n|7\",\"n|n\",\"n|m\",\"n|E\",\"n|e\",\"n|5\",\"n|V\",\"n|S\",\"n|a\",\"n|F\",\"n|4\",\"n|f\",\"n|G\",\"n|Z\",\"n|g\",\"n|3\",\"n|r\",\"n|2\",\"n|l\",\"n|H\",\"n|q\",\"n|h\",\"n|k\",\"n|j\",\"n|p\",\"n|i\",\"n|M\",\"a|9X|9Y|9Z|9a|P|9b|9a|9Z|P|9c|9b|9d|9Y|9e|9f|9g|5i|9h|9h|9i|9j|9h|5i|9i|9k|6D|9l|9l|9m|9g|9l|6D|9m|9g|9n|5i|9g|9m|9n|9j|9o|9p|9j|9i|9o|4S|9q|9k|9k|9q|6D|9p|68|3R|9p|9o|68|4S|9r|9q|4S|9s|9r|3R|9t|9u|3R|68|9t|9i|5i|9a|9m|9X|9n|5i|9n|9a|9n|9X|9a|6D|9v|9m|9m|9v|9X|9i|9w|9o|9i|9a|9w|6D|9q|9v|9o|9w|68|9v|9q|9e|9w|9c|68|68|9c|9t|9s|9x|9r|9s|9y|9x|9u|9t|9z|9z|9t|A0|9q|9r|9e|9r|9x|9e|9t|9c|A0|9c|9d|A0|9x|A1|A2|9x|9y|A1|9e|9x|9f|9z|A3|A4|9x|A2|9f|9d|A3|A0|9z|A0|A3|9d|A5|A3|9d|9b|A5|A4|A3|A6|A2|A7|9f|9f|A7|9Y|A1|A8|A2|A2|A8|A7|A3|A5|A6|P|A9|9b|9b|AA|A5|9b|A9|AA|A7|AB|9Y|9Y|AC|9Z|9Y|AB|AC|A5|AA|A6|9Z|AD|P|P|AE|A9|P|AD|AE|9Z|AC|AD|A8|4H|A7|AA|83|A6|A7|3o|AB|A7|4H|3o|83|AA|3K|AC|AB|3u|AA|A9|3K|3K|A9|AF|AB|3o|3u|AC|4L|AD|AC|3u|4L|AD|4L|AE|A9|AE|AF|AE|4L|AF|9v|9Y|9X|9X|9Z|9a|9w|9a|9c|9b|9c|9a|9v|9e|9Y\",\"n|5E.1I\",\"n|-36.1P\",\"n|4T.1Q\",\"n|-4Y.p\",\"n|3F.1Q\",\"n|-5V.o\",\"n|1z.1H\",\"n|-5n.O\",\"n|-5n.1L\",\"n|-c.k\",\"n|-5c.U\",\"n|-1u.b\",\"n|-4c.w\",\"n|-2V.U\",\"n|-3U.1\",\"n|-2i.q\",\"n|-2J.g\",\"n|-2o.R\",\"n|-1D.4\",\"n|-2o.1O\",\"n|-5.1L\",\"n|-2o.1E\",\"n|1H.1V\",\"n|-2Z.1F\",\"n|2b.W\",\"n|-1x.1C\",\"n|4K.1E\",\"n|-d.P\",\"n|5K.9\",\"n|a.F\",\"n|5c.d\",\"n|21.h\",\"n|5c.C\",\"n|3A.17\",\"n|5L.j\",\"n|4F.12\",\"n|4Y.1R\",\"n|58.R\",\"n|2v.1P\",\"n|5Y.K\",\"n|14.4\",\"n|5Y.A\",\"n|-E.1a\",\"n|5X.K\",\"n|-1c.p\",\"n|36.z\",\"n|7.1X\",\"n|-F.1A\",\"n|b.1K\",\"n|0.7\",\"n|36.16\",\"n|-1Q.q\",\"n|D.1M\",\"n|b.b\",\"n|2n.c\",\"n|-2o.P\",\"n|d.E\",\"n|W.W\",\"n|22.Y\",\"n|-3X.10\",\"n|q.x\",\"n|I.L\",\"n|g.8\",\"n|-3W.d\",\"n|0.6\",\"n|r.y\",\"n|-6.17\",\"n|-C.U\",\"n|-2p.g\",\"n|e.1S\",\"n|-N.P\",\"n|-M.W\",\"n|-1O.R\",\"n|D.13\",\"n|-Q.8\",\"n|-O.p\",\"n|C.Q\",\"n|-G.W\",\"n|-R.Q\",\"n|-8.1a\",\"n|1c.1C\",\"n|-g.a\",\"n|-N.10\",\"n|q.1L\",\"n|2R.6\",\"n|-w.L\",\"n|-5.A\",\"n|25.q\",\"n|2Q.t\",\"n|-w\",\"n|I.o\",\"n|2t.11\",\"n|1W\",\"n|-f.z\",\"n|X.W\",\"n|1y.14\",\"n|4P.c\",\"n|0.9\",\"n|-1W.1H\",\"n|F.1F\",\"n|m.Z\",\"n|4M.12\",\"n|-1V.1F\",\"n|-6.12\",\"n|-1X.15\",\"n|15.H\",\"n|-W.1N\",\"n|-n.g\",\"n|-1V.K\",\"n|-26.9\",\"n|-l.d\",\"n|-1E.r\",\"n|-31.13\",\"n|h.x\",\"n|-g.1Z\",\"n|-D.18\",\"n|-4e.O\",\"n|1C.o\",\"n|-N.t\",\"n|m.4\",\"n|-4s.1V\",\"n|1G.1I\",\"n|-5.1I\",\"n|1u.1H\",\"n|-4r.1K\",\"n|1F.1D\",\"n|G.1S\",\"n|3l.1H\",\"n|-3v.v\",\"n|y.K\",\"n|o.i\",\"n|4k.u\",\"n|-1W.v\",\"n|F.19\",\"n|16.1K\",\"n|4g.Q\",\"n|y.z\",\"n|-V.1U\",\"n|14.1Y\",\"n|4N.G\",\"n|2V.4\",\"n|-x.S\",\"n|y.v\",\"n|3P.14\",\"n|3t.G\",\"n|-1N.Z\",\"n|g.t\",\"n|-Q.1K\",\"n|3c.k\",\"n|-1H.c\",\"n|-S.1Z\",\"n|-11.7\",\"n|2l.1K\",\"n|-11.b\",\"n|-d.1Q\",\"n|-1b.J\",\"n|-8.1C\",\"n|-9.H\",\"n|-o.3\",\"n|4j.1P\",\"n|-G.P\",\"n|-8.3\",\"n|15.S\",\"n|4O.3\",\"n|-2l.9\",\"n|c.1B\",\"n|z.15\",\"n|2l.6\",\"n|-4V.8\",\"n|18.1b\",\"n|V.S\",\"n|-q.6\",\"n|-3u.1N\",\"n|y.4\",\"n|-Z.Z\",\"n|1x.k\",\"n|-m.8\",\"n|-i.6\",\"n|-1c.10\",\"n|-17.1J\",\"n|8.5\",\"n|-o.q\",\"a|83|A6|AH|AI|83|83|A6|AJ|AK|83|83|A6|AL|AM|83|83|A6|AN|AO|83|83|A6|AB|AP|83|83|A6|AQ|AR|83|83|A6|AS|AT|83|83|A6|AU|AV|83|83|A6|AW|AX|83|83|A6|AY|AZ|83|83|A6|Aa|Ab|83|83|A6|Ac|Ad|83|83|A6|Ae|Af|83|83|A6|Ag|Ah|83|83|A6|Ai|Aj|83|83|A6|Ak|Al|83|83|A6|Am|An|83|83|A6|Ao|Ap|83|83|A6|Aq|Ar|83|83|A6|As|At|83|83|A6|Au|Av|83|83|A6|Aw|Ax|83|83|A6|Ay|Az|83|A6|A6|B0|B1|Y|9d|B2|B3|B4|A6|A6|B5|B6|Y|9d|B7|B8|B4|A6|A6|B9|BA|Y|9d|BB|BC|B4|A6|A6|BD|BE|Y|9d|BF|BG|B4|A6|A6|BH|BI|BJ|9d|BK|BL|4E|A6|A6|BM|BN|BJ|9d|BO|BP|4E|A6|A6|BQ|BR|BJ|9d|BS|BT|4E|A6|A6|BU|BV|BJ|9d|BW|BX|4E|A6|A6|BY|BZ|BJ|9d|Ba|Bb|4E|A6|A6|Bc|Bd|BJ|9d|Be|Bf|4E|A6|A6|Bg|Bh|Y|9d|Bi|Bj|B4|A6|A6|Bk|Bl|Y|9d|Bm|Bn|B4|A6|A6|Bo|Bp|Bq|9d|Br|Bs|3r|A6|A6|Bt|Bu|Bq|9d|Bv|Bw|3r|A6|A6|Bx|By|Bq|9d|Bz|C0|3r|A6|A6|C1|C2|Bq|9d|9c|C3|3r|A6|A6|C4|C5|Bq|9d|C6|C7|3r|A6|A6|C8|C9|Bq|9d|CA|CB|3r|A6|A6|CC|CD|Bq|9d|CE|CF|3r|A6|A6|CG|CH|Bq|9d|CI|CJ|3r|A6|A6|CK|CL|Bq|9d|CM|CN|3r|A6|A6|CO|CP|Bq|9d|CQ|CR|3r|A6|A6|CS|CT|Bq|9d|CU|CV|3r|A6|A6|CW|CX|Bq|9d|CY|CZ|3r|A6|A6|Ca|Cb|Bq|9d|Cc|Cd|3r|A6|A6|Ce|Cf|Bq|9d|Cg|Ch|3r|A6|A6|Ci|Cj|Bq|9d|Ck|Cl|3r|A6|A6|Cm|Cn|Bq|9d|Co|Cp|3r|A6|A6|Cq|Cr|Bq|9d|Cs|Ct|3r|A6|A6|Cu|Cv|Bq|9d|Cw|Cx|3r|A6|A6|Cy|Cz|Bq|9d|D0|D1|3r|A6|A6|D2|D3|Bq|9d|D4|D5|3r|A6|A6|Cg|D6|Bq|9d|D7|D8|3r|A6|A6|D9|DA|Bq|9d|DB|DC|3r\",\"n|y\",\"n|10\",\"n|12\",\"n|14\",\"n|16\",\"n|1G\",\"n|1K\",\"n|1M\",\"n|1S\",\"n|1U\",\"n|18\",\"n|1A\",\"n|1Y\",\"n|1a\",\"n|1C\",\"n|1Q\",\"n|1e\",\"n|1O\",\"n|1i\",\"n|1m\",\"n|1o\",\"a|3K|AE|3K|A6|9d|9w|9w|9X|9Y|9x|AB|9r|9r|9n|9n|A9|A9|68|68|5i|5i|40|40|DE|DE|DF|DF|DG|DG|DH|AB|DI|DI|DH|5p|DJ|1q|DK|DK|DL|DM|DN|DN|Bl|Bl|DO|DO|DP|DP|DQ|DR|DQ|DS|17|9j|9g|3R|9j|9X|9e|9e|9Y|9x|9i|9i|9t|9t|A3|A3|AE|DT|DU|DU|DM|DV|6J|6J|DT|DL|DW|DW|DV|A6|9z|9z|3R|9g|9k|9k|9s|DJ|64|64|1q|9s|A1|A1|4H|DS|DX|DX|DR|AF|P|P|9d|4H|3u|3u|AF|5p|DY|DY|17\",\"o|7i|7j|7k|9W|AG|DD|9Z|DZ|4m|4n\",\"o|4g|Da\",\"skins/test/legL\",\"n|0.PAZ\",\"n|0.9QM\",\"n|0.Bjl\",\"n|0.77J\",\"n|0.Gj8\",\"n|0.GBk\",\"n|0.NiW\",\"n|0.K3l\",\"n|0.K9F\",\"n|0.JZ8\",\"n|0.1Eq\",\"n|0.J4V\",\"n|0.33b\",\"n|0.JXO\",\"n|0.Csy\",\"n|0.GkU\",\"n|0.ACh\",\"n|0.4Hl\",\"n|0.CGc\",\"n|0.IUk\",\"n|0.PDX\",\"n|0.Ic9\",\"n|0.BjP\",\"n|0.Hjb\",\"n|0.5zM\",\"n|0.9xj\",\"n|0.1gt\",\"n|0.MRl\",\"n|0.5yf\",\"n|0.NNB\",\"n|0.ML0\",\"n|0.Nr0\",\"n|0.2bI\",\"n|0.7np\",\"n|0.Ifg\",\"n|0.7ca\",\"n|0.Oty\",\"n|0.GZQ\",\"n|0.AWz\",\"n|0.OaM\",\"n|0.9Jz\",\"n|0.EPs\",\"n|0.A5Y\",\"n|0.AxW\",\"n|0.2Ie\",\"n|0.CPq\",\"n|0.A9G\",\"n|0.GVE\",\"n|0.7Dn\",\"n|0.LtG\",\"n|0.IlH\",\"n|0.jy\",\"n|0.4Cq\",\"n|0.LyG\",\"n|0.5rG\",\"n|0.AwY\",\"n|0.DgF\",\"n|0.IPS\",\"n|0.2KN\",\"n|0.FjU\",\"n|0.GjR\",\"n|0.JX8\",\"n|0.Ep2\",\"n|0.C2J\",\"n|0.8kQ\",\"n|0.EWM\",\"n|0.J8z\",\"n|0.BCu\",\"n|0.7aP\",\"n|0.2e6\",\"n|0.CF8\",\"n|0.7ju\",\"n|0.LOt\",\"n|0.DtC\",\"n|0.1Zy\",\"n|0.L2v\",\"n|0.PQz\",\"n|0.B2H\",\"n|0.A8a\",\"n|0.Fz3\",\"n|0.3JB\",\"n|0.8R6\",\"n|0.EKj\",\"n|0.Cik\",\"n|0.OW2\",\"n|0.M8R\",\"n|0.EGP\",\"n|0.LGt\",\"n|0.Nue\",\"n|0.MhR\",\"n|0.md\",\"n|0.JWL\",\"n|0.Ky6\",\"n|0.6If\",\"n|0.FtQ\",\"n|0.4b8\",\"n|0.FB9\",\"n|0.EH8\",\"n|0.4Ex\",\"n|0.N14\",\"n|0.4V6\",\"n|0.8mo\",\"n|0.2gD\",\"n|0.LX8\",\"n|0.b1\",\"n|0.FDC\",\"n|0.Ndk\",\"n|0.5Yo\",\"n|0.88J\",\"n|0.M95\",\"n|0.BMJ\",\"n|0.2k2\",\"n|0.NYS\",\"n|0.Fna\",\"n|0.OOi\",\"n|0.PPQ\",\"n|0.CTq\",\"n|0.5tm\",\"n|0.BRy\",\"n|0.M6L\",\"n|0.Gyo\",\"n|0.IeC\",\"n|0.N9t\",\"n|0.yw\",\"n|0.OJL\",\"n|0.KH7\",\"n|0.1DF\",\"n|0.3Ww\",\"n|0.DOu\",\"n|0.G2o\",\"n|0.CWO\",\"n|0.4gp\",\"n|0.NyO\",\"n|0.H1s\",\"n|0.PEn\",\"n|0.NFa\",\"n|0.APb\",\"n|0.J1d\",\"n|0.6hE\",\"n|0.9TY\",\"n|0.C5e\",\"n|0.4pn\",\"n|0.69\",\"n|0.KHn\",\"n|0.14D\",\"n|0.NUq\",\"n|0.32M\",\"n|0.9yc\",\"n|0.7nu\",\"n|0.GRE\",\"n|0.811\",\"n|0.IBd\",\"n|0.5fG\",\"n|0.7jj\",\"n|0.Guk\",\"n|0.EKP\",\"n|0.FAt\",\"n|0.NpS\",\"n|0.JiE\",\"n|0.DTq\",\"n|0.8SO\",\"n|0.60m\",\"n|0.AML\",\"n|0.FR8\",\"n|0.822\",\"n|0.DEM\",\"n|0.LWE\",\"n|0.P0f\",\"n|0.Pwd\",\"n|0.JN9\",\"n|0.NsI\",\"n|0.JvL\",\"n|0.38R\",\"n|0.I4e\",\"a|Dd|De|83|Df|83|Dg|83|Dh|83|Di|83|Dj|83|Dk|83|Dl|83|Dm|83|Dn|83|Do|83|Dp|83|Dq|83|Dr|7r|Ds|7r|Dt|7r|Du|7r|Dv|Dw|Dx|Dy|Dz|E0|83|E1|E2|E3|E4|E5|E6|E7|E8|E9|EA|3K|EB|EC|ED|EE|EF|EG|EH|EI|EJ|EK|EL|EM|EN|EO|EP|EQ|ER|ES|ET|EU|EV|EW|EX|EY|EZ|Ea|Eb|Ec|Ed|Ee|Ef|Eg|3K|Eh|3K|Ei|Ej|Ek|El|Em|En|Eo|Ep|Eq|Er|Es|Et|Eu|Ev|Ew|Ex|Ey|Ez|F0|F1|F2|F3|F4|F5|F6|F7|F8|F9|FA|FB|FC|FD|FE|FF|FG|FH|FI|FJ|FK|FL|FM|FN|FO|FP|FQ|FR|FS|FT|FU|FV|FW|FX|FY|FZ|Fa|Fb|Fc|Fd|Fe|Ff|Fg|Fh|Fi|Fj|Fk|Fl|Fm|Fn|Fo|Fp|7o|Fq|Fr|Fs|Ft|Fu|Fv|Fw|Fx|Fy|Fz|G0|G1|G2|G3|G4|G5|G6|G7|G8|G9|GA|GB|GC|GD|GE|GF|GG|GH|GI|GJ|GK|GL|GM|GN|GO|GP|GQ\",\"n|15\",\"n|17\",\"n|13\",\"n|1J\",\"n|1H\",\"n|11\",\"n|1B\",\"n|19\",\"n|1F\",\"n|v\",\"n|z\",\"n|1P\",\"n|1N\",\"n|1R\",\"n|1X\",\"a|9Z|DH|AF|GS|DH|1q|DI|GT|4H|4L|GS|3u|3u|DI|3o|4L|AF|GS|3u|GS|DI|3o|DI|4H|AF|DH|GS|GS|1q|DI|4H|GT|A8|9Z|P|DH|P|GU|DH|DI|1q|GV|GV|1q|AB|P|9b|GU|9b|GW|GU|DI|GV|GT|DJ|GX|9s|DJ|AC|GX|5p|5i|AC|9c|9w|5i|4S|5u|9k|5u|DF|9k|5u|DS|DF|DS|GY|AE|DS|AE|DF|AE|GY|6D|GY|9a|6D|9a|9X|6D|DF|9l|9k|DF|AE|DP|DF|DP|9l|DP|AE|GZ|AE|6D|GZ|6D|DO|GZ|6D|9X|DO|9X|9v|DO|9s|GX|4S|AC|DS|GX|GX|5u|4S|GX|DS|5u|AC|5i|DS|DS|5i|GY|5i|9w|GY|9w|9a|GY|5p|Ga|Gb|DG|DJ|9y|DG|Ga|DJ|9y|DJ|9s|Ga|AC|DJ|Ga|5p|AC|9d|9c|5p|5p|9c|5i|GV|AB|DG|GT|GV|A1|GW|9d|Gb|GW|9b|9d|GV|DG|A1|A1|DG|9y|AB|Ga|DG|AB|Gb|Ga|AB|GW|Gb|Gb|9d|5p|AB|1q|GW|GW|DH|GU|1q|DH|GW|GT|A1|A8|DP|9g|9l|DP|GZ|Gc|DP|Gc|9g|Gc|GZ|A7|GZ|DO|A7|A7|DO|68|9g|Gc|9h|Gc|A7|DL|DO|9v|68|A7|68|6a|6a|68|DK|9v|9e|68|68|9e|DK|9e|9f|DK|A7|6a|DL|Gc|DL|9h|9h|DL|9j|DL|6a|DE|6a|9r|DE|DL|DE|9j|9r|6a|A5|DE|9p|9j|DE|9r|Gd|DE|Gd|9p|Gd|9r|DV|6a|DK|A5|DK|9f|A5|A5|Ge|9r|9r|Ge|DV|9f|9Y|A5|9p|Gd|3R|Gd|DV|5o|Gd|5o|3R|5o|DV|9q|A5|9Y|Ge|9Y|A2|Ge|Ge|A9|DV|DV|A9|9q|5o|9u|3R|5o|9q|3P|9q|DN|3P|5o|3P|9u|Ge|A2|A9|A9|6V|9q|9q|6V|DN|A2|9x|A9|3P|9z|9u|3P|DN|DM|DN|Gf|DM|3P|DM|9z|6V|DT|DN|DN|DT|Gf|9x|9m|A9|A9|9m|6V|DM|A4|9z|DM|Gf|DQ|Gf|Gg|DQ|DM|DQ|A4|DT|6V|9i|DT|Bl|Gf|Gf|Bl|Gg|DQ|A6|A4|DQ|Gg|40|Gg|9n|40|DQ|40|A6|6V|9m|9i|DT|9i|Bl|Bl|9i|9o|Bl|AD|Gg|Gg|AD|9n|A6|40|83|9n|5j|40|40|5j|83|9o|9t|Bl|Bl|9t|AD|9n|AD|5j|5j|3K|83|9t|A0|AD|AD|A0|5j|5j|A0|AA|A0|A3|AA|5j|AA|3K\",\"n|-J.12\",\"n|-1.R\",\"n|-7.y\",\"n|1u.12\",\"n|5.1G\",\"n|1w.1\",\"n|1x.u\",\"n|Q.1Q\",\"n|1y.1P\",\"n|0.ILP\",\"n|-h.10\",\"n|0.GFQ\",\"n|-1p.1V\",\"n|0.2GU\",\"n|-2x.Z\",\"n|0.Mwa\",\"n|c.I\",\"n|20.3\",\"n|0.B03\",\"n|-V.N\",\"n|0.107\",\"n|-1d.12\",\"n|0.3ec\",\"n|-2l.6\",\"n|0.DEy\",\"n|p.q\",\"n|21.1Q\",\"n|0.H7E\",\"n|-I.1Q\",\"n|0.GDz\",\"n|-1R.K\",\"n|0.6yH\",\"n|-2Z.z\",\"n|0.Gui\",\"n|12.Y\",\"n|23.13\",\"n|0.CC3\",\"n|-5.7\",\"n|0.3Jg\",\"n|-1D.m\",\"n|0.1Ch\",\"n|-2L.1R\",\"n|0.F0y\",\"n|1K.p\",\"n|25.I\",\"n|0.HTc\",\"n|C.A\",\"n|0.IL9\",\"n|0.K9X\",\"n|-24.10\",\"n|0.1Fu\",\"n|1a.17\",\"n|27.x\",\"n|0.Ohp\",\"n|S.S\",\"n|0.Ny1\",\"n|-f.D\",\"n|0.EZk\",\"n|-1n.s\",\"n|0.H86\",\"n|1p.o\",\"n|29.l\",\"n|0.7fg\",\"n|g.J\",\"n|0.47N\",\"n|-R.M\",\"n|0.Gyw\",\"n|-1Z.11\",\"n|0.2j2\",\"n|22.12\",\"n|2B.s\",\"n|0.Cb0\",\"n|u.N\",\"n|0.6Tz\",\"n|-D.S\",\"n|0.EXz\",\"n|-1L.x\",\"n|0.Npb\",\"n|2G.1I\",\"n|2D.1T\",\"n|0.FHl\",\"n|17.x\",\"n|0.GZT\",\"n|0.2qp\",\"n|-18.X\",\"n|0.Mm7\",\"n|2Q.Q\",\"n|2E.Z\",\"n|0.Esv\",\"n|1I.1M\",\"n|0.JQO\",\"n|A.r\",\"n|0.Dl7\",\"n|-x.1Z\",\"n|0.99m\",\"n|2f.1T\",\"n|2G.1L\",\"n|0.IhM\",\"n|1X.o\",\"n|0.8cY\",\"n|O.T\",\"n|0.EhW\",\"n|-j.M\",\"n|0.Ho4\",\"n|2r.1U\",\"n|2H.T\",\"n|0.Jfq\",\"n|1j.p\",\"n|0.4Au\",\"n|b.A\",\"n|0.P5i\",\"n|-X.L\",\"n|0.8Hk\",\"n|1y.1b\",\"n|2J.d\",\"n|0.IjK\",\"n|q.w\",\"n|0.BEr\",\"n|-H.1K\",\"n|0.OOm\",\"n|2M.a\",\"n|2M.n\",\"n|0.NQR\",\"n|1E.5\",\"n|0.8KW\",\"n|6.11\",\"n|0.Mc0\",\"n|2r.1K\",\"n|1x.4\",\"n|0.3Pd\",\"n|1j.f\",\"n|0.Hx8\",\"n|0.9p6\",\"n|3B.4\",\"n|1P.15\",\"n|0.6C3\",\"n|23.10\",\"n|0.Pxk\",\"n|v.V\",\"n|0.P2o\",\"n|3K.12\",\"n|d.15\",\"n|0.NEV\",\"n|2C.N\",\"n|0.5iZ\",\"n|14.1J\",\"n|0.2WM\",\"n|3N.r\",\"n|-0.F\",\"n|0.PB8\",\"n|2F.C\",\"n|0.2bM\",\"n|17.1I\",\"n|0.ph\",\"n|3O.1S\",\"n|-V.1J\",\"n|0.1I\",\"n|2F.x\",\"n|0.OP8\",\"n|17.S\",\"n|0.4Bl\",\"n|3H.1E\",\"n|-11.2\",\"n|0.9ts\",\"n|29.Z\",\"n|0.EIC\",\"n|11.4\",\"n|0.7HM\",\"n|35.2\",\"n|-1W.12\",\"n|0.GUk\",\"n|1x.18\",\"n|0.DYj\",\"n|o.d\",\"n|0.OJU\",\"n|3m.1C\",\"n|-1u.x\",\"n|0.8tc\",\"n|2e.X\",\"n|0.73a\",\"n|1W.1T\",\"n|0.1nr\",\"n|O.y\",\"n|0.Dgm\",\"n|22.7\",\"n|-1z.l\",\"n|0.8iM\",\"n|u.1D\",\"n|0.KCA\",\"n|-D.1D\",\"n|0.2XJ\",\"n|2v.F\",\"n|-20.k\",\"n|0.2UC\",\"n|1n.1B\",\"n|0.8hX\",\"n|f.g\",\"n|0.2qW\",\"n|-S.9\",\"n|0.HRB\",\"n|2i.o\",\"n|-21.Y\",\"n|0.6xw\",\"n|1Z.J\",\"n|0.Mp2\",\"n|R.1P\",\"n|0.IgI\",\"n|-g.11\",\"n|0.6Pc\",\"n|2T.S\",\"n|-21.y\",\"n|0.3Z\",\"n|1L.1Y\",\"n|0.Fxs\",\"n|D.t\",\"n|0.D28\",\"n|-u.1N\",\"n|0.29u\",\"n|2D.1R\",\"n|-20.u\",\"n|0.1zZ\",\"n|15.m\",\"n|0.5J5\",\"n|-2.1U\",\"n|0.4P\",\"n|-1A.Y\",\"n|0.LWh\",\"n|21.1Z\",\"n|-20.4\",\"n|0.5Hm\",\"n|t.u\",\"n|0.OaZ\",\"n|-E.1M\",\"n|0.HEH\",\"n|-1M.Q\",\"n|0.ChH\",\"n|1p.17\",\"n|-20.z\",\"n|0.IPe\",\"n|h.c\",\"n|0.3cj\",\"n|-Q.D\",\"n|0.5x4\",\"n|-1Y.i\",\"n|0.1Bs\",\"n|1c.5\",\"n|-20.1\",\"n|0.BVv\",\"n|U.11\",\"n|0.1UT\",\"n|-d.1P\",\"n|0.DXO\",\"n|-1l.J\",\"n|0.2KM\",\"n|1O.K\",\"n|-20.e\",\"n|0.8W8\",\"n|F.1Q\",\"n|0.PjN\",\"n|-s.q\",\"n|0.8Op\",\"n|-20.1V\",\"n|0.HBA\",\"n|18.1D\",\"n|-20.2\",\"n|0.N6p\",\"n|0.i\",\"n|0.FYE\",\"n|-17.7\",\"n|0.9Wz\",\"n|-2F.m\",\"n|0.Bro\",\"n|u.f\",\"n|-20.r\",\"n|0.JrE\",\"n|-E\",\"n|0.4Io\",\"n|-1M.V\",\"n|0.4Wf\",\"n|-2U.1A\",\"n|0.2l8\",\"n|k.15\",\"n|-20\",\"n|0.N12\",\"n|-N.1L\",\"n|0.8yo\",\"n|-1V.F\",\"n|0.Oei\",\"n|-2d.u\",\"n|0.Ze\",\"n|Z.1E\",\"n|-1z.1N\",\"n|0.4FL\",\"n|-Y.1C\",\"n|0.JXK\",\"n|-1g.G\",\"n|0.8GG\",\"n|-2o.l\",\"n|0.P9g\",\"n|O.1U\",\"n|-1z.z\",\"n|0.IUj\",\"n|-j.m\",\"n|0.AUz\",\"n|-1r.1R\",\"n|0.JbA\",\"n|-30.L\",\"n|0.5ng\",\"n|D.H\",\"n|-1y.15\",\"n|0.8lM\",\"n|-u.Y\",\"n|0.NHO\",\"n|-22.13\",\"n|0.PBS\",\"n|-5.1V\",\"n|-1f.1J\",\"n|-I.E\",\"n|-1R.w\",\"n|0.Eqx\",\"n|-1Q.j\",\"n|0.93I\",\"n|-2Y.1O\",\"n|0.7Hc\",\"n|-O.A\",\"n|-j.c\",\"n|2L.1L\",\"n|-1.1W\",\"n|0.HY5\",\"n|1D.q\",\"n|0.KTP\",\"n|5.B\",\"n|0.1N3\",\"n|-13.K\",\"n|0.N0d\",\"n|2p.1b\",\"n|-0.1S\",\"n|0.B6O\",\"n|1h.w\",\"n|0.H9Q\",\"n|Z.H\",\"n|0.8p0\",\"n|-Y.O\",\"n|0.KPM\",\"n|3L.t\",\"n|0.O\",\"n|0.CoC\",\"n|2D.O\",\"n|0.DZT\",\"n|15.1K\",\"n|0.9em\",\"n|-2.16\",\"n|0.NX5\",\"n|1s.x\",\"n|-1.G\",\"n|0.BOA\",\"n|k.S\",\"n|0.4U7\",\"n|-N.N\",\"n|0.9nm\",\"n|-1V.12\",\"n|0.5oy\",\"n|1P.1R\",\"n|-1.1I\",\"n|0.6pS\",\"n|H.m\",\"n|0.OAb\",\"n|-q.3\",\"n|0.1Gj\",\"n|-1y.Y\",\"n|0.PDO\",\"n|v.i\",\"n|-0.9\",\"n|0.LOi\",\"n|-C.7\",\"n|0.DaS\",\"n|-1K.c\",\"n|0.OBq\",\"n|-2S.1H\",\"n|0.LEI\",\"n|9.1b\",\"n|-1.6\",\"n|0.T\",\"n|-y.p\",\"n|C.Z\",\"n|-1M.1V\",\"n|0.4B\",\"n|-v.G\",\"n|0.DY\",\"n|u.t\",\"n|-1N.N\",\"n|0.7bi\",\"n|-D.1N\",\"n|0.PBo\",\"n|-1L.R\",\"n|0.8td\",\"n|-2T.16\",\"n|0.I58\",\"n|1O.G\",\"n|-1O.14\",\"n|0.JjI\",\"n|G.1M\",\"n|0.1Z9\",\"n|-r.14\",\"n|0.CVf\",\"n|-1z.1Z\",\"n|0.NOU\",\"n|1q.1Q\",\"n|0.Fmk\",\"n|i.l\",\"n|0.D4N\",\"n|-P.1V\",\"n|0.5Qo\",\"n|-1X.Z\",\"n|0.Hmu\",\"n|2G.W\",\"n|-1P.1U\",\"n|0.Kfd\",\"n|18.1S\",\"n|0.Gnz\",\"n|-0.o\",\"n|0.ADR\",\"n|-18.1J\",\"n|0.9VX\",\"n|2k.X\",\"n|-1R.O\",\"n|0.74O\",\"n|1c.1T\",\"n|0.67O\",\"n|U.y\",\"n|0.3wQ\",\"n|-e.1I\",\"n|0.BTy\",\"n|3A.H\",\"n|-1S.d\",\"n|0.8do\",\"n|22.1N\",\"n|0.6cL\",\"n|u.i\",\"n|0.Anl\",\"n|-D.7\",\"n|0.2oF\",\"n|6.1b\",\"n|1P.1T\",\"n|q.c\",\"n|1V.1W\",\"n|0.C33\",\"n|-H.3\",\"n|0.Hi5\",\"n|-1P.i\",\"n|0.2ck\",\"n|-2X.1D\",\"n|1L.k\",\"n|1Y.s\",\"n|0.8rQ\",\"n|D.5\",\"n|0.1xB\",\"n|-u.k\",\"n|0.LiT\",\"n|-22.1F\",\"n|0.Oh8\",\"n|1p.1b\",\"n|1c.1H\",\"n|0.6mq\",\"n|h.16\",\"n|0.8sh\",\"n|0.HII\",\"n|-1Y.O\",\"n|0.O20\",\"n|2H.X\",\"n|1g.i\",\"n|0.FEX\",\"n|19.2\",\"n|0.jD\",\"n|1.y\",\"n|0.2n\",\"n|-17.18\",\"n|0.Crb\",\"n|2h.l\",\"n|0.CfA\",\"n|1Z.G\",\"n|0.JmU\",\"n|R.1C\",\"n|0.PgA\",\"n|-g.1E\",\"n|0.1g4\",\"n|37.13\",\"n|1l.1H\",\"n|0.3wC\",\"n|1z.O\",\"n|0.J7B\",\"n|r.1U\",\"n|0.3ay\",\"n|-G.w\",\"n|0.2Dn\",\"n|2P.Q\",\"n|-1N.j\",\"n|0.5nC\",\"n|1H.1M\",\"n|0.KuX\",\"n|9.r\",\"n|0.4XL\",\"n|2j.x\",\"n|-q.Z\",\"n|0.KjV\",\"n|1b.I\",\"n|0.Hmo\",\"n|T.1O\",\"n|2q.12\",\"n|-0.C\",\"n|0.DdV\",\"n|1i.X\",\"n|0.Axt\",\"n|a.1T\",\"n|0.40n\",\"n|2g.18\",\"n|10.v\",\"n|0.LD1\",\"n|1X.d\",\"n|0.L5n\",\"n|P.8\",\"n|0.9US\",\"n|2E.V\",\"n|1o.1E\",\"n|0.7JZ\",\"n|15.1b\",\"n|0.6LI\",\"n|-2.f\",\"n|0.HYb\",\"n|24.Y\",\"n|-1P\",\"n|0.LKw\",\"n|w.3\",\"n|0.NwP\",\"n|-B.m\",\"n|0.Gjd\",\"n|-1J.1R\",\"n|0.KgR\",\"n|28.k\",\"n|-1.j\",\"n|0.8ac\",\"n|10.5\",\"n|0.OUH\",\"n|-7.k\",\"n|0.I0f\",\"n|-1F.1F\",\"n|0.5r5\",\"n|25.l\",\"n|1e.1H\",\"n|0.87a\",\"n|x.G\",\"n|0.Fu1\",\"n|-A.Z\",\"n|0.OE9\",\"n|-1I.1E\",\"n|0.67D\",\"n|2X.16\",\"n|0.EZZ\",\"n|1P.R\",\"n|0.6cq\",\"n|H.1X\",\"n|0.5m8\",\"n|-q.t\",\"n|0.6oc\",\"n|2b.1G\",\"n|-0.b\",\"n|0.Lb3\",\"n|1T.b\",\"n|0.MmS\",\"n|L.6\",\"n|0.2Mq\",\"n|-m.j\",\"n|0.Cly\",\"n|2T.P\",\"n|1h.1Y\",\"n|0.DIX\",\"n|1L.1V\",\"n|0.Bse\",\"n|D.q\",\"n|0.6FA\",\"n|-u.1a\",\"n|0.2Mo\",\"n|2y.P\",\"n|-1S.W\",\"n|0.J6g\",\"n|1q.1L\",\"n|0.D1l\",\"n|i.g\",\"n|0.8Js\",\"n|-P.1a\",\"n|0.EDo\",\"n|35.j\",\"n|0.z\",\"n|0.7Yi\",\"n|1x.E\",\"n|0.6a6\",\"n|p.1A\",\"n|0.Kwm\",\"n|-I.16\",\"n|0.JFl\",\"n|2u.a\",\"n|1k.13\",\"n|0.Ggq\",\"n|1m.5\",\"n|0.Keg\",\"n|e.11\",\"n|0.CJI\",\"n|-T.1P\",\"n|0.A7T\",\"n|2F.e\",\"n|-1Q.A\",\"n|0.BqN\",\"n|16.9\",\"n|0.7gX\",\"n|-1.W\",\"n|0.9Jd\",\"n|3f.A\",\"n|0.47A\",\"n|2W.1Q\",\"n|0.2x5\",\"n|1O.l\",\"n|0.AJG\",\"n|G.G\",\"n|0.E5v\",\"n|3E.1F\",\"n|1n.1U\",\"n|0.5jK\",\"n|26.a\",\"n|0.7cb\",\"n|y.5\",\"n|0.K1W\",\"n|-9.k\",\"n|0.hH\",\"n|1e.6\",\"n|0.1d1\",\"n|W.12\",\"n|0.GN3\",\"n|-b.1E\",\"n|0.8pI\",\"n|-1j.I\",\"n|0.4u2\",\"n|1e.L\",\"n|-1.h\",\"n|0.OL5\",\"n|V.1R\",\"n|0.AMT\",\"n|-c.p\",\"n|0.8m4\",\"n|-1k.1U\",\"n|0.BPG\",\"n|1a.b\",\"n|0.5FN\",\"n|0.BLl\",\"n|0.BIW\",\"n|0.3bO\",\"n|19.16\",\"n|-1O.A\",\"n|0.Fvp\",\"n|1.b\",\"n|0.Jwo\",\"n|-16.E\",\"n|0.8j\",\"n|-2E.t\",\"n|0.IdA\",\"n|-0.1R\",\"n|0.BLx\",\"n|0.H2A\",\"n|-18.N\",\"n|0.50L\",\"n|-2G.12\",\"n|0.gG\",\"n|14.12\",\"n|1W.1G\",\"n|0.H8B\",\"n|-3.1O\",\"n|0.Nf8\",\"n|-1B.I\",\"n|0.Or\",\"n|-2J.x\",\"n|0.DiK\",\"n|b.C\",\"n|-1M.J\",\"n|0.5hz\",\"n|-W.d\",\"n|0.8Zn\",\"n|-1f.y\",\"n|0.1OS\",\"n|-2n.2\",\"n|0.DTU\",\"n|Y.t\",\"n|-1.g\",\"n|0.4rP\",\"n|-Z.1X\",\"n|0.ELX\",\"n|-1h.b\",\"n|0.7NG\",\"n|-2p.16\",\"n|0.A4C\",\"n|T.b\",\"n|1S.D\",\"n|0.Kf7\",\"n|-e.4\",\"n|0.6WC\",\"n|-1m.j\",\"n|0.MAM\",\"n|-2u.1O\",\"n|0.AAe\",\"n|-1N.L\",\"n|0.GZM\",\"n|0.KEs\",\"n|-1V.s\",\"n|0.CYi\",\"n|-2d.1X\",\"n|0.7rG\",\"n|k.1K\",\"n|-1.18\",\"n|0.Cfl\",\"n|-N.w\",\"n|0.7cR\",\"n|-1V.1b\",\"n|0.8GQ\",\"n|-2e.L\",\"n|0.2uo\",\"n|f.x\",\"n|1T.1b\",\"n|0.6lo\",\"n|-S.1T\",\"n|0.7Jt\",\"n|-1a.N\",\"n|0.3BG\",\"n|-2i.12\",\"n|0.Duu\",\"n|P.18\",\"n|-1M.u\",\"n|0.4VK\",\"n|-j.18\",\"n|0.7a1\",\"n|-1r.2\",\"n|0.Pje\",\"n|-2z.h\",\"n|0.LxI\",\"n|O.1O\",\"n|-1.1V\",\"n|0.E7S\",\"n|-j.s\",\"n|0.JnG\",\"n|-1r.1X\",\"n|0.Zy\",\"n|-2z.b\",\"n|0.MTY\",\"n|J.1Z\",\"n|1Q.x\",\"n|-3.19\",\"n|-1.14\",\"a|83|9l|Gi|Gj|83|83|9l|Gk|Gl|83|83|9l|Gm|Gn|83|83|9l|Bj|Go|83|9z|9l|Gp|Gq|Gr|9k|Gs|Gq|Gt|4S|Gu|Gq|Gv|9s|Gw|Gq|Gx|9z|9l|Gy|Gz|H0|9k|H1|Gz|H2|4S|H3|Gz|H4|9s|H5|Gz|H6|9z|9l|H7|H8|H9|9k|HA|H8|HB|4S|HC|H8|HD|9s|HE|H8|HF|9z|9l|HG|HH|HI|9k|HJ|HH|HK|4S|HL|HH|HM|9s|HN|HH|HO|9z|9l|HP|HQ|HR|9k|HS|HQ|HT|4S|Be|HQ|HU|9s|HV|HQ|HW|9z|9l|HX|HY|HZ|9k|Ha|HY|Hb|4S|Hc|HY|Hd|9s|He|HY|Hf|9z|9l|Hg|Hh|Hi|9k|Hj|Hh|Hk|4S|Hl|Hh|Hm|9s|Hn|Hh|Ho|9z|9l|Hp|Hq|Hr|9k|Hs|Hq|Ht|4S|Hu|Hq|Hv|9s|Hw|Hq|Hx|9z|9l|Hy|Hz|I0|9k|I1|Hz|I2|4S|42|Hz|I3|9s|I4|Hz|I5|9z|9l|I6|I7|I8|9k|I9|I7|IA|4S|IB|I7|IC|9s|ID|I7|IE|9z|9l|IF|IG|IH|9k|II|IG|IJ|4S|IK|IG|IL|9s|IM|IG|IN|9z|9l|IO|IP|IQ|9k|IR|IP|IS|4S|IT|IP|IU|9s|IV|IP|IW|A4|9k|IX|IY|IZ|4S|Ia|IY|Ib|9s|Ic|IY|Id|A4|9k|Ie|If|Ig|4S|Ih|If|Ii|9s|Ij|If|Ik|A4|9k|Il|Im|In|4S|Io|Im|Ip|9s|IT|Im|Iq|A4|9k|Ir|Is|It|4S|Iu|Is|Iv|9s|Iw|Is|Ix|A4|9k|Iy|Iz|J0|4S|J1|Iz|J2|9s|J3|Iz|J4|A4|9k|J5|J6|J7|4S|J8|J6|J9|9s|JA|J6|JB|A4|9k|JC|JD|JE|4S|JF|JD|JG|9s|JH|JD|JI|A4|9k|JJ|JK|JL|4S|JM|JK|JN|9s|JO|JK|JP|A4|9k|JQ|JR|JS|4S|JT|JR|JU|9s|JV|JR|JW|9z|9l|JX|JY|JZ|9k|Ja|JY|Jb|4S|Jc|JY|Jd|9s|Je|JY|Jf|A4|9k|Jg|Jh|Ji|4S|Jj|Jh|Jk|9s|Jl|Jh|Jm|9z|9l|Jn|Jo|Jp|9k|Jq|Jo|Jr|4S|Js|Jo|Jt|9s|Ju|Jo|Jv|9z|9l|Jw|Jx|Jy|9k|Jz|Jx|K0|4S|K1|Jx|K2|9s|K3|Jx|K4|9z|9l|K5|K6|K7|9k|K8|K6|K9|4S|KA|K6|KB|9s|KC|K6|KD|9z|9l|KE|KF|KG|9k|KH|KF|KI|4S|KJ|KF|KK|9s|KL|KF|KM|9z|9l|KN|KO|KP|9k|KQ|KO|KR|4S|KS|KO|KT|9s|KU|KO|KV|9z|9l|KW|KX|KY|9k|KZ|KX|Ka|4S|Kb|KX|Kc|9s|Kd|KX|Ke|9z|9l|Kf|Kg|Kh|9k|Ki|Kg|Kj|4S|Kk|Kg|Kl|9s|Km|Kg|Kn|9z|9l|Ko|Kp|Kq|9k|Kr|Kp|Ks|4S|Kt|Kp|Ku|9s|Kv|Kp|Kw|9z|9l|Kx|Ky|Kz|9k|L0|Ky|L1|4S|L2|Ky|L3|9s|L4|Ky|L5|9z|9l|L6|L7|L8|9k|L9|L7|LA|4S|LB|L7|LC|9s|LD|L7|LE|9z|9l|LF|LG|LH|9k|LI|LG|LJ|4S|LK|LG|LL|9s|LM|LG|LN|9z|9l|LO|LP|LQ|9k|LR|LP|LS|4S|LT|LP|LU|9s|LV|LP|LW|9z|9l|LX|LY|LZ|9k|La|LY|Lb|4S|Lc|LY|Ld|9s|Le|LY|Lf|A4|9l|Lg|Lh|Li|9k|Lj|Lh|Lk|4S|Ll|Lh|Lm|83|9l|Ln|Lo|83|A4|9l|Lp|Lq|Lr|9k|Ls|Lq|Lt|4S|Lu|Lq|Lv|83|9l|Lw|Lx|83|9z|9l|Ly|Lz|M0|9k|M1|Lz|M2|4S|M3|Lz|M4|9s|M5|Lz|M6|9z|9l|M7|M8|M9|9k|MA|M8|MB|4S|MC|M8|MD|9s|ME|M8|MF|9z|9l|MG|MH|MI|9k|MJ|MH|MK|4S|ML|MH|MM|9s|MN|MH|MO|9z|9l|MP|MQ|MR|9k|MS|MQ|MT|4S|MU|MQ|MV|9s|MW|MQ|MX|9z|9l|MY|MZ|Ma|9k|Mb|MZ|Mc|4S|Md|MZ|Me|9s|Mf|MZ|Mg|9z|9l|Mh|Mi|Mj|9k|Mk|Mi|Ml|4S|Mm|Mi|Mn|9s|Mo|Mi|Mp|A6|9l|Mq|Mr|Ms|9k|Mt|Mr|JE|A6|9l|Mu|Mv|Mw|9k|Mx|Mv|My|9z|9l|Mz|N0|N1|9k|N2|N0|N3|4S|N4|N0|N5|9s|N6|N0|N7|9z|9l|N8|N9|NA|9k|NB|N9|NC|4S|ND|N9|NE|9s|NF|N9|NG|9z|9l|NH|N9|NI|9k|NJ|N9|NK|4S|NL|N9|NM|9s|NN|N9|NO|9z|9l|NP|NQ|NR|9k|NS|NQ|NT|4S|NU|NQ|NV|9s|NW|NQ|NX|9z|9l|NY|NZ|Na|9k|Nb|NZ|Nc|4S|Nd|NZ|Ne|9s|Nf|NZ|Ng|9z|9l|Nh|Ni|Nj|9k|Nk|Ni|Nl|4S|Nm|Ni|Nn|9s|No|Ni|Np|83|9l|Nq|Nr|83|9z|9l|Ns|Nt|Nu|9k|Nv|Nt|Nw|4S|Nx|Nt|Ny|9s|Nz|Nt|EG|9z|9l|O0|O1|O2|9k|O3|O1|O4|4S|O5|O1|O6|9s|O7|O1|O8|9z|9l|O9|OA|OB|9k|OC|OA|OD|4S|Ce|OA|OE|9s|OF|OA|OG|9z|9l|OH|OI|OJ|9k|OK|OI|OL|4S|OM|OI|ON|9s|OO|OI|OP|9z|9l|OQ|IR|OR|9k|OS|IR|OT|4S|OU|IR|OV|9s|OW|IR|OX|9z|9l|OY|OZ|Oa|9k|Ob|OZ|Oc|4S|Od|OZ|Oe|9s|Of|OZ|Og|A4|9k|Oh|Oi|Oj|4S|Ok|Oi|Ol|9s|Om|Oi|On|A4|9k|Oo|Op|Oq|4S|Or|Op|Os|9s|Ot|Op|K2|A4|9k|Ou|Ov|Ow|4S|Ox|Ov|Oy|9s|Oz|Ov|P0|A4|9k|P1|P2|P3|4S|P4|P2|P5|9s|P6|P2|P7|A4|9k|P8|P9|PA|4S|PB|P9|PC|9s|PD|P9|PE|9z|9l|PF|PG|PH|9k|PI|PG|PJ|4S|PK|PG|PL|9s|PM|PG|PN|9z|9l|PO|PP|PQ|9k|PR|PP|PS|4S|PT|PP|PU|9s|PV|PP|PW|9z|9l|PX|PY|PZ|9k|Pa|PY|Pb|4S|Pc|PY|Pd|9s|Pe|PY|Pf|9z|9l|Pg|Ls|Ph|9k|Pi|Ls|Pj|4S|Pk|Ls|Pl|9s|Pm|Ls|Pn|9z|9l|Po|Pp|Pq|9k|Pr|Pp|Ps|4S|Pt|Pp|Pu|9s|Pv|Pp|Pw|9z|9l|Px|Py|Pz|9k|Q0|Py|Q1|4S|Q2|Py|Q3|9s|Q4|Py|Q5|9z|9l|Q6|Q7|Q8|9k|Q9|Q7|QA|4S|QB|Q7|QC|9s|QD|Q7|QE|9z|9l|QF|QG|QH|9k|QI|QG|QJ|4S|QK|QG|QL|9s|QM|QG|QN|9z|9l|QO|QP|QQ|9k|QR|QP|QS|4S|QT|QP|QU|9s|QV|QP|QW|A4|9k|QX|QY|QZ|4S|Qa|QY|Qb|9s|Qc|QY|Qd|9z|9l|Qe|3r|Qf|9k|Qg|3r|Qh|4S|Qi|3r|Qj|9s|Qk|3r|Ql|9z|9l|Qm|Qn|Qo|9k|Qp|Qn|Qq|4S|Qr|Qn|Qs|9s|Qt|Qn|Qu|9z|9l|Qv|N9|Qw|9k|Qx|N9|Qy|4S|Qz|N9|R0|9s|R1|N9|R2|9z|9l|R3|R4|R5|9k|R6|R4|R7|4S|R8|R4|R9|9s|RA|R4|RB|9z|9l|HX|RC|RD|9k|Ha|RC|RE|4S|Hc|RC|RF|9s|He|RC|RG|9z|9l|RH|RI|RJ|9k|RK|RI|RL|4S|RM|RI|RN|9s|RO|RI|RP|9z|9l|I1|RQ|RR|9k|42|RQ|RS|4S|RT|RQ|RU|9s|RV|RQ|RW|9z|9l|RX|RY|RZ|9k|Ra|RY|Rb|4S|Rc|RY|Rd|9s|Re|RY|Rf|9z|9l|Rg|Rh|Ri|9k|Rj|Rh|Rk|4S|Rl|Rh|Rm|9s|Rn|Rh|Ro|9z|9l|Rp|Rq|Rr|9k|Rs|Rq|Rt|4S|Ru|Rq|Rv|9s|Rw|Rq|Rx|9z|9l|Ry|Rz|S0|9k|S1|Rz|S2|4S|S3|Rz|S4|9s|S5|Rz|S6|9z|9l|MS|S7|S8|9k|MU|S7|S9|4S|SA|S7|SB|9s|SC|S7|SD|9z|9l|SE|SF|SG|9k|SH|SF|SI|4S|SJ|SF|SK|9s|SL|SF|SM|9z|9l|SN|SO|SP|9k|SQ|SO|SR|4S|SS|SO|ST|9s|SU|SO|SV|9z|9l|SW|SX|SY|9k|SZ|SX|Sa|4S|Sb|SX|Sc|9s|Sd|SX|Se|9z|9l|Sf|Sg|Sh|9k|Si|Sg|Sj|4S|Sk|Sg|Sl|9s|Sm|Sg|Sn|83|9l|So|Sp|83|83|9l|Sq|Sr|83\",\"n|1q\",\"n|1s\",\"n|1u\",\"n|1w\",\"n|20\",\"n|22\",\"n|24\",\"n|26\",\"n|28\",\"n|2A\",\"n|2C\",\"n|2E\",\"n|2G\",\"n|2I\",\"n|2K\",\"n|2O\",\"n|2S\",\"n|2U\",\"n|2W\",\"n|2Y\",\"n|2a\",\"n|2c\",\"n|2e\",\"n|2g\",\"n|2i\",\"n|2k\",\"n|2m\",\"n|2o\",\"n|2q\",\"n|2s\",\"n|2w\",\"n|2y\",\"n|30\",\"n|32\",\"n|34\",\"n|36\",\"n|38\",\"a|9n|9r|9Y|9x|9x|9i|9e|9Y|AE|AB|AB|9r|9i|9t|A6|3K|3K|DV|9t|A3|A3|AE|DL|DV|9n|A9|A6|9z|1q|DU|DU|17|DP|6J|6J|DR|DI|DW|DW|DQ|DG|64|64|Bl|DE|DX|DX|DT|5i|DY|DY|DM|A9|St|St|DN|9z|Su|Su|17|9k|Sv|Sv|DR|A1|Sw|Sw|DQ|3u|6U|6U|Bl|P|Sx|Sx|DT|9w|Sy|Sy|DM|9e|Sz|Sz|DN|T0|T1|A3|T2|T1|T2|T2|T3|T3|T4|DE|DF|DF|DG|64|T5|T5|DX|DT|T6|T6|Bl|T5|T6|6U|T7|T7|Sx|T6|T7|3u|AF|AF|P|T7|AF|5i|40|40|DE|DX|6b|6b|DY|40|6b|DT|T8|T8|DM|6b|T8|Sx|f|f|Sy|T8|f|P|9d|9d|9w|f|9d|A9|68|68|5i|DY|T9|T9|St|68|T9|DM|TA|TA|DN|T9|TA|Sy|TB|TB|Sz|TA|TB|9w|9X|9X|9e|TB|9X|St|TC|TC|T0|DN|TD|TD|T2|TC|TD|Sz|TE|TE|T4|TD|TE|DG|DH|DH|DI|DW|TF|TF|64|DH|TF|Bl|TG|TG|DQ|TF|TG|Sw|TH|TH|6U|TG|TH|A1|4H|4H|3u|TH|4H|DI|DO|DO|DP|6J|TI|TI|DW|DO|TI|DQ|TJ|TJ|DR|TI|TJ|Sv|TK|TK|Sw|TJ|TK|5p|TL|TL|TM|TM|1Q|1Q|9j|9k|9s|9s|A1|TK|9s|DP|DS|DS|5p|6J|TN|TN|TL|DS|TN|DR|TO|TO|TM|TN|TO|Sv|TP|TP|1Q|TO|TP|9j|9g|9g|9k|TP|9g|5p|DJ|DJ|1q|DU|TQ|TQ|TL|DJ|TQ|17|TR|TR|TM|TQ|TR|Su|TS|TS|1Q|TR|TS|9z|3R|3R|9j|TS|3R|1q|DK|DK|DL|3K|TT|TT|17|DK|TT|TT|A6\",\"o|7i|Dc|7k|GR|Gh|Ss|AE|TU|4t|4u\",\"skins/test/legSittingL\",\"n|0.38A\",\"n|0.DUj\",\"n|0.OI6\",\"n|0.Kq3\",\"n|0.I57\",\"n|0.IqK\",\"n|0.MMl\",\"n|0.MGE\",\"n|0.G1\",\"n|0.18d\",\"n|0.MvB\",\"n|0.9OP\",\"n|0.1jv\",\"n|0.4zd\",\"n|0.Oq0\",\"n|0.KSy\",\"n|0.GXy\",\"n|0.PnH\",\"n|0.KjE\",\"n|0.Eyb\",\"n|0.5Po\",\"n|0.E57\",\"n|0.K7Q\",\"n|0.Cbe\",\"n|0.1me\",\"n|0.CVV\",\"n|0.4q1\",\"n|0.LPl\",\"n|0.LV5\",\"n|0.63A\",\"n|0.OPG\",\"n|0.O8w\",\"n|0.9En\",\"n|0.9oI\",\"n|0.CE4\",\"n|0.5mx\",\"n|0.HFq\",\"n|0.LDa\",\"n|0.488\",\"n|0.94H\",\"n|0.AOe\",\"n|0.M2y\",\"n|0.9Lf\",\"n|0.31n\",\"n|0.AaH\",\"n|0.Gx2\",\"n|0.8l9\",\"n|0.1tg\",\"n|0.J8R\",\"n|0.A3p\",\"n|0.GCU\",\"n|0.69V\",\"n|0.3La\",\"n|0.D60\",\"n|0.EhJ\",\"n|0.DyN\",\"n|0.AN4\",\"n|0.Odf\",\"n|0.9QN\",\"n|0.CvN\",\"n|0.1Od\",\"n|0.Noi\",\"n|0.NL8\",\"n|0.IgB\",\"n|0.3oo\",\"n|0.5br\",\"n|0.9Dz\",\"n|0.Eke\",\"n|0.BIs\",\"n|0.Myo\",\"n|0.9WF\",\"n|0.Fm2\",\"n|0.2tJ\",\"n|0.6SJ\",\"n|0.Fdk\",\"n|0.9Xk\",\"n|0.4GQ\",\"n|0.KcW\",\"n|0.3OP\",\"n|0.4EU\",\"n|0.3ow\",\"n|0.991\",\"n|0.I25\",\"n|0.NBM\",\"n|0.Cy3\",\"n|0.HRs\",\"n|0.3M6\",\"n|0.NJb\",\"n|0.H0E\",\"n|0.Duh\",\"n|0.MnR\",\"n|0.Brw\",\"n|0.6H6\",\"n|0.DjN\",\"n|0.5MH\",\"n|0.Jcs\",\"n|0.GtH\",\"n|0.JfI\",\"n|0.GAv\",\"n|0.OjB\",\"n|0.6h2\",\"n|0.2zc\",\"n|0.BDD\",\"n|0.2Vc\",\"n|0.C47\",\"n|0.12m\",\"n|0.DPI\",\"n|0.K2r\",\"n|0.H2n\",\"n|0.Iyl\",\"n|0.38o\",\"n|0.448\",\"a|TX|TY|TZ|Ta|Tb|Tc|Td|Te|83|Tf|Tg|Th|Ti|Tj|Tk|Tl|Tm|Tn|To|3K|Tp|3K|Tq|Tr|Ts|Tt|Tu|Tv|Tw|Tx|Ty|Tz|U0|U1|U2|U3|3K|U4|U5|U6|U7|U8|U9|TY|UA|UB|UC|UD|UE|UF|UG|83|UH|7r|UI|UJ|UK|UL|UM|UN|UO|UP|UQ|UR|US|UT|UU|UV|UW|UX|UY|UZ|Ua|Ub|Uc|Ud|Ue|Uf|Ug|Uh|Ui|Uj|Uk|Ul|Um|Un|Uo|Up|Uq|Ur|Us|Ut|Uu|Uv|Uw|Ux|Uy|Uz|V0|V1|V2|V3|V4|V5|V6|V7|V8|V9|VA|VB|VC|VD|VE|VF|VG|VH|VI|RE|VJ|VK\",\"a|6D|68|5o|68|A5|5o|5i|9h|9j|9g|9h|5i|9v|9g|5i|9l|9g|9v|9n|9v|5i|Gb|9j|9p|5i|9j|Gb|AD|5i|Gb|9n|5i|AD|5o|9p|3R|Gb|9p|5o|A5|Gb|5o|5o|3R|9u|40|5o|9u|6D|5o|40|40|9u|9z|9t|6D|40|9t|40|9z|A9|AD|Gb|A5|A9|Gb|A4|9t|9z|A7|A9|A5|AC|9n|AD|AA|9l|9v|9r|68|6D|9t|A0|6D|9q|9r|6D|AA|9k|9l|9k|9X|9a|4S|9k|9a|AA|9X|9k|9e|AA|AE|9X|AA|9e|9f|AE|AC|9e|AE|9f|9Y|AC|AB|9f|AC|9Y|A2|AB|A7|9Y|AB|A2|A2|A7|9r|9x|A2|9r|9x|9r|9q|9m|9x|9q|6D|A0|9q|A0|9t|A4|A3|9m|9q|A0|A3|9q|A1|3o|4H|9i|9m|A3|A6|A0|A4|A3|A0|A6|83|9i|A3|A8|A1|4H|9y|3u|3o|A6|83|A3|9o|9i|83|A1|9y|3o|9s|4L|3u|9w|9i|9o|9x|9m|9d|3K|9o|83|9y|9s|3u|9a|AF|4L|9x|P|A2|3K|9w|9o|9X|AF|9a|9a|9s|4S|9s|9a|4L|9e|AF|9X|9f|AF|9e|9Z|9f|9Y|P|9Z|9Y|A2|P|9Y|9x|9b|P|AF|9f|9Z|9w|9c|9i|9i|9d|9m|9c|9d|9i|9d|9b|9x|AA|9v|AE|9r|A7|68|AB|A9|A7|AC|AD|AB|AE|9n|AC|68|A7|A5|AE|9v|9n|AB|AD|A9\",\"n|-1j.V\",\"n|2m.j\",\"n|1X.1\",\"n|2m.1D\",\"n|0.9q\",\"n|-2C.1L\",\"n|2g.b\",\"n|13.w\",\"n|2g.15\",\"n|-2a.1L\",\"n|2a.11\",\"n|0.HWt\",\"n|f.w\",\"n|2a.1V\",\"n|0.B5I\",\"n|-3U.X\",\"n|2K.M\",\"n|0.HUv\",\"n|-E.1\",\"n|2K.q\",\"n|0.B7G\",\"n|-3r.1\",\"n|28.D\",\"n|0.7n\",\"n|-a.1G\",\"n|28.h\",\"n|0.9w\",\"n|-m.c\",\"n|1h.1J\",\"n|-s.O\",\"n|x.10\",\"n|-m.14\",\"n|3.b\",\"n|-V.u\",\"n|-0.h\",\"n|-1J.1S\",\"n|H.16\",\"n|-1a.m\",\"n|-2M.1b\",\"n|-1y.c\",\"n|0.EI\",\"n|t.W\",\"n|-1y.8\",\"n|0.3R\",\"n|-27.1S\",\"n|-27.X\",\"n|0.BG\",\"n|19.f\",\"n|-27.3\",\"n|0.6T\",\"n|-1i.J\",\"n|-2J.w\",\"n|-1C.1a\",\"n|-2Y.o\",\"n|-l.15\",\"n|-2c.1C\",\"n|-E.a\",\"n|-2c.k\",\"n|H.1\",\"n|-2U.15\",\"n|i.1R\",\"n|-2C.O\",\"n|1C.b\",\"n|-1h.5\",\"n|1S.1O\",\"n|-18.R\",\"n|1c.1M\",\"n|-T.n\",\"n|1a.13\",\"n|C.c\",\"n|1R.V\",\"n|r.e\",\"n|4h.11\",\"n|r.18\",\"n|1C.1O\",\"n|1P.16\",\"n|4S.J\",\"n|1P.1a\",\"n|j.1M\",\"n|1y.13\",\"n|3z.7\",\"n|1y.1X\",\"n|D.r\",\"n|2T.1a\",\"n|-T.19\",\"n|2p.1C\",\"n|-19.M\",\"n|2t.12\",\"n|-26.1L\",\"n|-1s.1O\",\"n|-2O.j\",\"n|-1O.b\",\"n|-2p.1U\",\"n|-1A.t\",\"n|Q.n\",\"n|-1A.P\",\"n|-2d.1B\",\"n|-y.q\",\"n|-2n.H\",\"n|-V.17\",\"n|-2u.1E\",\"n|-0.1Q\",\"n|-2w.1W\",\"n|Q.d\",\"n|-2v.U\",\"n|y.D\",\"n|-2m.n\",\"n|1U.Y\",\"n|-2O.I\",\"n|27.16\",\"n|-1z.7\",\"n|2Y.c\",\"n|-3P.r\",\"n|1r.18\",\"n|0.Mgr\",\"n|-9.V\",\"n|1r.1\",\"n|0.5vK\",\"n|-30.3\",\"n|1y.17\",\"n|0.PFR\",\"n|F.d\",\"n|0.3Mk\",\"n|-2j.1A\",\"n|23.19\",\"n|0.4U\",\"n|W.x\",\"n|23.2\",\"n|0.DF\",\"n|-2Y.1G\",\"n|-1I.1F\",\"n|0.2zI\",\"n|h.r\",\"n|-1I.l\",\"n|0.Pct\",\"n|-2o.c\",\"n|-q.n\",\"n|0.1Q\",\"n|R.4\",\"n|-q.J\",\"n|0.L\",\"n|-2x.17\",\"n|-S.s\",\"n|0.Bqy\",\"n|I.1A\",\"n|-S.E\",\"n|0.GlD\",\"n|-33.C\",\"n|-0.T\",\"n|0.Mxg\",\"n|D.A\",\"n|-0.1a\",\"n|0.5eV\",\"n|-36.w\",\"n|Q.m\",\"n|0.ARi\",\"n|9.1L\",\"n|Q.1G\",\"n|0.IAT\",\"n|-36.6\",\"n|x.M\",\"n|0.Kiy\",\"n|9.a\",\"n|0.7tD\",\"n|-2z.t\",\"n|0.4Be\",\"n|G.1E\",\"n|1S.1\",\"n|0.OQX\",\"n|-32.c\",\"n|-l.1K\",\"n|D.4\",\"n|-l.q\",\"n|-3B.O\",\"n|-O\",\"n|0.ENY\",\"n|4.I\",\"n|-N.17\",\"n|0.EEd\",\"n|-3G.1L\",\"n|-0.Z\",\"n|0.PxI\",\"n|-0.z\",\"n|-0.5\",\"n|0.2et\",\"n|-3J.q\",\"n|R.h\",\"n|0.Elk\",\"n|-3.U\",\"n|R.1B\",\"n|0.DqR\",\"n|-3K.3\",\"n|u.8\",\"n|0.HyI\",\"n|-4.18\",\"n|u.c\",\"n|0.Adt\",\"n|-3D.1E\",\"n|0.Hf6\",\"n|2.13\",\"n|1P.U\",\"n|0.Ax5\",\"n|-3M.16\",\"n|-s.16\",\"n|0.3mM\",\"n|-6.a\",\"n|-s.c\",\"n|0.Opp\",\"n|-3i.g\",\"n|1.S\",\"n|0.Ls8\",\"n|-S.A\",\"n|1.w\",\"n|0.6k3\",\"n|-3t.14\",\"n|1i.1Q\",\"n|0.JKP\",\"n|-d.Y\",\"n|1i.J\",\"n|0.9Hm\",\"n|-3q.17\",\"n|x.1F\",\"n|0.7cQ\",\"n|-a.l\",\"n|x.8\",\"n|0.Kzl\",\"a|A6|9s|VN|VO|7u|9l|VP|VQ|VR|A6|9s|VS|VT|Ms|9l|VU|VV|JE|A6|9s|VW|VX|VY|9l|VZ|Va|Vb|A6|9s|Vc|Vd|Ve|9l|Vf|Vg|Vh|A6|9s|Vi|Vj|Vk|9l|Vl|Vm|Vn|83|9l|Vo|Vp|83|83|9l|Vq|Vr|83|83|9l|Vs|Vt|83|83|9l|Vu|Gs|83|83|9l|Vv|Vw|83|83|9l|Vx|Vy|83|A6|9s|Vz|W0|W1|9l|W2|W3|W4|A6|9s|W5|W6|W7|9l|W8|W9|WA|83|9s|WB|WC|83|83|9s|WD|WE|83|83|9s|WF|WG|83|83|9s|WH|WI|83|83|9s|WJ|WK|83|83|9s|WL|WM|83|83|9s|WN|WO|83|83|9s|WP|WQ|83|83|9s|WR|WS|83|83|9s|WT|WU|83|A6|9s|WV|WW|7u|9l|WX|WY|VR|A6|9s|WZ|Wa|7u|9l|Wb|Wc|VR|A6|9s|Wd|We|7u|9l|Wf|Wg|VR|83|9s|Wh|Wi|83|83|9s|Wj|Wk|83|83|9s|Wl|Wm|83|83|9s|Wn|Wo|83|83|9s|Wp|Wq|83|A6|9s|Wr|Ws|W1|9l|Wt|Wu|W4|83|9s|Wv|Ww|83|83|9s|Wx|Wy|83|83|9s|Wz|X0|83|83|9s|X1|X2|83|83|9s|X3|X4|83|83|9s|X5|X6|83|83|9s|X7|X8|83|83|9s|X9|XA|83|A6|9s|XB|XC|XD|9l|XE|XF|XG|A6|9s|XH|XI|XJ|9l|XK|IX|XL|A6|9s|XM|XN|XO|9l|XP|XQ|XR|A6|9s|XS|XT|XU|9l|XV|XW|XX|A6|9s|XY|XZ|Xa|9l|Xb|Xc|Xd|A6|9s|Xe|Xf|Xg|9l|Xh|Xi|Xj|A6|9s|Xk|Xl|Xm|9l|Xn|Xo|Xp|A6|9s|Xq|Xr|Xs|9l|Xt|Xu|Xv|A6|9s|Xw|Xx|Xy|9l|Xz|Vr|Y0|A6|9s|Y1|p|Y2|9l|Y3|Y4|Y5|A6|9s|Y6|Y7|W1|9l|Y8|Y9|W4|A6|9s|YA|YB|YC|9l|YD|YE|YF|A6|9s|YG|YH|YI|9l|YJ|YK|YL|A6|9s|YM|YN|YO|9l|YP|YQ|YR|A6|9s|YS|YT|YU|9l|YV|YW|YX|A6|9s|YY|Gd|YZ|9l|Ya|Yb|Yc|A6|9s|Yd|Ye|Yf|9l|Yg|Yh|Yi|A6|9s|Yj|Yk|Yl|9l|Ym|Yn|Yo|A6|9s|Yp|Yq|Yr|9l|Ys|Yt|Yu|A6|9s|Yv|Yw|Yx|9l|Yy|Yz|Z0\",\"a|3R|9j|9j|9g|9g|9k|9k|9s|AF|P|P|9d|9d|9w|9e|9Y|9Y|9x|9x|9i|9i|9t|9t|A3|A3|AE|AE|AB|AB|9r|9r|9n|9n|A9|A9|68|68|5i|3K|5i|9d|40|40|DE|A1|4H|DE|DG|DG|DH|DH|DI|DI|DO|DO|DP|DP|DS|5p|DJ|DJ|3K|1q|DK|DK|DL|DL|5p|3K|A6|DE|DV|DV|DF|P|DV|AF|DF|DL|A6|A6|9z|9z|3R|DK|9z|DV|DT|DT|DM|DM|DN|DN|Bl|Bl|DQ|DQ|DR|DR|DL|DF|17|17|DU|DU|6J|6J|DW|DW|64|64|DX|DX|DK|4H|3u|3u|AF|9w|9X|9X|9e|DS|5p|A1|DY|DY|DF|3u|DY|9s|A1|DY|St|9g|Su|Su|1q|Su|9j|St|Sv|Sv|Su\",\"o|7i|TW|7k|VL|VM|Z1|9a|Z2|4x|4y\",\"o|4r|TV|Z3\",\"skins/test/legR\",\"n|0.BYa\",\"n|0.PtK\",\"n|0.4ke\",\"n|0.Hbm\",\"n|0.80Q\",\"n|0.4cJ\",\"n|0.4V0\",\"n|0.Cr8\",\"n|0.2Uz\",\"n|0.KBK\",\"n|0.GQD\",\"n|0.Hcd\",\"n|0.NGZ\",\"n|0.G1c\",\"n|0.Hfx\",\"n|0.BxM\",\"n|0.6o5\",\"n|0.Lb7\",\"n|0.A2F\",\"n|0.BEX\",\"n|0.5Qv\",\"n|0.Ong\",\"n|0.2T0\",\"n|0.CTL\",\"n|0.DC2\",\"n|0.P0T\",\"n|0.6jt\",\"n|0.3kY\",\"n|0.9B\",\"n|0.Kfs\",\"n|0.6dr\",\"n|0.JgN\",\"n|0.DQc\",\"n|0.Ppb\",\"n|0.AIY\",\"n|0.9Ah\",\"n|0.2g8\",\"n|0.C2v\",\"n|0.4xE\",\"n|0.FN1\",\"n|0.Meq\",\"n|0.I71\",\"n|0.5dc\",\"n|0.1XG\",\"n|0.Ebj\",\"n|0.Bw4\",\"n|0.LG8\",\"n|0.IKV\",\"n|0.EFk\",\"n|0.MFO\",\"n|0.IAd\",\"n|0.2uz\",\"n|0.CI6\",\"n|0.Ft0\",\"n|0.DBv\",\"n|0.DDg\",\"n|0.NlG\",\"n|0.PI4\",\"n|0.N8Q\",\"n|0.5JC\",\"n|0.AKQ\",\"n|0.2qt\",\"n|0.Clq\",\"n|0.4a7\",\"n|0.5cZ\",\"n|0.Oj5\",\"n|0.KAB\",\"n|0.6vE\",\"n|0.Ap9\",\"n|0.Ppn\",\"n|0.8RR\",\"n|0.Exb\",\"n|0.hm\",\"n|0.HDv\",\"n|0.4OA\",\"n|0.9jP\",\"n|0.8sj\",\"n|0.9D9\",\"n|0.Pj5\",\"n|0.MGp\",\"n|0.PM2\",\"n|0.6vD\",\"n|0.KyH\",\"n|0.2GV\",\"n|0.CDX\",\"n|0.6Yn\",\"n|0.NjQ\",\"n|0.Chn\",\"n|0.DmU\",\"n|0.HZ7\",\"n|0.8NA\",\"n|0.2EU\",\"n|0.AMs\",\"n|0.M6S\",\"n|0.Ebv\",\"n|0.D45\",\"n|0.Gug\",\"n|0.7OV\",\"n|0.4Zt\",\"n|0.vD\",\"n|0.2XR\",\"n|0.5v3\",\"n|0.FUC\",\"n|0.4T3\",\"n|0.4Mq\",\"n|0.PB5\",\"n|0.LZx\",\"n|0.Laf\",\"n|0.34Y\",\"n|0.KdK\",\"n|0.2MW\",\"n|0.Fqi\",\"n|0.HEJ\",\"n|0.BSS\",\"n|0.Oa7\",\"n|0.LAE\",\"n|0.DxG\",\"n|0.3yG\",\"n|0.35s\",\"n|0.9vO\",\"n|0.3nz\",\"n|0.6xW\",\"n|0.2t4\",\"n|0.FCy\",\"n|0.P94\",\"n|0.L7G\",\"n|0.Nun\",\"n|0.FZi\",\"n|0.HqL\",\"n|0.FBg\",\"n|0.N0g\",\"n|0.HdS\",\"n|0.AIJ\",\"n|0.ADx\",\"n|0.70S\",\"n|0.FIT\",\"n|0.OIO\",\"n|0.2hz\",\"n|0.wp\",\"n|0.6k\",\"n|0.3Pa\",\"n|0.C4F\",\"n|0.ORS\",\"a|Z6|Z7|Z8|Z9|ZA|ZB|ZC|ZD|ZE|ZF|ZG|ZH|ZI|ZJ|ZK|ZL|ZM|ZN|ZO|ZP|ZQ|ZR|7r|ZS|7r|ZT|83|ZU|ZV|ZW|ZX|ZY|ZZ|83|Za|7r|Zb|7r|Zc|Zd|Ze|Zf|Zg|Zh|3K|Zi|E9|Zj|Zk|Zl|3K|Zm|3K|Zn|3K|Zo|3K|Zp|E9|Zq|E9|Zr|E9|Zs|E9|Zt|E9|Zu|E9|Zv|Zw|Zx|Zy|Zz|a0|a1|a2|a3|a4|3K|a5|3K|a6|a7|a8|a9|aA|aB|aC|NM|aD|aE|aF|aG|aH|aI|aJ|aK|aL|aM|aN|aO|aP|aQ|aR|aS|aT|aU|aV|aW|aX|aY|aZ|aa|ab|ac|ad|ae|af|ag|ah|ai|aj|ak|al|am|an|ao|ap|aq|ar|as|at|au|av|aw|ax|ay|az|b0|b1|b2|b3|b4|b5|b6|b7|b8|b9|bA|bB|bC|bD|bE|bF|bG|bH|bI|bJ|bK|bL|bM|bN|bO\",\"a|DI|9h|9g|GT|DI|9g|GT|9g|9l|GT|9l|9k|Gb|GT|9k|GW|GT|Gb|40|GW|Gb|1q|40|Gb|Gb|9k|4S|A5|A9|GW|A5|GW|40|5i|40|1q|68|GV|A5|40|68|A5|6D|40|5i|68|40|6D|4L|AF|A5|9s|Gb|4S|1q|Gb|9s|3u|4L|A5|3u|A5|GV|9y|1q|9s|5i|1q|9y|3o|GV|68|3u|GV|3o|A1|A8|6D|4H|68|6D|4H|6D|A8|3o|68|4H|5i|A1|6D|A1|5i|9y|GU|3R|9p|A0|5u|DG|A0|DG|GU|DH|GU|9p|DH|9p|9j|9r|5u|A0|9c|9w|9r|5p|A0|GU|5p|GU|DH|GS|DH|9j|GS|9j|9h|9q|9c|9r|5p|9q|9r|5p|9r|A0|9d|9c|9q|Ga|5p|DH|Ga|DH|GS|DI|GS|9h|Ga|9n|9q|Ga|9q|5p|9d|9q|9n|9b|9d|9n|DJ|Ga|GS|DJ|GS|DI|DJ|AD|9n|DJ|9n|Ga|9b|9n|AD|P|9b|AD|GT|GW|DJ|GT|DJ|DI|GW|A9|AD|GW|AD|DJ|P|AD|A9|9Z|P|A9|9Z|A9|A5|AF|9Z|A5|GY|DP|Gc|GY|Gc|DF|GX|DF|9z|GX|9z|9u|DS|GY|DF|DS|DF|GX|AB|AC|GY|AB|GY|DS|DG|GX|9u|DG|9u|3R|5u|DS|GX|5u|GX|DG|A7|9a|AB|5u|A7|AB|5u|AB|DS|GU|DG|3R|9w|9a|A7|9r|A7|5u|9w|A7|9r|9a|9X|AB|9X|AC|AB|AC|9v|AE|5o|9o|9t|5o|9t|3K|5o|3K|83|DO|9i|9o|DO|9o|5o|A3|A2|9x|9Y|A2|A3|A3|9x|9m|DO|A3|9m|DO|9m|9i|9f|9Y|A3|DE|5o|83|DE|83|A6|GZ|DO|5o|GZ|5o|DE|AA|9f|A3|GZ|AA|A3|GZ|A3|DO|9e|9f|AA|Gc|DE|A6|Gc|A6|A4|DP|GZ|DE|DP|DE|Gc|AE|AA|GZ|AE|GZ|DP|9e|AA|AE|9v|9e|AE|DF|Gc|A4|DF|A4|9z|9X|9v|AC|GY|AE|DP|GY|AC|AE\",\"n|G.1A\",\"n|1d.O\",\"n|0.3Cq\",\"n|-o.6\",\"n|0.FMb\",\"n|-1t.1C\",\"n|0.8yc\",\"n|-2y.h\",\"n|0.3do\",\"n|X.Q\",\"n|1l.T\",\"n|0.s9\",\"n|-X.q\",\"n|0.Ece\",\"n|-1c.L\",\"n|0.Dow\",\"n|-2g.1b\",\"n|0.1s8\",\"n|o.1B\",\"n|1o.K\",\"n|0.9Qw\",\"n|-G.5\",\"n|0.NCG\",\"n|-1L.1B\",\"n|0.IP8\",\"n|-2Q.g\",\"n|0.6Bs\",\"n|16.w\",\"n|1q.h\",\"n|0.8qx\",\"n|1.1R\",\"n|0.FPX\",\"n|-12.1Q\",\"n|0.4GX\",\"n|-27.v\",\"n|0.2eq\",\"n|1N.1D\",\"n|1s.i\",\"n|0.GHk\",\"n|I.7\",\"n|0.Khb\",\"n|-m.19\",\"n|0.Bnd\",\"n|-1r.U\",\"n|0.8RE\",\"n|1e.G\",\"n|1u.1N\",\"n|0.DZo\",\"n|Z.v\",\"n|0.2kr\",\"n|-V.L\",\"n|0.NEq\",\"n|-1Z.1b\",\"n|0.HgI\",\"n|1u.1E\",\"n|1w.1X\",\"n|0.Er0\",\"n|p.8\",\"n|0.4Pb\",\"n|-F.18\",\"n|0.1ox\",\"n|-1J.n\",\"n|0.Cvx\",\"n|2C.1S\",\"n|1y.1F\",\"n|0.MIb\",\"n|17.M\",\"n|0.OYn\",\"n|2.r\",\"n|0.KHJ\",\"n|-12.P\",\"n|0.G6F\",\"n|2Q.y\",\"n|20.Z\",\"n|0.5aS\",\"n|1L.1T\",\"n|0.H8\",\"n|G.N\",\"n|0.Bfv\",\"n|-o.j\",\"n|0.8mY\",\"n|2g.S\",\"n|22.a\",\"n|0.Btk\",\"n|1b.x\",\"n|0.7PX\",\"n|X.1I\",\"n|0.Bcr\",\"n|-X.1Z\",\"n|0.Yt\",\"n|2v.1J\",\"n|0.Rk\",\"n|1q.D\",\"n|0.Kgv\",\"n|l.i\",\"n|0.LP9\",\"n|-J.Y\",\"n|0.EgO\",\"n|39.1U\",\"n|26.2\",\"n|0.PbG\",\"n|24.O\",\"n|0.Ihh\",\"n|z.t\",\"n|0.OO9\",\"n|-5.N\",\"n|0.H7X\",\"n|3Q.H\",\"n|0.DA8\",\"n|2L.m\",\"n|0.J70\",\"n|1G.1H\",\"n|0.7jF\",\"n|C.1\",\"n|0.HCE\",\"n|3i.1Z\",\"n|22.6\",\"n|0.26e\",\"n|2d.T\",\"n|0.3gE\",\"n|1Z.o\",\"n|0.J0k\",\"n|U.1J\",\"n|0.918\",\"n|30.14\",\"n|1f.11\",\"n|0.NmW\",\"n|1v.1Z\",\"n|0.HaM\",\"n|q.T\",\"n|0.DG3\",\"n|3C.1O\",\"n|1B.12\",\"n|0.DQG\",\"n|27.I\",\"n|0.4fr\",\"n|12.n\",\"n|0.Am2\",\"n|2D.1C\",\"n|Z.6\",\"n|0.Dav\",\"n|18.6\",\"n|0.F1G\",\"n|29.R\",\"n|0.Ap\",\"n|14.16\",\"n|0.6u\",\"n|25.1T\",\"n|-k.A\",\"n|0.Cw\",\"n|10.N\",\"n|0.4n\",\"n|34.E\",\"n|-1K.1R\",\"n|0.4yE\",\"n|1z.j\",\"n|u.1E\",\"n|0.6nF\",\"n|2q.o\",\"n|-1s.h\",\"n|0.OBC\",\"n|1l.1J\",\"n|0.PAX\",\"n|g.D\",\"n|0.5In\",\"n|3f.1U\",\"n|-2F.6\",\"n|0.252\",\"n|2a.O\",\"n|0.3AS\",\"n|1V.t\",\"n|0.J0I\",\"n|Q.1O\",\"n|0.6xg\",\"n|3O.11\",\"n|-2E.1Y\",\"n|0.KrY\",\"n|2J.1W\",\"n|0.cY\",\"n|1E.Q\",\"n|0.NSG\",\"n|9.v\",\"n|0.6qu\",\"n|38.q\",\"n|-2D.o\",\"n|0.G3A\",\"n|23.1L\",\"n|0.LWD\",\"n|y.P\",\"n|0.PJ6\",\"n|-6.r\",\"n|0.HVD\",\"n|2t.8\",\"n|-2B.B\",\"n|0.8k6\",\"n|1o.d\",\"n|0.MOF\",\"n|k.y\",\"n|0.3Ys\",\"n|-K.I\",\"n|0.MWz\",\"n|2g.1S\",\"n|-2A.2\",\"n|0.970\",\"n|1b.M\",\"n|0.5jC\",\"n|W.r\",\"n|0.ONC\",\"n|-Y.P\",\"n|0.Hkq\",\"n|2O.2\",\"n|-28.1L\",\"n|0.A8E\",\"n|1J.X\",\"n|0.Feq\",\"n|E.12\",\"n|0.MwA\",\"n|-q.E\",\"n|0.8WZ\",\"n|28.14\",\"n|-26.I\",\"n|0.4mx\",\"n|13.1Z\",\"n|0.CMp\",\"n|0.9bO\",\"n|-15.x\",\"n|0.A7b\",\"n|1r.7\",\"n|-25.1S\",\"n|0.3RG\",\"n|m.m\",\"n|0.1y9\",\"n|-I.U\",\"n|0.E6j\",\"n|-1M.9\",\"n|0.BxI\",\"n|-23.O\",\"n|0.PF3\",\"n|0.Kh\",\"n|0.E22\",\"n|-1d.1V\",\"n|0.HcQ\",\"n|1K.1A\",\"n|-21.7\",\"n|0.En0\",\"n|F.4\",\"n|0.IaT\",\"n|-p.1C\",\"n|0.HQ1\",\"n|-1u.h\",\"n|0.6gg\",\"n|12.1B\",\"n|-1z.1Q\",\"n|0.3sa\",\"n|-2.1W\",\"n|0.35U\",\"n|-17.11\",\"n|0.OdG\",\"n|-2C.W\",\"n|0.9g\",\"n|j.18\",\"n|-1x.T\",\"n|0.9S6\",\"n|-L.8\",\"n|0.3T1\",\"n|-1Q.1E\",\"n|0.8Nq\",\"n|-2V.j\",\"n|0.9su\",\"n|R.19\",\"n|-1w.B\",\"n|H.1A\",\"n|-1v.B\",\"n|4.b\",\"n|-1f.l\",\"n|-4.w\",\"n|-1N.1D\",\"n|-2.1Q\",\"n|-q.e\",\"n|0.e\",\"n|0.KoJ\",\"n|-14.c\",\"n|0.7ns\",\"n|0.1Z\",\"n|j.1\",\"n|0.Msr\",\"n|-14.1I\",\"n|0.NgE\",\"n|-28.x\",\"n|1P.b\",\"n|0.FGG\",\"n|-z.15\",\"n|0.Lj7\",\"n|-24.a\",\"n|0.KDE\",\"n|2C.s\",\"n|0.18\",\"n|17.1N\",\"n|0.CZj\",\"n|2.H\",\"n|0.NaC\",\"n|-12.z\",\"n|0.APA\",\"n|S.e\",\"n|-1R.p\",\"n|j.1F\",\"n|-1T.o\",\"n|0.m\",\"n|-1P.1H\",\"n|12.17\",\"n|-1U.1a\",\"n|0.HW4\",\"n|-1.J\",\"n|0.CH0\",\"n|-16.1P\",\"n|0.Eqe\",\"n|-2B.u\",\"n|0.EuC\",\"n|1K.1O\",\"n|-1X.1A\",\"n|0.JiA\",\"n|F.S\",\"n|0.Nlb\",\"n|-p.o\",\"n|0.8Fx\",\"n|-1t.T\",\"n|1b.u\",\"n|-1Y.F\",\"n|0.35B\",\"n|W.1P\",\"n|0.CHB\",\"n|-Y.1S\",\"n|0.2Ok\",\"n|-1c.17\",\"n|1s.y\",\"n|-1b\",\"n|0.wG\",\"n|n.1T\",\"n|0.K3c\",\"n|-H.1O\",\"n|0.MVX\",\"n|-1M.t\",\"n|0.DhC\",\"n|28.1b\",\"n|-1c.19\",\"n|0.4Gr\",\"n|14.L\",\"n|0.JTJ\",\"n|-0.v\",\"n|0.JxK\",\"n|-15.Q\",\"n|0.GNy\",\"n|2O.O\",\"n|-1d.1Z\",\"n|0.6e6\",\"n|1J.t\",\"n|0.CUF\",\"n|E.1O\",\"n|0.8Ge\",\"n|-q.1T\",\"n|0.44R\",\"n|2g.1J\",\"n|-1f.e\",\"n|0.9oO\",\"n|1b.D\",\"n|0.9tG\",\"n|W.i\",\"n|0.POR\",\"n|-Y.Y\",\"n|0.EgC\",\"n|2t.17\",\"n|-1g.Y\",\"n|0.1vW\",\"n|1p.1S\",\"n|0.2nZ\",\"n|k.M\",\"n|0.FP5\",\"n|-K.u\",\"n|0.BJf\",\"n|38.1L\",\"n|-1h.1D\",\"n|0.ECe\",\"n|23.F\",\"n|0.14T\",\"n|y.k\",\"n|0.3vS\",\"n|-6.W\",\"n|0.9Pb\",\"n|3M.Q\",\"n|-1h.15\",\"n|0.PG8\",\"n|2H.v\",\"n|0.NVk\",\"n|1C.1Q\",\"n|0.Mvq\",\"n|8.A\",\"n|0.Dca\",\"n|2d.p\",\"n|-l.O\",\"n|0.KOg\",\"n|1Y.1K\",\"n|0.KE4\",\"n|T.E\",\"n|0.GZr\",\"n|1d.13\",\"n|-0.u\",\"n|0.8Gw\",\"n|Y.1Y\",\"n|0.KLF\",\"n|3l.6\",\"n|0.L4S\",\"n|2g.l\",\"n|0.FVS\",\"n|1b.1G\",\"n|0.7Cd\",\"n|0.G2x\",\"n|3Q.4\",\"n|1V.1D\",\"n|0.5pI\",\"n|2L.Z\",\"n|0.BAk\",\"n|1G.14\",\"n|0.5PX\",\"n|B.1Z\",\"n|0.47G\",\"n|1K.1M\",\"n|0.2oE\",\"n|F.G\",\"n|0.Pnx\",\"n|W.1X\",\"n|1B.V\",\"n|0.78O\",\"n|-Y.1K\",\"n|0.7n5\",\"n|-1d.p\",\"n|0.Efq\",\"n|-2i.K\",\"n|0.1ou\",\"n|n.1N\",\"n|1E.1Q\",\"n|0.9tB\",\"n|-H.1U\",\"n|0.6EA\",\"n|-1M.z\",\"n|0.N1u\",\"n|-2R.U\",\"n|0.Kd2\",\"n|16.19\",\"n|1G.1J\",\"n|0.JQ7\",\"n|1.3\",\"n|0.JQ5\",\"n|-13.13\",\"n|0.4He\",\"n|-28.Y\",\"n|0.E6M\",\"n|1N.V\",\"n|1I.h\",\"n|0.PT6\",\"n|I.10\",\"n|0.3BK\",\"n|-m.G\",\"n|0.6Fb\",\"n|-1r.1M\",\"n|0.MIa\",\"n|1K.1a\",\"n|0.D8E\",\"n|Z.q\",\"n|0.P0s\",\"n|-V.Q\",\"n|0.E1O\",\"n|-1a.1W\",\"n|0.53i\",\"n|1u.g\",\"n|1M.r\",\"n|0.DYB\",\"n|p.1B\",\"n|0.DaK\",\"n|-F.5\",\"n|0.5ae\",\"n|-1K.1B\",\"n|0.Lh0\",\"n|2B.5\",\"n|1O.Z\",\"n|0.8nL\",\"n|16.a\",\"n|0.N6x\",\"n|1.15\",\"n|0.GsL\",\"n|-13.B\",\"n|2P.I\",\"n|1R.B\",\"n|0.57G\",\"n|1K.n\",\"n|0.GYy\",\"n|G.18\",\"n|0.5Xw\",\"n|-o.8\",\"n|0.6qY\",\"n|2g.R\",\"n|1S.i\",\"n|0.BVY\",\"n|1b.w\",\"n|0.GZH\",\"n|W.1R\",\"n|0.5hm\",\"n|-X.1a\",\"n|0.Krv\",\"n|2u.1b\",\"n|1U.4\",\"n|0.AVw\",\"n|1q.L\",\"n|0.6m1\",\"n|l.q\",\"n|0.56M\",\"n|-J.G\",\"n|0.6SE\",\"n|39.p\",\"n|1V.12\",\"n|0.Img\",\"n|24.1K\",\"n|0.BOI\",\"n|z.E\",\"n|0.2z3\",\"n|-5.12\",\"n|0.O5n\",\"n|X.g\",\"n|0.CtK\",\"n|-X.a\",\"n|0.Fir\",\"n|o.1F\",\"n|0.7RE\",\"n|-G.1\",\"n|0.LAx\",\"n|-1K.17\",\"n|16.1X\",\"n|-0.U\",\"n|0.9pv\",\"n|1.R\",\"n|-13.p\",\"n|1Q.W\",\"n|-0.X\",\"n|0.AD\",\"n|L.11\",\"n|0.Mtc\",\"n|-j.F\",\"n|0.5YM\",\"n|1f.14\",\"n|0.1J\",\"n|0.80o\",\"n|a.1Z\",\"n|0.JcO\",\"n|-U.1I\",\"n|0.3qF\",\"n|-1Y.x\",\"n|1v.u\",\"n|-0.V\",\"n|0.B8\",\"n|q.1P\",\"n|0.2Za\",\"n|-E.1S\",\"n|0.OG\",\"n|2S.j\",\"n|0.D0S\",\"n|I.8\",\"n|0.MN5\",\"n|-m.18\",\"n|0.IzQ\",\"n|2j.I\",\"n|a.18\",\"n|0.IOS\",\"n|-U.8\",\"n|0.Eu3\",\"n|o.u\",\"n|0.8zC\",\"n|-G.M\",\"n|0.Jcz\",\"n|-0.1I\",\"n|-1.1G\",\"n|0.13\",\"n|3c.q\",\"n|1F.j\",\"n|0.NSq\",\"n|2X.1L\",\"n|0.FVm\",\"n|1S.F\",\"n|0.JEc\",\"n|N.k\",\"n|0.Ok9\",\"n|3Y.P\",\"n|-1P.x\",\"n|0.4gK\",\"n|2T.u\",\"n|0.CMm\",\"n|1O.1P\",\"n|0.1hX\",\"n|J.J\",\"n|0.FGs\",\"a|9z|9y|bR|bS|bT|A1|bU|bS|bV|A8|bW|bS|bX|4H|bY|bS|bZ|9z|9y|ba|bb|bc|A1|bd|bb|be|A8|bf|bb|bg|4H|bh|bb|bi|9z|9y|bj|bk|bl|A1|bm|bk|bn|A8|bo|bk|bp|4H|bq|bk|br|9z|9y|bs|bt|bu|A1|bv|bt|bw|A8|bx|bt|by|4H|bz|bt|c0|9z|9y|c1|c2|c3|A1|c4|c2|c5|A8|c6|c2|c7|4H|c8|c2|c9|9z|9y|cA|cB|cC|A1|cD|cB|cE|A8|cF|cB|cG|4H|cH|cB|cI|9z|9y|cJ|cK|cL|A1|cM|cK|cN|A8|cO|cK|cP|4H|cQ|cK|cR|9z|9y|cS|cT|cU|A1|cV|cT|cW|A8|cX|cT|cY|4H|cZ|cT|ca|9z|9y|cb|cc|cd|A1|ce|cc|cf|A8|cg|cc|ch|4H|ci|cc|cj|9z|9y|ck|cl|cm|A1|cn|cl|co|A8|cp|cl|cq|4H|cr|cl|cs|9z|9y|ct|PF|cu|A1|cv|PF|cw|A8|cx|PF|cy|4H|cz|PF|d0|9z|9y|d1|d2|d3|A1|d4|d2|d5|A8|d6|d2|d7|4H|d8|d2|d9|9z|9y|dA|PF|dB|A1|dC|PF|dD|A8|dE|PF|dF|4H|dG|PF|dH|9z|9y|dI|dJ|dK|A1|dL|dJ|dM|A8|dN|dJ|dO|4H|dP|dJ|dQ|A4|A1|dR|dS|dT|A8|dU|dS|dV|4H|dW|dS|dX|A4|A1|dY|dZ|da|A8|db|dZ|dc|4H|dd|dZ|de|A6|A8|df|dg|dh|4H|di|dg|dj|A6|A8|dk|78|dl|4H|dm|78|dn|A6|A8|do|dp|dq|4H|dr|dp|ds|A4|A1|dt|du|dv|A8|dw|du|IA|4H|dx|du|dy|A4|A1|dz|e0|e1|A8|e2|e0|e3|4H|e4|e0|e5|9z|9y|e6|e7|e8|A1|e9|e7|eA|A8|eB|e7|eC|4H|eD|e7|eE|9z|9y|eF|eG|eH|A1|eI|eG|eJ|A8|eK|eG|eL|4H|eM|eG|eN|9z|9y|eO|eP|eQ|A1|eR|eP|eS|A8|eT|eP|eU|4H|eV|eP|eW|9z|9y|eX|eY|eZ|A1|ea|eY|eb|A8|ec|eY|ed|4H|ee|eY|ef|9z|9y|eg|eh|ei|A1|ej|eh|ek|A8|el|eh|em|4H|en|eh|eo|9z|9y|ep|eq|er|A1|es|eq|et|A8|eu|eq|ev|4H|ew|eq|ex|9z|9y|ey|ez|f0|A1|f1|ez|f2|A8|MZ|ez|f3|4H|f4|ez|f5|9z|9y|f6|f7|f8|A1|f9|f7|fA|A8|fB|f7|fC|4H|fD|f7|fE|9z|9y|ej|fF|fG|A1|el|fF|fH|A8|en|fF|fI|4H|fJ|fF|fK|9z|9y|fL|fM|fN|A1|fO|fM|fP|A8|fQ|fM|fR|4H|fS|fM|fT|9z|9y|fU|fV|fW|A1|fX|fV|fY|A8|fZ|fV|fa|4H|fb|fV|fc|9z|9y|fd|fe|ff|A1|fg|fe|fh|A8|fi|fe|fj|4H|fk|fe|fl|83|9y|fm|fn|83|83|9y|fo|fp|83|83|9y|fq|fr|83|83|9y|fs|ft|83|83|9y|fu|fv|83|A6|9y|fw|43|fx|A1|fy|43|fz|A4|9y|g0|g1|g2|A1|g3|g1|g4|A8|g5|g1|fz|A4|9y|M3|g6|g7|A1|g8|g6|g9|A8|gA|g6|gB|9z|9y|gC|gD|fz|A1|gE|gD|gF|A8|gG|gD|gH|4H|gI|gD|gJ|83|9y|gK|gL|83|A6|9y|gM|gN|gO|A8|gP|gN|QG|9z|9y|gQ|gR|gS|A1|gT|gR|gU|A8|gV|gR|gW|4H|gX|gR|gY|9z|9y|gZ|ga|gb|A1|gc|ga|gd|A8|ge|ga|gf|4H|gg|ga|SM|9z|9y|gh|gi|gj|A1|gk|gi|gl|A8|gm|gi|gn|4H|go|gi|Rf|9z|9y|gp|gq|gr|A1|gs|gq|gt|A8|gu|gq|gv|4H|gw|gq|gx|9z|9y|gy|gz|h0|A1|h1|gz|h2|A8|h3|gz|h4|4H|h5|gz|h6|9z|9y|h7|h8|h9|A1|hA|h8|hB|A8|hC|h8|hD|4H|hE|h8|hF|9z|9y|hG|hH|hI|A1|hJ|hH|hK|A8|hL|hH|hM|4H|hN|hH|hO|9z|9y|hP|hQ|hR|A1|hS|hQ|hT|A8|hU|hQ|hV|4H|hW|hQ|hX|9z|9y|hY|hZ|ha|A1|hb|hZ|hc|A8|hd|hZ|he|4H|hf|hZ|hg|9z|9y|hh|hi|hj|A1|hk|hi|hl|A8|hm|hi|hn|4H|ho|hi|hp|A4|A1|hq|hr|hs|A8|ht|hr|hu|4H|hv|hr|hw|A6|A8|hx|hy|hz|4H|i0|hy|i1|9z|9y|i2|e4|i3|A1|i4|e4|i5|A8|i6|e4|i7|4H|9f|e4|i8|9z|9y|i9|iA|iB|A1|iC|iA|iD|A8|iE|iA|iF|4H|iG|iA|iH|A6|A8|iI|Y|iJ|4H|iK|Y|iL|9z|9y|iM|iN|iO|A1|iP|iN|iQ|A8|iR|iN|iS|4H|iT|iN|iU|9z|9y|iV|iW|iX|A1|iY|iW|iZ|A8|ia|iW|ib|4H|ic|iW|id|9z|9y|ie|if|ig|A1|ih|if|ii|A8|ij|if|ik|4H|il|if|im|9z|9y|in|io|ip|A1|iq|io|ir|A8|is|io|it|4H|iu|io|iv|9z|9y|R3|iw|ix|A1|iy|iw|iz|A8|j0|iw|j1|4H|j2|iw|j3|9z|9y|j4|j5|j6|A1|j7|j5|j8|A8|j9|j5|jA|4H|jB|j5|jC|9z|9y|jD|jE|jF|A1|jG|jE|jH|A8|jI|jE|jJ|4H|jK|jE|Jr|9z|9y|jL|jM|jN|A1|jO|jM|jP|A8|jQ|jM|jR|4H|jS|jM|jT|9z|9y|jU|jV|jW|A1|jX|jV|jY|A8|jZ|jV|ja|4H|jb|jV|jc|9z|9y|jd|je|jf|A1|jg|je|jh|A8|ji|je|jj|4H|jk|je|jl|9z|9y|jm|jn|jo|A1|jp|jn|jq|A8|jr|jn|js|4H|jt|jn|ju|A6|9y|jv|JE|jw|A1|jx|JE|jy|A4|9y|jz|YJ|k0|A1|k1|3i|k2|A8|k3|YJ|3K|A4|9y|k4|k5|k6|A1|k7|k5|8Q|A8|k8|k5|E9|A4|9y|k9|kA|kB|A1|kC|kA|kD|A8|kE|kA|kF|9z|9y|kG|kH|kI|A1|kJ|kH|kK|A8|kL|kH|kM|4H|kN|kH|3K|A4|9y|kO|kP|kQ|A1|kR|kP|kS|A8|kT|kP|kU|A4|9y|kV|5Z|kW|A8|kX|5Z|kY|4H|kZ|5Z|ka|A4|9y|kb|3x|i3|A8|kc|3x|kd|4H|ke|3x|kf|A6|A8|kg|r|kh|4H|ki|r|kj|A6|A8|GU|kk|L0|4H|kl|kk|km|9z|9y|kn|ko|kp|A1|kq|ko|kr|A8|ks|ko|kt|4H|ku|ko|kv|9z|9y|kw|kx|ky|A1|kz|kx|l0|A8|l1|kx|l2|4H|l3|kx|l4\",\"a|DI|DO|DP|DS|DS|5p|5p|DJ|DJ|1q|9e|9Y|9Y|9x|9x|9i|9d|9w|9w|9X|9X|9e|1q|3K|3K|A6|DO|DP|9i|9t|9n|A9|A9|68|9s|A1|A1|4H|AB|9r|9r|9n|4H|3u|3u|AF|A3|AE|AE|AB|AF|P|P|9d|40|DE|DE|DF|3R|9j|9j|9g|68|5i|5i|40|9g|9k|9k|9s|DF|DG|A6|9z|9z|3R|DG|DH|DH|DI|DL|DH|DV|DG|DL|DV|DT|DF|DV|DT|DM|DE|DT|DM|DN|40|DM|DN|Bl|5i|DN|Bl|68|DQ|DQ|DK|Bl|DQ|DR|A9|DQ|DR|17|9n|DR|17|DU|9r|17|DU|6J|AB|DU|6J|DW|AE|6J|DW|64|DX|DX|DY|P|St|DW|Su|Su|St|Su|DX|A6|Sv|9z|Sw|Sv|Sw|3R|6U|Sw|6U|9j|Sx|6U|Sx|DJ|Sv|DL|DS|9g|Sy|Sx|Sy|9k|Sz|Sy|Sz|9s|T0|T0|DK|Sz|T0|A1|T1|T0|T1|4H|T2|T1|T2|3u|T3|T2|T3|AF|T4|T3|T4|T4|St|DL|T5|T5|Sv|5p|T5|DV|T6|T6|Sw|T5|T6|DT|T7|T7|6U|T6|T7|DM|6b|6b|Sx|T7|6b|DN|T8|T8|Sy|6b|T8|Bl|f|f|Sz|T8|f|f|DK|DR|T9|T9|T1|DK|T9|17|TA|TA|T2|T9|TA|DU|TB|TB|T3|TA|TB|6J|TC|TC|T4|TB|TC|TC|Su|9t|A3|DY|TD|TD|St|DW|TE|TE|64\",\"o|7i|Z5|7k|bP|bQ|l5|A0|l6|4t|54\",\"skins/test/legSittingR\",\"n|0.F5U\",\"n|0.Gk8\",\"n|0.2L0\",\"n|0.BsE\",\"n|0.Mmw\",\"n|0.JEY\",\"n|0.9wL\",\"n|0.JDH\",\"n|0.4z6\",\"n|0.M6t\",\"n|0.6m7\",\"n|0.3En\",\"n|0.CYM\",\"n|0.OEO\",\"n|0.4vd\",\"n|0.CZ9\",\"n|0.6ql\",\"n|0.10j\",\"n|0.8HR\",\"n|0.Fyn\",\"n|0.Cdu\",\"n|0.7Jq\",\"n|0.N9V\",\"n|0.8FD\",\"n|0.FX4\",\"n|0.D0r\",\"n|0.Ghi\",\"n|0.Gja\",\"n|0.IGJ\",\"n|0.9SS\",\"n|0.D9z\",\"n|0.FUB\",\"n|0.5xC\",\"n|0.5fy\",\"n|0.GYI\",\"n|0.LUT\",\"n|0.KhH\",\"n|0.JAF\",\"n|0.Fs9\",\"n|0.I2j\",\"n|0.PhJ\",\"n|0.Pha\",\"n|0.IN6\",\"n|0.7z2\",\"n|0.3ga\",\"n|0.FsG\",\"n|0.D6H\",\"n|0.J8N\",\"n|0.HKD\",\"n|0.IB6\",\"n|0.PHv\",\"n|0.BzS\",\"n|0.8k\",\"n|0.FBy\",\"n|0.I5w\",\"n|0.AbH\",\"n|0.Cl1\",\"n|0.Cbf\",\"n|0.32j\",\"a|l9|lA|lB|lC|lD|lE|lF|lG|lH|83|lI|7r|lJ|lK|lL|lM|lN|lO|83|lP|lQ|lR|lS|lT|lU|lV|lW|lX|lY|3K|lZ|la|lb|lc|ld|le|lf|lg|lh|li|3K|lj|lk|ll|lm|ln|lo|lp|lq|lr|ls|lt|lu|lv|FU|lw|lx|ly|lz|m0|Ep|m1|m2|m3|m4|m5\",\"a|9Z|9u|9z|9u|9b|3R|9Z|9z|4L|A4|4L|9z|9u|9Z|P|9u|P|9b|3R|9b|9p|9p|9b|9d|9j|9p|9c|9c|9p|9d|9l|9c|9k|9j|9c|9h|83|4L|A6|4L|A4|A6|83|AF|4L|4L|AF|9Z|9g|9c|9l|9c|9g|9h|83|9w|AF|AF|9w|9Z|9w|9v|9Z|9Z|9v|P|9v|9a|P|P|9e|9b|P|9a|9e|9b|9X|9d|9b|9e|9X|9d|4S|9c|9d|9X|4S|4S|9k|9c|9X|9s|4S|83|3K|9w|9w|3u|3o|9w|3o|9v|9w|3K|3u|3o|4H|9v|9a|4H|A8|9a|9v|4H|9a|A1|9e|9a|A8|A1|9e|9y|9X|9e|A1|9y|9X|9y|9s\",\"n|A.j\",\"n|-2F.k\",\"n|1H.1X\",\"n|-2R.1W\",\"n|0.t\",\"n|-1x.K\",\"n|-l.13\",\"n|-2d.1T\",\"n|-2Z.A\",\"n|w.L\",\"n|-21.1E\",\"n|1W.1b\",\"n|-1O.1W\",\"n|1v.w\",\"n|-Y.B\",\"n|22.e\",\"n|K.N\",\"n|1w.18\",\"n|4k.1X\",\"n|25.F\",\"n|1V.1R\",\"n|j.i\",\"n|2i.T\",\"n|-2.q\",\"n|-p.1X\",\"n|2q.C\",\"n|14.13\",\"n|23.1A\",\"n|-2A.e\",\"n|0.v\",\"n|f.1b\",\"n|1l.j\",\"n|0.Cy\",\"n|-2Y.G\",\"n|0.4l\",\"n|K.17\",\"n|19.1D\",\"n|-1.Q\",\"n|X.t\",\"n|-D.5\",\"n|-C.l\",\"n|-y.12\",\"n|-E.V\",\"n|-1Z.r\",\"n|-C.X\",\"n|-1u.13\",\"n|-1N.R\",\"n|-2J.6\",\"n|-1t.s\",\"n|-1w.4\",\"n|v.G\",\"n|-1A.M\",\"n|0.7Q\",\"n|-2J\",\"n|-1A.W\",\"n|0.AJ\",\"n|j.U\",\"n|-D.6\",\"n|-2V.1N\",\"n|0.6b\",\"n|r.L\",\"n|j.Y\",\"n|-2N.1M\",\"n|1E.10\",\"n|1Y.10\",\"n|1g.1O\",\"n|2A.7\",\"n|-1X.T\",\"n|k.w\",\"n|-1p.7\",\"n|-2T.v\",\"n|-1p.H\",\"n|F.9\",\"n|0.FZs\",\"n|-2y.H\",\"n|0.D2J\",\"n|i.1S\",\"n|1J.U\",\"n|-2W.P\",\"n|N.d\",\"n|-16.1L\",\"n|0.8Mw\",\"n|-2q.1E\",\"n|0.KFF\",\"n|P.3\",\"n|f.J\",\"n|0.7D0\",\"n|-2p.3\",\"n|0.LPB\",\"a|83|9y|m8|m9|83|A6|9y|mA|mB|mC|4H|mD|mB|3W|83|4H|mE|mF|83|83|4H|DB|mG|83|83|4H|mH|mI|83|83|4H|mJ|mK|83|83|4H|mL|mM|83|83|4H|mN|mO|83|83|4H|mP|DJ|83|A6|9y|mQ|mR|VR|4H|mS|mR|7u|83|4H|mT|mU|83|83|4H|mV|Bk|83|83|4H|mW|mX|83|A6|9y|mY|mZ|43|4H|ma|mZ|mb|A6|9y|mc|md|me|4H|mf|md|mg|83|9y|mh|mi|83|83|9y|mj|mk|83|83|9y|ml|mm|83|83|9y|fB|mn|83|83|9y|mo|mp|83|83|9y|mq|mr|83|83|4H|ms|mt|83|83|4H|mu|mv|83|A6|9y|mw|mx|my|4H|mz|n0|n1|A6|9y|n2|n3|kQ|4H|n4|n3|n5|A6|9y|n6|n7|kQ|4H|n8|n7|n5|A6|9y|n9|nA|kQ|4H|L7|nA|n5|A6|9y|nB|nC|My|4H|nD|nC|Mw|A6|9y|nE|nF|mC|4H|nG|nH|3W|A6|9y|nI|N2|nJ|4H|nK|N2|nL|A6|9y|nM|nN|43|4H|nO|nN|mb|A6|9y|nP|nQ|nR|4H|nS|nQ|nT|A6|9y|nU|nV|nW|4H|nX|nV|nY\",\"a|3R|9j|9j|9g|9g|9k|9k|9s|9s|A1|A1|4H|4H|3u|3u|AF|AF|P|9w|9X|9X|9e|9e|9Y|3K|9t|9z|3R|9z|A3|A3|AE|AE|AB|AB|9r|9n|A9|A9|68|68|P|9Y|9x|3K|A6|A6|9z|A6|5i|P|9d|9d|9w|9d|DE|9r|9n|9X|DE|DE|A9|9x|9i|9i|9t|5i|9i|9Y|40|40|9r|5i|DF|DF|40|40|DG|DG|DE|5i|AE\",\"o|7i|l8|7k|m6|m7|nZ|4L|na|4x|4y\",\"o|52|l7|nb\",\"o|4f|Db|Z4|nc|5J|6j|7a\",\"o|4a|4l|nd\",\"a|4d|7c|ne\",\"a|4l\",\"o|ng|4c\",\"eyesBlink\",\"eyesOpen\",\"idle\",\"jump\",\"jumpDownIdle\",\"jumpLand\",\"jumpMiddleIdle\",\"jumpStart\",\"normal_jump_backup\",\"normal_run_backup\",\"physics-test\",\"physics-test-jump\",\"physics_run_test2\",\"run\",\"sitting\",\"old_animations_backup/idle-backup\",\"old_animations_backup/run_backup\",\"a|ni|nj|nk|nl|nm|nn|no|np|nq|nr|ns|nt|nu|nv|nw|4l|nx|ny\",\"a|2|1\",\"a|32|2z\",\"a|2i\",\"o|1z|5K\",\"time\",\"a|o4|T\",\"n|0.1rA\",\"o|o5|o6|5L\",\"n|0.sW\",\"o|o5|o8|5M\",\"n|0.8P\",\"o|o5|oA|5N\",\"n|0.zK\",\"o|o5|oC|5M\",\"o|o5|43|5K\",\"n|0.1s0\",\"o|o5|oF|33\",\"a|o3|o7|o9|oB|oD|oE|oG\",\"o|o2|oH\",\"o|1z|6k\",\"o|o5|o6|6l\",\"o|o5|o8|6m\",\"o|o5|oA|6n\",\"o|o5|oC|6m\",\"o|o5|43|6k\",\"o|o5|oF|30\",\"a|oJ|oK|oL|oM|oN|oO|oP\",\"o|o2|oQ\",\"o|o1|oI|oR\",\"o|o0|oS|4c\",\"o|o0|4c|4c\",\"n|0.1yo\",\"o|o5|oV|5L\",\"n|0.10A\",\"o|o5|oX|5O\",\"n|0.8U\",\"o|o5|oZ|5L\",\"n|0.1ze\",\"o|o5|ob|5K\",\"n|0.zP\",\"o|o5|od|33\",\"a|oW|oY|oa|oc|oe\",\"o|o2|of\",\"o|o5|oV|6l\",\"o|o5|oX|6o\",\"o|o5|oZ|6l\",\"o|o5|ob|6k\",\"o|o5|od|30\",\"a|oh|oi|oj|ok|ol\",\"o|o2|om\",\"o|o1|og|on\",\"a|n|1W|1m|1e|1g|1i|1t|1x|1v|2G|1L\",\"translate\",\"scale\",\"a|oq|or\",\"a|B|C\",\"n|8.S\",\"n|-1A.V\",\"o|ot|ou|ov\",\"curve\",\"a|o4|B|C|ox\",\"n|-4.E\",\"n|-c.17\",\"stepped\",\"o|oy|o8|oz|p0|p1\",\"a|o4|B|C\",\"o|p3|oA|oz|p0\",\"n|-2.15\",\"o|oy|oC|p5|7V|p1\",\"o|p3|oF|p5|7V\",\"n|0.rl\",\"n|-A.17\",\"n|-J.V\",\"o|p3|p8|p9|pA\",\"n|0.9F\",\"n|4.E\",\"n|-a.y\",\"o|p3|pC|pD|pE\",\"o|p3|oV|ou|ov\",\"a|o4|C\",\"n|-1h.1M\",\"o|pH|oX|pI\",\"a|o4\",\"n|0.sb\",\"o|pK|pL\",\"a|ow|p2|p4|p6|p7|pB|pF|pG|pJ|pM\",\"a|C\",\"n|1.B8\",\"o|pO|pP\",\"n|1.Eq\",\"n|0.9V\",\"o|p3|o8|pR|pS\",\"n|1.6c\",\"o|p3|oA|pU|pS\",\"n|0.G7\",\"n|1.1m\",\"o|oy|oC|pW|pX|p1\",\"o|p3|oF|pW|pX\",\"n|1.6w\",\"o|p3|p8|pW|pa\",\"n|1.DY\",\"o|pH|pC|pc\",\"o|pH|oV|pP\",\"n|1.8j\",\"o|pH|oX|pf\",\"n|0.1rF\",\"o|pK|ph\",\"a|pQ|pT|pV|pY|pZ|pb|pd|pe|pg|pi\",\"o|os|pN|pj\",\"rotate\",\"a|pl|oq|or\",\"value\",\"a|pn\",\"n|2.1M\",\"o|po|pp\",\"a|o4|pn\",\"n|B.7\",\"o|pr|o8|ps\",\"n|-f.1K\",\"o|pr|oC|pu\",\"a|o4|pn|ox\",\"n|-i.1G\",\"o|pw|43|px|p1\",\"o|pr|oF|px\",\"n|-c.M\",\"o|pr|p8|q0\",\"n|-I.T\",\"o|pr|pC|q2\",\"o|pr|oV|pp\",\"o|pK|oX\",\"a|pq|pt|pv|py|pz|q1|q3|q4|q5\",\"n|V.5\",\"o|ot|q7|L9\",\"n|-I\",\"o|p3|o8|q9|9w\",\"n|10.B\",\"n|-8.1W\",\"o|p3|oC|qB|qC\",\"n|-F.1X\",\"o|oy|43|NS|qE|p1\",\"o|p3|oF|NS|qE\",\"o|p3|p8|NS|qE\",\"n|-S\",\"o|p3|pC|GX|qI\",\"o|p3|oV|q7|L9\",\"a|q8|qA|qD|qF|qG|qH|qJ|qK|q5\",\"a|C|ox\",\"n|1.27\",\"o|qM|qN|p1\",\"o|pH|p8|qN\",\"n|1.L\",\"o|pH|pC|qQ\",\"o|pH|oV|qN\",\"n|1.3t\",\"o|pH|oX|qT\",\"o|pK|4V\",\"a|qO|qP|qR|qS|qU|qV\",\"o|pm|q6|qL|qW\",\"o|po|Qk\",\"n|9.P\",\"o|pr|o8|qZ\",\"n|v.m\",\"o|pw|oC|qb|p1\",\"o|pr|oF|qb\",\"n|s.D\",\"o|pr|p8|qe\",\"o|pr|pC|A3\",\"o|pr|oV|Qk\",\"a|qY|qa|qc|qd|qf|qg|qh|q5\",\"n|-c.F\",\"n|-R.N\",\"o|ot|qj|qk\",\"o|p3|o8|L9|AF\",\"n|-1D.f\",\"n|-B.13\",\"o|oy|oC|qn|qo|p1\",\"o|p3|p8|qn|qo\",\"n|-1F.A\",\"n|-s.u\",\"o|p3|pC|qr|qs\",\"o|p3|oV|qj|qk\",\"a|ql|qm|qp|qq|qt|qu|q5\",\"o|pm|qi|qv|qW\",\"a|pl|oq\",\"n|-R.G\",\"o|po|qy\",\"n|-6.1Q\",\"o|pr|o8|r0\",\"n|-P.1D\",\"o|pw|oC|r2|p1\",\"o|pr|43|r2\",\"n|-G.14\",\"o|pr|oF|r5\",\"n|-E.15\",\"o|pr|p8|r7\",\"n|-t.M\",\"o|pr|pC|r9\",\"o|pr|oV|qy\",\"a|qz|r1|r3|r4|r6|r8|rA|rB|q5\",\"n|F.1H\",\"n|-3.E\",\"o|ot|rD|rE\",\"o|pK|o8\",\"n|1J.f\",\"n|-W.1a\",\"o|p3|oC|rH|rI\",\"n|1Q.7\",\"n|-h.1S\",\"o|p3|43|rK|rL\",\"n|14.1Q\",\"n|-P.a\",\"o|p3|oF|rN|rO\",\"n|13.1W\",\"n|-U.1G\",\"o|p3|p8|rQ|rR\",\"n|1A.12\",\"n|-F.g\",\"o|p3|pC|rT|rU\",\"o|p3|oV|rD|rE\",\"a|rF|rG|rJ|rM|rP|rS|rV|rW|q5\",\"o|qx|rC|rX\",\"o|po|jt\",\"o|pw|oC|r5|p1\",\"n|-C.k\",\"o|pr|p8|rb\",\"n|-A.d\",\"o|pr|pC|rd\",\"o|pr|oV|jt\",\"a|rZ|r1|ra|r6|rc|re|rf|q5\",\"a|B\",\"o|rh|47\",\"n|K.S\",\"n|-4.O\",\"o|p3|oF|rj|rk\",\"n|K.1W\",\"n|-4.i\",\"o|p3|p8|rm|rn\",\"a|o4|B\",\"o|rp|pC|Mi\",\"o|rp|oV|47\",\"a|ri|rG|rl|ro|rq|rr|q5\",\"o|qx|rg|rs\",\"n|-6.1b\",\"o|po|ru\",\"n|-C.1O\",\"o|pr|p8|rw\",\"n|-D.1b\",\"o|pr|pC|ry\",\"o|pr|oV|ru\",\"a|rv|r1|ra|r6|rx|rz|s0|q5\",\"n|-0.i\",\"o|rh|s2\",\"n|g.e\",\"n|-J.11\",\"o|p3|oF|s4|s5\",\"n|f.s\",\"o|p3|p8|s7|Gi\",\"n|-0.1G\",\"o|rp|pC|s9\",\"o|rp|oV|s2\",\"a|s3|rG|s6|s8|sA|sB|q5\",\"o|qx|s1|sC\",\"n|-6.10\",\"o|po|sE\",\"n|4.1N\",\"o|pr|oF|sG\",\"n|1.e\",\"o|pr|p8|sI\",\"n|-9.v\",\"o|pr|pC|sK\",\"o|pr|oV|sE\",\"a|sF|r1|sH|sJ|sL|sM|q5\",\"n|B.I\",\"n|-5.H\",\"o|ot|sO|sP\",\"n|1T.1V\",\"n|E.l\",\"o|oy|oC|sR|sS|p1\",\"o|p3|oF|sR|sS\",\"n|19.1G\",\"n|8.14\",\"o|p3|p8|sV|sW\",\"n|o.g\",\"n|-F.O\",\"o|p3|pC|sY|sZ\",\"o|p3|oV|sO|sP\",\"a|sQ|rG|sT|sU|sX|sa|sb|q5\",\"o|qx|sN|sc\",\"o|po|NU\",\"o|pr|pC|M8\",\"o|pr|oV|NU\",\"a|se|r1|sH|sJ|sf|sg|q5\",\"o|rh|r\",\"o|pK|p8\",\"o|rp|pC|r\",\"o|rp|oV|r\",\"a|si|rG|sj|sk|sl|q5\",\"o|qx|sh|sm\",\"n|W.z\",\"n|5.x\",\"o|p3|oF|so|sp\",\"o|p3|p8|so|sp\",\"n|-0.K\",\"o|rp|pC|ss\",\"a|si|rG|sq|sr|st|sl|q5\",\"o|qx|sh|su\",\"a|oq\",\"n|4.1M\",\"o|ot|D9|sx\",\"n|-1S.17\",\"o|rp|o8|sz\",\"n|M.g\",\"n|3.2\",\"o|p3|oF|t1|t2\",\"n|D.g\",\"n|3.m\",\"o|p3|p8|t4|t5\",\"n|-1S.9\",\"n|5.f\",\"o|oy|pC|t7|t8|p1\",\"o|p3|oV|t7|t8\",\"n|-1u.1R\",\"n|3.z\",\"o|oy|4V|tB|tC|p1\",\"o|p3|ph|tB|tC\",\"o|pK|oZ\",\"a|sy|t0|t3|t6|t9|tA|tD|tE|tF\",\"o|sw|tG\",\"a|pl\",\"o|po|Cs\",\"a|tJ\",\"o|tI|tK\",\"o|op|pk|qX|qw|rY|rt|sD|sd|sn|sv|tH|tL\",\"o|o0|oo|tM\",\"a|1v|1i|n|1x|1e|1t|1W|1m|1g|2G\",\"o|po|M8\",\"a|tP\",\"o|rh|ss\",\"a|tR\",\"o|qx|tQ|tS\",\"o|po|ry\",\"a|tU\",\"o|rh|s9\",\"a|tW\",\"o|qx|tV|tX\",\"o|ot|pD|pE\",\"a|tZ\",\"o|pO|pc\",\"a|tb\",\"o|os|ta|tc\",\"a|si\",\"o|qx|tQ|te\",\"o|po|r9\",\"a|tg\",\"o|ot|rT|rU\",\"a|ti\",\"o|qx|th|tj\",\"o|po|sK\",\"a|tl\",\"o|ot|sY|sZ\",\"a|tn\",\"o|qx|tm|to\",\"o|po|q2\",\"a|tq\",\"o|ot|GX|qI\",\"a|ts\",\"o|pO|qQ\",\"a|tu\",\"o|pm|tr|tt|tv\",\"o|po|A3\",\"a|tx\",\"o|ot|qr|qs\",\"a|tz\",\"o|pm|ty|u0|tv\",\"o|po|rd\",\"a|u2\",\"o|rh|Mi\",\"a|u4\",\"o|qx|u3|u5\",\"o|ot|t7|t8\",\"a|u7\",\"o|sw|u8\",\"o|tO|tT|tY|td|tf|tk|tp|tw|u1|u6|u9\",\"o|o0|4c|uA\",\"o|1z|5L\",\"o|o5|o6|5O\",\"o|o5|oC|5L\",\"a|uC|uD|uE|oE|oG\",\"o|o2|uF\",\"o|1z|6l\",\"o|o5|o6|6o\",\"o|o5|oC|6l\",\"a|uH|uI|uJ|oO|oP\",\"o|o2|uK\",\"o|o1|uG|uL\",\"a|1m|1W|1g|1x|1e|1t|1i|n|1v|2G\",\"o|pK|o6\",\"a|qY|uO\",\"a|ql|uO\",\"o|pO|qN\",\"o|pH|o6|qT\",\"a|uR|uS|rG\",\"o|pm|uP|uQ|uT\",\"a|pq|uO\",\"a|q8|uO\",\"o|pm|uV|uW|uT\",\"a|rZ|uO\",\"a|ri|uO\",\"o|qx|uY|uZ\",\"a|se|uO\",\"a|si|uO\",\"o|qx|ub|uc\",\"a|qz|uO\",\"a|rF|uO\",\"o|qx|ue|uf\",\"a|sF|uO\",\"a|sQ|uO\",\"o|qx|uh|ui\",\"a|rv|uO\",\"a|s3|uO\",\"o|qx|uk|ul\",\"o|pH|o6|pI\",\"o|pK|KG\",\"a|ow|un|uo\",\"o|pH|o6|pf\",\"o|pK|oA\",\"a|pQ|uq|ur\",\"o|os|up|us\",\"o|oy|o8|tB|tC|p1\",\"o|p3|oA|tB|tC\",\"o|pK|oC\",\"a|u7|uu|uv|uw\",\"o|sw|ux\",\"o|uN|uU|uX|ua|ud|ug|uj|um|ut|ud|uy\",\"o|o0|uM|uz\",\"a|1i|1g|1W|1v|1e|1m|1x|1t|n|2G\",\"o|po|rw\",\"a|v2\",\"o|ot|s7|Gi\",\"a|v4\",\"o|qx|v3|v5\",\"o|po|rb\",\"a|v7\",\"o|ot|rm|rn\",\"a|v9\",\"o|qx|v8|vA\",\"o|po|q0\",\"a|vC\",\"o|ot|NS|qE\",\"a|vE\",\"a|uR\",\"o|pm|vD|vF|vG\",\"o|po|sI\",\"a|vI\",\"o|ot|so|sp\",\"a|vK\",\"o|qx|vJ|vL\",\"o|po|r7\",\"a|vN\",\"o|ot|rQ|rR\",\"a|vP\",\"o|qx|vO|vQ\",\"o|po|qe\",\"a|vS\",\"o|ot|qn|qo\",\"a|vU\",\"o|pm|vT|vV|vG\",\"a|4c\",\"o|qx|vJ|vX\",\"o|ot|sV|sW\",\"a|vZ\",\"o|qx|vJ|va\",\"o|ot|p9|pA\",\"a|vc\",\"o|ot|pW|pa\",\"a|ve\",\"o|os|vd|vf\",\"o|ot|t4|t5\",\"a|vh\",\"o|sw|vi\",\"o|v1|v6|vB|vH|vM|vR|vW|vY|vb|vg|vj\",\"o|o0|4c|vk\",\"a|1m|1g|1e|n|1i|1W|1v|1x|2G|1t\",\"o|pr|oC|qb\",\"a|qY|qa|vn\",\"o|p3|oC|qn|qo\",\"a|ql|qm|vp\",\"o|pm|vo|vq|vG\",\"o|pr|oC|r5\",\"a|rZ|r1|vs\",\"a|ri|rG|rl\",\"o|qx|vt|vu\",\"a|qz|r1|r3|r4|r6\",\"a|rF|rG|rJ|rM|rP\",\"o|qx|vw|vx\",\"o|p3|oC|p5|7V\",\"a|ow|p2|p4|vz\",\"o|p3|oC|pW|pX\",\"a|pQ|pT|pV|w1\",\"o|os|w0|w2\",\"a|rv|r1|vs\",\"a|s3|rG|s6\",\"o|qx|w4|w5\",\"o|pr|43|px\",\"a|pq|pt|pv|w7\",\"o|p3|43|NS|qE\",\"a|q8|qA|qD|w9\",\"o|pm|w8|wA|vG\",\"a|se|r1|sH\",\"a|si|rG|sq\",\"o|qx|wC|wD\",\"a|si|rG\",\"o|qx|wC|wF\",\"a|sy|t0|t3\",\"o|sw|wH\",\"a|sF|r1|sH\",\"o|p3|oC|sR|sS\",\"a|sQ|rG|wK\",\"o|qx|wJ|wL\",\"o|vm|vr|vv|vy|w3|w6|wB|wE|wG|wI|wM\",\"o|o0|4c|wN\",\"a|e|n|1W|1e|1g|1i|1m|1t|1v|1x\",\"o|pO|hm\",\"n|1b.m\",\"o|pH|o6|wR\",\"n|x.P\",\"o|pH|o8|wT\",\"n|g.g\",\"o|pH|oA|wV\",\"o|pH|KG|Ic\",\"n|L.L\",\"o|pH|oC|wY\",\"n|15.2\",\"o|pH|43|wa\",\"n|1Q.N\",\"o|pH|p8|wc\",\"o|pH|pC|wa\",\"n|U.R\",\"o|pH|oV|wf\",\"n|7.1O\",\"o|pH|oX|wh\",\"n|H.1K\",\"o|pH|4V|wj\",\"o|pH|ph|hm\",\"a|wQ|wS|wU|wW|wX|wZ|wb|wd|we|wg|wi|wk|wl\",\"o|sw|wm\",\"a|or\",\"o|rp|o8|pR\",\"n|0.1H\",\"n|1.8Y\",\"o|p3|oC|wq|wr\",\"n|1.8O\",\"o|p3|43|wt|wr\",\"n|0.33\",\"o|p3|p8|wt|wv\",\"o|pK|pC\",\"n|0.6H\",\"o|p3|oX|wy|pR\",\"a|4c|wp|ws|wu|ww|wx|wz|pi\",\"o|wo|x0\",\"n|-M.S\",\"o|po|x2\",\"n|-T.s\",\"o|pr|o6|x4\",\"n|-Y.1X\",\"o|pr|oA|x6\",\"n|-Y.I\",\"o|pr|KG|x8\",\"n|6.P\",\"o|pr|oC|xA\",\"n|V.R\",\"o|pr|43|xC\",\"n|f.1M\",\"o|pr|p8|xE\",\"n|V.A\",\"o|pr|pC|xG\",\"n|A.E\",\"o|pr|oV|xI\",\"n|7.z\",\"o|pr|oX|xK\",\"o|pr|4V|cO\",\"o|pr|ph|x2\",\"a|x3|x5|x7|x9|xB|xD|xF|xH|xJ|xL|xM|xN\",\"n|-m\",\"o|ot|wc|xP\",\"n|r.15\",\"n|-n.T\",\"o|p3|o6|xR|xS\",\"n|b.15\",\"n|-j.L\",\"o|p3|o8|xU|xV\",\"n|16.z\",\"n|-X.T\",\"o|p3|oA|xX|xY\",\"n|1T.15\",\"o|p3|KG|xa|Xi\",\"n|2A.g\",\"n|-f.1Z\",\"o|p3|oC|xc|xd\",\"n|2y.F\",\"o|p3|43|xf|IV\",\"n|3F.v\",\"n|-m.1W\",\"o|p3|p8|xh|xi\",\"n|2k.k\",\"n|-g.c\",\"o|p3|oV|xk|xl\",\"n|1d.D\",\"n|-9.t\",\"o|p3|oX|xn|xo\",\"o|p3|ph|wc|xP\",\"a|xQ|xT|xW|xZ|xb|xe|xg|xj|xm|xp|xq\",\"o|qx|xO|xr\",\"n|-T.J\",\"o|po|xt\",\"n|-V.k\",\"o|pr|o6|xv\",\"n|-Y.f\",\"o|pr|o8|xx\",\"n|-X.A\",\"o|pr|KG|xz\",\"n|-1.1K\",\"o|pr|oC|y1\",\"n|-9.1L\",\"o|pr|43|y3\",\"o|pr|p8|mV\",\"n|-5.5\",\"o|pr|oX|y6\",\"o|pr|ph|xt\",\"a|xu|xw|xy|y0|y2|y4|y5|y7|y8\",\"n|E.h\",\"n|-y.3\",\"o|ot|yA|yB\",\"n|b.16\",\"n|-p.B\",\"o|p3|o6|yD|yE\",\"n|a.4\",\"n|-6.D\",\"o|p3|o8|yG|yH\",\"n|F.F\",\"o|p3|KG|yJ|6e\",\"n|-H.1S\",\"o|p3|oC|yL|L0\",\"n|7.b\",\"n|L.P\",\"o|p3|43|yN|yO\",\"n|1.1B\",\"n|9.1I\",\"o|p3|p8|yQ|yR\",\"n|-4.Q\",\"n|-1.X\",\"o|p3|pC|yT|yU\",\"n|E.1b\",\"n|-5.1K\",\"o|p3|4V|yW|yX\",\"o|p3|ph|yA|yB\",\"a|yC|yF|yI|yK|yM|yP|yS|yV|yY|yZ\",\"o|qx|y9|ya\",\"n|-E.F\",\"o|pr|o8|yc\",\"n|-O.s\",\"o|pr|KG|ye\",\"o|pr|oC|RK\",\"n|-1.P\",\"o|pr|oX|yh\",\"a|xu|xw|yd|yf|yg|yi|y8\",\"n|F.W\",\"n|-C.h\",\"o|p3|o6|yk|yl\",\"n|2.x\",\"n|-4.S\",\"o|p3|o8|yn|yo\",\"n|-0.1M\",\"n|0.l\",\"o|p3|oC|yq|yr\",\"n|-B.v\",\"n|B.1H\",\"o|p3|p8|yt|yu\",\"n|-7.14\",\"o|p3|pC|yw|L0\",\"a|4c|ym|yp|ys|yv|yx|pi\",\"o|qx|yj|yy\",\"n|-J.W\",\"o|pr|o8|z0\",\"n|-R.1M\",\"o|pr|KG|z2\",\"o|pr|oC|s2\",\"n|-3.1Y\",\"o|pr|oX|z5\",\"a|xu|xw|z1|z3|z4|z6|y8\",\"n|S.1Z\",\"n|-7.b\",\"o|ot|z8|z9\",\"n|-C.1I\",\"n|-3.D\",\"o|p3|o6|zB|zC\",\"n|4.x\",\"n|-0.1X\",\"o|p3|o8|zE|zF\",\"n|-2.2\",\"o|p3|oA|zH|gD\",\"n|C.15\",\"n|-1.F\",\"o|p3|p8|zJ|zK\",\"o|p3|ph|z8|z9\",\"a|zA|zD|zG|zI|zL|zM\",\"n|0.30\",\"o|pO|zO\",\"o|pH|ph|zO\",\"a|zP|uw|zQ\",\"o|pm|z7|zN|zR\",\"n|e.H\",\"o|po|zT\",\"n|n.1Q\",\"o|pr|o6|zV\",\"n|f.1H\",\"o|pr|o8|zX\",\"n|H.d\",\"o|pr|oA|zZ\",\"n|-7.Y\",\"o|pr|KG|zb\",\"n|-v.Z\",\"o|pr|oC|zd\",\"n|-k.1U\",\"o|pr|oX|zf\",\"n|L.E\",\"o|pr|4V|zh\",\"o|pr|ph|zT\",\"a|zU|zW|zY|za|zc|ze|zg|zi|zj\",\"n|-13.1K\",\"n|-Q.1Q\",\"o|ot|zl|zm\",\"n|-1W.1I\",\"n|-O.17\",\"o|p3|o6|zo|zp\",\"n|-v.1K\",\"n|-A.13\",\"o|p3|oA|zr|zs\",\"n|-1H.D\",\"n|-7.E\",\"o|p3|KG|zu|zv\",\"n|-35.A\",\"o|p3|oC|zx|xl\",\"n|-3L.1S\",\"n|-U.J\",\"o|p3|43|zz|100\",\"n|-3K.13\",\"n|-U.m\",\"o|p3|oF|102|103\",\"n|-3B.6\",\"n|-R.4\",\"o|p3|p8|105|106\",\"n|-2s.1T\",\"n|-S.X\",\"o|p3|pC|108|109\",\"n|-2Y.1F\",\"n|-T.q\",\"o|p3|oV|10B|10C\",\"n|-G.U\",\"o|p3|oX|Ai|10E\",\"n|-12.1M\",\"n|-C.G\",\"o|p3|4V|10G|10H\",\"o|p3|ph|zl|zm\",\"a|zn|zq|zt|zw|zy|101|104|107|10A|10D|10F|10I|10J\",\"o|qx|zk|10K\",\"n|3.c\",\"o|pr|o6|10M\",\"n|-1.7\",\"o|pr|oC|10O\",\"n|-a.1C\",\"o|pr|43|10Q\",\"n|-h.Q\",\"o|pr|p8|10S\",\"n|-T.C\",\"o|pr|oV|10U\",\"n|-5.2\",\"o|pr|4V|10W\",\"a|4c|10N|10P|10R|10T|10V|10X|pi\",\"n|L.d\",\"o|rh|10Z\",\"n|1C.k\",\"o|rp|o6|10b\",\"n|n.H\",\"n|-1.1E\",\"o|p3|o8|10d|10e\",\"n|K.1P\",\"n|-2.J\",\"o|p3|oA|10g|10h\",\"n|-J.m\",\"n|-D.F\",\"o|p3|KG|10j|10k\",\"n|-T.c\",\"n|-A.n\",\"o|p3|oC|10m|10n\",\"n|X.e\",\"n|R.L\",\"o|p3|43|10p|10q\",\"n|c.1X\",\"n|S.1F\",\"o|p3|oF|10s|10t\",\"n|s.3\",\"n|a.1H\",\"o|oy|p8|10v|10w|p1\",\"o|p3|pC|10v|10w\",\"n|1P.M\",\"n|-J.w\",\"o|p3|oX|10z|110\",\"n|-K.2\",\"n|-J.D\",\"o|p3|4V|112|113\",\"o|rp|ph|10Z\",\"a|10a|10c|10f|10i|10l|10o|10r|10u|10x|10y|111|114|115\",\"o|qx|10Y|116\",\"n|-5.Z\",\"o|pr|oC|118\",\"n|-C.1U\",\"o|pr|43|11A\",\"n|-J.i\",\"o|pr|p8|11C\",\"n|-5.K\",\"o|pr|oV|11E\",\"n|-U.A\",\"o|pr|oX|11G\",\"o|pr|4V|3i\",\"a|4c|119|11B|11D|11F|11H|11I|pi\",\"n|5.r\",\"n|-C.W\",\"o|p3|oC|11K|11L\",\"o|oy|43|Nq|zH|p1\",\"o|p3|pC|Nq|zH\",\"n|7.1Q\",\"n|-k.e\",\"o|p3|oX|11P|11Q\",\"n|1.P\",\"n|-1.1F\",\"o|p3|4V|11S|11T\",\"a|4c|11M|11N|11O|11R|11U|pi\",\"o|qx|11J|11V\",\"n|9.3\",\"n|-B.15\",\"o|p3|oC|11X|11Y\",\"n|H.1U\",\"n|-U.P\",\"o|oy|43|11a|11b|p1\",\"o|p3|pC|11a|11b\",\"n|7.1C\",\"n|-4.M\",\"o|p3|oX|11e|11f\",\"n|-3.S\",\"n|-1.y\",\"o|p3|4V|11h|11i\",\"a|4c|11Z|11c|11d|11g|11j|pi\",\"n|0.9e\",\"o|pH|oC|11l\",\"a|4c|11m|pi\",\"o|pm|11J|11k|11n\",\"o|wP|wn|x1|xs|yb|yz|zS|10L|117|11W|11o\",\"o|o0|4c|11p\",\"a|1|2\",\"a|X\",\"n|-G.1X\",\"o|ot|11t|6C\",\"a|11u\",\"o|sw|11v\",\"o|11s|11w\",\"o|11r|11x|4c\",\"drawOrder\",\"a|2|1|4Z|11z\",\"a|2m|2k\",\"o|1z|4q\",\"a|122\",\"o|o2|123\",\"o|1z|51\",\"a|125\",\"o|o2|126\",\"o|121|124|127\",\"a|1m|1W\",\"n|d.a\",\"o|po|12A\",\"a|12B\",\"n|-O.o\",\"o|ot|12D|z5\",\"a|12E\",\"o|qx|12C|12F\",\"n|-f.14\",\"o|po|12H\",\"a|12I\",\"n|U.V\",\"n|-F.E\",\"o|ot|12K|12L\",\"a|12M\",\"o|qx|12J|12N\",\"o|129|12G|12O\",\"offsets\",\"a|12Q\",\"slot\",\"offset\",\"a|12S|12T\",\"n|4K\",\"o|12U|2k|12V\",\"o|12U|2m|12V\",\"o|12U|2z|4L\",\"o|12U|32|4L\",\"a|12W|12X|12Y|12Z\",\"o|12R|12a\",\"a|12b\",\"o|120|128|12P|4c|12c\",\"a|2|1|3\",\"n|8.r\",\"n|J.N\",\"o|ot|12f|12g\",\"a|12h\",\"n|1.BI\",\"o|ot|12j|12j\",\"a|12k\",\"o|os|12i|12l\",\"o|3f|12m\",\"o|12e|4c|12n|4c\",\"o|o5|o6|5K\",\"o|o5|oA|5L\",\"o|o5|KG|5M\",\"o|o5|43|5N\",\"o|o5|oF|5M\",\"o|o5|pC|5K\",\"o|o5|oV|33\",\"a|12p|12q|12r|12s|12t|12u|12v\",\"o|o2|12w\",\"o|o5|o6|6k\",\"o|o5|oA|6l\",\"o|o5|KG|6m\",\"o|o5|43|6n\",\"o|o5|oF|6m\",\"o|o5|pC|6k\",\"o|o5|oV|30\",\"a|12y|12z|130|131|132|133|134\",\"o|o2|135\",\"o|o1|12x|136\",\"o|o0|137|4c\",\"o|pH|KG|wV\",\"o|pH|oC|Ic\",\"o|pH|oF|wY\",\"o|pH|p8|wa\",\"o|pH|oV|wc\",\"o|pH|oX|wa\",\"o|pH|4V|wf\",\"o|pH|ph|wh\",\"o|pH|oZ|wj\",\"o|pH|ob|hm\",\"a|wQ|wS|wU|139|13A|13B|13C|13D|13E|13F|13G|13H|13I\",\"o|sw|13J\",\"o|p3|oF|wq|wr\",\"o|p3|p8|wt|wr\",\"o|p3|oV|wt|wv\",\"o|p3|ph|wy|pR\",\"o|pK|ob\",\"a|4c|wp|13L|13M|13N|q5|13O|13P\",\"o|wo|13Q\",\"o|pr|KG|x6\",\"o|pr|oC|x8\",\"o|pr|oF|xA\",\"o|pr|p8|xC\",\"o|pr|oV|xE\",\"o|pr|oX|xG\",\"o|pr|4V|xI\",\"o|pr|ph|xK\",\"o|pr|oZ|cO\",\"o|pr|ob|x2\",\"a|x3|x5|13S|13T|13U|13V|13W|13X|13Y|13Z|13a|13b\",\"o|p3|KG|xX|xY\",\"o|p3|oC|xa|Xi\",\"o|p3|oF|xc|xd\",\"o|p3|p8|xf|IV\",\"o|p3|oV|xh|xi\",\"o|p3|4V|xk|xl\",\"o|p3|ph|xn|xo\",\"o|p3|ob|wc|xP\",\"a|xQ|xT|xW|13d|13e|13f|13g|13h|13i|13j|13k\",\"o|qx|13c|13l\",\"o|pr|oC|xz\",\"o|pr|oF|y1\",\"o|pr|p8|y3\",\"o|pr|oV|mV\",\"o|pr|ph|y6\",\"o|pr|ob|xt\",\"a|xu|xw|xy|13n|13o|13p|13q|13r|13s\",\"o|p3|oC|yJ|6e\",\"o|p3|oF|yL|L0\",\"o|p3|p8|yN|yO\",\"o|p3|oV|yQ|yR\",\"o|p3|oX|yT|yU\",\"o|p3|oZ|yW|yX\",\"o|p3|ob|yA|yB\",\"a|yC|yF|yI|13u|13v|13w|13x|13y|13z|140\",\"o|qx|13t|141\",\"o|pr|oC|ye\",\"o|pr|oF|RK\",\"o|pr|ph|yh\",\"a|xu|xw|yd|143|144|145|13s\",\"o|p3|oF|yq|yr\",\"o|p3|oV|yt|yu\",\"o|p3|oX|yw|L0\",\"a|4c|ym|yp|147|148|149|13P\",\"o|qx|146|14A\",\"o|pr|oC|z2\",\"o|pr|oF|s2\",\"o|pr|ph|z5\",\"a|xu|xw|z1|14C|14D|14E|13s\",\"o|p3|KG|zH|gD\",\"o|p3|oV|zJ|zK\",\"o|p3|ob|z8|z9\",\"a|zA|zD|zG|14G|14H|14I\",\"o|pK|oF\",\"o|pH|ob|zO\",\"a|zP|14K|14L\",\"o|pm|14F|14J|14M\",\"o|pr|KG|zZ\",\"o|pr|oC|zb\",\"o|pr|oF|zd\",\"o|pr|ph|zf\",\"o|pr|oZ|zh\",\"o|pr|ob|zT\",\"a|zU|zW|zY|14O|14P|14Q|14R|14S|14T\",\"o|p3|KG|zr|zs\",\"o|p3|oC|zu|zv\",\"o|p3|oF|zx|xl\",\"o|p3|p8|zz|100\",\"o|p3|pC|102|103\",\"o|p3|oV|105|106\",\"o|p3|oX|108|109\",\"o|p3|4V|10B|10C\",\"o|p3|ph|Ai|10E\",\"o|p3|oZ|10G|10H\",\"o|p3|ob|zl|zm\",\"a|zn|zq|14V|14W|14X|14Y|14Z|14a|14b|14c|14d|14e|14f\",\"o|qx|14U|14g\",\"o|pr|oF|10O\",\"o|pr|p8|10Q\",\"o|pr|oV|10S\",\"o|pr|4V|10U\",\"o|pr|oZ|10W\",\"a|4c|10N|14i|14j|14k|14l|14m|13P\",\"o|p3|KG|10g|10h\",\"o|p3|oC|10j|10k\",\"o|p3|oF|10m|10n\",\"o|p3|p8|10p|10q\",\"o|p3|pC|10s|10t\",\"o|oy|oV|10v|10w|p1\",\"o|p3|oX|10v|10w\",\"o|p3|ph|10z|110\",\"o|p3|oZ|112|113\",\"o|rp|ob|10Z\",\"a|10a|10c|10f|14o|14p|14q|14r|14s|14t|14u|14v|14w|14x\",\"o|qx|14n|14y\",\"o|pr|oF|118\",\"o|pr|p8|11A\",\"o|pr|oV|11C\",\"o|pr|4V|11E\",\"o|pr|ph|11G\",\"o|pr|oZ|3i\",\"a|4c|150|151|152|153|154|155|13P\",\"o|p3|oF|11K|11L\",\"o|oy|p8|Nq|zH|p1\",\"o|p3|oX|Nq|zH\",\"o|p3|ph|11P|11Q\",\"o|p3|oZ|11S|11T\",\"a|4c|157|158|159|15A|15B|13P\",\"o|qx|156|15C\",\"o|p3|oF|11X|11Y\",\"o|oy|p8|11a|11b|p1\",\"o|p3|oX|11a|11b\",\"o|p3|ph|11e|11f\",\"o|p3|oZ|11h|11i\",\"a|4c|15E|15F|15G|15H|15I|13P\",\"o|pH|oF|11l\",\"a|4c|15K|13P\",\"o|pm|156|15J|15L\",\"o|wP|13K|13R|13m|142|14B|14N|14h|14z|15D|15M\",\"o|o0|4c|15N\",\"o|nz|oT|oU|oU|tN|uB|v0|vl|wO|tN|11q|11y|tN|11q|11q|12d|12o|138|15O\",\"o|8|S|2g|35|4N|4Y|nf|nh|15P\"],\"15Q\"]";

// @ts-ignore
class CosmeticChanger {
    skinType = GL.storage.getValue("CharacterCustomization", "skinType", "default");
    trailType = GL.storage.getValue("CharacterCustomization", "trailType", "default");
    skinId = GL.storage.getValue("CharacterCustomization", "skinId", "");
    trailId = GL.storage.getValue("CharacterCustomization", "trailId", "");
    selectedStyles = GL.storage.getValue("CharacterCustomization", "selectedStyles", {});
    normalSkin = "";
    allowNextSkin = false;
    normalTrail = "";
    allowNextTrail = false;
    authId = GL.stores?.phaser?.mainCharacter?.id ?? "";
    customSkinFile = null;
    skinUrl = null;
    originalImgFileClass;
    constructor() {
        this.initCustomSkinFile();
        GL.addEventListener("loadEnd", () => {
            if (GL.net.type !== "Colyseus")
                return;
            this.loadCustomSkin();
        });
        if (GL.net.type === "Colyseus") {
            this.loadCustomSkin();
        }
        let me = this;
        // get the main character ID
        GL.net.colyseus.addEventListener("AUTH_ID", (e) => {
            this.authId = e.detail;
        });
        let skin = GL.stores?.phaser?.mainCharacter?.skin;
        if (skin) {
            this.normalSkin = skin.skinId;
            this.patchSkin(skin);
        }
        else {
            // Intercept the class to get the starting skin ID
            GL.parcel.interceptRequire("CharacterCustomization", (exports) => exports?.default?.toString?.().includes("this.latestSkinId"), (exports) => {
                let Skin = exports.default;
                delete exports.default;
                class NewSkin extends Skin {
                    constructor(scene) {
                        super(scene);
                        if (this.character.id === me.authId) {
                            me.patchSkin(this);
                        }
                    }
                }
                exports.default = NewSkin;
            });
        }
        let characterTrail = GL.stores?.phaser?.mainCharacter?.characterTrail;
        if (characterTrail) {
            this.normalTrail = characterTrail.currentAppearanceId;
            this.patchTrail(characterTrail);
        }
        else {
            // Intercept the class to get the starting trail ID
            GL.parcel.interceptRequire("CharacterCustomization", (exports) => exports?.CharacterTrail, (exports) => {
                let CharacterTrail = exports.CharacterTrail;
                delete exports.CharacterTrail;
                class NewCharacterTrail extends CharacterTrail {
                    constructor(scene) {
                        super(scene);
                        if (this.character.id === me.authId) {
                            me.patchTrail(this);
                        }
                    }
                }
                exports.CharacterTrail = NewCharacterTrail;
            });
        }
    }
    loadCustomSkin() {
        if (!this.customSkinFile)
            return;
        let textureUrl = URL.createObjectURL(this.customSkinFile);
        this.skinUrl = textureUrl;
        let atlasLines = atlas.split("\n");
        atlasLines[0] = textureUrl.split("/").pop();
        let atlasBlob = new Blob([atlasLines.join("\n")], { type: "text/plain" });
        let atlasUrl = URL.createObjectURL(atlasBlob);
        let jsonBlob = new Blob([json], { type: "application/json" });
        let jsonUrl = URL.createObjectURL(jsonBlob);
        let fileTypes = window.Phaser.Loader.FileTypes;
        let imgFile = fileTypes.ImageFile;
        class newImgFile extends imgFile {
            constructor(loader, key, url, config) {
                if (url === "blob:https://www.gimkit.com/") {
                    url = textureUrl;
                    key = `customSkin-atlas!${textureUrl.split("/").pop()}`;
                }
                super(loader, key, url, config);
            }
        }
        fileTypes.ImageFile = newImgFile;
        this.originalImgFileClass = imgFile;
        let load = GL.stores.phaser.scene.load;
        let jsonRes = load.spineJson("customSkin-data", jsonUrl);
        let atlasRes = load.spineAtlas("customSkin-atlas", atlasUrl);
        let running = 2;
        const onComplete = () => {
            running--;
            if (running > 0)
                return;
            URL.revokeObjectURL(textureUrl);
            URL.revokeObjectURL(atlasUrl);
            URL.revokeObjectURL(jsonUrl);
            let skin = GL.stores.phaser.mainCharacter?.skin;
            if (skin && this.skinType === "custom") {
                this.allowNextSkin = true;
                skin.updateSkin({ id: "customSkin" });
            }
        };
        jsonRes.on("complete", onComplete);
        atlasRes.on("complete", onComplete);
        jsonRes.start();
        atlasRes.start();
    }
    async initCustomSkinFile() {
        let file = GL.storage.getValue("CharacterCustomization", "customSkinFile");
        let fileName = GL.storage.getValue("CharacterCustomization", "customSkinFileName");
        if (!file || !fileName)
            return;
        // stolen from some stackoverflow post
        let byteString = atob(file.substring(file.indexOf(",") + 1));
        let ab = new ArrayBuffer(byteString.length);
        let ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        this.customSkinFile = new File([ab], fileName);
    }
    patchSkin(skin) {
        if (this.skinType === "id") {
            console.log({ id: this.skinId, editStyles: this.selectedStyles });
            skin.updateSkin({ id: this.skinId, editStyles: this.selectedStyles });
        }
        GL.patcher.before("CharacterCustomization", skin, "updateSkin", (_, args) => {
            if (this.allowNextSkin) {
                this.allowNextSkin = false;
            }
            else {
                this.normalSkin = args[0];
                // cancel the update if we're using a custom skin
                if (this.skinType !== "default")
                    return true;
            }
        });
    }
    patchTrail(trail) {
        if (this.trailType === "id") {
            trail.updateAppearance(this.formatTrail(this.trailId));
        }
        GL.patcher.before("CharacterCustomization", trail, "updateAppearance", (_, args) => {
            if (this.allowNextTrail) {
                this.allowNextTrail = false;
            }
            else {
                this.normalTrail = args[0];
                // cancel the update if we're using a custom trail
                if (this.trailType === "id")
                    return true;
            }
        });
    }
    async setSkin(skinType, skinId, customSkinFile, selectedStyles) {
        this.skinType = skinType;
        this.skinId = skinId;
        this.customSkinFile = customSkinFile;
        this.selectedStyles = selectedStyles;
        // save items to local storage
        GL.storage.setValue("CharacterCustomization", "skinType", skinType);
        GL.storage.setValue("CharacterCustomization", "skinId", skinId);
        GL.storage.setValue("CharacterCustomization", "selectedStyles", selectedStyles);
        if (!customSkinFile) {
            GL.storage.removeValue("CharacterCustomization", "customSkinFile");
            GL.storage.removeValue("CharacterCustomization", "customSkinFileName");
        }
        else {
            let reader = new FileReader();
            reader.onload = () => {
                GL.storage.setValue("CharacterCustomization", "customSkinFile", reader.result);
                GL.storage.setValue("CharacterCustomization", "customSkinFileName", customSkinFile.name);
            };
            reader.readAsDataURL(customSkinFile);
        }
        // update the skin
        let skin = GL.stores?.phaser?.mainCharacter?.skin;
        if (skin) {
            let cache = GL.stores.phaser.scene.cache.custom["esotericsoftware.spine.atlas.cache"];
            // update the custom skin texture
            let entries = cache.entries.entries;
            let texture = entries["customSkin-atlas"]?.pages?.[0]?.texture;
            if (texture && this.customSkinFile) {
                let textureUrl = URL.createObjectURL(this.customSkinFile);
                this.skinUrl = textureUrl;
                texture._image.src = textureUrl;
                texture._image.addEventListener("load", () => {
                    texture.update();
                    URL.revokeObjectURL(textureUrl);
                }, { once: true });
            }
            this.allowNextSkin = true;
            if (skinType === "id") {
                skin.updateSkin({ id: "default_gray" });
                // I have no idea why I have to do this, but otherwise styles don't update
                setTimeout(() => {
                    this.allowNextSkin = true;
                    skin.updateSkin({ id: skinId, editStyles: this.selectedStyles });
                }, 0);
            }
            else if (skinType === "default") {
                skin.updateSkin(this.normalSkin);
            }
            else {
                skin.updateSkin({ id: "customSkin" });
            }
        }
    }
    formatTrail(trail) {
        if (!trail.startsWith("trail_"))
            return `trail_${trail}`;
        return trail;
    }
    setTrail(trailType, trailId) {
        this.trailType = trailType;
        this.trailId = trailId;
        // save items to local storage
        GL.storage.setValue("ChracterCustomization", "trailType", trailType);
        GL.storage.setValue("ChracterCustomization", "trailId", trailId);
        let characterTrail = GL.stores?.phaser?.mainCharacter?.characterTrail;
        if (characterTrail) {
            this.allowNextTrail = true;
            if (trailType === "id") {
                characterTrail.updateAppearance(this.formatTrail(trailId));
            }
            else {
                characterTrail.updateAppearance(this.normalTrail);
            }
        }
    }
    reset() {
        let characterTrail = GL.stores?.phaser?.mainCharacter?.characterTrail;
        if (characterTrail) {
            characterTrail.updateAppearance(this.normalTrail);
        }
        let skin = GL.stores?.phaser?.mainCharacter?.skin;
        if (skin) {
            skin.updateSkin(this.normalSkin);
        }
        if (this.skinUrl) {
            URL.revokeObjectURL(this.skinUrl);
        }
        if (this.originalImgFileClass) {
            window.Phaser.Loader.FileTypes.ImageFile = this.originalImgFileClass;
        }
    }
}

/// <reference types="gimloader" />
// @ts-ignore
let hotkey = new Set(['alt', 'c']);
let cosmeticChanger = new CosmeticChanger();
function showUI() {
    let div = document.createElement("div");
    // @ts-ignore
    let ui = new UI({
        target: div,
        props: {
            cosmeticChanger
        }
    });
    GL.UI.showModal(div, {
        id: "CharacterCustomization",
        title: "Character Customization",
        closeOnBackgroundClick: false,
        style: "min-width: min(90vw, 500px)",
        onClosed() {
            // @ts-ignore
            ui.$destroy();
        },
        buttons: [
            {
                text: "Cancel",
                style: "close"
            },
            {
                text: "Apply",
                style: "primary",
                onClick() {
                    ui.save();
                }
            }
        ]
    });
}
GL.hotkeys.add(hotkey, showUI);
function openSettingsMenu() {
    showUI();
}
function onStop() {
    cosmeticChanger.reset();
    GL.hotkeys.remove(hotkey);
    GL.parcel.stopIntercepts("CharacterCustomization");
    GL.patcher.unpatchAll("CharacterCustomization");
}

export { onStop, openSettingsMenu };
