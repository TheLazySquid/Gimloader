# Official Libraries

You probably won't have to think about libraries unless you are making a plugin. Libraries let plugins use common code without having to copy it into every plugin.

## DLDUtils [code](./DLDUtils.js)

This library disables the server snapping back the player, causing desync and allowing for physics modifications.

## GamemodeDetector [code](./GamemodeDetector.js)

This library detects which official gamemode (if any) the player is currently in. Gamemode values: `Don't Look Down`, `Fishtopia`, `Capture The Flag`, `Knockback`, `Dig It Up`, `One Way Out`, `Snowbrawl`, `Blastball`, `Snowy Survival`, `Tag`, and `Farmchain`. The gamemode can be accessed with GL.lib("GamemodeDetector").currentGamemode().