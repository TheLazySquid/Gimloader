import { Schema, type, ArraySchema } from "@colyseus/schema";

export class Appearance extends Schema {
    @type("string") skinId = "character_default_browngreen";
    @type("string") tintModifierId = "";
    @type("string") trailId = "";
    @type("string") transparencyModifierId = "";
}

export class Assignment extends Schema {
    @type("boolean") hasSavedProgress = false;
}

export class Health extends Schema {
    @type("boolean") classImmunityActive = false;
    @type("number") fragility = 0;
    @type("number") health = 50;
    @type("number") maxHealth = 50;
    @type("number") maxShield = 50;
    @type("number") shield = 50;
    @type("boolean") spawnImmunityActive = false;
}

export class Physics extends Schema {
    @type("boolean") isGrounded = true;
}

export class Projectiles extends Schema {
    @type("number") aimAngle = 0;
    @type("number") damageMultiplier = 1;
}

export class Permissions extends Schema {
    @type("boolean") adding = true;
    @type("boolean") editing = true;
    @type("boolean") manageCodeGrids = true;
    @type("boolean") removing = true;
}

export class Xp extends Schema {
    @type("number") unredeemedXp = 0;
}

export class Inventory extends Schema {
    @type("number") activeInteractiveSlot = 0;
    @type("boolean") infiniteAmmo = true;
    @type("number") maxSlots = 999;
    // no it's not but I really don't care
    @type([ "number" ]) interactiveSlots = [];
    @type([ "number" ]) interactiveSlotsOrder = [];
    @type([ "number" ]) slots = [];
}

export class Ghost extends Schema {
    @type("string") activeClassDeviceId = "";
    @type(Appearance) appearance = new Appearance();
    @type(Assignment) assignment = new Assignment();
    @type("boolean") completedInitialPlacement = true;
    @type(Health) health = new Health();
    @type("string") id = "197823782908137123";
    @type(Inventory) inventory = new Inventory();
    @type("boolean") isActive = true;
    @type("boolean") isRespawning = true;
    @type("number") movementSpeed = 310;
    @type("string") name = "Ghost";
    @type("string") openDeviceUI = "";
    @type("number") openDeviceUIChangeCounter = 0;
    @type(Permissions) permissions = new Permissions();
    @type("boolean") phase = false;
    @type(Physics) physics = new Physics();
    @type(Projectiles) projectiles = new Projectiles();
    @type("number") roleLevel = 50;
    @type("number") score = 0;
    @type("string") teamId = "__NO_TEAM_ID";
    @type("number") teleportCount = 0;
    @type("string") type = "player";
    @type("number") x = 0;
    @type(Xp) xp = new Xp();
    @type("number") y = 0;
}