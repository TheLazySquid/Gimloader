import { IBlacklistedName } from "./types";
import type AutoKicker from "./autokicker";

export default function UI({ autoKicker }: { autoKicker: AutoKicker }) {
    const React = GL.React;

    let [kickDuplicated, setKickDuplicated] = React.useState(autoKicker.kickDuplicateNames);
    let [kickSkinless, setKickSkinless] = React.useState(autoKicker.kickSkinless);
    let [kickIdle, setKickIdle] = React.useState(autoKicker.kickIdle);
    let [kickIdleDelay, setKickIdleDelay] = React.useState(autoKicker.idleDelay);
    let [blacklist, setBlacklist] = React.useState(autoKicker.blacklist);

    return (<div className="root">
        <div className="checkboxes">
            <label>Kick duplicates</label>
            <input type="checkbox" checked={kickDuplicated}
            onChange={(e) => {
                autoKicker.kickDuplicateNames = e.target.checked;
                setKickDuplicated(e.target.checked);
                autoKicker.scanPlayers();
                autoKicker.saveSettings();
            }}
            onKeyDown={(e) => e.preventDefault()} />
            <label>Kick skinless</label>
            <input type="checkbox" checked={kickSkinless}
            onChange={(e) => {
                autoKicker.kickSkinless = e.target.checked;
                setKickSkinless(e.target.checked);
                autoKicker.scanPlayers();
                autoKicker.saveSettings();
            }}
            onKeyDown={(e) => e.preventDefault()} />
            <label>Kick Idle</label>
            <input type="checkbox" checked={kickIdle}
            onChange={(e) => {
                setKickIdle(e.target.checked);
                autoKicker.setKickIdle(e.target.checked);
                autoKicker.saveSettings();
            }}
            onKeyDown={(e) => e.preventDefault()} />
        </div>
        {kickIdle && <div className="idleDelaySlider">
            <input type="range" min="5000" max="60000" step="1000"
            value={kickIdleDelay}
            onChange={(e) => {
                let val = parseInt(e.target.value);
                if(isNaN(val)) return;
                setKickIdleDelay(val);
                autoKicker.idleDelay = val;

                // reset the idle kick timeout
                autoKicker.setKickIdle(false);
                autoKicker.setKickIdle(true);
                autoKicker.saveSettings();
            }} />
            <label>{kickIdleDelay}ms</label>
        </div>}
        <h2>Blacklist</h2>
        <div className="blacklist">
            {blacklist.map((entry: IBlacklistedName) => {
                return (<button className="rule" key={entry.name}>
                    <div className="name">
                        {entry.name}
                    </div>
                    <button className="exact" onClick={() => {
                        entry.exact = !entry.exact;
                        setBlacklist([...blacklist]);
                        autoKicker.scanPlayers();
                        autoKicker.saveSettings();
                    }}>
                        {entry.exact ? "Exact" : "Contains"}
                    </button>
                    <button className="delete" onClick={() => {
                        autoKicker.blacklist = autoKicker.blacklist.filter((e: IBlacklistedName) => e.name !== entry.name);
                        setBlacklist([...autoKicker.blacklist]);
                        autoKicker.saveSettings();
                    }}>
                        &#128465;
                    </button>
                </button>)
            })}
            <button className="add" onClick={() => {
                let name = prompt("Enter the name to blacklist");
                if(!name) return;
                name = name.trim();

                autoKicker.blacklist.push({
                    name,
                    exact: true
                });
                setBlacklist([...autoKicker.blacklist]);
                autoKicker.scanPlayers();
                autoKicker.saveSettings();
            }}>
                +
            </button>
        </div>
    </div>)
}