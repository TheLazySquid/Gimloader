import { splitNames } from "./constants";
import type UI from "./ui";
import { fmtMs } from "./util";

export default function Settings({ ui }: { ui: UI }) {
    const React = GL.React;

    const [category, setCategory] = React.useState(ui.category);
    const [attempts, setAttempts] = React.useState(ui.attempts);
    const [personalBest, setPersonalBest] = React.useState(ui.personalBest);
    const [bestSplits, setBestSplits] = React.useState(ui.bestSplits);

    React.useEffect(() => {
        setAttempts(GL.storage.getValue("DLD Timer", `attempts-${category}`, 0));
        setPersonalBest(GL.storage.getValue("DLD Timer", `pb-${category}`, []));
        setBestSplits(GL.storage.getValue("DLD Timer", `bestSplits-${category}`, []));
    }, [category]);

    return (<div id="DLDTimer-settings">
        <h1>Manage data</h1>
        <div className="category">
            Category:
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Current Patch">Current Patch</option>
                <option value="Creative Platforming Patch">Creative Platforming Patch</option>
                <option value="Original Physics">Original Physics</option>
            </select>
        </div>
        <hr />
        <div>
            Attempts: {attempts}
        </div>
        {attempts > 0 && <button onClick={() => {
            setAttempts(0);
            GL.storage.removeValue("DLD Timer", `attempts-${category}`);
            ui.attempts = 0;
        }}>Reset</button>}
        <hr />
        {personalBest.length === 0 ? <div>No personal bests recorded</div> : <div>
            <div>
                Current personal best: {fmtMs(personalBest[personalBest.length - 1])}
            </div>
            <button onClick={() => {
                setPersonalBest([]);
                GL.storage.removeValue("DLD Timer", `pb-${category}`);
                ui.personalBest = [];
            }}>Reset</button>
        </div>}
        <hr />
        {bestSplits.length === 0 ? <div>No best summit times</div> : <div>
            Best summit times: {bestSplits.map((time, i) => <div key={i}>{splitNames[i]}: {fmtMs(time)}</div>)}
            <button onClick={() => {
                setBestSplits([]);
                GL.storage.removeValue("DLD Timer", `bestSplits-${category}`);
                ui.bestSplits = [];
            }}>Reset</button>
        </div>}
    </div>)
}