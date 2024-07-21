/**
 * @name DLDTimer
 * @description Times DLD runs, and shows you your time for each summit
 * @author TheLazySquid
 * @version 0.2.4
 * @downloadUrl https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/plugins/DLDTimer/build/DLDTimer.js
 */
function onceOrIfLoaded(callback) {
    if (GL.net.type === "Colyseus")
        callback();
    GL.addEventListener("loadEnd", () => {
        if (GL.net.type === "Colyseus")
            callback();
    }, { once: true });
}
function fmtMs(ms) {
    ms = Math.round(ms);
    let seconds = Math.floor(ms / 1000);
    let minutes = Math.floor(seconds / 60);
    ms %= 1000;
    seconds %= 60;
    if (minutes > 0)
        return `${minutes}:${String(seconds).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
    return `${seconds}.${String(ms).padStart(3, '0')}`;
}
function parseTime(time) {
    let parts = time.split(":").map(parseFloat);
    if (parts.some(isNaN))
        return 6e5;
    if (parts.length === 1)
        return parts[0] * 1e3;
    if (parts.length === 2)
        return parts[0] * 6e4 + parts[1] * 1e3;
    return parts[0] * 36e5 + parts[1] * 6e4 + parts[2] * 1e3;
}
function inArea(coords, area) {
    if (area.direction === "right" && coords.x < area.x)
        return false;
    if (area.direction === "left" && coords.x > area.x)
        return false;
    if (coords.y > area.y + 10)
        return false; // little bit of leeway
    return true;
}

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

/** @returns {number} */
function to_number(value) {
	return value === '' ? null : +value;
}

/**
 * @param {Element} element
 * @returns {ChildNode[]}
 */
function children(element) {
	return Array.from(element.childNodes);
}

/**
 * @returns {void} */
function set_input_value(input, value) {
	input.value = value == null ? '' : value;
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
 * @type {Outro}
 */
let outros;

/**
 * @returns {void} */
function group_outros() {
	outros = {
		r: 0,
		c: [],
		p: outros // parent group
	};
}

/**
 * @returns {void} */
function check_outros() {
	if (!outros.r) {
		run_all(outros.c);
	}
	outros = outros.p;
}

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

/**
 * @param {import('./private.js').Fragment} block
 * @param {0 | 1} local
 * @param {0 | 1} [detach]
 * @param {() => void} [callback]
 * @returns {void}
 */
function transition_out(block, local, detach, callback) {
	if (block && block.o) {
		if (outroing.has(block)) return;
		outroing.add(block);
		outros.c.push(() => {
			outroing.delete(block);
			if (callback) {
				if (detach) block.d(1);
				callback();
			}
		});
		block.o(local);
	} else if (callback) {
		callback();
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
function create_component(block) {
	block && block.c();
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

const summitStartCoords = [
    { x: 9071, y: 65000, direction: "right" }, // summit 1
    { x: 28788.9, y: 53278, direction: "left" }, // summit 2
    { x: 21387.95, y: 50078, direction: "right" }, // summit 3
    { x: 39693.5, y: 41374, direction: "right" }, // summit 4
    { x: 35212, y: 35166, direction: "right" }, // summit 5
    { x: 39755.93, y: 28573, direction: "right" }, // summit 6
    { x: 40395.91, y: 13854, direction: "right" } // finish
];
const summitCoords = [{
        x: 9022.997283935547,
        y: 63837.7685546875,
        direction: "right"
    }, {
        x: 28544.000244140625,
        y: 53278.0029296875,
        direction: "left"
    }, {
        x: 21755.00030517578,
        y: 50077.99987792969,
        direction: "right"
    }, {
        x: 40033.99963378906,
        y: 41373.9990234375,
        direction: "right"
    }, {
        x: 35654.00085449219,
        y: 35166.00036621094,
        direction: "right"
    }, {
        x: 40126.99890136719,
        y: 28573.9990234375,
        direction: "right"
    }];
const resetCoordinates = { x: 9050, y: 6300 };
const splitNames = ["Summit 1", "Summit 2", "Summit 3", "Summit 4", "Summit 5", "Summit 6"];
const categories = ["Current Patch", "Creative Platforming Patch", "Original Physics"];

/* src\settings\FullGame.svelte generated by Svelte v4.2.18 */

function get_each_context$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[8] = list[i];
	child_ctx[10] = i;
	return child_ctx;
}

// (30:4) {#each splitNames as split, i}
function create_each_block$1(ctx) {
	let tr;
	let td0;
	let t1;
	let td1;
	let input0;
	let input0_value_value;
	let t2;
	let td2;
	let input1;
	let input1_value_value;
	let t3;
	let mounted;
	let dispose;

	function change_handler(...args) {
		return /*change_handler*/ ctx[6](/*i*/ ctx[10], ...args);
	}

	function change_handler_1(...args) {
		return /*change_handler_1*/ ctx[7](/*i*/ ctx[10], ...args);
	}

	return {
		c() {
			tr = element("tr");
			td0 = element("td");
			td0.textContent = `${/*split*/ ctx[8]}`;
			t1 = space();
			td1 = element("td");
			input0 = element("input");
			t2 = space();
			td2 = element("td");
			input1 = element("input");
			t3 = space();

			input0.value = input0_value_value = /*bestSplits*/ ctx[2][/*i*/ ctx[10]]
			? fmtMs(/*bestSplits*/ ctx[2][/*i*/ ctx[10]])
			: '';

			input1.value = input1_value_value = /*pb*/ ctx[1][/*i*/ ctx[10]]
			? fmtMs(/*pb*/ ctx[1][/*i*/ ctx[10]])
			: '';
		},
		m(target, anchor) {
			insert(target, tr, anchor);
			append(tr, td0);
			append(tr, t1);
			append(tr, td1);
			append(td1, input0);
			append(tr, t2);
			append(tr, td2);
			append(td2, input1);
			append(tr, t3);

			if (!mounted) {
				dispose = [
					listen(input0, "change", change_handler),
					listen(input1, "change", change_handler_1)
				];

				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty & /*bestSplits*/ 4 && input0_value_value !== (input0_value_value = /*bestSplits*/ ctx[2][/*i*/ ctx[10]]
			? fmtMs(/*bestSplits*/ ctx[2][/*i*/ ctx[10]])
			: '') && input0.value !== input0_value_value) {
				input0.value = input0_value_value;
			}

			if (dirty & /*pb*/ 2 && input1_value_value !== (input1_value_value = /*pb*/ ctx[1][/*i*/ ctx[10]]
			? fmtMs(/*pb*/ ctx[1][/*i*/ ctx[10]])
			: '') && input1.value !== input1_value_value) {
				input1.value = input1_value_value;
			}
		},
		d(detaching) {
			if (detaching) {
				detach(tr);
			}

			mounted = false;
			run_all(dispose);
		}
	};
}

function create_fragment$3(ctx) {
	let div;
	let t0;
	let input;
	let t1;
	let table;
	let tr;
	let t7;
	let t8;
	let button;
	let mounted;
	let dispose;
	let each_value = ensure_array_like(splitNames);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
	}

	return {
		c() {
			div = element("div");
			t0 = text("Attempts:\r\n    ");
			input = element("input");
			t1 = space();
			table = element("table");
			tr = element("tr");
			tr.innerHTML = `<th style="min-width: 80px;">Split</th> <th style="min-width: 80px;">Best Split</th> <th style="min-width: 80px;">Split during PB</th>`;
			t7 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t8 = space();
			button = element("button");
			button.textContent = "Reset splits";
			attr(input, "type", "number");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t0);
			append(div, input);
			set_input_value(input, /*attempts*/ ctx[0]);
			insert(target, t1, anchor);
			insert(target, table, anchor);
			append(table, tr);
			append(table, t7);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(table, null);
				}
			}

			insert(target, t8, anchor);
			insert(target, button, anchor);

			if (!mounted) {
				dispose = [
					listen(input, "input", /*input_input_handler*/ ctx[5]),
					listen(button, "click", /*resetSplits*/ ctx[3])
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*attempts*/ 1 && to_number(input.value) !== /*attempts*/ ctx[0]) {
				set_input_value(input, /*attempts*/ ctx[0]);
			}

			if (dirty & /*pb, bestSplits, undefined*/ 6) {
				each_value = ensure_array_like(splitNames);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$1(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$1(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(table, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) {
				detach(div);
				detach(t1);
				detach(table);
				detach(t8);
				detach(button);
			}

			destroy_each(each_blocks, detaching);
			mounted = false;
			run_all(dispose);
		}
	};
}

function instance$3($$self, $$props, $$invalidate) {
	let { category } = $$props;
	let attempts = GL.storage.getValue("DLD Timer", `attempts-${category}`, 0);
	let pb = GL.storage.getValue("DLD Timer", `pb-${category}`, []);
	let bestSplits = GL.storage.getValue("DLD Timer", `bestSplits-${category}`, []);

	function resetSplits() {
		let conf = confirm("Are you sure you want to reset all splits for this category?");
		if (!conf) return;
		$$invalidate(1, pb = []);
		$$invalidate(2, bestSplits = []);
		GL.storage.removeValue("DLD Timer", `pb-${category}`);
		GL.storage.removeValue("DLD Timer", `bestSplits-${category}`);
	}

	function input_input_handler() {
		attempts = to_number(this.value);
		$$invalidate(0, attempts);
	}

	const change_handler = (i, e) => {
		if (e.currentTarget.value === '') {
			$$invalidate(2, bestSplits[i] = undefined, bestSplits);
			return;
		}

		let ms = parseTime(e.currentTarget.value);
		$$invalidate(2, bestSplits[i] = ms, bestSplits);
	};

	const change_handler_1 = (i, e) => {
		let ms = parseTime(e.currentTarget.value);
		$$invalidate(1, pb[i] = ms, pb);
	};

	$$self.$$set = $$props => {
		if ('category' in $$props) $$invalidate(4, category = $$props.category);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*category, attempts*/ 17) {
			GL.storage.setValue("DLD Timer", `attempts-${category}`, attempts);
		}

		if ($$self.$$.dirty & /*category, pb*/ 18) {
			GL.storage.setValue("DLD Timer", `pb-${category}`, pb);
		}

		if ($$self.$$.dirty & /*category, bestSplits*/ 20) {
			GL.storage.setValue("DLD Timer", `bestSplits-${category}`, bestSplits);
		}
	};

	return [
		attempts,
		pb,
		bestSplits,
		resetSplits,
		category,
		input_input_handler,
		change_handler,
		change_handler_1
	];
}

class FullGame extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$3, create_fragment$3, safe_not_equal, { category: 4 });
	}
}

/* src\settings\ILSettings.svelte generated by Svelte v4.2.18 */

function add_css$1(target) {
	append_styles(target, "svelte-4osls6", ".grid.svelte-4osls6{display:grid;gap:5px;grid-template-columns:max-content max-content}");
}

// (25:0) {#if category !== "Current Patch"}
function create_if_block$1(ctx) {
	let h2;
	let t1;
	let div2;
	let div0;
	let t3;
	let input0;
	let t4;
	let div1;
	let t6;
	let input1;
	let input1_value_value;
	let mounted;
	let dispose;

	return {
		c() {
			h2 = element("h2");
			h2.textContent = "Preboosts";
			t1 = space();
			div2 = element("div");
			div0 = element("div");
			div0.textContent = "Attempts:";
			t3 = space();
			input0 = element("input");
			t4 = space();
			div1 = element("div");
			div1.textContent = "Personal best:";
			t6 = space();
			input1 = element("input");
			attr(input0, "type", "number");

			input1.value = input1_value_value = /*preboostPb*/ ctx[4]
			? fmtMs(/*preboostPb*/ ctx[4])
			: '';

			attr(div2, "class", "grid svelte-4osls6");
		},
		m(target, anchor) {
			insert(target, h2, anchor);
			insert(target, t1, anchor);
			insert(target, div2, anchor);
			append(div2, div0);
			append(div2, t3);
			append(div2, input0);
			set_input_value(input0, /*preboostAttempts*/ ctx[3]);
			append(div2, t4);
			append(div2, div1);
			append(div2, t6);
			append(div2, input1);

			if (!mounted) {
				dispose = [
					listen(input0, "input", /*input0_input_handler_1*/ ctx[8]),
					listen(input1, "change", /*change_handler_1*/ ctx[9])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty & /*preboostAttempts*/ 8 && to_number(input0.value) !== /*preboostAttempts*/ ctx[3]) {
				set_input_value(input0, /*preboostAttempts*/ ctx[3]);
			}

			if (dirty & /*preboostPb*/ 16 && input1_value_value !== (input1_value_value = /*preboostPb*/ ctx[4]
			? fmtMs(/*preboostPb*/ ctx[4])
			: '') && input1.value !== input1_value_value) {
				input1.value = input1_value_value;
			}
		},
		d(detaching) {
			if (detaching) {
				detach(h2);
				detach(t1);
				detach(div2);
			}

			mounted = false;
			run_all(dispose);
		}
	};
}

function create_fragment$2(ctx) {
	let h2;
	let t1;
	let div2;
	let div0;
	let t3;
	let input0;
	let t4;
	let div1;
	let t6;
	let input1;
	let input1_value_value;
	let t7;
	let if_block_anchor;
	let mounted;
	let dispose;
	let if_block = /*category*/ ctx[0] !== "Current Patch" && create_if_block$1(ctx);

	return {
		c() {
			h2 = element("h2");
			h2.textContent = "No Preboosts";
			t1 = space();
			div2 = element("div");
			div0 = element("div");
			div0.textContent = "Attempts:";
			t3 = space();
			input0 = element("input");
			t4 = space();
			div1 = element("div");
			div1.textContent = "Personal best:";
			t6 = space();
			input1 = element("input");
			t7 = space();
			if (if_block) if_block.c();
			if_block_anchor = empty();
			attr(input0, "type", "number");

			input1.value = input1_value_value = /*noPreboostsPb*/ ctx[2]
			? fmtMs(/*noPreboostsPb*/ ctx[2])
			: '';

			attr(div2, "class", "grid svelte-4osls6");
		},
		m(target, anchor) {
			insert(target, h2, anchor);
			insert(target, t1, anchor);
			insert(target, div2, anchor);
			append(div2, div0);
			append(div2, t3);
			append(div2, input0);
			set_input_value(input0, /*noPreboostsAttempts*/ ctx[1]);
			append(div2, t4);
			append(div2, div1);
			append(div2, t6);
			append(div2, input1);
			insert(target, t7, anchor);
			if (if_block) if_block.m(target, anchor);
			insert(target, if_block_anchor, anchor);

			if (!mounted) {
				dispose = [
					listen(input0, "input", /*input0_input_handler*/ ctx[6]),
					listen(input1, "change", /*change_handler*/ ctx[7])
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*noPreboostsAttempts*/ 2 && to_number(input0.value) !== /*noPreboostsAttempts*/ ctx[1]) {
				set_input_value(input0, /*noPreboostsAttempts*/ ctx[1]);
			}

			if (dirty & /*noPreboostsPb*/ 4 && input1_value_value !== (input1_value_value = /*noPreboostsPb*/ ctx[2]
			? fmtMs(/*noPreboostsPb*/ ctx[2])
			: '') && input1.value !== input1_value_value) {
				input1.value = input1_value_value;
			}

			if (/*category*/ ctx[0] !== "Current Patch") {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$1(ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) {
				detach(h2);
				detach(t1);
				detach(div2);
				detach(t7);
				detach(if_block_anchor);
			}

			if (if_block) if_block.d(detaching);
			mounted = false;
			run_all(dispose);
		}
	};
}

function instance$2($$self, $$props, $$invalidate) {
	let { category } = $$props;
	let { summit } = $$props;
	let id = `${category}-${summit}`;
	let noPreboostsAttempts = GL.storage.getValue("DLD Timer", `attempts-${id}`, 0);
	let noPreboostsPb = GL.storage.getValue("DLD Timer", `ilpb-${id}`, null);
	let preboostAttempts = GL.storage.getValue("DLD Timer", `attempts-${id}-preboosts`, 0);
	let preboostPb = GL.storage.getValue("DLD Timer", `ilpb-${id}-preboosts`, null);

	function input0_input_handler() {
		noPreboostsAttempts = to_number(this.value);
		$$invalidate(1, noPreboostsAttempts);
	}

	const change_handler = e => {
		let ms = parseTime(e.currentTarget.value);
		$$invalidate(2, noPreboostsPb = ms);
	};

	function input0_input_handler_1() {
		preboostAttempts = to_number(this.value);
		$$invalidate(3, preboostAttempts);
	}

	const change_handler_1 = e => {
		let ms = parseTime(e.currentTarget.value);
		$$invalidate(4, preboostPb = ms);
	};

	$$self.$$set = $$props => {
		if ('category' in $$props) $$invalidate(0, category = $$props.category);
		if ('summit' in $$props) $$invalidate(5, summit = $$props.summit);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*noPreboostsAttempts*/ 2) {
			GL.storage.setValue("DLD Timer", `attempts-${id}`, noPreboostsAttempts);
		}

		if ($$self.$$.dirty & /*noPreboostsPb*/ 4) {
			if (noPreboostsPb) GL.storage.setValue("DLD Timer", `ilpb-${id}`, noPreboostsPb);
		}

		if ($$self.$$.dirty & /*preboostAttempts*/ 8) {
			GL.storage.setValue("DLD Timer", `attempts-${id}-preboosts`, preboostAttempts);
		}

		if ($$self.$$.dirty & /*preboostPb*/ 16) {
			if (preboostPb) GL.storage.setValue("DLD Timer", `ilpb-${id}`, preboostPb);
		}
	};

	return [
		category,
		noPreboostsAttempts,
		noPreboostsPb,
		preboostAttempts,
		preboostPb,
		summit,
		input0_input_handler,
		change_handler,
		input0_input_handler_1,
		change_handler_1
	];
}

class ILSettings extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$2, create_fragment$2, safe_not_equal, { category: 0, summit: 5 }, add_css$1);
	}
}

/* src\settings\Toggles.svelte generated by Svelte v4.2.18 */

function add_css(target) {
	append_styles(target, "svelte-1vtkrny", ".row.svelte-1vtkrny{display:flex;align-items:center;gap:10px}input.svelte-1vtkrny{width:20px;height:20px}.note.svelte-1vtkrny{font-size:0.7em;color:gray}");
}

function create_fragment$1(ctx) {
	let div0;
	let input0;
	let t0;
	let t1;
	let div1;
	let input1;
	let t2;
	let t3;
	let div2;
	let input2;
	let t4;
	let t5;
	let div3;
	let input3;
	let t6;
	let t7;
	let div4;
	let input4;
	let t8;
	let t9;
	let div5;
	let mounted;
	let dispose;

	return {
		c() {
			div0 = element("div");
			input0 = element("input");
			t0 = text("\r\n    Show splits");
			t1 = space();
			div1 = element("div");
			input1 = element("input");
			t2 = text("\r\n    Show split times");
			t3 = space();
			div2 = element("div");
			input2 = element("input");
			t4 = text("\r\n    Show split comparisons");
			t5 = space();
			div3 = element("div");
			input3 = element("input");
			t6 = text("\r\n    Show split time at end");
			t7 = space();
			div4 = element("div");
			input4 = element("input");
			t8 = text("\r\n    Start ILs upon using savestates to warp there");
			t9 = space();
			div5 = element("div");
			div5.textContent = "For summit one this will only happen if you don't have full game selected";
			attr(input0, "type", "checkbox");
			attr(input0, "class", "svelte-1vtkrny");
			attr(div0, "class", "row svelte-1vtkrny");
			attr(input1, "type", "checkbox");
			attr(input1, "class", "svelte-1vtkrny");
			attr(div1, "class", "row svelte-1vtkrny");
			attr(input2, "type", "checkbox");
			attr(input2, "class", "svelte-1vtkrny");
			attr(div2, "class", "row svelte-1vtkrny");
			attr(input3, "type", "checkbox");
			attr(input3, "class", "svelte-1vtkrny");
			attr(div3, "class", "row svelte-1vtkrny");
			attr(input4, "type", "checkbox");
			attr(input4, "class", "svelte-1vtkrny");
			attr(div4, "class", "row svelte-1vtkrny");
			attr(div5, "class", "note svelte-1vtkrny");
		},
		m(target, anchor) {
			insert(target, div0, anchor);
			append(div0, input0);
			input0.checked = /*showSplits*/ ctx[0];
			append(div0, t0);
			insert(target, t1, anchor);
			insert(target, div1, anchor);
			append(div1, input1);
			input1.checked = /*showSplitTimes*/ ctx[1];
			append(div1, t2);
			insert(target, t3, anchor);
			insert(target, div2, anchor);
			append(div2, input2);
			input2.checked = /*showSplitComparisons*/ ctx[2];
			append(div2, t4);
			insert(target, t5, anchor);
			insert(target, div3, anchor);
			append(div3, input3);
			input3.checked = /*showSplitTimeAtEnd*/ ctx[3];
			append(div3, t6);
			insert(target, t7, anchor);
			insert(target, div4, anchor);
			append(div4, input4);
			input4.checked = /*autostartILs*/ ctx[4];
			append(div4, t8);
			insert(target, t9, anchor);
			insert(target, div5, anchor);

			if (!mounted) {
				dispose = [
					listen(input0, "change", /*input0_change_handler*/ ctx[6]),
					listen(input1, "change", /*input1_change_handler*/ ctx[7]),
					listen(input2, "change", /*input2_change_handler*/ ctx[8]),
					listen(input3, "change", /*input3_change_handler*/ ctx[9]),
					listen(input4, "change", /*input4_change_handler*/ ctx[10])
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*showSplits*/ 1) {
				input0.checked = /*showSplits*/ ctx[0];
			}

			if (dirty & /*showSplitTimes*/ 2) {
				input1.checked = /*showSplitTimes*/ ctx[1];
			}

			if (dirty & /*showSplitComparisons*/ 4) {
				input2.checked = /*showSplitComparisons*/ ctx[2];
			}

			if (dirty & /*showSplitTimeAtEnd*/ 8) {
				input3.checked = /*showSplitTimeAtEnd*/ ctx[3];
			}

			if (dirty & /*autostartILs*/ 16) {
				input4.checked = /*autostartILs*/ ctx[4];
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) {
				detach(div0);
				detach(t1);
				detach(div1);
				detach(t3);
				detach(div2);
				detach(t5);
				detach(div3);
				detach(t7);
				detach(div4);
				detach(t9);
				detach(div5);
			}

			mounted = false;
			run_all(dispose);
		}
	};
}

function instance$1($$self, $$props, $$invalidate) {
	let { autosplitter } = $$props;
	let showSplits = GL.storage.getValue("DLD Timer", "showSplits", true);
	let showSplitTimes = GL.storage.getValue("DLD Timer", "showSplitTimes", true);
	let showSplitComparisons = GL.storage.getValue("DLD Timer", "showSplitComparisons", true);
	let showSplitTimeAtEnd = GL.storage.getValue("DLD Timer", "showSplitTimeAtEnd", true);
	let autostartILs = GL.storage.getValue("DLD Timer", "autostartILs", false);

	function input0_change_handler() {
		showSplits = this.checked;
		$$invalidate(0, showSplits);
	}

	function input1_change_handler() {
		showSplitTimes = this.checked;
		$$invalidate(1, showSplitTimes);
	}

	function input2_change_handler() {
		showSplitComparisons = this.checked;
		$$invalidate(2, showSplitComparisons);
	}

	function input3_change_handler() {
		showSplitTimeAtEnd = this.checked;
		$$invalidate(3, showSplitTimeAtEnd);
	}

	function input4_change_handler() {
		autostartILs = this.checked;
		$$invalidate(4, autostartILs);
	}

	$$self.$$set = $$props => {
		if ('autosplitter' in $$props) $$invalidate(5, autosplitter = $$props.autosplitter);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*showSplits*/ 1) {
			GL.storage.setValue("DLD Timer", "showSplits", showSplits);
		}

		if ($$self.$$.dirty & /*showSplitTimes*/ 2) {
			GL.storage.setValue("DLD Timer", "showSplitTimes", showSplitTimes);
		}

		if ($$self.$$.dirty & /*showSplitComparisons*/ 4) {
			GL.storage.setValue("DLD Timer", "showSplitComparisons", showSplitComparisons);
		}

		if ($$self.$$.dirty & /*showSplitTimeAtEnd*/ 8) {
			GL.storage.setValue("DLD Timer", "showSplitTimeAtEnd", showSplitTimeAtEnd);
		}

		if ($$self.$$.dirty & /*autostartILs*/ 16) {
			GL.storage.setValue("DLD Timer", "autostartILs", autostartILs);
		}

		if ($$self.$$.dirty & /*autostartILs*/ 16) {
			$$invalidate(5, autosplitter.autostartILs = autostartILs, autosplitter);
		}
	};

	return [
		showSplits,
		showSplitTimes,
		showSplitComparisons,
		showSplitTimeAtEnd,
		autostartILs,
		autosplitter,
		input0_change_handler,
		input1_change_handler,
		input2_change_handler,
		input3_change_handler,
		input4_change_handler
	];
}

class Toggles extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$1, create_fragment$1, safe_not_equal, { autosplitter: 5 }, add_css);
	}
}

/* src\settings\Settings.svelte generated by Svelte v4.2.18 */

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[5] = list[i];
	child_ctx[7] = i;
	return child_ctx;
}

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[2] = list[i];
	return child_ctx;
}

// (11:4) {#each categories as category}
function create_each_block_1(ctx) {
	let option;

	return {
		c() {
			option = element("option");
			option.textContent = `${/*category*/ ctx[2]}`;
			option.__value = /*category*/ ctx[2];
			set_input_value(option, option.__value);
		},
		m(target, anchor) {
			insert(target, option, anchor);
		},
		p: noop,
		d(detaching) {
			if (detaching) {
				detach(option);
			}
		}
	};
}

// (18:4) {#each splitNames as split, i}
function create_each_block(ctx) {
	let option;

	return {
		c() {
			option = element("option");
			option.textContent = `${/*split*/ ctx[5]}`;
			option.__value = /*i*/ ctx[7];
			set_input_value(option, option.__value);
		},
		m(target, anchor) {
			insert(target, option, anchor);
		},
		p: noop,
		d(detaching) {
			if (detaching) {
				detach(option);
			}
		}
	};
}

// (28:8) {:else}
function create_else_block(ctx) {
	let fullgame;
	let current;
	fullgame = new FullGame({ props: { category: /*category*/ ctx[2] } });

	return {
		c() {
			create_component(fullgame.$$.fragment);
		},
		m(target, anchor) {
			mount_component(fullgame, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const fullgame_changes = {};
			if (dirty & /*category*/ 4) fullgame_changes.category = /*category*/ ctx[2];
			fullgame.$set(fullgame_changes);
		},
		i(local) {
			if (current) return;
			transition_in(fullgame.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(fullgame.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(fullgame, detaching);
		}
	};
}

// (26:8) {#if mode !== "Full Game"}
function create_if_block(ctx) {
	let ilsettings;
	let current;

	ilsettings = new ILSettings({
			props: {
				category: /*category*/ ctx[2],
				summit: parseInt(/*mode*/ ctx[1])
			}
		});

	return {
		c() {
			create_component(ilsettings.$$.fragment);
		},
		m(target, anchor) {
			mount_component(ilsettings, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const ilsettings_changes = {};
			if (dirty & /*category*/ 4) ilsettings_changes.category = /*category*/ ctx[2];
			if (dirty & /*mode*/ 2) ilsettings_changes.summit = parseInt(/*mode*/ ctx[1]);
			ilsettings.$set(ilsettings_changes);
		},
		i(local) {
			if (current) return;
			transition_in(ilsettings.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(ilsettings.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(ilsettings, detaching);
		}
	};
}

// (25:4) {#key category}
function create_key_block_1(ctx) {
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	const if_block_creators = [create_if_block, create_else_block];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*mode*/ ctx[1] !== "Full Game") return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	return {
		c() {
			if_block.c();
			if_block_anchor = empty();
		},
		m(target, anchor) {
			if_blocks[current_block_type_index].m(target, anchor);
			insert(target, if_block_anchor, anchor);
			current = true;
		},
		p(ctx, dirty) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if_blocks[current_block_type_index].p(ctx, dirty);
			} else {
				group_outros();

				transition_out(if_blocks[previous_block_index], 1, 1, () => {
					if_blocks[previous_block_index] = null;
				});

				check_outros();
				if_block = if_blocks[current_block_type_index];

				if (!if_block) {
					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
					if_block.c();
				} else {
					if_block.p(ctx, dirty);
				}

				transition_in(if_block, 1);
				if_block.m(if_block_anchor.parentNode, if_block_anchor);
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o(local) {
			transition_out(if_block);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				detach(if_block_anchor);
			}

			if_blocks[current_block_type_index].d(detaching);
		}
	};
}

// (24:0) {#key mode}
function create_key_block(ctx) {
	let previous_key = /*category*/ ctx[2];
	let key_block_anchor;
	let current;
	let key_block = create_key_block_1(ctx);

	return {
		c() {
			key_block.c();
			key_block_anchor = empty();
		},
		m(target, anchor) {
			key_block.m(target, anchor);
			insert(target, key_block_anchor, anchor);
			current = true;
		},
		p(ctx, dirty) {
			if (dirty & /*category*/ 4 && safe_not_equal(previous_key, previous_key = /*category*/ ctx[2])) {
				group_outros();
				transition_out(key_block, 1, 1, noop);
				check_outros();
				key_block = create_key_block_1(ctx);
				key_block.c();
				transition_in(key_block, 1);
				key_block.m(key_block_anchor.parentNode, key_block_anchor);
			} else {
				key_block.p(ctx, dirty);
			}
		},
		i(local) {
			if (current) return;
			transition_in(key_block);
			current = true;
		},
		o(local) {
			transition_out(key_block);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				detach(key_block_anchor);
			}

			key_block.d(detaching);
		}
	};
}

function create_fragment(ctx) {
	let select0;
	let t0;
	let select1;
	let option;
	let t2;
	let previous_key = /*mode*/ ctx[1];
	let t3;
	let hr;
	let t4;
	let toggles;
	let current;
	let mounted;
	let dispose;
	let each_value_1 = ensure_array_like(categories);
	let each_blocks_1 = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	let each_value = ensure_array_like(splitNames);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	let key_block = create_key_block(ctx);

	toggles = new Toggles({
			props: { autosplitter: /*autosplitter*/ ctx[0] }
		});

	return {
		c() {
			select0 = element("select");

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].c();
			}

			t0 = space();
			select1 = element("select");
			option = element("option");
			option.textContent = "Full Game";

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t2 = space();
			key_block.c();
			t3 = space();
			hr = element("hr");
			t4 = space();
			create_component(toggles.$$.fragment);
			if (/*category*/ ctx[2] === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[3].call(select0));
			option.__value = "Full Game";
			set_input_value(option, option.__value);
			if (/*mode*/ ctx[1] === void 0) add_render_callback(() => /*select1_change_handler*/ ctx[4].call(select1));
		},
		m(target, anchor) {
			insert(target, select0, anchor);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				if (each_blocks_1[i]) {
					each_blocks_1[i].m(select0, null);
				}
			}

			select_option(select0, /*category*/ ctx[2], true);
			insert(target, t0, anchor);
			insert(target, select1, anchor);
			append(select1, option);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(select1, null);
				}
			}

			select_option(select1, /*mode*/ ctx[1], true);
			insert(target, t2, anchor);
			key_block.m(target, anchor);
			insert(target, t3, anchor);
			insert(target, hr, anchor);
			insert(target, t4, anchor);
			mount_component(toggles, target, anchor);
			current = true;

			if (!mounted) {
				dispose = [
					listen(select0, "change", /*select0_change_handler*/ ctx[3]),
					listen(select1, "change", /*select1_change_handler*/ ctx[4])
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*category*/ 4) {
				select_option(select0, /*category*/ ctx[2]);
			}

			if (dirty & /*mode*/ 2) {
				select_option(select1, /*mode*/ ctx[1]);
			}

			if (dirty & /*mode*/ 2 && safe_not_equal(previous_key, previous_key = /*mode*/ ctx[1])) {
				group_outros();
				transition_out(key_block, 1, 1, noop);
				check_outros();
				key_block = create_key_block(ctx);
				key_block.c();
				transition_in(key_block, 1);
				key_block.m(t3.parentNode, t3);
			} else {
				key_block.p(ctx, dirty);
			}

			const toggles_changes = {};
			if (dirty & /*autosplitter*/ 1) toggles_changes.autosplitter = /*autosplitter*/ ctx[0];
			toggles.$set(toggles_changes);
		},
		i(local) {
			if (current) return;
			transition_in(key_block);
			transition_in(toggles.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(key_block);
			transition_out(toggles.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) {
				detach(select0);
				detach(t0);
				detach(select1);
				detach(t2);
				detach(t3);
				detach(hr);
				detach(t4);
			}

			destroy_each(each_blocks_1, detaching);
			destroy_each(each_blocks, detaching);
			key_block.d(detaching);
			destroy_component(toggles, detaching);
			mounted = false;
			run_all(dispose);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let { autosplitter } = $$props;
	let category = categories[0];
	let mode = "Full Game";

	function select0_change_handler() {
		category = select_value(this);
		$$invalidate(2, category);
	}

	function select1_change_handler() {
		mode = select_value(this);
		$$invalidate(1, mode);
	}

	$$self.$$set = $$props => {
		if ('autosplitter' in $$props) $$invalidate(0, autosplitter = $$props.autosplitter);
	};

	return [autosplitter, mode, category, select0_change_handler, select1_change_handler];
}

class Settings extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, { autosplitter: 0 });
	}
}

var styles = "#timer {\n  position: absolute;\n  top: 0;\n  right: 0;\n  background-color: rgba(0, 0, 0, 0.85);\n  color: white;\n  z-index: 999999999;\n}\n#timer .restart {\n  background-color: transparent;\n  border: none;\n  width: 20px;\n  height: 20px;\n  margin: 0;\n  padding: 0;\n}\n#timer .restart svg {\n  width: 20px;\n  height: 20px;\n}\n#timer .bar {\n  display: flex;\n  align-items: center;\n  padding: 5px 10px;\n  gap: 10px;\n}\n#timer select {\n  background: transparent;\n}\n#timer option {\n  background-color: black;\n}\n#timer .runType {\n  padding-left: 10px;\n}\n#timer table {\n  width: 100%;\n}\n#timer tr:nth-child(even) {\n  background-color: rgba(255, 255, 255, 0.12);\n}\n#timer tr.active {\n  background-color: rgba(28, 145, 235, 0.864);\n}\n#timer td:first-child {\n  padding-left: 10px;\n}\n#timer .attempts {\n  flex-grow: 1;\n  text-align: right;\n}\n#timer .total {\n  font-size: xx-large;\n  width: 100%;\n  text-align: right;\n  padding-right: 10px;\n}\n#timer .ahead {\n  color: green;\n}\n#timer .behind {\n  color: red;\n}\n#timer .best {\n  color: gold;\n}\n\n#DLDTimer-settings .category {\n  display: flex;\n  align-items: center;\n  gap: 5px;\n}";

var restore = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M13,3A9,9 0 0,0 4,12H1L4.89,15.89L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3Z\" fill=\"white\" /></svg>";

class UI {
    timer;
    autosplitter;
    element;
    total;
    splitRows = [];
    splitDatas = [];
    attemptsEl;
    showSplits = GL.storage.getValue("DLD Timer", "showSplits", true);
    showSplitTimes = GL.storage.getValue("DLD Timer", "showSplitTimes", true);
    showSplitComparisons = GL.storage.getValue("DLD Timer", "showSplitComparisons", true);
    showSplitTimeAtEnd = GL.storage.getValue("DLD Timer", "showSplitTimeAtEnd", true);
    constructor(timer) {
        this.timer = timer;
        this.autosplitter = timer.autosplitter;
    }
    create() {
        this.element = document.createElement("div");
        this.element.id = "timer";
        this.total = document.createElement("div");
        this.total.classList.add("total");
        this.total.innerText = "0.00";
        let topBar = document.createElement("div");
        topBar.classList.add("bar");
        // make the category selector
        let categorySelect = document.createElement("select");
        topBar.appendChild(categorySelect);
        for (let category of categories) {
            let option = document.createElement("option");
            option.value = category;
            option.innerText = category;
            if (category === this.autosplitter.category)
                option.selected = true;
            categorySelect.appendChild(option);
        }
        // make the attempts counter
        this.attemptsEl = document.createElement("div");
        this.attemptsEl.classList.add("attempts");
        this.attemptsEl.innerText = String(this.timer.attempts);
        topBar.appendChild(this.attemptsEl);
        // make the run type selector
        let runTypeBar = document.createElement("div");
        runTypeBar.classList.add("bar");
        let runTypeSelect = document.createElement("select");
        runTypeSelect.innerHTML = `<option value="Full Game">Full Game</option>`;
        for (let i = 0; i < splitNames.length; i++) {
            let option = document.createElement("option");
            option.value = String(i);
            option.innerText = splitNames[i];
            if (this.autosplitter.mode === "Summit" && this.autosplitter.ilsummit === i)
                option.selected = true;
            runTypeSelect.appendChild(option);
        }
        runTypeBar.appendChild(runTypeSelect);
        let preboostSelect = document.createElement("select");
        preboostSelect.innerHTML = `
        <option value="false">No Preboosts</option>
        <option value="true">Preboosts</option>`;
        preboostSelect.value = String(this.autosplitter.ilPreboosts);
        if (this.autosplitter.category === "Current Patch")
            preboostSelect.disabled = true;
        this.element.appendChild(topBar);
        this.element.appendChild(runTypeBar);
        let table = document.createElement("table");
        if (this.showSplits)
            this.element.appendChild(table);
        for (let name of splitNames) {
            let row = document.createElement("tr");
            row.innerHTML = `
            <td style="min-width: 120px;">${name}</td>
            <td style="min-width: 60px; ${this.showSplitTimes ? "" : "display: none"}"></td>
            <td style="min-width: 80px; ${this.showSplitComparisons ? "" : "display: none"}"></td>
            <td style="min-width: 60px; ${this.showSplitTimeAtEnd ? "" : "display: none"}"></td>`;
            this.splitRows.push(row);
            this.splitDatas.push(Array.from(row.children));
            table.appendChild(row);
        }
        this.element.appendChild(this.total);
        document.body.appendChild(this.element);
        // update the category when the select changes
        categorySelect.addEventListener("change", () => {
            this.timer.updateCategory(categorySelect.value);
            // there isn't a preboosts option for current patch
            if (categorySelect.value === "Current Patch") {
                preboostSelect.value = "false";
                preboostSelect.disabled = true;
            }
            else {
                preboostSelect.disabled = false;
            }
        });
        if (runTypeSelect.value !== "Full Game") {
            table.style.display = "none";
            runTypeBar.appendChild(preboostSelect);
        }
        runTypeSelect.addEventListener("change", () => {
            if (runTypeSelect.value === "Full Game") {
                table.style.display = "";
                preboostSelect.remove();
                this.autosplitter.setMode("Full Game");
            }
            else {
                table.style.display = "none";
                runTypeBar.appendChild(preboostSelect);
                this.autosplitter.setMode("Summit", parseInt(runTypeSelect.value), preboostSelect.value === "true");
            }
        });
        preboostSelect.addEventListener("change", () => {
            this.autosplitter.setMode("Summit", parseInt(runTypeSelect.value), preboostSelect.value === "true");
        });
        // prevent left/right from changing the category
        categorySelect.addEventListener("keydown", (e) => e.preventDefault());
        runTypeSelect.addEventListener("keydown", (e) => e.preventDefault());
        preboostSelect.addEventListener("keydown", (e) => e.preventDefault());
    }
    update(totalMs, splitMs) {
        this.total.innerText = fmtMs(totalMs);
        this.splitDatas[this.timer.currentSplit][1].innerText = fmtMs(splitMs);
        if (this.autosplitter.mode === "Full Game") {
            let pb = this.timer.personalBest[this.timer.currentSplit];
            if (!pb)
                return;
            let amountBehind = totalMs - pb;
            if (amountBehind > 0) {
                if (this.showSplitComparisons) {
                    this.splitDatas[this.timer.currentSplit][2].innerText = `+${fmtMs(amountBehind)}`;
                    this.splitDatas[this.timer.currentSplit][2].classList.add("behind");
                }
                this.setTotalAhead(false);
            }
        }
        else {
            let pb = this.timer.ilPb;
            if (!pb)
                return;
            let amountBehind = totalMs - pb;
            if (amountBehind > 0) {
                this.setTotalAhead(false);
            }
        }
    }
    setFinalSplit(split, totalMs, diff, ahead, best) {
        let els = this.splitDatas[split];
        els[3].innerText = fmtMs(totalMs);
        if (!this.showSplitComparisons)
            return;
        if (diff === undefined || ahead === undefined || best === undefined)
            return;
        let str;
        if (ahead)
            str = `-${fmtMs(-diff)}`;
        else
            str = `+${fmtMs(diff)}`;
        els[2].innerText = str;
        if (best)
            els[2].classList.add("best");
        else if (ahead)
            els[2].classList.add("ahead");
        else
            els[2].classList.add("behind");
    }
    lockInCategory() {
        let selects = this.element.querySelectorAll("select");
        for (let select of selects) {
            select.disabled = true;
            select.title = "Cannot be altered mid-run";
        }
        let resetButton = document.createElement("button");
        resetButton.classList.add("restart");
        resetButton.innerHTML = restore;
        resetButton.addEventListener("click", () => {
            this.autosplitter.reset();
        });
        this.element.firstChild?.firstChild?.before(resetButton);
    }
    setTotalAhead(ahead) {
        this.total.classList.toggle("ahead", ahead);
        this.total.classList.toggle("behind", !ahead);
    }
    lastActiveRow = null;
    setActiveSplit(split) {
        if (this.lastActiveRow)
            this.lastActiveRow.classList.remove("active");
        if (split === null)
            return;
        this.splitRows[split].classList.add("active");
        this.lastActiveRow = this.splitRows[split];
    }
    setAttempts(attempts) {
        this.attemptsEl.innerText = String(attempts);
    }
    remove() {
        this.element?.remove();
    }
}

class Timer {
    autosplitter;
    ui;
    attempts = 0;
    startTime;
    splitStart;
    started = false;
    currentSplit = 0;
    now = 0;
    splitTimes = [];
    bestSplits = [];
    personalBest = [];
    ilPb = null;
    constructor(autosplitter) {
        this.autosplitter = autosplitter;
        this.ui = new UI(this);
    }
    getModeId() {
        if (this.autosplitter.mode === "Full Game")
            return this.autosplitter.category;
        if (this.autosplitter.ilPreboosts)
            return `${this.autosplitter.category}-${this.autosplitter.ilsummit}-preboosts`;
        return `${this.autosplitter.category}-${this.autosplitter.ilsummit}`;
    }
    init() {
        this.loadModeData();
        this.ui.create();
    }
    loadModeData() {
        this.attempts = GL.storage.getValue("DLD Timer", `attempts-${this.getModeId()}`, 0);
        if (this.autosplitter.mode == "Full Game") {
            this.personalBest = GL.storage.getValue("DLD Timer", `pb-${this.getModeId()}`, []);
            this.bestSplits = GL.storage.getValue("DLD Timer", `bestSplits-${this.getModeId()}`, []);
        }
        else {
            this.ilPb = GL.storage.getValue("DLD Timer", `ilpb-${this.getModeId()}`, null);
        }
    }
    start(currentSplit = 0) {
        this.startTime = performance.now();
        this.splitStart = this.startTime;
        this.started = true;
        this.currentSplit = currentSplit;
        this.ui.setActiveSplit(0);
        this.ui.lockInCategory();
        // increment the attempts
        this.attempts++;
        this.ui.setAttempts(this.attempts);
        GL.storage.setValue("DLD Timer", `attempts-${this.getModeId()}`, this.attempts);
        this.ui.setTotalAhead(true);
    }
    updateCategory(name) {
        this.autosplitter.category = name;
        this.loadModeData();
        this.ui.setAttempts(this.attempts);
    }
    finishIl() {
        let ms = this.now - this.startTime;
        if (!this.ilPb || ms < this.ilPb) {
            this.ilPb = ms;
            GL.storage.setValue("DLD Timer", `ilpb-${this.getModeId()}`, this.ilPb);
        }
    }
    split() {
        // add the comparison and total time
        let totalMs = this.now - this.startTime;
        let splitMs = totalMs - (this.splitTimes[this.splitTimes.length - 1] ?? 0);
        let best = this.bestSplits[this.currentSplit];
        let isBest = !best || splitMs < best;
        if (isBest) {
            this.bestSplits[this.currentSplit] = splitMs;
            GL.storage.setValue("DLD Timer", `bestSplits-${this.getModeId()}`, this.bestSplits);
        }
        // add the comparison
        let pb = this.personalBest[this.currentSplit];
        if (pb) {
            let diff = totalMs - pb;
            let ahead = totalMs < pb;
            this.ui.setFinalSplit(this.currentSplit, totalMs, diff, ahead, isBest);
            let next = this.personalBest[this.currentSplit + 1];
            if (next) {
                let reallyBehind = totalMs > next;
                this.ui.setTotalAhead(!reallyBehind);
            }
        }
        else {
            this.ui.setFinalSplit(this.currentSplit, totalMs);
        }
        this.splitTimes.push(totalMs);
        this.splitStart = performance.now();
        this.currentSplit++;
        // when the run is over
        if (this.currentSplit === splitNames.length) {
            this.started = false;
            this.currentSplit = splitNames.length - 1;
            let isAhead = !pb || totalMs < pb;
            this.ui.setTotalAhead(isAhead);
            // update the personal best
            if (isAhead) {
                this.personalBest = this.splitTimes;
                GL.storage.setValue("DLD Timer", `pb-${this.getModeId()}`, this.personalBest);
            }
            return;
        }
        // add the active class to the next split
        this.ui.setActiveSplit(this.currentSplit);
    }
    onUpdate() {
        if (!this.started)
            return;
        let now = performance.now();
        this.now = now;
        let totalMs = now - this.startTime;
        let splitMs = now - this.splitStart;
        this.ui.update(totalMs, splitMs);
    }
}

class Autosplitter {
    timer = new Timer(this);
    mode = GL.storage.getValue("DLD Timer", "mode", "Full Game");
    ilsummit = GL.storage.getValue("DLD Timer", "ilsummit", 0);
    ilPreboosts = GL.storage.getValue("DLD Timer", "ilPreboosts", false);
    category = "Current Patch";
    couldStartLastFrame = true;
    hasMoved = false;
    loadedCorrectSummit = false;
    autostartILs = GL.storage.getValue("DLD Timer", "autostartILs", false);
    setMode(mode, ilsummit, ilPreboosts) {
        if (this.category === "Current Patch")
            ilPreboosts = false;
        // set and save values
        this.mode = mode;
        GL.storage.setValue("DLD Timer", "mode", mode);
        if (ilsummit !== undefined) {
            this.ilsummit = ilsummit;
            GL.storage.setValue("DLD Timer", "ilsummit", ilsummit);
        }
        if (ilPreboosts !== undefined) {
            this.ilPreboosts = ilPreboosts;
            GL.storage.setValue("DLD Timer", "ilPreboosts", ilPreboosts);
        }
        this.couldStartLastFrame = true;
        this.timer.loadModeData();
        this.timer.ui.setAttempts(this.timer.attempts);
    }
    init() {
        this.category = "Current Patch";
        if (GL.pluginManager.isEnabled("BringBackBoosts")) {
            if (GL.storage.getValue("BringBackBoosts", "useOriginalPhysics", false)) {
                this.category = "Original Physics";
            }
            else {
                this.category = "Creative Platforming Patch";
            }
        }
        if (document.readyState === "complete")
            this.timer.init();
        else
            document.addEventListener("DOMContentLoaded", () => this.timer.init());
        let worldManager = GL.stores.phaser.scene.worldManager;
        GL.patcher.after("DLD Timer", worldManager.physics, "physicsStep", () => {
            let input = GL.stores.phaser.scene.inputManager.getPhysicsInput();
            if (input.jump || input.angle !== null)
                this.hasMoved = true;
        });
        // whenever a frame passes check if we've reached any summits
        GL.patcher.after("DLD Timer", worldManager, 'update', () => {
            if (this.mode === "Full Game")
                this.updateFullGame();
            else if (this.ilPreboosts)
                this.updatePreboosts();
            else
                this.updateNoPreboosts();
            this.hasMoved = false;
        });
        let savestates = GL.pluginManager.getPlugin("Savestates")?.return;
        if (savestates) {
            savestates.onStateLoaded(this.onStateLoadedBound);
        }
    }
    onStateLoaded(summit) {
        if (this.autostartILs) {
            if (summit === 1 && this.mode === "Full Game")
                return;
            this.setMode("Summit", summit - 1);
            this.reset();
            if (!this.ilPreboosts)
                this.loadedCorrectSummit = true;
            return;
        }
        if (this.mode === "Full Game")
            return;
        if (this.ilPreboosts)
            return;
        if (this.ilState !== "waiting") {
            this.reset();
        }
        this.loadedCorrectSummit = summit === this.ilsummit + 1;
    }
    onStateLoadedBound = this.onStateLoaded.bind(this);
    reset() {
        // kind of cheaty way to reset the UI
        this.timer.ui.remove();
        this.timer = new Timer(this);
        this.timer.init();
        this.summit = 0;
        this.ilState = "waiting";
        this.couldStartLastFrame = true;
        this.loadedCorrectSummit = false;
    }
    ilState = "waiting";
    updatePreboosts() {
        let body = GL.stores.phaser.mainCharacter.body;
        let coords = summitCoords[this.ilsummit];
        if (this.ilState === "waiting") {
            if (inArea(body, coords)) {
                if (this.couldStartLastFrame)
                    return;
                this.ilState = "started";
                this.timer.start(this.ilsummit);
                this.timer.onUpdate();
            }
            else {
                this.couldStartLastFrame = false;
            }
        }
        else if (this.ilState === "started") {
            // check if we've reached the end
            if (inArea(body, summitStartCoords[this.ilsummit + 1])) {
                this.timer.finishIl();
                this.ilState = "completed";
                this.couldStartLastFrame = true;
            }
            this.timer.onUpdate();
        }
    }
    updateNoPreboosts() {
        if (!this.loadedCorrectSummit)
            return;
        let body = GL.stores.phaser.mainCharacter.body;
        if (this.ilState === "waiting") {
            if (this.hasMoved) {
                this.ilState = "started";
                this.timer.start(this.ilsummit);
                this.timer.onUpdate();
            }
        }
        else if (this.ilState === "started") {
            if (inArea(body, summitStartCoords[this.ilsummit + 1])) {
                this.timer.finishIl();
                this.ilState = "completed";
            }
            this.timer.onUpdate();
        }
    }
    summit = 0;
    updateFullGame() {
        let body = GL.stores.phaser.mainCharacter.body;
        // check if we're at a position where we should reset
        if (this.summit > 0 && body.x < resetCoordinates.x && body.y > resetCoordinates.y) {
            this.reset();
            return;
        }
        if (this.summit > summitStartCoords.length - 1)
            return;
        if (this.summit === 0) {
            if (body.x > summitStartCoords[0].x && body.y < summitStartCoords[0].y + 10) {
                if (this.couldStartLastFrame)
                    return;
                this.summit = 1;
                this.timer.start();
            }
            else {
                this.couldStartLastFrame = false;
            }
        }
        else if (inArea(body, summitStartCoords[this.summit])) {
            this.summit++;
            this.timer.split();
        }
        this.timer.onUpdate();
    }
    destroy() {
        this.timer.ui.remove();
        let savestates = GL.pluginManager.getPlugin("Savestates")?.return;
        if (savestates) {
            savestates.offStateLoaded(this.onStateLoadedBound);
        }
    }
}

/// <reference types='gimloader' />
GL.UI.addStyles("DLD Timer", styles);
let autosplitter = new Autosplitter();
let isDestroyed = false;
onceOrIfLoaded(() => {
    if (isDestroyed)
        return;
    autosplitter.init();
});
function onStop() {
    isDestroyed = true;
    autosplitter.destroy();
    GL.UI.removeStyles("DLD Timer");
    GL.patcher.unpatchAll("DLD Timer");
}
function openSettingsMenu() {
    let div = document.createElement("div");
    new Settings({
        target: div,
        props: {
            autosplitter
        }
    });
    GL.UI.showModal(div, {
        title: "Manage DLD Timer data",
        buttons: [{ text: "Close", style: "close" }],
        id: "DLD Timer Settings",
        style: "min-width: min(600px, 90%)",
        closeOnBackgroundClick: false,
        onClosed: () => {
            autosplitter.reset();
        }
    });
}

export { onStop, openSettingsMenu };
