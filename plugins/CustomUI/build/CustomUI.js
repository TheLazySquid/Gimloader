/**
 * @name CustomUI
 * @description Allows you to customize various things about the Gimkit UI
 * @author TheLazySquid
 * @version 0.3.0
 * @hasSettings true
 */


// node_modules/gimloader/index.js
var api = new GL();
var gimloader_default = api;

// src/styles.scss
var styles_default = `.cui-settings {
  overflow-x: hidden;
  padding: 5px;
}
.cui-settings .row {
  display: flex;
  gap: 5px;
  align-items: center;
  margin-bottom: 5px;
}
.cui-settings .row input[type=range] {
  flex-grow: 1;
}
.cui-settings input {
  width: 25px;
  height: 25px;
  appearance: auto;
}

.themePicker .previews {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.themePicker .addCustomTheme {
  padding: 3px;
  border: 1px solid black;
  width: 100%;
  text-align: center;
}

.customTheme {
  display: flex;
  gap: 5px;
  align-items: center;
}
.customTheme .delete {
  cursor: pointer;
  font-size: 30px;
  flex-shrink: 0;
}
.customTheme .customThemePreview {
  flex-grow: 1;
}

.themePreview {
  text-align: center;
  cursor: pointer;
}
.themePreview > div {
  display: flex;
  align-items: center;
  justify-content: center;
}
.themePreview > div > div {
  flex-grow: 1;
  height: 30px;
}

.themeCreator {
  display: flex;
  height: 100%;
}
.themeCreator .pickers {
  width: 300px;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}
.themeCreator .pickers .themeNameWrap {
  width: 100%;
  padding-right: 3px;
}
.themeCreator .pickers .themeName {
  width: 100%;
}
.themeCreator .pickers > div {
  display: flex;
  padding-right: 3px;
}
.themeCreator .pickers > div > div {
  flex-grow: 1;
}

.fullPreview {
  display: flex;
  flex-direction: column;
  height: 100%;
  flex-grow: 1;
}
.fullPreview .question {
  width: 100%;
  height: 30%;
  font-family: "Product Sans", sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 50px;
}
.fullPreview .answers {
  flex-grow: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
}
.fullPreview .answers > div {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Product Sans", sans-serif;
  font-size: 25px;
  border: 6px solid rgba(0, 0, 0, 0.3);
}

.light-shadow.flex.between.vc {
  transition: margin-top 0.25s ease-in-out;
}

.slideOutTop .light-shadow.flex.between.vc {
  margin-top: -79px;
}

.useCustomTheme .flex.maxWidth.between.vc + div:not(.ant-space-vertical) > div > div:nth-child(1), .useCustomTheme [style^="width: 100%"] > [style^=opacity] > div:nth-child(1) {
  background: var(--question-bg) !important;
  color: var(--question-text) !important;
}
.useCustomTheme .flex.maxWidth.between.vc + div:not(.ant-space-vertical) > div > div:nth-child(2) > div:nth-child(1) > div, .useCustomTheme [style^="width: 100%"] > [style^=opacity] > div:nth-child(2) > div:nth-child(1) > div {
  background: var(--answer-bg-1) !important;
}
.useCustomTheme .flex.maxWidth.between.vc + div:not(.ant-space-vertical) > div > div:nth-child(2) > div:nth-child(1) > div > div, .useCustomTheme [style^="width: 100%"] > [style^=opacity] > div:nth-child(2) > div:nth-child(1) > div > div {
  color: var(--answer-text-1) !important;
}
.useCustomTheme .flex.maxWidth.between.vc + div:not(.ant-space-vertical) > div > div:nth-child(2) > div:nth-child(2) > div, .useCustomTheme [style^="width: 100%"] > [style^=opacity] > div:nth-child(2) > div:nth-child(2) > div {
  background: var(--answer-bg-2) !important;
}
.useCustomTheme .flex.maxWidth.between.vc + div:not(.ant-space-vertical) > div > div:nth-child(2) > div:nth-child(2) > div > div, .useCustomTheme [style^="width: 100%"] > [style^=opacity] > div:nth-child(2) > div:nth-child(2) > div > div {
  color: var(--answer-text-2) !important;
}
.useCustomTheme .flex.maxWidth.between.vc + div:not(.ant-space-vertical) > div > div:nth-child(2) > div:nth-child(3) > div, .useCustomTheme [style^="width: 100%"] > [style^=opacity] > div:nth-child(2) > div:nth-child(3) > div {
  background: var(--answer-bg-3) !important;
}
.useCustomTheme .flex.maxWidth.between.vc + div:not(.ant-space-vertical) > div > div:nth-child(2) > div:nth-child(3) > div > div, .useCustomTheme [style^="width: 100%"] > [style^=opacity] > div:nth-child(2) > div:nth-child(3) > div > div {
  color: var(--answer-text-3) !important;
}
.useCustomTheme .flex.maxWidth.between.vc + div:not(.ant-space-vertical) > div > div:nth-child(2) > div:nth-child(4) > div, .useCustomTheme [style^="width: 100%"] > [style^=opacity] > div:nth-child(2) > div:nth-child(4) > div {
  background: var(--answer-bg-4) !important;
}
.useCustomTheme .flex.maxWidth.between.vc + div:not(.ant-space-vertical) > div > div:nth-child(2) > div:nth-child(4) > div > div, .useCustomTheme [style^="width: 100%"] > [style^=opacity] > div:nth-child(2) > div:nth-child(4) > div > div {
  color: var(--answer-text-4) !important;
}

.flex-column.maxAll > .maxWidth > span:nth-child(1) > div {
  background-color: var(--answer-bg-1) !important;
  color: var(--answer-text-1) !important;
}
.flex-column.maxAll > .maxWidth > span:nth-child(2) > div {
  background-color: var(--answer-bg-2) !important;
  color: var(--answer-text-2) !important;
}

.maxAll[style^=pointer-events]:has(.flex.maxWidth.between.vc + div:not(.ant-space-vertical) > div > div) {
  opacity: var(--question-opacity);
}`;

// src/ui/themePreview.tsx
function ThemePreview(props) {
  const React = gimloader_default.React;
  let { theme } = props;
  return /* @__PURE__ */ gimloader_default.React.createElement("div", { style: {
    backgroundColor: theme.question.background,
    color: theme.question.text
  }, className: "themePreview", onClick: props.onClick }, props.text ? props.text : theme.name, /* @__PURE__ */ gimloader_default.React.createElement("div", null, /* @__PURE__ */ gimloader_default.React.createElement("div", { style: {
    backgroundColor: theme.palette[0].background,
    color: theme.palette[0].text
  } }), /* @__PURE__ */ gimloader_default.React.createElement("div", { style: {
    backgroundColor: theme.palette[1].background,
    color: theme.palette[1].text
  } }), /* @__PURE__ */ gimloader_default.React.createElement("div", { style: {
    backgroundColor: theme.palette[2].background,
    color: theme.palette[2].text
  } }), /* @__PURE__ */ gimloader_default.React.createElement("div", { style: {
    backgroundColor: theme.palette[3].background,
    color: theme.palette[3].text
  } })));
}

// src/defaultThemes.json
var defaultThemes_default = [
  {
    name: "Default",
    question: {
      background: "#303f9f",
      text: "#ffffff"
    },
    palette: [
      {
        background: "#771322",
        text: "#ffffff"
      },
      {
        background: "#a85c15",
        text: "#ffffff"
      },
      {
        background: "#0d6b33",
        text: "#ffffff"
      },
      {
        background: "#076296",
        text: "#ffffff"
      }
    ]
  },
  {
    name: "Haloween",
    question: {
      background: "#6c2f00",
      text: "#ffffff"
    },
    palette: [
      {
        background: "#9e682a",
        text: "#ffffff"
      },
      {
        background: "#b54730",
        text: "#ffffff"
      },
      {
        background: "#8a9748",
        text: "#ffffff"
      },
      {
        background: "#f1b930",
        text: "#ffffff"
      }
    ]
  },
  {
    name: "Night",
    question: {
      background: "#000a12",
      text: "#ffffff"
    },
    palette: [
      {
        background: "#263238",
        text: "#ffffff"
      },
      {
        background: "#37474f",
        text: "#ffffff"
      },
      {
        background: "#455a64",
        text: "#ffffff"
      },
      {
        background: "#546e7a",
        text: "#ffffff"
      }
    ]
  },
  {
    name: "Thanos",
    question: {
      background: "#0d0019",
      text: "#ffffff"
    },
    palette: [
      {
        background: "#220044",
        text: "#ffffff"
      },
      {
        background: "#330066",
        text: "#ffffff"
      },
      {
        background: "#3e007c",
        text: "#ffffff"
      },
      {
        background: "#4f1787",
        text: "#ffffff"
      }
    ]
  },
  {
    name: "Ocean",
    question: {
      background: "#000063",
      text: "#ffffff"
    },
    palette: [
      {
        background: "#283593",
        text: "#ffffff"
      },
      {
        background: "#076296",
        text: "#ffffff"
      },
      {
        background: "#0277bd",
        text: "#ffffff"
      },
      {
        background: "#1565c0",
        text: "#ffffff"
      }
    ]
  },
  {
    name: "Forest",
    question: {
      background: "#4c3d33",
      text: "#ffffff"
    },
    palette: [
      {
        background: "#385645",
        text: "#ffffff"
      },
      {
        background: "#425c49",
        text: "#ffffff"
      },
      {
        background: "#415641",
        text: "#ffffff"
      },
      {
        background: "#4c6349",
        text: "#ffffff"
      }
    ]
  },
  {
    name: "Sunset",
    question: {
      background: "#7f7496",
      text: "#ffffff"
    },
    palette: [
      {
        background: "#f46f5a",
        text: "#ffffff"
      },
      {
        background: "#ed712d",
        text: "#ffffff"
      },
      {
        background: "#7a596a",
        text: "#ffffff"
      },
      {
        background: "#e8ab3c",
        text: "#ffffff"
      }
    ]
  },
  {
    name: "Pastel",
    question: {
      background: "#ffbfd1",
      text: "#434343"
    },
    palette: [
      {
        background: "#ffa69e",
        text: "#5b5b5b"
      },
      {
        background: "#fcf6bf",
        text: "#5b5b5b"
      },
      {
        background: "#d0f4de",
        text: "#5b5b5b"
      },
      {
        background: "#93e1d8",
        text: "#5b5b5b"
      }
    ]
  },
  {
    name: "Retro",
    question: {
      background: "#9c0022",
      text: "#ffffff"
    },
    palette: [
      {
        background: "#001d3b",
        text: "#ffffff"
      },
      {
        background: "#ffae52",
        text: "#ffffff"
      },
      {
        background: "#fe5963",
        text: "#ffffff"
      },
      {
        background: "#a71c94",
        text: "#ffffff"
      }
    ]
  },
  {
    name: "Pure Gold",
    question: {
      background: "#000000",
      text: "#ffcd2b"
    },
    palette: [
      {
        background: "#ffcd2b",
        text: "#000000"
      },
      {
        background: "#ffc721",
        text: "#000000"
      },
      {
        background: "#ffd147",
        text: "#000000"
      },
      {
        background: "#ffcd38",
        text: "#000000"
      }
    ]
  }
];

// src/util.ts
function getBorderColor(theme) {
  let rgb = parseHex(theme.question.background);
  let brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1e3;
  return brightness > 128 ? "#000000" : "#ff5c61";
}
function parseHex(hex) {
  return {
    r: parseInt(hex.substring(1, 3), 16),
    g: parseInt(hex.substring(3, 5), 16),
    b: parseInt(hex.substring(5, 7), 16)
  };
}

// src/ui/themeCreator.tsx
function ThemeCreator({ onChange }) {
  const React = gimloader_default.React;
  let [theme, setTheme] = React.useState({
    name: "New theme",
    question: {
      background: "#303f9f",
      text: "#ffffff"
    },
    palette: [
      {
        background: "#771322",
        text: "#ffffff"
      },
      {
        background: "#a85c15",
        text: "#ffffff"
      },
      {
        background: "#0d6b33",
        text: "#ffffff"
      },
      {
        background: "#076296",
        text: "#ffffff"
      }
    ]
  });
  React.useEffect(() => {
    onChange(theme);
  }, [theme]);
  return /* @__PURE__ */ gimloader_default.React.createElement("div", { className: "themeCreator" }, /* @__PURE__ */ gimloader_default.React.createElement("div", { className: "pickers" }, /* @__PURE__ */ gimloader_default.React.createElement("div", null, "Theme Name"), /* @__PURE__ */ gimloader_default.React.createElement("div", { className: "themeNameWrap" }, /* @__PURE__ */ gimloader_default.React.createElement(
    "input",
    {
      type: "text",
      value: theme.name,
      className: "themeName",
      onChange: (e) => {
        theme.name = e.target.value;
        setTheme({ ...theme });
      }
    }
  )), /* @__PURE__ */ gimloader_default.React.createElement("div", null, /* @__PURE__ */ gimloader_default.React.createElement("div", null, "Question Background"), /* @__PURE__ */ gimloader_default.React.createElement("input", { type: "color", value: theme.question.background, onChange: (e) => {
    theme.question.background = e.target.value;
    setTheme({ ...theme });
  } })), /* @__PURE__ */ gimloader_default.React.createElement("div", null, /* @__PURE__ */ gimloader_default.React.createElement("div", null, "Question Text"), /* @__PURE__ */ gimloader_default.React.createElement("input", { type: "color", value: theme.question.text, onChange: (e) => {
    theme.question.text = e.target.value;
    setTheme({ ...theme });
  } })), /* @__PURE__ */ gimloader_default.React.createElement("div", null, /* @__PURE__ */ gimloader_default.React.createElement("div", null, "Option 1 Background"), /* @__PURE__ */ gimloader_default.React.createElement("input", { type: "color", value: theme.palette[0].background, onChange: (e) => {
    theme.palette[0].background = e.target.value;
    setTheme({ ...theme });
  } })), /* @__PURE__ */ gimloader_default.React.createElement("div", null, /* @__PURE__ */ gimloader_default.React.createElement("div", null, "Option 1 Text"), /* @__PURE__ */ gimloader_default.React.createElement("input", { type: "color", value: theme.palette[0].text, onChange: (e) => {
    theme.palette[0].text = e.target.value;
    setTheme({ ...theme });
  } })), /* @__PURE__ */ gimloader_default.React.createElement("div", null, /* @__PURE__ */ gimloader_default.React.createElement("div", null, "Option 2 Background"), /* @__PURE__ */ gimloader_default.React.createElement("input", { type: "color", value: theme.palette[1].background, onChange: (e) => {
    theme.palette[1].background = e.target.value;
    setTheme({ ...theme });
  } })), /* @__PURE__ */ gimloader_default.React.createElement("div", null, /* @__PURE__ */ gimloader_default.React.createElement("div", null, "Option 2 Text"), /* @__PURE__ */ gimloader_default.React.createElement("input", { type: "color", value: theme.palette[1].text, onChange: (e) => {
    theme.palette[1].text = e.target.value;
    setTheme({ ...theme });
  } })), /* @__PURE__ */ gimloader_default.React.createElement("div", null, /* @__PURE__ */ gimloader_default.React.createElement("div", null, "Option 3 Background"), /* @__PURE__ */ gimloader_default.React.createElement("input", { type: "color", value: theme.palette[2].background, onChange: (e) => {
    theme.palette[2].background = e.target.value;
    setTheme({ ...theme });
  } })), /* @__PURE__ */ gimloader_default.React.createElement("div", null, /* @__PURE__ */ gimloader_default.React.createElement("div", null, "Option 3 Text"), /* @__PURE__ */ gimloader_default.React.createElement("input", { type: "color", value: theme.palette[2].text, onChange: (e) => {
    theme.palette[2].text = e.target.value;
    setTheme({ ...theme });
  } })), /* @__PURE__ */ gimloader_default.React.createElement("div", null, /* @__PURE__ */ gimloader_default.React.createElement("div", null, "Option 4 Background"), /* @__PURE__ */ gimloader_default.React.createElement("input", { type: "color", value: theme.palette[3].background, onChange: (e) => {
    theme.palette[3].background = e.target.value;
    setTheme({ ...theme });
  } })), /* @__PURE__ */ gimloader_default.React.createElement("div", null, /* @__PURE__ */ gimloader_default.React.createElement("div", null, "Option 4 Text"), /* @__PURE__ */ gimloader_default.React.createElement("input", { type: "color", value: theme.palette[3].text, onChange: (e) => {
    theme.palette[3].text = e.target.value;
    setTheme({ ...theme });
  } }))), /* @__PURE__ */ gimloader_default.React.createElement("div", { className: "fullPreview" }, /* @__PURE__ */ gimloader_default.React.createElement("div", { className: "question", style: {
    background: theme.question.background,
    color: theme.question.text
  } }, "Question text"), /* @__PURE__ */ gimloader_default.React.createElement("div", { className: "answers" }, /* @__PURE__ */ gimloader_default.React.createElement("div", { style: {
    background: theme.palette[0].background,
    color: theme.palette[0].text
  } }, "Option 1"), /* @__PURE__ */ gimloader_default.React.createElement("div", { style: {
    background: theme.palette[1].background,
    color: theme.palette[1].text
  } }, "Option 2"), /* @__PURE__ */ gimloader_default.React.createElement("div", { style: {
    background: theme.palette[2].background,
    color: theme.palette[2].text
  } }, "Option 3"), /* @__PURE__ */ gimloader_default.React.createElement("div", { style: {
    background: theme.palette[3].background,
    color: theme.palette[3].text
  } }, "Option 4"))));
}

// src/ui/themePicker.tsx
function ThemePicker(props) {
  const React = gimloader_default.React;
  let [themeType, setThemeType] = React.useState(props.themeType);
  let [themeIndex, setThemeIndex] = React.useState(props.themeIndex);
  let [customThemes, setCustomThemes] = React.useState(props.customThemes);
  let [activeTheme, setActiveTheme] = React.useState(props.activeTheme);
  React.useEffect(() => {
    props.setThemeType(themeType);
  }, [themeType]);
  React.useEffect(() => {
    props.setThemeIndex(themeIndex);
  }, [themeIndex]);
  React.useEffect(() => {
    props.setCustomThemes(customThemes);
  }, [customThemes]);
  React.useEffect(() => {
    if (themeType === "default") setActiveTheme(defaultThemes_default[themeIndex]);
    else setActiveTheme(customThemes[themeIndex]);
  }, [themeType, themeIndex]);
  const openThemeCreator = () => {
    let creatingTheme;
    gimloader_default.UI.showModal(/* @__PURE__ */ gimloader_default.React.createElement(ThemeCreator, { onChange: (theme) => creatingTheme = theme }), {
      id: "ThemeCreator",
      title: "Create New Theme",
      closeOnBackgroundClick: false,
      style: "width: 90%; height: 90%",
      buttons: [{
        text: "Close",
        style: "close"
      }, {
        text: "Save",
        style: "primary",
        onClick: () => {
          setThemeIndex(customThemes.length);
          setThemeType("custom");
          setCustomThemes([...customThemes, creatingTheme]);
        }
      }]
    });
  };
  const deleteTheme = (index) => {
    let theme = customThemes[index];
    let confirm = window.confirm(`Are you sure you want to delete the theme "${theme.name}"?`);
    if (!confirm) return;
    if (theme === activeTheme) setThemeIndex(0);
    if (customThemes.length === 1) setThemeType("default");
    let newThemes = [...customThemes];
    newThemes.splice(index, 1);
    setCustomThemes(newThemes);
  };
  return /* @__PURE__ */ gimloader_default.React.createElement("div", { className: "themePicker" }, /* @__PURE__ */ gimloader_default.React.createElement("h1", null, "Custom Themes"), /* @__PURE__ */ gimloader_default.React.createElement("div", { className: "previews" }, customThemes.map((theme, i) => /* @__PURE__ */ gimloader_default.React.createElement("div", { className: "customTheme" }, /* @__PURE__ */ gimloader_default.React.createElement("div", { className: "delete", onClick: () => deleteTheme(i) }, "\u{1F5D1}"), /* @__PURE__ */ gimloader_default.React.createElement("div", { className: "customThemePreview", style: {
    border: theme === activeTheme ? `4px solid ${getBorderColor(theme)}` : "none"
  } }, /* @__PURE__ */ gimloader_default.React.createElement(ThemePreview, { theme, onClick: () => {
    setThemeIndex(i);
    setThemeType("custom");
  } })))), /* @__PURE__ */ gimloader_default.React.createElement("button", { className: "addCustomTheme", onClick: openThemeCreator }, "Create New Theme")), /* @__PURE__ */ gimloader_default.React.createElement("h1", null, "Default Themes"), /* @__PURE__ */ gimloader_default.React.createElement("div", { className: "previews" }, defaultThemes_default.map((theme, i) => /* @__PURE__ */ gimloader_default.React.createElement("div", { style: {
    border: theme === activeTheme ? `4px solid ${getBorderColor(theme)}` : "none"
  } }, /* @__PURE__ */ gimloader_default.React.createElement(ThemePreview, { theme, onClick: () => {
    setThemeIndex(i);
    setThemeType("default");
  } })))));
}

// src/ui/ui.tsx
function UI({ uiChanger: uiChanger2, onConfirm }) {
  const React = gimloader_default.React;
  let [hideTopBar, setHideTopBar] = React.useState(uiChanger2.hideTopBar);
  let [useCustomTheme, setUseCustomTheme] = React.useState(uiChanger2.useCustomTheme);
  let [customThemes, setCustomThemes] = React.useState(uiChanger2.customThemes);
  let [themeType, setThemeType] = React.useState(uiChanger2.themeType);
  let [themeIndex, setThemeIndex] = React.useState(uiChanger2.themeIndex);
  let [questionOpacity, setQuestionOpacity] = React.useState(uiChanger2.questionOpacity);
  let [activeTheme, setActiveTheme] = React.useState(() => {
    if (themeType === "default") return defaultThemes_default[themeIndex];
    else return customThemes[themeIndex];
  });
  React.useEffect(() => {
    if (themeType === "default") setActiveTheme(defaultThemes_default[themeIndex]);
    else setActiveTheme(customThemes[themeIndex]);
  }, [themeType, themeIndex]);
  onConfirm(() => {
    uiChanger2.updateSettings(
      hideTopBar,
      useCustomTheme,
      customThemes,
      themeType,
      themeIndex,
      questionOpacity
    );
  });
  const openThemePicker = () => {
    gimloader_default.UI.showModal(/* @__PURE__ */ gimloader_default.React.createElement(
      ThemePicker,
      {
        themeType,
        setThemeType,
        themeIndex,
        setThemeIndex,
        customThemes,
        setCustomThemes,
        activeTheme
      }
    ), {
      id: "ThemePicker",
      title: "Theme Picker",
      closeOnBackgroundClick: true,
      buttons: [{
        text: "Close",
        style: "close"
      }],
      style: "width: max(50%, 400px)"
    });
  };
  return /* @__PURE__ */ gimloader_default.React.createElement("div", { className: "cui-settings" }, /* @__PURE__ */ gimloader_default.React.createElement("div", { className: "row" }, /* @__PURE__ */ gimloader_default.React.createElement("div", null, "Auto Hide Top Bar"), /* @__PURE__ */ gimloader_default.React.createElement("input", { type: "checkbox", checked: hideTopBar, onChange: (e) => {
    setHideTopBar(e.target.checked);
  } })), /* @__PURE__ */ gimloader_default.React.createElement("div", { className: "row" }, /* @__PURE__ */ gimloader_default.React.createElement("div", null, "Question Panel Opacity"), /* @__PURE__ */ gimloader_default.React.createElement("input", { type: "range", min: "0", max: "1", step: "0.01", value: questionOpacity, onChange: (e) => {
    setQuestionOpacity(parseFloat(e.target.value));
  } })), /* @__PURE__ */ gimloader_default.React.createElement("div", { className: "row" }, /* @__PURE__ */ gimloader_default.React.createElement("div", null, "Use Custom Theme"), /* @__PURE__ */ gimloader_default.React.createElement("input", { type: "checkbox", checked: useCustomTheme, onChange: (e) => {
    setUseCustomTheme(e.target.checked);
  } })), /* @__PURE__ */ gimloader_default.React.createElement(
    ThemePreview,
    {
      theme: activeTheme,
      onClick: openThemePicker,
      text: `Current theme: ${activeTheme.name} \u270E`
    }
  ));
}

// src/uiChanger.ts
var UIChanger = class {
  hideTopBar = gimloader_default.storage.getValue("hideTopBar", false);
  useCustomTheme = gimloader_default.storage.getValue("useCustomTheme", false);
  customThemes = gimloader_default.storage.getValue("themes", []);
  themeType = gimloader_default.storage.getValue("themeType", "default");
  themeIndex = gimloader_default.storage.getValue("themeIndex", 0);
  questionOpacity = gimloader_default.storage.getValue("questionOpacity", 1);
  constructor() {
    window.addEventListener("mousemove", this.boundOnMouseMove);
    this.onSettingsUpdate();
    gimloader_default.onStop(() => this.stop());
  }
  boundOnMouseMove = this.onMouseMove.bind(this);
  onMouseMove(e) {
    if (!this.hideTopBar) return;
    let nearTop = e.clientY < 100;
    document.documentElement.classList.toggle("slideOutTop", !nearTop);
  }
  updateSettings(hideTopBar, useCustomTheme, customThemes, themeType, themeIndex, questionOpacity) {
    this.hideTopBar = hideTopBar;
    this.useCustomTheme = useCustomTheme;
    this.customThemes = customThemes;
    this.themeType = themeType;
    this.themeIndex = themeIndex;
    this.questionOpacity = questionOpacity;
    gimloader_default.storage.setValue("hideTopBar", hideTopBar);
    gimloader_default.storage.setValue("useCustomTheme", useCustomTheme);
    gimloader_default.storage.setValue("themes", customThemes);
    gimloader_default.storage.setValue("themeType", themeType);
    gimloader_default.storage.setValue("themeIndex", themeIndex);
    gimloader_default.storage.setValue("questionOpacity", questionOpacity);
    this.onSettingsUpdate();
  }
  onSettingsUpdate() {
    if (!this.hideTopBar) {
      document.documentElement.classList.remove("slideOutTop");
    }
    document.documentElement.classList.toggle("useCustomTheme", this.useCustomTheme);
    let theme = this.getActiveTheme();
    document.documentElement.style.setProperty("--question-bg", theme.question.background);
    document.documentElement.style.setProperty("--question-text", theme.question.text);
    document.documentElement.style.setProperty("--answer-bg-1", theme.palette[0].background);
    document.documentElement.style.setProperty("--answer-text-1", theme.palette[0].text);
    document.documentElement.style.setProperty("--answer-bg-2", theme.palette[1].background);
    document.documentElement.style.setProperty("--answer-text-2", theme.palette[1].text);
    document.documentElement.style.setProperty("--answer-bg-3", theme.palette[2].background);
    document.documentElement.style.setProperty("--answer-text-3", theme.palette[2].text);
    document.documentElement.style.setProperty("--answer-bg-4", theme.palette[3].background);
    document.documentElement.style.setProperty("--answer-text-4", theme.palette[3].text);
    document.documentElement.style.setProperty("--question-opacity", this.questionOpacity.toString());
  }
  getActiveTheme() {
    if (this.themeType === "default") return defaultThemes_default[this.themeIndex];
    else return this.customThemes[this.themeIndex];
  }
  stop() {
    window.removeEventListener("mousemove", this.boundOnMouseMove);
  }
};

// src/index.ts
var uiChanger = new UIChanger();
gimloader_default.UI.addStyles(styles_default);
gimloader_default.openSettingsMenu(() => {
  let confirmFunc;
  let onConfirm = (callback) => {
    confirmFunc = callback;
  };
  gimloader_default.UI.showModal(gimloader_default.React.createElement(UI, { uiChanger, onConfirm }), {
    id: "CustomUI",
    title: "UI Customization Options",
    style: "min-width: 400px",
    closeOnBackgroundClick: false,
    buttons: [{
      text: "Cancel",
      style: "close"
    }, {
      text: "Apply",
      style: "primary",
      onClick: () => {
        confirmFunc();
      }
    }]
  });
});
