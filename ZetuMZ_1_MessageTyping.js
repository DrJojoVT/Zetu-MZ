/*:
 * @target MZ
 * @plugindesc Zetu's Message Typing
 * @author Zetu/DrJosephJorgen
 * @help NOTE GUIDE
 * Use \TYPESE using the Friendly-Name assigned in parameters to start the typing sound. Leave blank to stop typing sounds.
 * 
 * 
 * @param Sounds
 * @type struct<SoundSettings>[]
 * @desc Audio Setting for Typing
 * 
 */
/*~struct~SoundSettings:
 * 
 * @param Name
 * @text User Friendly Name
 * @type string
 * @desc User Friendly Name to use in \TYPESE[x] command
 * 
 * @param Sounds
 * @text Sounds
 * @type struct<Sound>[]
 * @desc Files for sounds, and their settings
 * 
 * @param SelectionMethod
 * @text Audio Selection Method
 * @type select
 * @option In Order
 * @value InOrder
 * @option Ping Pong
 * @value PingPong
 * @option Random
 * @value Random
 * @option Random (No Direct Repeats)
 * @value RandomNew
 * @default InOrder
 * @desc How to determine what audio file to play.
 * 
 */
/*~struct~Sound:
 *
 * @param File
 * @text Sound File
 * @type file
 * @dir audio/se
 * @desc Location of Sound Effect
 * 
 * @param Volume
 * @text Volume
 * @type number
 * @min 0
 * @max 100
 * @default 90
 * 
 * @param VolumeVariance
 * @text Volume Variance
 * @type number
 * @min 0
 * @default 0
 * 
 * @param Pitch
 * @text Pitch
 * @type number
 * @min 50
 * @max 150
 * @default 100
 * 
 * @param PitchVariance
 * @text Pitch Variance
 * @type number
 * @min 0
 * @default 0
 * 
 * @param Pan
 * @text Pan
 * @min -100
 * @max 100
 * @default 0
 * 
 * @param PanVariance
 * @text Pan Variance
 * @type number
 * @min 0
 * @default 0
 * 
 * @param Delay
 * @text Delay
 * @type number
 * @min 1
 * @default 4
 * 
 * @param DelayVariance
 * @text Delay Variance
 * @type number
 * @min 0
 * @default 0
 * 
 */

Zetu.setupHeader("ZetuMZ_1_MessageTyping")
    .setNamespace("TypingSE")
    .requires("ZetuMZ_0_Core");

const GetSound = function (friendlyName) {
    if (!friendlyName) return null;
    for (let i = 0; i < Zetu.TypingSE.Sounds.length; i++) {
        var sound = Zetu.TypingSE.Sounds[i];
        console.log(friendlyName);
        if (friendlyName.toUpperCase() == sound.Name.toUpperCase()) {
            console.log(sound);
            return Zetu.extend({}, sound, {
                Time: 0,
                LastIndex: -1,
                NextIndex: 0
            });
        }
    }
    return null;
};

const Variance = function (initial, variance) {
    var r = Math.floor((1 + 2* variance)*Math.random());
    var n = initial + r - variance;
    return n;
};

// const LastTime = function (se) {
//     if (!se) return 0;
//     console.log(se);
//     var audio = se.Sounds[se.LastIndex];
//     return Variance(audio.Delay, audio.DelayVariance);
// }

(alias => Window_Message.prototype.startMessage = function() {
    alias.apply(this, arguments);
    console.log(null);
    this.currentTypingSE = null;
})(Window_Message.prototype.startMessage);

(alias => Window_Message.prototype.updateMessage = function () {
    let updated = alias.apply(this, arguments);
    console.log(this.currentTypingSE);
    if (this.currentTypingSE) {
        if (this.isWaiting()) this.currentTypingSE.Time = 0;
        if (updated && this.currentTypingSE.Time-- <= 0 && !this.isWaiting()) {
            var se = this.typingSoundAudio();
            AudioManager.playTypingSe(se, this.currentTypingSE.Name);
            var se2 = se.Sounds[se.LastIndex];
            this.currentTypingSE.Time = Variance(se2.Delay, se2.DelayVariance);
        }
    }
    return updated;
})(Window_Message.prototype.updateMessage);

Window_Message.prototype.typingSoundAudio = function () {
    if (!this.currentTypingSE) return null;
    var se = this.currentTypingSE;
    var audio = se.Sounds[se.NextIndex];
    let lastIndex = se.LastIndex;
    se.LastIndex = se.NextIndex;
    switch (se.SelectionMethod) {
        case "InOrder":
            se.NextIndex++;
            break;
        case "PingPong":
            if (se.NextIndex > lastIndex) {
                se.NextIndex++;
            } else {
                se.NextIndex--;
            }
            break;
        case "Random":
            se.NextIndex = Zetu.random(0, se.Sounds.length);
            break;
        case "RandomNew":
            se.NextIndex = Zetu.random(0, se.Sounds.length - 1);
            if (lastIndex >= se.NextIndex) se.NextIndex++;
            break;
    }
    se.NextIndex %= se.Sounds.length;
    return {
        name: audio.File,
        volume: Variance(audio.Volume, audio.VolumeVariance),
        pitch: Variance(audio.Pitch, audio.PitchVariance),
        pan: Variance(audio.Pan, audio.PanVariance)
    }
}

Window_Message.prototype.processTypingSEChange = function (friendlyName) {
    console.log(friendlyName);
    var se = GetSound(friendlyName);
    console.log(se);
    if (this.currentTypingSE 
        && this.currentTypingSE.friendlyName == se.friendlyName) 
    {
        return;
    } else if (se) {
        this.currentTypingSE = se;
    } else {
        this.currentTypingSE = null;
    }
}

(alias => Window_Base.prototype.processEscapeCharacter = function(code, textState) {
    alias.call(this, ...arguments);
    switch (code) {
        case "TYPESE":
            var friendlyName = this.obtainEscapeParamText(textState);
            console.log(friendlyName);
            this.processTypingSEChange(friendlyName);
            break;
    }
})(Window_Base.prototype.processEscapeCharacter);

Window_Base.prototype.obtainEscapeParamText = function(textState) {
    const regExp = /^\[[^\[\]]+\]/i;
    const arr = regExp.exec(textState.text.slice(textState.index));
    if (arr) {
        textState.index += arr[0].length;
        console.log(arr[0].slice(1,-1));
        return arr[0].slice(1,-1);
    } else {
        console.log("");
        return "";
    }
};

AudioManager._typingBuffer = null;
AudioManager.playTypingSe = function(se) {
    this.stopTypingSe();
    if (se.name) {
        this._typingBuffer = this.createBuffer("se/", se.name);
        this.updateBufferParameters(this._typingBuffer, 100, se);
        this._typingBuffer.play(false);
    }
};

AudioManager.stopTypingSe = function () {
    if (this._typingBuffer) {
        this._typingBuffer.destroy();
        this._typingBuffer = null;
    }
};
