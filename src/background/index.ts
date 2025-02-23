import Poller from "./poller";
import Server from "./server";
import { statePromise } from "./state";
import Updater from "./updater";

Server.init();
Updater.init();

statePromise.then((state) => {
    Poller.init(state.settings.pollerEnabled);
});