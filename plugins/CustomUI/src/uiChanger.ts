import { Theme } from './types';
import defaultThemes from './defaultThemes.json';
// @ts-ignore
import darkMode from './darkMode.css';

export default class UIChanger {
    hideTopBar: boolean = GL.storage.getValue("CustomUI", "hideTopBar", false);

    useCustomTheme: boolean = GL.storage.getValue("CustomUI", "useCustomTheme", false);
    customThemes: Theme[] = GL.storage.getValue("CustomUI", "themes", []);
    themeType: "default" | "custom" = GL.storage.getValue("CustomUI", "themeType", "default");
    themeIndex: number = GL.storage.getValue("CustomUI", "themeIndex", 0);

    questionOpacity: number = GL.storage.getValue("CustomUI", "questionOpacity", 1);

    darkTheme: boolean = GL.storage.getValue("CustomUI", "darkTheme", false);

    constructor() {
        window.addEventListener("mousemove", this.boundOnMouseMove);

        this.onSettingsUpdate();

        if(this.darkTheme && this.shouldApplyDarkMode) {
            GL.UI.addStyles("CUI-DarkMode", darkMode);
        }
    }

    get shouldApplyDarkMode() {
        return location.pathname !== "/join" &&
            location.pathname !== "/host";
    }

    boundOnMouseMove = this.onMouseMove.bind(this);

    onMouseMove(e: MouseEvent) {
        if(!this.hideTopBar) return;

        let nearTop = e.clientY < 100;
        document.documentElement.classList.toggle("slideOutTop", !nearTop);
    }

    updateSettings(
        hideTopBar: boolean,
        useCustomTheme: boolean,
        customThemes: Theme[],
        themeType: "default" | "custom",
        themeIndex: number,
        questionOpacity: number,
        darkTheme: boolean
    ) {
        this.hideTopBar = hideTopBar;
        this.useCustomTheme = useCustomTheme;
        this.customThemes = customThemes;
        this.themeType = themeType;
        this.themeIndex = themeIndex;
        this.questionOpacity = questionOpacity;
        this.darkTheme = darkTheme;

        // save settings
        GL.storage.setValue("CustomUI", "hideTopBar", hideTopBar);
        GL.storage.setValue("CustomUI", "useCustomTheme", useCustomTheme);
        GL.storage.setValue("CustomUI", "themes", customThemes);
        GL.storage.setValue("CustomUI", "themeType", themeType);
        GL.storage.setValue("CustomUI", "themeIndex", themeIndex);
        GL.storage.setValue("CustomUI", "questionOpacity", questionOpacity);
        GL.storage.setValue("CustomUI", "darkTheme", darkTheme);

        this.onSettingsUpdate();

        GL.UI.removeStyles("CUI-DarkMode");
        if(darkTheme && this.shouldApplyDarkMode) {
            GL.UI.addStyles("CUI-DarkMode", darkMode);
        }
    }
        
    onSettingsUpdate() {
        if(!this.hideTopBar) {
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

    getActiveTheme(): Theme {
        if(this.themeType === "default") return defaultThemes[this.themeIndex];
        else return this.customThemes[this.themeIndex];
    }

    stop() {
        window.removeEventListener("mousemove", this.boundOnMouseMove);
        GL.UI.removeStyles("CUI-DarkMode");
    }
}