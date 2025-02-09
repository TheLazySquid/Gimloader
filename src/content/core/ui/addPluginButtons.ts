import wrench from "$assets/wrench.svg";
import { mount, unmount } from "svelte";
import MenuUI from "$content/ui/MenuUI.svelte";
import Storage from "$content/core/storage.svelte";
import Parcel from "$content/core/parcel";
import Patcher from "$content/core/patcher";
import UI from "$content/core/ui/ui";
import Hotkeys from '$core/hotkeys/hotkeys.svelte';

let open = false;
function openPluginManager() {
    if(open) return;
    open = true;

    let component = mount(MenuUI, {
        target: document.body,
        props: {
            onClose: () => {
                open = false;
                unmount(component)
            }
        }
    });
}

export function setShowPluginButtons(value: boolean) {
    Storage.updateSetting("showPluginButtons", value);

    if(!value) {
        document.documentElement.classList.add("noPluginButtons");
    } else {
        document.documentElement.classList.remove("noPluginButtons");
    }
}

export function addPluginButtons() {
    if(!Storage.settings.showPluginButtons) {
        document.documentElement.classList.add("noPluginButtons");
    }

    // add a hotkey shift+p to open the plugin manager
    Hotkeys.addHotkey(null, {
        key: "KeyP",
        alt: true
    }, () => openPluginManager());
    
    // add the button to the creative screen and the host screen
    Parcel.getLazy(null, exports => exports?.default?.toString?.().includes('.disable?"none":"all"'), exports => {
        Patcher.after(null, exports, "default", (_, __, res) => {
            if(res?.props?.className?.includes?.('light-shadow flex between')) {
                let nativeType = res.props.children[1].type.type;
                res.props.children[1].type.type = function() {
                    let res = nativeType.apply(this, arguments);

                    // make sure we haven't already added the button
                    if(res.props.children.some((c: any) => c?.props?.tooltip === 'Plugins')) return res;

                    let btnType = res.props.children[0].type;
                    res.props.children.splice(0, 0, UI.React.createElement(btnType, {
                        tooltip: 'Plugins',
                        children: UI.React.createElement('div', {
                            className: 'gl-wrench',
                            dangerouslySetInnerHTML: { __html: wrench }
                        }),
                        onClick: () => openPluginManager()
                    }))

                    return res;
                }
            }
            
            if(res?.props?.children?.props?.tooltip === 'Options') {
                res.props.className = 'gl-row';

                let newBtn = res.props.children.type({
                    tooltip: 'Plugins',
                    children: UI.React.createElement('div', {
                        className: 'gl-wrench',
                        dangerouslySetInnerHTML: { __html: wrench }
                    }),
                    onClick: () => openPluginManager()
                })

                res.props.children = [res.props.children, newBtn];
            }

            return res;
        })
    }, true)

    // add the wrench button to the join screen
    Parcel.getLazy(null, exports => exports?.default?.toString?.().includes('type:"secondary"'), exports => {
        Patcher.after(null, exports, 'default', (_, __, res) => {
            let newButton = UI.React.createElement('button', {
                className: 'openPlugins',
                dangerouslySetInnerHTML: { __html: wrench },
                onClick: () => openPluginManager()
            });

            return UI.React.createElement('div', { className: 'gl-join' }, [res, newButton])
        });
    }, true)

    // add the button to the home screen
    Parcel.getLazy(null, exports => exports?.SpaceContext, exports => {
        Patcher.before(null, exports, 'default', (_, args) => {
            let light = location.href.includes("/creative") || location.href.includes("/rewards");
            
            if(args[0].children?.some?.((c: any) => c?.key === 'creative')) {
                let icon = UI.React.createElement('div', {
                    className: 'icon',
                    dangerouslySetInnerHTML: { __html: wrench }
                })
                let text = UI.React.createElement('div', {
                    className: "text"
                }, "Plugins")
                let newEl = UI.React.createElement('div', {
                    className: `gl-homeWrench ${light ? 'light' : ''}`,
                    onClick: () => openPluginManager()
                }, [icon, text])
    
                args[0].children.splice(0, 0, newEl);
            }
        })
    }, true)

    // add the button to the host screen before the game starts
    Parcel.getLazy(null, 
        // the } is there for a reason
    exports => exports?.default?.toString?.().includes('customHorizontalPadding}'),
    exports => {
        let nativeDefault = exports.default;

        Patcher.after(null, exports, 'default', (_, __, res) => {
            let btnContents = UI.React.createElement('div', {
                className: "gl-hostWrench"
            }, [
                UI.React.createElement('div', {
                    className: 'gl-wrench',
                    dangerouslySetInnerHTML: { __html: wrench }
                }),
                UI.React.createElement('div', {}, "Plugins")
            ])

            let newBtn = nativeDefault.apply(this, [{
                children: btnContents,
                onClick: () => openPluginManager(),
                customColor: "#01579b",
                className: 'gl-hostWrenchBtn'
            }])

            let name = res?.props?.children?.props?.children?.[2]?.props?.children?.props?.children?.[1]
            if(name === 'Rewards') {
                res.props.children = [newBtn, res.props.children]
            }

            return res;
        })
    }, true)

    // add the button to 1d host screens
    Parcel.getLazy(null, 
    exports => exports?.default?.displayName?.includes?.('inject-with-gameOptions-gameValues-players-kit-ui'),
    exports => {
        Patcher.after(null, exports.default, 'render', (_, __, res) => {
            let nativeType = res.type;
            
            delete res.type;
            res.type = function() {
                let res = new nativeType(...arguments);
                
                let nativeRender = res.render;
                delete res.render;
                
                res.render = function() {
                    let res = nativeRender.apply(this, arguments);
                    
                    let newBtn = UI.React.createElement('button', {
                        className: 'gl-1dHostPluginBtn',
                        onClick: () => openPluginManager()
                    }, 'Plugins')
                    
                    res.props.children = [newBtn, res.props.children];
                    
                    return res;
                }
                
                return res;
            }
            
            return res
        })
    }, true)
    
    // add the button to the 1d host screen while in-game
    // we need to do this to intercept the stupid mobx wrapper which is a massive pain
    Parcel.getLazy(null, exports => exports?.__decorate, exports => {
        Patcher.before(null, exports, '__decorate', (_, args) => {
            if(args[1]?.toString?.()?.includes("Toggle Music")) {
                let nativeRender = args[1].prototype.render;
                args[1].prototype.render = function() {
                    let res = nativeRender.apply(this, args);
                    let children = res.props.children[2].props.children.props.children

                    let newEl = UI.React.createElement(children[1].type, {
                        icon: UI.React.createElement('div', {
                            className: 'gl-1dHostGameWrench',
                            dangerouslySetInnerHTML: { __html: wrench }
                        }),
                        onClick: () => openPluginManager(),
                        tooltipMessage: "Plugins"
                    })
                    
                    children.splice(0, 0, newEl);
                    
                    return res;
                }
            }
        })
    }, true)

    // add the button to the 1d game screen
    Parcel.getLazy(null, exports => exports?.observer &&
    exports.Provider, exports => {
        // let nativeObserver = exports.observer;
        // delete exports.observer;

        // exports.observer = function() {
        Patcher.before(null, exports, 'observer', (_, args) => {
            if(args[0]?.toString?.().includes('"aria-label":"Menu"')) {
                let nativeArgs = args[0];
                args[0] = function() {
                    let res = nativeArgs.apply(this, arguments);

                    // for when we're still on the join screen
                    if(res?.props?.children?.props?.children?.props?.src === '/client/img/svgLogoWhite.svg') {
                        let props = res.props.children.props

                        props.children = [props.children, UI.React.createElement('div', {
                            className: 'gl-1dGameWrenchJoin',
                            style: { cursor: 'pointer' },
                            dangerouslySetInnerHTML: { __html: wrench },
                            onClick: () => openPluginManager()
                        })];

                        return res;
                    }
                    
                    let children = res?.props?.children?.[0]?.props?.children?.props?.children;
                    if(!children) return res;
                    
                    let newEl = UI.React.createElement(children[1].type, {
                        onClick: () => openPluginManager(),
                    }, UI.React.createElement('div', {
                        className: 'gl-1dGameWrench',
                        dangerouslySetInnerHTML: { __html: wrench }
                    }))
                    
                    children.splice(3, 0, newEl)
                    
                    return res;
                }
            }
        })
    }, true);
}