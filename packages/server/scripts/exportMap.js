// This script needs to be run in the console before joining a Gimkit 2D game with Gimloader installed to work.

(function() {
    let exported = {};
    let completed = 0;
    let tasks = 3;
    const advanceCompleted = () => {
        completed++;
        if(completed === tasks) console.log(exported);
    }

    GL.net.onLoad("ExportMap", () => {
        // map style
        exported.mapStyle = GL.stores.session.mapStyle;

        // code grids
        let codeGrids = GL.net.room.state.world.devices.codeGrids;
        exported.codeGrids = {};

        for(let [deviceId, value] of codeGrids.entries()) {
            exported.codeGrids[deviceId] = {};
            for(let [id, grid] of value.items.entries()) {
                exported.codeGrids[deviceId][id] = {
                    json: JSON.parse(grid.json),
                    triggerType: grid.triggerType,
                    triggerValue: grid.triggerValue,
                    createdAt: grid.createdAt,
                    updatedAt: grid.updatedAt
                }
            }
        }

        advanceCompleted();
    });

    // terrain
    GL.net.once("TERRAIN_CHANGES", ({ added: { terrains, tiles } }) => {
        exported.tiles = [];

        for(let tile of tiles) {
            // lengthX and lengthY aren't height and width, it's two lines rather than a rectangle
            let [x, y, terrain, collides, depth, lengthX, lengthY] = tile;
            terrain = terrains[terrain];
            collides = collides === 1;

            let tileInfo = { x, y, terrain, collides, depth };
            exported.tiles.push(tileInfo);

            if(lengthX) {
                for(let x = 1; x <= lengthX; x++) {
                    exported.tiles.push({ ...tileInfo, x: tileInfo.x + x });
                }
            }
            
            if(lengthY) {
                for(let y = 1; y <= lengthY; y++) {
                    exported.tiles.push({ ...tileInfo, y: tileInfo.y + y });
                }
            }
        }

        advanceCompleted();
    });

    // devices
    GL.net.once("WORLD_CHANGES", ({ devices: { addedDevices: { devices, values } } }) => {
        exported.devices = [];

        for(let device of devices) {
            let getValue = (index) => values[index];
            let [id, x, y, depth, layer, deviceId, options] = device;
            layer = getValue(layer);
            deviceId = getValue(deviceId);
            options = Object.fromEntries(options.map(([k, v]) => [getValue(k), getValue(v)]));
            exported.devices.push({ id, x, y, depth, layer, deviceId, options });
        }

        advanceCompleted();
    });

    window.exported = exported;
})();