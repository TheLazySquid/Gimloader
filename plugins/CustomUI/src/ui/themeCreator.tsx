import { Theme } from "../types";

export default function ThemeCreator({ onChange }: { onChange: (theme: Theme) => void }) {
    const React = GL.React;

    let [theme, setTheme] = React.useState<Theme>({
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
    })

    React.useEffect(() => {
        onChange(theme);
    }, [theme]);

    return (<div className="themeCreator">
        <div className="pickers">
            <div>Theme Name</div>
            <div className="themeNameWrap">
                <input type="text" value={theme.name}
                className="themeName" onChange={(e) => {
                    theme.name = e.target.value;
                    setTheme({ ...theme });
                }} />
            </div>
            <div>
                <div>Question Background</div>
                <input type="color" value={theme.question.background} onChange={(e) => {
                    theme.question.background = e.target.value;
                    setTheme({ ...theme });
                }} />
            </div>
            <div>
                <div>Question Text</div>
                <input type="color" value={theme.question.text} onChange={(e) => {
                    theme.question.text = e.target.value;
                    setTheme({ ...theme });
                }} />
            </div>
            <div>
                <div>Option 1 Background</div>
                <input type="color" value={theme.palette[0].background} onChange={(e) => {
                    theme.palette[0].background = e.target.value;
                    setTheme({ ...theme });
                }} />
            </div>
            <div>
                <div>Option 1 Text</div>
                <input type="color" value={theme.palette[0].text} onChange={(e) => {
                    theme.palette[0].text = e.target.value;
                    setTheme({ ...theme });
                }} />
            </div>
            <div>
                <div>Option 2 Background</div>
                <input type="color" value={theme.palette[1].background} onChange={(e) => {
                    theme.palette[1].background = e.target.value;
                    setTheme({ ...theme });
                }} />
            </div>
            <div>
                <div>Option 2 Text</div>
                <input type="color" value={theme.palette[1].text} onChange={(e) => {
                    theme.palette[1].text = e.target.value;
                    setTheme({ ...theme });
                }} />
            </div>
            <div>
                <div>Option 3 Background</div>
                <input type="color" value={theme.palette[2].background} onChange={(e) => {
                    theme.palette[2].background = e.target.value;
                    setTheme({ ...theme });
                }} />
            </div>
            <div>
                <div>Option 3 Text</div>
                <input type="color" value={theme.palette[2].text} onChange={(e) => {
                    theme.palette[2].text = e.target.value;
                    setTheme({ ...theme });
                }} />
            </div>
            <div>
                <div>Option 4 Background</div>
                <input type="color" value={theme.palette[3].background} onChange={(e) => {
                    theme.palette[3].background = e.target.value;
                    setTheme({ ...theme });
                }} />
            </div>
            <div>
                <div>Option 4 Text</div>
                <input type="color" value={theme.palette[3].text} onChange={(e) => {
                    theme.palette[3].text = e.target.value;
                    setTheme({ ...theme });
                }} />
            </div>
        </div>
        <div className="fullPreview">
            <div className="question" style={{
                background: theme.question.background,
                color: theme.question.text
            }}>
                Question text
            </div>
            <div className="answers">
                <div style={{
                    background: theme.palette[0].background,
                    color: theme.palette[0].text
                }}>
                    Option 1
                </div>
                <div style={{
                    background: theme.palette[1].background,
                    color: theme.palette[1].text
                }}>
                    Option 2
                </div>
                <div style={{
                    background: theme.palette[2].background,
                    color: theme.palette[2].text
                }}>
                    Option 3
                </div>
                <div style={{
                    background: theme.palette[3].background,
                    color: theme.palette[3].text
                }}>
                    Option 4
                </div>
            </div>
        </div>
    </div>)
}