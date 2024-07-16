import type { InfoLines } from "./index";

export default function Settings({ infoLines }: { infoLines: InfoLines }) {
    const React = GL.React;

    let [lines, setLines] = React.useState(infoLines.lines);
    let [position, setPosition] = React.useState(infoLines.position);

    return (<div id="il-settings">
        <div className="position">
            Position
            <select value={position} onChange={(e) => {
                setPosition(e.target.value);
                GL.storage.setValue("InfoLines", "position", e.target.value);
                if(infoLines.element) infoLines.element.className = e.target.value;
            }}>
                <option value="top left">Top Left</option>
                <option value="top right">Top Right</option>
                <option value="bottom left">Bottom Left</option>
                <option value="bottom right">Bottom Right</option>
            </select>
        </div>
        <hr />
        {lines.map(line => (<div>
            <div>
                <input type="checkbox" checked={line.enabled} onChange={(e) => {
                    line.enabled = e.target.checked;
                    GL.storage.setValue("InfoLines", line.name, line.enabled);

                    if(line.enabled) line.enable();
                    else line.disable();

                    // I hate react
                    setLines([...lines]);
                }} />
                {line.name}
            </div>
            {line.settings && Object.entries(line.settings).map(([id, setting]) => (<div className="setting">
                {setting.label}
                <input type="range" min={setting.min} step={1}
                max={setting.max} value={setting.value} onChange={(e) => {
                    setting.value = parseInt(e.target.value);
                    GL.storage.setValue("InfoLines", id, setting.value);

                    if(line.enabled) line.onSettingsChange?.();

                    setLines([...lines]);
                }} />
                {setting.value}
            </div>))}
            <hr />
        </div>))}
    </div>)
}