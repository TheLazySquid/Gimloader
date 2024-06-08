import type UIChanger from "../uiChanger";
import ThemePreview from "./themePreview";
import defaultThemes from '../defaultThemes.json';
import ThemePicker from "./themePicker";

export default function UI({ uiChanger, onConfirm }: { uiChanger: UIChanger, onConfirm: (callback: () => void) => void }) {
    const React = GL.React;

    let [hideTopBar, setHideTopBar] = React.useState(uiChanger.hideTopBar);
    let [useCustomTheme, setUseCustomTheme] = React.useState(uiChanger.useCustomTheme);
    let [customThemes, setCustomThemes] = React.useState(uiChanger.customThemes);
    let [themeType, setThemeType] = React.useState(uiChanger.themeType);
    let [themeIndex, setThemeIndex] = React.useState(uiChanger.themeIndex);
    let [darkMode, setDarkMode] = React.useState(uiChanger.darkTheme);
    let [questionOpacity, setQuestionOpacity] = React.useState(uiChanger.questionOpacity);

    // reactively get the active theme based on the theme type and index
    let [activeTheme, setActiveTheme] = React.useState(() => {
        if(themeType === "default") return defaultThemes[themeIndex];
        else return customThemes[themeIndex];
    });

    React.useEffect(() => {
        if(themeType === "default") setActiveTheme(defaultThemes[themeIndex]);
        else setActiveTheme(customThemes[themeIndex]);
    }, [themeType, themeIndex]);

    onConfirm(() => {
        uiChanger.updateSettings(hideTopBar, useCustomTheme, customThemes,
            themeType, themeIndex, questionOpacity, darkMode);
    })

    const openThemePicker = () => {
        GL.UI.showModal(<ThemePicker
            themeType={themeType} setThemeType={setThemeType}
            themeIndex={themeIndex} setThemeIndex={setThemeIndex}
            customThemes={customThemes} setCustomThemes={setCustomThemes}
            activeTheme={activeTheme}
        />, {
            id: "ThemePicker",
            title: "Theme Picker",
            closeOnBackgroundClick: true,
            buttons: [{
                text: "Close",
                style: "close"
            }],
            style: "width: max(50%, 400px)"
        })
    }

    return (
        <div className="cui-settings">
            <div className="row">
                <div>Auto Hide Top Bar</div>
                <input type="checkbox" checked={hideTopBar} onChange={e => {
                    setHideTopBar(e.target.checked);
                }} />
            </div>
    
            <div className="row">
                <div>Question Panel Opacity</div>
                <input type="range" min="0" max="1" step="0.01" value={questionOpacity} onChange={(e) => {
                    setQuestionOpacity(parseFloat(e.target.value));
                }} />
            </div>

            <div className="row">
                <div>Use Custom Theme</div>
                <input type="checkbox" checked={useCustomTheme} onChange={e => {
                    setUseCustomTheme(e.target.checked);
                }} />
            </div>

            <ThemePreview theme={activeTheme} onClick={openThemePicker} 
            text={`Current theme: ${activeTheme.name} ✎`} />

            <div className="row">
                <div>Enable Home Screen Dark Mode</div>
                <input type="checkbox" checked={darkMode} onChange={e => {
                    setDarkMode(e.target.checked);
                }} />
            </div>
        </div>
    )
}