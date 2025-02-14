


Zetu.setupHeader("ZetuMZ_RANDOM")
    .setNamespace("RandomShit")
    .requires("ZetuMZ_0_Core");

Zetu.note.namespace("random")
    .page(/NO TRIGGER/i, (page, ...options) => {
        page.trigger = -1;
        console.log(page);
    });

// (alias => Game_Event.prototype.setupPageSettings = function() {
//     alias.apply(this, arguments);

// });

// Window_Base.prototype.obtainEscapeParamArray = function(textState) {
//     const regExp = /^\[.+?\]/;
//     const arr = regExp.exec(textState.text.slice(textState.index));
//     if (arr) {
//         textState.index += arr[0].length;
//         return arr[0].slice(1).split(",");
//     } else {
//         return "";
//     }
// };

// (Window_Base.prototype.processEscapeCharacter = function(code, textState) {
//     alias.call(this, ...arguments);
//     switch (code) {
//         case "SKILLFORMULA":
//             this.processSkillFormula(...this.obtainEscapeParamArray(textState));
//             break;
//     }
// })(Window_Base.prototype.processEscapeCharacter);

// Window_Base.prototype.processSkillFormula = function () { return ""; }

// (alias => Window_Help.prototype.initialize = function(rect) {
//     alias.apply(this, arguments);
//     this._targetIndex = -1;
// })(Window_Help.prototype.initialize);

// Window_Help.prototype.processSkillFormula = function (defaultText) {
//     if (!this._item) return "";
//     if (this._targetIndex >= 0) {
//         const action = new Game_Action(this.user());
//     } else {
//         return defaultText;
//     }
// }

// Window_Help.prototype.user = function () {

//     // const scene = SceneManager._scene;
//     // if (scene.isPrototypeOf(Scene_ItemBase)) {
//     //     return scene.user();
//     // }
//     // Scene_ItemBase
//     return $gameParty.menuActor();
// }

// Window_Help.prototype.setIndex = function (index) {
//     let item = this._item;
//     if (item && this._targetIndex != index) {
//         this._targetIndex = index;
//         this._text = item.description;
//         refresh();
//     }
// }

// (alias => Window_Help.prototype.setItem = function(item) {
//     this._item = item;
//     alias.apply(this, arguments);
// })();

