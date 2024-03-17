import type { GimkitLoader } from "../index";
import wrench from '../../assets/wrench.svg';
import showModal from "./modal";
import PluginManager from "./PluginManager";

let modalOpen = false;

function openPluginManager() {
    if(modalOpen) return;

    modalOpen = true;
    showModal(GL.React.createElement(PluginManager), {
        title: 'Manage Plugins',
        style: "width: 50%; height: 80%",
        closeOnBackgroundClick: true,
        buttons: [
            {
                text: "close",
                style: "primary"
            }
        ],
        onClosed: () => modalOpen = false
    })
}

export function addPluginButtons(loader: GimkitLoader) {
    // add a hotkey shift+p to open the plugin manager
    loader.hotkeys.add(new Set(['alt', 'p']), openPluginManager);
    
    // add the button to the creative screen and the host screen
    loader.parcel.interceptRequire(exports => exports?.default?.toString?.().includes('.disable?"none":"all"'), exports => {
        let native = exports.default;
        delete exports.default;

        exports.default = function() {
            const res = native.apply(this, arguments);

            if(res?.props?.className?.includes?.('light-shadow flex between')) {
                let nativeType = res.props.children[1].type.type;
                res.props.children[1].type.type = function() {
                    let res = nativeType.apply(this, arguments);

                    // make sure we haven't already added the button
                    if(res.props.children.some((c: any) => c?.props?.tooltip === 'Plugins')) return res;

                    let btnType = res.props.children[0].type;
                    res.props.children.splice(0, 0, loader.React.createElement(btnType, {
                        tooltip: 'Plugins',
                        children: loader.React.createElement('div', {
                            className: 'gl-wrench',
                            dangerouslySetInnerHTML: { __html: wrench }
                        }),
                        onClick: openPluginManager
                    }))

                    return res;
                }
            }
            
            if(res?.props?.children?.props?.tooltip === 'Options') {
                res.props.className = 'gl-row';

                let newBtn = res.props.children.type({
                    tooltip: 'Plugins',
                    children: loader.React.createElement('div', {
                        className: 'gl-wrench',
                        dangerouslySetInnerHTML: { __html: wrench }
                    }),
                    onClick: openPluginManager
                })

                res.props.children = [res.props.children, newBtn];
            }

            return res;
        }

        return exports;
    })

    // add the wrench button to the join screen
    loader.parcel.interceptRequire(exports => exports?.default?.toString?.().includes('type:"secondary"'), exports => {
        let nativeDefault = exports.default;
        delete exports.default;

        exports.default = function() {
            let res = nativeDefault.apply(this, arguments);

            let newButton = loader.React.createElement('button', {
                className: 'openPlugins',
                dangerouslySetInnerHTML: { __html: wrench },
                onClick: openPluginManager
            });

            return loader.React.createElement('div', { className: 'gl-join' }, [res, newButton]);
        }

        return exports;
    })

    // add the button to the home screen
    loader.parcel.interceptRequire(exports => exports?.SpaceContext, exports => {      
        let nativeDefault = exports.default;
        delete exports.default;

        exports.default = function(props: any, ...args: any[]) {
            let light = location.href.includes("/creative")
            
            if(props.children?.some?.((c: any) => c?.key === 'creative')) {
                let icon = loader.React.createElement('div', {
                    className: 'icon',
                    dangerouslySetInnerHTML: { __html: wrench }
                })
                let text = loader.React.createElement('div', {
                    className: "text"
                }, "Plugins")
                let newEl = loader.React.createElement('div', {
                    className: `gl-homeWrench ${light ? 'light' : ''}`,
                    onClick: openPluginManager
                }, [icon, text])

                props.children.splice(0, 0, newEl);
            }
            
            let res = nativeDefault.apply(this, [props, ...args]);

            return res;
        }

        return exports;
    })

    // add the button to the host screen before the game starts
    loader.parcel.interceptRequire(
        // the } is there for a reason
    exports => exports?.default?.toString?.().includes('customHorizontalPadding}'),
    exports => {
        let nativeDefault = exports.default;
        delete exports.default;

        exports.default = function() {
            let res = nativeDefault.apply(this, arguments);

            let btnContents = loader.React.createElement('div', {
                className: "gl-hostWrench"
            }, [
                loader.React.createElement('div', {
                    className: 'gl-wrench',
                    dangerouslySetInnerHTML: { __html: wrench }
                }),
                loader.React.createElement('div', {}, "Plugins")
            ])

            let newBtn = nativeDefault.apply(this, [{
                children: btnContents,
                onClick: openPluginManager,
                customColor: "#01579b",
                className: 'gl-hostWrenchBtn'
            }])

            let name = res?.props?.children?.props?.children?.[2]?.props?.children?.props?.children?.[1]
            if(name === 'Rewards') {
                res.props.children = [newBtn, res.props.children]
            }

            return res;
        }

        return exports;
    })

    // add the button to 1d host screens
    loader.parcel.interceptRequire(
    exports => exports?.default?.displayName?.includes?.('inject-with-gameOptions-gameValues-players-kit-ui'),
    exports => {
        let nativeRender = exports.default.render;
        delete exports.default.render;
        
        exports.default.render = function() {
            let res = nativeRender.apply(this, arguments);
            let nativeType = res.type;
            
            delete res.type;
            res.type = function() {
                let res = new nativeType(...arguments);
                
                let nativeRender = res.render;
                delete res.render;
                
                res.render = function() {
                    let res = nativeRender.apply(this, arguments);
                    
                    let newBtn = loader.React.createElement('button', {
                        className: 'gl-1dHostPluginBtn',
                        onClick: openPluginManager
                    }, 'Plugins')
                    
                    res.props.children = [newBtn, res.props.children];
                    
                    return res;
                }
                
                return res;
            }
            
            return res
        }
        
        return exports;
    })
    
    // add the button to the 1d host screen while in-game
    // we need to do this to intercept the stupid mobx wrapper which is a massive pain
    loader.parcel.interceptRequire(exports => exports?.__decorate, exports => {
        let nativeDec = exports.__decorate;
        delete exports.__decorate;

        exports.__decorate = function() {
            if(arguments[1]?.toString?.()?.includes("Toggle Music")) {
                let nativeRender = arguments[1].prototype.render;
                arguments[1].prototype.render = function() {
                    let res = nativeRender.apply(this, arguments);
                    let children = res.props.children[2].props.children.props.children

                    let newEl = loader.React.createElement(children[1].type, {
                        icon: loader.React.createElement('div', {
                            className: 'gl-1dHostGameWrench',
                            dangerouslySetInnerHTML: { __html: wrench }
                        }),
                        onClick: openPluginManager,
                        tooltipMessage: "Plugins"
                    })
                    
                    children.splice(0, 0, newEl);
                    
                    return res;
                }
            }

            return nativeDec.apply(this, arguments);
        }

        return exports;
    })

    // add the button to the 1d game screen
    loader.parcel.interceptRequire(exports => exports?.observer &&
    exports.Provider, exports => {
        let nativeObserver = exports.observer;
        delete exports.observer;

        exports.observer = function() {
            if(arguments[0]?.toString?.().includes('"aria-label":"Menu"')) {
                let nativeArgs = arguments[0];
                arguments[0] = function() {
                    let res = nativeArgs.apply(this, arguments);

                    // for when we're still on the join screen
                    if(res?.props?.children?.props?.children?.props?.src === '/client/img/svgLogoWhite.svg') {
                        let props = res.props.children.props

                        props.children = [props.children, loader.React.createElement('div', {
                            className: 'gl-1dGameWrenchJoin',
                            style: { cursor: 'pointer' },
                            dangerouslySetInnerHTML: { __html: wrench },
                            onClick: openPluginManager
                        })];

                        return res;
                    }
                    
                    let children = res?.props?.children?.[0]?.props?.children?.props?.children;
                    if(!children) return res;
                    
                    let newEl = loader.React.createElement(children[1].type, {
                        onClick: openPluginManager,
                    }, loader.React.createElement('div', {
                        className: 'gl-1dGameWrench',
                        dangerouslySetInnerHTML: { __html: wrench }
                    }))
                    
                    children.splice(3, 0, newEl)
                    
                    return res;
                }
            }

            return nativeObserver.apply(this, arguments);
        }
    })
}