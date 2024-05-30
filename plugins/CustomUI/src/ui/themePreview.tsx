import { Theme } from "../types";

export default function ThemePreview(props: { theme: Theme, text?: string, onClick?: () => void }) {
    const React = GL.React;

    let { theme } = props;

    return (<div style={{
        backgroundColor: theme.question.background,
        color: theme.question.text
    }} className="themePreview" onClick={props.onClick}>
        {props.text ? props.text : theme.name}
        <div>
            <div style={{
                backgroundColor: theme.palette[0].background,
                color: theme.palette[0].text
            }}></div>
            <div style={{
                backgroundColor: theme.palette[1].background,
                color: theme.palette[1].text
            }}></div>
            <div style={{
                backgroundColor: theme.palette[2].background,
                color: theme.palette[2].text
            }}></div>
            <div style={{
                backgroundColor: theme.palette[3].background,
                color: theme.palette[3].text
            }}></div>
        </div>
    </div>)
}