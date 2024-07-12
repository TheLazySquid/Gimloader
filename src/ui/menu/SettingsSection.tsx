export default function SettingsSection() {
    const React = GL.React;
    
    const [pollerEnabled, setPollerEnabled] = React.useState(GL.poller.enabled);

    return (<div>
        <input type="checkbox" checked={pollerEnabled} onChange={(e) => {
            GL.poller.setEnabled(e.target.checked);
            setPollerEnabled(e.target.checked);
        }} />
        Poll for plugins/libraries being served locally
    </div>)
}