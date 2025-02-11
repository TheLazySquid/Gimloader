import Poller from "./poller";
import Server from "./server";
import { state } from "./state";

Server.init();

state.then((state) => {
    Poller.init(state.settings.pollerEnabled);
});