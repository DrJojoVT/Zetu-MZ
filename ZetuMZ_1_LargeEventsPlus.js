/*:
 * @target MZ
 * @plugindesc Zetu MZ Large Events Plus
 * @author Zetu/DrJosephJorgen
 * @url https://github.com/DrJojoVT/Zetu-MZ
 * @help Help Text
 * 
 * @---------------------------------------------------------------
 *
 * @param CharacterSettings
 * @text Character Settings
 * @type struct<CharacterSetting>[]
 * @default []
 * 
 */
/*~struct~CharacterSetting:
 *
 * @param CharacterImage
 * @text Image
 * @type file
 * @dir img/characters
 * 
 * @param X
 * @text Width
 * @type number
 * @default 1
 * 
 * @param Y
 * @text Height
 * @type number
 * @default 1
 * 
 * @param ShiftY
 * @text Shift Y
 * @type number
 * @default 6
 *
 */

Zetu.setupHeader("ZetuMZ_1_LargeEventsPlus")
    .setNamespace("LargeEvents")
    .requires("ZetuMZ_0_Core");

Zetu.note.namespace("Large Events")
    .page(/SHIFT Y[:\s]+(\d+)/i, (page, shiftY) => {
        page.shiftY = parseInt(shiftY);
    })
    .page(/SIZE X[:\s]+(\d+)/i, (page, x) => {
        page.sizeX = parseInt(x);
    })
    .page(/SIZE Y[:\s]+(\d+)/i, (page, y) => {
        page.sizeY = parseInt(y);
    })
    .page(/SIZE XY[:\s]+(\d+)/i, (page, x, y) => {
        page.sizeX = parseInt(x);
        page.sizeY = parseInt(y);
    });



// #region Game_CharacterBase
Zetu.LargeEvents.GetOptions = function (characterImage) {
    return Zetu.LargeEvents.CharacterSettings
        .first(x => x.CharacterImage == characterImage);
};

(alias => Game_CharacterBase.prototype.initMembers = function () {
    alias.apply(this, arguments);
    this.setCharacterSize();
})(Game_CharacterBase.prototype.initMembers);

(alias => Game_CharacterBase.prototype.shiftY = function() {
    if (this.page && this.page() && this.page().shiftY) return this.page().shiftY;
    const options = Zetu.LargeEvents.GetOptions(this._characterName);
    if (options && options.ShiftY) return options.ShiftY;
    return alias.apply(this, arguments);
})(Game_CharacterBase.prototype.shiftY);

(alias => Game_CharacterBase.prototype.setImage = function() {
    alias.apply(this, arguments)
    this.setCharacterSize();
})(Game_CharacterBase.prototype.setImage);

(alias => Game_CharacterBase.prototype.setTileImage = function() {
    alias.apply(this, arguments);
    this.setCharacterSize();
})(Game_CharacterBase.prototype.setTileImage);

Game_CharacterBase.prototype.setCharacterSize = function () {
    const options = Zetu.LargeEvents.GetOptions(this._characterName);
    if (this._pageIndex != undefined && this.page()) {
        var sizeX = this.page().sizeX;
        var sizeY = this.page().sizeY;
    }
    if (!options) {
        this._sizeX = sizeX || 1;
        this._sizeY = sizeY || 1;
    } else {
        this._sizeX = sizeX || options.X;
        this._sizeY = sizeY || options.Y;
    }
};

(alias => Game_CharacterBase.prototype.isMapPassable = function(x, y, d) {
    // DOWN
    if (d == 2) {
        let y2 = y - 1 + this._sizeY;
        for (let x2 = x; x2 < x + this._sizeX; x2++) {
            if (!alias.call(this, x2, y2, d)) return false;
        }
    }
    // LEFT
    if (d == 4) {
        let x2 = x;
        for (let y2 = y; y2 < y + this._sizeY; y2++) {
            if (!alias.call(this, x2, y2, d)) return false;
        }
    }
    // RIGHT
    if (d == 6) {
        let x2 = x - 1 + this._sizeX;
        for (let y2 = y; y2 < y + this._sizeY; y2++) {
            if (!alias.call(this, x2, y2, d)) return false;
        }
    }
    // UP
    if (d == 8) {
        let y2 = y;
        for (let x2 = x; x2 < x + this._sizeX; x2++) {
            if (!alias.call(this, x2, y2, d)) return false;
        }
    }
    return true;
})(Game_CharacterBase.prototype.isMapPassable);

(alias => Game_CharacterBase.prototype.screenX = function() {
    const tw = $gameMap.tileWidth();
    return alias.call(this)
        + Math.floor((this._sizeX - 1) * tw / 2);
})(Game_CharacterBase.prototype.screenX);

(alias => Game_CharacterBase.prototype.screenY = function() {
    const tw = $gameMap.tileWidth();
    return alias.call(this)
        + Math.floor((this._sizeY - 1) * tw);
})(Game_CharacterBase.prototype.screenY);

(alias => Game_CharacterBase.prototype.pos = function(x, y) {
    if (alias.apply(this, arguments)) return true;
    // 10, 8
    // 9 - 3 + 1 = 7 <
    if (x < this._x) return false;
    if (y < this._y) return false;
    if (x >= this._x + this._sizeX) return false;
    if (y >= this._y + this._sizeY) return false;

    return true;
})(Game_CharacterBase.prototype.pos);
// #endregion