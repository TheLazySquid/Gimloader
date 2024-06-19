// ==UserScript==
// @name        Gimloader
// @description A plugin loader for Gimkit
// @namespace   https://github.com/TheLazySquid/Gimloader
// @match       https://www.gimkit.com/*
// @match       https://thelazysquid.github.io/gimloader*
// @run-at      document-start
// @iconURL     https://www.gimkit.com/favicon.png
// @author      TheLazySquid
// @updateURL   https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/build/bundle.user.js
// @downloadURL https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/build/bundle.user.js
// @version     0.7.0
// @grant       unsafeWindow
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// @grant       GM.registerMenuCommand
// @grant       GM.xmlHttpRequest
// @grant       GM_addValueChangeListener
// ==/UserScript==
(function () {
  'use strict';

  var version = "0.7.0";

  var styles$1 = ".gl-listWrap {\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n}\n.gl-listWrap .scriptList {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));\n  align-content: start;\n  gap: 1rem;\n  padding: 1rem;\n  height: 100%;\n  background-color: var(--bg-primary);\n  border-radius: 10px;\n  color: var(--text);\n  flex: 1;\n  overflow-y: auto;\n  height: 100%;\n}\n.gl-listWrap .scriptList .empty {\n  width: 100%;\n  text-align: center;\n  font-size: 2rem;\n  font-weight: 600;\n  grid-column: 1/-1;\n  padding-top: 1rem;\n}\n.gl-listWrap .header {\n  display: flex;\n  width: 100%;\n  justify-content: start;\n  align-items: center;\n}\n.gl-listWrap button {\n  cursor: pointer;\n  width: 28px;\n  height: 28px;\n  border: none;\n  padding: 0;\n  margin: 0;\n  background-color: transparent;\n  transition: transform 0.23s ease 0s;\n}\n.gl-listWrap button:hover {\n  transform: scale(1.1);\n}\n.gl-listWrap svg {\n  fill: var(--text);\n  width: 100%;\n  height: 100%;\n}\n.gl-listWrap .scriptItem {\n  padding: 1rem;\n  min-height: 200px;\n  background-color: var(--bg-secondary);\n  border-radius: 6px;\n  display: flex;\n  flex-direction: column;\n  box-shadow: rgba(0, 0, 0, 0.05) 0px -1px 10px 0px, rgba(0, 0, 0, 0.1) 0px 1px 4px 0px, rgb(243, 236, 232) 0px 10px 30px 0px;\n}\n.gl-listWrap .scriptItem .info {\n  flex-grow: 1;\n}\n.gl-listWrap .scriptItem .top {\n  width: 100%;\n  max-width: 100%;\n  max-height: 100px;\n  display: flex;\n}\n.gl-listWrap .scriptItem .top input {\n  flex-shrink: 0;\n  width: 25px;\n  height: 25px;\n}\n.gl-listWrap .scriptItem .name {\n  font-size: 1.2rem;\n  font-weight: 600;\n  flex-grow: 1;\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}\n.gl-listWrap .scriptItem .version {\n  padding-left: 5px;\n  font-size: 0.8rem;\n}\n.gl-listWrap .scriptItem .author {\n  font-size: 1rem;\n  font-weight: normal;\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}\n.gl-listWrap .scriptItem .description {\n  font-size: 0.8rem;\n  max-height: 200px;\n  overflow: hidden;\n  white-space: wrap;\n  text-overflow: ellipsis;\n}\n.gl-listWrap .scriptItem .buttons {\n  display: flex;\n  justify-content: flex-end;\n  gap: 0.5rem;\n}\n\n.codeCakeEditor {\n  border-radius: 0.2rem;\n}\n\n.gl-row {\n  display: flex;\n  gap: 8px;\n}\n\n* > .gl-wrench {\n  padding: 8px 12px;\n}\n\n.gl-wrench {\n  width: 20px;\n  height: 20px;\n}\n.gl-wrench svg {\n  fill: white;\n  width: 20px;\n  height: 20px;\n  transform: translate(-50%, -50%);\n}\n\n.gl-join {\n  width: 100%;\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n.gl-join .openPlugins {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border: none;\n  background-color: rgb(30, 7, 107);\n  height: 36px;\n  width: 40px;\n  border-radius: 4px;\n  cursor: pointer;\n}\n.gl-join .openPlugins:hover {\n  background-color: rgb(43, 10, 155);\n}\n.gl-join .openPlugins svg {\n  fill: white;\n}\n\n.gl-homeWrench {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n.gl-homeWrench .icon {\n  width: 30px;\n  height: 30px;\n}\n.gl-homeWrench.light .text {\n  color: white;\n}\n.gl-homeWrench.light .text:hover {\n  color: white;\n}\n.gl-homeWrench.light svg {\n  fill: white;\n}\n.gl-homeWrench .text {\n  font-size: 18px;\n  color: rgb(22, 119, 255);\n  font-weight: bold;\n  cursor: pointer;\n}\n.gl-homeWrench .text:hover {\n  color: #69b1ff;\n}\n\ndiv:has(> * > * > .gl-hostWrench) {\n  margin-right: 8px;\n}\n\n.gl-hostWrench {\n  display: flex;\n}\n\n.gl-1dHostPluginBtn {\n  padding: 6px 14px;\n  background-color: rgb(131, 131, 131);\n  border-radius: 4px;\n  margin-right: 8px;\n  color: white;\n  transition: transform 0.23s ease 0s;\n  border: none;\n  font-weight: 900;\n  font-size: 24px;\n  box-shadow: rgba(0, 0, 0, 0.46) 0px 4px 33px -6px;\n}\n.gl-1dHostPluginBtn:hover {\n  transform: scale(1.04);\n}\n\n.gl-1dHostGameWrench {\n  width: 25px;\n  height: 25px;\n}\n.gl-1dHostGameWrench svg {\n  fill: white;\n  transform: translate(6px, -1px);\n}\n\n.gl-1dGameWrench {\n  width: 23px;\n  height: 23px;\n}\n.gl-1dGameWrench svg {\n  fill: white;\n}\n\n.gl-1dGameWrenchJoin {\n  width: 32px;\n  height: 32px;\n  margin-left: 8px;\n}\n.gl-1dGameWrenchJoin svg {\n  fill: white;\n}\n\n.gl-modalBG {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100vw;\n  height: 100vh;\n  z-index: 100;\n  background-color: rgba(0, 0, 0, 0.2);\n  backdrop-filter: blur(5px);\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  animation: fadeIn 0.15s;\n}\n\n.gl-modal {\n  min-width: 25%;\n  min-height: 200px;\n  max-height: 80%;\n  max-width: 80%;\n  border-radius: 1rem;\n  padding: 1rem;\n  background-color: var(--bg-primary);\n  color: var(--text);\n  animation: zoomIn ease-out 0.15s;\n  display: flex;\n  flex-direction: column;\n}\n.gl-modal .title {\n  margin-bottom: 0.5rem;\n  font-size: 1rem;\n  font-weight: 600;\n}\n.gl-modal .content {\n  overflow-y: auto;\n  flex: 1;\n}\n.gl-modal > .buttons {\n  display: flex;\n  justify-content: flex-end;\n  gap: 1rem;\n  padding-top: 1rem;\n}\n.gl-modal > .buttons button {\n  padding: 0.5rem 1rem;\n  border: none;\n  border-radius: 0.5rem;\n  cursor: pointer;\n}\n.gl-modal > .buttons button.close {\n  background-color: transparent;\n  text-decoration: underline;\n}\n.gl-modal > .buttons button.primary {\n  background-color: #178635;\n  color: white;\n}\n.gl-modal > .buttons button.danger {\n  background-color: #ff4d4f;\n  color: white;\n}\n\n.gl-errorMsg {\n  white-space: pre-line;\n  background-color: lightgray;\n  border: 1px solid black;\n  border-radius: 3px;\n  padding: 5px;\n}\n\n@keyframes fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes zoomIn {\n  from {\n    transform: scale(0.3);\n  }\n  to {\n    transform: scale(1);\n  }\n}\n.gl-menu {\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n}\n.gl-menu .tabs {\n  display: flex;\n  justify-content: center;\n  gap: 5px;\n  margin-bottom: 3px;\n}\n.gl-menu .tab {\n  cursor: pointer;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  flex-grow: 1;\n  text-align: center;\n  background-color: rgb(238, 238, 238);\n  border-radius: 8px;\n  box-shadow: 0 4px 0 0 rgba(0, 0, 0, 0.5);\n  transition: transform 0.12s ease-out, box-shadow 0.12s ease-out;\n  margin-top: 4px;\n  user-select: none;\n  padding-top: 4px;\n}\n.gl-menu .tab:hover {\n  transform: translateY(-3px);\n  box-shadow: 0 7px 0 0 rgba(0, 0, 0, 0.5);\n}\n.gl-menu .tab:active, .gl-menu .tab.selected {\n  transform: translateY(2px);\n  box-shadow: 0 2px 0 0 rgba(0, 0, 0, 0.5);\n}\n.gl-menu .tab .icon, .gl-menu .tab .icon svg {\n  width: 32px;\n  height: 32px;\n}\n.gl-menu .tab .label {\n  font-size: x-small;\n}\n.gl-menu .content {\n  flex-grow: 1;\n  overflow-y: auto;\n}\n\n.gl-updateList h1 {\n  margin: 0;\n  padding: 0;\n}\n.gl-updateList > div {\n  display: flex;\n  align-items: center;\n  gap: 5px;\n}\n.gl-updateList svg {\n  width: 28px;\n  height: 28px;\n}\n.gl-updateList .checkAll {\n  margin-top: 5px;\n  font-size: large;\n}\n.gl-updateList .updateBtn {\n  cursor: pointer;\n  transition: transform 0.1s ease;\n  width: 28px;\n  height: 28px;\n}\n.gl-updateList .updateBtn:hover {\n  transform: scale(1.1);\n}\n\n.gl-libraryInfo th, .gl-libraryInfo tr {\n  text-align: left;\n  padding-right: 50px;\n}\n.gl-libraryInfo tr:nth-child(even) {\n  background-color: rgb(238, 238, 238);\n}\n.gl-libraryInfo .url {\n  max-width: 300px;\n  text-wrap: wrap;\n}\n\n:root {\n  --text: black;\n  --bg-primary: white;\n  --bg-secondary: white;\n}";

  var codeCakeStyles = "/* codecake global styles */\n.codecake {\n    display: flex;\n    font-family: \"Source Code Pro\", monospace;\n    letter-spacing: normal;\n    min-height: 0;\n    padding: 20px;\n    width: 100%;\n}\n.codecake-editor {\n    flex-grow: 1;\n    font-size: 14px;\n    font-weight: 400;\n    height: 100%;\n    line-height: 20px;\n    overflow: auto;\n    overflow-wrap: normal;\n    outline: none;\n    width: 100%;\n    white-space: pre; /* pre-wrap */\n    word-wrap: normal;\n}\n.codecake-gutters {\n    min-height: 0;\n    overflow: hidden;\n    position: relative;\n    width: 48px;\n}\n.codecake-lines {\n    bottom: 0px;\n    color: currentColor;\n    font-size: 12px;\n    line-height: 20px;\n    opacity: 0.5;\n    overflow: hidden;\n    padding-right: 16px;\n    position: absolute;\n    right: 0px;\n    text-align: right;\n    top: 0px;\n}\n.codecake-lines > div {\n    margin-bottom: 4px;\n    min-height: 16px;\n}\n.codecake-lines > div:not(:first-child) {\n    margin-top: 4px;\n}\n\n/* Terrible hack to hide last empty line in editor */\n.codecake-editor .line:last-child,\n.codecake-lines > div:last-child {\n    display: none !important;\n}\n\n/* Editor plugins */\n.codecake-linewrapping {\n    white-space: pre-wrap !important;\n}\n\n/* Editor scrollbar */\n.codecake-editor::-webkit-scrollbar {\n    width: 8px;\n    height: 8px;\n}\n.codecake-editor::-webkit-scrollbar-track {\n    background-color: transparent;\n}\n.codecake-editor::-webkit-scrollbar-thumb {\n    background-color: currentColor;\n    border-radius: 16px;\n}\n.codecake-editor::-webkit-scrollbar-button {\n    display: none;\n}\n.codecake-editor::-webkit-scrollbar-corner {\n    background-color: transparent;\n}\n\n/* codecake light theme */\n.codecake-light {\n    background-color: #fafafa;\n    color: #101623;\n}\n.codecake-light .codecake-editor::-webkit-scrollbar-thumb {\n    background-color: #dedfe3;\n}\n.codecake-light .codecake-editor::-webkit-scrollbar-thumb:hover {\n    background-color: #cbccd2;\n}\n.codecake-light .codecake-lines {\n    /* color: #6cb1c5; */\n    color: #878a98;\n}\n\n.codecake-light .token-operator, \n.codecake-light .token-number,\n.codecake-light .token-unit {\n    color: #e57697;\n}\n.codecake-light .token-punctuation, \n.codecake-light .token-property,\n.codecake-light .token-selector-pseudo,\n.codecake-light .token-selector-attr,\n.codecake-light .token-quote,\n.codecake-light .token-code {\n    color: #3a464e;\n}\n.codecake-light .token-keyword,\n.codecake-light .token-bullet {\n    color: #b351d9;\n}\n.codecake-light .token-constant {\n    color: #20118a;\n}\n.codecake-light .token-attribute,\n.codecake-light .token-tag,\n.codecake-light .token-title.function,\n.codecake-light .token-selector-tag,\n.codecake-light .token-section {\n    color: #3a9ff2;\n}\n.codecake-light .token-attr,\n.codecake-light .token-selector-class,\n.codecake-light .token-link {\n    color: #f38d00;\n}\n.codecake-light .token-string {\n    color: #00a17d;\n}\n.codecake-light .token-comment {\n    color: #969896;\n}\n\n/* codecake dark theme */\n.codecake-dark {\n    background-color: #272b3f;\n    color: #aab2d4;\n}\n.codecake-dark .codecake-editor::-webkit-scrollbar-thumb {\n    background-color: #99aaff15;\n}\n.codecake-dark .codecake-editor::-webkit-scrollbar-thumb:hover {\n    background-color: #99aaff22;\n}\n.codecake-dark .codecake-lines {\n    color: #757ca3;\n}\n\n.codecake-dark .token-attr,\n.codecake-dark .token-selector-tag {\n    color: #80d0ff;\n}\n.codecake-dark .token-comment,\n.codecake-dark .token-quote {\n    color: #58628d;\n}\n.codecake-dark .token-constant, \n.codecake-dark .token-number,\n.codecake-dark .token-bullet,\n.codecake-dark .token-link {\n    color: #ffae80;\n}\n.codecake-dark .token-title.function,\n.codecake-dark .token-section {\n    color: #22c1dd;\n} \n.codecake-dark .token-attribute,\n.codecake-dark .token-tag,\n.codecake-dark .token-code,\n.codecake-dark .token-strong {\n    color: #6e9af7;\n}\n.codecake-dark .token-keyword {\n    color: #af89f5;\n}\n.codecake-dark .token-operator,\n.codecake-dark .token-selector-attr {\n    color: #ad388c;\n}\n.codecake-dark .token-property,\n.codecake-dark .token-selector-class {\n    color: #bdc7f5;\n}\n.codecake-dark .token-selector-pseudo,\n.codecake-dark .token-punctuation,\n.codecake-dark .token-emphasis {\n    color: #8bb3f4;\n}\n.codecake-dark .token-string {\n    color: #9bcd65;\n}\n.codecake-dark .token-unit {\n    color: #dd556e;\n}\n\n/* MonoBlue theme */\n.codecake-monoblue {\n    background-color: #eef2f6;\n    color: #011e48;\n}\n.codecake-monoblue .token-keyword, \n.codecake-monoblue .token-tag,\n.codecake-monoblue .token-selector-tag, \n.codecake-monoblue .token-section {\n    font-weight: bold;\n}\n.codecake-monoblue .token-string,\n.codecake-monoblue .token-section {\n    color: #1086ce;\n}\n.codecake-monoblue .token-comment {\n    color: #8e9eaf;\n}\n.codecake-monoblue .token-code,\n.codecake-monoblue .token-quote,\n.codecake-monoblue .token-tag, \n.codecake-monoblue .token-attr,\n.codecake-monoblue .token-attribute,\n.codecake-monoblue .token-selector-class,\n.codecake-monoblue .token-punctuation {\n    color: #224d84;\n}\n.codecake-monoblue .token-bullet {\n    color: #8fc8f3;\n}\n\n/* One Light theme */\n/* Inspired in https://github.com/akamud/vscode-theme-onelight */\n.codecake-one-light {\n    background-color: #fafafa;\n    color: #393c46;\n}\n.codecake-one-light .token-keyword {\n    color: #a329a1;\n}\n.codecake-one-light .token-string,\n.codecake-one-light .token-attribute {\n    color: #54ac53;\n}\n.codecake-one-light .token-constant {\n    color: #0084bd;\n}\n.codecake-one-light .token-number,\n.codecake-one-light .token-unit,\n.codecake-one-light .token-selector-class,\n.codecake-one-light .token-selector-attr,\n.codecake-one-light .token-selector-pseudo,\n.codecake-one-light .token-attr {\n    color: #a37000;\n}\n.codecake-one-light .token-bullet,\n.codecake-one-light .token-title.function {\n    color: #4279f0;\n}\n.codecake-one-light .token-quote,\n.codecake-one-light .token-comment {\n    color: #a3a4a8;\n}\n.codecake-one-light .token-section,\n.codecake-one-light .token-tag,\n.codecake-one-light .token-selector-tag {\n    color: #e74a3c;\n}\n.codecake-one-light .token-builtin {\n    color: #bb8002;\n}\n\n/* One Dark theme */\n/* Inspired in https://github.com/akamud/vscode-theme-onedark */\n.codecake-one-dark {\n    background-color: #282c34;\n    color: #b6bdc8;\n}\n.codecake-one-dark .token-keyword {\n    color: #ca78e2;\n}\n.codecake-one-dark .token-string,\n.codecake-one-dark .token-attribute {\n    color: #93bd75;\n}\n.codecake-one-dark .token-bullet,\n.codecake-one-dark .token-title.function {\n    color: #62adea;\n}\n.codecake-one-dark .token-constant {\n    color: #5cb6c1;\n}\n.codecake-one-dark .token-quote,\n.codecake-one-dark .token-comment {\n    color: #5f6672;\n}\n.codecake-one-dark .token-number,\n.codecake-one-dark .token-unit,\n.codecake-one-dark .token-selector-class,\n.codecake-one-dark .token-selector-attr,\n.codecake-one-dark .token-selector-pseudo,\n.codecake-one-dark .token-attr {\n    color: #d19761;\n}\n.codecake-one-dark .token-section,\n.codecake-one-dark .token-tag,\n.codecake-one-dark .token-selector-tag {\n    color: #e4727b;\n}\n.codecake-one-dark .token-builtin {\n    color: #e4b867;\n}\n\n/* Common styles */\n.codecake-light .token-strong,\n.codecake-dark .token-strong,\n.codecake-monoblue .token-strong,\n.codecake-one-light .token-strong,\n.codecake-one-dark .token-strong {\n    font-weight: bold;\n}\n.codecake-light .token-emphasis,\n.codecake-dark .token-emphasis,\n.codecake-monoblue .token-emphasis,\n.codecake-one-light .token-emphasis,\n.codecake-one-dark .token-emphasis {\n    font-style: italic;\n}\n";

  // gotta have pretty console.logs
  function log(...args) {
      console.log('%c[GL]', 'color:#5030f2', ...args);
  }
  const onGimkit = location.host === "www.gimkit.com";
  function parsePluginHeader(code) {
      const basePluginHeaders = {
          name: "Unnamed Plugin",
          description: "No description provided",
          author: "Unknown Author",
          version: null,
          reloadRequired: "false",
          isLibrary: "false",
          downloadUrl: null,
          needsLib: []
      };
      return parseHeader(code, basePluginHeaders);
  }
  function parseLibHeader(code) {
      const baseLibHeaders = {
          name: 'Unnamed Library',
          author: 'Unknown Author',
          description: 'No description provided',
          version: null,
          downloadUrl: null,
          isLibrary: "false"
      };
      return parseHeader(code, baseLibHeaders);
  }
  function parseHeader(code, headers) {
      // parse headers for gimhook mods
      if (code.startsWith("// gimhook: ")) {
          try {
              let gimhookHeader = JSON.parse(code.slice(11, code.indexOf('\n')).trim());
              if (gimhookHeader.name)
                  headers.name = gimhookHeader.name;
              if (gimhookHeader.description)
                  headers.description = gimhookHeader.description;
              if (gimhookHeader.author)
                  headers.author = gimhookHeader.author;
              if (gimhookHeader.version)
                  headers.version = gimhookHeader.version;
          }
          catch (e) { }
          return headers;
      }
      // parse the JSDoc header at the start (if it exists)
      let closingIndex = code.indexOf('*/');
      if (!(code.trimStart().startsWith('/**')) || closingIndex === -1) {
          return headers;
      }
      let header = code.slice(0, closingIndex + 2);
      header = header.slice(3, -2).trim();
      let lines = header.split('\n');
      // remove the leading asterisks and trim the lines
      lines = lines.map(line => {
          let newLine = line.trimStart();
          if (newLine.startsWith('*')) {
              newLine = newLine.slice(1).trim();
          }
          return newLine;
      });
      let text = lines.join(' ');
      // go through and find all at symbols followed by non-whitespace
      // and that don't have a bracket before them if they are a link
      let validAtIndexes = [];
      let index = -1;
      while ((index = text.indexOf('@', index + 1)) !== -1) {
          if (text[index + 1] === ' ')
              continue;
          if (index != 0 && text[index - 1] === '{') {
              if (text.slice(index + 1, index + 5) === 'link') {
                  continue;
              }
          }
          validAtIndexes.push(index);
      }
      for (let i = 0; i < validAtIndexes.length; i++) {
          let chunk = text.slice(validAtIndexes[i] + 1, validAtIndexes[i + 1] ?? text.length);
          let spaceIndex = chunk.indexOf(' ');
          let key = chunk.slice(0, spaceIndex !== -1 ? spaceIndex : chunk.length);
          let value = chunk.slice(key.length).trim();
          if (Array.isArray(headers[key])) {
              headers[key].push(value);
          }
          else {
              headers[key] = value;
          }
      }
      return headers;
  }

  var wrench = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M22.7,19L13.6,9.9C14.5,7.6 14,4.9 12.1,3C10.1,1 7.1,0.6 4.7,1.7L9,6L6,9L1.6,4.7C0.4,7.1 0.9,10.1 2.9,12.1C4.8,14 7.5,14.5 9.8,13.6L18.9,22.7C19.3,23.1 19.9,23.1 20.3,22.7L22.6,20.4C23.1,20 23.1,19.3 22.7,19Z\" /></svg>";

  let openModals = new Set();
  function showModal(content, options) {
      if (options?.id) {
          if (openModals.has(options.id))
              return;
          openModals.add(options.id);
      }
      let bgEl = document.createElement("div");
      bgEl.className = "gl-modalBG";
      let modalEl = document.createElement("div");
      modalEl.className = "gl-modal";
      if (options?.className)
          modalEl.classList.add(options.className);
      if (options?.style)
          modalEl.style.cssText = options.style;
      // create the title and content
      if (options?.title) {
          let title = document.createElement("div");
          title.textContent = options.title;
          title.className = "title";
          modalEl.appendChild(title);
      }
      let modalContent = document.createElement("div");
      modalContent.className = "content";
      modalEl.appendChild(modalContent);
      if (options?.buttons) {
          let buttons = document.createElement("div");
          buttons.className = "buttons";
          modalEl.appendChild(buttons);
          // create the buttons
          for (let button of options.buttons) {
              let buttonEl = document.createElement("button");
              buttonEl.textContent = button.text;
              buttonEl.classList.add(button.style ?? "primary");
              buttonEl.addEventListener("click", (e) => {
                  if (button.onClick) {
                      let cancel = button.onClick(e);
                      if (cancel)
                          return;
                  }
                  closeModal();
              });
              buttons.appendChild(buttonEl);
          }
      }
      // render the content
      if (content instanceof HTMLElement) {
          modalContent.appendChild(content);
      }
      else {
          GL.ReactDOM.createRoot(modalContent).render(content);
      }
      bgEl.appendChild(modalEl);
      // close the modal when the background is clicked
      modalEl.addEventListener("click", e => e.stopPropagation());
      if (options?.closeOnBackgroundClick !== false)
          bgEl.onclick = closeModal;
      document.body.appendChild(bgEl);
      function closeModal() {
          if (options?.id) {
              openModals.delete(options.id);
          }
          bgEl.remove();
          if (options?.onClosed)
              options.onClosed();
      }
      return closeModal;
  }

  var update = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M21,10.12H14.22L16.96,7.3C14.23,4.6 9.81,4.5 7.08,7.2C4.35,9.91 4.35,14.28 7.08,17C9.81,19.7 14.23,19.7 16.96,17C18.32,15.65 19,14.08 19,12.1H21C21,14.08 20.12,16.65 18.36,18.39C14.85,21.87 9.15,21.87 5.64,18.39C2.14,14.92 2.11,9.28 5.62,5.81C9.13,2.34 14.76,2.34 18.27,5.81L21,3V10.12M12.5,8V12.25L16,14.33L15.28,15.54L11,13V8H12.5Z\" /></svg>";

  var solidBook = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"0.88em\" height=\"1em\" viewBox=\"0 0 448 512\"><path fill=\"currentColor\" d=\"M96 0C43 0 0 43 0 96v320c0 53 43 96 96 96h320c17.7 0 32-14.3 32-32s-14.3-32-32-32v-64c17.7 0 32-14.3 32-32V32c0-17.7-14.3-32-32-32h-32zm0 384h256v64H96c-17.7 0-32-14.3-32-32s14.3-32 32-32m32-240c0-8.8 7.2-16 16-16h192c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16m16 48h192c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16s7.2-16 16-16\"/></svg>";

  var importSvg = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M14,12L10,8V11H2V13H10V16M20,18V6C20,4.89 19.1,4 18,4H6A2,2 0 0,0 4,6V9H6V6H18V18H6V15H4V18A2,2 0 0,0 6,20H18A2,2 0 0,0 20,18Z\" /></svg>";

  var plusBoxOutline = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M19,19V5H5V19H19M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5C3,3.89 3.9,3 5,3H19M11,7H13V11H17V13H13V17H11V13H7V11H11V7Z\" /></svg>";

  var pencilOutline = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z\" /></svg>";

  var deleteSvg = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z\" /></svg>";

  /*
   * CodeCake Editor
  */

  const insertText = text => {
      const sel = window.getSelection();
      const range = sel.getRangeAt(0);
      const textElement = document.createTextNode(text);
      range.insertNode(textElement);
      range.setStartAfter(textElement);
      sel.removeAllRanges();
      sel.addRange(range);
  };

  const getCodeBeforeOrAfter = (parent, dir) => {
      const {startContainer, startOffset, endContainer, endOffset} = window.getSelection().getRangeAt(0);
      const range = document.createRange();
      range.selectNodeContents(parent);
      dir === -1 ? range.setEnd(startContainer, startOffset) : range.setStart(endContainer, endOffset);
      return range.toString();
  };

  const debounce = fn => {
      let timer = null;
      return wait => {
          clearTimeout(timer);
          wait === 1 ? fn() : (timer = window.setTimeout(fn, wait)); 
      };
  };

  const getTextNodeAtPosition = (root, index) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, el => {
          if (index > el.textContent.length){
              index = index - el.textContent.length;
              return NodeFilter.FILTER_REJECT
          }
          return NodeFilter.FILTER_ACCEPT;
      });
      return {
          node: walker.nextNode() || root,
          position: index,
      };
  };

  const getEditorTemplate = () => {
      const templateContent = [
          `<div class="codecake">`,
          `    <div class="codecake-gutters" style="display:none;">`,
          `        <div class="codecake-gutter codecake-lines" style="display:none;"></div>`,
          `    </div>`,
          `    <div class="codecake-editor" spellcheck="false" autocorrect="off"></div>`, 
          `</div>`,
      ];
      const templateElement = document.createElement("template");
      templateElement.innerHTML = templateContent.join("").trim();
      return templateElement.content.firstChild;
  };

  // Create a new instance of the code editor
  const create = (parent, options = {}) => {
      let prevCode = "";
      let focus = false;
      let escKeyPressed = false;
      const listeners = {}; // Store events listeners
      const tab = options?.indentWithTabs ? "\t" : " ".repeat(options.tabSize || 4);
      const endl = String.fromCharCode(10);
      const autoIndent = options?.autoIndent ?? true;
      const addClosing = options?.addClosing ?? true;
      const openChars = `[({"'`, closeChars = `])}"'`;
      const hlg = options?.highlight ?? ((c, l) => highlight(c, l));
      parent.appendChild(getEditorTemplate());
      const editor = parent.querySelector(".codecake-editor");
      const lines = parent.querySelector(".codecake-lines");
      !options?.readOnly && editor.setAttribute("contenteditable", "plaintext-only");
      (options?.className || "").split(" ").filter(c => !!c).forEach(c => parent.querySelector(".codecake").classList.add(c));
      options?.lineNumbers && (parent.querySelector(".codecake-gutters").style.display = "");
      options?.lineNumbers && (lines.style.display = "");
      // 'plaintext-only' mode is not supported in Firefox
      if (!options?.readOnly && editor.contentEditable !== "plaintext-only") {
          editor.setAttribute("contenteditable", "true");
          editor.addEventListener("paste", event => {
              const insertText = event.clipboardData.getData("text/plain");
              event.preventDefault();
              // insert text at cursor position
              const sel = window.getSelection();
              const range = sel.getRangeAt(0);
              range.deleteContents();
              range.insertNode(document.createTextNode(insertText));
              update(10);
          });
      }
      if (options?.lineWrap) {
          editor.classList.add("codecake-linewrapping");
      }
      // Manage code
      const setCode = (newCode, wait) => {
          editor.textContent = newCode;
          prevCode = editor.textContent || "";
          update(wait ?? 50);
      };
      const getCode = () => editor.textContent || "";
      const getCodeBefore = () => getCodeBeforeOrAfter(editor, -1);
      const getCodeAfter = () => getCodeBeforeOrAfter(editor, +1);
      // Position managers
      const savePosition = () => {
          const range = window.getSelection().getRangeAt(0);
          range.setStart(editor, 0);
          return range.toString().length;
      };
      const restorePosition = index => {
          const selection = window.getSelection();
          const pos = getTextNodeAtPosition(editor, index);
          selection.removeAllRanges();
          const range = new Range();
          range.setStart(pos.node, pos.position);
          selection.addRange(range);
      };
      // Debounce code update
      const update = debounce(() => {
          const position = focus && savePosition();
          let currentCode = getCode();
          if (!currentCode.endsWith(endl)) {
              currentCode = currentCode + endl;
              editor.textContent = currentCode;
          }
          const newText = typeof hlg === "function" ? hlg(currentCode, options.language || "") : currentCode;
          editor.innerHTML = `<span class="line">` + newText.split("\n").join(`</span>\n<span class="line">`) + `</span>`;
          if (options?.lineNumbers) {
              const linesC = Array.from(editor.querySelectorAll(`span.line`)).map((line, index) => {
                  return `<div style="height:${line.getBoundingClientRect().height}px;">${index + 1}</div>`;
              });
              lines.innerHTML = linesC.join("");
          }
          (typeof listeners["change"] === "function") && listeners["change"](currentCode);
          focus && restorePosition(position);
      });
      // Register editor events listeners
      editor.addEventListener("keydown", event => {
          (typeof listeners["keydown"] === "function") && (listeners["keydown"](event));
          if (!event.defaultPrevented && !options?.readOnly) {
              prevCode = getCode();
              // Handle inserting new line
              if (event.key === "Enter" && autoIndent) {
                  event.preventDefault();
                  const lines = getCodeBefore().split(endl);
                  const extraLine = /^[)}\]]/.test(getCodeAfter());
                  const pos = savePosition();
                  const lastLine = lines[lines.length - 1];
                  const lastIndentation = (/^([\s]*)/.exec(lastLine))?.[0] || "";
                  const lastChar = lastLine.trim().slice(-1);
                  const indentation = lastIndentation + (/[\[\{]/.test(lastChar) ? tab : "");
                  setCode(prevCode.substring(0, pos) + endl + indentation + (extraLine ? (endl + lastIndentation) : "") + prevCode.substring(pos, prevCode.length), 1);
                  restorePosition(pos + 1 + indentation.length);
              }
              // Handle backspace
              else if (event.key === "Backspace" || (event.key === "Tab" && !escKeyPressed && event.shiftKey)) {
                  if (window.getSelection().type === "Caret") {
                      let removeChars = 0;
                      const pos = savePosition();
                      const lines = prevCode.slice(0, pos).split(endl);
                      const line = lines[lines.length - 1] || ""; 
                      if (line !== "" && line.trim() === "") {
                          event.preventDefault();
                          removeChars = (line.length % tab.length === 0) ? tab.length : line.length % tab.length;
                          setCode(prevCode.substring(0, pos - removeChars) + prevCode.substring(pos, prevCode.length), 1);
                      }
                      restorePosition(pos - removeChars);
                  }
              }
              // Handle insert tab
              else if (event.key === "Tab" && !escKeyPressed && !event.shiftKey) {
                  event.preventDefault();
                  insertText(tab);
              }
              // Skip closing char
              else if (addClosing && closeChars.includes(event.key) && getCodeAfter().charAt(0) === event.key) {
                  event.preventDefault();
                  restorePosition(savePosition() + 1);
              }
              // Handle closing chars
              else if (addClosing && openChars.includes(event.key)) {
                  event.preventDefault();
                  const [start, end] = [getCodeBefore().length, getCodeAfter().length];
                  const pos = savePosition();
                  const wrapText = (prevCode.length - start - end > 0) ? prevCode.substring(start, prevCode.length - end) : "";
                  setCode(prevCode.substring(0, pos - wrapText.length) + event.key + wrapText + closeChars[openChars.indexOf(event.key)] + prevCode.substring(pos, prevCode.length), 1);
                  restorePosition(pos + 1);
              }
              // Save if escape key has been pressed to avoid trapping keyboard focus
              escKeyPressed = event.key === "Escape";
          }
      });
      editor.addEventListener("keyup", event => {
          (typeof listeners["keyup"] === "function") && (listeners["keyup"](event));
          if (!event.defaultPrevented && !options?.readOnly && prevCode !== getCode()) {
              return update(250);
          }
      });
      editor.addEventListener("focus", () => focus = true);
      editor.addEventListener("blur", () => focus = false);
      editor.addEventListener("scroll", () => lines.style.top = `-${editor.scrollTop}px`);
      editor.addEventListener("paste", () => update(10));
      // Initialize editor values
      options?.code ? setCode(options?.code) : update(1);
      return {
          getCode: () => getCode(),
          setCode: code => setCode(code || "", 1),
          onChange: listener => (listeners["change"] = listener),
          onKeyDown: listener => (listeners["keydown"] = listener),
          onKeyUp: listener => (listeners["keyup"] = listener),
      };
  };


  /*
   * CodeCake Syntax highlight
  */

  const escape = text => {
      return text.replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
  };

  const jsKeywords = [
      "as", "async", "await", "break", "case", "catch", "class", "const", "continue", "constructor", "debugger", "default",
      "delete", "do", "else", "export", "extends", "finally", "for", "from", "function", "if", "implements", "import",
      "in", "instanceof", "let", "new", "of", "return", "static", "super", "switch", "symbol", "this", "throw",
      "try", "typeof", "undefined", "var", "void", "while", "with", "yield",
  ];

  const cssConstants = [
      "absolute", "relative", "fixed", "sticky", "bold", "normal", "auto", "none", "solid", "dashed",
      "sans-serif", "sans", "serif", "monospace", "red", "white", "black", "blue", "yellow", "green", "orange", "gray",
  ];

  // Languajes definition
  const languages = {
      html: {
          aliases: [],
          rules: [
              {
                  starts: /^<!--/,
                  ends: /-->/,
                  rules: [
                      {regex: /^(.+)/, token: "comment"},
                  ],
              },
              {
                  regex: /^(<([\w]+)(?![^>]*\/>)[^>]*>)/,
                  rules: [
                      {
                          regex: /^(<[\w]+)/,
                          rules: [
                              {regex: /^(<)/, token: "punctuation"},
                              {regex: /^([\w]+)/, token: "tag"},
                          ],
                      },
                      {
                          regex: /^([\w\.\-\_]+="[^"]+")/,
                          rules: [
                              {regex: /^([\w\.\-\_]+)/, token: "attr"},
                              {regex: /^(=)/, token: "punctuation"},
                              {regex: /^(".*?")/, token: "string"},
                          ],
                      },
                      {regex: /^(>)/, token: "punctuation"},
                  ],
              },
              {
                  regex: /^(<\/[\w]+>)/,
                  rules: [
                      {regex: /^([<\/>])/, token: "punctuation"},
                      {regex: /^([\w]+)/, token: "tag"},
                  ],
              },
          ],
      },
      javascript: {
          aliases: ["js", "jsx"],
          rules: [
              {regex: /^(\/\/.*)/, token: "comment"},
              {
                  starts: /^\/\*/,
                  ends: /\*\//,
                  rules: [
                      {regex: /^(.+)/, token: "comment"},
                  ],
              },
              {regex: /^(\'.*?\')|^(\".*?\")/, token: "string"},
              {
                  regex: /^(\`[^\`]*?\`)/,
                  rules: [
                      {regex: /^(.+)/, token: "string"},
                  ],
              },
              {regex: new RegExp(`^\\b(${jsKeywords.join("|")})\\b`), token: "keyword"},
              {regex: /^\b(true|false|null)\b/, token: "constant"},
              {regex: /^([+-]?([0-9]*[.])?[0-9]+)\b/, token: "number"},
              {regex: /^([{}[\](\):;\\.,])/, token: "punctuation"},
              {
                  regex: /^(<(?:=>|[^>])+(?:\/)?>)/,
                  rules: [
                      {
                          regex: /^(<\/?[\w]+)/,
                          rules: [
                              {regex: /^(<)/, token: "punctuation"},
                              {regex: /^([\w]+)/, token: "tag"},
                          ],
                      },
                      {
                          regex: /^([\w\.\-\_]+=(?:"[^"]*"|\{[^\}]*}))/,
                          rules: [
                              {regex: /^([\w\.\-\_]+)/, token: "attr"},
                              {regex: /^(=)/, token: "punctuation"},
                              {regex: /^("(?:.)*?"|\{(?:.)*?})/, token: "string"},
                          ],
                      },
                      {regex: /^(>)/, token: "punctuation"},
                  ],
              },
              {regex: /^([?!&@~\/\-+*%=<>|])/, token: "operator"},
              {
                  regex: /^([a-zA-Z][\w]*\s*\()/,
                  rules: [
                      {regex: /^([^\(]+)/, token: "title function"},
                      {regex: /^(\()/, token: "punctuation"},
                  ],
              },
              {regex: /^([\w]+)/, token: "word"},
          ],
      },
      css: {
          aliases: [],
          rules: [
              {
                  starts: /^\/\*/,
                  ends: /\*\//,
                  rules: [
                      {regex: /^(.+)/, token: "comment"},
                  ],
              },
              {regex: /^([{},;])/, token: "punctuation"},
              {regex: /^(@(font-face|import|keyframes))/, token: "keyword"},
              {
                  regex: /^([a-z\-]+\s*:\s*[^;\n]+);/,
                  rules: [
                      {
                          regex: /^([a-z\-]+\s*:)/,
                          rules: [
                              {regex: /^([a-z\-]+)/, token: "attribute"},
                              {regex: /^(:)/, token: "punctuation"},
                          ],
                      },
                      {regex: /^(#[\da-f]{3,8})/, token: "constant"},
                      {regex: /^([+-]?([0-9]*[.])?[0-9]+)/, token: "number"},
                      {regex: /^(\'(?:.)*?\')|^(\"(?:.)*?\")/, token: "string"},
                      {regex: new RegExp(`^\\b(${cssConstants.join("|")})\\b`), token: "constant"},
                      {regex: /^\b(cm|mm|in|px|pt|pc|em|rem|vw|vh)\b/, token: "unit"},
                  ],
              },
              {regex: /^(::?[a-z]+)/, token: "selector-pseudo"},
              {regex: /^(\[[^\]]+\])/, token: "selector-attr"},
              {regex: /^(\.[\w\-\_]+)/, token: "selector-class"},
              {regex: /^(\#[\w\-\_]+)/, token: "selector-id"},
              {regex: /^(body|html|a|div|table|td|tr|th|input|button|textarea|label|form|svg|g|path|rect|circle|ul|li|ol)\b/, token: "selector-tag"},
              {regex: /^(\'(?:.)*?\')|^(\"(?:.)*?\")/, token: "string"},
          ],
      },
      markdown: {
          aliases: ["md"],
          rules: [
              {regex: /^(#{1,6}[^\n]+)/, token: "section"},
              {regex: /^(\`{3}[^\`{3}]+\`{3})/, token: "code"},
              {regex: /^(\`[^\`\n]+\`)/, token: "code"},
              {regex: /^ *([\*\-+:]|\d+\.) /, token: "bullet"},
              {regex: /^(\*{2}[^\*\n]+\*{2})/, token: "strong"},
              {regex: /^(\*[^\*\n]+\*)/, token: "emphasis"},
              {
                  regex: /^(!?\[[^\]\n]*]\([^\)\n]+\))/,
                  rules: [
                      {
                          regex: /^(\[.+\])/,
                          rules: [
                              {regex: /^([^\[\]]+)/, token: "string"},
                          ],
                      },
                      {
                          regex: /^(\(.+\))/,
                          rules: [
                              {regex: /^([^\(\)]+)/, token: "link"},
                          ],
                      }
                  ],
              },
              {regex: /^(\> [^\n]+)/, token: "quote"},
          ],
      },
  };

  const getRule = (rules, str) => {
      return rules.find(rule => {
          if (rule.starts) {
              return rule.starts.test(str) && rule.ends.test(str);
          }
          return rule.regex.test(str);
      });
  };

  const getMatch = (rule, str) => {
      if (rule.starts) {
          const match = rule.ends.exec(str);
          return str.substring(0, match.index + match[0].length);
      }
      return rule.regex.exec(str)[0];
  };

  const _highlight = (code, rules) => {
      let text = "", i = 0;
      while (i < code.length) {
          const subCode = code.substring(i);
          const rule = getRule(rules, subCode);
          if (rule) {
              const match = getMatch(rule, subCode);
              if (match.length > 0) {
                  text = text + (rule.rules ? _highlight(match, rule.rules) : `<span class="token-${rule.token}">${escape(match)}</span>`);
                  i = i + match.length;
                  continue;
              }
          }
          text = text + escape(code[i]);
          i = i + 1;
      }
      return text;
  };

  const highlight = (code, language = "javascript") => {
      return _highlight(code, languages[language]?.rules || []);
  };

  function showPluginCodeEditor(plugins, plugin, pluginManager) {
      let editorDiv = document.createElement("div");
      editorDiv.addEventListener("keydown", (e) => e.stopPropagation());
      let editor = create(editorDiv, {
          language: "javascript",
          highlight: highlight,
          className: "codecake-dark codeCakeEditor",
          lineNumbers: true
      });
      editor.setCode(plugin.script);
      showModal(editorDiv, {
          id: "core-CodeEditor",
          title: "Edit Plugin Code",
          style: "width: 90%",
          buttons: [
              {
                  text: "cancel",
                  style: "close"
              }, {
                  text: "save",
                  style: "primary",
                  onClick() {
                      let code = editor.getCode();
                      let headers = parsePluginHeader(code);
                      let canceled = false;
                      for (let otherPlugin of pluginManager.plugins) {
                          if (otherPlugin === plugin)
                              continue;
                          if (otherPlugin.headers.name === headers.name) {
                              canceled = !confirm(`A plugin named ${headers.name} already exists! Do you want to overwrite it?`);
                              break;
                          }
                      }
                      if (canceled)
                          return;
                      for (let otherPlugin of plugins) {
                          if (otherPlugin === plugin || otherPlugin.headers.name !== headers.name)
                              continue;
                          pluginManager.deletePlugin(otherPlugin);
                      }
                      plugin.edit(code, headers);
                      pluginManager.updatePlugins();
                  }
              }
          ]
      });
  }
  function createPlugin(pluginManager) {
      let editorDiv = document.createElement("div");
      editorDiv.addEventListener("keydown", (e) => e.stopPropagation());
      let editor = create(editorDiv, {
          language: "javascript",
          highlight: highlight,
          className: "codecake-dark codeCakeEditor",
          lineNumbers: true
      });
      const defaultCode = `/**
* @name New Plugin
* @description A new plugin
* @author Your Name Here
*/`;
      editor.setCode(defaultCode);
      showModal(editorDiv, {
          id: "core-CodeEditor",
          title: "Create New Plugin",
          style: "width: 90%",
          buttons: [
              {
                  text: "cancel",
                  style: "close"
              }, {
                  text: "save",
                  style: "primary",
                  onClick() {
                      let code = editor.getCode();
                      pluginManager.createPlugin(code);
                  }
              }
          ]
      });
  }
  function showLibCodeEditor(lib, libManager) {
      let editorDiv = document.createElement("div");
      editorDiv.addEventListener("keydown", (e) => e.stopPropagation());
      let editor = create(editorDiv, {
          language: "javascript",
          highlight: highlight,
          className: "codecake-dark codeCakeEditor",
          lineNumbers: true
      });
      editor.setCode(lib.script);
      showModal(editorDiv, {
          id: "core-CodeEditor",
          title: "Edit Library Code",
          style: "width: 90%",
          buttons: [
              {
                  text: "cancel",
                  style: "close"
              }, {
                  text: "save",
                  style: "primary",
                  onClick() {
                      let code = editor.getCode();
                      libManager.editLib(lib, code);
                  }
              }
          ]
      });
  }
  function createLib(libManager) {
      let editorDiv = document.createElement("div");
      editorDiv.addEventListener("keydown", (e) => e.stopPropagation());
      let editor = create(editorDiv, {
          language: "javascript",
          highlight: highlight,
          className: "codecake-dark codeCakeEditor",
          lineNumbers: true
      });
      const defaultCode = `/**
* @name New Library
* @description A new library
* @author Your Name Here
* @isLibrary true
*/`;
      editor.setCode(defaultCode);
      showModal(editorDiv, {
          id: "core-CodeEditor",
          title: "Create New Library",
          style: "width: 90%",
          buttons: [
              {
                  text: "cancel",
                  style: "close"
              }, {
                  text: "save",
                  style: "primary",
                  onClick() {
                      let code = editor.getCode();
                      libManager.createLib(code);
                  }
              }
          ]
      });
  }

  const scriptUrl = "https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/build/bundle.user.js";
  async function checkScriptUpdate() {
      const res = await GL.net.corsRequest({ url: scriptUrl })
          .catch(() => {
          alert("Failed to check for updates. Did you allow Gimloader to make Cross-Origin requests?");
      });
      if (!res)
          return;
      const versionPrefix = '// @version';
      let index = res.responseText.indexOf(versionPrefix) + versionPrefix.length;
      let incomingVersion = res.responseText.slice(index, res.responseText.indexOf('\n', index)).trim();
      // compare versions
      let comparison = compareVersions(version, incomingVersion);
      if (comparison === 'same')
          alert("This script is up to date!");
      else if (comparison === 'older') {
          let conf = confirm(`A new version of Gimloader is available! Would you like to update?`);
          if (conf) {
              window.location.href = scriptUrl;
          }
      }
      else {
          alert("You are using a newer version of Gimloader than the one available on Github.");
      }
  }
  async function checkPluginUpdate(plugin) {
      if (!plugin.headers.downloadUrl)
          return;
      const res = await GL.net.corsRequest({ url: plugin.headers.downloadUrl })
          .catch(() => {
          alert("Failed to check for updates. Did you allow Gimloader to make Cross-Origin requests?");
      });
      if (!res)
          return;
      let incomingHeaders = parsePluginHeader(res.responseText);
      if (res.responseText === plugin.script) {
          alert("This plugin is up to date!");
          return;
      }
      let conf;
      let comparison = compareVersions(plugin.headers.version ?? '', incomingHeaders.version ?? '');
      let changeStr = `(${plugin.headers.version} -> ${incomingHeaders.version})`;
      if (comparison === 'same') {
          conf = confirm(`A different version of ${plugin.headers.name} is available ${changeStr}. Would you like to switch?`);
      }
      else if (comparison === 'newer') {
          conf = confirm(`You are using a newer version of ${plugin.headers.name} than the remote one ${changeStr}. Would you like to switch?`);
      }
      else {
          conf = confirm(`A new version of ${plugin.headers.name} is available ${changeStr}! Would you like to update?`);
      }
      if (conf) {
          plugin.edit(res.responseText, incomingHeaders);
          GL.pluginManager.updatePlugins();
      }
  }
  async function checkLibUpdate(lib) {
      if (!lib.headers.downloadUrl)
          return;
      const res = await GL.net.corsRequest({ url: lib.headers.downloadUrl })
          .catch(() => {
          alert("Failed to check for updates. Did you allow Gimloader to make Cross-Origin requests?");
      });
      if (!res)
          return;
      let incomingHeaders = parseLibHeader(res.responseText);
      if (res.responseText === lib.script) {
          alert("This library is up to date!");
          return;
      }
      let conf;
      let comparison = compareVersions(lib.headers.version ?? '', incomingHeaders.version ?? '');
      let changeStr = `(${lib.headers.version} -> ${incomingHeaders.version})`;
      if (comparison === 'same') {
          conf = confirm(`A different version of ${lib.headers.name} is available ${changeStr}. Would you like to switch?`);
      }
      else if (comparison === 'newer') {
          conf = confirm(`You are using a newer version of ${lib.headers.name} than the remote one ${changeStr}. Would you like to switch?`);
      }
      else {
          conf = confirm(`A new version of ${lib.headers.name} is available ${changeStr}! Would you like to update?`);
      }
      if (conf) {
          GL.lib.deleteLib(lib);
          GL.lib.createLib(res.responseText, incomingHeaders);
      }
  }
  function compareVersions(v1, v2) {
      if (v1 === v2)
          return 'same';
      if (!v1 || !v2)
          return 'newer';
      let parts1 = v1.split('.');
      let parts2 = v2.split('.');
      for (let i = 0; i < parts1.length; i++) {
          let p1 = parseInt(parts1[i]);
          let p2 = parseInt(parts2[i]);
          if (isNaN(p1) || isNaN(p2))
              return 'newer';
          if (p1 !== p2) {
              return p1 > p2 ? 'newer' : 'older';
          }
      }
      return 'same';
  }

  function LibManagerUI() {
      const { React, lib: libManager } = GL;
      const [libs, setLibs] = React.useState(libManager.libs);
      libManager.reactSetLibs = setLibs;
      function importFile() {
          let filePickerInput = document.createElement("input");
          filePickerInput.accept = ".js";
          filePickerInput.type = "file";
          filePickerInput.click();
          filePickerInput.addEventListener("change", async () => {
              let file = filePickerInput.files?.[0];
              if (!file)
                  return;
              // read the file
              let reader = new FileReader();
              reader.addEventListener("load", () => {
                  let code = reader.result;
                  code = code.replaceAll("\r\n", "\n");
                  libManager.createLib(code);
              });
              reader.readAsText(file);
          });
      }
      function deleteLib(lib) {
          let conf = confirm(`Are you sure you want to delete ${lib.headers.name}?`);
          if (!conf)
              return;
          libManager.deleteLib(lib);
      }
      return (React.createElement("div", { className: "gl-listWrap" },
          React.createElement("div", { className: "header" },
              React.createElement("button", { dangerouslySetInnerHTML: { __html: importSvg }, onClick: importFile }),
              React.createElement("button", { dangerouslySetInnerHTML: { __html: plusBoxOutline }, onClick: () => createLib(libManager) })),
          React.createElement("div", { className: "scriptList" },
              Object.values(libs).map((lib) => {
                  return (React.createElement("div", { key: lib.headers.name, className: "scriptItem" },
                      React.createElement("div", { className: "info" },
                          React.createElement("div", { className: "top" },
                              React.createElement("div", { className: "name" },
                                  lib.headers.name,
                                  lib.headers.version ?
                                      React.createElement("span", { className: "version" },
                                          "v",
                                          lib.headers.version) : null)),
                          React.createElement("div", { className: "author" },
                              "by ",
                              lib.headers.author),
                          React.createElement("div", { className: "description" }, lib.headers.description)),
                      React.createElement("div", { className: "buttons" },
                          lib.headers.downloadUrl ? (React.createElement("button", { dangerouslySetInnerHTML: { __html: update }, onClick: () => checkLibUpdate(lib) })) : null,
                          React.createElement("button", { dangerouslySetInnerHTML: { __html: pencilOutline }, onClick: () => showLibCodeEditor(lib, libManager) }),
                          React.createElement("button", { dangerouslySetInnerHTML: { __html: deleteSvg }, onClick: () => deleteLib(lib) }))));
              }),
              Object.keys(libs).length === 0 ?
                  React.createElement("div", { className: "empty" }, "You have no libraries installed. These are used to store code that is shared between plugins.")
                  : null)));
  }

  var checkBold = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z\" /></svg>";

  var closeThick = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M20 6.91L17.09 4L12 9.09L6.91 4L4 6.91L9.09 12L4 17.09L6.91 20L12 14.91L17.09 20L20 17.09L14.91 12L20 6.91Z\" /></svg>";

  var cogOutline = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10M10,22C9.75,22 9.54,21.82 9.5,21.58L9.13,18.93C8.5,18.68 7.96,18.34 7.44,17.94L4.95,18.95C4.73,19.03 4.46,18.95 4.34,18.73L2.34,15.27C2.21,15.05 2.27,14.78 2.46,14.63L4.57,12.97L4.5,12L4.57,11L2.46,9.37C2.27,9.22 2.21,8.95 2.34,8.73L4.34,5.27C4.46,5.05 4.73,4.96 4.95,5.05L7.44,6.05C7.96,5.66 8.5,5.32 9.13,5.07L9.5,2.42C9.54,2.18 9.75,2 10,2H14C14.25,2 14.46,2.18 14.5,2.42L14.87,5.07C15.5,5.32 16.04,5.66 16.56,6.05L19.05,5.05C19.27,4.96 19.54,5.05 19.66,5.27L21.66,8.73C21.79,8.95 21.73,9.22 21.54,9.37L19.43,11L19.5,12L19.43,13L21.54,14.63C21.73,14.78 21.79,15.05 21.66,15.27L19.66,18.73C19.54,18.95 19.27,19.04 19.05,18.95L16.56,17.95C16.04,18.34 15.5,18.68 14.87,18.93L14.5,21.58C14.46,21.82 14.25,22 14,22H10M11.25,4L10.88,6.61C9.68,6.86 8.62,7.5 7.85,8.39L5.44,7.35L4.69,8.65L6.8,10.2C6.4,11.37 6.4,12.64 6.8,13.8L4.68,15.36L5.43,16.66L7.86,15.62C8.63,16.5 9.68,17.14 10.87,17.38L11.24,20H12.76L13.13,17.39C14.32,17.14 15.37,16.5 16.14,15.62L18.57,16.66L19.32,15.36L17.2,13.81C17.6,12.64 17.6,11.37 17.2,10.2L19.31,8.65L18.56,7.35L16.15,8.39C15.38,7.5 14.32,6.86 13.12,6.62L12.75,4H11.25Z\" /></svg>";

  let reactListenerSet = false;
  let queuedMessages = [];
  function showErrorMessage(msg, title = "Error") {
      // if react hasn't loaded yet queue up messages
      if (!GL.React) {
          queuedMessages.push({ msg, title });
          if (!reactListenerSet) {
              reactListenerSet = true;
              GL.addEventListener('reactLoaded', () => {
                  for (let message of queuedMessages) {
                      showErrorMessage(message.msg, message.title);
                  }
              });
          }
      }
      const React = GL.React;
      GL.UI.showModal(React.createElement("pre", { className: "gl-errorMsg" }, msg), {
          title,
          buttons: [
              { text: "Ok", style: "primary" }
          ]
      });
  }

  function LibraryInfo({ plugin }) {
      const React = GL.React;
      let libs = plugin.headers.needsLib.map(lib => {
          let parts = lib.split('|');
          return [parts[0].trim(), parts[1]?.trim()];
      });
      return (React.createElement("table", { className: "gl-libraryInfo" },
          React.createElement("tr", null,
              React.createElement("th", null, "Installed?"),
              React.createElement("th", null, "Name"),
              React.createElement("th", null, "URL")),
          libs.map(lib => {
              return (React.createElement("tr", null,
                  React.createElement("td", null, GL.lib.getLib(lib[0]) ? "Yes" : "No"),
                  React.createElement("td", null, lib[0]),
                  React.createElement("td", { className: "url" }, lib[1] ?? '')));
          })));
  }

  function PluginManagerUI() {
      const { React, pluginManager } = GL;
      const [plugins, setPlugins] = React.useState(pluginManager.plugins);
      pluginManager.reactSetPlugins = setPlugins;
      function importFile() {
          let filePickerInput = document.createElement("input");
          filePickerInput.accept = ".js";
          filePickerInput.type = "file";
          filePickerInput.click();
          filePickerInput.addEventListener("change", async () => {
              let file = filePickerInput.files?.[0];
              if (!file)
                  return;
              // read the file
              let reader = new FileReader();
              reader.addEventListener("load", async () => {
                  let code = reader.result;
                  code = code.replaceAll("\r\n", "\n");
                  pluginManager.createPlugin(code);
              });
              reader.readAsText(file);
          });
      }
      function deletePlugin(plugin) {
          let conf = confirm(`Are you sure you want to delete ${plugin.headers.name}?`);
          if (!conf)
              return;
          pluginManager.deletePlugin(plugin);
      }
      function showLibraries(plugin) {
          GL.UI.showModal(React.createElement(LibraryInfo, { plugin: plugin }), {
              title: "Libraries Required by " + plugin.headers.name,
              id: "core-libInfo",
              buttons: [{
                      text: "Close",
                      style: "primary"
                  }]
          });
      }
      return (React.createElement("div", { className: "gl-listWrap" },
          React.createElement("div", { className: "header" },
              React.createElement("button", { dangerouslySetInnerHTML: { __html: importSvg }, onClick: importFile }),
              React.createElement("button", { dangerouslySetInnerHTML: { __html: plusBoxOutline }, onClick: () => createPlugin(pluginManager) }),
              React.createElement("button", { dangerouslySetInnerHTML: { __html: checkBold }, title: "Enable All", onClick: () => pluginManager.enableAll() }),
              React.createElement("button", { dangerouslySetInnerHTML: { __html: closeThick }, title: "Disable All", onClick: () => pluginManager.disableAll() })),
          React.createElement("div", { className: "scriptList" },
              plugins.map((plugin) => {
                  return (React.createElement("div", { key: plugin.headers.name, className: "scriptItem" },
                      React.createElement("div", { className: "info" },
                          React.createElement("div", { className: "top" },
                              React.createElement("div", { className: "name" },
                                  plugin.headers.name,
                                  plugin.headers.version ?
                                      React.createElement("span", { className: "version" },
                                          "v",
                                          plugin.headers.version) : null),
                              React.createElement("input", { type: "checkbox", checked: plugin.enabled, onInput: async (e) => {
                                      if (!e.currentTarget.checked) {
                                          await plugin.enable()
                                              .catch((e) => showErrorMessage(e.message, `Failed to enable plugin ${plugin.headers.name}`));
                                      }
                                      else
                                          plugin.disable();
                                      pluginManager.save(plugins);
                                  } })),
                          React.createElement("div", { className: "author" },
                              "by ",
                              plugin.headers.author),
                          React.createElement("div", { className: "description" }, plugin.headers.description)),
                      React.createElement("div", { className: "buttons" },
                          plugin.headers.downloadUrl ? (React.createElement("button", { dangerouslySetInnerHTML: { __html: update }, onClick: () => checkPluginUpdate(plugin) })) : null,
                          plugin.headers.needsLib.length > 0 ? (React.createElement("button", { dangerouslySetInnerHTML: { __html: solidBook }, onClick: () => showLibraries(plugin) })) : null,
                          plugin.return?.openSettingsMenu ? (React.createElement("button", { dangerouslySetInnerHTML: { __html: cogOutline }, onClick: () => plugin.return.openSettingsMenu() })) : null,
                          React.createElement("button", { dangerouslySetInnerHTML: { __html: pencilOutline }, onClick: () => showPluginCodeEditor(plugins, plugin, pluginManager) }),
                          React.createElement("button", { dangerouslySetInnerHTML: { __html: deleteSvg }, onClick: () => deletePlugin(plugin) }))));
              }),
              plugins.length === 0 ?
                  React.createElement("div", { className: "empty" }, "No plugins! Create or import one to get started.")
                  : null)));
  }

  function UpdateScreen() {
      const React = GL.React;
      let [showingCompleted, setShowingCompleted] = React.useState(false);
      let [completed, setCompleted] = React.useState(0);
      let [total, setTotal] = React.useState(0);
      async function checkAll() {
          if (!confirm("Do you want to try to update Gimloader, all plugins, and all libraries?"))
              return;
          setShowingCompleted(true);
          let promises = [];
          for (let plugin of GL.pluginManager.plugins) {
              if (!plugin.headers.downloadUrl)
                  continue;
              promises.push(new Promise(async (res, rej) => {
                  let resp = await GL.net.corsRequest({ url: plugin.headers.downloadUrl })
                      .catch(() => rej(`Failed to update ${plugin.headers.name} from ${plugin.headers.downloadUrl}`));
                  if (!resp)
                      return rej();
                  setCompleted(completed + 1);
                  let headers = parsePluginHeader(resp.responseText);
                  let comparison = compareVersions(plugin.headers.version ?? '', headers.version ?? '');
                  if (comparison !== 'older')
                      return res();
                  plugin.edit(resp.responseText, headers);
              }));
          }
          for (let lib of Object.values(GL.lib.libs)) {
              if (!lib.headers.downloadUrl)
                  continue;
              promises.push(new Promise(async (res, rej) => {
                  let resp = await GL.net.corsRequest({ url: lib.headers.downloadUrl })
                      .catch(() => rej(`Failed to update ${lib.headers.name} from ${lib.headers.downloadUrl}`));
                  if (!resp)
                      return rej();
                  setCompleted(completed + 1);
                  let headers = parseLibHeader(resp.responseText);
                  let comparison = compareVersions(lib.headers.version ?? '', headers.version ?? '');
                  if (comparison !== 'older')
                      return res();
                  GL.lib.editLib(lib, resp.responseText, headers);
              }));
          }
          promises.push(new Promise(async (res, rej) => {
              let resp = await GL.net.corsRequest({ url: scriptUrl })
                  .catch(() => rej(`Failed to update Gimloader from ${scriptUrl}`));
              if (!resp)
                  return rej();
              setCompleted(completed + 1);
              const versionPrefix = '// @version';
              let index = resp.responseText.indexOf(versionPrefix) + versionPrefix.length;
              let incomingVersion = resp.responseText.slice(index, resp.responseText.indexOf('\n', index)).trim();
              let comparison = compareVersions(GL.version, incomingVersion);
              if (comparison !== 'older')
                  return res();
              location.href = scriptUrl;
              res();
          }));
          setTotal(promises.length);
          let results = await Promise.allSettled(promises);
          let failed = results.filter((r) => r.status === 'rejected');
          if (failed.length > 0) {
              let msg = `Failed to update ${failed.length} items:\n`
                  + failed.map((f) => f.reason).join('\n')
                  + '\nDid you allow Gimloader to make Cross-Origin requests?';
              showErrorMessage(msg, "Some Updates Failed");
          }
          setShowingCompleted(false);
      }
      return (React.createElement("div", { className: "gl-updateList" },
          React.createElement("div", { className: "checkAll" },
              React.createElement("div", { dangerouslySetInnerHTML: { __html: update }, className: "updateBtn", onClick: () => checkAll() }),
              "Check updates for all"),
          showingCompleted && React.createElement("progress", { value: completed, max: total }),
          React.createElement("h1", null, "Gimloader"),
          React.createElement("div", null,
              React.createElement("div", { dangerouslySetInnerHTML: { __html: update }, className: "updateBtn", onClick: () => checkScriptUpdate() }),
              "Gimloader v",
              GL.version),
          React.createElement("h1", null, "Plugins"),
          GL.pluginManager.plugins.length === 0 && React.createElement("div", null, "No plugins loaded"),
          GL.pluginManager.plugins.map((plugin) => {
              return (React.createElement("div", { key: plugin.headers.name },
                  plugin.headers.downloadUrl && React.createElement("div", { dangerouslySetInnerHTML: { __html: update }, className: "updateBtn", onClick: () => checkPluginUpdate(plugin) }),
                  plugin.headers.name,
                  " v",
                  plugin.headers.version));
          }),
          React.createElement("h1", null, "Libraries"),
          Object.keys(GL.lib.libs).length === 0 && React.createElement("div", null, "No plugins loaded"),
          Object.values(GL.lib.libs).map((lib) => {
              return (React.createElement("div", { key: lib.headers.name },
                  lib.headers.downloadUrl && React.createElement("div", { dangerouslySetInnerHTML: { __html: update }, className: "updateBtn", onClick: () => checkLibUpdate(lib) }),
                  lib.headers.name,
                  " v",
                  lib.headers.version));
          }),
          React.createElement("hr", null),
          React.createElement("div", null, navigator.userAgent)));
  }

  function MenuUI() {
      const React = GL.React;
      const tabs = [
          ["Plugins", wrench],
          ["Libraries", solidBook],
          ["Info / Updates", update]
      ];
      const [tab, setTab] = React.useState(0);
      return (React.createElement("div", { className: "gl-menu" },
          React.createElement("div", { className: "tabs" }, tabs.map((t, i) => {
              return (React.createElement("div", { onClick: () => {
                      setTab(i);
                  }, className: `tab ${tab === i ? 'selected' : ''}` },
                  React.createElement("div", { dangerouslySetInnerHTML: { __html: t[1] }, className: 'icon' }),
                  React.createElement("div", { className: "label" }, t[0])));
          })),
          React.createElement("div", { className: "content" },
              tab === 0 && React.createElement(PluginManagerUI, null),
              tab === 1 && React.createElement(LibManagerUI, null),
              tab === 2 && React.createElement(UpdateScreen, null))));
  }

  function openPluginManager() {
      const React = GL.React;
      showModal(React.createElement(MenuUI, null), {
          id: 'core-PluginManager',
          title: 'Manage Plugins',
          style: "width: clamp(600px, 50%, 90%); height: 80%",
          closeOnBackgroundClick: true,
          buttons: [
              {
                  text: "close",
                  style: "primary"
              }
          ]
      });
  }
  function addPluginButtons(loader) {
      // add a hotkey shift+p to open the plugin manager
      loader.hotkeys.add(new Set(['alt', 'p']), () => openPluginManager());
      GM.registerMenuCommand("Open Plugin Manager", () => openPluginManager());
      // add the button to the creative screen and the host screen
      loader.parcel.interceptRequire(null, exports => exports?.default?.toString?.().includes('.disable?"none":"all"'), exports => {
          loader.patcher.after(null, exports, "default", (_, __, res) => {
              if (res?.props?.className?.includes?.('light-shadow flex between')) {
                  let nativeType = res.props.children[1].type.type;
                  res.props.children[1].type.type = function () {
                      let res = nativeType.apply(this, arguments);
                      // make sure we haven't already added the button
                      if (res.props.children.some((c) => c?.props?.tooltip === 'Plugins'))
                          return res;
                      let btnType = res.props.children[0].type;
                      res.props.children.splice(0, 0, loader.React.createElement(btnType, {
                          tooltip: 'Plugins',
                          children: loader.React.createElement('div', {
                              className: 'gl-wrench',
                              dangerouslySetInnerHTML: { __html: wrench }
                          }),
                          onClick: () => openPluginManager()
                      }));
                      return res;
                  };
              }
              if (res?.props?.children?.props?.tooltip === 'Options') {
                  res.props.className = 'gl-row';
                  let newBtn = res.props.children.type({
                      tooltip: 'Plugins',
                      children: loader.React.createElement('div', {
                          className: 'gl-wrench',
                          dangerouslySetInnerHTML: { __html: wrench }
                      }),
                      onClick: () => openPluginManager()
                  });
                  res.props.children = [res.props.children, newBtn];
              }
              return res;
          });
      }, true);
      // add the wrench button to the join screen
      loader.parcel.interceptRequire(null, exports => exports?.default?.toString?.().includes('type:"secondary"'), exports => {
          loader.patcher.after(null, exports, 'default', (_, __, res) => {
              let newButton = loader.React.createElement('button', {
                  className: 'openPlugins',
                  dangerouslySetInnerHTML: { __html: wrench },
                  onClick: () => openPluginManager()
              });
              return loader.React.createElement('div', { className: 'gl-join' }, [res, newButton]);
          });
      }, true);
      // add the button to the home screen
      loader.parcel.interceptRequire(null, exports => exports?.SpaceContext, exports => {
          loader.patcher.before(null, exports, 'default', (_, args) => {
              let light = location.href.includes("/creative");
              if (args[0].children?.some?.((c) => c?.key === 'creative')) {
                  let icon = loader.React.createElement('div', {
                      className: 'icon',
                      dangerouslySetInnerHTML: { __html: wrench }
                  });
                  let text = loader.React.createElement('div', {
                      className: "text"
                  }, "Plugins");
                  let newEl = loader.React.createElement('div', {
                      className: `gl-homeWrench ${light ? 'light' : ''}`,
                      onClick: () => openPluginManager()
                  }, [icon, text]);
                  args[0].children.splice(0, 0, newEl);
              }
          });
      }, true);
      // add the button to the host screen before the game starts
      loader.parcel.interceptRequire(null, 
      // the } is there for a reason
      exports => exports?.default?.toString?.().includes('customHorizontalPadding}'), exports => {
          let nativeDefault = exports.default;
          loader.patcher.after(null, exports, 'default', (_, __, res) => {
              let btnContents = loader.React.createElement('div', {
                  className: "gl-hostWrench"
              }, [
                  loader.React.createElement('div', {
                      className: 'gl-wrench',
                      dangerouslySetInnerHTML: { __html: wrench }
                  }),
                  loader.React.createElement('div', {}, "Plugins")
              ]);
              let newBtn = nativeDefault.apply(this, [{
                      children: btnContents,
                      onClick: () => openPluginManager(),
                      customColor: "#01579b",
                      className: 'gl-hostWrenchBtn'
                  }]);
              let name = res?.props?.children?.props?.children?.[2]?.props?.children?.props?.children?.[1];
              if (name === 'Rewards') {
                  res.props.children = [newBtn, res.props.children];
              }
              return res;
          });
      }, true);
      // add the button to 1d host screens
      loader.parcel.interceptRequire(null, exports => exports?.default?.displayName?.includes?.('inject-with-gameOptions-gameValues-players-kit-ui'), exports => {
          loader.patcher.after(null, exports.default, 'render', (_, __, res) => {
              let nativeType = res.type;
              delete res.type;
              res.type = function () {
                  let res = new nativeType(...arguments);
                  let nativeRender = res.render;
                  delete res.render;
                  res.render = function () {
                      let res = nativeRender.apply(this, arguments);
                      let newBtn = loader.React.createElement('button', {
                          className: 'gl-1dHostPluginBtn',
                          onClick: () => openPluginManager()
                      }, 'Plugins');
                      res.props.children = [newBtn, res.props.children];
                      return res;
                  };
                  return res;
              };
              return res;
          });
      }, true);
      // add the button to the 1d host screen while in-game
      // we need to do this to intercept the stupid mobx wrapper which is a massive pain
      loader.parcel.interceptRequire(null, exports => exports?.__decorate, exports => {
          loader.patcher.before(null, exports, '__decorate', (_, args) => {
              if (args[1]?.toString?.()?.includes("Toggle Music")) {
                  let nativeRender = args[1].prototype.render;
                  args[1].prototype.render = function () {
                      let res = nativeRender.apply(this, args);
                      let children = res.props.children[2].props.children.props.children;
                      let newEl = loader.React.createElement(children[1].type, {
                          icon: loader.React.createElement('div', {
                              className: 'gl-1dHostGameWrench',
                              dangerouslySetInnerHTML: { __html: wrench }
                          }),
                          onClick: () => openPluginManager(),
                          tooltipMessage: "Plugins"
                      });
                      children.splice(0, 0, newEl);
                      return res;
                  };
              }
          });
      }, true);
      // add the button to the 1d game screen
      loader.parcel.interceptRequire(null, exports => exports?.observer &&
          exports.Provider, exports => {
          // let nativeObserver = exports.observer;
          // delete exports.observer;
          // exports.observer = function() {
          loader.patcher.before(null, exports, 'observer', (_, args) => {
              if (args[0]?.toString?.().includes('"aria-label":"Menu"')) {
                  let nativeArgs = args[0];
                  args[0] = function () {
                      let res = nativeArgs.apply(this, arguments);
                      // for when we're still on the join screen
                      if (res?.props?.children?.props?.children?.props?.src === '/client/img/svgLogoWhite.svg') {
                          let props = res.props.children.props;
                          props.children = [props.children, loader.React.createElement('div', {
                                  className: 'gl-1dGameWrenchJoin',
                                  style: { cursor: 'pointer' },
                                  dangerouslySetInnerHTML: { __html: wrench },
                                  onClick: () => openPluginManager()
                              })];
                          return res;
                      }
                      let children = res?.props?.children?.[0]?.props?.children?.props?.children;
                      if (!children)
                          return res;
                      let newEl = loader.React.createElement(children[1].type, {
                          onClick: () => openPluginManager(),
                      }, loader.React.createElement('div', {
                          className: 'gl-1dGameWrench',
                          dangerouslySetInnerHTML: { __html: wrench }
                      }));
                      children.splice(3, 0, newEl);
                      return res;
                  };
              }
          });
      }, true);
  }

  /*
      This method of intercepting modules was inspired by https://codeberg.org/gimhook/gimhook
  */
  // the code below is copied from https://codeberg.org/gimhook/gimhook/src/branch/master/modloader/src/parcel.ts,
  // who in turn copied it from the parcel source code.
  const scriptSelector = 'script[src*="index"]:not([nomodule])';
  const redirectedPages = ['/host', '/settings'];
  class Parcel extends EventTarget {
      gimloader;
      _parcelModuleCache = {};
      _parcelModules = {};
      reqIntercepts = [];
      readyToIntercept = true;
      constructor(loader) {
          super();
          this.gimloader = loader;
          // When the page would navigate to a page that would normally break
          // navigate to a page that doesn't exist and from there set up Gimloader
          // and then load the page that would normally break
          this.interceptRequire(null, exports => exports?.AsyncNewTab, exports => {
              GL.patcher.after(null, exports, "AsyncNewTab", (_, __, returnVal) => {
                  GL.patcher.before(null, returnVal, "openTab", (_, args) => {
                      let url = new URL(args[0]);
                      if (redirectedPages.includes(url.pathname)) {
                          args[0] = "https://www.gimkit.com/gimloaderRedirect?to=" + encodeURIComponent(args[0]);
                      }
                  });
              });
          });
          if (location.pathname === "/gimloaderRedirect") {
              let params = new URLSearchParams(location.search);
              let to = params.get('to');
              this.redirect(to);
          }
          else if (redirectedPages.includes(location.pathname)) {
              location.href = "https://www.gimkit.com/gimloaderRedirect?to=" + encodeURIComponent(location.href);
          }
          else {
              let existingScripts = document.querySelectorAll(scriptSelector);
              if (existingScripts.length > 0) {
                  this.readyToIntercept = false;
                  window.addEventListener('load', () => {
                      this.setup();
                      this.reloadExistingScripts(existingScripts);
                  });
              }
              else
                  this.setup();
          }
      }
      async redirect(to) {
          let res = await fetch(to);
          let text = await res.text();
          let parser = new DOMParser();
          let doc = parser.parseFromString(text, 'text/html');
          if (document.readyState !== "complete") {
              await new Promise(resolve => window.addEventListener('load', resolve));
          }
          // redo the DOM
          this.setup();
          this.nukeDom();
          document.documentElement.innerHTML = doc.documentElement.innerHTML;
          GL.addStyleSheets();
          // change url back to /host
          history.replaceState(null, '', to);
          // re-import the scripts
          let existingScripts = document.querySelectorAll(scriptSelector);
          this.reloadExistingScripts(existingScripts);
      }
      emptyModules() {
          this._parcelModuleCache = {};
          this._parcelModules = {};
      }
      onModuleRequired(id, callback) {
          let intercept = { type: 'moduleRequired', callback };
          if (id)
              intercept.id = id;
          this.reqIntercepts.push(intercept);
          // return a cancel function
          return () => {
              let index = this.reqIntercepts.indexOf(intercept);
              if (index !== -1)
                  this.reqIntercepts.splice(index, 1);
          };
      }
      interceptRequire(id, match, callback, once = false) {
          if (!match || !callback)
              throw new Error('match and callback are required');
          let intercept = { type: 'interceptRequire', match, callback, once };
          if (id)
              intercept.id = id;
          this.reqIntercepts.push(intercept);
          // return a cancel function
          return () => {
              let index = this.reqIntercepts.indexOf(intercept);
              if (index !== -1)
                  this.reqIntercepts.splice(index, 1);
          };
      }
      stopIntercepts(id) {
          this.reqIntercepts = this.reqIntercepts.filter(intercept => intercept.id !== id);
      }
      async decachedImport(url) {
          let src = new URL(url, location.origin).href;
          let res = await fetch(src);
          let text = await res.text();
          // nasty hack to prevent the browser from caching other scripts
          text = text.replaceAll('import(', 'window.GL.parcel.decachedImport(');
          text = text.replaceAll('import.meta.url', `'${src}'`);
          let blob = new Blob([text], { type: 'application/javascript' });
          let blobUrl = URL.createObjectURL(blob);
          return import(blobUrl);
      }
      async reloadExistingScripts(existingScripts) {
          // nuke the dom
          this.nukeDom();
          this.readyToIntercept = true;
          this.emptyModules();
          for (let existingScript of existingScripts) {
              // re-import the script since it's already loaded
              log(existingScript, 'has already loaded, re-importing...');
              this.decachedImport(existingScript.src);
              existingScript.remove();
          }
      }
      nukeDom() {
          document.querySelector("#root")?.remove();
          let newRoot = document.createElement('div');
          newRoot.id = 'root';
          document.body.appendChild(newRoot);
          // remove all global variables
          let vars = ["__mobxGlobals", "__mobxInstanceCount"];
          for (let v of vars) {
              if (v in window)
                  delete window[v];
          }
      }
      setup() {
          if (!onGimkit)
              return;
          this.gimloader.pluginManager.init();
          let requireHook;
          let nativeParcelRequire = unsafeWindow["parcelRequire388b"];
          ((requireHook = (moduleName) => {
              if (moduleName in this._parcelModuleCache) {
                  return this._parcelModuleCache[moduleName].exports;
              }
              if (moduleName in this._parcelModules) {
                  let moduleCallback = this._parcelModules[moduleName];
                  delete this._parcelModules[moduleName];
                  let moduleObject = {
                      id: moduleName,
                      exports: {}
                  };
                  this._parcelModuleCache[moduleName] = moduleObject;
                  moduleCallback.call(moduleObject.exports, moduleObject, moduleObject.exports);
                  // run intercepts
                  if (this.readyToIntercept) {
                      for (let intercept of this.reqIntercepts) {
                          if (intercept.type === 'interceptRequire') {
                              // check for matches for the moduleRequired intercepts
                              if (intercept.match(moduleObject.exports)) {
                                  let returned = intercept.callback?.(moduleObject.exports);
                                  if (returned)
                                      moduleObject.exports = returned;
                                  if (intercept.once) {
                                      this.reqIntercepts.splice(this.reqIntercepts.indexOf(intercept), 1);
                                  }
                              }
                          }
                          else {
                              intercept.callback(moduleObject);
                          }
                      }
                  }
                  return moduleObject.exports;
              }
              if (nativeParcelRequire) {
                  return nativeParcelRequire(moduleName);
              }
              throw new Error(`Cannot find module '${moduleName}'`);
          }
          // @ts-ignore
          ).register = (moduleName, moduleCallback) => {
              this._parcelModules[moduleName] = moduleCallback;
              nativeParcelRequire?.register(moduleName, moduleCallback);
          });
          Object.defineProperty(unsafeWindow, "parcelRequire388b", {
              value: requireHook,
              writable: false,
              enumerable: true,
              configurable: false
          });
      }
  }

  class Net {
      loader;
      blueboat;
      colyseus;
      type = 'Unknown';
      is1dHost = false;
      constructor(loader) {
          this.loader = loader;
          this.blueboat = new BlueboatIntercept(loader, this);
          this.colyseus = new ColyseusIntercept(loader, this);
          this.loader.parcel.interceptRequire(null, exports => exports?.default?.toString?.().includes("hasReceivedHostStaticState"), () => {
              this.is1dHost = true;
          });
      }
      corsRequest = GM.xmlHttpRequest;
      get active() {
          if (this.type == 'Unknown')
              return null;
          return this.type == 'Blueboat' ? this.blueboat : this.colyseus;
      }
      get isHost() {
          return this.is1dHost || GL.stores.session.amIGameOwner;
      }
  }
  class BlueboatIntercept extends EventTarget {
      room = null;
      blueboatLoaded = false;
      constructor(loader, net) {
          super();
          let me = this;
          loader.parcel.interceptRequire(null, exports => exports?.default?.toString?.().includes("this.socketListener()"), exports => {
              let nativeRoom = exports.default;
              return function () {
                  let room = new nativeRoom(...arguments);
                  me.room = room;
                  net.type = 'Blueboat';
                  log('Blueboat room intercepted');
                  let nativeCall = room.onMessage.call;
                  room.onMessage.call = function (channel, data) {
                      me.dispatchEvent(new CustomEvent(channel, { detail: data }));
                      me.dispatchEvent(new CustomEvent('*', { detail: { channel, data } }));
                      if (!me.blueboatLoaded) {
                          me.blueboatLoaded = true;
                          loader.dispatchEvent(new CustomEvent('loadEnd'));
                          log("Blueboat game finished loading");
                      }
                      return nativeCall.apply(this, arguments);
                  };
                  return room;
              };
          });
      }
      send(channel, message) {
          if (!this.room)
              return;
          this.room.send(channel, message);
      }
  }
  class ColyseusIntercept extends EventTarget {
      room = null;
      colyseusLoaded = false;
      constructor(loader, net) {
          super();
          let me = this;
          // somewhat taken from https://codeberg.org/gimhook/gimhook/src/branch/master/modloader/src/game.ts
          loader.parcel.interceptRequire(null, exports => exports?.OnJoinedRoom, exports => {
              let nativeOnJoined = exports.OnJoinedRoom;
              delete exports.OnJoinedRoom;
              net.type = 'Colyseus';
              log('Colyseus room intercepted');
              exports.OnJoinedRoom = function (colyseus) {
                  me.room = colyseus.room;
                  let nativeDispatchMsg = colyseus.room.dispatchMessage;
                  delete colyseus.room.dispatchMessage;
                  // intercept colyseus.room.dispatchMessage
                  colyseus.room.dispatchMessage = function (channel, message) {
                      if (!me.colyseusLoaded) {
                          me.colyseusLoaded = true;
                          loader.awaitColyseusLoad();
                          log("Colyseus game finished loading");
                      }
                      me.dispatchEvent(new CustomEvent(channel, { detail: message }));
                      me.dispatchEvent(new CustomEvent('*', { detail: { channel, message } }));
                      nativeDispatchMsg.apply(this, arguments);
                  };
                  return nativeOnJoined.apply(this, [colyseus]);
              };
              return exports;
          });
      }
      send(channel, message) {
          if (!this.room)
              return;
          this.room.send(channel, message);
      }
  }

  class HotkeyManager {
      hotkeys = new Map();
      pressedKeys = new Set();
      constructor() {
          window.addEventListener('keydown', (event) => {
              this.pressedKeys.add(event.key.toLowerCase());
              this.checkHotkeys(event);
          });
          window.addEventListener('keyup', (event) => {
              this.pressedKeys.delete(event.key.toLowerCase());
          });
      }
      releaseAll() {
          this.pressedKeys.clear();
      }
      checkHotkeys(event) {
          for (let [hotkey, run] of this.hotkeys.entries()) {
              if (this.pressedKeys.size < hotkey.size)
                  continue;
              let match = true;
              for (let key of hotkey) {
                  if (!this.pressedKeys.has(key)) {
                      match = false;
                      break;
                  }
              }
              if (match) {
                  if (run.preventDefault)
                      event.preventDefault();
                  run.callback(event);
              }
          }
      }
      add(hotkey, callback, preventDefault = true) {
          this.hotkeys.set(hotkey, { callback, preventDefault });
      }
      remove(hotkey) {
          this.hotkeys.delete(hotkey);
      }
  }

  let styles = new Map();
  async function addStyles(id, styleString) {
      let style = document.createElement('style');
      style.innerHTML = styleString;
      // wait for document to be ready
      if (!document.head)
          await new Promise(res => document.addEventListener('DOMContentLoaded', res, { once: true }));
      document.head.appendChild(style);
      if (id === null)
          return;
      // add to map
      if (!styles.has(id))
          styles.set(id, []);
      styles.get(id)?.push(style);
  }
  function removeStyles(id) {
      if (!styles.has(id))
          return;
      for (let style of styles.get(id)) {
          style.remove();
      }
      styles.delete(id);
  }

  // this patcher implementation is based on the one used by BetterDiscord
  class Patcher {
      patches = new Map();
      unpatchers = new Map();
      applyPatches(object, property) {
          const properties = this.patches.get(object);
          if (!properties)
              return;
          const patches = properties.get(property);
          if (!patches)
              return;
          delete object[property];
          // reset the property to its original value
          object[property] = patches.original;
          // apply all patches
          for (const patch of patches.patches) {
              let original = object[property];
              switch (patch.point) {
                  case 'before':
                      object[property] = function () {
                          let cancel = patch.callback(this, arguments);
                          if (cancel)
                              return;
                          return original.apply(this, arguments);
                      };
                      break;
                  case 'after':
                      object[property] = function () {
                          let returnValue = original.apply(this, arguments);
                          let newReturn = patch.callback(this, arguments, returnValue);
                          if (newReturn)
                              return newReturn;
                          return returnValue;
                      };
                      break;
                  case 'instead':
                      object[property] = function () {
                          return patch.callback(this, arguments);
                      };
                      break;
              }
              // copy over prototypes and attributes
              for (let key of Object.getOwnPropertyNames(patches.original)) {
                  try {
                      object[property][key] = patches.original[key];
                  }
                  catch { }
              }
              Object.setPrototypeOf(object[property], Object.getPrototypeOf(patches.original));
          }
      }
      addPatch(object, property, patch) {
          if (!this.patches.has(object)) {
              this.patches.set(object, new Map([[property, { original: object[property], patches: [] }]]));
          }
          const properties = this.patches.get(object);
          if (!properties)
              return;
          if (!properties.has(property)) {
              properties.set(property, { original: object[property], patches: [] });
          }
          const patches = properties.get(property);
          if (!patches)
              return;
          patches.patches.push(patch);
          // apply patches to the object
          this.applyPatches(object, property);
      }
      getRemovePatch(id, object, property, patch) {
          let unpatch = () => {
              if (id) {
                  // remove the patch from the id's list of unpatchers
                  const unpatchers = this.unpatchers.get(id);
                  if (unpatchers) {
                      const index = unpatchers.indexOf(unpatch);
                      if (index !== -1) {
                          unpatchers.splice(index, 1);
                      }
                  }
              }
              // remove the patch from the patches map
              if (!this.patches.has(object))
                  return;
              const properties = this.patches.get(object);
              if (!properties)
                  return;
              if (!properties.has(property))
                  return;
              const patches = properties.get(property);
              if (!patches)
                  return;
              const index = patches.patches.indexOf(patch);
              if (index === -1)
                  return;
              patches.patches.splice(index, 1);
              // apply patches to the object
              this.applyPatches(object, property);
              // if the list of patches is empty, remove the property from the map
              if (patches.patches.length === 0) {
                  properties.delete(property);
              }
              // if the map of properties is empty, remove the object from the map
              if (properties.size === 0) {
                  this.patches.delete(object);
              }
          };
          if (id) {
              if (!this.unpatchers.has(id)) {
                  this.unpatchers.set(id, [unpatch]);
              }
              else {
                  this.unpatchers.get(id)?.push(unpatch);
              }
          }
          return unpatch;
      }
      after(id, object, property, callback) {
          let patch = { callback, point: 'after' };
          this.addPatch(object, property, patch);
          let remove = this.getRemovePatch(id, object, property, patch);
          return remove;
      }
      before(id, object, property, callback) {
          let patch = { callback, point: 'before' };
          this.addPatch(object, property, patch);
          let remove = this.getRemovePatch(id, object, property, patch);
          return remove;
      }
      instead(id, object, property, callback) {
          let patch = { callback, point: 'instead' };
          this.addPatch(object, property, patch);
          let remove = this.getRemovePatch(id, object, property, patch);
          return remove;
      }
      unpatchAll(id) {
          const unpatchers = this.unpatchers.get(id);
          if (!unpatchers)
              return;
          for (const unpatcher of unpatchers) {
              unpatcher();
          }
      }
  }

  // spec: https://codeberg.org/gimhook/gimhook/src/branch/master/docs/sdk/api.md
  // Several features were recently removed from gimhook which this polyfill actually adds back
  // This means that more gimhook mods are compatible with gimloader than gimhook lol
  function gimhookPolyfill(gimloader) {
      let gimhook = {
          game: {
              isGameActive: false,
              is2DGamemode: false,
              get colyseusInstance() {
                  return {
                      room: gimloader.net.colyseus.room
                  };
              }
          },
          ui: {},
          graphics: { player: {}, camera: {} },
          hooks: { require: [], message: [], join: [] },
          addHook(type, callback) {
              switch (type) {
                  case "require":
                      gimloader.parcel.onModuleRequired(null, callback);
                      break;
                  case "message":
                      // this could also work for blueboat but Gimhook doesn't do that
                      gimloader.net.colyseus.addEventListener("*", (packet) => {
                          // if the function returns true then other handlers should theoretically be skipped, but this is not implemented
                          callback(packet.detail.channel, packet.detail.message);
                      });
                      break;
                  case "join":
                      gimloader.addEventListener("loadEnd", () => {
                          callback();
                      });
                      break;
                  default:
                      return;
              }
              gimhook.hooks[type].push(callback);
          },
          getHooks(type) {
              return gimhook.hooks[type];
          }
      };
      // gimhook.graphics.player
      const getPlayer = () => {
          return gimloader.stores?.phaser?.mainCharacter;
      };
      gimhook.graphics.player.getPlayer = getPlayer;
      gimhook.graphics.player.getPosition = () => {
          return getPlayer()?.body ?? { x: 0, y: 0 };
      };
      gimhook.graphics.player.setPosition = (x, y) => {
          getPlayer()?.physics?.getBody?.()?.rigidBody.setTranslation({ x: x / 100, y: y / 100 });
      };
      // gimhook.graphics.camera
      const getCamera = () => {
          return gimloader.stores?.phaser?.scene?.cameras?.cameras?.[0];
      };
      gimhook.graphics.camera.getCamera = getCamera;
      gimhook.graphics.camera.getZoom = () => {
          return getCamera()?.zoom;
      };
      gimhook.graphics.camera.setZoom = (zoom) => {
          getCamera()?.setZoom(zoom);
      };
      // gimhook.game
      gimloader.addEventListener("loadEnd", () => {
          gimhook.game.isGameActive = true;
          if (gimloader.net.type === "Colyseus") {
              gimhook.game.is2DGamemode = true;
          }
      });
      // gimhook.ui
      gimhook.ui.toaster = (message) => {
          gimloader.notification.open({ message });
      };
      window.gimhook = gimhook;
      unsafeWindow.gimhook = gimhook;
  }

  class ContextMenu {
      dropdownModule;
      gimloader;
      constructor(gimloader) {
          this.gimloader = gimloader;
          gimloader.parcel.interceptRequire(null, exports => exports?.default?.toString?.().includes(`.includes("contextMenu")`), (exports) => {
              this.dropdownModule = exports.default;
          }, true);
      }
      showContextMenu(options, x, y) {
          let renderDiv = document.createElement("div");
          let divEl;
          window.addEventListener("click", onClick, { capture: true });
          function onClick(e) {
              // check we're not clicking on the dropdown itself
              if (e.target instanceof HTMLElement && e.target.closest(".ant-dropdown"))
                  return;
              dispose();
          }
          function dispose() {
              renderDiv.remove();
              divEl?.remove();
              window.removeEventListener("click", onClick);
          }
          // get the content menu when it is added to the dom
          let observer = new MutationObserver((mutations) => {
              all: for (let mutation of mutations) {
                  for (let node of mutation.addedNodes) {
                      if (node instanceof HTMLElement && node.querySelector(".ant-dropdown-menu")) {
                          divEl = node;
                          observer.disconnect();
                          // betcha forgot labels exist
                          break all;
                      }
                  }
              }
          });
          observer.observe(document.body, { childList: true });
          // create the react element
          let reactDiv = this.gimloader.React.createElement("div", {
              style: {
                  position: "absolute",
                  left: x + "px",
                  top: y + "px"
              }
          });
          let reactEl = this.gimloader.React.createElement(this.dropdownModule, { open: true, ...options, onOpenChange: dispose, destroyPopupOnHide: true }, reactDiv);
          this.gimloader.ReactDOM.createRoot(renderDiv).render(reactEl);
          document.body.appendChild(renderDiv);
          return dispose;
      }
      createReactContextMenu(options, element) {
          return this.gimloader.React.createElement(this.dropdownModule, options, element);
      }
  }

  async function downloadLibraries(needsLibs, confirmName) {
      let missing = [];
      for (let lib of needsLibs) {
          let parts = lib.split('|');
          let libName = parts[0].trim();
          let libUrl = parts[1]?.trim();
          if (!GL.lib.getLib(libName)) {
              missing.push({ libName, libUrl });
          }
      }
      if (missing.length === 0)
          return true;
      let downloadable = missing.filter(m => m.libUrl);
      // wait for user confirmation
      if (confirmName) {
          let single = missing.length === 1;
          let msgStart = `The plugin ${confirmName} is missing ${missing.length} ${single ? 'library' : 'libraries'}.`;
          if (downloadable.length === 0) {
              alert(`${msgStart} You will need to manually download and install ${single ? 'it' : 'them'}.`);
              return false;
          }
          let conf = false;
          if (downloadable.length === missing.length) {
              conf = confirm(`${msgStart} Would you like to download ${single ? 'it' : 'them'}?`);
          }
          else {
              conf = confirm(msgStart +
                  ` ${downloadable.length} ${single ? 'is' : 'are'} able to be automatically downloaded. Would you like to do so?` +
                  " The rest will need to be manually downloaded and installed.");
          }
          if (!conf)
              return false;
      }
      let results = await Promise.allSettled(downloadable.map(({ libName, libUrl }) => {
          return new Promise((res, rej) => {
              GL.net.corsRequest({ url: libUrl })
                  .then((resp) => res(resp.responseText))
                  .catch(() => rej(`Failed to download library ${libName} from ${libUrl}`));
          });
      }));
      let successes = results.filter(r => r.status === 'fulfilled');
      let libs = successes.map(s => GL.lib.createLib(s.value)).filter(l => l);
      await Promise.all(libs.map(l => l.enable()));
      GL.lib.save();
      GL.lib.updateReact();
      let failed = results.filter(r => r.status === 'rejected');
      if (failed.length > 0) {
          let msg = failed.map(f => f.reason).join('\n');
          showErrorMessage(msg, `Failed to download ${failed.length} libraries`);
          return false;
      }
      return missing.length === downloadable.length;
  }

  class Plugin {
      script;
      enabled;
      headers;
      return;
      runPlugin;
      constructor(script, enabled = true, initial = false, runPlugin = true) {
          this.script = script;
          this.enabled = enabled;
          this.runPlugin = runPlugin;
          this.headers = parsePluginHeader(script);
          // we are going to manually call enable on the first load
          if (enabled && !initial) {
              this.enable(initial)
                  .catch((e) => {
                  showErrorMessage(e.message, `Failed to enable plugin ${this.headers.name}`);
              });
          }
      }
      async enable(initial = false) {
          return new Promise(async (res, rej) => {
              let libObjs = [];
              for (let lib of this.headers.needsLib) {
                  let libName = lib.split('|')[0].trim();
                  let libObj = GL.lib.getLib(libName);
                  if (!libObj) {
                      this.enabled = false;
                      rej(new Error(`Plugin ${this.headers.name} requires library ${libName} which is not installed`));
                      return;
                  }
                  libObjs.push(libObj);
              }
              let results = await Promise.allSettled(libObjs.map(lib => lib.enable()));
              let failed = results.filter(r => r.status === 'rejected');
              if (failed.length > 0) {
                  let err = new Error(`Failed to enable plugin ${this.headers.name} due to errors while enabling libraries:\n${failed.map(f => f.reason).join('\n')}`);
                  this.enabled = false;
                  rej(err);
                  return;
              }
              GL.pluginManager.updatePlugins();
              if (!this.runPlugin)
                  return;
              // create a blob from the script and import it
              let blob = new Blob([this.script], { type: 'application/javascript' });
              let url = URL.createObjectURL(blob);
              import(url)
                  .then((returnVal) => {
                  this.return = returnVal;
                  this.enabled = true;
                  log(`Loaded plugin: ${this.headers.name}`);
                  if (!initial) {
                      if (this.headers.reloadRequired === 'true' ||
                          this.headers.reloadRequired === '' ||
                          (this.headers.reloadRequired === 'ingame' && GL.net.type !== "Unknown")) {
                          let reload = confirm(`${this.headers.name} requires a reload to function properly. Reload now?`);
                          if (reload) {
                              location.reload();
                          }
                      }
                  }
                  for (let lib of this.headers.needsLib) {
                      let libName = lib.split('|')[0].trim();
                      let libObj = GL.lib.getLib(libName);
                      libObj.addUsed(this.headers.name);
                  }
                  res();
              })
                  .catch((e) => {
                  this.enabled = false;
                  let err = new Error(`Failed to enable plugin ${this.headers.name}:\n${e}`);
                  rej(err);
              })
                  .finally(() => {
                  URL.revokeObjectURL(url);
              });
          });
      }
      disable() {
          this.enabled = false;
          GL.pluginManager.updatePlugins();
          if (!this.runPlugin)
              return;
          if (this.return) {
              try {
                  this.return?.onStop?.();
              }
              catch (e) {
                  log(`Error stopping plugin ${this.headers.name}:`, e);
              }
          }
          for (let lib of this.headers.needsLib) {
              let libName = lib.split('|')[0].trim();
              let libObj = GL.lib.getLib(libName);
              if (libObj)
                  libObj.removeUsed(this.headers.name);
          }
          this.return = null;
      }
      edit(script, headers) {
          let enabled = this.enabled;
          this.disable();
          this.script = script;
          this.headers = headers;
          if (enabled) {
              this.enable()
                  .then(() => GL.pluginManager.save())
                  .catch((e) => {
                  showErrorMessage(e.message, `Failed to enable plugin ${this.headers.name}`);
              });
          }
          else {
              GL.pluginManager.save();
          }
      }
  }

  class PluginManager {
      plugins = [];
      runPlugins;
      reactSetPlugins;
      updatePluginTimeout;
      constructor(runPlugins = true) {
          this.runPlugins = runPlugins;
      }
      updatePlugins() {
          if (this.updatePluginTimeout)
              clearTimeout(this.updatePluginTimeout);
          // update next tick
          this.updatePluginTimeout = setTimeout(() => {
              this.reactSetPlugins?.([...this.plugins]);
          });
      }
      async init() {
          let pluginScripts = JSON.parse(GM_getValue('plugins', '[]'));
          for (let plugin of pluginScripts) {
              let pluginObj = new Plugin(plugin.script, plugin.enabled, true, this.runPlugins);
              this.plugins.push(pluginObj);
          }
          let results = await Promise.allSettled(this.plugins.map(p => p.enabled && p.enable(true)));
          let fails = results.filter(r => r.status === 'rejected');
          if (fails.length > 0) {
              let msg = fails.map(f => f.reason).join('\n');
              showErrorMessage(msg, `Failed to enable ${fails.length} plugins`);
              this.save(this.plugins);
          }
          log('All plugins loaded');
          // when a plugin is remotely deleted, installed or enabled/disabled reflect that here
          GM_addValueChangeListener('plugins', (_, __, newVal, remote) => {
              if (!remote)
                  return;
              let newPluginInfos = JSON.parse(newVal);
              let newPlugins = newPluginInfos.map(p => new Plugin(p.script, p.enabled, true, this.runPlugins));
              // check for scripts that were added
              for (let newPlugin of newPlugins) {
                  if (!this.getPlugin(newPlugin.headers.name)) {
                      newPlugin.enable()
                          .catch((e) => {
                          showErrorMessage(e.message, `Failed to enable plugin ${newPlugin.headers.name}`);
                      });
                      this.plugins.push(newPlugin);
                  }
              }
              // check for plugins that were removed
              for (let plugin of this.plugins) {
                  if (!newPlugins.find(p => p.headers.name === plugin.headers.name)) {
                      this.deletePlugin(plugin);
                  }
              }
              // check if any scripts were updated
              for (let plugin of newPlugins) {
                  let oldPlugin = this.getPlugin(plugin.headers.name);
                  if (!oldPlugin)
                      continue;
                  if (oldPlugin.script !== plugin.script) {
                      oldPlugin.edit(plugin.script, plugin.headers);
                      log(`Updated plugin: ${plugin.headers.name}`);
                  }
              }
              // check if any plugins were enabled/disabled
              for (let plugin of newPlugins) {
                  let oldPlugin = this.getPlugin(plugin.headers.name);
                  if (!oldPlugin)
                      continue;
                  if (oldPlugin.enabled !== plugin.enabled) {
                      if (plugin.enabled) {
                          oldPlugin.enable()
                              .catch((e) => {
                              showErrorMessage(e.message, `Failed to enable plugin ${oldPlugin.headers.name}`);
                          });
                      }
                      else
                          oldPlugin.disable();
                  }
              }
              this.updatePlugins();
          });
      }
      save(newPlugins) {
          if (newPlugins)
              this.plugins = newPlugins;
          let pluginObjs = this.plugins.map(p => ({ script: p.script, enabled: p.enabled }));
          GM_setValue('plugins', JSON.stringify(pluginObjs));
      }
      getPlugin(name) {
          return this.plugins.find(p => p.headers.name === name) ?? null;
      }
      isEnabled(name) {
          let plugin = this.getPlugin(name);
          return plugin?.enabled ?? false;
      }
      async createPlugin(script) {
          let headers = parsePluginHeader(script);
          let existing = this.getPlugin(headers.name);
          if (existing) {
              let conf = confirm(`A plugin named ${headers.name} already exists! Do you want to overwrite it?`);
              if (!conf)
                  return;
              this.deletePlugin(existing);
          }
          let plugin = new Plugin(script, false, false, this.runPlugins);
          this.plugins.push(plugin);
          this.save();
          this.updatePlugins();
          let success = await downloadLibraries(plugin.headers.needsLib, plugin.headers.name);
          if (success)
              await plugin.enable();
          this.save();
          this.updatePlugins();
      }
      deletePlugin(plugin) {
          if (plugin.enabled)
              plugin.disable();
          let newPlugins = this.plugins.filter(p => p !== plugin);
          if (window.GL) {
              GL.storage.removeAllValues(plugin.headers.name);
          }
          this.save(newPlugins);
          this.updatePlugins();
          log(`Deleted plugin: ${plugin.headers.name}`);
      }
      enableAll() {
          Promise.allSettled(this.plugins.filter(p => !p.enabled).map(p => p.enable()))
              .then(results => {
              let fails = results.filter(r => r.status === 'rejected');
              if (fails.length > 0) {
                  let msg = fails.map(f => f.reason).join('\n');
                  showErrorMessage(msg, `Failed to enable ${results.length} plugins`);
              }
          });
          this.save();
          this.updatePlugins();
      }
      disableAll() {
          for (let plugin of this.plugins) {
              if (plugin.enabled)
                  plugin.disable();
          }
          this.save();
      }
  }

  class Storage {
      addNameAndKey(pluginName, key) {
          return `${pluginName}-${key}`;
      }
      removeValue(pluginName, key) {
          if (pluginName == "")
              throw new Error("pluginName cannot be empty");
          GM_deleteValue(this.addNameAndKey(pluginName, key));
      }
      getValue(pluginName, key, defaultValue) {
          if (pluginName == "")
              throw new Error("pluginName cannot be empty");
          return GM_getValue(this.addNameAndKey(pluginName, key), defaultValue);
      }
      setValue(pluginName, key, value) {
          if (pluginName == "")
              throw new Error("pluginName cannot be empty");
          GM_setValue(this.addNameAndKey(pluginName, key), value);
      }
      removeAllValues(pluginName) {
          if (pluginName == "")
              throw new Error("pluginName cannot be empty");
          let values = GM_listValues().filter(v => v.startsWith(`${pluginName}-`));
          for (let value of values) {
              GM_deleteValue(value);
          }
      }
  }

  class Lib {
      script;
      library;
      headers = {};
      enabling = false;
      enableError;
      enableSuccessCallbacks = [];
      enableFailCallbacks = [];
      usedBy = new Set();
      constructor(script, headers) {
          this.script = script;
          if (headers) {
              this.headers = headers;
          }
          else {
              this.headers = parseLibHeader(script);
          }
      }
      async enable() {
          if (this.enableError)
              return Promise.reject(this.enableError);
          if (this.library)
              return Promise.resolve();
          if (!this.enabling) {
              this.enabling = true;
              let blob = new Blob([this.script], { type: 'application/javascript' });
              let url = URL.createObjectURL(blob);
              import(url)
                  .then((returnVal) => {
                  if (returnVal.default) {
                      returnVal = returnVal.default;
                  }
                  this.library = returnVal;
                  this.enableSuccessCallbacks.forEach(cb => cb());
              })
                  .catch((e) => {
                  let error = new Error(`Failed to enable library ${this.headers.name}:\n${e}`);
                  this.enableError = error;
                  this.enableFailCallbacks.forEach(cb => cb(error));
              })
                  .finally(() => {
                  URL.revokeObjectURL(url);
              });
          }
          return new Promise((res, rej) => {
              this.enableSuccessCallbacks.push(res);
              this.enableFailCallbacks.push(rej);
          });
      }
      addUsed(pluginName) {
          this.usedBy.add(pluginName);
      }
      removeUsed(pluginName) {
          this.usedBy.delete(pluginName);
          if (this.usedBy.size === 0) {
              this.disable();
          }
      }
      disable() {
          // call onStop if it exists
          try {
              this.library?.onStop?.();
          }
          catch (e) {
              log(`Error stopping library ${this.headers.name}:`, e);
          }
          // reset the library
          this.library = null;
          this.enableError = undefined;
          this.enabling = false;
          this.enableSuccessCallbacks = [];
          this.enableFailCallbacks = [];
      }
  }

  // The only reason this is done this way is because I really want to have lib() and lib.get() to be the same function
  // If there is a better way to do this please let me know
  const libManagerMethods = {
      getLib(libName) {
          return this.libs[libName];
      },
      updateReact() {
          if (this.updateLibTimeout)
              clearTimeout(this.updateLibTimeout);
          this.updateLibTimeout = setTimeout(() => {
              this.reactSetLibs?.({ ...this.libs });
          });
      },
      save(libs) {
          if (libs)
              this.libs = libs;
          let libObjs = {};
          for (let name in this.libs) {
              libObjs[name] = this.libs[name].script;
          }
          GM_setValue('libs', libObjs);
      },
      createLib(script, headers, ignoreDuplicates) {
          headers = headers ?? parseLibHeader(script);
          if (headers.isLibrary === "false") {
              alert("That script doesn't appear to be a library! If it should be, please set the isLibrary header, and if not, please import it as a plugin.");
              return;
          }
          let existing = this.getLib(headers.name);
          if (existing && !ignoreDuplicates) {
              let conf = confirm(`A library named ${headers.name} already exists! Do you want to overwrite it?`);
              if (!conf)
                  return;
          }
          let lib = new Lib(script, headers);
          this.libs[lib.headers.name] = lib;
          this.save();
          this.updateReact();
          return lib;
      },
      deleteLib(lib) {
          lib.disable();
          delete this.libs[lib.headers.name];
          this.save();
          this.updateReact();
      },
      editLib(lib, code, headers) {
          headers = headers ?? parseLibHeader(code);
          if (lib.headers.name === headers.name) {
              this.createLib(code, headers, true);
          }
          else {
              let wentThrough = this.createLib(code, headers);
              if (wentThrough) {
                  this.deleteLib(lib);
              }
          }
      }
  };
  function makeLibManager() {
      let libScripts = GM_getValue('libs', {});
      let libs = {};
      for (let name in libScripts) {
          let script = libScripts[name];
          let lib = new Lib(script);
          libs[name] = lib;
      }
      const get = function (libName) {
          let lib = libs[libName];
          return lib?.library ?? null;
      };
      const lib = get;
      Object.assign(lib, {
          get,
          libs
      }, libManagerMethods);
      GM_addValueChangeListener('libs', (_, __, value, remote) => {
          if (!remote)
              return;
          let newLibs = {};
          for (let name in value) {
              let script = value[name];
              let lib = new Lib(script);
              newLibs[name] = lib;
          }
          // check if any plugins were removed
          for (let name in libs) {
              if (!newLibs[name]) {
                  lib.deleteLib(libs[name]);
              }
          }
          // check if any scripts were added
          for (let name in newLibs) {
              if (!libs[name]) {
                  lib.createLib(newLibs[name].script, newLibs[name].headers, true);
              }
          }
          // check if any scripts were updated
          for (let name in newLibs) {
              if (libs[name].script !== newLibs[name].script) {
                  lib.editLib(libs[name], newLibs[name].script, newLibs[name].headers);
              }
          }
          lib.updateReact();
      });
      return lib;
  }

  class Gimloader extends EventTarget {
      version = version;
      React;
      ReactDOM;
      notification;
      modules = {};
      stores;
      platformerPhysics;
      lib = makeLibManager();
      pluginManager = new PluginManager(onGimkit);
      patcher = new Patcher();
      parcel = new Parcel(this);
      net = new Net(this);
      hotkeys = new HotkeyManager();
      contextMenu = new ContextMenu(this);
      storage = new Storage();
      UI = {
          showModal,
          addStyles,
          removeStyles
      };
      constructor() {
          super();
          log('GimkitLoader v' + this.version + ' loaded');
          this.addStyleSheets();
          this.getReact();
          this.exposeValues();
          addPluginButtons(this);
          // create a polyfill for gimhook
          gimhookPolyfill(this);
      }
      addStyleSheets() {
          this.UI.addStyles(null, styles$1);
          this.UI.addStyles(null, codeCakeStyles);
      }
      exposeValues() {
          // window.stores
          this.parcel.interceptRequire(null, exports => exports?.default?.characters, exports => {
              this.stores = exports.default;
              window.stores = exports.default;
              unsafeWindow.stores = exports.default;
          });
          // window.platformerPhysics
          this.parcel.interceptRequire(null, exports => exports?.CharacterPhysicsConsts, exports => {
              this.platformerPhysics = exports.CharacterPhysicsConsts;
              window.platformerPhysics = exports.CharacterPhysicsConsts;
              unsafeWindow.platformerPhysics = exports.CharacterPhysicsConsts;
          });
      }
      getReact() {
          this.parcel.interceptRequire(null, exports => exports?.useState, exports => {
              if (this.React)
                  return;
              this.React = exports;
              if (this.ReactDOM) {
                  this.dispatchEvent(new CustomEvent('reactLoaded'));
              }
          });
          this.parcel.interceptRequire(null, exports => exports?.createRoot, exports => {
              if (this.ReactDOM)
                  return;
              this.ReactDOM = exports;
              if (this.React) {
                  this.dispatchEvent(new CustomEvent('reactLoaded'));
              }
          });
          this.parcel.interceptRequire(null, exports => exports?.default?.useNotification, exports => {
              this.notification = exports.default;
          });
      }
      awaitColyseusLoad() {
          let loading = GL.stores.loading;
          let me = GL.stores.me;
          // error message
          if (me.nonDismissMessage.title && me.nonDismissMessage.description)
              return;
          if (loading.completedInitialLoad &&
              loading.loadedInitialTerrain &&
              loading.loadedInitialDevices &&
              me.completedInitialPlacement) {
              this.dispatchEvent(new CustomEvent('loadEnd'));
          }
          else {
              setTimeout(() => this.awaitColyseusLoad(), 50);
          }
      }
  }

  function initInstallApi(loader) {
      unsafeWindow.GLInstall = async function (script) {
          let headers = parsePluginHeader(script);
          let existingPlugin = loader.pluginManager.getPlugin(headers.name);
          if (existingPlugin) {
              existingPlugin.edit(script, headers);
          }
          else {
              loader.pluginManager.createPlugin(script);
          }
      };
      unsafeWindow.GLGet = function (name) {
          return loader.pluginManager.getPlugin(name)?.script;
      };
  }

  let loader = new Gimloader();
  window.GL = loader;
  unsafeWindow.GL = loader;
  if (location.host === "thelazysquid.github.io" && location.pathname === "/gimloader/") {
      initInstallApi(loader);
  }

})();
