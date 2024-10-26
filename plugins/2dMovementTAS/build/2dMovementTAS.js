/**
 * @name 2dMovementTAS
 * @description Allows for making TASes of CTF and tag
 * @author TheLazySquid
 * @version 0.2.0
 * @downloadUrl https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/plugins/2dMovementTAS/build/2dMovementTAS.js
 * @reloadRequired ingame
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

function subscribe(store, ...callbacks) {
	if (store == null) {
		for (const callback of callbacks) {
			callback(undefined);
		}
		return noop;
	}
	const unsub = store.subscribe(...callbacks);
	return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}

/** @returns {void} */
function component_subscribe(component, store, callback) {
	component.$$.on_destroy.push(subscribe(store, callback));
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
 * @returns {(event: any) => any} */
function prevent_default(fn) {
	return function (event) {
		event.preventDefault();
		// @ts-ignore
		return fn.call(this, event);
	};
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

// TODO figure out if we still want to support
// shorthand events, or if we want to implement
// a real bubbling mechanism
/**
 * @param component
 * @param event
 * @returns {void}
 */
function bubble(component, event) {
	const callbacks = component.$$.callbacks[event.type];
	if (callbacks) {
		// @ts-ignore
		callbacks.slice().forEach((fn) => fn.call(this, event));
	}
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

/* src\ui\AnglePicker.svelte generated by Svelte v4.2.19 */

function add_css$2(target) {
	append_styles(target, "svelte-1orrvcr", ".circleWrap.svelte-1orrvcr{width:100%;display:flex;align-items:center;justify-content:center}.circle.svelte-1orrvcr{width:100px;height:100px;border-radius:50%;background-color:#f0f0f0;position:relative}.pointer.svelte-1orrvcr{width:2px;height:50px;background-color:#000;position:absolute;top:50%;left:50%;transform-origin:0 0}.inputs.svelte-1orrvcr{width:100%;display:flex;align-items:center;justify-content:space-between}.numInput.svelte-1orrvcr{border:none;border-bottom:1px solid black}");
}

function create_fragment$2(ctx) {
	let div5;
	let div2;
	let div1;
	let div0;
	let t0;
	let div4;
	let input0;
	let t1;
	let div3;
	let input1;
	let t2;
	let span;
	let mounted;
	let dispose;

	return {
		c() {
			div5 = element("div");
			div2 = element("div");
			div1 = element("div");
			div0 = element("div");
			t0 = space();
			div4 = element("div");
			input0 = element("input");
			t1 = space();
			div3 = element("div");
			input1 = element("input");
			t2 = space();
			span = element("span");
			span.textContent = "°";
			attr(div0, "class", "pointer svelte-1orrvcr");
			set_style(div0, "transform", "rotate(" + (/*angle*/ ctx[0] - 90) + "deg)");
			attr(div1, "class", "circle svelte-1orrvcr");
			attr(div2, "class", "circleWrap svelte-1orrvcr");
			attr(input0, "type", "range");
			attr(input0, "min", "0");
			attr(input0, "max", "360");
			attr(input0, "step", "0.01");
			attr(input1, "class", "numInput svelte-1orrvcr");
			attr(input1, "type", "number");
			attr(input1, "min", "0");
			attr(input1, "max", "360");
			attr(div4, "class", "inputs svelte-1orrvcr");
		},
		m(target, anchor) {
			insert(target, div5, anchor);
			append(div5, div2);
			append(div2, div1);
			append(div1, div0);
			/*div1_binding*/ ctx[7](div1);
			append(div5, t0);
			append(div5, div4);
			append(div4, input0);
			set_input_value(input0, /*angle*/ ctx[0]);
			append(div4, t1);
			append(div4, div3);
			append(div3, input1);
			set_input_value(input1, /*angle*/ ctx[0]);
			append(div3, t2);
			append(div3, span);

			if (!mounted) {
				dispose = [
					listen(window, "pointerup", /*pointerup_handler*/ ctx[6]),
					listen(window, "pointermove", /*updateAngle*/ ctx[4]),
					listen(div1, "pointerdown", /*onMousedown*/ ctx[3]),
					listen(input0, "change", /*input0_change_input_handler*/ ctx[8]),
					listen(input0, "input", /*input0_change_input_handler*/ ctx[8]),
					listen(input1, "input", /*input1_input_handler*/ ctx[9])
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*angle*/ 1) {
				set_style(div0, "transform", "rotate(" + (/*angle*/ ctx[0] - 90) + "deg)");
			}

			if (dirty & /*angle*/ 1) {
				set_input_value(input0, /*angle*/ ctx[0]);
			}

			if (dirty & /*angle*/ 1 && to_number(input1.value) !== /*angle*/ ctx[0]) {
				set_input_value(input1, /*angle*/ ctx[0]);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) {
				detach(div5);
			}

			/*div1_binding*/ ctx[7](null);
			mounted = false;
			run_all(dispose);
		}
	};
}

function instance$2($$self, $$props, $$invalidate) {
	let { angle = 0 } = $$props;

	function getAngle() {
		return angle;
	}

	let circle;
	let dragging = false;

	function onMousedown(e) {
		$$invalidate(2, dragging = true);
		updateAngle(e);
	}

	function updateAngle(e) {
		if (!dragging) return;
		let rect = circle.getBoundingClientRect();
		let x = e.clientX - rect.left;
		let y = e.clientY - rect.top;
		let newAngle = Math.atan2(y - 50, x - 50) * 180 / Math.PI;
		$$invalidate(0, angle = Math.round((newAngle + 360) % 360 * 100) / 100);
	}

	const pointerup_handler = () => $$invalidate(2, dragging = false);

	function div1_binding($$value) {
		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
			circle = $$value;
			$$invalidate(1, circle);
		});
	}

	function input0_change_input_handler() {
		angle = to_number(this.value);
		$$invalidate(0, angle);
	}

	function input1_input_handler() {
		angle = to_number(this.value);
		$$invalidate(0, angle);
	}

	$$self.$$set = $$props => {
		if ('angle' in $$props) $$invalidate(0, angle = $$props.angle);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*angle*/ 1) {
			if (angle === null) $$invalidate(0, angle = 0);
		}
	};

	return [
		angle,
		circle,
		dragging,
		onMousedown,
		updateAngle,
		getAngle,
		pointerup_handler,
		div1_binding,
		input0_change_input_handler,
		input1_input_handler
	];
}

class AnglePicker extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$2, create_fragment$2, safe_not_equal, { angle: 0, getAngle: 5 }, add_css$2);
	}

	get getAngle() {
		return this.$$.ctx[5];
	}
}

// @ts-ignore
const blankFrame = {
    angle: 0,
    moving: true,
    answer: false,
    purchase: false
};
// inclusive
function between(number, bound1, bound2) {
    return number >= Math.min(bound1, bound2) && number <= Math.max(bound1, bound2);
}
function showAnglePicker(initial) {
    return new Promise((res) => {
        let div = document.createElement('div');
        // @ts-ignore
        let anglePicker = new AnglePicker({
            target: div,
            props: {
                angle: initial
            }
        });
        GL.UI.showModal(div, {
            title: "Pick an angle",
            closeOnBackgroundClick: false,
            onClosed() {
                // @ts-ignore
                anglePicker.$destroy();
            },
            buttons: [{ text: "Cancel", style: "close", onClick() {
                        res(initial);
                    } }, { text: "Ok", style: "primary", onClick() {
                        res(anglePicker.getAngle());
                    } }]
        });
    });
}
function easyAccessWritable(initial) {
    let returnObj = {
        value: initial, subscribe, set
    };
    let subscribers = new Set();
    function subscribe(callback) {
        subscribers.add(callback);
        callback(returnObj.value);
        return () => {
            subscribers.delete(callback);
        };
    }
    function set(val) {
        returnObj.value = val;
        for (let subscriber of subscribers) {
            subscriber(val);
        }
    }
    return returnObj;
}
const defaultState = {
    gravity: 0,
    velocity: {
        x: 0,
        y: 0
    },
    movement: {
        direction: "none",
        xVelocity: 0,
        accelerationTicks: 0
    },
    jump: {
        isJumping: false,
        jumpsLeft: 1,
        jumpCounter: 0,
        jumpTicks: 0,
        xVelocityAtJumpStart: 0
    },
    forces: [],
    grounded: false,
    groundedTicks: 0,
    lastGroundedAngle: 0
};
// just saves a bit of memory
function getFrameState(state) {
    return Object.assign({}, defaultState, state);
}
function makeFrameState() {
    let state = GL.stores.phaser.mainCharacter.physics.state;
    let returnObj = {};
    for (let key in state) {
        if (JSON.stringify(defaultState[key]) !== JSON.stringify(state[key])) {
            returnObj[key] = state[key];
        }
    }
    return returnObj;
}
function updateDeviceState(device, key, value) {
    let deviceId = device.id;
    let states = GL.stores.world.devices.states;
    if (!states.has(deviceId)) {
        states.set(deviceId, { deviceId, properties: new Map() });
    }
    states.get(deviceId).properties.set(key, value);
    device.onStateUpdateFromServer(key, value);
}
function downloadFile(contents, name) {
    let blob = new Blob([contents], { type: 'text/plain' });
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
}
function uploadFile() {
    return new Promise((res, rej) => {
        let input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = () => {
            if (!input.files || !input.files[0])
                return rej();
            let file = input.files[0];
            let reader = new FileReader();
            reader.onload = () => {
                res(reader.result);
            };
            reader.readAsText(file);
        };
        input.click();
    });
}

let currentFrame = easyAccessWritable(0);

let active = false;
// Ignore any and all (pitiful) attempts from the server to get us to go to where we should be
GL.parcel.interceptRequire("2dMovementTAS", exports => exports?.default?.toString?.().includes("[MOVEMENT]"), exports => {
    // prevent colyseus from complaining that nothing is registered
    GL.patcher.instead("2dMovementTAS", exports, "default", (_, args) => {
        args[0].onMessage("PHYSICS_STATE", (packet) => {
            if (active)
                return;
            let mc = GL.stores.phaser.mainCharacter;
            mc?.physics.setServerPosition({
                packet: packet.packetId,
                x: packet.x,
                y: packet.y,
                jsonState: JSON.parse(packet.physicsState || "{}"),
                teleport: packet.teleport
            });
        });
    });
});
window.expectedPoses = [];
class TASTools {
    frames;
    setFrames;
    startPos;
    nativeStep;
    physicsManager;
    inputManager;
    prevFrameStates = [];
    rb;
    movement;
    tagEnergyDisplay;
    energyPerQuestion = 5000;
    energyUsage = 60;
    energyTimeout = 0;
    purchaseTimeouts = [];
    energyFrames = [];
    tagMaxEnergy = 10000;
    constructor(frames, setFrames, startPos) {
        this.frames = frames;
        this.setFrames = setFrames;
        this.physicsManager = GL.stores.phaser.scene.worldManager.physics;
        this.nativeStep = this.physicsManager.physicsStep;
        active = true;
        let mcState = GL.net.colyseus.room.state.characters.get(GL.stores.phaser.mainCharacter.id);
        mcState.$callbacks.movementSpeed = [];
        for (let slot of mcState.inventory.slots.values()) {
            slot.$callbacks = {};
        }
        mcState.inventory.slots.onAdd((item) => {
            setTimeout(() => {
                item.$callbacks = {};
            });
        });
        let mc = GL.stores.phaser.mainCharacter;
        this.stopPlayback();
        this.inputManager = GL.stores.phaser.scene.inputManager;
        this.rb = mc.physics.getBody().rigidBody;
        if (startPos) {
            this.startPos = startPos;
            this.rb.setTranslation(startPos, true);
        }
        else {
            this.startPos = this.rb.translation();
        }
        this.movement = mc.movement;
        this.movement.state = Object.assign({}, defaultState);
        let allDevices = GL.stores.phaser.scene.worldManager.devices.allDevices;
        this.tagEnergyDisplay = allDevices.find((d) => d.options?.text == "0/10,000 <item-image item=\"energy\" />");
        GL.net.colyseus.addEventListener("DEVICES_STATES_CHANGES", (packet) => {
            packet.detail.changes.splice(0, packet.detail.changes.length);
        });
        this.setEnergy(940);
        // periodically save
        setInterval(() => {
            this.save();
        }, 60000);
        window.addEventListener("unload", () => {
            this.save();
        });
    }
    setEnergy(amount) {
        if (this.tagEnergyDisplay) {
            updateDeviceState(this.tagEnergyDisplay, `PLAYER_${GL.stores.phaser.mainCharacter.id}_text`, `${amount}/${this.tagMaxEnergy} <item-image item="energy" />`);
        }
        GL.stores.me.inventory.slots.get("energy").amount = amount;
    }
    getEnergy() {
        return GL.stores.me.inventory.slots.get("energy").amount ?? 0;
    }
    goBackToFrame(number) {
        // apply all the undoDeviceChanges
        for (let i = currentFrame.value - 1; i >= number; i--) {
            let frame = this.prevFrameStates[i];
            if (!frame)
                continue;
            if (frame.undoDeviceChanges)
                frame.undoDeviceChanges();
        }
        let frame = this.prevFrameStates[number];
        if (!frame)
            return;
        currentFrame.set(number);
        this.rb.setTranslation(frame.position, true);
        GL.stores.phaser.mainCharacter.physics.state = getFrameState(frame.state);
        GL.stores.me.movementSpeed = frame.speed;
        this.setEnergy(frame.energy);
        this.energyPerQuestion = frame.epq;
        this.energyUsage = frame.energyUsage;
        this.energyTimeout = frame.energyTimeout;
        this.tagMaxEnergy = frame.maxEnergy;
        this.purchaseTimeouts = frame.purchaseTimeouts;
        this.energyFrames = frame.energyFrames;
    }
    backFrame() {
        if (currentFrame.value <= 0)
            return;
        this.goBackToFrame(currentFrame.value - 1);
    }
    advanceFrame() {
        let expectedPos = window.expectedPoses[currentFrame.value];
        if (!expectedPos) {
            window.expectedPoses[currentFrame.value] = this.rb.translation();
        }
        else {
            let pos = this.rb.translation();
            if (expectedPos.x !== pos.x || expectedPos.y !== pos.y) {
                console.log("DESYNC!!!!", expectedPos, pos);
                console.log(this.getPhysicsInput());
            }
        }
        let frame = this.frames[currentFrame.value];
        let save = this.getState();
        this.prevFrameStates[currentFrame.value] = save;
        // save the state
        this.updateDevices(frame);
        this.updateCharacter(frame);
        this.inputManager.getPhysicsInput = () => this.getPhysicsInput();
        this.nativeStep(0);
        currentFrame.set(currentFrame.value + 1);
    }
    hideUI() {
        GL.stores.me.currentAction = "none";
        GL.stores.gui.none.screen = "home";
    }
    updateDevices(frame) {
        for (let [countdown, purchase] of this.purchaseTimeouts) {
            if (countdown === 0) {
                let undo = purchase();
                this.prevFrameStates[currentFrame.value].undoDeviceChanges = undo;
            }
        }
        if (!frame.purchase)
            return;
        let devices = GL.stores.phaser.scene.worldManager.devices;
        let realPos = this.rb.translation();
        let device = devices.interactives.findClosestInteractiveDevice(devices.devicesInView, realPos.x * 100, realPos.y * 100);
        if (!device)
            return;
        // check whether we can afford it
        if (device.options?.requiredItemId === "energy" && device.options?.amountOfRequiredItem <= this.getEnergy()) {
            const vendingMachines = ["Energy Per Question Upgrade", "Speed Upgrade", "Efficiency Upgrade", "Endurance Upgrade", "Energy Generator"];
            let name = device.options.grantedItemName;
            const isBarrier = name.includes("Barrier");
            const isBlocker = name.includes("Teleportal") || name.includes("Tunnel") || name.includes("Access") || name.includes("Escape");
            if (isBarrier) {
                this.purchaseTimeouts.push([
                    Math.floor(device.options.interactionDuration * 12) - 1,
                    () => {
                        // activate the barrier
                        let channel = device.options.purchaseChannel.split(",")[0];
                        updateDeviceState(device, "GLOBAL_active", false);
                        let barrier = devices.devicesInView.find((d) => d.options?.showWhenReceivingFrom === channel);
                        if (barrier)
                            updateDeviceState(barrier, "GLOBAL_visible", true);
                        this.setEnergy(this.getEnergy() - device.options.amountOfRequiredItem);
                        return () => {
                            updateDeviceState(device, "GLOBAL_active", true);
                            if (barrier)
                                updateDeviceState(barrier, "GLOBAL_visible", false);
                        };
                    }
                ]);
            }
            else if (isBlocker) {
                this.purchaseTimeouts.push([
                    Math.floor(device.options.interactionDuration * 12) - 1,
                    () => {
                        let channels = device.options.purchaseChannel.split(",").map((str) => str.trim());
                        let disable = devices.devicesInView.filter((d) => channels.includes(d.options?.deactivateChannel));
                        disable.forEach((d) => updateDeviceState(d, "GLOBAL_active", false));
                        this.setEnergy(this.getEnergy() - device.options.amountOfRequiredItem);
                        return () => {
                            disable.forEach((d) => updateDeviceState(d, "GLOBAL_active", true));
                        };
                    }
                ]);
            }
            else if (vendingMachines.includes(name)) {
                this.purchaseTimeouts.push([
                    Math.floor(device.options.interactionDuration * 12) - 1,
                    () => {
                        updateDeviceState(device, "GLOBAL_active", false);
                        GL.notification.open({ message: `Purchased ${name}` });
                        switch (name) {
                            case "Energy Per Question Upgrade":
                                this.energyPerQuestion += 200;
                                break;
                            case "Speed Upgrade":
                                // kinda random but sure
                                GL.stores.me.movementSpeed += 46.5;
                                break;
                            case "Efficiency Upgrade":
                                this.energyUsage -= 7;
                                break;
                            case "Endurance Upgrade":
                                this.tagMaxEnergy += 5000;
                                break;
                            case "Energy Generator":
                                this.energyFrames.push(7 * 12);
                                break;
                        }
                        this.setEnergy(this.getEnergy() - device.options.amountOfRequiredItem);
                        return () => {
                            updateDeviceState(device, "GLOBAL_active", true);
                        };
                    },
                    true
                ]);
            }
            else {
                GL.notification.open({ message: "Unable to handle what you're trying to purchase. If this is unexpected, please report it." });
            }
        }
    }
    updateCharacter(frame) {
        if (frame.answer) {
            if (this.tagEnergyDisplay) {
                this.setEnergy(Math.min(this.tagMaxEnergy, this.getEnergy() + this.energyPerQuestion));
            }
            else {
                this.setEnergy(this.getEnergy() + this.energyPerQuestion);
            }
        }
        this.energyTimeout--;
        if (frame.moving && this.energyTimeout <= 0) {
            if (this.energyTimeout === 0)
                this.setEnergy(Math.max(0, this.getEnergy() - this.energyUsage));
            let prevFrame = this.frames[currentFrame.value - 1];
            // if we're already moving, 0.5ms
            if (prevFrame && prevFrame.moving) {
                this.energyTimeout = 6;
            }
            else {
                // 1/4 sec
                this.energyTimeout = 3;
            }
        }
        for (let i = 0; i < this.energyFrames.length; i++) {
            this.energyFrames[i]--;
            if (this.energyFrames[i] <= 0) {
                this.energyFrames[i] = 7 * 12;
                this.setEnergy(this.getEnergy() + 120);
            }
        }
        // Use teleporters
        let devices = GL.stores.phaser.scene.worldManager.devices;
        let teleporters = devices.devicesInView.filter((d) => d.deviceOption?.id === "teleporter");
        let body = GL.stores.phaser.mainCharacter.body;
        for (let teleporter of teleporters) {
            // 85 units on the top, 90 on the left/right, 100 on the bottom
            if (teleporter.x > body.x - 90 && teleporter.x < body.x + 90 && teleporter.y > body.y - 85 && teleporter.y < body.y + 100) {
                let target = teleporter.options.targetGroup;
                if (!target)
                    continue;
                let targetTeleporter = devices.allDevices.find((d) => d.options?.group === target && d.deviceOption?.id === "teleporter");
                if (!targetTeleporter)
                    continue;
                this.rb.setTranslation({ x: targetTeleporter.x / 100, y: targetTeleporter.y / 100 }, true);
                break;
            }
        }
    }
    updateUI() {
        let frame = this.frames[currentFrame.value];
        // open the device
        if (frame.answer) {
            GL.stores.phaser.scene.worldManager.devices.allDevices
                .find((d) => d.options?.openWhenReceivingOn === "answer questions").openDeviceUI();
        }
        else {
            // close the device
            GL.stores.me.currentAction = "none";
        }
        if (frame.purchase) {
            GL.stores.gui.none.screen = "inventory";
        }
        else {
            GL.stores.gui.none.screen = "home";
        }
    }
    getPhysicsInput(index = currentFrame.value) {
        let frame = this.frames[index];
        let prevFrame = this.frames[index - 1];
        let angle = frame.moving ? frame.angle : null;
        // don't move on pause frames
        for (let [countdown, _, stopMotion] of this.purchaseTimeouts) {
            if (countdown <= 1 && stopMotion)
                angle = null;
        }
        // dont move with no energy
        if (this.getEnergy() <= 0)
            angle = null;
        this.purchaseTimeouts = this.purchaseTimeouts.map(([c, p, s]) => [c - 1, p, s]);
        this.purchaseTimeouts = this.purchaseTimeouts.filter(([c]) => c >= 0);
        // we can't move while answering
        if (frame.answer || prevFrame?.answer) {
            angle = null;
        }
        return {
            angle,
            jump: false,
            _jumpKeyPressed: false
        };
    }
    getState() {
        return {
            position: this.rb.translation(),
            state: makeFrameState(),
            energy: this.getEnergy(),
            speed: GL.stores.me.movementSpeed,
            epq: this.energyPerQuestion,
            energyUsage: this.energyUsage,
            energyTimeout: this.energyTimeout,
            maxEnergy: this.tagMaxEnergy,
            purchaseTimeouts: [...this.purchaseTimeouts],
            energyFrames: [...this.energyFrames]
        };
    }
    startPlayback() {
        this.physicsManager.physicsStep = (delta) => {
            let expectedPos = window.expectedPoses[currentFrame.value];
            if (!expectedPos) {
                window.expectedPoses[currentFrame.value] = this.rb.translation();
            }
            else {
                let pos = this.rb.translation();
                if (expectedPos.x !== pos.x || expectedPos.y !== pos.y) {
                    console.log("DESYNC!!!!", expectedPos, pos);
                    console.log(this.getPhysicsInput());
                }
            }
            // save the state
            let frame = this.frames[currentFrame.value];
            let save = this.getState();
            this.prevFrameStates[currentFrame.value] = save;
            // save the state
            this.updateDevices(frame);
            this.updateCharacter(frame);
            this.inputManager.getPhysicsInput = () => this.getPhysicsInput();
            this.updateUI();
            this.nativeStep(delta);
            currentFrame.set(currentFrame.value + 1);
        };
    }
    stopPlayback() {
        let mc = GL.stores.phaser.mainCharacter;
        this.physicsManager.physicsStep = (delta) => {
            mc.physics.postUpdate(delta);
        };
        this.hideUI();
    }
    save() {
        let val = {
            startPos: this.startPos,
            frames: this.frames
        };
        GL.storage.setValue("2dMovementTAS", "save", val);
        return val;
    }
    download() {
        downloadFile(JSON.stringify(this.save()), "2D TAS.json");
    }
    load() {
        uploadFile()
            .then(file => {
            let data = JSON.parse(file);
            this.goBackToFrame(0);
            this.startPos = data.startPos;
            this.frames = data.frames;
            this.setFrames(data.frames);
        })
            .catch(() => { });
    }
}

/* src\ui\UI.svelte generated by Svelte v4.2.19 */

function add_css$1(target) {
	append_styles(target, "svelte-11sfel", ".UI.svelte-11sfel.svelte-11sfel{position:absolute;background-color:rgba(255,255,255,0.6);top:0;left:0;height:100%;z-index:9999999}.controls.svelte-11sfel.svelte-11sfel{height:50px;display:flex;align-items:center;justify-content:center;gap:5px}table.svelte-11sfel.svelte-11sfel{min-width:100%}tr.svelte-11sfel.svelte-11sfel{height:22px}td.dragged.svelte-11sfel.svelte-11sfel{background-color:rgba(0,138,197,0.5) !important}tr.active.svelte-11sfel.svelte-11sfel{background-color:rgba(0,138,197,0.892) !important}tr.svelte-11sfel.svelte-11sfel:nth-child(even){background-color:rgba(0,0,0,0.1)}th.svelte-11sfel.svelte-11sfel:first-child,td.svelte-11sfel.svelte-11sfel:first-child{width:100px}input[type=\"checkbox\"].disabled.svelte-11sfel.svelte-11sfel,input[type=\"checkbox\"].svelte-11sfel.svelte-11sfel:disabled{opacity:0.5}th.svelte-11sfel.svelte-11sfel,td.svelte-11sfel.svelte-11sfel{height:22px;width:60px;text-align:center;-webkit-user-select:none;-moz-user-select:none;user-select:none}.angle.svelte-11sfel.svelte-11sfel{width:130px;padding:0 10px;display:flex;align-items:center;gap:5px;cursor:pointer}.angle.svelte-11sfel .number.svelte-11sfel{flex-grow:1;display:flex;align-items:center;gap:5px}.drag.svelte-11sfel.svelte-11sfel{cursor:ns-resize}");
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[48] = list[i];
	child_ctx[54] = i;
	const constants_0 = /*offset*/ child_ctx[2] + /*i*/ child_ctx[54];
	child_ctx[49] = constants_0;
	const constants_1 = /*frames*/ child_ctx[0][/*index*/ child_ctx[49]].purchase || /*frames*/ child_ctx[0][/*index*/ child_ctx[49] - 1]?.answer || /*frames*/ child_ctx[0][/*index*/ child_ctx[49] - 2]?.answer || /*frames*/ child_ctx[0][/*index*/ child_ctx[49] - 1]?.purchase || /*frames*/ child_ctx[0][/*index*/ child_ctx[49] - 2]?.purchase;
	child_ctx[50] = constants_1;
	const constants_2 = /*frames*/ child_ctx[0][/*index*/ child_ctx[49]].answer || /*frames*/ child_ctx[0][/*index*/ child_ctx[49] - 1]?.answer || /*frames*/ child_ctx[0][/*index*/ child_ctx[49] - 2]?.answer || /*frames*/ child_ctx[0][/*index*/ child_ctx[49] - 1]?.purchase || /*frames*/ child_ctx[0][/*index*/ child_ctx[49] - 2]?.purchase;
	child_ctx[51] = constants_2;
	const constants_3 = /*frames*/ child_ctx[0][/*index*/ child_ctx[49]].answer || /*frames*/ child_ctx[0][/*index*/ child_ctx[49] - 1]?.answer;
	child_ctx[52] = constants_3;
	return child_ctx;
}

// (138:8) {#each { length: rows } as _, i}
function create_each_block(ctx) {
	let tr;
	let td0;
	let t0_value = /*index*/ ctx[49] + "";
	let t0;
	let t1;
	let td1;
	let input0;
	let t2;
	let td2;
	let input1;
	let t3;
	let td3;
	let input2;
	let t4;
	let td4;
	let div1;
	let div0;
	let t5;
	let t6;
	let t7_value = Math.round(/*frames*/ ctx[0][/*index*/ ctx[49]].angle * 100) / 100 + "";
	let t7;
	let t8;
	let t9;
	let div2;
	let t11;
	let mounted;
	let dispose;

	function input0_change_handler() {
		/*input0_change_handler*/ ctx[31].call(input0, /*index*/ ctx[49]);
	}

	function mousedown_handler() {
		return /*mousedown_handler*/ ctx[32](/*answerDisabled*/ ctx[50], /*index*/ ctx[49]);
	}

	function input1_change_handler() {
		/*input1_change_handler*/ ctx[33].call(input1, /*index*/ ctx[49]);
	}

	function mousedown_handler_1() {
		return /*mousedown_handler_1*/ ctx[34](/*purchaseDisabled*/ ctx[51], /*index*/ ctx[49]);
	}

	function input2_change_handler() {
		/*input2_change_handler*/ ctx[35].call(input2, /*index*/ ctx[49]);
	}

	function mousedown_handler_2() {
		return /*mousedown_handler_2*/ ctx[36](/*moveDisabled*/ ctx[52], /*index*/ ctx[49]);
	}

	function pointerdown_handler() {
		return /*pointerdown_handler*/ ctx[37](/*index*/ ctx[49]);
	}

	function pointerdown_handler_1() {
		return /*pointerdown_handler_1*/ ctx[38](/*index*/ ctx[49]);
	}

	function pointerover_handler() {
		return /*pointerover_handler*/ ctx[39](/*index*/ ctx[49]);
	}

	function pointerover_handler_1() {
		return /*pointerover_handler_1*/ ctx[40](/*index*/ ctx[49]);
	}

	return {
		c() {
			tr = element("tr");
			td0 = element("td");
			t0 = text(t0_value);
			t1 = space();
			td1 = element("td");
			input0 = element("input");
			t2 = space();
			td2 = element("td");
			input1 = element("input");
			t3 = space();
			td3 = element("td");
			input2 = element("input");
			t4 = space();
			td4 = element("td");
			div1 = element("div");
			div0 = element("div");
			t5 = text("⇑");
			t6 = space();
			t7 = text(t7_value);
			t8 = text("°");
			t9 = space();
			div2 = element("div");
			div2.textContent = "↕";
			t11 = space();
			attr(td0, "class", "frame svelte-11sfel");
			attr(input0, "type", "checkbox");
			attr(input0, "class", "svelte-11sfel");
			toggle_class(input0, "disabled", /*answerDisabled*/ ctx[50]);
			attr(td1, "class", "svelte-11sfel");
			attr(input1, "type", "checkbox");
			attr(input1, "class", "svelte-11sfel");
			toggle_class(input1, "disabled", /*purchaseDisabled*/ ctx[51]);
			attr(td2, "class", "svelte-11sfel");
			attr(input2, "type", "checkbox");
			attr(input2, "class", "svelte-11sfel");
			toggle_class(input2, "disabled", /*moveDisabled*/ ctx[52]);
			attr(td3, "class", "svelte-11sfel");
			set_style(div0, "transform", "rotate(" + (/*frames*/ ctx[0][/*index*/ ctx[49]].angle + 90) + "deg)");
			attr(div1, "class", "number svelte-11sfel");
			attr(div2, "class", "drag svelte-11sfel");
			attr(td4, "class", "angle svelte-11sfel");
			toggle_class(td4, "dragged", /*draggingMovement*/ ctx[5] && between(/*index*/ ctx[49], /*draggingMovementStart*/ ctx[6], /*draggingMovementEnd*/ ctx[7]));
			attr(tr, "class", "svelte-11sfel");
			toggle_class(tr, "active", /*$currentFrame*/ ctx[9] === /*index*/ ctx[49]);
		},
		m(target, anchor) {
			insert(target, tr, anchor);
			append(tr, td0);
			append(td0, t0);
			append(tr, t1);
			append(tr, td1);
			append(td1, input0);
			input0.checked = /*frames*/ ctx[0][/*index*/ ctx[49]].answer;
			append(tr, t2);
			append(tr, td2);
			append(td2, input1);
			input1.checked = /*frames*/ ctx[0][/*index*/ ctx[49]].purchase;
			append(tr, t3);
			append(tr, td3);
			append(td3, input2);
			input2.checked = /*frames*/ ctx[0][/*index*/ ctx[49]].moving;
			append(tr, t4);
			append(tr, td4);
			append(td4, div1);
			append(div1, div0);
			append(div0, t5);
			append(div1, t6);
			append(div1, t7);
			append(div1, t8);
			append(td4, t9);
			append(td4, div2);
			append(tr, t11);

			if (!mounted) {
				dispose = [
					listen(input0, "click", prevent_default(/*click_handler*/ ctx[23])),
					listen(input0, "change", input0_change_handler),
					listen(td1, "mousedown", mousedown_handler),
					listen(input1, "click", prevent_default(/*click_handler_1*/ ctx[22])),
					listen(input1, "change", input1_change_handler),
					listen(td2, "mousedown", mousedown_handler_1),
					listen(input2, "click", prevent_default(/*click_handler_2*/ ctx[21])),
					listen(input2, "change", input2_change_handler),
					listen(td3, "mousedown", mousedown_handler_2),
					listen(div1, "pointerdown", pointerdown_handler),
					listen(div2, "pointerdown", pointerdown_handler_1),
					listen(tr, "pointerover", pointerover_handler),
					listen(tr, "pointerover", pointerover_handler_1)
				];

				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty[0] & /*offset*/ 4 && t0_value !== (t0_value = /*index*/ ctx[49] + "")) set_data(t0, t0_value);

			if (dirty[0] & /*frames, offset*/ 5) {
				input0.checked = /*frames*/ ctx[0][/*index*/ ctx[49]].answer;
			}

			if (dirty[0] & /*frames, offset*/ 5) {
				toggle_class(input0, "disabled", /*answerDisabled*/ ctx[50]);
			}

			if (dirty[0] & /*frames, offset*/ 5) {
				input1.checked = /*frames*/ ctx[0][/*index*/ ctx[49]].purchase;
			}

			if (dirty[0] & /*frames, offset*/ 5) {
				toggle_class(input1, "disabled", /*purchaseDisabled*/ ctx[51]);
			}

			if (dirty[0] & /*frames, offset*/ 5) {
				input2.checked = /*frames*/ ctx[0][/*index*/ ctx[49]].moving;
			}

			if (dirty[0] & /*frames, offset*/ 5) {
				toggle_class(input2, "disabled", /*moveDisabled*/ ctx[52]);
			}

			if (dirty[0] & /*frames, offset*/ 5) {
				set_style(div0, "transform", "rotate(" + (/*frames*/ ctx[0][/*index*/ ctx[49]].angle + 90) + "deg)");
			}

			if (dirty[0] & /*frames, offset*/ 5 && t7_value !== (t7_value = Math.round(/*frames*/ ctx[0][/*index*/ ctx[49]].angle * 100) / 100 + "")) set_data(t7, t7_value);

			if (dirty[0] & /*draggingMovement, offset, draggingMovementStart, draggingMovementEnd*/ 228) {
				toggle_class(td4, "dragged", /*draggingMovement*/ ctx[5] && between(/*index*/ ctx[49], /*draggingMovementStart*/ ctx[6], /*draggingMovementEnd*/ ctx[7]));
			}

			if (dirty[0] & /*$currentFrame, offset*/ 516) {
				toggle_class(tr, "active", /*$currentFrame*/ ctx[9] === /*index*/ ctx[49]);
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

function create_fragment$1(ctx) {
	let div1;
	let div0;
	let button0;
	let t1;
	let button1;
	let t2_value = (/*playing*/ ctx[8] ? "⏹" : "▶") + "";
	let t2;
	let t3;
	let button2;
	let t5;
	let button3;
	let t7;
	let button4;
	let t9;
	let table;
	let tr;
	let t19;
	let mounted;
	let dispose;
	add_render_callback(/*onwindowresize*/ ctx[26]);
	let each_value = ensure_array_like({ length: /*rows*/ ctx[3] });
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	return {
		c() {
			div1 = element("div");
			div0 = element("div");
			button0 = element("button");
			button0.textContent = "←";
			t1 = space();
			button1 = element("button");
			t2 = text(t2_value);
			t3 = space();
			button2 = element("button");
			button2.textContent = "→";
			t5 = space();
			button3 = element("button");
			button3.textContent = "⭳";
			t7 = space();
			button4 = element("button");
			button4.textContent = "⭱";
			t9 = space();
			table = element("table");
			tr = element("tr");
			tr.innerHTML = `<th class="svelte-11sfel">Frame #</th> <th class="svelte-11sfel">Answer</th> <th class="svelte-11sfel">Purchase</th> <th class="svelte-11sfel">Move</th> <th class="svelte-11sfel">Angle</th>`;
			t19 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr(div0, "class", "controls svelte-11sfel");
			attr(tr, "class", "svelte-11sfel");
			attr(table, "class", "svelte-11sfel");
			attr(div1, "class", "UI svelte-11sfel");
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			append(div1, div0);
			append(div0, button0);
			append(div0, t1);
			append(div0, button1);
			append(button1, t2);
			append(div0, t3);
			append(div0, button2);
			append(div0, t5);
			append(div0, button3);
			append(div0, t7);
			append(div0, button4);
			append(div1, t9);
			append(div1, table);
			append(table, tr);
			append(table, t19);

			for (let i = 0; i < each_blocks.length; i += 1) {
				if (each_blocks[i]) {
					each_blocks[i].m(table, null);
				}
			}

			if (!mounted) {
				dispose = [
					listen(window, "pointerup", /*pointerup_handler*/ ctx[24]),
					listen(window, "pointerup", /*pointerup_handler_1*/ ctx[25]),
					listen(window, "keydown", /*onKeydown*/ ctx[17]),
					listen(window, "resize", /*onwindowresize*/ ctx[26]),
					listen(button0, "click", /*click_handler_3*/ ctx[27]),
					listen(button1, "click", /*togglePlaying*/ ctx[18]),
					listen(button2, "click", /*click_handler_4*/ ctx[28]),
					listen(button3, "click", /*click_handler_5*/ ctx[29]),
					listen(button4, "click", /*click_handler_6*/ ctx[30]),
					listen(div1, "wheel", /*onScroll*/ ctx[11])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty[0] & /*playing*/ 256 && t2_value !== (t2_value = (/*playing*/ ctx[8] ? "⏹" : "▶") + "")) set_data(t2, t2_value);

			if (dirty[0] & /*$currentFrame, offset, onAngleMouseover, onMouseover, draggingMovement, draggingMovementStart, draggingMovementEnd, onArrowClick, updateAngle, frames, onClick, toggleBlockingAction, rows*/ 652013) {
				each_value = ensure_array_like({ length: /*rows*/ ctx[3] });
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
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
				detach(div1);
			}

			destroy_each(each_blocks, detaching);
			mounted = false;
			run_all(dispose);
		}
	};
}

function instance$1($$self, $$props, $$invalidate) {
	let rows;
	let $currentFrame;
	component_subscribe($$self, currentFrame, $$value => $$invalidate(9, $currentFrame = $$value));
	let { frames } = $$props;
	let { startPos } = $$props;
	let height;
	let offset = 0;

	function setFrames(newFrames) {
		$$invalidate(0, frames = newFrames);
	}

	let tools = new TASTools(frames, setFrames, startPos);

	function onScroll(e) {
		if (e.deltaY > 0) $$invalidate(2, offset += 1);
		if (e.deltaY < 0) $$invalidate(2, offset -= 1);
		$$invalidate(2, offset = Math.max(0, offset));
	}

	let dragging = false;
	let dragFill;
	let dragKey;
	let dragStart;

	function onClick(index, key) {
		if ($currentFrame > index) tools.goBackToFrame(index);
		dragFill = !frames[index][key];
		$$invalidate(0, frames[index][key] = dragFill, frames);
		dragStart = index;
		dragKey = key;
		$$invalidate(4, dragging = true);
	}

	function onMouseover(index) {
		if (!dragging) return;
		if ($currentFrame > index) tools.goBackToFrame(index);
		let delta = dragStart < index ? 1 : -1;

		for (let i = dragStart; i !== index + delta; i += delta) {
			$$invalidate(0, frames[i][dragKey] = dragFill, frames);
		}
	}

	let draggingMovement = false;
	let draggingMovementStart;
	let draggingMovementAngle;
	let draggingMovementEnd;

	function onArrowClick(index) {
		$$invalidate(5, draggingMovement = true);
		$$invalidate(6, draggingMovementStart = index);
		draggingMovementAngle = frames[index].angle;
		$$invalidate(7, draggingMovementEnd = index);
	}

	function onAngleMouseover(index) {
		if (!draggingMovement) return;
		if ($currentFrame > index) tools.goBackToFrame(index);
		$$invalidate(7, draggingMovementEnd = index);
		let delta = draggingMovementStart < index ? 1 : -1;

		for (let i = draggingMovementStart; i !== index + delta; i += delta) {
			$$invalidate(0, frames[i].angle = draggingMovementAngle, frames);
		}
	}

	let pickingAngle = false;

	function updateAngle(index) {
		pickingAngle = true;
		if ($currentFrame > index) tools.goBackToFrame(index);

		showAnglePicker(frames[index].angle).then(angle => {
			pickingAngle = false;
			$$invalidate(0, frames[index].angle = angle, frames);
		});
	}

	let playing = false;

	function onKeydown(e) {
		if (playing || pickingAngle) return;

		if (e.key === "ArrowRight") {
			if (e.shiftKey) for (let i = 0; i < 5; i++) tools.advanceFrame(); else tools.advanceFrame();
		} else if (e.key === "ArrowLeft") {
			if (e.shiftKey) tools.goBackToFrame(Math.max(0, $currentFrame - 5)); else if ($currentFrame >= 1) tools.backFrame();
		}
	}

	function keepActiveVisible() {
		if ($currentFrame - 2 < offset) $$invalidate(2, offset = Math.max(0, $currentFrame - 2));
		if ($currentFrame + 3 > offset + rows) $$invalidate(2, offset = $currentFrame - rows + 3);
	}

	currentFrame.subscribe(keepActiveVisible);

	function togglePlaying() {
		if (pickingAngle) return;
		$$invalidate(8, playing = !playing);
		if (playing) tools.startPlayback(); else tools.stopPlayback();
	}

	function toggleBlockingAction(index, key) {
		if ($currentFrame > index) tools.goBackToFrame(index);
		$$invalidate(0, frames[index][key] = !frames[index][key], frames);
		if (key === "answer") $$invalidate(0, frames[index].moving = false, frames);
		if (key === "answer") $$invalidate(0, frames[index].purchase = false, frames); else $$invalidate(0, frames[index].answer = false, frames);

		if (frames[index + 1]) {
			if (key === "answer") $$invalidate(0, frames[index + 1].moving = false, frames);
			$$invalidate(0, frames[index + 1].answer = false, frames);
			$$invalidate(0, frames[index + 1].purchase = false, frames);
		}

		if (frames[index + 2]) {
			$$invalidate(0, frames[index + 2].answer = false, frames);
			$$invalidate(0, frames[index + 2].purchase = false, frames);
		}
	}

	function click_handler_2(event) {
		bubble.call(this, $$self, event);
	}

	function click_handler_1(event) {
		bubble.call(this, $$self, event);
	}

	function click_handler(event) {
		bubble.call(this, $$self, event);
	}

	const pointerup_handler = () => $$invalidate(4, dragging = false);
	const pointerup_handler_1 = () => $$invalidate(5, draggingMovement = false);

	function onwindowresize() {
		$$invalidate(1, height = window.innerHeight);
	}

	const click_handler_3 = () => tools.backFrame();
	const click_handler_4 = () => tools.advanceFrame();
	const click_handler_5 = () => tools.download();
	const click_handler_6 = () => tools.load();

	function input0_change_handler(index) {
		frames[index].answer = this.checked;
		((($$invalidate(0, frames), $$invalidate(2, offset)), $$invalidate(3, rows)), $$invalidate(1, height));
	}

	const mousedown_handler = (answerDisabled, index) => answerDisabled || toggleBlockingAction(index, "answer");

	function input1_change_handler(index) {
		frames[index].purchase = this.checked;
		((($$invalidate(0, frames), $$invalidate(2, offset)), $$invalidate(3, rows)), $$invalidate(1, height));
	}

	const mousedown_handler_1 = (purchaseDisabled, index) => purchaseDisabled || toggleBlockingAction(index, "purchase");

	function input2_change_handler(index) {
		frames[index].moving = this.checked;
		((($$invalidate(0, frames), $$invalidate(2, offset)), $$invalidate(3, rows)), $$invalidate(1, height));
	}

	const mousedown_handler_2 = (moveDisabled, index) => moveDisabled || onClick(index, 'moving');
	const pointerdown_handler = index => updateAngle(index);
	const pointerdown_handler_1 = index => onArrowClick(index);
	const pointerover_handler = index => onAngleMouseover(index);
	const pointerover_handler_1 = index => onMouseover(index);

	$$self.$$set = $$props => {
		if ('frames' in $$props) $$invalidate(0, frames = $$props.frames);
		if ('startPos' in $$props) $$invalidate(20, startPos = $$props.startPos);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty[0] & /*height*/ 2) {
			$$invalidate(3, rows = Math.floor(height / 26) - 1);
		}

		if ($$self.$$.dirty[0] & /*offset, rows, frames*/ 13) {
			for (let i = offset; i < offset + rows; i++) {
				if (!frames[i]) $$invalidate(0, frames[i] = { ...blankFrame }, frames);
			}
		}
	};

	return [
		frames,
		height,
		offset,
		rows,
		dragging,
		draggingMovement,
		draggingMovementStart,
		draggingMovementEnd,
		playing,
		$currentFrame,
		tools,
		onScroll,
		onClick,
		onMouseover,
		onArrowClick,
		onAngleMouseover,
		updateAngle,
		onKeydown,
		togglePlaying,
		toggleBlockingAction,
		startPos,
		click_handler_2,
		click_handler_1,
		click_handler,
		pointerup_handler,
		pointerup_handler_1,
		onwindowresize,
		click_handler_3,
		click_handler_4,
		click_handler_5,
		click_handler_6,
		input0_change_handler,
		mousedown_handler,
		input1_change_handler,
		mousedown_handler_1,
		input2_change_handler,
		mousedown_handler_2,
		pointerdown_handler,
		pointerdown_handler_1,
		pointerover_handler,
		pointerover_handler_1
	];
}

class UI extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$1, create_fragment$1, safe_not_equal, { frames: 0, startPos: 20 }, add_css$1, [-1, -1]);
	}
}

/* src\ui\Start.svelte generated by Svelte v4.2.19 */

function add_css(target) {
	append_styles(target, "svelte-507k2z", "div.svelte-507k2z{position:absolute;top:0;left:0;z-index:999999;display:flex;flex-direction:column;gap:10px;padding:10px}button.svelte-507k2z{padding:5px 20px;border-radius:100px;background-color:rgba(0,0,0,0.5);color:white;border:1px solid black;transition:transform 0.2s ease}button.svelte-507k2z:hover{transform:scale(1.05)}button.svelte-507k2z:active{transform:scale(0.95)}");
}

// (38:0) {:else}
function create_else_block(ctx) {
	let div;
	let t0;
	let button0;
	let t2;
	let button1;
	let mounted;
	let dispose;
	let if_block = /*save*/ ctx[3] && create_if_block_1(ctx);

	return {
		c() {
			div = element("div");
			if (if_block) if_block.c();
			t0 = space();
			button0 = element("button");
			button0.textContent = "New TAS at current position";
			t2 = space();
			button1 = element("button");
			button1.textContent = "Load TAS from file";
			attr(button0, "class", "svelte-507k2z");
			attr(button1, "class", "svelte-507k2z");
			attr(div, "class", "svelte-507k2z");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			if (if_block) if_block.m(div, null);
			append(div, t0);
			append(div, button0);
			append(div, t2);
			append(div, button1);

			if (!mounted) {
				dispose = [
					listen(button0, "click", /*newTAS*/ ctx[5]),
					listen(button1, "click", /*loadTAS*/ ctx[6])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (/*save*/ ctx[3]) if_block.p(ctx, dirty);
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) {
				detach(div);
			}

			if (if_block) if_block.d();
			mounted = false;
			run_all(dispose);
		}
	};
}

// (36:0) {#if begun}
function create_if_block(ctx) {
	let ui;
	let current;

	ui = new UI({
			props: {
				frames: /*frames*/ ctx[1],
				startPos: /*startPos*/ ctx[2]
			}
		});

	return {
		c() {
			create_component(ui.$$.fragment);
		},
		m(target, anchor) {
			mount_component(ui, target, anchor);
			current = true;
		},
		p(ctx, dirty) {
			const ui_changes = {};
			if (dirty & /*frames*/ 2) ui_changes.frames = /*frames*/ ctx[1];
			if (dirty & /*startPos*/ 4) ui_changes.startPos = /*startPos*/ ctx[2];
			ui.$set(ui_changes);
		},
		i(local) {
			if (current) return;
			transition_in(ui.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(ui.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			destroy_component(ui, detaching);
		}
	};
}

// (40:8) {#if save}
function create_if_block_1(ctx) {
	let button;
	let mounted;
	let dispose;

	return {
		c() {
			button = element("button");
			button.textContent = "Continue TAS";
			attr(button, "class", "svelte-507k2z");
		},
		m(target, anchor) {
			insert(target, button, anchor);

			if (!mounted) {
				dispose = listen(button, "click", /*continueTAS*/ ctx[4]);
				mounted = true;
			}
		},
		p: noop,
		d(detaching) {
			if (detaching) {
				detach(button);
			}

			mounted = false;
			dispose();
		}
	};
}

function create_fragment(ctx) {
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	const if_block_creators = [create_if_block, create_else_block];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*begun*/ ctx[0]) return 0;
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
		p(ctx, [dirty]) {
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

function instance($$self, $$props, $$invalidate) {
	let begun = false;
	let save = GL.storage.getValue("2dMovementTAS", "save");
	let frames = [];
	let startPos;

	function continueTAS() {
		$$invalidate(1, frames = save.frames);
		$$invalidate(2, startPos = save.startPos);
		$$invalidate(0, begun = true);
	}

	function newTAS() {
		if (save) {
			let conf = confirm("Are you sure you want to start a new TAS? Your current TAS will be lost.");
			if (!conf) return;
		}

		$$invalidate(1, frames = []);
		$$invalidate(0, begun = true);
	}

	async function loadTAS() {
		if (save) {
			let conf = confirm("Are you sure you want to load a new TAS? Your current TAS will be lost.");
			if (!conf) return;
		}

		try {
			let data = await uploadFile();
			let json = JSON.parse(data);
			$$invalidate(1, frames = json.frames);
			$$invalidate(2, startPos = json.startPos);
			$$invalidate(0, begun = true);
		} catch {
			
		}
	}

	return [begun, frames, startPos, save, continueTAS, newTAS, loadTAS];
}

class Start extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, {}, add_css);
	}
}

// @ts-ignore
let ui;
GL.addEventListener("loadEnd", () => {
    // @ts-ignore vscode's going wacky
    ui = new Start({
        target: document.body
    });
});
function onStop() {
    // @ts-ignore vscode, again
    ui?.$destroy();
    GL.patcher.unpatchAll("2dMovementTAS");
    GL.parcel.stopIntercepts("2dMovementTAS");
}

export { onStop };
