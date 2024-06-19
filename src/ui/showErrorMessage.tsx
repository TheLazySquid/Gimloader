let reactListenerSet = false;
let queuedMessages: { msg: string, title: string }[] = [];

export default function showErrorMessage(msg: string, title: string = "Error") {
    // if react hasn't loaded yet queue up messages
    if(!GL.React) {
        queuedMessages.push({ msg, title });

        if(!reactListenerSet) {
            reactListenerSet = true;
            GL.addEventListener('reactLoaded', () => {
                for(let message of queuedMessages) {
                    showErrorMessage(message.msg, message.title);
                }
            })
        }
    }

    const React = GL.React;
    
    GL.UI.showModal(<pre className="gl-errorMsg">
        {msg}
    </pre>, {
        title,
        buttons: [
            { text: "Ok", style: "primary" }
        ]
    })
}