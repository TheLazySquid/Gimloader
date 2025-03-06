import type { CustomServerConfig, State } from "$types/state";
import Server from "$bg/server";
import { saveDebounced, statePromise } from "$bg/state";

const { RuleActionType } = chrome.declarativeNetRequest;

export default class CustomServerHandler {
    static async init() {
        statePromise.then((state) => this.createRedirect(state.customServer));
        
        Server.on("customServerUpdate", this.onCustomServerUpdate.bind(this));
    }

    static save() {
        saveDebounced('customServer');
    }

    static onCustomServerUpdate(state: State, config: CustomServerConfig) {
        state.customServer = config;
        this.createRedirect(config);
        this.save();
    }

    static formatAddress(address: string) {
        address = address.trim();
        if(!address.startsWith("http://") && !address.startsWith("https://")) {
            address = "http://" + address;
        }
        
        let site = address.slice(address.indexOf("://") + 3);
        if(site.includes(":") || site.includes("/") || site.includes(" ")) return null;

        try {
            let url = new URL(address);
            return url.origin;
        } catch {
            return null;
        }
    }

    static createRedirect(config: CustomServerConfig) {
        let address = this.formatAddress(config.address);

        if(!config.enabled || !address) {
            chrome.declarativeNetRequest.updateDynamicRules({
                removeRuleIds: [2]
            });
        } else {
            let route = config.type === "all" ? "api/" : "api/matchmaker";
            let regexSubstitution = `${address}:${config.port}/${route}`;
            let regexFilter = `^https://www\\.gimkit\\.com/${route}`;
            console.log(regexSubstitution, regexFilter);

            chrome.declarativeNetRequest.updateDynamicRules({
                removeRuleIds: [2],
                addRules: [
                    {
                        id: 2,
                        priority: 2,
                        action: {
                            type: RuleActionType.REDIRECT,
                            redirect: {
                                regexSubstitution
                            }
                        },
                        condition: {
                            regexFilter
                        }
                    }
                ]
            });
        }

        return address !== null;
    }
}