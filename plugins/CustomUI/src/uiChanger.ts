import { Theme } from './types';
import defaultThemes from './defaultThemes.json';

export default class UIChanger {
    hideTopBar: boolean = GL.storage.getValue("CustomUI", "hideTopBar", false);

    useCustomTheme: boolean = GL.storage.getValue("CustomUI", "useCustomTheme", false);
    customThemes: Theme[] = GL.storage.getValue("CustomUI", "themes", []);
    themeType: "default" | "custom" = GL.storage.getValue("CustomUI", "themeType", "default");
    themeIndex: number = GL.storage.getValue("CustomUI", "themeIndex", 0);

    questionOpacity: number = GL.storage.getValue("CustomUI", "questionOpacity", 1);

    constructor() {
        window.addEventListener("mousemove", this.boundOnMouseMove);

        this.onSettingsUpdate();
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
        questionOpacity: number
    ) {
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
    }
}