/**
 * @name GamemodeDetector
 * @description Detects which official 2d gamemode the player is in
 * @author TheLazySquid
 * @version 0.1.0
 * @downloadUrl https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/libraries/GamemodeDetector.js
 * @isLibrary true
 */

const gamemodeMusic = {
    "Don't Look Down": '/assets/map/modes/dontLookDown/music.mp3',
    "Fishtopia": '/assets/map/music/fishtopia/music.mp3',
    "Capture The Flag": '/assets/map/music/ctf/music.mp3',
    "Knockback": '/assets/map/modes/knockback/music.mp3',
    "Dig It Up": '/assets/map/modes/mining/music.mp3',
    "One Way Out": '/assets/map/modes/oneWayOut/music.mp3',
    "Snowbrawl": '/assets/map/modes/snowbrawl/music.mp3',
    "Blastball": '/assets/map/modes/blastball/sound/music.mp3',
    "Snowy Survival": '/assets/map/modes/snowInfection/music.mp3',
    "Tag": '/assets/map/music/tag/music.mp3',
    "Farmchain": '/assets/map/modes/farm/music.mp3'
}

export function currentGamemode() {
    let optionsJson = GL.stores?.world?.mapOptionsJSON;
    if(!optionsJson) return null;

    let music = JSON.parse(optionsJson).musicUrl;
    for(let gamemode in gamemodeMusic) {
        if(music === gamemodeMusic[gamemode]) return gamemode;
    }

    return null;
}