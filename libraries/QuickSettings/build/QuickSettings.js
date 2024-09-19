/**
 * @name QuickSettings
 * @description Easily make simple settings menus
 * @author TheLazySquid
 * @version 1.0.0
 * @isLibrary true
 */


// node_modules/svelte/src/runtime/internal/utils.js
function noop() {
}
function assign(tar, src) {
  for (const k in src) tar[k] = src[k];
  return (
    /** @type {T & S} */
    tar
  );
}
function run(fn) {
  return fn();
}
function blank_object() {
  return /* @__PURE__ */ Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || a && typeof a === "object" || typeof a === "function";
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
function create_slot(definition, ctx, $$scope, fn) {
  if (definition) {
    const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
    return definition[0](slot_ctx);
  }
}
function get_slot_context(definition, ctx, $$scope, fn) {
  return definition[1] && fn ? assign($$scope.ctx.slice(), definition[1](fn(ctx))) : $$scope.ctx;
}
function get_slot_changes(definition, $$scope, dirty, fn) {
  if (definition[2] && fn) {
    const lets = definition[2](fn(dirty));
    if ($$scope.dirty === void 0) {
      return lets;
    }
    if (typeof lets === "object") {
      const merged = [];
      const len = Math.max($$scope.dirty.length, lets.length);
      for (let i = 0; i < len; i += 1) {
        merged[i] = $$scope.dirty[i] | lets[i];
      }
      return merged;
    }
    return $$scope.dirty | lets;
  }
  return $$scope.dirty;
}
function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
  if (slot_changes) {
    const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
    slot.p(slot_context, slot_changes);
  }
}
function get_all_dirty_from_scope($$scope) {
  if ($$scope.ctx.length > 32) {
    const dirty = [];
    const length = $$scope.ctx.length / 32;
    for (let i = 0; i < length; i++) {
      dirty[i] = -1;
    }
    return dirty;
  }
  return -1;
}
function exclude_internal_props(props) {
  const result = {};
  for (const k in props) if (k[0] !== "$") result[k] = props[k];
  return result;
}
function compute_rest_props(props, keys) {
  const rest = {};
  keys = new Set(keys);
  for (const k in props) if (!keys.has(k) && k[0] !== "$") rest[k] = props[k];
  return rest;
}
var contenteditable_truthy_values = ["", true, 1, "true", "contenteditable"];

// node_modules/svelte/src/runtime/internal/globals.js
var globals = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : (
  // @ts-ignore Node typings have this
  global
);

// node_modules/svelte/src/runtime/internal/ResizeObserverSingleton.js
var ResizeObserverSingleton = class _ResizeObserverSingleton {
  /**
   * @private
   * @readonly
   * @type {WeakMap<Element, import('./private.js').Listener>}
   */
  _listeners = "WeakMap" in globals ? /* @__PURE__ */ new WeakMap() : void 0;
  /**
   * @private
   * @type {ResizeObserver}
   */
  _observer = void 0;
  /** @type {ResizeObserverOptions} */
  options;
  /** @param {ResizeObserverOptions} options */
  constructor(options) {
    this.options = options;
  }
  /**
   * @param {Element} element
   * @param {import('./private.js').Listener} listener
   * @returns {() => void}
   */
  observe(element2, listener) {
    this._listeners.set(element2, listener);
    this._getObserver().observe(element2, this.options);
    return () => {
      this._listeners.delete(element2);
      this._observer.unobserve(element2);
    };
  }
  /**
   * @private
   */
  _getObserver() {
    return this._observer ?? (this._observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        _ResizeObserverSingleton.entries.set(entry.target, entry);
        this._listeners.get(entry.target)?.(entry);
      }
    }));
  }
};
ResizeObserverSingleton.entries = "WeakMap" in globals ? /* @__PURE__ */ new WeakMap() : void 0;

// node_modules/svelte/src/runtime/internal/dom.js
var is_hydrating = false;
function start_hydrating() {
  is_hydrating = true;
}
function end_hydrating() {
  is_hydrating = false;
}
function append(target, node) {
  target.appendChild(node);
}
function append_styles(target, style_sheet_id, styles) {
  const append_styles_to = get_root_for_style(target);
  if (!append_styles_to.getElementById(style_sheet_id)) {
    const style = element("style");
    style.id = style_sheet_id;
    style.textContent = styles;
    append_stylesheet(append_styles_to, style);
  }
}
function get_root_for_style(node) {
  if (!node) return document;
  const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
  if (root && /** @type {ShadowRoot} */
  root.host) {
    return (
      /** @type {ShadowRoot} */
      root
    );
  }
  return node.ownerDocument;
}
function append_stylesheet(node, style) {
  append(
    /** @type {Document} */
    node.head || node,
    style
  );
  return style.sheet;
}
function insert(target, node, anchor) {
  target.insertBefore(node, anchor || null);
}
function detach(node) {
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
}
function destroy_each(iterations, detaching) {
  for (let i = 0; i < iterations.length; i += 1) {
    if (iterations[i]) iterations[i].d(detaching);
  }
}
function element(name) {
  return document.createElement(name);
}
function text(data) {
  return document.createTextNode(data);
}
function space() {
  return text(" ");
}
function empty() {
  return text("");
}
function listen(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
  if (value == null) node.removeAttribute(attribute);
  else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
}
var always_set_through_set_attribute = ["width", "height"];
function set_attributes(node, attributes) {
  const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
  for (const key in attributes) {
    if (attributes[key] == null) {
      node.removeAttribute(key);
    } else if (key === "style") {
      node.style.cssText = attributes[key];
    } else if (key === "__value") {
      node.value = node[key] = attributes[key];
    } else if (descriptors[key] && descriptors[key].set && always_set_through_set_attribute.indexOf(key) === -1) {
      node[key] = attributes[key];
    } else {
      attr(node, key, attributes[key]);
    }
  }
}
function to_number(value) {
  return value === "" ? null : +value;
}
function children(element2) {
  return Array.from(element2.childNodes);
}
function set_data(text2, data) {
  data = "" + data;
  if (text2.data === data) return;
  text2.data = /** @type {string} */
  data;
}
function set_data_contenteditable(text2, data) {
  data = "" + data;
  if (text2.wholeText === data) return;
  text2.data = /** @type {string} */
  data;
}
function set_data_maybe_contenteditable(text2, data, attr_value) {
  if (~contenteditable_truthy_values.indexOf(attr_value)) {
    set_data_contenteditable(text2, data);
  } else {
    set_data(text2, data);
  }
}
function set_input_value(input, value) {
  input.value = value == null ? "" : value;
}
function set_style(node, key, value, important) {
  if (value == null) {
    node.style.removeProperty(key);
  } else {
    node.style.setProperty(key, value, important ? "important" : "");
  }
}
function toggle_class(element2, name, toggle) {
  element2.classList.toggle(name, !!toggle);
}
function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
  return new CustomEvent(type, { detail, bubbles, cancelable });
}
function get_custom_elements_slots(element2) {
  const result = {};
  element2.childNodes.forEach(
    /** @param {Element} node */
    (node) => {
      result[node.slot || "default"] = true;
    }
  );
  return result;
}

// node_modules/svelte/src/runtime/internal/lifecycle.js
var current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component) throw new Error("Function called outside component initialization");
  return current_component;
}
function createEventDispatcher() {
  const component = get_current_component();
  return (type, detail, { cancelable = false } = {}) => {
    const callbacks = component.$$.callbacks[type];
    if (callbacks) {
      const event = custom_event(
        /** @type {string} */
        type,
        detail,
        { cancelable }
      );
      callbacks.slice().forEach((fn) => {
        fn.call(component, event);
      });
      return !event.defaultPrevented;
    }
    return true;
  };
}
function bubble(component, event) {
  const callbacks = component.$$.callbacks[event.type];
  if (callbacks) {
    callbacks.slice().forEach((fn) => fn.call(this, event));
  }
}

// node_modules/svelte/src/runtime/internal/scheduler.js
var dirty_components = [];
var binding_callbacks = [];
var render_callbacks = [];
var flush_callbacks = [];
var resolved_promise = /* @__PURE__ */ Promise.resolve();
var update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
function add_flush_callback(fn) {
  flush_callbacks.push(fn);
}
var seen_callbacks = /* @__PURE__ */ new Set();
var flushidx = 0;
function flush() {
  if (flushidx !== 0) {
    return;
  }
  const saved_component = current_component;
  do {
    try {
      while (flushidx < dirty_components.length) {
        const component = dirty_components[flushidx];
        flushidx++;
        set_current_component(component);
        update(component.$$);
      }
    } catch (e) {
      dirty_components.length = 0;
      flushidx = 0;
      throw e;
    }
    set_current_component(null);
    dirty_components.length = 0;
    flushidx = 0;
    while (binding_callbacks.length) binding_callbacks.pop()();
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
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
function flush_render_callbacks(fns) {
  const filtered = [];
  const targets = [];
  render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
  targets.forEach((c) => c());
  render_callbacks = filtered;
}

// node_modules/svelte/src/runtime/internal/transitions.js
var outroing = /* @__PURE__ */ new Set();
var outros;
function group_outros() {
  outros = {
    r: 0,
    c: [],
    p: outros
    // parent group
  };
}
function check_outros() {
  if (!outros.r) {
    run_all(outros.c);
  }
  outros = outros.p;
}
function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}
function transition_out(block, local, detach2, callback) {
  if (block && block.o) {
    if (outroing.has(block)) return;
    outroing.add(block);
    outros.c.push(() => {
      outroing.delete(block);
      if (callback) {
        if (detach2) block.d(1);
        callback();
      }
    });
    block.o(local);
  } else if (callback) {
    callback();
  }
}

// node_modules/svelte/src/runtime/internal/each.js
function ensure_array_like(array_like_or_iterator) {
  return array_like_or_iterator?.length !== void 0 ? array_like_or_iterator : Array.from(array_like_or_iterator);
}

// node_modules/svelte/src/runtime/internal/spread.js
function get_spread_update(levels, updates) {
  const update2 = {};
  const to_null_out = {};
  const accounted_for = { $$scope: 1 };
  let i = levels.length;
  while (i--) {
    const o = levels[i];
    const n = updates[i];
    if (n) {
      for (const key in o) {
        if (!(key in n)) to_null_out[key] = 1;
      }
      for (const key in n) {
        if (!accounted_for[key]) {
          update2[key] = n[key];
          accounted_for[key] = 1;
        }
      }
      levels[i] = n;
    } else {
      for (const key in o) {
        accounted_for[key] = 1;
      }
    }
  }
  for (const key in to_null_out) {
    if (!(key in update2)) update2[key] = void 0;
  }
  return update2;
}

// node_modules/svelte/src/shared/boolean_attributes.js
var _boolean_attributes = (
  /** @type {const} */
  [
    "allowfullscreen",
    "allowpaymentrequest",
    "async",
    "autofocus",
    "autoplay",
    "checked",
    "controls",
    "default",
    "defer",
    "disabled",
    "formnovalidate",
    "hidden",
    "inert",
    "ismap",
    "loop",
    "multiple",
    "muted",
    "nomodule",
    "novalidate",
    "open",
    "playsinline",
    "readonly",
    "required",
    "reversed",
    "selected"
  ]
);
var boolean_attributes = /* @__PURE__ */ new Set([..._boolean_attributes]);

// node_modules/svelte/src/runtime/internal/Component.js
function bind(component, name, callback) {
  const index = component.$$.props[name];
  if (index !== void 0) {
    component.$$.bound[index] = callback;
    callback(component.$$.ctx[index]);
  }
}
function create_component(block) {
  block && block.c();
}
function mount_component(component, target, anchor) {
  const { fragment, after_update } = component.$$;
  fragment && fragment.m(target, anchor);
  add_render_callback(() => {
    const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
    if (component.$$.on_destroy) {
      component.$$.on_destroy.push(...new_on_destroy);
    } else {
      run_all(new_on_destroy);
    }
    component.$$.on_mount = [];
  });
  after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    flush_render_callbacks($$.after_update);
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
function make_dirty(component, i) {
  if (component.$$.dirty[0] === -1) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty.fill(0);
  }
  component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
}
function init(component, options, instance4, create_fragment4, not_equal, props, append_styles2 = null, dirty = [-1]) {
  const parent_component = current_component;
  set_current_component(component);
  const $$ = component.$$ = {
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
  };
  append_styles2 && append_styles2($$.root);
  let ready = false;
  $$.ctx = instance4 ? instance4(component, options.props || {}, (i, ret, ...rest) => {
    const value = rest.length ? rest[0] : ret;
    if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
      if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value);
      if (ready) make_dirty(component, i);
    }
    return ret;
  }) : [];
  $$.update();
  ready = true;
  run_all($$.before_update);
  $$.fragment = create_fragment4 ? create_fragment4($$.ctx) : false;
  if (options.target) {
    if (options.hydrate) {
      start_hydrating();
      const nodes = children(options.target);
      $$.fragment && $$.fragment.l(nodes);
      nodes.forEach(detach);
    } else {
      $$.fragment && $$.fragment.c();
    }
    if (options.intro) transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor);
    end_hydrating();
    flush();
  }
  set_current_component(parent_component);
}
var SvelteElement;
if (typeof HTMLElement === "function") {
  SvelteElement = class extends HTMLElement {
    /** The Svelte component constructor */
    $$ctor;
    /** Slots */
    $$s;
    /** The Svelte component instance */
    $$c;
    /** Whether or not the custom element is connected */
    $$cn = false;
    /** Component props data */
    $$d = {};
    /** `true` if currently in the process of reflecting component props back to attributes */
    $$r = false;
    /** @type {Record<string, CustomElementPropDefinition>} Props definition (name, reflected, type etc) */
    $$p_d = {};
    /** @type {Record<string, Function[]>} Event listeners */
    $$l = {};
    /** @type {Map<Function, Function>} Event listener unsubscribe functions */
    $$l_u = /* @__PURE__ */ new Map();
    constructor($$componentCtor, $$slots, use_shadow_dom) {
      super();
      this.$$ctor = $$componentCtor;
      this.$$s = $$slots;
      if (use_shadow_dom) {
        this.attachShadow({ mode: "open" });
      }
    }
    addEventListener(type, listener, options) {
      this.$$l[type] = this.$$l[type] || [];
      this.$$l[type].push(listener);
      if (this.$$c) {
        const unsub = this.$$c.$on(type, listener);
        this.$$l_u.set(listener, unsub);
      }
      super.addEventListener(type, listener, options);
    }
    removeEventListener(type, listener, options) {
      super.removeEventListener(type, listener, options);
      if (this.$$c) {
        const unsub = this.$$l_u.get(listener);
        if (unsub) {
          unsub();
          this.$$l_u.delete(listener);
        }
      }
    }
    async connectedCallback() {
      this.$$cn = true;
      if (!this.$$c) {
        let create_slot2 = function(name) {
          return () => {
            let node;
            const obj = {
              c: function create() {
                node = element("slot");
                if (name !== "default") {
                  attr(node, "name", name);
                }
              },
              /**
               * @param {HTMLElement} target
               * @param {HTMLElement} [anchor]
               */
              m: function mount(target, anchor) {
                insert(target, node, anchor);
              },
              d: function destroy(detaching) {
                if (detaching) {
                  detach(node);
                }
              }
            };
            return obj;
          };
        };
        await Promise.resolve();
        if (!this.$$cn || this.$$c) {
          return;
        }
        const $$slots = {};
        const existing_slots = get_custom_elements_slots(this);
        for (const name of this.$$s) {
          if (name in existing_slots) {
            $$slots[name] = [create_slot2(name)];
          }
        }
        for (const attribute of this.attributes) {
          const name = this.$$g_p(attribute.name);
          if (!(name in this.$$d)) {
            this.$$d[name] = get_custom_element_value(name, attribute.value, this.$$p_d, "toProp");
          }
        }
        for (const key in this.$$p_d) {
          if (!(key in this.$$d) && this[key] !== void 0) {
            this.$$d[key] = this[key];
            delete this[key];
          }
        }
        this.$$c = new this.$$ctor({
          target: this.shadowRoot || this,
          props: {
            ...this.$$d,
            $$slots,
            $$scope: {
              ctx: []
            }
          }
        });
        const reflect_attributes = () => {
          this.$$r = true;
          for (const key in this.$$p_d) {
            this.$$d[key] = this.$$c.$$.ctx[this.$$c.$$.props[key]];
            if (this.$$p_d[key].reflect) {
              const attribute_value = get_custom_element_value(
                key,
                this.$$d[key],
                this.$$p_d,
                "toAttribute"
              );
              if (attribute_value == null) {
                this.removeAttribute(this.$$p_d[key].attribute || key);
              } else {
                this.setAttribute(this.$$p_d[key].attribute || key, attribute_value);
              }
            }
          }
          this.$$r = false;
        };
        this.$$c.$$.after_update.push(reflect_attributes);
        reflect_attributes();
        for (const type in this.$$l) {
          for (const listener of this.$$l[type]) {
            const unsub = this.$$c.$on(type, listener);
            this.$$l_u.set(listener, unsub);
          }
        }
        this.$$l = {};
      }
    }
    // We don't need this when working within Svelte code, but for compatibility of people using this outside of Svelte
    // and setting attributes through setAttribute etc, this is helpful
    attributeChangedCallback(attr2, _oldValue, newValue) {
      if (this.$$r) return;
      attr2 = this.$$g_p(attr2);
      this.$$d[attr2] = get_custom_element_value(attr2, newValue, this.$$p_d, "toProp");
      this.$$c?.$set({ [attr2]: this.$$d[attr2] });
    }
    disconnectedCallback() {
      this.$$cn = false;
      Promise.resolve().then(() => {
        if (!this.$$cn && this.$$c) {
          this.$$c.$destroy();
          this.$$c = void 0;
        }
      });
    }
    $$g_p(attribute_name) {
      return Object.keys(this.$$p_d).find(
        (key) => this.$$p_d[key].attribute === attribute_name || !this.$$p_d[key].attribute && key.toLowerCase() === attribute_name
      ) || attribute_name;
    }
  };
}
function get_custom_element_value(prop, value, props_definition, transform) {
  const type = props_definition[prop]?.type;
  value = type === "Boolean" && typeof value !== "boolean" ? value != null : value;
  if (!transform || !props_definition[prop]) {
    return value;
  } else if (transform === "toAttribute") {
    switch (type) {
      case "Object":
      case "Array":
        return value == null ? null : JSON.stringify(value);
      case "Boolean":
        return value ? "" : null;
      case "Number":
        return value == null ? null : value;
      default:
        return value;
    }
  } else {
    switch (type) {
      case "Object":
      case "Array":
        return value && JSON.parse(value);
      case "Boolean":
        return value;
      // conversion already handled above
      case "Number":
        return value != null ? +value : value;
      default:
        return value;
    }
  }
}
var SvelteComponent = class {
  /**
   * ### PRIVATE API
   *
   * Do not use, may change at any time
   *
   * @type {any}
   */
  $$ = void 0;
  /**
   * ### PRIVATE API
   *
   * Do not use, may change at any time
   *
   * @type {any}
   */
  $$set = void 0;
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
};

// node_modules/svelte/src/shared/version.js
var PUBLIC_VERSION = "4";

// node_modules/svelte/src/runtime/internal/disclose-version/index.js
if (typeof window !== "undefined")
  (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(PUBLIC_VERSION);

// node_modules/svelte-toggle/src/ToggleCore.svelte
var get_default_slot_changes = (dirty) => ({
  label: dirty & /*label*/
  2,
  button: dirty & /*button*/
  1
});
var get_default_slot_context = (ctx) => ({
  label: (
    /*label*/
    ctx[1]
  ),
  button: (
    /*button*/
    ctx[0]
  )
});
function create_fragment(ctx) {
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[6].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[5],
    get_default_slot_context
  );
  return {
    c() {
      if (default_slot) default_slot.c();
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, [dirty]) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope, label, button*/
        35)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[5],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[5]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[5],
              dirty,
              get_default_slot_changes
            ),
            get_default_slot_context
          );
        }
      }
    },
    i(local) {
      if (current) return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot) default_slot.d(detaching);
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  let label;
  let button;
  const omit_props_names = ["id", "toggled", "disabled"];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let { $$slots: slots = {}, $$scope } = $$props;
  let { id = "toggle" + Math.random().toString(36) } = $$props;
  let { toggled = true } = $$props;
  let { disabled = false } = $$props;
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(7, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("id" in $$new_props) $$invalidate(2, id = $$new_props.id);
    if ("toggled" in $$new_props) $$invalidate(3, toggled = $$new_props.toggled);
    if ("disabled" in $$new_props) $$invalidate(4, disabled = $$new_props.disabled);
    if ("$$scope" in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*id*/
    4) {
      $: $$invalidate(1, label = { for: id });
    }
    $: $$invalidate(0, button = {
      ...$$restProps,
      id,
      disabled,
      "aria-checked": toggled,
      type: "button",
      role: "switch"
    });
  };
  return [button, label, id, toggled, disabled, $$scope, slots];
}
var ToggleCore = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, { id: 2, toggled: 3, disabled: 4 });
  }
};
var ToggleCore_default = ToggleCore;

// node_modules/svelte-toggle/src/Toggle.svelte
function add_css(target) {
  append_styles(target, "svelte-1y1be9d", 'label.svelte-1y1be9d{display:block;margin-bottom:0.25rem;font-size:0.75rem}.hideLabel.svelte-1y1be9d{position:absolute;height:1px;width:1px;overflow:hidden;clip:rect(1px 1px 1px 1px);clip:rect(1px, 1px, 1px, 1px);white-space:nowrap}button.svelte-1y1be9d{position:relative;padding:0 0.25rem;border:0;border-radius:1rem;height:1.25rem;width:2.5rem;font:inherit;color:inherit;line-height:inherit}button.svelte-1y1be9d:not([disabled]){cursor:pointer}button[disabled].svelte-1y1be9d{cursor:not-allowed;opacity:0.6}button.svelte-1y1be9d:before{position:absolute;content:"";top:0;bottom:0;left:0.125rem;margin:auto;height:1rem;width:1rem;text-align:center;border-radius:50%;background-color:currentColor;transition:transform 150ms ease-out}button[aria-checked="true"].svelte-1y1be9d:before{transform:translateX(1.25rem)}button.small.svelte-1y1be9d{height:1rem;width:1.75rem}button.small.svelte-1y1be9d:before{height:0.75rem;width:0.75rem}button.small[aria-checked="true"].svelte-1y1be9d:before{transform:translateX(0.75rem)}div.svelte-1y1be9d{display:flex;align-items:center}span.svelte-1y1be9d{margin-left:0.5rem}');
}
var get_default_slot_changes2 = (dirty) => ({ toggled: dirty & /*toggled*/
1 });
var get_default_slot_context2 = (ctx) => ({ toggled: (
  /*toggled*/
  ctx[0]
) });
function create_if_block(ctx) {
  let span;
  let t_value = (
    /*toggled*/
    (ctx[0] ? (
      /*on*/
      ctx[5]
    ) : (
      /*off*/
      ctx[6]
    )) + ""
  );
  let t;
  return {
    c() {
      span = element("span");
      t = text(t_value);
      attr(span, "class", "svelte-1y1be9d");
    },
    m(target, anchor) {
      insert(target, span, anchor);
      append(span, t);
    },
    p(ctx2, dirty) {
      if (dirty & /*toggled, on, off*/
      97 && t_value !== (t_value = /*toggled*/
      (ctx2[0] ? (
        /*on*/
        ctx2[5]
      ) : (
        /*off*/
        ctx2[6]
      )) + "")) set_data(t, t_value);
    },
    d(detaching) {
      if (detaching) {
        detach(span);
      }
    }
  };
}
function fallback_block(ctx) {
  let if_block_anchor;
  let if_block = (
    /*on*/
    ctx[5] && /*off*/
    ctx[6] && create_if_block(ctx)
  );
  return {
    c() {
      if (if_block) if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block) if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
    },
    p(ctx2, dirty) {
      if (
        /*on*/
        ctx2[5] && /*off*/
        ctx2[6]
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
        } else {
          if_block = create_if_block(ctx2);
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
        detach(if_block_anchor);
      }
      if (if_block) if_block.d(detaching);
    }
  };
}
function create_default_slot(ctx) {
  let label_1;
  let t0;
  let t1;
  let div;
  let button;
  let t2;
  let current;
  let mounted;
  let dispose;
  let label_1_levels = [
    /*labelProps*/
    ctx[19]
  ];
  let label_data = {};
  for (let i = 0; i < label_1_levels.length; i += 1) {
    label_data = assign(label_data, label_1_levels[i]);
  }
  let button_levels = [
    /*$$restProps*/
    ctx[10],
    /*button*/
    ctx[20],
    { disabled: (
      /*disabled*/
      ctx[4]
    ) }
  ];
  let button_data = {};
  for (let i = 0; i < button_levels.length; i += 1) {
    button_data = assign(button_data, button_levels[i]);
  }
  const default_slot_template = (
    /*#slots*/
    ctx[11].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[17],
    get_default_slot_context2
  );
  const default_slot_or_fallback = default_slot || fallback_block(ctx);
  return {
    c() {
      label_1 = element("label");
      t0 = text(
        /*label*/
        ctx[1]
      );
      t1 = space();
      div = element("div");
      button = element("button");
      t2 = space();
      if (default_slot_or_fallback) default_slot_or_fallback.c();
      set_attributes(label_1, label_data);
      toggle_class(
        label_1,
        "hideLabel",
        /*hideLabel*/
        ctx[2]
      );
      toggle_class(label_1, "svelte-1y1be9d", true);
      set_attributes(button, button_data);
      toggle_class(
        button,
        "small",
        /*small*/
        ctx[3]
      );
      set_style(
        button,
        "color",
        /*switchColor*/
        ctx[7]
      );
      set_style(
        button,
        "background-color",
        /*toggled*/
        ctx[0] ? (
          /*toggledColor*/
          ctx[8]
        ) : (
          /*untoggledColor*/
          ctx[9]
        )
      );
      toggle_class(button, "svelte-1y1be9d", true);
      attr(div, "class", "svelte-1y1be9d");
    },
    m(target, anchor) {
      insert(target, label_1, anchor);
      append(label_1, t0);
      insert(target, t1, anchor);
      insert(target, div, anchor);
      append(div, button);
      if (button.autofocus) button.focus();
      append(div, t2);
      if (default_slot_or_fallback) {
        default_slot_or_fallback.m(div, null);
      }
      current = true;
      if (!mounted) {
        dispose = [
          listen(
            button,
            "click",
            /*click_handler*/
            ctx[12]
          ),
          listen(
            button,
            "click",
            /*click_handler_1*/
            ctx[15]
          ),
          listen(
            button,
            "focus",
            /*focus_handler*/
            ctx[13]
          ),
          listen(
            button,
            "blur",
            /*blur_handler*/
            ctx[14]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (!current || dirty & /*label*/
      2) set_data_maybe_contenteditable(
        t0,
        /*label*/
        ctx2[1],
        label_data["contenteditable"]
      );
      set_attributes(label_1, label_data = get_spread_update(label_1_levels, [dirty & /*labelProps*/
      524288 && /*labelProps*/
      ctx2[19]]));
      toggle_class(
        label_1,
        "hideLabel",
        /*hideLabel*/
        ctx2[2]
      );
      toggle_class(label_1, "svelte-1y1be9d", true);
      set_attributes(button, button_data = get_spread_update(button_levels, [
        dirty & /*$$restProps*/
        1024 && /*$$restProps*/
        ctx2[10],
        dirty & /*button*/
        1048576 && /*button*/
        ctx2[20],
        (!current || dirty & /*disabled*/
        16) && { disabled: (
          /*disabled*/
          ctx2[4]
        ) }
      ]));
      toggle_class(
        button,
        "small",
        /*small*/
        ctx2[3]
      );
      set_style(
        button,
        "color",
        /*switchColor*/
        ctx2[7]
      );
      set_style(
        button,
        "background-color",
        /*toggled*/
        ctx2[0] ? (
          /*toggledColor*/
          ctx2[8]
        ) : (
          /*untoggledColor*/
          ctx2[9]
        )
      );
      toggle_class(button, "svelte-1y1be9d", true);
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope, toggled*/
        131073)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[17],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[17]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[17],
              dirty,
              get_default_slot_changes2
            ),
            get_default_slot_context2
          );
        }
      } else {
        if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*toggled, on, off*/
        97)) {
          default_slot_or_fallback.p(ctx2, !current ? -1 : dirty);
        }
      }
    },
    i(local) {
      if (current) return;
      transition_in(default_slot_or_fallback, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot_or_fallback, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(label_1);
        detach(t1);
        detach(div);
      }
      if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_fragment2(ctx) {
  let togglecore;
  let updating_toggled;
  let current;
  function togglecore_toggled_binding(value) {
    ctx[16](value);
  }
  let togglecore_props = {
    $$slots: {
      default: [
        create_default_slot,
        ({ label: labelProps, button }) => ({ 19: labelProps, 20: button }),
        ({ label: labelProps, button }) => (labelProps ? 524288 : 0) | (button ? 1048576 : 0)
      ]
    },
    $$scope: { ctx }
  };
  if (
    /*toggled*/
    ctx[0] !== void 0
  ) {
    togglecore_props.toggled = /*toggled*/
    ctx[0];
  }
  togglecore = new ToggleCore_default({ props: togglecore_props });
  binding_callbacks.push(() => bind(togglecore, "toggled", togglecore_toggled_binding));
  return {
    c() {
      create_component(togglecore.$$.fragment);
    },
    m(target, anchor) {
      mount_component(togglecore, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const togglecore_changes = {};
      if (dirty & /*$$scope, toggled, on, off, $$restProps, button, disabled, small, switchColor, toggledColor, untoggledColor, labelProps, hideLabel, label*/
      1705983) {
        togglecore_changes.$$scope = { dirty, ctx: ctx2 };
      }
      if (!updating_toggled && dirty & /*toggled*/
      1) {
        updating_toggled = true;
        togglecore_changes.toggled = /*toggled*/
        ctx2[0];
        add_flush_callback(() => updating_toggled = false);
      }
      togglecore.$set(togglecore_changes);
    },
    i(local) {
      if (current) return;
      transition_in(togglecore.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(togglecore.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(togglecore, detaching);
    }
  };
}
function instance2($$self, $$props, $$invalidate) {
  const omit_props_names = [
    "toggled",
    "label",
    "hideLabel",
    "small",
    "disabled",
    "on",
    "off",
    "switchColor",
    "toggledColor",
    "untoggledColor"
  ];
  let $$restProps = compute_rest_props($$props, omit_props_names);
  let { $$slots: slots = {}, $$scope } = $$props;
  let { toggled = true } = $$props;
  let { label = "Label" } = $$props;
  let { hideLabel = false } = $$props;
  let { small = false } = $$props;
  let { disabled = false } = $$props;
  let { on = void 0 } = $$props;
  let { off = void 0 } = $$props;
  let { switchColor = "#fff" } = $$props;
  let { toggledColor = "#0f62fe" } = $$props;
  let { untoggledColor = "#8d8d8d" } = $$props;
  const dispatch = createEventDispatcher();
  function click_handler(event) {
    bubble.call(this, $$self, event);
  }
  function focus_handler(event) {
    bubble.call(this, $$self, event);
  }
  function blur_handler(event) {
    bubble.call(this, $$self, event);
  }
  const click_handler_1 = () => $$invalidate(0, toggled = !toggled);
  function togglecore_toggled_binding(value) {
    toggled = value;
    $$invalidate(0, toggled);
  }
  $$self.$$set = ($$new_props) => {
    $$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    $$invalidate(10, $$restProps = compute_rest_props($$props, omit_props_names));
    if ("toggled" in $$new_props) $$invalidate(0, toggled = $$new_props.toggled);
    if ("label" in $$new_props) $$invalidate(1, label = $$new_props.label);
    if ("hideLabel" in $$new_props) $$invalidate(2, hideLabel = $$new_props.hideLabel);
    if ("small" in $$new_props) $$invalidate(3, small = $$new_props.small);
    if ("disabled" in $$new_props) $$invalidate(4, disabled = $$new_props.disabled);
    if ("on" in $$new_props) $$invalidate(5, on = $$new_props.on);
    if ("off" in $$new_props) $$invalidate(6, off = $$new_props.off);
    if ("switchColor" in $$new_props) $$invalidate(7, switchColor = $$new_props.switchColor);
    if ("toggledColor" in $$new_props) $$invalidate(8, toggledColor = $$new_props.toggledColor);
    if ("untoggledColor" in $$new_props) $$invalidate(9, untoggledColor = $$new_props.untoggledColor);
    if ("$$scope" in $$new_props) $$invalidate(17, $$scope = $$new_props.$$scope);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*toggled*/
    1) {
      $: dispatch("toggle", toggled);
    }
  };
  return [
    toggled,
    label,
    hideLabel,
    small,
    disabled,
    on,
    off,
    switchColor,
    toggledColor,
    untoggledColor,
    $$restProps,
    slots,
    click_handler,
    focus_handler,
    blur_handler,
    click_handler_1,
    togglecore_toggled_binding,
    $$scope
  ];
}
var Toggle = class extends SvelteComponent {
  constructor(options) {
    super();
    init(
      this,
      options,
      instance2,
      create_fragment2,
      safe_not_equal,
      {
        toggled: 0,
        label: 1,
        hideLabel: 2,
        small: 3,
        disabled: 4,
        on: 5,
        off: 6,
        switchColor: 7,
        toggledColor: 8,
        untoggledColor: 9
      },
      add_css
    );
  }
};
var Toggle_default = Toggle;

// src/Settings.svelte
function add_css2(target) {
  append_styles(target, "svelte-18vwb4f", "h2.svelte-18vwb4f{font-weight:bold;border-bottom:2px solid darkgray;margin-bottom:0}.settings.svelte-18vwb4f{display:flex;flex-direction:column;gap:5px}.text.svelte-18vwb4f{flex-grow:1}.setting.svelte-18vwb4f{display:flex;align-items:center;gap:10px;font-size:17px;text-wrap:nowrap;padding-bottom:2px;padding-right:3px}.setting.svelte-18vwb4f:not(:last-child){border-bottom:1px solid darkgray}input.svelte-18vwb4f{height:25px;border-radius:5px;width:140px}");
}
function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[9] = list[i];
  child_ctx[10] = list;
  child_ctx[11] = i;
  return child_ctx;
}
function create_if_block_3(ctx) {
  let div1;
  let div0;
  let t0_value = (
    /*el*/
    ctx[9].title + ""
  );
  let t0;
  let t1;
  let input;
  let input_maxlength_value;
  let t2;
  let mounted;
  let dispose;
  function input_input_handler_1() {
    ctx[7].call(
      input,
      /*el*/
      ctx[9]
    );
  }
  function change_handler_1() {
    return (
      /*change_handler_1*/
      ctx[8](
        /*el*/
        ctx[9]
      )
    );
  }
  return {
    c() {
      div1 = element("div");
      div0 = element("div");
      t0 = text(t0_value);
      t1 = space();
      input = element("input");
      t2 = space();
      attr(div0, "class", "text svelte-18vwb4f");
      attr(input, "type", "text");
      attr(input, "maxlength", input_maxlength_value = /*el*/
      ctx[9].maxLength);
      attr(input, "class", "svelte-18vwb4f");
      attr(div1, "class", "setting svelte-18vwb4f");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, div0);
      append(div0, t0);
      append(div1, t1);
      append(div1, input);
      set_input_value(
        input,
        /*settings*/
        ctx[0][
          /*el*/
          ctx[9].id
        ]
      );
      append(div1, t2);
      if (!mounted) {
        dispose = [
          listen(input, "input", input_input_handler_1),
          listen(input, "change", change_handler_1)
        ];
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty & /*els*/
      2 && t0_value !== (t0_value = /*el*/
      ctx[9].title + "")) set_data(t0, t0_value);
      if (dirty & /*els*/
      2 && input_maxlength_value !== (input_maxlength_value = /*el*/
      ctx[9].maxLength)) {
        attr(input, "maxlength", input_maxlength_value);
      }
      if (dirty & /*settings, els*/
      3 && input.value !== /*settings*/
      ctx[0][
        /*el*/
        ctx[9].id
      ]) {
        set_input_value(
          input,
          /*settings*/
          ctx[0][
            /*el*/
            ctx[9].id
          ]
        );
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div1);
      }
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_2(ctx) {
  let div1;
  let div0;
  let t0_value = (
    /*el*/
    ctx[9].title + ""
  );
  let t0;
  let t1;
  let input;
  let input_min_value;
  let input_max_value;
  let input_step_value;
  let t2;
  let mounted;
  let dispose;
  function input_input_handler() {
    ctx[5].call(
      input,
      /*el*/
      ctx[9]
    );
  }
  function change_handler() {
    return (
      /*change_handler*/
      ctx[6](
        /*el*/
        ctx[9]
      )
    );
  }
  return {
    c() {
      div1 = element("div");
      div0 = element("div");
      t0 = text(t0_value);
      t1 = space();
      input = element("input");
      t2 = space();
      attr(div0, "class", "text svelte-18vwb4f");
      attr(input, "type", "number");
      attr(input, "min", input_min_value = /*el*/
      ctx[9].min);
      attr(input, "max", input_max_value = /*el*/
      ctx[9].max);
      attr(input, "step", input_step_value = /*el*/
      ctx[9].step);
      attr(input, "class", "svelte-18vwb4f");
      attr(div1, "class", "setting svelte-18vwb4f");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, div0);
      append(div0, t0);
      append(div1, t1);
      append(div1, input);
      set_input_value(
        input,
        /*settings*/
        ctx[0][
          /*el*/
          ctx[9].id
        ]
      );
      append(div1, t2);
      if (!mounted) {
        dispose = [
          listen(input, "input", input_input_handler),
          listen(input, "change", change_handler)
        ];
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty & /*els*/
      2 && t0_value !== (t0_value = /*el*/
      ctx[9].title + "")) set_data(t0, t0_value);
      if (dirty & /*els*/
      2 && input_min_value !== (input_min_value = /*el*/
      ctx[9].min)) {
        attr(input, "min", input_min_value);
      }
      if (dirty & /*els*/
      2 && input_max_value !== (input_max_value = /*el*/
      ctx[9].max)) {
        attr(input, "max", input_max_value);
      }
      if (dirty & /*els*/
      2 && input_step_value !== (input_step_value = /*el*/
      ctx[9].step)) {
        attr(input, "step", input_step_value);
      }
      if (dirty & /*settings, els*/
      3 && to_number(input.value) !== /*settings*/
      ctx[0][
        /*el*/
        ctx[9].id
      ]) {
        set_input_value(
          input,
          /*settings*/
          ctx[0][
            /*el*/
            ctx[9].id
          ]
        );
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div1);
      }
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_1(ctx) {
  let div1;
  let div0;
  let t0_value = (
    /*el*/
    ctx[9].title + ""
  );
  let t0;
  let t1;
  let toggle;
  let updating_toggled;
  let t2;
  let current;
  function toggle_toggled_binding(value) {
    ctx[3](
      value,
      /*el*/
      ctx[9]
    );
  }
  function toggle_handler() {
    return (
      /*toggle_handler*/
      ctx[4](
        /*el*/
        ctx[9]
      )
    );
  }
  let toggle_props = { hideLabel: true };
  if (
    /*settings*/
    ctx[0][
      /*el*/
      ctx[9].id
    ] !== void 0
  ) {
    toggle_props.toggled = /*settings*/
    ctx[0][
      /*el*/
      ctx[9].id
    ];
  }
  toggle = new Toggle_default({ props: toggle_props });
  binding_callbacks.push(() => bind(toggle, "toggled", toggle_toggled_binding));
  toggle.$on("toggle", toggle_handler);
  return {
    c() {
      div1 = element("div");
      div0 = element("div");
      t0 = text(t0_value);
      t1 = space();
      create_component(toggle.$$.fragment);
      t2 = space();
      attr(div0, "class", "text svelte-18vwb4f");
      attr(div1, "class", "setting svelte-18vwb4f");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, div0);
      append(div0, t0);
      append(div1, t1);
      mount_component(toggle, div1, null);
      append(div1, t2);
      current = true;
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if ((!current || dirty & /*els*/
      2) && t0_value !== (t0_value = /*el*/
      ctx[9].title + "")) set_data(t0, t0_value);
      const toggle_changes = {};
      if (!updating_toggled && dirty & /*settings, els*/
      3) {
        updating_toggled = true;
        toggle_changes.toggled = /*settings*/
        ctx[0][
          /*el*/
          ctx[9].id
        ];
        add_flush_callback(() => updating_toggled = false);
      }
      toggle.$set(toggle_changes);
    },
    i(local) {
      if (current) return;
      transition_in(toggle.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(toggle.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div1);
      }
      destroy_component(toggle);
    }
  };
}
function create_if_block2(ctx) {
  let h2;
  let t_value = (
    /*el*/
    ctx[9].text + ""
  );
  let t;
  return {
    c() {
      h2 = element("h2");
      t = text(t_value);
      attr(h2, "class", "svelte-18vwb4f");
    },
    m(target, anchor) {
      insert(target, h2, anchor);
      append(h2, t);
    },
    p(ctx2, dirty) {
      if (dirty & /*els*/
      2 && t_value !== (t_value = /*el*/
      ctx2[9].text + "")) set_data(t, t_value);
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(h2);
      }
    }
  };
}
function create_each_block(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block2, create_if_block_1, create_if_block_2, create_if_block_3];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (
      /*el*/
      ctx2[9].type === "heading"
    ) return 0;
    if (
      /*el*/
      ctx2[9].type === "boolean"
    ) return 1;
    if (
      /*el*/
      ctx2[9].type === "number"
    ) return 2;
    if (
      /*el*/
      ctx2[9].type === "text"
    ) return 3;
    return -1;
  }
  if (~(current_block_type_index = select_block_type(ctx, -1))) {
    if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  }
  return {
    c() {
      if (if_block) if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (~current_block_type_index) {
        if_blocks[current_block_type_index].m(target, anchor);
      }
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2, dirty);
      if (current_block_type_index === previous_block_index) {
        if (~current_block_type_index) {
          if_blocks[current_block_type_index].p(ctx2, dirty);
        }
      } else {
        if (if_block) {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
        }
        if (~current_block_type_index) {
          if_block = if_blocks[current_block_type_index];
          if (!if_block) {
            if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
            if_block.c();
          } else {
            if_block.p(ctx2, dirty);
          }
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        } else {
          if_block = null;
        }
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
      if (~current_block_type_index) {
        if_blocks[current_block_type_index].d(detaching);
      }
    }
  };
}
function create_fragment3(ctx) {
  let div;
  let current;
  let each_value = ensure_array_like(
    /*els*/
    ctx[1]
  );
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
  }
  const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
    each_blocks[i] = null;
  });
  return {
    c() {
      div = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(div, "class", "settings svelte-18vwb4f");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div, null);
        }
      }
      current = true;
    },
    p(ctx2, [dirty]) {
      if (dirty & /*els, settings, clampNum*/
      3) {
        each_value = ensure_array_like(
          /*els*/
          ctx2[1]
        );
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
            transition_in(each_blocks[i], 1);
          } else {
            each_blocks[i] = create_each_block(child_ctx);
            each_blocks[i].c();
            transition_in(each_blocks[i], 1);
            each_blocks[i].m(div, null);
          }
        }
        group_outros();
        for (i = each_value.length; i < each_blocks.length; i += 1) {
          out(i);
        }
        check_outros();
      }
    },
    i(local) {
      if (current) return;
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      current = true;
    },
    o(local) {
      each_blocks = each_blocks.filter(Boolean);
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      destroy_each(each_blocks, detaching);
    }
  };
}
function clampNum(value, el) {
  if (el.step) value = Math.round(value / el.step) * el.step;
  if (el.min) value = Math.max(value, el.min);
  if (el.max) value = Math.min(value, el.max);
  return value;
}
function instance3($$self, $$props, $$invalidate) {
  let { name } = $$props;
  let { els } = $$props;
  let { settings } = $$props;
  function toggle_toggled_binding(value, el) {
    if ($$self.$$.not_equal(settings[el.id], value)) {
      settings[el.id] = value;
      $$invalidate(0, settings);
    }
  }
  const toggle_handler = (el) => settings.onChange(el.id);
  function input_input_handler(el) {
    settings[el.id] = to_number(this.value);
    $$invalidate(0, settings);
  }
  const change_handler = (el) => {
    $$invalidate(0, settings[el.id] = clampNum(settings[el.id], el), settings);
    settings.onChange(el.id);
  };
  function input_input_handler_1(el) {
    settings[el.id] = this.value;
    $$invalidate(0, settings);
  }
  const change_handler_1 = (el) => settings.onChange(el.id);
  $$self.$$set = ($$props2) => {
    if ("name" in $$props2) $$invalidate(2, name = $$props2.name);
    if ("els" in $$props2) $$invalidate(1, els = $$props2.els);
    if ("settings" in $$props2) $$invalidate(0, settings = $$props2.settings);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*name, settings*/
    5) {
      $: GL.storage.setValue(name, "QS-Settings", settings);
    }
  };
  return [
    settings,
    els,
    name,
    toggle_toggled_binding,
    toggle_handler,
    input_input_handler,
    change_handler,
    input_input_handler_1,
    change_handler_1
  ];
}
var Settings = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance3, create_fragment3, safe_not_equal, { name: 2, els: 1, settings: 0 }, add_css2);
  }
};
var Settings_default = Settings;

// src/index.ts
function QuickSettings(name, els) {
  if (!Array.isArray(els)) throw new Error("Elements isn't an array");
  let settings = GL.storage.getValue(name, "QS-Settings", {});
  for (let el of els) {
    if (el.type === "heading") continue;
    if (!settings.hasOwnProperty(el.id)) {
      if (el.default) settings[el.id] = el.default;
      else {
        if (el.type === "number") settings[el.id] = el.min ?? 0;
        else if (el.type === "boolean") settings[el.id] = false;
        else settings[el.id] = "";
      }
    }
  }
  settings.openSettingsMenu = () => {
    let div = document.createElement("div");
    let component = new Settings_default({
      target: div,
      props: {
        name,
        els,
        settings
      }
    });
    GL.UI.showModal(div, {
      buttons: [{ text: "Close", style: "primary" }],
      // @ts-ignore
      onClosed: () => component.$destroy()
    });
  };
  let listeners = {};
  settings.listen = (key, callback) => {
    if (!listeners[key]) listeners[key] = [];
    listeners[key].push(callback);
    return () => listeners[key].splice(listeners[key].indexOf(callback), 1);
  };
  settings.onChange = (key) => {
    let value = settings[key];
    if (listeners[key]) listeners[key].forEach((cb) => cb(value));
  };
  return settings;
}
export {
  QuickSettings as default
};
