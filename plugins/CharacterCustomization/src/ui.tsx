import type CosmeticChanger from "./cosmeticChanger";

export default function UI({ cosmeticChanger, onSubmit }: {
    cosmeticChanger: CosmeticChanger,
    onSubmit: (callback: () => void) => void
}) {
    const React = GL.React;

    let [skinType, setSkinType] = React.useState(cosmeticChanger.skinType);
    let [skinId, setSkinId] = React.useState(cosmeticChanger.skinId);
    let [trailType, setTrailType] = React.useState(cosmeticChanger.trailType);
    let [trailId, setTrailId] = React.useState(cosmeticChanger.trailId);
    let [customSkinFile, setCustomSkinFile] = React.useState<File | null>(cosmeticChanger.customSkinFile);
    
    onSubmit(() => {
        cosmeticChanger.setSkin(skinType, skinId, customSkinFile);
        cosmeticChanger.setTrail(trailType, trailId);
    })

    const uploadSkinClick = () => {
        let input = document.createElement("input");
        input.type = "file";
        input.accept = ".png";

        input.onchange = () => {
            let file = input.files?.[0];
            if(!file) {
                setCustomSkinFile(null);
            } else {
                setCustomSkinFile(file);
            }
        }

        input.click();
    }

    return (<div className="characterCustomization">
        <h1>Skin</h1>
        <div className="row">
            <select value={skinType} onChange={(e) => setSkinType(e.target.value)}>
                <option value="default">Unchanged</option>
                <option value="id">Any Skin By ID</option>
                <option value="custom">Custom Skin</option>
            </select>
            { skinType === "id" && <input
            onKeyDown={(e) => e.stopPropagation()}
            value={skinId} onChange={(e) => setSkinId(e.target.value)}
            type="text" placeholder="Skin ID" />} 
            { skinType === "custom" && <button onClick={uploadSkinClick}>
                Current: {customSkinFile ? customSkinFile.name : "None"}.
                Upload skin
            </button>}
        </div>

        <h1>Trail</h1>
        <div className="row">
            <select value={trailType} onChange={(e) => setTrailType(e.target.value)}>
                <option value="default">Unchanged</option>
                <option value="id">Any Trail By ID</option>
            </select>
            { trailType === "id" && <input
            onKeyDown={(e) => e.stopPropagation()}
            value={trailId} onChange={(e) => setTrailId(e.target.value)}
            type="text" placeholder="Trail ID" />}
        </div>
    </div>)
}