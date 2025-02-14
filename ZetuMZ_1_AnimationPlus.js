/*:
 * @target MZ
 * @plugindesc Zetu Animation Plus
 * @author Zetu/DrJosephJorgen
 * @help Help Text
 *
 * ---------------------------------------------------------------
 * 
 * @param CharacterSettings
 * @text Settings
 * @type struct<CharacterSetting>[]
 * @default []
 * 
 */
/*~struct~CharacterSetting:
 *
 * @param CharacterImage
 * @text Character Image
 * @type file
 * @dir img/characters
 * 
 * @param Frames
 * @text Frames
 * @type number
 * @min 1
 * @default 1
 * 
 */

Zetu.setupHeader("ZetuMZ_1_AnimationPlus")
    .setNamespace("AnimationPlus")
    .requires("ZetuMZ_0_Core");


(alias => Game_Event.prototype.setupPageSettings = function() {
    alias.apply(this, arguments);
    let options = Zetu.AnimationPlus.CharacterSettings
        .first(x => x.CharacterImage == this._characterName);
    this._isSpritestrip = options != null;
    if (this._isSpritestrip) {
        this._pattern = 0;
        this._originalPattern = 0;
        this._spritestripFrames = options.Frames;
        this._isBigCharacter = true;
        //this._spritestripDir = 0;
    }
})(Game_Event.prototype.setupPageSettings);

// #region Game_CharacterBase
(alias => Game_Character.prototype.maxPattern = function() {
    return this._isSpritestrip ? 
        this._spritestripFrames : 
        alias.apply(this, arguments);
})(Game_CharacterBase.prototype.maxPattern);

Game_Character.prototype.patternSpritestripStart = function () {
    this.patternSpritestrip(0);
};

Game_Character.prototype.patternSpritestripEnd = function () {
    this.patternSpritestrip(this._spritestripFrames - 1);
};

(alias => Game_CharacterBase.prototype.pattern = function() {
    if (this._isSpritestrip) return this._pattern;
    return alias.apply(this, arguments);
})(Game_CharacterBase.prototype.pattern);

Game_Character.prototype.patternSpritestrip = function (index) {
    const d = Math.sign(index - this._pattern);
    if (d == 0) {
        this._movementSuccess = true;
        return;
    };
    this._pattern += d;
    if (this.pattern() != index) {
        this._moveRouteIndex--;
    };
    this.resetStopCount();
    console.log(this.pattern(), d, index);
};

(alias => Game_CharacterBase.prototype.updatePattern = function() {
    if (this._isSpritestrip) return;
    alias.apply(this, arguments);
})(Game_CharacterBase.prototype.updatePattern);


// #endregion


// #region Sprite_Character
(alias => Sprite_Character.prototype.patternWidth = function() {
    if (this._character._isSpritestrip) {
        return Math.floor(this.bitmap.width / this._character._spritestripFrames);
    }
    return alias.apply(this, arguments);
})(Sprite_Character.prototype.patternWidth);

(alias => Sprite_Character.prototype.patternHeight = function() {
    if (this._character._isSpritestrip) {
        return this.bitmap.height;
    }
    return alias.apply(this, arguments);
})(Sprite_Character.prototype.patternHeight);

// (alias => Sprite_Character.prototype.characterPatternX = function() {
//     if (this._character._isSpritestrip) return 0;
//     return alias.apply(this, arguments);
// })(Sprite_Character.prototype.characterPatternX);

(alias => Sprite_Character.prototype.characterPatternY = function() {
    if (this._character._isSpritestrip) return 0;
    return alias.apply(this, arguments);
})(Sprite_Character.prototype.characterPatternY);
// #endregion

//set_frame_end()

// #region Sprite
Sprite.prototype.setAnimation = function (animation) {
    animation.duration ||= 60;
    animation.ticks ||= 0;
    animation.index ||= -1;
    animation.length ||= 1;

    this.__zanimation = animation;
    animation();
};

Sprite.prototype.addSpritestripAnimation = function (framesX, duration, pingpong = false) {
    return this.addCycleAnimation(framesX, 1, duration, pingpong);
};

Sprite.prototype.addCycleAnimation = function (framesX, framesY, duration, pingpong = false) {
    if (!framesX || framesX <= 0) throw new Error("Cannot cycle animation with 0 X-frames");
    if (!framesY || framesY <= 0) throw new Error("Cannot cycle animation with 0 Y-frames");
    if (this.bitmap._loadingState == "loading") {
        this.bitmap.addLoadListener(() => this.addCycleAnimation(...arguments));
        return;
    }
    var width = Math.floor(this.bitmap.width / framesX);
    var height = Math.floor(this.bitmap.height / framesY);
    
    var direction = 1;
    var length = framesX * framesY;
    var sprite = this;
    var animation = function () {
        if (!sprite.bitmap) return;
        if (animation.index >= length - 1) {
            if (pingpong) {
                direction = -1;
                animation.index--;
            } else {
                direction = 1;
                animation.index = -1;
            }
        } else if (animation.index <= 0 && direction < 0) {
            direction = 1;
            animation.index++;
        }
        animation.index += direction;
        let row = Math.floor(animation.index / framesX);
        let col = animation.index % framesX;
        sprite.setFrame(col * width, row * height, width, height);
    };
    animation.duration = duration;
    animation.pingpong = pingpong;
    animation.length = framesX * framesY;
    this.setAnimation(animation);
};

(alias => Sprite.prototype.update = function () {
    alias.apply(this, arguments);
    this.updateAnimation();
})(Sprite.prototype.update);

Sprite.prototype.updateAnimation = function () {
    // Overwritten if used by Sprite_Destination
    let animation = this.__zanimation;
    if (!animation) return;
    animation.ticks++;
    if (animation.ticks >= animation.duration) {
        animation();
        animation.ticks = 0;
    }
};
// #endregion