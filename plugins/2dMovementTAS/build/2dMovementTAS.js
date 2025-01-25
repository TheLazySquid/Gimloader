/**
 * @name 2dMovementTAS
 * @description Allows for making TASes of CTF and tag
 * @author TheLazySquid
 * @version 0.3.0
 * @downloadUrl https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/plugins/2dMovementTAS/build/2dMovementTAS.js
 * @reloadRequired ingame
 */


// node_modules/gimloader/index.js
var api = new GL();
var gimloader_default = api;

// node_modules/svelte/src/runtime/internal/utils.js
function noop() {
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
function subscribe(store, ...callbacks) {
  if (store == null) {
    for (const callback of callbacks) {
      callback(void 0);
    }
    return noop;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function component_subscribe(component, store, callback) {
  component.$$.on_destroy.push(subscribe(store, callback));
}

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
function prevent_default(fn) {
  return function(event) {
    event.preventDefault();
    return fn.call(this, event);
  };
}
function attr(node, attribute, value) {
  if (value == null) node.removeAttribute(attribute);
  else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
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
        let create_slot = function(name) {
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
            $$slots[name] = [create_slot(name)];
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

// src/ui/AnglePicker.svelte
function add_css(target) {
  append_styles(target, "svelte-256vti", ".circleWrap.svelte-256vti{width:100%;display:flex;align-items:center;justify-content:center}.circle.svelte-256vti{width:100px;height:100px;border-radius:50%;background-color:#f0f0f0;position:relative}.pointer.svelte-256vti{width:2px;height:50px;background-color:#000;position:absolute;top:50%;left:50%;transform-origin:0 0}.inputs.svelte-256vti{width:100%;display:flex;align-items:center;justify-content:space-between}.numInput.svelte-256vti{border:none;border-bottom:1px solid black}");
}
function create_fragment(ctx) {
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
      span.textContent = "\xB0";
      attr(div0, "class", "pointer svelte-256vti");
      set_style(div0, "transform", "rotate(" + /*angle*/
      (ctx[0] - 90) + "deg)");
      attr(div1, "class", "circle svelte-256vti");
      attr(div2, "class", "circleWrap svelte-256vti");
      attr(input0, "type", "range");
      attr(input0, "min", "0");
      attr(input0, "max", "360");
      attr(input0, "step", "0.01");
      attr(input1, "class", "numInput svelte-256vti");
      attr(input1, "type", "number");
      attr(input1, "min", "0");
      attr(input1, "max", "360");
      attr(div4, "class", "inputs svelte-256vti");
    },
    m(target, anchor) {
      insert(target, div5, anchor);
      append(div5, div2);
      append(div2, div1);
      append(div1, div0);
      ctx[7](div1);
      append(div5, t0);
      append(div5, div4);
      append(div4, input0);
      set_input_value(
        input0,
        /*angle*/
        ctx[0]
      );
      append(div4, t1);
      append(div4, div3);
      append(div3, input1);
      set_input_value(
        input1,
        /*angle*/
        ctx[0]
      );
      append(div3, t2);
      append(div3, span);
      if (!mounted) {
        dispose = [
          listen(
            window,
            "pointerup",
            /*pointerup_handler*/
            ctx[6]
          ),
          listen(
            window,
            "pointermove",
            /*updateAngle*/
            ctx[4]
          ),
          listen(
            div1,
            "pointerdown",
            /*onMousedown*/
            ctx[3]
          ),
          listen(
            input0,
            "change",
            /*input0_change_input_handler*/
            ctx[8]
          ),
          listen(
            input0,
            "input",
            /*input0_change_input_handler*/
            ctx[8]
          ),
          listen(
            input1,
            "input",
            /*input1_input_handler*/
            ctx[9]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (dirty & /*angle*/
      1) {
        set_style(div0, "transform", "rotate(" + /*angle*/
        (ctx2[0] - 90) + "deg)");
      }
      if (dirty & /*angle*/
      1) {
        set_input_value(
          input0,
          /*angle*/
          ctx2[0]
        );
      }
      if (dirty & /*angle*/
      1 && to_number(input1.value) !== /*angle*/
      ctx2[0]) {
        set_input_value(
          input1,
          /*angle*/
          ctx2[0]
        );
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div5);
      }
      ctx[7](null);
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance($$self, $$props, $$invalidate) {
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
    binding_callbacks[$$value ? "unshift" : "push"](() => {
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
  $$self.$$set = ($$props2) => {
    if ("angle" in $$props2) $$invalidate(0, angle = $$props2.angle);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*angle*/
    1) {
      $: if (angle === null) $$invalidate(0, angle = 0);
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
var AnglePicker = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, { angle: 0, getAngle: 5 }, add_css);
  }
  get getAngle() {
    return this.$$.ctx[5];
  }
};
var AnglePicker_default = AnglePicker;

// src/util.ts
var blankFrame = {
  angle: 0,
  moving: true,
  answer: false,
  purchase: false
};
function between(number, bound1, bound2) {
  return number >= Math.min(bound1, bound2) && number <= Math.max(bound1, bound2);
}
function showAnglePicker(initial) {
  return new Promise((res) => {
    let div = document.createElement("div");
    let anglePicker = new AnglePicker_default({
      target: div,
      props: {
        angle: initial
      }
    });
    gimloader_default.UI.showModal(div, {
      title: "Pick an angle",
      closeOnBackgroundClick: false,
      onClosed() {
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
    value: initial,
    subscribe: subscribe2,
    set
  };
  let subscribers = /* @__PURE__ */ new Set();
  function subscribe2(callback) {
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
var defaultState = {
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
function getFrameState(state) {
  return Object.assign({}, defaultState, state);
}
function makeFrameState() {
  let state = gimloader_default.stores.phaser.mainCharacter.physics.state;
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
  let states = gimloader_default.stores.world.devices.states;
  if (!states.has(deviceId)) {
    states.set(deviceId, { deviceId, properties: /* @__PURE__ */ new Map() });
  }
  states.get(deviceId).properties.set(key, value);
  device.onStateUpdateFromServer(key, value);
}
function downloadFile(contents, name) {
  let blob = new Blob([contents], { type: "text/plain" });
  let url = URL.createObjectURL(blob);
  let a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
function uploadFile() {
  return new Promise((res, rej) => {
    let input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = () => {
      if (!input.files || !input.files[0]) return rej();
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

// src/stores.ts
var currentFrame = easyAccessWritable(0);

// src/tools.ts
var active = false;
gimloader_default.net.on("PHYSICS_STATE", (_, editFn) => {
  if (active) editFn(null);
});
window.expectedPoses = [];
var TASTools = class {
  constructor(frames, setFrames, startPos) {
    this.frames = frames;
    this.setFrames = setFrames;
    this.physicsManager = gimloader_default.stores.phaser.scene.worldManager.physics;
    this.nativeStep = this.physicsManager.physicsStep;
    active = true;
    let mcState = gimloader_default.net.room.state.characters.get(gimloader_default.stores.phaser.mainCharacter.id);
    mcState.$callbacks.movementSpeed = [];
    for (let slot of mcState.inventory.slots.values()) {
      slot.$callbacks = {};
    }
    mcState.inventory.slots.onAdd((item) => {
      setTimeout(() => {
        item.$callbacks = {};
      });
    });
    let mc = gimloader_default.stores.phaser.mainCharacter;
    this.stopPlayback();
    this.inputManager = gimloader_default.stores.phaser.scene.inputManager;
    this.rb = mc.physics.getBody().rigidBody;
    if (startPos) {
      this.startPos = startPos;
      this.rb.setTranslation(startPos, true);
    } else {
      this.startPos = this.rb.translation();
    }
    this.movement = mc.movement;
    this.movement.state = Object.assign({}, defaultState);
    let allDevices = gimloader_default.stores.phaser.scene.worldManager.devices.allDevices;
    this.tagEnergyDisplay = allDevices.find((d) => d.options?.text == '0/10,000 <item-image item="energy" />');
    gimloader_default.net.on("DEVICES_STATES_CHANGES", (packet) => {
      packet.changes.splice(0, packet.changes.length);
    });
    this.setEnergy(940);
    setInterval(() => {
      this.save();
    }, 6e4);
    window.addEventListener("unload", () => {
      this.save();
    });
  }
  startPos;
  nativeStep;
  physicsManager;
  inputManager;
  prevFrameStates = [];
  rb;
  movement;
  tagEnergyDisplay;
  energyPerQuestion = 5e3;
  energyUsage = 60;
  energyTimeout = 0;
  purchaseTimeouts = [];
  energyFrames = [];
  tagMaxEnergy = 1e4;
  setEnergy(amount) {
    if (this.tagEnergyDisplay) {
      updateDeviceState(
        this.tagEnergyDisplay,
        `PLAYER_${gimloader_default.stores.phaser.mainCharacter.id}_text`,
        `${amount}/${this.tagMaxEnergy} <item-image item="energy" />`
      );
    }
    gimloader_default.stores.me.inventory.slots.get("energy").amount = amount;
  }
  getEnergy() {
    return gimloader_default.stores.me.inventory.slots.get("energy").amount ?? 0;
  }
  goBackToFrame(number) {
    for (let i = currentFrame.value - 1; i >= number; i--) {
      let frame2 = this.prevFrameStates[i];
      if (!frame2) continue;
      if (frame2.undoDeviceChanges) frame2.undoDeviceChanges();
    }
    let frame = this.prevFrameStates[number];
    if (!frame) return;
    currentFrame.set(number);
    this.rb.setTranslation(frame.position, true);
    gimloader_default.stores.phaser.mainCharacter.physics.state = getFrameState(frame.state);
    gimloader_default.stores.me.movementSpeed = frame.speed;
    this.setEnergy(frame.energy);
    this.energyPerQuestion = frame.epq;
    this.energyUsage = frame.energyUsage;
    this.energyTimeout = frame.energyTimeout;
    this.tagMaxEnergy = frame.maxEnergy;
    this.purchaseTimeouts = frame.purchaseTimeouts;
    this.energyFrames = frame.energyFrames;
  }
  backFrame() {
    if (currentFrame.value <= 0) return;
    this.goBackToFrame(currentFrame.value - 1);
  }
  advanceFrame() {
    let frame = this.frames[currentFrame.value];
    let save = this.getState();
    this.prevFrameStates[currentFrame.value] = save;
    this.updateDevices(frame);
    this.updateCharacter(frame);
    this.inputManager.getPhysicsInput = () => this.getPhysicsInput();
    this.nativeStep(0);
    currentFrame.set(currentFrame.value + 1);
  }
  hideUI() {
    gimloader_default.stores.me.currentAction = "none";
    gimloader_default.stores.gui.none.screen = "home";
  }
  updateDevices(frame) {
    for (let [countdown, purchase] of this.purchaseTimeouts) {
      if (countdown === 0) {
        let undo = purchase();
        this.prevFrameStates[currentFrame.value].undoDeviceChanges = undo;
      }
    }
    if (!frame.purchase) return;
    let devices = gimloader_default.stores.phaser.scene.worldManager.devices;
    let realPos = this.rb.translation();
    let device = devices.interactives.findClosestInteractiveDevice(devices.devicesInView, realPos.x * 100, realPos.y * 100);
    if (!device) return;
    if (device.options?.requiredItemId === "energy" && device.options?.amountOfRequiredItem <= this.getEnergy()) {
      const vendingMachines = ["Energy Per Question Upgrade", "Speed Upgrade", "Efficiency Upgrade", "Endurance Upgrade", "Energy Generator"];
      let name = device.options.grantedItemName;
      const isBarrier = name.includes("Barrier");
      const isBlocker = name.includes("Teleportal") || name.includes("Tunnel") || name.includes("Access") || name.includes("Escape");
      if (isBarrier) {
        this.purchaseTimeouts.push([
          Math.floor(device.options.interactionDuration * 12) - 1,
          () => {
            let channel = device.options.purchaseChannel.split(",")[0];
            updateDeviceState(device, "GLOBAL_active", false);
            let barrier = devices.devicesInView.find((d) => d.options?.showWhenReceivingFrom === channel);
            if (barrier) updateDeviceState(barrier, "GLOBAL_visible", true);
            this.setEnergy(this.getEnergy() - device.options.amountOfRequiredItem);
            return () => {
              updateDeviceState(device, "GLOBAL_active", true);
              if (barrier) updateDeviceState(barrier, "GLOBAL_visible", false);
            };
          }
        ]);
      } else if (isBlocker) {
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
      } else if (vendingMachines.includes(name)) {
        this.purchaseTimeouts.push([
          Math.floor(device.options.interactionDuration * 12) - 1,
          () => {
            updateDeviceState(device, "GLOBAL_active", false);
            gimloader_default.notification.open({ message: `Purchased ${name}` });
            switch (name) {
              case "Energy Per Question Upgrade":
                this.energyPerQuestion += 200;
                break;
              case "Speed Upgrade":
                gimloader_default.stores.me.movementSpeed += 46.5;
                break;
              case "Efficiency Upgrade":
                this.energyUsage -= 7;
                break;
              case "Endurance Upgrade":
                this.tagMaxEnergy += 5e3;
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
      } else {
        gimloader_default.notification.open({ message: "Unable to handle what you're trying to purchase. If this is unexpected, please report it." });
      }
    }
  }
  updateCharacter(frame) {
    if (frame.answer) {
      if (this.tagEnergyDisplay) {
        this.setEnergy(Math.min(this.tagMaxEnergy, this.getEnergy() + this.energyPerQuestion));
      } else {
        this.setEnergy(this.getEnergy() + this.energyPerQuestion);
      }
    }
    this.energyTimeout--;
    if (frame.moving && this.energyTimeout <= 0) {
      if (this.energyTimeout === 0) this.setEnergy(Math.max(0, this.getEnergy() - this.energyUsage));
      let prevFrame = this.frames[currentFrame.value - 1];
      if (prevFrame && prevFrame.moving) {
        this.energyTimeout = 6;
      } else {
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
    let devices = gimloader_default.stores.phaser.scene.worldManager.devices;
    let teleporters = devices.devicesInView.filter((d) => d.deviceOption?.id === "teleporter");
    let body = gimloader_default.stores.phaser.mainCharacter.body;
    for (let teleporter of teleporters) {
      if (teleporter.x > body.x - 90 && teleporter.x < body.x + 90 && teleporter.y > body.y - 85 && teleporter.y < body.y + 100) {
        let target = teleporter.options.targetGroup;
        if (!target) continue;
        let targetTeleporter = devices.allDevices.find((d) => d.options?.group === target && d.deviceOption?.id === "teleporter");
        if (!targetTeleporter) continue;
        this.rb.setTranslation({ x: targetTeleporter.x / 100, y: targetTeleporter.y / 100 }, true);
        break;
      }
    }
  }
  updateUI() {
    let frame = this.frames[currentFrame.value];
    if (frame.answer) {
      gimloader_default.stores.phaser.scene.worldManager.devices.allDevices.find((d) => d.options?.openWhenReceivingOn === "answer questions").openDeviceUI();
    } else {
      gimloader_default.stores.me.currentAction = "none";
    }
    if (frame.purchase) {
      gimloader_default.stores.gui.none.screen = "inventory";
    } else {
      gimloader_default.stores.gui.none.screen = "home";
    }
  }
  getPhysicsInput(index = currentFrame.value) {
    let frame = this.frames[index];
    let prevFrame = this.frames[index - 1];
    let angle = frame.moving ? frame.angle : null;
    for (let [countdown, _, stopMotion] of this.purchaseTimeouts) {
      if (countdown <= 1 && stopMotion) angle = null;
    }
    if (this.getEnergy() <= 0) angle = null;
    this.purchaseTimeouts = this.purchaseTimeouts.map(([c, p, s]) => [c - 1, p, s]);
    this.purchaseTimeouts = this.purchaseTimeouts.filter(([c]) => c >= 0);
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
      speed: gimloader_default.stores.me.movementSpeed,
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
      let frame = this.frames[currentFrame.value];
      let save = this.getState();
      this.prevFrameStates[currentFrame.value] = save;
      this.updateDevices(frame);
      this.updateCharacter(frame);
      this.inputManager.getPhysicsInput = () => this.getPhysicsInput();
      this.updateUI();
      this.nativeStep(delta);
      currentFrame.set(currentFrame.value + 1);
    };
  }
  stopPlayback() {
    let mc = gimloader_default.stores.phaser.mainCharacter;
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
    gimloader_default.storage.setValue("save", val);
    return val;
  }
  download() {
    downloadFile(JSON.stringify(this.save()), "2D TAS.json");
  }
  load() {
    uploadFile().then((file) => {
      let data = JSON.parse(file);
      this.goBackToFrame(0);
      this.startPos = data.startPos;
      this.frames = data.frames;
      this.setFrames(data.frames);
    }).catch(() => {
    });
  }
};

// src/ui/UI.svelte
function add_css2(target) {
  append_styles(target, "svelte-ky453u", '.UI.svelte-ky453u.svelte-ky453u{position:absolute;background-color:rgba(255, 255, 255, 0.6);top:0;left:0;height:100%;z-index:9999999}.controls.svelte-ky453u.svelte-ky453u{height:50px;display:flex;align-items:center;justify-content:center;gap:5px}table.svelte-ky453u.svelte-ky453u{min-width:100%}tr.svelte-ky453u.svelte-ky453u{height:22px}td.dragged.svelte-ky453u.svelte-ky453u{background-color:rgba(0, 138, 197, 0.5) !important}tr.active.svelte-ky453u.svelte-ky453u{background-color:rgba(0, 138, 197, 0.892) !important}tr.svelte-ky453u.svelte-ky453u:nth-child(even){background-color:rgba(0, 0, 0, 0.1)}th.svelte-ky453u.svelte-ky453u:first-child,td.svelte-ky453u.svelte-ky453u:first-child{width:100px}input[type="checkbox"].disabled.svelte-ky453u.svelte-ky453u,input[type="checkbox"].svelte-ky453u.svelte-ky453u:disabled{opacity:0.5}th.svelte-ky453u.svelte-ky453u,td.svelte-ky453u.svelte-ky453u{height:22px;width:60px;text-align:center;user-select:none}.angle.svelte-ky453u.svelte-ky453u{width:130px;padding:0 10px;display:flex;align-items:center;gap:5px;cursor:pointer}.angle.svelte-ky453u .number.svelte-ky453u{flex-grow:1;display:flex;align-items:center;gap:5px}.drag.svelte-ky453u.svelte-ky453u{cursor:ns-resize}');
}
function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[48] = list[i];
  child_ctx[54] = i;
  const constants_0 = (
    /*offset*/
    child_ctx[2] + /*i*/
    child_ctx[54]
  );
  child_ctx[49] = constants_0;
  const constants_1 = (
    /*frames*/
    child_ctx[0][
      /*index*/
      child_ctx[49]
    ].purchase || /*frames*/
    child_ctx[0][
      /*index*/
      child_ctx[49] - 1
    ]?.answer || /*frames*/
    child_ctx[0][
      /*index*/
      child_ctx[49] - 2
    ]?.answer || /*frames*/
    child_ctx[0][
      /*index*/
      child_ctx[49] - 1
    ]?.purchase || /*frames*/
    child_ctx[0][
      /*index*/
      child_ctx[49] - 2
    ]?.purchase
  );
  child_ctx[50] = constants_1;
  const constants_2 = (
    /*frames*/
    child_ctx[0][
      /*index*/
      child_ctx[49]
    ].answer || /*frames*/
    child_ctx[0][
      /*index*/
      child_ctx[49] - 1
    ]?.answer || /*frames*/
    child_ctx[0][
      /*index*/
      child_ctx[49] - 2
    ]?.answer || /*frames*/
    child_ctx[0][
      /*index*/
      child_ctx[49] - 1
    ]?.purchase || /*frames*/
    child_ctx[0][
      /*index*/
      child_ctx[49] - 2
    ]?.purchase
  );
  child_ctx[51] = constants_2;
  const constants_3 = (
    /*frames*/
    child_ctx[0][
      /*index*/
      child_ctx[49]
    ].answer || /*frames*/
    child_ctx[0][
      /*index*/
      child_ctx[49] - 1
    ]?.answer
  );
  child_ctx[52] = constants_3;
  return child_ctx;
}
function create_each_block(ctx) {
  let tr;
  let td0;
  let t0_value = (
    /*index*/
    ctx[49] + ""
  );
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
  let t7_value = Math.round(
    /*frames*/
    ctx[0][
      /*index*/
      ctx[49]
    ].angle * 100
  ) / 100 + "";
  let t7;
  let t8;
  let t9;
  let div2;
  let t11;
  let mounted;
  let dispose;
  function input0_change_handler() {
    ctx[31].call(
      input0,
      /*index*/
      ctx[49]
    );
  }
  function mousedown_handler() {
    return (
      /*mousedown_handler*/
      ctx[32](
        /*answerDisabled*/
        ctx[50],
        /*index*/
        ctx[49]
      )
    );
  }
  function input1_change_handler() {
    ctx[33].call(
      input1,
      /*index*/
      ctx[49]
    );
  }
  function mousedown_handler_1() {
    return (
      /*mousedown_handler_1*/
      ctx[34](
        /*purchaseDisabled*/
        ctx[51],
        /*index*/
        ctx[49]
      )
    );
  }
  function input2_change_handler() {
    ctx[35].call(
      input2,
      /*index*/
      ctx[49]
    );
  }
  function mousedown_handler_2() {
    return (
      /*mousedown_handler_2*/
      ctx[36](
        /*moveDisabled*/
        ctx[52],
        /*index*/
        ctx[49]
      )
    );
  }
  function pointerdown_handler() {
    return (
      /*pointerdown_handler*/
      ctx[37](
        /*index*/
        ctx[49]
      )
    );
  }
  function pointerdown_handler_1() {
    return (
      /*pointerdown_handler_1*/
      ctx[38](
        /*index*/
        ctx[49]
      )
    );
  }
  function pointerover_handler() {
    return (
      /*pointerover_handler*/
      ctx[39](
        /*index*/
        ctx[49]
      )
    );
  }
  function pointerover_handler_1() {
    return (
      /*pointerover_handler_1*/
      ctx[40](
        /*index*/
        ctx[49]
      )
    );
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
      t5 = text("\u21D1");
      t6 = space();
      t7 = text(t7_value);
      t8 = text("\xB0");
      t9 = space();
      div2 = element("div");
      div2.textContent = "\u2195";
      t11 = space();
      attr(td0, "class", "frame svelte-ky453u");
      attr(input0, "type", "checkbox");
      attr(input0, "class", "svelte-ky453u");
      toggle_class(
        input0,
        "disabled",
        /*answerDisabled*/
        ctx[50]
      );
      attr(td1, "class", "svelte-ky453u");
      attr(input1, "type", "checkbox");
      attr(input1, "class", "svelte-ky453u");
      toggle_class(
        input1,
        "disabled",
        /*purchaseDisabled*/
        ctx[51]
      );
      attr(td2, "class", "svelte-ky453u");
      attr(input2, "type", "checkbox");
      attr(input2, "class", "svelte-ky453u");
      toggle_class(
        input2,
        "disabled",
        /*moveDisabled*/
        ctx[52]
      );
      attr(td3, "class", "svelte-ky453u");
      set_style(div0, "transform", "rotate(" + /*frames*/
      (ctx[0][
        /*index*/
        ctx[49]
      ].angle + 90) + "deg)");
      attr(div1, "class", "number svelte-ky453u");
      attr(div2, "class", "drag svelte-ky453u");
      attr(td4, "class", "angle svelte-ky453u");
      toggle_class(
        td4,
        "dragged",
        /*draggingMovement*/
        ctx[5] && between(
          /*index*/
          ctx[49],
          /*draggingMovementStart*/
          ctx[6],
          /*draggingMovementEnd*/
          ctx[7]
        )
      );
      attr(tr, "class", "svelte-ky453u");
      toggle_class(
        tr,
        "active",
        /*$currentFrame*/
        ctx[9] === /*index*/
        ctx[49]
      );
    },
    m(target, anchor) {
      insert(target, tr, anchor);
      append(tr, td0);
      append(td0, t0);
      append(tr, t1);
      append(tr, td1);
      append(td1, input0);
      input0.checked = /*frames*/
      ctx[0][
        /*index*/
        ctx[49]
      ].answer;
      append(tr, t2);
      append(tr, td2);
      append(td2, input1);
      input1.checked = /*frames*/
      ctx[0][
        /*index*/
        ctx[49]
      ].purchase;
      append(tr, t3);
      append(tr, td3);
      append(td3, input2);
      input2.checked = /*frames*/
      ctx[0][
        /*index*/
        ctx[49]
      ].moving;
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
          listen(input0, "click", prevent_default(
            /*click_handler*/
            ctx[23]
          )),
          listen(input0, "change", input0_change_handler),
          listen(td1, "mousedown", mousedown_handler),
          listen(input1, "click", prevent_default(
            /*click_handler_1*/
            ctx[22]
          )),
          listen(input1, "change", input1_change_handler),
          listen(td2, "mousedown", mousedown_handler_1),
          listen(input2, "click", prevent_default(
            /*click_handler_2*/
            ctx[21]
          )),
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
      if (dirty[0] & /*offset*/
      4 && t0_value !== (t0_value = /*index*/
      ctx[49] + "")) set_data(t0, t0_value);
      if (dirty[0] & /*frames, offset*/
      5) {
        input0.checked = /*frames*/
        ctx[0][
          /*index*/
          ctx[49]
        ].answer;
      }
      if (dirty[0] & /*frames, offset*/
      5) {
        toggle_class(
          input0,
          "disabled",
          /*answerDisabled*/
          ctx[50]
        );
      }
      if (dirty[0] & /*frames, offset*/
      5) {
        input1.checked = /*frames*/
        ctx[0][
          /*index*/
          ctx[49]
        ].purchase;
      }
      if (dirty[0] & /*frames, offset*/
      5) {
        toggle_class(
          input1,
          "disabled",
          /*purchaseDisabled*/
          ctx[51]
        );
      }
      if (dirty[0] & /*frames, offset*/
      5) {
        input2.checked = /*frames*/
        ctx[0][
          /*index*/
          ctx[49]
        ].moving;
      }
      if (dirty[0] & /*frames, offset*/
      5) {
        toggle_class(
          input2,
          "disabled",
          /*moveDisabled*/
          ctx[52]
        );
      }
      if (dirty[0] & /*frames, offset*/
      5) {
        set_style(div0, "transform", "rotate(" + /*frames*/
        (ctx[0][
          /*index*/
          ctx[49]
        ].angle + 90) + "deg)");
      }
      if (dirty[0] & /*frames, offset*/
      5 && t7_value !== (t7_value = Math.round(
        /*frames*/
        ctx[0][
          /*index*/
          ctx[49]
        ].angle * 100
      ) / 100 + "")) set_data(t7, t7_value);
      if (dirty[0] & /*draggingMovement, offset, draggingMovementStart, draggingMovementEnd*/
      228) {
        toggle_class(
          td4,
          "dragged",
          /*draggingMovement*/
          ctx[5] && between(
            /*index*/
            ctx[49],
            /*draggingMovementStart*/
            ctx[6],
            /*draggingMovementEnd*/
            ctx[7]
          )
        );
      }
      if (dirty[0] & /*$currentFrame, offset*/
      516) {
        toggle_class(
          tr,
          "active",
          /*$currentFrame*/
          ctx[9] === /*index*/
          ctx[49]
        );
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
function create_fragment2(ctx) {
  let div1;
  let div0;
  let button0;
  let t1;
  let button1;
  let t2_value = (
    /*playing*/
    ctx[8] ? "\u23F9" : "\u25B6"
  );
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
  add_render_callback(
    /*onwindowresize*/
    ctx[26]
  );
  let each_value = ensure_array_like({ length: (
    /*rows*/
    ctx[3]
  ) });
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
  }
  return {
    c() {
      div1 = element("div");
      div0 = element("div");
      button0 = element("button");
      button0.textContent = "\u2190";
      t1 = space();
      button1 = element("button");
      t2 = text(t2_value);
      t3 = space();
      button2 = element("button");
      button2.textContent = "\u2192";
      t5 = space();
      button3 = element("button");
      button3.textContent = "\u2B73";
      t7 = space();
      button4 = element("button");
      button4.textContent = "\u2B71";
      t9 = space();
      table = element("table");
      tr = element("tr");
      tr.innerHTML = `<th class="svelte-ky453u">Frame #</th> <th class="svelte-ky453u">Answer</th> <th class="svelte-ky453u">Purchase</th> <th class="svelte-ky453u">Move</th> <th class="svelte-ky453u">Angle</th>`;
      t19 = space();
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(div0, "class", "controls svelte-ky453u");
      attr(tr, "class", "svelte-ky453u");
      attr(table, "class", "svelte-ky453u");
      attr(div1, "class", "UI svelte-ky453u");
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
          listen(
            window,
            "pointerup",
            /*pointerup_handler*/
            ctx[24]
          ),
          listen(
            window,
            "pointerup",
            /*pointerup_handler_1*/
            ctx[25]
          ),
          listen(
            window,
            "keydown",
            /*onKeydown*/
            ctx[17]
          ),
          listen(
            window,
            "resize",
            /*onwindowresize*/
            ctx[26]
          ),
          listen(
            button0,
            "click",
            /*click_handler_3*/
            ctx[27]
          ),
          listen(
            button1,
            "click",
            /*togglePlaying*/
            ctx[18]
          ),
          listen(
            button2,
            "click",
            /*click_handler_4*/
            ctx[28]
          ),
          listen(
            button3,
            "click",
            /*click_handler_5*/
            ctx[29]
          ),
          listen(
            button4,
            "click",
            /*click_handler_6*/
            ctx[30]
          ),
          listen(
            div1,
            "wheel",
            /*onScroll*/
            ctx[11]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*playing*/
      256 && t2_value !== (t2_value = /*playing*/
      ctx2[8] ? "\u23F9" : "\u25B6")) set_data(t2, t2_value);
      if (dirty[0] & /*$currentFrame, offset, onAngleMouseover, onMouseover, draggingMovement, draggingMovementStart, draggingMovementEnd, onArrowClick, updateAngle, frames, onClick, toggleBlockingAction, rows*/
      652013) {
        each_value = ensure_array_like({ length: (
          /*rows*/
          ctx2[3]
        ) });
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context(ctx2, each_value, i);
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
function instance2($$self, $$props, $$invalidate) {
  let rows;
  let $currentFrame;
  component_subscribe($$self, currentFrame, ($$value) => $$invalidate(9, $currentFrame = $$value));
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
    showAnglePicker(frames[index].angle).then((angle) => {
      pickingAngle = false;
      $$invalidate(0, frames[index].angle = angle, frames);
    });
  }
  let playing = false;
  function onKeydown(e) {
    if (playing || pickingAngle) return;
    if (e.key === "ArrowRight") {
      if (e.shiftKey) for (let i = 0; i < 5; i++) tools.advanceFrame();
      else tools.advanceFrame();
    } else if (e.key === "ArrowLeft") {
      if (e.shiftKey) tools.goBackToFrame(Math.max(0, $currentFrame - 5));
      else if ($currentFrame >= 1) tools.backFrame();
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
    if (playing) tools.startPlayback();
    else tools.stopPlayback();
  }
  function toggleBlockingAction(index, key) {
    if ($currentFrame > index) tools.goBackToFrame(index);
    $$invalidate(0, frames[index][key] = !frames[index][key], frames);
    if (key === "answer") $$invalidate(0, frames[index].moving = false, frames);
    if (key === "answer") $$invalidate(0, frames[index].purchase = false, frames);
    else $$invalidate(0, frames[index].answer = false, frames);
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
    $$invalidate(0, frames), $$invalidate(2, offset), $$invalidate(3, rows), $$invalidate(1, height);
  }
  const mousedown_handler = (answerDisabled, index) => answerDisabled || toggleBlockingAction(index, "answer");
  function input1_change_handler(index) {
    frames[index].purchase = this.checked;
    $$invalidate(0, frames), $$invalidate(2, offset), $$invalidate(3, rows), $$invalidate(1, height);
  }
  const mousedown_handler_1 = (purchaseDisabled, index) => purchaseDisabled || toggleBlockingAction(index, "purchase");
  function input2_change_handler(index) {
    frames[index].moving = this.checked;
    $$invalidate(0, frames), $$invalidate(2, offset), $$invalidate(3, rows), $$invalidate(1, height);
  }
  const mousedown_handler_2 = (moveDisabled, index) => moveDisabled || onClick(index, "moving");
  const pointerdown_handler = (index) => updateAngle(index);
  const pointerdown_handler_1 = (index) => onArrowClick(index);
  const pointerover_handler = (index) => onAngleMouseover(index);
  const pointerover_handler_1 = (index) => onMouseover(index);
  $$self.$$set = ($$props2) => {
    if ("frames" in $$props2) $$invalidate(0, frames = $$props2.frames);
    if ("startPos" in $$props2) $$invalidate(20, startPos = $$props2.startPos);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty[0] & /*height*/
    2) {
      $: $$invalidate(3, rows = Math.floor(height / 26) - 1);
    }
    if ($$self.$$.dirty[0] & /*offset, rows, frames*/
    13) {
      $: for (let i = offset; i < offset + rows; i++) {
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
var UI = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance2, create_fragment2, safe_not_equal, { frames: 0, startPos: 20 }, add_css2, [-1, -1]);
  }
};
var UI_default = UI;

// src/ui/Start.svelte
function add_css3(target) {
  append_styles(target, "svelte-pcq7nj", "div.svelte-pcq7nj{position:absolute;top:0;left:0;z-index:999999;display:flex;flex-direction:column;gap:10px;padding:10px}button.svelte-pcq7nj{padding:5px 20px;border-radius:100px;background-color:rgba(0, 0, 0, 0.5);color:white;border:1px solid black;transition:transform 0.2s ease}button.svelte-pcq7nj:hover{transform:scale(1.05)}button.svelte-pcq7nj:active{transform:scale(0.95)}");
}
function create_else_block(ctx) {
  let div;
  let t0;
  let button0;
  let t2;
  let button1;
  let mounted;
  let dispose;
  let if_block = (
    /*save*/
    ctx[3] && create_if_block_1(ctx)
  );
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
      attr(button0, "class", "svelte-pcq7nj");
      attr(button1, "class", "svelte-pcq7nj");
      attr(div, "class", "svelte-pcq7nj");
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
          listen(
            button0,
            "click",
            /*newTAS*/
            ctx[5]
          ),
          listen(
            button1,
            "click",
            /*loadTAS*/
            ctx[6]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (
        /*save*/
        ctx2[3]
      ) if_block.p(ctx2, dirty);
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
function create_if_block(ctx) {
  let ui2;
  let current;
  ui2 = new UI_default({
    props: {
      frames: (
        /*frames*/
        ctx[1]
      ),
      startPos: (
        /*startPos*/
        ctx[2]
      )
    }
  });
  return {
    c() {
      create_component(ui2.$$.fragment);
    },
    m(target, anchor) {
      mount_component(ui2, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const ui_changes = {};
      if (dirty & /*frames*/
      2) ui_changes.frames = /*frames*/
      ctx2[1];
      if (dirty & /*startPos*/
      4) ui_changes.startPos = /*startPos*/
      ctx2[2];
      ui2.$set(ui_changes);
    },
    i(local) {
      if (current) return;
      transition_in(ui2.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(ui2.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(ui2, detaching);
    }
  };
}
function create_if_block_1(ctx) {
  let button;
  let mounted;
  let dispose;
  return {
    c() {
      button = element("button");
      button.textContent = "Continue TAS";
      attr(button, "class", "svelte-pcq7nj");
    },
    m(target, anchor) {
      insert(target, button, anchor);
      if (!mounted) {
        dispose = listen(
          button,
          "click",
          /*continueTAS*/
          ctx[4]
        );
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
function create_fragment3(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block, create_else_block];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (
      /*begun*/
      ctx2[0]
    ) return 0;
    return 1;
  }
  current_block_type_index = select_block_type(ctx, -1);
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
    p(ctx2, [dirty]) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2, dirty);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block.c();
        } else {
          if_block.p(ctx2, dirty);
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
function instance3($$self, $$props, $$invalidate) {
  let begun = false;
  let save = gimloader_default.storage.getValue("save");
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
var Start = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance3, create_fragment3, safe_not_equal, {}, add_css3);
  }
};
var Start_default = Start;

// src/index.ts
var ui;
gimloader_default.net.onLoad(() => {
  ui = new Start_default({
    target: document.body
  });
  gimloader_default.onStop(() => ui.$destroy());
});
