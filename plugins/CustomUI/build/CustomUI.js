/**
 * @name CustomUI
 * @description Allows you to customize various things about the Gimkit UI
 * @author TheLazySquid
 * @version 0.2.2
 * @hasSettings true
 */
var styles = ".cui-settings {\n  overflow-x: hidden;\n  padding: 5px;\n}\n.cui-settings .row {\n  display: flex;\n  gap: 5px;\n  align-items: center;\n  margin-bottom: 5px;\n}\n.cui-settings .row input[type=range] {\n  flex-grow: 1;\n}\n.cui-settings input {\n  width: 25px;\n  height: 25px;\n  appearance: auto;\n}\n\n.themePicker .previews {\n  display: flex;\n  flex-direction: column;\n  gap: 5px;\n}\n.themePicker .addCustomTheme {\n  padding: 3px;\n  border: 1px solid black;\n  width: 100%;\n  text-align: center;\n}\n\n.customTheme {\n  display: flex;\n  gap: 5px;\n  align-items: center;\n}\n.customTheme .delete {\n  cursor: pointer;\n  font-size: 30px;\n  flex-shrink: 0;\n}\n.customTheme .customThemePreview {\n  flex-grow: 1;\n}\n\n.themePreview {\n  text-align: center;\n  cursor: pointer;\n}\n.themePreview > div {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.themePreview > div > div {\n  flex-grow: 1;\n  height: 30px;\n}\n\n.themeCreator {\n  display: flex;\n  height: 100%;\n}\n.themeCreator .pickers {\n  width: 300px;\n  overflow-y: auto;\n  overflow-x: hidden;\n  display: flex;\n  flex-direction: column;\n}\n.themeCreator .pickers .themeNameWrap {\n  width: 100%;\n  padding-right: 3px;\n}\n.themeCreator .pickers .themeName {\n  width: 100%;\n}\n.themeCreator .pickers > div {\n  display: flex;\n  padding-right: 3px;\n}\n.themeCreator .pickers > div > div {\n  flex-grow: 1;\n}\n\n.fullPreview {\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n  flex-grow: 1;\n}\n.fullPreview .question {\n  width: 100%;\n  height: 30%;\n  font-family: \"Product Sans\", sans-serif;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 50px;\n}\n.fullPreview .answers {\n  flex-grow: 1;\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  width: 100%;\n}\n.fullPreview .answers > div {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-family: \"Product Sans\", sans-serif;\n  font-size: 25px;\n  border: 6px solid rgba(0, 0, 0, 0.3);\n}\n\n.light-shadow.flex.between.vc {\n  transition: margin-top 0.25s ease-in-out;\n}\n\n.slideOutTop .light-shadow.flex.between.vc {\n  margin-top: -79px;\n}\n\n.useCustomTheme .flex.maxWidth.between.vc + div:not(.ant-space-vertical) > div > div:nth-child(1), .useCustomTheme [style^=\"width: 100%\"] > [style^=opacity] > div:nth-child(1) {\n  background: var(--question-bg) !important;\n  color: var(--question-text) !important;\n}\n.useCustomTheme .flex.maxWidth.between.vc + div:not(.ant-space-vertical) > div > div:nth-child(2) > div:nth-child(1) > div, .useCustomTheme [style^=\"width: 100%\"] > [style^=opacity] > div:nth-child(2) > div:nth-child(1) > div {\n  background: var(--answer-bg-1) !important;\n}\n.useCustomTheme .flex.maxWidth.between.vc + div:not(.ant-space-vertical) > div > div:nth-child(2) > div:nth-child(1) > div > div, .useCustomTheme [style^=\"width: 100%\"] > [style^=opacity] > div:nth-child(2) > div:nth-child(1) > div > div {\n  color: var(--answer-text-1) !important;\n}\n.useCustomTheme .flex.maxWidth.between.vc + div:not(.ant-space-vertical) > div > div:nth-child(2) > div:nth-child(2) > div, .useCustomTheme [style^=\"width: 100%\"] > [style^=opacity] > div:nth-child(2) > div:nth-child(2) > div {\n  background: var(--answer-bg-2) !important;\n}\n.useCustomTheme .flex.maxWidth.between.vc + div:not(.ant-space-vertical) > div > div:nth-child(2) > div:nth-child(2) > div > div, .useCustomTheme [style^=\"width: 100%\"] > [style^=opacity] > div:nth-child(2) > div:nth-child(2) > div > div {\n  color: var(--answer-text-2) !important;\n}\n.useCustomTheme .flex.maxWidth.between.vc + div:not(.ant-space-vertical) > div > div:nth-child(2) > div:nth-child(3) > div, .useCustomTheme [style^=\"width: 100%\"] > [style^=opacity] > div:nth-child(2) > div:nth-child(3) > div {\n  background: var(--answer-bg-3) !important;\n}\n.useCustomTheme .flex.maxWidth.between.vc + div:not(.ant-space-vertical) > div > div:nth-child(2) > div:nth-child(3) > div > div, .useCustomTheme [style^=\"width: 100%\"] > [style^=opacity] > div:nth-child(2) > div:nth-child(3) > div > div {\n  color: var(--answer-text-3) !important;\n}\n.useCustomTheme .flex.maxWidth.between.vc + div:not(.ant-space-vertical) > div > div:nth-child(2) > div:nth-child(4) > div, .useCustomTheme [style^=\"width: 100%\"] > [style^=opacity] > div:nth-child(2) > div:nth-child(4) > div {\n  background: var(--answer-bg-4) !important;\n}\n.useCustomTheme .flex.maxWidth.between.vc + div:not(.ant-space-vertical) > div > div:nth-child(2) > div:nth-child(4) > div > div, .useCustomTheme [style^=\"width: 100%\"] > [style^=opacity] > div:nth-child(2) > div:nth-child(4) > div > div {\n  color: var(--answer-text-4) !important;\n}\n\n.flex-column.maxAll > .maxWidth > span:nth-child(1) > div {\n  background-color: var(--answer-bg-1) !important;\n  color: var(--answer-text-1) !important;\n}\n.flex-column.maxAll > .maxWidth > span:nth-child(2) > div {\n  background-color: var(--answer-bg-2) !important;\n  color: var(--answer-text-2) !important;\n}\n\n.maxAll[style^=pointer-events]:has(.flex.maxWidth.between.vc + div:not(.ant-space-vertical) > div > div) {\n  opacity: var(--question-opacity);\n}";

function ThemePreview(props) {
    const React = GL.React;
    let { theme } = props;
    return (React.createElement("div", { style: {
            backgroundColor: theme.question.background,
            color: theme.question.text
        }, className: "themePreview", onClick: props.onClick },
        props.text ? props.text : theme.name,
        React.createElement("div", null,
            React.createElement("div", { style: {
                    backgroundColor: theme.palette[0].background,
                    color: theme.palette[0].text
                } }),
            React.createElement("div", { style: {
                    backgroundColor: theme.palette[1].background,
                    color: theme.palette[1].text
                } }),
            React.createElement("div", { style: {
                    backgroundColor: theme.palette[2].background,
                    color: theme.palette[2].text
                } }),
            React.createElement("div", { style: {
                    backgroundColor: theme.palette[3].background,
                    color: theme.palette[3].text
                } }))));
}

var defaultThemes = [
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

function getBorderColor(theme) {
    // return white or black depending on the brightness of the background color
    let rgb = parseHex(theme.question.background);
    // magic formula to determine brightness
    let brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness > 128 ? "#000000" : '#ff5c61';
}
function parseHex(hex) {
    return {
        r: parseInt(hex.substring(1, 3), 16),
        g: parseInt(hex.substring(3, 5), 16),
        b: parseInt(hex.substring(5, 7), 16)
    };
}

function ThemeCreator({ onChange }) {
    const React = GL.React;
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
    return (React.createElement("div", { className: "themeCreator" },
        React.createElement("div", { className: "pickers" },
            React.createElement("div", null, "Theme Name"),
            React.createElement("div", { className: "themeNameWrap" },
                React.createElement("input", { type: "text", value: theme.name, className: "themeName", onChange: (e) => {
                        theme.name = e.target.value;
                        setTheme({ ...theme });
                    } })),
            React.createElement("div", null,
                React.createElement("div", null, "Question Background"),
                React.createElement("input", { type: "color", value: theme.question.background, onChange: (e) => {
                        theme.question.background = e.target.value;
                        setTheme({ ...theme });
                    } })),
            React.createElement("div", null,
                React.createElement("div", null, "Question Text"),
                React.createElement("input", { type: "color", value: theme.question.text, onChange: (e) => {
                        theme.question.text = e.target.value;
                        setTheme({ ...theme });
                    } })),
            React.createElement("div", null,
                React.createElement("div", null, "Option 1 Background"),
                React.createElement("input", { type: "color", value: theme.palette[0].background, onChange: (e) => {
                        theme.palette[0].background = e.target.value;
                        setTheme({ ...theme });
                    } })),
            React.createElement("div", null,
                React.createElement("div", null, "Option 1 Text"),
                React.createElement("input", { type: "color", value: theme.palette[0].text, onChange: (e) => {
                        theme.palette[0].text = e.target.value;
                        setTheme({ ...theme });
                    } })),
            React.createElement("div", null,
                React.createElement("div", null, "Option 2 Background"),
                React.createElement("input", { type: "color", value: theme.palette[1].background, onChange: (e) => {
                        theme.palette[1].background = e.target.value;
                        setTheme({ ...theme });
                    } })),
            React.createElement("div", null,
                React.createElement("div", null, "Option 2 Text"),
                React.createElement("input", { type: "color", value: theme.palette[1].text, onChange: (e) => {
                        theme.palette[1].text = e.target.value;
                        setTheme({ ...theme });
                    } })),
            React.createElement("div", null,
                React.createElement("div", null, "Option 3 Background"),
                React.createElement("input", { type: "color", value: theme.palette[2].background, onChange: (e) => {
                        theme.palette[2].background = e.target.value;
                        setTheme({ ...theme });
                    } })),
            React.createElement("div", null,
                React.createElement("div", null, "Option 3 Text"),
                React.createElement("input", { type: "color", value: theme.palette[2].text, onChange: (e) => {
                        theme.palette[2].text = e.target.value;
                        setTheme({ ...theme });
                    } })),
            React.createElement("div", null,
                React.createElement("div", null, "Option 4 Background"),
                React.createElement("input", { type: "color", value: theme.palette[3].background, onChange: (e) => {
                        theme.palette[3].background = e.target.value;
                        setTheme({ ...theme });
                    } })),
            React.createElement("div", null,
                React.createElement("div", null, "Option 4 Text"),
                React.createElement("input", { type: "color", value: theme.palette[3].text, onChange: (e) => {
                        theme.palette[3].text = e.target.value;
                        setTheme({ ...theme });
                    } }))),
        React.createElement("div", { className: "fullPreview" },
            React.createElement("div", { className: "question", style: {
                    background: theme.question.background,
                    color: theme.question.text
                } }, "Question text"),
            React.createElement("div", { className: "answers" },
                React.createElement("div", { style: {
                        background: theme.palette[0].background,
                        color: theme.palette[0].text
                    } }, "Option 1"),
                React.createElement("div", { style: {
                        background: theme.palette[1].background,
                        color: theme.palette[1].text
                    } }, "Option 2"),
                React.createElement("div", { style: {
                        background: theme.palette[2].background,
                        color: theme.palette[2].text
                    } }, "Option 3"),
                React.createElement("div", { style: {
                        background: theme.palette[3].background,
                        color: theme.palette[3].text
                    } }, "Option 4")))));
}

function ThemePicker(props) {
    const React = GL.React;
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
        if (themeType === "default")
            setActiveTheme(defaultThemes[themeIndex]);
        else
            setActiveTheme(customThemes[themeIndex]);
    }, [themeType, themeIndex]);
    const openThemeCreator = () => {
        let creatingTheme;
        GL.UI.showModal(React.createElement(ThemeCreator, { onChange: (theme) => creatingTheme = theme }), {
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
                        // save the new theme
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
        if (!confirm)
            return;
        if (theme === activeTheme)
            setThemeIndex(0);
        if (customThemes.length === 1)
            setThemeType("default");
        let newThemes = [...customThemes];
        newThemes.splice(index, 1);
        setCustomThemes(newThemes);
    };
    return (React.createElement("div", { className: "themePicker" },
        React.createElement("h1", null, "Custom Themes"),
        React.createElement("div", { className: "previews" },
            customThemes.map((theme, i) => (React.createElement("div", { className: "customTheme" },
                React.createElement("div", { className: "delete", onClick: () => deleteTheme(i) }, "\uD83D\uDDD1"),
                React.createElement("div", { className: "customThemePreview", style: {
                        border: theme === activeTheme ? `4px solid ${getBorderColor(theme)}` : "none",
                    } },
                    React.createElement(ThemePreview, { theme: theme, onClick: () => {
                            setThemeIndex(i);
                            setThemeType("custom");
                        } }))))),
            React.createElement("button", { className: "addCustomTheme", onClick: openThemeCreator }, "Create New Theme")),
        React.createElement("h1", null, "Default Themes"),
        React.createElement("div", { className: "previews" }, defaultThemes.map((theme, i) => (React.createElement("div", { style: {
                border: theme === activeTheme ? `4px solid ${getBorderColor(theme)}` : "none",
            } },
            React.createElement(ThemePreview, { theme: theme, onClick: () => {
                    setThemeIndex(i);
                    setThemeType("default");
                } })))))));
}

function UI({ uiChanger, onConfirm }) {
    const React = GL.React;
    let [hideTopBar, setHideTopBar] = React.useState(uiChanger.hideTopBar);
    let [useCustomTheme, setUseCustomTheme] = React.useState(uiChanger.useCustomTheme);
    let [customThemes, setCustomThemes] = React.useState(uiChanger.customThemes);
    let [themeType, setThemeType] = React.useState(uiChanger.themeType);
    let [themeIndex, setThemeIndex] = React.useState(uiChanger.themeIndex);
    let [questionOpacity, setQuestionOpacity] = React.useState(uiChanger.questionOpacity);
    // reactively get the active theme based on the theme type and index
    let [activeTheme, setActiveTheme] = React.useState(() => {
        if (themeType === "default")
            return defaultThemes[themeIndex];
        else
            return customThemes[themeIndex];
    });
    React.useEffect(() => {
        if (themeType === "default")
            setActiveTheme(defaultThemes[themeIndex]);
        else
            setActiveTheme(customThemes[themeIndex]);
    }, [themeType, themeIndex]);
    onConfirm(() => {
        uiChanger.updateSettings(hideTopBar, useCustomTheme, customThemes, themeType, themeIndex, questionOpacity);
    });
    const openThemePicker = () => {
        GL.UI.showModal(React.createElement(ThemePicker, { themeType: themeType, setThemeType: setThemeType, themeIndex: themeIndex, setThemeIndex: setThemeIndex, customThemes: customThemes, setCustomThemes: setCustomThemes, activeTheme: activeTheme }), {
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
    return (React.createElement("div", { className: "cui-settings" },
        React.createElement("div", { className: "row" },
            React.createElement("div", null, "Auto Hide Top Bar"),
            React.createElement("input", { type: "checkbox", checked: hideTopBar, onChange: e => {
                    setHideTopBar(e.target.checked);
                } })),
        React.createElement("div", { className: "row" },
            React.createElement("div", null, "Question Panel Opacity"),
            React.createElement("input", { type: "range", min: "0", max: "1", step: "0.01", value: questionOpacity, onChange: (e) => {
                    setQuestionOpacity(parseFloat(e.target.value));
                } })),
        React.createElement("div", { className: "row" },
            React.createElement("div", null, "Use Custom Theme"),
            React.createElement("input", { type: "checkbox", checked: useCustomTheme, onChange: e => {
                    setUseCustomTheme(e.target.checked);
                } })),
        React.createElement(ThemePreview, { theme: activeTheme, onClick: openThemePicker, text: `Current theme: ${activeTheme.name} ✎` })));
}

class UIChanger {
    hideTopBar = GL.storage.getValue("CustomUI", "hideTopBar", false);
    useCustomTheme = GL.storage.getValue("CustomUI", "useCustomTheme", false);
    customThemes = GL.storage.getValue("CustomUI", "themes", []);
    themeType = GL.storage.getValue("CustomUI", "themeType", "default");
    themeIndex = GL.storage.getValue("CustomUI", "themeIndex", 0);
    questionOpacity = GL.storage.getValue("CustomUI", "questionOpacity", 1);
    constructor() {
        window.addEventListener("mousemove", this.boundOnMouseMove);
        this.onSettingsUpdate();
    }
    boundOnMouseMove = this.onMouseMove.bind(this);
    onMouseMove(e) {
        if (!this.hideTopBar)
            return;
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
        // save settings
        GL.storage.setValue("CustomUI", "hideTopBar", hideTopBar);
        GL.storage.setValue("CustomUI", "useCustomTheme", useCustomTheme);
        GL.storage.setValue("CustomUI", "themes", customThemes);
        GL.storage.setValue("CustomUI", "themeType", themeType);
        GL.storage.setValue("CustomUI", "themeIndex", themeIndex);
        GL.storage.setValue("CustomUI", "questionOpacity", questionOpacity);
        this.onSettingsUpdate();
    }
    onSettingsUpdate() {
        if (!this.hideTopBar) {
            document.documentElement.classList.remove("slideOutTop");
        }
        document.documentElement.classList.toggle("useCustomTheme", this.useCustomTheme);
        let theme = this.getActiveTheme();
        // update variables
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
        if (this.themeType === "default")
            return defaultThemes[this.themeIndex];
        else
            return this.customThemes[this.themeIndex];
    }
    stop() {
        window.removeEventListener("mousemove", this.boundOnMouseMove);
    }
}

/// <reference types='gimloader' />
// @ts-ignore
let uiChanger = new UIChanger();
GL.UI.addStyles("CustomUI", styles);
function onStop() {
    GL.UI.removeStyles("CustomUI");
    uiChanger.stop();
}
function openSettingsMenu() {
    let confirmFunc;
    let onConfirm = (callback) => {
        confirmFunc = callback;
    };
    GL.UI.showModal(GL.React.createElement(UI, { uiChanger, onConfirm }), {
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
}

export { onStop, openSettingsMenu };
