export default class Poller {
    enabled: boolean;
    uid: string;
    constructor();
    setEnabled(enabled: boolean): void;
    sendRequest(): void;
}
