import { Schema, ArraySchema, MapSchema, type } from "@colyseus/schema";

class Hooks extends Schema {
    @type("string") hookJSON: string;
}

class Matchmaker extends Schema {
    @type("string") gameCode: string;
}

class Physics extends Schema {
    @type("boolean") isGrounded: boolean;
}

class ZoneAbilitiesOverrides extends Schema {
    @type("boolean") allowWeaponFire: boolean;
    @type("boolean") allowWeaponDrop: boolean;
    @type("boolean") allowItemDrop: boolean;
    @type("boolean") allowResourceDrop: boolean;
}

class Projectiles extends Schema {
    @type("number") aimAngle: number;
    @type("number") damageMultiplier: number;
}

class Health extends Schema {
    @type("number") fragility: number;
    @type("number") health: number;
    @type("number") shield: number;
    @type("number") maxHealth: number;
    @type("number") maxShield: number;
    @type("boolean") spawnImmunityActive: boolean;
    @type("boolean") classImmunityActive: boolean;
    @type("boolean") showHealthBar: boolean;
}

class Assignment extends Schema {
    @type("number") percentageComplete: number;
    @type("string") objective: string;
    @type("boolean") hasSavedProgress: boolean;
}

class Xp extends Schema {
    @type("number") unredeemedXP: number;
}

class InteractiveSlotsItem extends Schema {
    @type("string") itemId: string;
    @type("boolean") waiting: boolean;
    @type("number") waitingStartTime: number;
    @type("number") waitingEndTime: number;
    @type("number") currentClip: number;
    @type("number") clipSize: number;
    @type("number") durability: number;
    @type("number") count: number;
}

class SlotsItem extends Schema {
    @type("number") amount: number;
}

class Inventory extends Schema {
    @type({ map: SlotsItem }) slots = new MapSchema<SlotsItem>();
    @type("number") maxSlots: number;
    @type("number") activeInteractiveSlot: number;
    @type({ map: InteractiveSlotsItem }) interactiveSlots = new MapSchema<InteractiveSlotsItem>();
    @type([ "number" ]) interactiveSlotsOrder = new ArraySchema<number>();
    @type("boolean") infiniteAmmo: boolean;
}

class Permissions extends Schema {
    @type("boolean") adding: boolean;
    @type("boolean") removing: boolean;
    @type("boolean") editing: boolean;
    @type("boolean") manageCodeGrids: boolean;
}

class Appearance extends Schema {
    @type("string") skin: string;
    @type("string") trailId: string;
    @type("string") transparencyModifierId: string;
    @type("string") tintModifierId: string;
}

class ClassDesigner extends Schema {
    @type("string") lastActivatedClassDeviceId: string;
    @type("number") lastClassDeviceActivationId: number;
}

class CharactersItem extends Schema {
    @type("string") id: string;
    @type("string") teamId: string;
    @type("string") name: string;
    @type("string") type: string;
    @type("boolean") isActive: boolean;
    @type("number") roleLevel: number;
    @type("number") x: number;
    @type("number") y: number;
    @type("number") scale: number;
    @type("number") teleportCount: number;
    @type("number") movementSpeed: number;
    @type("boolean") phase: boolean;
    @type("string") openDeviceUI: string;
    @type("number") openDeviceUIChangeCounter: number;
    @type("boolean") completedInitialPlacement: boolean;
    @type("boolean") isRespawning: boolean;
    @type("number") score: number;
    @type(ClassDesigner) classDesigner: ClassDesigner = new ClassDesigner();
    @type(Appearance) appearance: Appearance = new Appearance();
    @type(Permissions) permissions: Permissions = new Permissions();
    @type(Inventory) inventory: Inventory = new Inventory();
    @type(Xp) xp: Xp = new Xp();
    @type(Assignment) assignment: Assignment = new Assignment();
    @type(Health) health: Health = new Health();
    @type(Projectiles) projectiles: Projectiles = new Projectiles();
    @type(ZoneAbilitiesOverrides) zoneAbilitiesOverrides: ZoneAbilitiesOverrides = new ZoneAbilitiesOverrides();
    @type(Physics) physics: Physics = new Physics();
}

class ItemsItem extends Schema {
    @type("string") triggerType: string;
    @type("string") triggerValue: string;
    @type("string") json: string;
    @type("string") owner: string;
    @type([ "string" ]) visitors = new ArraySchema<string>();
    @type("number") createdAt: number;
    @type("number") updatedAt: number;
}

class CodeGridsItem extends Schema {
    @type({ map: ItemsItem }) items = new MapSchema<ItemsItem>();
}

class Devices extends Schema {
    @type({ map: CodeGridsItem }) codeGrids = new MapSchema<CodeGridsItem>();
}

class World extends Schema {
    @type("number") width: number;
    @type("number") height: number;
    @type(Devices) devices: Devices = new Devices();
}

class TeamsItem extends Schema {
    @type("string") id: string;
    @type("string") name: string;
    @type("number") score: number;
    @type([ "string" ]) characters = new ArraySchema<string>();
}

class GlobalPermissions extends Schema {
    @type("boolean") adding: boolean;
    @type("boolean") removing: boolean;
    @type("boolean") editing: boolean;
    @type("boolean") manageCodeGrids: boolean;
}

class CategoriesItem extends Schema {
    @type("string") id: string;
    @type("string") name: string;
    @type("string") plural: string;
}

class CallToActionItem extends Schema {
    @type("string") id: string;
    @type("string") category: string;
    @type("string") name: string;
    @type("string") url: string;
}

class CallToAction extends Schema {
   @type([ CategoriesItem ]) categories = new ArraySchema<CategoriesItem>();
   @type([ CallToActionItem ]) items = new ArraySchema<CallToActionItem>();
}

class GameSession extends Schema {
    @type("string") phase: string;
    @type("number") countdownEnd: number;
    @type("number") resultsEnd: number;
    @type(CallToAction) callToAction: CallToAction = new CallToAction();
}

class Session extends Schema {
    @type("string") version: string;
    @type("string") modeType: string;
    @type("string") gameOwnerId: string;
    @type("number") gameTime: number;
    @type("string") phase: string;
    @type("boolean") loadingPhase: boolean;
    @type(GameSession) gameSession: GameSession = new GameSession();
    @type(GlobalPermissions) globalPermissions: GlobalPermissions = new GlobalPermissions();
    @type("number") mapCreatorRoleLevel: number;
    @type("boolean") cosmosBlocked: boolean;
    @type("boolean") allowGoogleTranslate: boolean;
    @type("string") mapStyle: string;
}

export default class GimkitState extends Schema {
    @type(Session) session: Session = new Session();
    @type([ TeamsItem ]) teams = new ArraySchema<TeamsItem>();
    @type(World) world: World = new World();
    @type({ map: CharactersItem }) characters = new MapSchema<CharactersItem>();
    @type("string") mapSettings: string;
    @type(Matchmaker) matchmaker: Matchmaker = new Matchmaker();
    @type(Hooks) hooks: Hooks = new Hooks();
}