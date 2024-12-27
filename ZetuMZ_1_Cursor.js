/*:
 * @target MZ
 * @plugindesc Zetu Cursor Script
 * @author Zetu/DrJosephJorgen
 * @help Help Text
 *
 * ---------------------------------------------------------------
 * 
 * @param Cursors
 * @text Cursors
 * @help Custom Cursors for miscellaneous uses. First cursor is default. Do not duplicate images of cursors. Must be in the system\Cursor folder.
 * @type struct<Cursor>[]
 * @default []
 * 
 */
/*~struct~Cursor:
 *
 * @param CursorImage
 * @text Image
 * @type file
 * @dir img/system/Cursor
 * 
 * @param Ox
 * @text X Offset
 * @type number
 * @default 0
 * 
 * @param Oy
 * @text Y Offset
 * @type number
 * @default 0
 * 
 * @param AnimationEnabled
 * @text Enable Animations
 * @type boolean
 * @default false
 * 
 * @param AnimationFrames
 * @text Spritesheet Frames
 * @type number
 * @default 1
 * @parent AnimationEnabled
 * 
 * @param AnimationDuration
 * @text Spritesheet Duration (100 = 1 second)
 * @type number
 * @default 12
 * @parent AnimationEnabled
 * 
 * @param AnimationPingPong
 * @text Ping Pong Animation
 * @type boolean
 * @default false
 * @parent AnimationEnabled
 * 
 */
Zetu.setupHeader("ZetuMZ_1_Cursor")
    .setNamespace("Cursor")
    .requires("ZetuMZ_0_Core");

Zetu.note.namespace("cursor")
    .page(/ON HOVER[:\s](.+)/i, (page, cursor) => {
        page.cursorHover = cursor;
    })
    .page(/INTERACT DISTANCE[:\s](\d+)/i, (page, distance, ...options) => {
        distance = parseInt(distance);
        page.cursorTriggerDistance = distance;
        page.cursorTriggerDiatanceDiagnal = Zetu.arrayGetNoteParameters(options, /DIAGNAL/i);
    })
    .page(/EXTRA HITBOX ([A-Z]+)[:\s](\d+)/, (page, type, number) => {
        number = parseInt(number);
        type = type.toUpperCase();
        page.cursorHitbox ||= {};
        page.cursorHitbox[type] = number;
    });

Zetu.Cursor.DisableStyle = new CSSStyleSheet();
Zetu.Cursor.DisableStyle.replaceSync('* { cursor: none; }');
document.adoptedStyleSheets = [Zetu.Cursor.DisableStyle];


// #region Sprite_Cursor
function Sprite_Cursor () {
    this.initialize(...arguments);
}

Sprite_Cursor.prototype = Object.create(Sprite.prototype);
Sprite_Cursor.prototype.constructor = Sprite_Cursor;

Sprite_Cursor.prototype.initialize = function (options) {
    Sprite.prototype.initialize.call(this);
    this.bitmap = ImageManager.loadSystem(options.CursorImage);
    this.ox = options.Ox;
    this.oy = options.Oy;
    this.name = options.CursorImage.split('/').last();
    if (options.AnimationEnabled) {
        const frames = options.AnimationFrames;
        const duration = options.AnimationDuration;
        const pingpong = options.AnimationPingPong;
        this.addSpritestripAnimation(frames, duration, pingpong);
    }
};

Sprite_Cursor.prototype.update = function () {
    Sprite.prototype.update.call(this);
    this.updatePosition();
};

Sprite_Cursor.prototype.updatePosition = function () {
    this.x = TouchInput.x - this.ox;
    this.y = TouchInput.y - this.oy;
};
// #endregion

// #region Spriteset_Cursor
function Spriteset_Cursor() {
    this.initialize(...arguments);
}

Spriteset_Cursor.prototype = Object.create(Sprite.prototype);
Spriteset_Cursor.prototype.constructor = Spriteset_Cursor;

Spriteset_Cursor.prototype.initialize = function () {
    Sprite.prototype.initialize.call(this);
    this.zIndex = 999;
    this.cursors = [];
    this.default = null;
    this.hover = null;
    Zetu.Cursor.Cursors.forEach(options => {
        var cursor = this.generateCursor(options);
        if (!this.default) {
            this.default = cursor;
            this.addChild(cursor);
        }
        this.cursors.push(cursor);
    });
};

Spriteset_Cursor.prototype.generateCursor = function (options) {
    return new Sprite_Cursor(options);
};

Spriteset_Cursor.prototype.update = function () {
    this.updateHover();
    this.updateActiveCursor();
    Sprite.prototype.update.call(this);
};

Spriteset_Cursor.prototype.updateHover = function () {
    var cursor;
    if (SceneManager._scene instanceof Scene_Map) {
        const events = $gameMap.eventsMouseHover();
        events.forEach(event => cursor ||= event.page().cursorHover);
    }
    if (!cursor) this.hover = null;
    else if (!this.hover || this.hover.name != cursor) this.hover = this.getCursorByName(cursor);
};

Spriteset_Cursor.prototype.updateActiveCursor = function () {
    const current = this.cursorMode() || this.hover || this.default;
    if (this.active !== current) {
        this.removeChild(this.active);
        this.addChild(this.active = current);
    }
};

Spriteset_Cursor.prototype.cursorMode = function () {
    return null;
};

Spriteset_Cursor.prototype.getCursorByName = function (cursorName) {
    return this.cursors.first(cursor => cursor.name == cursorName);
};

Spriteset_Cursor.prototype.destroy = function () {
    // don't
};

$gameCursor = new Spriteset_Cursor();
// #endregion

(alias => Scene_Base.prototype.create = function () {
    alias.apply(this, arguments);
    this.sortableChildren = true;
    this.addChild($gameCursor);
})(Scene_Base.prototype.create);

(alias => Scene_Map.prototype.onMapTouch = function() {
    let events = $gameMap.eventsMouseHover()
    if (events.length > 0) {
        let event = events[0];
        $gameTemp.setDestination(event.x, event.y);
    } else {
        alias.apply(this, arguments);
    }
})(Scene_Map.prototype.onMapTouch);

// (alias => Window_Message.prototype.terminateMessage = function() {
//     alias.apply(this, arguments);
//     TouchInput._currentState.triggered = false;
//     TouchInput._clicked = false;
// })(Window_Message.prototype.terminateMessage);

Game_Map.prototype.eventsMouseHover = function() {
    return this.events().filter(event => event.isHovered())
        .sort((b,a) => a.y - b.y);
};

Game_CharacterBase.prototype.isHovered = function() {
    var spriteset = SceneManager._scene._spriteset;
    const scaleX = spriteset.scale.x;
    const scaleY = spriteset.scale.y;
    let width = $gameMap.tileWidth() * scaleX;
    let height = $gameMap.tileHeight() * scaleY;
    let left = (this._realX - $gameMap.displayX()) * width;
    let top = (this._realY - $gameMap.displayY()) * height;

    if (this._eventId && this.page()) {
        var hb = this.page().cursorHitbox;
        if (hb) {
            var x;
            if (x = hb["TOP"]) {
                top -= x * scaleY;
                height += x * scaleY;
            }
            if (x = hb["LEFT"]) {
                left -=  x * scaleX;
                width += x * scaleX;
            }
            if (x = hb["BOTTOM"]) {
                height += x * scaleY;
            }
            if (x = hb["RIGHT"]) {
                width += x * scaleX;
            }
        }
    }

    if (left > TouchInput.x) return false;
    if (top > TouchInput.y) return false;
    if (left + width < TouchInput.x) return false;
    if (top + height < TouchInput.y) return false;
    return true;
};

// #region Game_Player
(alias => Game_Player.prototype.triggerTouchAction = function (){
    if (alias.apply(this)) return true;
    const validEvents = this.touchEventsRanged();
    if (validEvents.length == 0) return false;
    for (let i = 0; i < validEvents.length; i++) {
        // run event
        this.checkEventTriggerRanged(validEvents[i])
        return $gameMap.setupStartingEvent();
    }
    return false;
})(Game_Player.prototype.triggerTouchAction);

(alias => Game_Player.prototype.moveByInput = function() {
    if ($gameTemp.isDestinationValid()) {
        const validEvents = this.touchEventsRanged();
        if (validEvents.length > 0) return;
    }
    alias.call(this);
})(Game_Player.prototype.moveByInput);

Game_Player.prototype.touchEventsRanged = function() {
    const x1 = this.x;
    const y1 = this.y;
    const destX = $gameTemp.destinationX();
    const destY = $gameTemp.destinationY();
    const distanceOrthoganal = Math.abs(x1 - destX) + Math.abs(y1 - destY);
    const distanceDiagnal = Math.max(Math.abs(x1 - destX), Math.abs(y1 - destY));
    const validEvents = $gameMap.eventsXy(destX, destY).filter(event => {
        var page = event.page();
        if (!page.cursorTriggerDistance) return false;
        var distance = page.cursorTriggerDiatanceDiagnal ? distanceDiagnal : distanceOrthoganal;
        return page.cursorTriggerDistance >= distance;
    });
    return validEvents;
};

Game_Player.prototype.checkEventTriggerRanged = function (event) {
    if (this.canStartLocalEvents()) {
        this.startMapEvent(event.x, event.y, [0], true);
        this.startMapEvent(event.x, event.y, [0], false);
    }
};
// #endregion