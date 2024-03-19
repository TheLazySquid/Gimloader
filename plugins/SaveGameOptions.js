/**
 * @name SaveGameOptions
 * @description Saves the options for hosting games in between sessions
 * @author TheLazySquid
 * @reloadRequired true
 */

let latest = null;
let loadValues = null;

function save() {
    if(!latest || !loadValues) return;

    localStorage.setItem(`sgo-${latest}`, JSON.stringify(loadValues));
}

// intercept the form so we can tell which gamemode is being selected
GL.parcel.interceptRequire("SaveGameOptions", exports => exports?.default?.toString?.()?.includes("descriptiveTags})"), exports => {
    GL.patcher.before("SaveGameOptions", exports, "default", (_, props) => {
        latest = props[0].title;
        let value = localStorage.getItem(`sgo-${latest}`);
        if(value) {
            loadValues = JSON.parse(value);
        } else {
            loadValues = {};
        }
        console.log("loaded saved values", loadValues)
    })
}, true)

// intercept form hooks
GL.parcel.interceptRequire("SaveGameOptions", exports => exports?.default?.toString?.()?.includes("hook.type"), exports => {
    GL.patcher.before("SaveGameOptions", exports, "default", (_, args) => {
        let key = args[0].hook.key;
        if(loadValues && loadValues[key] !== undefined) {
            args[0].hook.options.defaultValue = loadValues[key];
            args[0].state[key] = loadValues[key];
        }

        let nativeMod = args[0].modifyState;
        args[0].modifyState = function() {
            loadValues[key] = arguments[1]
            save();
            return nativeMod.apply(this, arguments);
        }
    })
}, true)

function interceptFormEl(_, args) {
    let key = args[0].title;
    
    if(loadValues && loadValues[key] !== undefined) {
        args[0].value = loadValues[key];
    }
    
    let nativeMod = args[0].onValueChanged;
    args[0].onValueChanged = function() {
        loadValues[key] = arguments[0];
        save();
        return nativeMod.apply(this, arguments);
    }
}

// intercept form sliders
GL.parcel.interceptRequire("SaveGameOptions", exports => exports?.default?.toString?.()?.includes('transform:"scale(1.1)"'), exports => {
    GL.patcher.before("SaveGameOptions", exports, "default", interceptFormEl);
}, true)

// intercept form textboxes
GL.parcel.interceptRequire("SaveGameOptions", exports => exports?.default?.toString?.()?.includes('"large",formatter'), exports => {
    GL.patcher.before("SaveGameOptions", exports, "default", interceptFormEl);
}, true)

// intercept the game goal
GL.parcel.interceptRequire("SaveGameOptions", exports => exports?.default?.toString?.()?.includes('children:"Game Goal"'), exports => {
    GL.patcher.before("SaveGameOptions", exports, "default", (_, args) => {        
        if(loadValues && loadValues.goal !== undefined) {
            args[0].goal = loadValues.goal;
        }
        
        if(loadValues && loadValues.value !== undefined) {
            args[0].value = loadValues.value;
        }
        
        let nativeValChange = args[0].onValueChanged;
        args[0].onValueChanged = function() {
            loadValues.value = arguments[0];
            save();
            return nativeValChange.apply(this, arguments);
        }
        
        let nativeGoalChange = args[0].onGoalChanged;
        args[0].onGoalChanged = function() {
            loadValues.goal = arguments[0];
            save();
            return nativeGoalChange.apply(this, arguments);
        }
    });
}, true)

export function onStop() {
    GL.parcel.stopIntercepts("SaveGameOptions")
    GL.patcher.unpatchAll("SaveGameOptions")
}