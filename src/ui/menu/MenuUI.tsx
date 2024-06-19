import wrench from '$assets/wrench.svg';
import update from '$assets/update.svg';
import solidBook from '$assets/solid-book.svg';
import LibManagerUI from "./LibManager";
import PluginManagerUI from "./PluginManager";
import UpdateScreen from './UpdateScreen';

export default function MenuUI() {
    const React = GL.React;

    const tabs = [
        ["Plugins", wrench],
        ["Libraries", solidBook],
        ["Info / Updates", update]
    ];
    const [tab, setTab] = React.useState(0);

    return (<div className="gl-menu">
        <div className="tabs">
            {tabs.map((t, i) => {
                return (<div onClick={() => {
                    setTab(i);
                }} className={`tab ${tab === i ? 'selected' : ''}`}>
                    <div dangerouslySetInnerHTML={{ __html: t[1] }} className='icon'></div>
                    <div className="label">{t[0]}</div>
                </div>)
            })}
        </div>
        <div className="content">
            {tab === 0 && <PluginManagerUI />}
            {tab === 1 && <LibManagerUI />}
            {tab === 2 && <UpdateScreen />}
        </div>
    </div>)
}