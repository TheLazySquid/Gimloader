import defaultThemes from '../defaultThemes.json';
import ThemePreview from './themePreview';
import { Theme } from '../types';
import { getBorderColor } from "../util";
import ThemeCreator from './themeCreator';

export default function ThemePicker(props: {
    themeType: "default" | "custom",
    setThemeType: (type: "default" | "custom") => void,
    themeIndex: number,
    setThemeIndex: (index: number) => void,
    customThemes: Theme[],
    setCustomThemes: (themes: Theme[]) => void,
    activeTheme: Theme
}) {
    const React = GL.React;

    let [themeType, setThemeType] = React.useState<"default" | "custom">(props.themeType);
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
        if(themeType === "default") setActiveTheme(defaultThemes[themeIndex]);
        else setActiveTheme(customThemes[themeIndex]);
    }, [themeType, themeIndex]);

    const openThemeCreator = () => {
        let creatingTheme: Theme;

        GL.UI.showModal(<ThemeCreator onChange={(theme) => creatingTheme = theme} />, {
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
        })
    }

    const deleteTheme = (index: number) => {
        let theme = customThemes[index];
        let confirm = window.confirm(`Are you sure you want to delete the theme "${theme.name}"?`);
        if(!confirm) return;

        if(theme === activeTheme) setThemeIndex(0);
        if(customThemes.length === 1) setThemeType("default");

        let newThemes = [...customThemes];
        newThemes.splice(index, 1);
        setCustomThemes(newThemes);
    }

    return (<div className="themePicker">
        <h1>Custom Themes</h1>
        <div className="previews">
            {customThemes.map((theme, i) => (
                <div className="customTheme">
                    <div className="delete" onClick={() => deleteTheme(i)}>
                        🗑
                    </div>
                    <div className="customThemePreview" style={{
                        border: theme === activeTheme ? `4px solid ${getBorderColor(theme)}` : "none",
                    }}>
                        <ThemePreview theme={theme} onClick={() => {
                            setThemeIndex(i);
                            setThemeType("custom");
                        }} />
                    </div>
                </div>
            ))}

            <button className="addCustomTheme" onClick={openThemeCreator}>
                Create New Theme
            </button>
        </div>
        <h1>Default Themes</h1>
        <div className="previews">
            {defaultThemes.map((theme, i) => (
                <div style={{
                    border: theme === activeTheme ? `4px solid ${getBorderColor(theme)}` : "none",
                }}>
                    <ThemePreview theme={theme} onClick={() => {
                        setThemeIndex(i);
                        setThemeType("default");
                    }} />
                </div>
            ))}
        </div>
    </div>)
}