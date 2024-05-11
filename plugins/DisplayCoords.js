/**
 * @name DisplayCoords
 * @description Display the coordinates of the player on the screen in 2d gamemodes
 * @author TheLazySquid
 * @version 0.1.0
 * @downloadUrl https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/plugins/DisplayCoords.js
 */

let updateInterval, displayDiv;

GL.UI.addStyles('DisplayCoords', `
#dc-coords {
    position: fixed;
    top: 8px;
    right: 8px;
    color: white;
    font-size: 14px;
    border-radius: 5px;
    padding: 5px;
    z-index: 1000;
    background-color: rgba(255, 255, 255, 0.8);
    color: black;
}`)

function createHud() {
    if(GL.net.type !== "Colyseus") return
    
    displayDiv = document.createElement('div')
    displayDiv.id = 'dc-coords'
    document.body.appendChild(displayDiv)
    
    updateInterval = setInterval(() => {
        let coords = GL?.stores?.phaser?.mainCharacter?.body
        if(!coords) return
        displayDiv.innerHTML = `X: ${Math.round(coords.x)} Y: ${Math.round(coords.y)}`
    }, 1000 / 30)
}

if(GL.net.type === "Colyseus") createHud()
else GL.addEventListener('loadEnd', createHud)

export function onStop() {
    GL.UI.removeStyles('DisplayCoords')
    clearInterval(updateInterval)
    if(displayDiv) displayDiv.remove()
}