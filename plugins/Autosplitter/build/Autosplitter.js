/**
 * @name Autosplitter
 * @description Automatically times speedruns for various gamemodes
 * @author TheLazySquid
 * @version 0.5.0
 * @downloadUrl https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/plugins/Autosplitter/build/Autosplitter.js
 * @needsLib GamemodeDetector | https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/libraries/GamemodeDetector.js
 * @hasSettings true
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
function select_option(select, value, mounting) {
  for (let i = 0; i < select.options.length; i += 1) {
    const option = select.options[i];
    if (option.__value === value) {
      option.selected = true;
      return;
    }
  }
  if (!mounting || value !== void 0) {
    select.selectedIndex = -1;
  }
}
function select_value(select) {
  const selected_option = select.querySelector(":checked");
  return selected_option && selected_option.__value;
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
function init(component, options, instance9, create_fragment9, not_equal, props, append_styles2 = null, dirty = [-1]) {
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
  $$.ctx = instance9 ? instance9(component, options.props || {}, (i, ret, ...rest) => {
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
  $$.fragment = create_fragment9 ? create_fragment9($$.ctx) : false;
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

// src/util.ts
function getGamemodeData(gamemode) {
  switch (gamemode) {
    case "DLD":
      return getDLDData();
    case "Fishtopia":
      return getFishtopiaData();
    case "OneWayOut":
      return getOneWayOutData();
    default:
      throw new Error(`Invalid gamemode: ${gamemode}`);
  }
}
var DLDDefaults = {
  mode: "Full Game",
  ilSummit: 0,
  ilPreboosts: false,
  autostartILs: false,
  autoRecord: true,
  attempts: {},
  pb: {},
  bestSplits: {},
  ilpbs: {},
  showPbSplits: false,
  showSplits: true,
  showSplitTimes: true,
  showSplitComparisons: true,
  showSplitTimeAtEnd: true,
  timerPosition: "top right"
};
function getDLDData() {
  let data = gimloader_default.storage.getValue("DLDData", {});
  return Object.assign(DLDDefaults, data);
}
var splitsDefaults = {
  attempts: {},
  pb: {},
  bestSplits: {},
  showPbSplits: false,
  showSplits: true,
  showSplitTimes: true,
  showSplitComparisons: true,
  showSplitTimeAtEnd: true,
  timerPosition: "top right"
};
function getFishtopiaData() {
  let data = gimloader_default.storage.getValue("FishtopiaData", {});
  return Object.assign(splitsDefaults, data);
}
function getOneWayOutData() {
  let data = gimloader_default.storage.getValue("OneWayOutData", {});
  return Object.assign(splitsDefaults, data);
}
function downloadFile(data, filename) {
  let blob = new Blob([data], { type: "application/json" });
  let url = URL.createObjectURL(blob);
  let a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
function readFile() {
  return new Promise((res, rej) => {
    let input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.addEventListener("change", () => {
      let file = input.files?.[0];
      if (!file) return rej("No file selected");
      let reader = new FileReader();
      reader.onload = () => {
        let data = reader.result;
        if (typeof data !== "string") return rej("Failed to read file");
        let parsed = JSON.parse(data);
        res(parsed);
      };
      reader.readAsText(file);
    });
    input.click();
  });
}
function fmtMs(ms) {
  ms = Math.round(ms);
  let seconds = Math.floor(ms / 1e3);
  let minutes = Math.floor(seconds / 60);
  ms %= 1e3;
  seconds %= 60;
  if (minutes > 0) return `${minutes}:${String(seconds).padStart(2, "0")}.${String(ms).padStart(3, "0")}`;
  return `${seconds}.${String(ms).padStart(3, "0")}`;
}
function parseTime(time) {
  let parts = time.split(":").map(parseFloat);
  if (parts.some(isNaN)) return 6e5;
  if (parts.length === 1) return parts[0] * 1e3;
  if (parts.length === 2) return parts[0] * 6e4 + parts[1] * 1e3;
  return parts[0] * 36e5 + parts[1] * 6e4 + parts[2] * 1e3;
}
function inArea(coords, area) {
  if (area.direction === "right" && coords.x < area.x) return false;
  if (area.direction === "left" && coords.x > area.x) return false;
  if (coords.y > area.y + 10) return false;
  return true;
}
function inBox(coords, box) {
  return coords.x > box.p1.x && coords.x < box.p2.x && coords.y > box.p1.y && coords.y < box.p2.y;
}
function onPhysicsStep(callback) {
  let worldManager = gimloader_default.stores.phaser.scene.worldManager;
  gimloader_default.patcher.after(worldManager.physics, "physicsStep", () => {
    callback();
  });
}
function onFrame(callback) {
  let worldManager = gimloader_default.stores.phaser.scene.worldManager;
  gimloader_default.patcher.after(worldManager, "update", () => {
    callback();
  });
}

// src/constants.ts
var gamemodes = ["DLD", "Fishtopia", "OneWayOut"];
var DLDSplits = ["Summit 1", "Summit 2", "Summit 3", "Summit 4", "Summit 5", "Summit 6"];
var fishtopiaSplits = ["Fishtopia", "Purple Pond", "Sandy Shores", "Cosmic Cove", "Lucky Lake"];
var boatChannels = [
  "attempt travel purple pond",
  "attempt travel sandy shores",
  "attempt travel cosmic cove",
  "attempt travel lucky lake"
];
var summitStartCoords = [
  { x: 9071, y: 65e3, direction: "right" },
  // summit 1
  { x: 28788.9, y: 53278, direction: "left" },
  // summit 2
  { x: 21387.95, y: 50078, direction: "right" },
  // summit 3
  { x: 39693.5, y: 41374, direction: "right" },
  // summit 4
  { x: 35212, y: 35166, direction: "right" },
  // summit 5
  { x: 39755.93, y: 28573, direction: "right" },
  // summit 6
  { x: 40395.91, y: 13854, direction: "right" }
  // finish
];
var summitCoords = [{
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
var resetCoordinates = { x: 9050, y: 6300 };
var categories = ["Current Patch", "Creative Platforming Patch", "Original Physics"];
var oneWayOutSplits = ["Stage 1", "Stage 2", "Stage 3"];
var stageCoords = [{
  p1: { x: 12008, y: 3147 },
  p2: { x: 13072, y: 5770 }
}, {
  p1: { x: 10813, y: 8962 },
  p2: { x: 13312, y: 9888 }
}];

// src/settings/FullGame.svelte
function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[7] = list[i];
  child_ctx[9] = i;
  return child_ctx;
}
function create_each_block(ctx) {
  let tr;
  let td0;
  let t0_value = (
    /*split*/
    ctx[7] + ""
  );
  let t0;
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
    return (
      /*change_handler*/
      ctx[5](
        /*i*/
        ctx[9],
        ...args
      )
    );
  }
  function change_handler_1(...args) {
    return (
      /*change_handler_1*/
      ctx[6](
        /*i*/
        ctx[9],
        ...args
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
      input0.value = input0_value_value = /*data*/
      ctx[0].bestSplits[
        /*category*/
        ctx[2]
      ]?.[
        /*i*/
        ctx[9]
      ] ? fmtMs(
        /*data*/
        ctx[0].bestSplits[
          /*category*/
          ctx[2]
        ][
          /*i*/
          ctx[9]
        ]
      ) : "";
      input1.value = input1_value_value = /*data*/
      ctx[0].pb[
        /*category*/
        ctx[2]
      ]?.[
        /*i*/
        ctx[9]
      ] ? fmtMs(
        /*data*/
        ctx[0].pb[
          /*category*/
          ctx[2]
        ][
          /*i*/
          ctx[9]
        ]
      ) : "";
    },
    m(target, anchor) {
      insert(target, tr, anchor);
      append(tr, td0);
      append(td0, t0);
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
      if (dirty & /*splits*/
      2 && t0_value !== (t0_value = /*split*/
      ctx[7] + "")) set_data(t0, t0_value);
      if (dirty & /*data, category*/
      5 && input0_value_value !== (input0_value_value = /*data*/
      ctx[0].bestSplits[
        /*category*/
        ctx[2]
      ]?.[
        /*i*/
        ctx[9]
      ] ? fmtMs(
        /*data*/
        ctx[0].bestSplits[
          /*category*/
          ctx[2]
        ][
          /*i*/
          ctx[9]
        ]
      ) : "") && input0.value !== input0_value_value) {
        input0.value = input0_value_value;
      }
      if (dirty & /*data, category*/
      5 && input1_value_value !== (input1_value_value = /*data*/
      ctx[0].pb[
        /*category*/
        ctx[2]
      ]?.[
        /*i*/
        ctx[9]
      ] ? fmtMs(
        /*data*/
        ctx[0].pb[
          /*category*/
          ctx[2]
        ][
          /*i*/
          ctx[9]
        ]
      ) : "") && input1.value !== input1_value_value) {
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
function create_fragment(ctx) {
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
  let each_value = ensure_array_like(
    /*splits*/
    ctx[1]
  );
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
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
      set_input_value(
        input,
        /*data*/
        ctx[0].attempts[
          /*category*/
          ctx[2]
        ]
      );
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
          listen(
            input,
            "input",
            /*input_input_handler*/
            ctx[4]
          ),
          listen(
            button,
            "click",
            /*resetSplits*/
            ctx[3]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (dirty & /*data, category*/
      5 && to_number(input.value) !== /*data*/
      ctx2[0].attempts[
        /*category*/
        ctx2[2]
      ]) {
        set_input_value(
          input,
          /*data*/
          ctx2[0].attempts[
            /*category*/
            ctx2[2]
          ]
        );
      }
      if (dirty & /*data, category, undefined, splits*/
      7) {
        each_value = ensure_array_like(
          /*splits*/
          ctx2[1]
        );
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
function instance($$self, $$props, $$invalidate) {
  let { splits } = $$props;
  let { data } = $$props;
  let { category } = $$props;
  function resetSplits() {
    let conf = confirm("Are you sure you want to reset all splits for this category?");
    if (!conf) return;
    $$invalidate(0, data.pb[category] = [], data);
    $$invalidate(0, data.bestSplits[category] = [], data);
  }
  function input_input_handler() {
    data.attempts[category] = to_number(this.value);
    $$invalidate(0, data);
  }
  const change_handler = (i, e) => {
    if (e.currentTarget.value === "") {
      $$invalidate(0, data.bestSplits[category][i] = void 0, data);
      return;
    }
    let ms = parseTime(e.currentTarget.value);
    if (!data.bestSplits[category]) $$invalidate(0, data.bestSplits[category] = [], data);
    $$invalidate(0, data.bestSplits[category][i] = ms, data);
  };
  const change_handler_1 = (i, e) => {
    let ms = parseTime(e.currentTarget.value);
    if (!data.pb[category]) $$invalidate(0, data.pb[category] = [], data);
    $$invalidate(0, data.pb[category][i] = ms, data);
  };
  $$self.$$set = ($$props2) => {
    if ("splits" in $$props2) $$invalidate(1, splits = $$props2.splits);
    if ("data" in $$props2) $$invalidate(0, data = $$props2.data);
    if ("category" in $$props2) $$invalidate(2, category = $$props2.category);
  };
  return [
    data,
    splits,
    category,
    resetSplits,
    input_input_handler,
    change_handler,
    change_handler_1
  ];
}
var FullGame = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, { splits: 1, data: 0, category: 2 });
  }
};
var FullGame_default = FullGame;

// src/settings/ILSettings.svelte
function add_css(target) {
  append_styles(target, "svelte-4osls6", ".grid.svelte-4osls6{display:grid;gap:5px;grid-template-columns:max-content max-content}");
}
function create_if_block(ctx) {
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
      input1.value = input1_value_value = /*data*/
      ctx[0].ilpbs[
        /*preboostsId*/
        ctx[3]
      ] ? fmtMs(
        /*data*/
        ctx[0].ilpbs[
          /*preboostsId*/
          ctx[3]
        ]
      ) : "";
      attr(div2, "class", "grid svelte-4osls6");
    },
    m(target, anchor) {
      insert(target, h2, anchor);
      insert(target, t1, anchor);
      insert(target, div2, anchor);
      append(div2, div0);
      append(div2, t3);
      append(div2, input0);
      set_input_value(
        input0,
        /*data*/
        ctx[0].attempts[
          /*preboostsId*/
          ctx[3]
        ]
      );
      append(div2, t4);
      append(div2, div1);
      append(div2, t6);
      append(div2, input1);
      if (!mounted) {
        dispose = [
          listen(
            input0,
            "input",
            /*input0_input_handler_1*/
            ctx[7]
          ),
          listen(
            input1,
            "change",
            /*change_handler_1*/
            ctx[8]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty & /*data, preboostsId*/
      9 && to_number(input0.value) !== /*data*/
      ctx2[0].attempts[
        /*preboostsId*/
        ctx2[3]
      ]) {
        set_input_value(
          input0,
          /*data*/
          ctx2[0].attempts[
            /*preboostsId*/
            ctx2[3]
          ]
        );
      }
      if (dirty & /*data*/
      1 && input1_value_value !== (input1_value_value = /*data*/
      ctx2[0].ilpbs[
        /*preboostsId*/
        ctx2[3]
      ] ? fmtMs(
        /*data*/
        ctx2[0].ilpbs[
          /*preboostsId*/
          ctx2[3]
        ]
      ) : "") && input1.value !== input1_value_value) {
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
function create_fragment2(ctx) {
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
  let if_block = (
    /*category*/
    ctx[1] !== "Current Patch" && create_if_block(ctx)
  );
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
      input1.value = input1_value_value = /*data*/
      ctx[0].ilpbs[
        /*id*/
        ctx[2]
      ] ? fmtMs(
        /*data*/
        ctx[0].ilpbs[
          /*id*/
          ctx[2]
        ]
      ) : "";
      attr(div2, "class", "grid svelte-4osls6");
    },
    m(target, anchor) {
      insert(target, h2, anchor);
      insert(target, t1, anchor);
      insert(target, div2, anchor);
      append(div2, div0);
      append(div2, t3);
      append(div2, input0);
      set_input_value(
        input0,
        /*data*/
        ctx[0].attempts[
          /*id*/
          ctx[2]
        ]
      );
      append(div2, t4);
      append(div2, div1);
      append(div2, t6);
      append(div2, input1);
      insert(target, t7, anchor);
      if (if_block) if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      if (!mounted) {
        dispose = [
          listen(
            input0,
            "input",
            /*input0_input_handler*/
            ctx[5]
          ),
          listen(
            input1,
            "change",
            /*change_handler*/
            ctx[6]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (dirty & /*data, id*/
      5 && to_number(input0.value) !== /*data*/
      ctx2[0].attempts[
        /*id*/
        ctx2[2]
      ]) {
        set_input_value(
          input0,
          /*data*/
          ctx2[0].attempts[
            /*id*/
            ctx2[2]
          ]
        );
      }
      if (dirty & /*data*/
      1 && input1_value_value !== (input1_value_value = /*data*/
      ctx2[0].ilpbs[
        /*id*/
        ctx2[2]
      ] ? fmtMs(
        /*data*/
        ctx2[0].ilpbs[
          /*id*/
          ctx2[2]
        ]
      ) : "") && input1.value !== input1_value_value) {
        input1.value = input1_value_value;
      }
      if (
        /*category*/
        ctx2[1] !== "Current Patch"
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
function instance2($$self, $$props, $$invalidate) {
  let { data } = $$props;
  let { category } = $$props;
  let { summit } = $$props;
  let id = `${category}-${summit}`;
  let preboostsId = `${category}-${summit}-preboosts`;
  function input0_input_handler() {
    data.attempts[id] = to_number(this.value);
    $$invalidate(0, data);
  }
  const change_handler = (e) => {
    if (!e.currentTarget.value) {
      $$invalidate(0, data.ilpbs[id] = null, data);
      return;
    }
    let ms = parseTime(e.currentTarget.value);
    $$invalidate(0, data.ilpbs[id] = ms, data);
  };
  function input0_input_handler_1() {
    data.attempts[preboostsId] = to_number(this.value);
    $$invalidate(0, data);
  }
  const change_handler_1 = (e) => {
    if (!e.currentTarget.value) {
      $$invalidate(0, data.ilpbs[preboostsId] = null, data);
      return;
    }
    let ms = parseTime(e.currentTarget.value);
    $$invalidate(0, data.ilpbs[preboostsId] = ms, data);
  };
  $$self.$$set = ($$props2) => {
    if ("data" in $$props2) $$invalidate(0, data = $$props2.data);
    if ("category" in $$props2) $$invalidate(1, category = $$props2.category);
    if ("summit" in $$props2) $$invalidate(4, summit = $$props2.summit);
  };
  return [
    data,
    category,
    id,
    preboostsId,
    summit,
    input0_input_handler,
    change_handler,
    input0_input_handler_1,
    change_handler_1
  ];
}
var ILSettings = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance2, create_fragment2, safe_not_equal, { data: 0, category: 1, summit: 4 }, add_css);
  }
};
var ILSettings_default = ILSettings;

// src/settings/DLDToggles.svelte
function add_css2(target) {
  append_styles(target, "svelte-1f1cdw0", ".row.svelte-1f1cdw0{display:flex;align-items:center;gap:10px}input.svelte-1f1cdw0{width:20px;height:20px;appearance:auto !important}.note.svelte-1f1cdw0{font-size:0.7em;color:gray}.error.svelte-1f1cdw0{color:red}");
}
function create_fragment3(ctx) {
  let div0;
  let select;
  let option0;
  let option1;
  let option2;
  let option3;
  let t4;
  let t5;
  let div1;
  let input0;
  let t6;
  let t7;
  let div2;
  let input1;
  let t8;
  let t9;
  let div3;
  let input2;
  let t10;
  let t11;
  let div4;
  let input3;
  let t12;
  let t13;
  let div5;
  let input4;
  let t14;
  let t15;
  let div6;
  let input5;
  let t16;
  let t17;
  let div7;
  let t19;
  let div8;
  let input6;
  let t20;
  let t21;
  let div9;
  let mounted;
  let dispose;
  return {
    c() {
      div0 = element("div");
      select = element("select");
      option0 = element("option");
      option0.textContent = "Top left";
      option1 = element("option");
      option1.textContent = "Top right";
      option2 = element("option");
      option2.textContent = "Bottom left";
      option3 = element("option");
      option3.textContent = "Bottom right";
      t4 = text("\r\n    Timer position");
      t5 = space();
      div1 = element("div");
      input0 = element("input");
      t6 = text("\r\n    Show splits");
      t7 = space();
      div2 = element("div");
      input1 = element("input");
      t8 = text("\r\n    Show split times");
      t9 = space();
      div3 = element("div");
      input2 = element("input");
      t10 = text("\r\n    Show split comparisons");
      t11 = space();
      div4 = element("div");
      input3 = element("input");
      t12 = text("\r\n    Show split time at end");
      t13 = space();
      div5 = element("div");
      input4 = element("input");
      t14 = text("\r\n    Show time of split in PB");
      t15 = space();
      div6 = element("div");
      input5 = element("input");
      t16 = text("\r\n    Start ILs upon using savestates to warp there");
      t17 = space();
      div7 = element("div");
      div7.textContent = "For summit one this will only happen if you don't have full game selected";
      t19 = space();
      div8 = element("div");
      input6 = element("input");
      t20 = text("\r\n    Automatically record all runs and save PBs");
      t21 = space();
      div9 = element("div");
      div9.textContent = `This requires that you have the InputRecorder plugin installed and enabled${/*hasInputRecorder*/
      ctx[1] ? "" : " (which you don't)"}`;
      option0.__value = "top left";
      set_input_value(option0, option0.__value);
      option1.__value = "top right";
      set_input_value(option1, option1.__value);
      option2.__value = "bottom left";
      set_input_value(option2, option2.__value);
      option3.__value = "bottom right";
      set_input_value(option3, option3.__value);
      if (
        /*data*/
        ctx[0].timerPosition === void 0
      ) add_render_callback(() => (
        /*select_change_handler*/
        ctx[2].call(select)
      ));
      attr(div0, "class", "row svelte-1f1cdw0");
      attr(input0, "type", "checkbox");
      attr(input0, "class", "svelte-1f1cdw0");
      attr(div1, "class", "row svelte-1f1cdw0");
      attr(input1, "type", "checkbox");
      attr(input1, "class", "svelte-1f1cdw0");
      attr(div2, "class", "row svelte-1f1cdw0");
      attr(input2, "type", "checkbox");
      attr(input2, "class", "svelte-1f1cdw0");
      attr(div3, "class", "row svelte-1f1cdw0");
      attr(input3, "type", "checkbox");
      attr(input3, "class", "svelte-1f1cdw0");
      attr(div4, "class", "row svelte-1f1cdw0");
      attr(input4, "type", "checkbox");
      attr(input4, "class", "svelte-1f1cdw0");
      attr(div5, "class", "row svelte-1f1cdw0");
      attr(input5, "type", "checkbox");
      attr(input5, "class", "svelte-1f1cdw0");
      attr(div6, "class", "row svelte-1f1cdw0");
      attr(div7, "class", "note svelte-1f1cdw0");
      attr(input6, "type", "checkbox");
      attr(input6, "class", "svelte-1f1cdw0");
      attr(div8, "class", "row svelte-1f1cdw0");
      attr(div9, "class", "note svelte-1f1cdw0");
      toggle_class(div9, "error", !/*hasInputRecorder*/
      ctx[1]);
    },
    m(target, anchor) {
      insert(target, div0, anchor);
      append(div0, select);
      append(select, option0);
      append(select, option1);
      append(select, option2);
      append(select, option3);
      select_option(
        select,
        /*data*/
        ctx[0].timerPosition,
        true
      );
      append(div0, t4);
      insert(target, t5, anchor);
      insert(target, div1, anchor);
      append(div1, input0);
      input0.checked = /*data*/
      ctx[0].showSplits;
      append(div1, t6);
      insert(target, t7, anchor);
      insert(target, div2, anchor);
      append(div2, input1);
      input1.checked = /*data*/
      ctx[0].showSplitTimes;
      append(div2, t8);
      insert(target, t9, anchor);
      insert(target, div3, anchor);
      append(div3, input2);
      input2.checked = /*data*/
      ctx[0].showSplitComparisons;
      append(div3, t10);
      insert(target, t11, anchor);
      insert(target, div4, anchor);
      append(div4, input3);
      input3.checked = /*data*/
      ctx[0].showSplitTimeAtEnd;
      append(div4, t12);
      insert(target, t13, anchor);
      insert(target, div5, anchor);
      append(div5, input4);
      input4.checked = /*data*/
      ctx[0].showPbSplits;
      append(div5, t14);
      insert(target, t15, anchor);
      insert(target, div6, anchor);
      append(div6, input5);
      input5.checked = /*data*/
      ctx[0].autostartILs;
      append(div6, t16);
      insert(target, t17, anchor);
      insert(target, div7, anchor);
      insert(target, t19, anchor);
      insert(target, div8, anchor);
      append(div8, input6);
      input6.checked = /*data*/
      ctx[0].autoRecord;
      append(div8, t20);
      insert(target, t21, anchor);
      insert(target, div9, anchor);
      if (!mounted) {
        dispose = [
          listen(
            select,
            "change",
            /*select_change_handler*/
            ctx[2]
          ),
          listen(
            input0,
            "change",
            /*input0_change_handler*/
            ctx[3]
          ),
          listen(
            input1,
            "change",
            /*input1_change_handler*/
            ctx[4]
          ),
          listen(
            input2,
            "change",
            /*input2_change_handler*/
            ctx[5]
          ),
          listen(
            input3,
            "change",
            /*input3_change_handler*/
            ctx[6]
          ),
          listen(
            input4,
            "change",
            /*input4_change_handler*/
            ctx[7]
          ),
          listen(
            input5,
            "change",
            /*input5_change_handler*/
            ctx[8]
          ),
          listen(
            input6,
            "change",
            /*input6_change_handler*/
            ctx[9]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (dirty & /*data*/
      1) {
        select_option(
          select,
          /*data*/
          ctx2[0].timerPosition
        );
      }
      if (dirty & /*data*/
      1) {
        input0.checked = /*data*/
        ctx2[0].showSplits;
      }
      if (dirty & /*data*/
      1) {
        input1.checked = /*data*/
        ctx2[0].showSplitTimes;
      }
      if (dirty & /*data*/
      1) {
        input2.checked = /*data*/
        ctx2[0].showSplitComparisons;
      }
      if (dirty & /*data*/
      1) {
        input3.checked = /*data*/
        ctx2[0].showSplitTimeAtEnd;
      }
      if (dirty & /*data*/
      1) {
        input4.checked = /*data*/
        ctx2[0].showPbSplits;
      }
      if (dirty & /*data*/
      1) {
        input5.checked = /*data*/
        ctx2[0].autostartILs;
      }
      if (dirty & /*data*/
      1) {
        input6.checked = /*data*/
        ctx2[0].autoRecord;
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div0);
        detach(t5);
        detach(div1);
        detach(t7);
        detach(div2);
        detach(t9);
        detach(div3);
        detach(t11);
        detach(div4);
        detach(t13);
        detach(div5);
        detach(t15);
        detach(div6);
        detach(t17);
        detach(div7);
        detach(t19);
        detach(div8);
        detach(t21);
        detach(div9);
      }
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance3($$self, $$props, $$invalidate) {
  let { data } = $$props;
  let hasInputRecorder = gimloader_default.plugins.isEnabled("InputRecorder");
  function select_change_handler() {
    data.timerPosition = select_value(this);
    $$invalidate(0, data);
  }
  function input0_change_handler() {
    data.showSplits = this.checked;
    $$invalidate(0, data);
  }
  function input1_change_handler() {
    data.showSplitTimes = this.checked;
    $$invalidate(0, data);
  }
  function input2_change_handler() {
    data.showSplitComparisons = this.checked;
    $$invalidate(0, data);
  }
  function input3_change_handler() {
    data.showSplitTimeAtEnd = this.checked;
    $$invalidate(0, data);
  }
  function input4_change_handler() {
    data.showPbSplits = this.checked;
    $$invalidate(0, data);
  }
  function input5_change_handler() {
    data.autostartILs = this.checked;
    $$invalidate(0, data);
  }
  function input6_change_handler() {
    data.autoRecord = this.checked;
    $$invalidate(0, data);
  }
  $$self.$$set = ($$props2) => {
    if ("data" in $$props2) $$invalidate(0, data = $$props2.data);
  };
  return [
    data,
    hasInputRecorder,
    select_change_handler,
    input0_change_handler,
    input1_change_handler,
    input2_change_handler,
    input3_change_handler,
    input4_change_handler,
    input5_change_handler,
    input6_change_handler
  ];
}
var DLDToggles = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance3, create_fragment3, safe_not_equal, { data: 0 }, add_css2);
  }
};
var DLDToggles_default = DLDToggles;

// src/settings/DLD.svelte
function get_each_context2(ctx, list, i) {
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
function create_each_block_1(ctx) {
  let option;
  let option_value_value;
  return {
    c() {
      option = element("option");
      option.textContent = `${/*category*/
      ctx[2]}`;
      option.__value = option_value_value = /*category*/
      ctx[2];
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
function create_each_block2(ctx) {
  let option;
  let option_value_value;
  return {
    c() {
      option = element("option");
      option.textContent = `${/*split*/
      ctx[5]}`;
      option.__value = option_value_value = /*i*/
      ctx[7];
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
function create_else_block(ctx) {
  let fullgame;
  let current;
  fullgame = new FullGame_default({
    props: {
      splits: DLDSplits,
      data: (
        /*data*/
        ctx[0]
      ),
      category: (
        /*category*/
        ctx[2]
      )
    }
  });
  return {
    c() {
      create_component(fullgame.$$.fragment);
    },
    m(target, anchor) {
      mount_component(fullgame, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const fullgame_changes = {};
      if (dirty & /*data*/
      1) fullgame_changes.data = /*data*/
      ctx2[0];
      if (dirty & /*category*/
      4) fullgame_changes.category = /*category*/
      ctx2[2];
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
function create_if_block2(ctx) {
  let ilsettings;
  let current;
  ilsettings = new ILSettings_default({
    props: {
      data: (
        /*data*/
        ctx[0]
      ),
      category: (
        /*category*/
        ctx[2]
      ),
      summit: parseInt(
        /*mode*/
        ctx[1]
      )
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
    p(ctx2, dirty) {
      const ilsettings_changes = {};
      if (dirty & /*data*/
      1) ilsettings_changes.data = /*data*/
      ctx2[0];
      if (dirty & /*category*/
      4) ilsettings_changes.category = /*category*/
      ctx2[2];
      if (dirty & /*mode*/
      2) ilsettings_changes.summit = parseInt(
        /*mode*/
        ctx2[1]
      );
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
function create_key_block_1(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block2, create_else_block];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (
      /*mode*/
      ctx2[1] !== "Full Game"
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
    p(ctx2, dirty) {
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
function create_key_block(ctx) {
  let previous_key = (
    /*category*/
    ctx[2]
  );
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
    p(ctx2, dirty) {
      if (dirty & /*category*/
      4 && safe_not_equal(previous_key, previous_key = /*category*/
      ctx2[2])) {
        group_outros();
        transition_out(key_block, 1, 1, noop);
        check_outros();
        key_block = create_key_block_1(ctx2);
        key_block.c();
        transition_in(key_block, 1);
        key_block.m(key_block_anchor.parentNode, key_block_anchor);
      } else {
        key_block.p(ctx2, dirty);
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
function create_fragment4(ctx) {
  let select0;
  let t0;
  let select1;
  let option;
  let t2;
  let previous_key = (
    /*mode*/
    ctx[1]
  );
  let t3;
  let hr;
  let t4;
  let dldtoggles;
  let current;
  let mounted;
  let dispose;
  let each_value_1 = ensure_array_like(categories);
  let each_blocks_1 = [];
  for (let i = 0; i < each_value_1.length; i += 1) {
    each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
  }
  let each_value = ensure_array_like(DLDSplits);
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block2(get_each_context2(ctx, each_value, i));
  }
  let key_block = create_key_block(ctx);
  dldtoggles = new DLDToggles_default({ props: { data: (
    /*data*/
    ctx[0]
  ) } });
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
      create_component(dldtoggles.$$.fragment);
      if (
        /*category*/
        ctx[2] === void 0
      ) add_render_callback(() => (
        /*select0_change_handler*/
        ctx[3].call(select0)
      ));
      option.__value = "Full Game";
      set_input_value(option, option.__value);
      if (
        /*mode*/
        ctx[1] === void 0
      ) add_render_callback(() => (
        /*select1_change_handler*/
        ctx[4].call(select1)
      ));
    },
    m(target, anchor) {
      insert(target, select0, anchor);
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        if (each_blocks_1[i]) {
          each_blocks_1[i].m(select0, null);
        }
      }
      select_option(
        select0,
        /*category*/
        ctx[2],
        true
      );
      insert(target, t0, anchor);
      insert(target, select1, anchor);
      append(select1, option);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(select1, null);
        }
      }
      select_option(
        select1,
        /*mode*/
        ctx[1],
        true
      );
      insert(target, t2, anchor);
      key_block.m(target, anchor);
      insert(target, t3, anchor);
      insert(target, hr, anchor);
      insert(target, t4, anchor);
      mount_component(dldtoggles, target, anchor);
      current = true;
      if (!mounted) {
        dispose = [
          listen(
            select0,
            "change",
            /*select0_change_handler*/
            ctx[3]
          ),
          listen(
            select1,
            "change",
            /*select1_change_handler*/
            ctx[4]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (dirty & /*category*/
      4) {
        select_option(
          select0,
          /*category*/
          ctx2[2]
        );
      }
      if (dirty & /*mode*/
      2) {
        select_option(
          select1,
          /*mode*/
          ctx2[1]
        );
      }
      if (dirty & /*mode*/
      2 && safe_not_equal(previous_key, previous_key = /*mode*/
      ctx2[1])) {
        group_outros();
        transition_out(key_block, 1, 1, noop);
        check_outros();
        key_block = create_key_block(ctx2);
        key_block.c();
        transition_in(key_block, 1);
        key_block.m(t3.parentNode, t3);
      } else {
        key_block.p(ctx2, dirty);
      }
      const dldtoggles_changes = {};
      if (dirty & /*data*/
      1) dldtoggles_changes.data = /*data*/
      ctx2[0];
      dldtoggles.$set(dldtoggles_changes);
    },
    i(local) {
      if (current) return;
      transition_in(key_block);
      transition_in(dldtoggles.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(key_block);
      transition_out(dldtoggles.$$.fragment, local);
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
      destroy_component(dldtoggles, detaching);
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance4($$self, $$props, $$invalidate) {
  let { data } = $$props;
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
  $$self.$$set = ($$props2) => {
    if ("data" in $$props2) $$invalidate(0, data = $$props2.data);
  };
  return [data, mode, category, select0_change_handler, select1_change_handler];
}
var DLD = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance4, create_fragment4, safe_not_equal, { data: 0 });
  }
};
var DLD_default = DLD;

// src/settings/SplitsToggles.svelte
function add_css3(target) {
  append_styles(target, "svelte-j38q7p", ".row.svelte-j38q7p{display:flex;align-items:center;gap:10px}input.svelte-j38q7p{width:20px;height:20px;appearance:auto !important}");
}
function create_fragment5(ctx) {
  let div0;
  let select;
  let option0;
  let option1;
  let option2;
  let option3;
  let t4;
  let t5;
  let div1;
  let input0;
  let t6;
  let t7;
  let div2;
  let input1;
  let t8;
  let t9;
  let div3;
  let input2;
  let t10;
  let t11;
  let div4;
  let input3;
  let t12;
  let t13;
  let div5;
  let input4;
  let t14;
  let mounted;
  let dispose;
  return {
    c() {
      div0 = element("div");
      select = element("select");
      option0 = element("option");
      option0.textContent = "Top left";
      option1 = element("option");
      option1.textContent = "Top right";
      option2 = element("option");
      option2.textContent = "Bottom left";
      option3 = element("option");
      option3.textContent = "Bottom right";
      t4 = text("\r\n    Timer position");
      t5 = space();
      div1 = element("div");
      input0 = element("input");
      t6 = text("\r\n    Show splits");
      t7 = space();
      div2 = element("div");
      input1 = element("input");
      t8 = text("\r\n    Show split times");
      t9 = space();
      div3 = element("div");
      input2 = element("input");
      t10 = text("\r\n    Show split comparisons");
      t11 = space();
      div4 = element("div");
      input3 = element("input");
      t12 = text("\r\n    Show split time at end");
      t13 = space();
      div5 = element("div");
      input4 = element("input");
      t14 = text("\r\n    Show time of split in PB");
      option0.__value = "top left";
      set_input_value(option0, option0.__value);
      option1.__value = "top right";
      set_input_value(option1, option1.__value);
      option2.__value = "bottom left";
      set_input_value(option2, option2.__value);
      option3.__value = "bottom right";
      set_input_value(option3, option3.__value);
      if (
        /*data*/
        ctx[0].timerPosition === void 0
      ) add_render_callback(() => (
        /*select_change_handler*/
        ctx[1].call(select)
      ));
      attr(div0, "class", "row svelte-j38q7p");
      attr(input0, "type", "checkbox");
      attr(input0, "class", "svelte-j38q7p");
      attr(div1, "class", "row svelte-j38q7p");
      attr(input1, "type", "checkbox");
      attr(input1, "class", "svelte-j38q7p");
      attr(div2, "class", "row svelte-j38q7p");
      attr(input2, "type", "checkbox");
      attr(input2, "class", "svelte-j38q7p");
      attr(div3, "class", "row svelte-j38q7p");
      attr(input3, "type", "checkbox");
      attr(input3, "class", "svelte-j38q7p");
      attr(div4, "class", "row svelte-j38q7p");
      attr(input4, "type", "checkbox");
      attr(input4, "class", "svelte-j38q7p");
      attr(div5, "class", "row svelte-j38q7p");
    },
    m(target, anchor) {
      insert(target, div0, anchor);
      append(div0, select);
      append(select, option0);
      append(select, option1);
      append(select, option2);
      append(select, option3);
      select_option(
        select,
        /*data*/
        ctx[0].timerPosition,
        true
      );
      append(div0, t4);
      insert(target, t5, anchor);
      insert(target, div1, anchor);
      append(div1, input0);
      input0.checked = /*data*/
      ctx[0].showSplits;
      append(div1, t6);
      insert(target, t7, anchor);
      insert(target, div2, anchor);
      append(div2, input1);
      input1.checked = /*data*/
      ctx[0].showSplitTimes;
      append(div2, t8);
      insert(target, t9, anchor);
      insert(target, div3, anchor);
      append(div3, input2);
      input2.checked = /*data*/
      ctx[0].showSplitComparisons;
      append(div3, t10);
      insert(target, t11, anchor);
      insert(target, div4, anchor);
      append(div4, input3);
      input3.checked = /*data*/
      ctx[0].showSplitTimeAtEnd;
      append(div4, t12);
      insert(target, t13, anchor);
      insert(target, div5, anchor);
      append(div5, input4);
      input4.checked = /*data*/
      ctx[0].showPbSplits;
      append(div5, t14);
      if (!mounted) {
        dispose = [
          listen(
            select,
            "change",
            /*select_change_handler*/
            ctx[1]
          ),
          listen(
            input0,
            "change",
            /*input0_change_handler*/
            ctx[2]
          ),
          listen(
            input1,
            "change",
            /*input1_change_handler*/
            ctx[3]
          ),
          listen(
            input2,
            "change",
            /*input2_change_handler*/
            ctx[4]
          ),
          listen(
            input3,
            "change",
            /*input3_change_handler*/
            ctx[5]
          ),
          listen(
            input4,
            "change",
            /*input4_change_handler*/
            ctx[6]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (dirty & /*data*/
      1) {
        select_option(
          select,
          /*data*/
          ctx2[0].timerPosition
        );
      }
      if (dirty & /*data*/
      1) {
        input0.checked = /*data*/
        ctx2[0].showSplits;
      }
      if (dirty & /*data*/
      1) {
        input1.checked = /*data*/
        ctx2[0].showSplitTimes;
      }
      if (dirty & /*data*/
      1) {
        input2.checked = /*data*/
        ctx2[0].showSplitComparisons;
      }
      if (dirty & /*data*/
      1) {
        input3.checked = /*data*/
        ctx2[0].showSplitTimeAtEnd;
      }
      if (dirty & /*data*/
      1) {
        input4.checked = /*data*/
        ctx2[0].showPbSplits;
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div0);
        detach(t5);
        detach(div1);
        detach(t7);
        detach(div2);
        detach(t9);
        detach(div3);
        detach(t11);
        detach(div4);
        detach(t13);
        detach(div5);
      }
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance5($$self, $$props, $$invalidate) {
  let { data } = $$props;
  function select_change_handler() {
    data.timerPosition = select_value(this);
    $$invalidate(0, data);
  }
  function input0_change_handler() {
    data.showSplits = this.checked;
    $$invalidate(0, data);
  }
  function input1_change_handler() {
    data.showSplitTimes = this.checked;
    $$invalidate(0, data);
  }
  function input2_change_handler() {
    data.showSplitComparisons = this.checked;
    $$invalidate(0, data);
  }
  function input3_change_handler() {
    data.showSplitTimeAtEnd = this.checked;
    $$invalidate(0, data);
  }
  function input4_change_handler() {
    data.showPbSplits = this.checked;
    $$invalidate(0, data);
  }
  $$self.$$set = ($$props2) => {
    if ("data" in $$props2) $$invalidate(0, data = $$props2.data);
  };
  return [
    data,
    select_change_handler,
    input0_change_handler,
    input1_change_handler,
    input2_change_handler,
    input3_change_handler,
    input4_change_handler
  ];
}
var SplitsToggles = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance5, create_fragment5, safe_not_equal, { data: 0 }, add_css3);
  }
};
var SplitsToggles_default = SplitsToggles;

// src/settings/Fishtopia.svelte
function create_fragment6(ctx) {
  let fullgame;
  let t0;
  let hr;
  let t1;
  let fishtopiatoggles;
  let current;
  fullgame = new FullGame_default({
    props: {
      splits: fishtopiaSplits,
      data: (
        /*data*/
        ctx[0]
      ),
      category: "fishtopia"
    }
  });
  fishtopiatoggles = new SplitsToggles_default({ props: { data: (
    /*data*/
    ctx[0]
  ) } });
  return {
    c() {
      create_component(fullgame.$$.fragment);
      t0 = space();
      hr = element("hr");
      t1 = space();
      create_component(fishtopiatoggles.$$.fragment);
    },
    m(target, anchor) {
      mount_component(fullgame, target, anchor);
      insert(target, t0, anchor);
      insert(target, hr, anchor);
      insert(target, t1, anchor);
      mount_component(fishtopiatoggles, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const fullgame_changes = {};
      if (dirty & /*data*/
      1) fullgame_changes.data = /*data*/
      ctx2[0];
      fullgame.$set(fullgame_changes);
      const fishtopiatoggles_changes = {};
      if (dirty & /*data*/
      1) fishtopiatoggles_changes.data = /*data*/
      ctx2[0];
      fishtopiatoggles.$set(fishtopiatoggles_changes);
    },
    i(local) {
      if (current) return;
      transition_in(fullgame.$$.fragment, local);
      transition_in(fishtopiatoggles.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(fullgame.$$.fragment, local);
      transition_out(fishtopiatoggles.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(t0);
        detach(hr);
        detach(t1);
      }
      destroy_component(fullgame, detaching);
      destroy_component(fishtopiatoggles, detaching);
    }
  };
}
function instance6($$self, $$props, $$invalidate) {
  let { data } = $$props;
  $$self.$$set = ($$props2) => {
    if ("data" in $$props2) $$invalidate(0, data = $$props2.data);
  };
  return [data];
}
var Fishtopia = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance6, create_fragment6, safe_not_equal, { data: 0 });
  }
};
var Fishtopia_default = Fishtopia;

// src/settings/OneWayOut.svelte
function create_fragment7(ctx) {
  let fullgame;
  let t0;
  let hr;
  let t1;
  let fishtopiatoggles;
  let current;
  fullgame = new FullGame_default({
    props: {
      splits: oneWayOutSplits,
      data: (
        /*data*/
        ctx[0]
      ),
      category: "OneWayOut"
    }
  });
  fishtopiatoggles = new SplitsToggles_default({ props: { data: (
    /*data*/
    ctx[0]
  ) } });
  return {
    c() {
      create_component(fullgame.$$.fragment);
      t0 = space();
      hr = element("hr");
      t1 = space();
      create_component(fishtopiatoggles.$$.fragment);
    },
    m(target, anchor) {
      mount_component(fullgame, target, anchor);
      insert(target, t0, anchor);
      insert(target, hr, anchor);
      insert(target, t1, anchor);
      mount_component(fishtopiatoggles, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const fullgame_changes = {};
      if (dirty & /*data*/
      1) fullgame_changes.data = /*data*/
      ctx2[0];
      fullgame.$set(fullgame_changes);
      const fishtopiatoggles_changes = {};
      if (dirty & /*data*/
      1) fishtopiatoggles_changes.data = /*data*/
      ctx2[0];
      fishtopiatoggles.$set(fishtopiatoggles_changes);
    },
    i(local) {
      if (current) return;
      transition_in(fullgame.$$.fragment, local);
      transition_in(fishtopiatoggles.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(fullgame.$$.fragment, local);
      transition_out(fishtopiatoggles.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(t0);
        detach(hr);
        detach(t1);
      }
      destroy_component(fullgame, detaching);
      destroy_component(fishtopiatoggles, detaching);
    }
  };
}
function instance7($$self, $$props, $$invalidate) {
  let { data } = $$props;
  $$self.$$set = ($$props2) => {
    if ("data" in $$props2) $$invalidate(0, data = $$props2.data);
  };
  return [data];
}
var OneWayOut = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance7, create_fragment7, safe_not_equal, { data: 0 });
  }
};
var OneWayOut_default = OneWayOut;

// src/settings/Settings.svelte
function add_css4(target) {
  append_styles(target, "svelte-94qc7l", "div:has(> .wrap){height:100%}.wrap.svelte-94qc7l.svelte-94qc7l{height:100%}.settings-content.svelte-94qc7l.svelte-94qc7l{height:calc(100% - 40px);overflow-y:auto}.tabs.svelte-94qc7l.svelte-94qc7l{display:flex;padding-left:10px;gap:10px;border-bottom:1px solid gray;height:37px}.tab.svelte-94qc7l.svelte-94qc7l{background-color:lightgray;border:1px solid gray;border-bottom:none;border-radius:10px;border-bottom-left-radius:0;border-bottom-right-radius:0}.tab.active.svelte-94qc7l.svelte-94qc7l{background-color:white}.actions.svelte-94qc7l.svelte-94qc7l{height:100%;display:flex;align-items:center;gap:10px}.actions.svelte-94qc7l button.svelte-94qc7l{margin:6px 0;padding:0 8px;height:25px;display:flex;align-items:center;justify-content:center;text-wrap:nowrap}");
}
function get_each_context3(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[9] = list[i];
  return child_ctx;
}
function create_each_block3(ctx) {
  let button;
  let mounted;
  let dispose;
  function click_handler() {
    return (
      /*click_handler*/
      ctx[7](
        /*tab*/
        ctx[9]
      )
    );
  }
  return {
    c() {
      button = element("button");
      button.textContent = `${/*tab*/
      ctx[9]}`;
      attr(button, "class", "tab svelte-94qc7l");
      toggle_class(
        button,
        "active",
        /*activeTab*/
        ctx[0] === /*tab*/
        ctx[9]
      );
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
      if (dirty & /*activeTab*/
      1) {
        toggle_class(
          button,
          "active",
          /*activeTab*/
          ctx[0] === /*tab*/
          ctx[9]
        );
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
function create_if_block_2(ctx) {
  let onewayout;
  let current;
  onewayout = new OneWayOut_default({
    props: { data: (
      /*data*/
      ctx[1].OneWayOut
    ) }
  });
  return {
    c() {
      create_component(onewayout.$$.fragment);
    },
    m(target, anchor) {
      mount_component(onewayout, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const onewayout_changes = {};
      if (dirty & /*data*/
      2) onewayout_changes.data = /*data*/
      ctx2[1].OneWayOut;
      onewayout.$set(onewayout_changes);
    },
    i(local) {
      if (current) return;
      transition_in(onewayout.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(onewayout.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(onewayout, detaching);
    }
  };
}
function create_if_block_1(ctx) {
  let fishtopia;
  let current;
  fishtopia = new Fishtopia_default({
    props: { data: (
      /*data*/
      ctx[1].Fishtopia
    ) }
  });
  return {
    c() {
      create_component(fishtopia.$$.fragment);
    },
    m(target, anchor) {
      mount_component(fishtopia, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const fishtopia_changes = {};
      if (dirty & /*data*/
      2) fishtopia_changes.data = /*data*/
      ctx2[1].Fishtopia;
      fishtopia.$set(fishtopia_changes);
    },
    i(local) {
      if (current) return;
      transition_in(fishtopia.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(fishtopia.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(fishtopia, detaching);
    }
  };
}
function create_if_block3(ctx) {
  let dld;
  let current;
  dld = new DLD_default({ props: { data: (
    /*data*/
    ctx[1].DLD
  ) } });
  return {
    c() {
      create_component(dld.$$.fragment);
    },
    m(target, anchor) {
      mount_component(dld, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const dld_changes = {};
      if (dirty & /*data*/
      2) dld_changes.data = /*data*/
      ctx2[1].DLD;
      dld.$set(dld_changes);
    },
    i(local) {
      if (current) return;
      transition_in(dld.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(dld.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(dld, detaching);
    }
  };
}
function create_fragment8(ctx) {
  let div3;
  let div1;
  let t0;
  let div0;
  let button0;
  let t2;
  let button1;
  let t4;
  let button2;
  let t6;
  let button3;
  let t8;
  let div2;
  let current_block_type_index;
  let if_block;
  let current;
  let mounted;
  let dispose;
  let each_value = ensure_array_like(gamemodes);
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block3(get_each_context3(ctx, each_value, i));
  }
  const if_block_creators = [create_if_block3, create_if_block_1, create_if_block_2];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (
      /*activeTab*/
      ctx2[0] === "DLD"
    ) return 0;
    if (
      /*activeTab*/
      ctx2[0] === "Fishtopia"
    ) return 1;
    if (
      /*activeTab*/
      ctx2[0] === "OneWayOut"
    ) return 2;
    return -1;
  }
  if (~(current_block_type_index = select_block_type(ctx, -1))) {
    if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  }
  return {
    c() {
      div3 = element("div");
      div1 = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      t0 = space();
      div0 = element("div");
      button0 = element("button");
      button0.textContent = "All \u2B73";
      t2 = space();
      button1 = element("button");
      button1.textContent = "All \u2B71";
      t4 = space();
      button2 = element("button");
      button2.textContent = "Mode \u2B73";
      t6 = space();
      button3 = element("button");
      button3.textContent = "Mode \u2B71";
      t8 = space();
      div2 = element("div");
      if (if_block) if_block.c();
      attr(button0, "class", "svelte-94qc7l");
      attr(button1, "class", "svelte-94qc7l");
      attr(button2, "class", "svelte-94qc7l");
      attr(button3, "class", "svelte-94qc7l");
      attr(div0, "class", "actions svelte-94qc7l");
      attr(div1, "class", "tabs svelte-94qc7l");
      attr(div2, "class", "settings-content svelte-94qc7l");
      attr(div3, "class", "wrap svelte-94qc7l");
    },
    m(target, anchor) {
      insert(target, div3, anchor);
      append(div3, div1);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div1, null);
        }
      }
      append(div1, t0);
      append(div1, div0);
      append(div0, button0);
      append(div0, t2);
      append(div0, button1);
      append(div0, t4);
      append(div0, button2);
      append(div0, t6);
      append(div0, button3);
      append(div3, t8);
      append(div3, div2);
      if (~current_block_type_index) {
        if_blocks[current_block_type_index].m(div2, null);
      }
      current = true;
      if (!mounted) {
        dispose = [
          listen(
            button0,
            "click",
            /*exportAll*/
            ctx[2]
          ),
          listen(
            button1,
            "click",
            /*importAll*/
            ctx[3]
          ),
          listen(
            button2,
            "click",
            /*exportMode*/
            ctx[4]
          ),
          listen(
            button3,
            "click",
            /*importMode*/
            ctx[5]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (dirty & /*activeTab*/
      1) {
        each_value = ensure_array_like(gamemodes);
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context3(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block3(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(div1, t0);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value.length;
      }
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
          if_block.m(div2, null);
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
        detach(div3);
      }
      destroy_each(each_blocks, detaching);
      if (~current_block_type_index) {
        if_blocks[current_block_type_index].d();
      }
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance8($$self, $$props, $$invalidate) {
  let activeTab = gamemodes[0];
  let dataObj = {};
  for (let gamemode of gamemodes) {
    dataObj[gamemode] = getGamemodeData(gamemode);
  }
  let data = dataObj;
  function save() {
    for (let gamemode of gamemodes) {
      window.GL.storage.setValue("Autosplitter", `${gamemode}Data`, data[gamemode]);
    }
  }
  function exportAll() {
    let json = {};
    for (let gamemode of gamemodes) {
      let data2 = window.GL.storage.getValue("Autosplitter", `${gamemode}Data`);
      if (!data2) continue;
      json[gamemode] = data2;
    }
    downloadFile(JSON.stringify(json), "splits.json");
  }
  function importAll() {
    readFile().then((newData) => {
      for (let gamemode of gamemodes) {
        if (!newData[gamemode]) continue;
        $$invalidate(1, data[gamemode] = newData[gamemode], data);
        window.GL.storage.setValue("Autosplitter", `${gamemode}Data`, newData[gamemode]);
      }
    });
  }
  function exportMode() {
    let json = data[activeTab];
    downloadFile(JSON.stringify(json), `${activeTab}.json`);
  }
  function importMode() {
    readFile().then((newData) => {
      $$invalidate(1, data[activeTab] = newData, data);
      window.GL.storage.setValue("Autosplitter", `${activeTab}Data`, newData);
    });
  }
  const click_handler = (tab) => $$invalidate(0, activeTab = tab);
  return [
    activeTab,
    data,
    exportAll,
    importAll,
    exportMode,
    importMode,
    save,
    click_handler
  ];
}
var Settings = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance8, create_fragment8, safe_not_equal, { save: 6 }, add_css4);
  }
  get save() {
    return this.$$.ctx[6];
  }
};
var Settings_default = Settings;

// src/styles.scss
var styles_default = `#timer {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.85);
  color: white;
  z-index: 99;
}
#timer.top {
  top: 0;
}
#timer.bottom {
  bottom: 0;
}
#timer.left {
  left: 0;
}
#timer.right {
  right: 0;
}
#timer .restart {
  background-color: transparent;
  border: none;
  width: 20px;
  height: 20px;
  margin: 0;
  padding: 0;
}
#timer .restart svg {
  width: 20px;
  height: 20px;
}
#timer .bar {
  display: flex;
  align-items: center;
  padding: 5px 10px;
  gap: 10px;
}
#timer select {
  background: transparent;
  appearance: auto;
  padding: 0;
}
#timer option {
  background-color: black;
}
#timer .runType {
  padding-left: 10px;
}
#timer table {
  width: 100%;
}
#timer tr:nth-child(even) {
  background-color: rgba(255, 255, 255, 0.12);
}
#timer tr.active {
  background-color: rgba(28, 145, 235, 0.864);
}
#timer td:first-child {
  padding-left: 10px;
}
#timer .attempts {
  flex-grow: 1;
  text-align: right;
}
#timer .total {
  font-size: xx-large;
  width: 100%;
  text-align: right;
  padding-right: 10px;
}
#timer .ahead {
  color: green;
}
#timer .behind {
  color: red;
}
#timer .best {
  color: gold;
}`;

// src/splitters/autosplitter.ts
var Autosplitter = class {
  constructor(id) {
    this.id = id;
    this.loadData();
    gimloader_default.onStop(() => this.destroy());
  }
  data;
  loadData() {
    this.data = getGamemodeData(this.id);
  }
  save() {
    gimloader_default.storage.setValue(`${this.id}Data`, this.data);
  }
  get attempts() {
    return this.data.attempts[this.getCategoryId()] ?? 0;
  }
  addAttempt() {
    this.data.attempts[this.getCategoryId()] = this.attempts + 1;
    this.save();
  }
};
var SplitsAutosplitter = class extends Autosplitter {
  get pb() {
    let pb = this.data.pb[this.getCategoryId()];
    if (pb) return pb[pb.length - 1];
  }
  get pbSplits() {
    let categoryId = this.getCategoryId();
    if (!this.data.pb[categoryId]) this.data.pb[categoryId] = [];
    return this.data.pb[this.getCategoryId()];
  }
  get bestSplits() {
    let categoryId = this.getCategoryId();
    if (!this.data.bestSplits[categoryId]) this.data.bestSplits[categoryId] = [];
    return this.data.bestSplits[this.getCategoryId()];
  }
};

// src/ui/basic.ts
var BasicUI = class {
  constructor(autosplitter2) {
    this.autosplitter = autosplitter2;
    this.element = document.createElement("div");
    this.element.id = "timer";
    this.element.className = autosplitter2.data.timerPosition;
    let topBar = document.createElement("div");
    topBar.classList.add("bar");
    this.attemptsEl = document.createElement("div");
    this.attemptsEl.classList.add("attempts");
    this.attemptsEl.innerText = autosplitter2.attempts.toString();
    topBar.appendChild(this.attemptsEl);
    this.element.appendChild(topBar);
    this.total = document.createElement("div");
    this.total.classList.add("total");
    this.total.innerText = "0.00";
    this.element.appendChild(this.total);
    document.body.appendChild(this.element);
  }
  element;
  total;
  attemptsEl;
  start() {
    this.setTotalAhead(true);
  }
  update(totalMs) {
    this.total.innerText = fmtMs(totalMs);
    if (this.autosplitter.pb) {
      let amountBehind = totalMs - this.autosplitter.pb;
      if (amountBehind > 0) this.setTotalAhead(false);
    }
  }
  setTotalAhead(ahead) {
    this.total.classList.toggle("ahead", ahead);
    this.total.classList.toggle("behind", !ahead);
  }
  updateAttempts() {
    this.attemptsEl.innerText = this.autosplitter.attempts.toString();
  }
  remove() {
    this.element?.remove();
  }
};

// src/ui/splits.ts
var SplitsUI = class extends BasicUI {
  constructor(autosplitter2, splitNames) {
    super(autosplitter2);
    this.autosplitter = autosplitter2;
    this.splitNames = splitNames;
    let table = document.createElement("table");
    if (this.autosplitter.data.showSplits) this.element.appendChild(table);
    for (let name of this.splitNames) {
      let row = document.createElement("tr");
      row.innerHTML = `
            <td style="min-width: 120px;">${name}</td>
            <td style="min-width: 60px; ${this.autosplitter.data.showSplitTimes ? "" : "display: none"}"></td>
            <td style="min-width: 80px; ${this.autosplitter.data.showSplitComparisons ? "" : "display: none"}"></td>
            <td style="min-width: 60px; ${this.autosplitter.data.showSplitTimeAtEnd ? "" : "display: none"}"></td>`;
      this.splitRows.push(row);
      this.splitDatas.push(Array.from(row.children));
      table.appendChild(row);
    }
    if (this.autosplitter.data.showPbSplits) {
      for (let i = 0; i < this.autosplitter.pbSplits.length; i++) {
        let split = this.autosplitter.pbSplits[i];
        if (!split) continue;
        this.splitDatas[i][3].innerText = fmtMs(split);
      }
    }
    this.element.appendChild(this.total);
  }
  splitTimes = [];
  previousActiveRow = null;
  splitRows = [];
  splitDatas = [];
  activeSplit = null;
  setActiveSplit(index) {
    if (index >= this.splitRows.length) {
      if (this.previousActiveRow) this.previousActiveRow.classList.remove("active");
      this.activeSplit = null;
      return;
    }
    if (this.previousActiveRow) this.previousActiveRow.classList.remove("active");
    this.splitRows[index].classList.add("active");
    this.previousActiveRow = this.splitRows[index];
    this.activeSplit = index;
  }
  updateSplit(totalMs, splitIndex, splitMs) {
    this.splitDatas[splitIndex][1].innerText = fmtMs(splitMs);
    let pb = this.autosplitter.pbSplits?.[splitIndex];
    if (!pb) return;
    let amountBehind = totalMs - pb;
    if (amountBehind <= 0) {
      this.setTotalAhead(true);
      return;
    }
    if (this.autosplitter.data.showSplitComparisons) {
      this.splitDatas[splitIndex][2].innerText = `+${fmtMs(amountBehind)}`;
      this.splitDatas[splitIndex][2].classList.add("behind");
    }
    this.setTotalAhead(false);
  }
  finishSplit(totalMs, splitIndex, splitMs) {
    let els = this.splitDatas[splitIndex];
    els[3].innerText = fmtMs(totalMs);
    let pb = this.autosplitter.pbSplits[splitIndex];
    let bestSplit = this.autosplitter.bestSplits[splitIndex];
    if (!pb || !bestSplit) return;
    let ahead = pb === void 0 || totalMs <= pb;
    let best = bestSplit !== void 0 && splitMs < bestSplit;
    if (ahead) els[2].innerText = `-${fmtMs(-totalMs + pb)}`;
    else els[2].innerText = `+${fmtMs(totalMs - pb)}`;
    if (best) els[2].classList.add("best");
    else if (ahead) els[2].classList.add("ahead");
    else els[2].classList.add("behind");
  }
};

// src/timers/basic.ts
var BasicTimer = class {
  constructor(autosplitter2, ui) {
    this.autosplitter = autosplitter2;
    this.ui = ui;
  }
  started = false;
  startTime = 0;
  now = 0;
  get elapsed() {
    return this.now - this.startTime;
  }
  start() {
    this.startTime = performance.now();
    this.started = true;
    this.ui.start();
  }
  stop() {
    this.started = false;
    let pb = this.autosplitter.pb;
    if (!pb || this.elapsed < pb) {
      this.autosplitter.data.pb[this.autosplitter.getCategoryId()] = this.elapsed;
      this.autosplitter.save();
    }
  }
  update() {
    if (!this.started) return;
    this.now = performance.now();
    this.ui.update(this.elapsed);
  }
};

// src/timers/splits.ts
var SplitsTimer = class extends BasicTimer {
  constructor(autosplitter2, ui) {
    super(autosplitter2, ui);
    this.autosplitter = autosplitter2;
    this.ui = ui;
  }
  currentSplit = 0;
  splitStart = 0;
  splits = [];
  get splitElapsed() {
    return this.now - this.splitStart;
  }
  start() {
    super.start();
    this.splitStart = this.startTime;
    this.ui.setActiveSplit(0);
  }
  stop() {
    this.started = false;
    let pb = this.autosplitter.pb;
    if (!pb || this.splits[this.splits.length - 1] < pb) {
      this.autosplitter.data.pb[this.autosplitter.getCategoryId()] = this.splits;
      this.autosplitter.save();
    }
  }
  split() {
    this.ui.finishSplit(this.elapsed, this.currentSplit, this.splitElapsed);
    let bestSplit = this.autosplitter.bestSplits[this.currentSplit];
    if (!bestSplit || this.splitElapsed < bestSplit) {
      this.autosplitter.bestSplits[this.currentSplit] = this.splitElapsed;
      this.autosplitter.save();
    }
    this.splits.push(this.elapsed);
    this.currentSplit++;
    this.splitStart = this.now;
    this.ui.setActiveSplit(this.currentSplit);
  }
  update() {
    if (!this.started) return;
    super.update();
    let elapsed = this.now - this.startTime;
    this.ui.updateSplit(elapsed, this.currentSplit, this.splitElapsed);
  }
};

// src/splitters/fishtopia.ts
var FishtopiaAutosplitter = class extends SplitsAutosplitter {
  ui = new SplitsUI(this, fishtopiaSplits);
  timer = new SplitsTimer(this, this.ui);
  usedChannels = /* @__PURE__ */ new Set();
  constructor() {
    super("Fishtopia");
    let gameSession = gimloader_default.net.room.state.session.gameSession;
    gimloader_default.net.room.state.session.listen("loadingPhase", (val) => {
      if (val) return;
      if (gameSession.phase === "game") {
        this.addAttempt();
        this.ui.updateAttempts();
        this.timer.start();
      }
    });
    gameSession.listen("phase", (phase) => {
      if (phase === "results") {
        this.reset();
      }
    });
    gimloader_default.net.on("send:MESSAGE_FOR_DEVICE", (e) => {
      let id2 = e.deviceId;
      if (!id2) return;
      let device = gimloader_default.stores.phaser.scene.worldManager.devices.getDeviceById(id2);
      let channel = device?.options?.channel;
      if (!channel) return;
      if (!boatChannels.includes(channel)) return;
      if (this.usedChannels.has(channel)) return;
      this.usedChannels.add(channel);
      gimloader_default.net.once("PHYSICS_STATE", (e2) => {
        if (e2.teleport) {
          this.timer.split();
        }
      });
    });
    let id = gimloader_default.stores.phaser.mainCharacter.id;
    gimloader_default.net.room.state.characters.get(id).inventory.slots.onChange((_, key) => {
      if (key === "gim-fish") {
        this.timer.split();
        this.timer.stop();
      }
    });
    onFrame(() => {
      this.timer.update();
    });
  }
  getCategoryId() {
    return "fishtopia";
  }
  reset() {
    this.ui?.remove();
    this.ui = new SplitsUI(this, fishtopiaSplits);
    this.timer = new SplitsTimer(this, this.ui);
    this.usedChannels.clear();
  }
  destroy() {
    this.ui.remove();
  }
};

// node_modules/gimloader/global.js
var global_default = GL;

// assets/restore.svg
var restore_default = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M13,3A9,9 0 0,0 4,12H1L4.89,15.89L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3Z" fill="white" /></svg>';

// src/ui/DLD.ts
function addDLDUI(element2, autosplitter2) {
  let topBar = element2.querySelector(".bar");
  let categorySelect = document.createElement("select");
  topBar.firstChild.before(categorySelect);
  for (let category of categories) {
    let option = document.createElement("option");
    option.value = category;
    option.innerText = category;
    if (category === autosplitter2.category) option.selected = true;
    categorySelect.appendChild(option);
  }
  let runTypeBar = document.createElement("div");
  runTypeBar.classList.add("bar");
  let runTypeSelect = document.createElement("select");
  runTypeSelect.innerHTML = `<option value="Full Game">Full Game</option>`;
  for (let i = 0; i < DLDSplits.length; i++) {
    let option = document.createElement("option");
    option.value = String(i);
    option.innerText = DLDSplits[i];
    if (autosplitter2.data.mode === "Summit" && autosplitter2.data.ilSummit === i) option.selected = true;
    runTypeSelect.appendChild(option);
  }
  runTypeBar.appendChild(runTypeSelect);
  let preboostSelect = document.createElement("select");
  preboostSelect.innerHTML = `
    <option value="false">No Preboosts</option>
    <option value="true">Preboosts</option>`;
  preboostSelect.value = String(autosplitter2.data.ilPreboosts);
  if (autosplitter2.category === "Current Patch") preboostSelect.disabled = true;
  categorySelect.addEventListener("change", () => {
    autosplitter2.setCategory(categorySelect.value);
    if (categorySelect.value === "Current Patch") {
      preboostSelect.value = "false";
      preboostSelect.disabled = true;
    } else {
      preboostSelect.disabled = false;
    }
  });
  if (runTypeSelect.value !== "Full Game") {
    runTypeBar.appendChild(preboostSelect);
  }
  runTypeSelect.addEventListener("change", () => {
    if (runTypeSelect.value === "Full Game") {
      preboostSelect.remove();
      autosplitter2.setMode("Full Game");
    } else {
      runTypeBar.appendChild(preboostSelect);
      autosplitter2.setMode("Summit", parseInt(runTypeSelect.value), preboostSelect.value === "true");
    }
  });
  preboostSelect.addEventListener("change", () => {
    autosplitter2.setMode("Summit", parseInt(runTypeSelect.value), preboostSelect.value === "true");
  });
  topBar.after(runTypeBar);
}
function lockInCategory(element2, autosplitter2) {
  let selects = element2.querySelectorAll("select");
  for (let select of selects) {
    select.disabled = true;
    select.title = "Cannot be altered mid-run";
  }
  let resetButton = document.createElement("button");
  resetButton.classList.add("restart");
  resetButton.innerHTML = restore_default;
  resetButton.addEventListener("click", () => {
    autosplitter2.reset();
  });
  element2.firstChild?.firstChild?.before(resetButton);
}
var DLDFullGameUI = class extends SplitsUI {
  constructor(autosplitter2) {
    super(autosplitter2, DLDSplits);
    this.autosplitter = autosplitter2;
    addDLDUI(this.element, autosplitter2);
  }
  lockInCategory() {
    lockInCategory(this.element, this.autosplitter);
  }
};
var DLDSummitUI = class extends BasicUI {
  constructor(autosplitter2) {
    super(autosplitter2);
    this.autosplitter = autosplitter2;
    addDLDUI(this.element, autosplitter2);
  }
  lockInCategory() {
    lockInCategory(this.element, this.autosplitter);
  }
};

// src/splitters/DLD.ts
var DLDAutosplitter2 = class extends SplitsAutosplitter {
  ui;
  timer;
  category = "Current Patch";
  couldStartLastFrame = true;
  loadedCorrectSummit = false;
  hasMoved = false;
  autoRecording = false;
  constructor() {
    super("DLD");
    this.category = "Current Patch";
    if (gimloader_default.plugins.isEnabled("BringBackBoosts")) {
      let bbbSettings = global_default.storage.getValue("BringBackBoosts", "QS-Settings", {});
      if (bbbSettings.useOriginalPhysics) {
        this.category = "Original Physics";
      } else {
        this.category = "Creative Platforming Patch";
      }
    }
    if (this.category === "Current Patch") {
      this.data.ilPreboosts = false;
    }
    this.updateTimerAndUI();
    onPhysicsStep(() => {
      let input = gimloader_default.stores.phaser.scene.inputManager.getPhysicsInput();
      if (input.jump || input.angle !== null) this.hasMoved = true;
    });
    onFrame(() => {
      if (this.data.mode === "Full Game") this.updateFullGame();
      else if (this.data.ilPreboosts) this.updatePreboosts();
      else this.updateNoPreboosts();
      this.hasMoved = false;
    });
    let savestates = gimloader_default.plugin("Savestates");
    if (savestates) {
      savestates.onStateLoaded(this.onStateLoadedBound);
    }
  }
  updateTimerAndUI() {
    this.ui?.remove();
    if (this.data.mode === "Full Game") {
      let ui = new DLDFullGameUI(this);
      this.ui = ui;
      this.timer = new SplitsTimer(this, ui);
    } else {
      let ui = new DLDSummitUI(this);
      this.ui = ui;
      this.timer = new BasicTimer(this, ui);
    }
  }
  getCategoryId() {
    if (this.data.mode === "Full Game") return this.category;
    if (this.data.ilPreboosts) return `${this.category}-${this.data.ilSummit}-preboosts`;
    return `${this.category}-${this.data.ilSummit}`;
  }
  setMode(mode, ilsummit, ilPreboosts) {
    if (this.category === "Current Patch") ilPreboosts = false;
    let modeChanged = this.data.mode !== mode;
    this.data.mode = mode;
    if (ilsummit !== void 0) this.data.ilSummit = ilsummit;
    if (ilPreboosts !== void 0) this.data.ilPreboosts = ilPreboosts;
    this.save();
    this.couldStartLastFrame = true;
    if (modeChanged) {
      this.updateTimerAndUI();
    } else {
      this.ui.updateAttempts();
    }
  }
  setCategory(name) {
    this.category = name;
    this.ui.updateAttempts();
  }
  ilState = "waiting";
  updatePreboosts() {
    let body = gimloader_default.stores.phaser.mainCharacter.body;
    let coords = summitCoords[this.data.ilSummit];
    if (this.ilState === "waiting") {
      if (inArea(body, coords)) {
        if (this.couldStartLastFrame) return;
        this.ilState = "started";
        this.timer.start();
        this.onRunStart();
        this.timer.update();
      } else {
        this.couldStartLastFrame = false;
      }
    } else if (this.ilState === "started") {
      if (inArea(body, summitStartCoords[this.data.ilSummit + 1])) {
        this.ilState = "completed";
        this.couldStartLastFrame = true;
        this.onRunEnd();
      } else {
        this.timer.update();
      }
    }
  }
  updateNoPreboosts() {
    if (!this.loadedCorrectSummit) return;
    let body = gimloader_default.stores.phaser.mainCharacter.body;
    if (this.ilState === "waiting") {
      if (this.hasMoved) {
        this.ilState = "started";
        this.timer.start();
        this.onRunStart();
        this.timer.update();
      }
    } else if (this.ilState === "started") {
      if (inArea(body, summitStartCoords[this.data.ilSummit + 1])) {
        this.ilState = "completed";
        this.onRunEnd();
      } else {
        this.timer.update();
      }
    }
  }
  summit = 0;
  updateFullGame() {
    let body = gimloader_default.stores.phaser.mainCharacter.body;
    if (this.summit > 0 && body.x < resetCoordinates.x && body.y > resetCoordinates.y) {
      this.reset();
      return;
    }
    if (this.summit > summitStartCoords.length - 1) return;
    if (this.summit === 0) {
      if (body.x > summitStartCoords[0].x && body.y < summitStartCoords[0].y + 10) {
        if (this.couldStartLastFrame) return;
        this.summit = 1;
        this.timer.start();
        this.onRunStart();
      } else {
        this.couldStartLastFrame = false;
      }
    } else if (inArea(body, summitStartCoords[this.summit])) {
      this.summit++;
      this.timer.split();
      if (this.summit > summitStartCoords.length - 1) {
        this.onRunEnd();
      }
    }
    this.timer.update();
  }
  getRecorder() {
    let inputRecorder = gimloader_default.plugin("InputRecorder");
    if (!inputRecorder) return;
    return inputRecorder.getRecorder();
  }
  onRunStart() {
    this.addAttempt();
    this.ui.updateAttempts();
    this.ui.lockInCategory();
    if (!this.data.autoRecord) return;
    let recorder = this.getRecorder();
    if (!recorder) return;
    if (recorder.recording || recorder.playing) return;
    recorder.startRecording();
    this.autoRecording = true;
  }
  onRunEnd() {
    this.timer.stop();
    if (!this.data.autoRecord) return;
    let recorder = this.getRecorder();
    if (!recorder) return;
    if (!recorder.recording || recorder.playing || !this.autoRecording) return;
    this.autoRecording = false;
    let isPb = !this.pb || this.timer.elapsed < this.pb;
    if (!isPb) return;
    let username = gimloader_default.stores.phaser.mainCharacter.nametag.name;
    let mode = "Full Game";
    if (this.data.mode !== "Full Game") {
      mode = `Summit ${this.data.ilSummit + 1}`;
      if (this.data.ilPreboosts) mode += " (Preboosts)";
    }
    let time = fmtMs(this.timer.elapsed);
    recorder.stopRecording(isPb, `recording-${username}-${this.category}-${mode}-${time}.json`);
    gimloader_default.notification.open({ message: `Auto-saved PB of ${time}`, placement: "topLeft" });
  }
  onStateLoaded(summit) {
    if (summit === "custom") return;
    if (this.data.autostartILs) {
      if (summit === 1 && this.data.mode === "Full Game") return;
      this.setMode("Summit", summit - 1);
      this.reset();
      if (!this.data.ilPreboosts) this.loadedCorrectSummit = true;
      return;
    }
    if (this.data.mode === "Full Game") return;
    if (this.data.ilPreboosts) return;
    if (this.ilState !== "waiting") {
      this.reset();
    }
    this.loadedCorrectSummit = summit === this.data.ilSummit + 1;
  }
  onStateLoadedBound = this.onStateLoaded.bind(this);
  reset() {
    this.updateTimerAndUI();
    this.summit = 0;
    this.ilState = "waiting";
    this.couldStartLastFrame = true;
    this.loadedCorrectSummit = false;
    let recorder = this.getRecorder();
    if (recorder && recorder.recording && this.autoRecording) {
      recorder.stopRecording(false);
    }
  }
  destroy() {
    this.ui.remove();
    let savestates = gimloader_default.plugin("Savestates");
    if (savestates) {
      savestates.offStateLoaded(this.onStateLoadedBound);
    }
  }
};

// src/ui/oneWayOut.ts
var OneWayOutUI = class extends SplitsUI {
  constructor(autosplitter2) {
    super(autosplitter2, oneWayOutSplits);
    this.autosplitter = autosplitter2;
    this.dropRateDiv = document.createElement("div");
    this.dropRateDiv.innerText = "0/0";
    let bar = this.element.querySelector(".bar");
    bar?.insertBefore(this.dropRateDiv, bar?.firstChild);
  }
  dropRateDiv;
  setDropRate(rate) {
    this.dropRateDiv.innerText = rate;
  }
};

// src/splitters/OneWayOut.ts
var OneWayOutAutosplitter = class extends SplitsAutosplitter {
  ui = new OneWayOutUI(this);
  timer = new SplitsTimer(this, this.ui);
  stage = 0;
  drops = 0;
  knockouts = 0;
  constructor() {
    super("OneWayOut");
    let gameSession = gimloader_default.net.room.state.session.gameSession;
    gimloader_default.net.on("DEVICES_STATES_CHANGES", (msg) => {
      for (let change of msg.changes) {
        if (msg.values[change[1][0]] === "GLOBAL_healthPercent") {
          let device = gimloader_default.stores.phaser.scene.worldManager.devices.getDeviceById(change[0]);
          if (device.propOption.id === "barriers/scifi_barrier_1" && change[2][0] == 0) {
            this.addAttempt();
            this.ui.updateAttempts();
            this.timer.start();
          }
        }
      }
    });
    gimloader_default.net.on("KNOCKOUT", (e) => {
      if (e.name !== "Evil Plant") return;
      this.knockouts++;
      let dropped = false;
      const addDrop = (e2) => {
        if (e2.devices.addedDevices.devices.length === 0) return;
        dropped = true;
        this.drops++;
        this.updateDrops();
        gimloader_default.net.off("WORLD_CHANGES", addDrop);
      };
      setTimeout(() => {
        gimloader_default.net.off("WORLD_CHANGES", addDrop);
        if (!dropped) this.updateDrops();
      }, 100);
      gimloader_default.net.on("WORLD_CHANGES", addDrop);
    });
    gameSession.listen("phase", (phase) => {
      if (phase === "results") {
        this.reset();
      }
    });
    gimloader_default.net.on("send:MESSAGE_FOR_DEVICE", (e) => {
      let id = e?.deviceId;
      if (!id) return;
      let device = gimloader_default.stores.phaser.scene.worldManager.devices.getDeviceById(id);
      let channel = device?.options?.channel;
      if (!channel) return;
      if (channel === "escaped") {
        setTimeout(() => this.timer.split(), 800);
      }
    });
    onFrame(() => {
      this.timer.update();
      if (stageCoords[this.stage]) {
        let body = gimloader_default.stores.phaser.mainCharacter.body;
        if (inBox(body, stageCoords[this.stage])) {
          this.stage++;
          this.timer.split();
        }
      }
    });
  }
  updateDrops() {
    if (this.knockouts === 0) {
      this.ui.setDropRate("0/0");
    } else {
      let percent = this.drops / this.knockouts * 100;
      let percentStr = percent.toFixed(2);
      if (percent === 0) percentStr = "0";
      this.ui.setDropRate(`${this.drops}/${this.knockouts} (${percentStr}%)`);
    }
  }
  getCategoryId() {
    return "OneWayOut";
  }
  reset() {
    this.ui?.remove();
    this.ui = new OneWayOutUI(this);
    this.timer = new SplitsTimer(this, this.ui);
    this.stage = 0;
    this.drops = 0;
    this.knockouts = 0;
  }
  destroy() {
    this.ui.remove();
  }
};

// src/index.ts
gimloader_default.UI.addStyles(styles_default);
var autosplitter;
var gamemodeDetector = gimloader_default.lib("GamemodeDetector");
gimloader_default.net.onLoad(() => {
  let gamemode = gamemodeDetector.currentGamemode();
  if (gamemode === "Don't Look Down") {
    autosplitter = new DLDAutosplitter2();
  } else if (gamemode === "Fishtopia") {
    autosplitter = new FishtopiaAutosplitter();
  } else if (gamemode === "One Way Out") {
    autosplitter = new OneWayOutAutosplitter();
  }
});
gimloader_default.openSettingsMenu(() => {
  let div = document.createElement("div");
  let settings = new Settings_default({
    target: div
  });
  gimloader_default.UI.showModal(div, {
    title: "Manage Autosplitter data",
    buttons: [{ text: "Close", style: "close" }],
    id: "Autosplitter Settings",
    style: "min-width: min(600px, 90%); height: 90%;",
    closeOnBackgroundClick: false,
    onClosed: () => {
      settings.save();
      autosplitter?.loadData();
      autosplitter?.reset();
    }
  });
});
