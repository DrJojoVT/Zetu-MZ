/*:
 * @target MZ
 * @plugindesc Zetu MZ Plugin Core
 * @author Zetu/DrJosephJorgen
 * @help Help Text
 * @url https://github.com/DrJojoVT/Zetu-MZ
 * 
 * ---------------------------------------------------------------
 *
 * @param LaunchFullscreen
 * @text Launch Fullscreen?
 * @type boolean
 * @default false
 * 
 * @param RunInBackground
 * @text Run When Unfocused
 * @type boolean
 * @default false
 * 
 * @param AssistButtons
 * @text Use Assist Buttons
 * @type boolean
 * @default true
 * 
 * @param MapZoom
 * @text Map Zoom
 * @help Zooms in the Map, useful tilesizes less than 48
 * @type number
 * @default 1
 * 
 */
var Imported = Imported || {};
var Zetu = {};
Zetu.Versions = {};
Zetu.Required = {};

Zetu.Versions["ZetuMZ_0_Core"] = "1.0";
Imported["ZetuMZ_0_Core"] = true;
Zetu.Core = {};

// #region Version Checker
const ZETU_VERSION_REGEX = /(\d+)\.(\d+)/;
window.addEventListener('load', function () {
    for (const [requiredPlugin, installedVersion] of Object.entries(Zetu.Required)) {
        let requiredVersion = Zetu.Versions[requiredPlugin];
        if (!requiredVersion) {
            alert(`Plugin: ${requiredPlugin} not found`);
            return;
        }
        if (Zetu.compareVersion(installedVersion, requiredVersion)) return;
        alert(`Outdated plugin: ${requiredPlugin}. Needs version ${
            requiredVersion}, current ${installedVersion
                }. Please visit: https://github.com/DrJojoVT/Zetu-MZ for up to date plugins!`);

    }
});
Zetu.compareVersion = function (installed, required) {
    if (!installed) return false;
    let [requiredMajor, requiredMinor] 
        = installed.match(ZETU_VERSION_REGEX).slice(1);
    let [installedMajor, installedMinor]
        = required.match(ZETU_VERSION_REGEX).slice(1);
    if (requiredMajor < installedMajor) return true;
    if (requiredMajor == installedMajor 
        && requiredMinor <= installedMinor) return true;
    return false;
}
// #endregion

// #region Header Parsing
var parameters;
var namespace;
var json;
var pluginName;
JSON.tryParse = function (obj) {
    try {
        return JSON.parse(obj);
    } catch (e) {
        return obj;
    }
};
Zetu.setupHeader = function (plugin, version = "1.0") {
    pluginName = plugin;
    Imported[pluginName] = true;
    Zetu.Versions[pluginName] = version;
    parameters = PluginManager.parameters(pluginName);
    return this;
};
Zetu.requires = function (plugin, version = "1.0") {
    Zetu.Required[plugin] = version;
    return this;
};
Zetu.optional = function (plugin, required = "1.0") {
    namespace.Optional ||= {};
    var installed = Zetu.Versions[plugin];
    namespace.Optional[plugin] = Zetu.compareVersion(installed, required);
    return this;
};
Zetu.setNamespace = function (...args) {
    namespace = Zetu;
    args.forEach((arg) => namespace = namespace[arg] ||= {});
    Zetu.extend(namespace, this.parse(parameters));
    return this;
};
Zetu.command = function (commandName, callback) {
    (namespace[commandName] = function () {
        PluginManager.registerCommand(pluginName, commandName, callback)
    })();
    return this;
};
Zetu.parse = function (obj) {
    if (obj === "true") return true;
    if (obj === "false") return false;
    if (typeof obj === 'string') {
        var c = obj.charAt(0) || "";
        if (c == "[" || c == "{") {
            obj = JSON.parse(obj);
        } else if (obj.match(/^\-?\d+$/)) {
            return parseInt(obj);
        } else if (obj.match(/^\-?\d*\.\d+$/)) {
            return parseFloat(obj);
        }
    } 
    if (typeof obj === 'string') return obj;
    if (Array.isArray(obj)) return obj = obj.map((o) => Zetu.parse(o));
    Object.keys(obj).forEach((key) => {
        obj[key] = Zetu.parse(obj[key]);
    });
    return obj;
};
// #endregion

// #region Math
Zetu.min = function (array, expression) {
    return expression(array.reduce((a,b) => expression(a) < expression(b) ? a : b));
};

Zetu.max = function (array, expression) {
    return expression(array.reduce((a,b) => expression(a) > expression(b) ? a : b));
};

Zetu.extend = function (origin, ...extras) {
    extras.forEach((ex) => {
        Object.keys(ex).forEach(key => {
            origin[key] = ex[key];
        });
    });
    return origin;
};

Zetu.random = function (n1, n2) {
    if (n2) {
        var range = n2 - n1;
        var variance = Math.floor(Math.random() * range);
        return variance + n1;
    } else {
        return Math.floor(Math.random() * n1);
    }
};

Zetu.arrayGetNoteParameters = function (array, regex, params = 0) {
    var index;
    array.some((value, i) => {
        if (regex.test(value)) {
            index = i;
            return true;
        }
        return false;
    });
    if (index !== undefined) {
        if (params == 0) return true;
        const start = index + 1;
        const end = start + params.length;
        return array.slice(start, end);
    }
    return false;
};

Zetu.arrayGetDirectionParameter = function (array) {
    var direction = 0;
    array.some((value) => {
        if (/DOWN/i.test(value)) {
            direction = 2;
            return true;
        }
        if (/LEFT/i.test(value)) {
            direction = 4;
            return true;
        }
        if (/RIGHT/i.test(value)) {
            direction = 6;
            return true;
        }
        if (/UP/i.test(value)) {
            direction = 8;
            return true;
        }
        return false;
    })
    return direction;
}

Object.className = function () {
    let val = this.toString();
    val = val.substring('function '.length);
    val = val.substring(0, val.indexOf('('));
    return val;
};
// #endregion

// #region Number
Number.prototype.GetGameVariable = function () {
    return $gameVariables.value(this);
}

Number.prototype.SetGameVariable = function (value) {
    $gameVariables.setValue(this, value);
}

Number.prototype.GetGameSwitch = function () {
    return $gameSwitches.value(this);
}

Number.prototype.SetGameSwitch = function (value) {
    $gameSwitches.setValue(this, value);
}
// #endregion

// #region Array
Array.prototype.notEmpty = function () {
    return this.filter(x => !!x);
};

Array.prototype.remove = function (item) {
    const index = this.indexOf(item);
    if (index > -1) return this.splice(index, 1)[0];
    return null;
};

Array.prototype.first = function (callback) {
    if (!callback) return this[0];
    for (let i = 0; i < this.length; i++) {
        const item = this[i];
        if (callback(item)) return item;
    }
};

Array.prototype.last = function (callback) {
    if (!callback) return this[this.length-1];
    for (let i = this.length-1; i >= 0; i--) {
        const item = this[i];
        if (callback(item)) return item;
    }
};

Array.prototype.random = function () {
    const index = Math.floor(Math.random() * this.length);
    return this[index];
};

Array.range = function (start, stop, step = 1) {
    return Array.from({length: Math.floor((stop - start) / step + 1)}, (v, index) => start + index * step);
};
// #endregion

// #region Custom Multi-dimensional Object
Zetu.MArray = function (...lengths) {
    this.lengths = lengths;
    this.accessor = this.createArray(...lengths);
}
Zetu.MArray.prototype.createArray = function (current, ...next) {
    var result = Array.apply(null, Array(current));//new Array(current);
    if (next.length > 0) {
        for (var i=0; i<current; i++) {
            result[i] = this.createArray(...next);
        }
    }
    return result;
}
Zetu.MArray.prototype.get = function (...index) {
    try {
        return this.atWA(this.accessor, ...index);
    } catch (e) {
        console.error(e);
    }
}
Zetu.MArray.prototype.set = function (value, ...index) {
    try {
        var last = index.pop();
        var accessor = this.atWA(this.accessor, ...index);
        accessor[last] = value;
    } catch (e) {
        console.error(e);
    }
}
Zetu.MArray.prototype.atWA = function(accessor, current, ...next) {
    if (accessor.length <= current) throw new Error("Index out of bounds");
    accessor = accessor[current];
    if (next.length > 0) return this.atWA(accessor, ...next);
    return accessor;
}
Zetu.MArray.prototype.forEach = function (callback) {
    ITT_FOREACH(callback, this, this.accessor);
}
const ITT_FOREACH = function (callback, self, accessor, ...indexes) {
    if (indexes.length !== self.lengths.length) {
        accessor.forEach((a,i) => {
            ITT_FOREACH(callback, self, a, ...indexes, i);
        })
    } else {
        callback(accessor, ...indexes);
    }
}
Zetu.MArray.prototype.fill = function (value) {
    ITT_FORALL(this.accessor, () => value);
}
const ITT_FORALL = function (accessor, callback, ...indexes) {
    accessor.forEach((a, i) => {
        if (Array.isArray(a)) {
            ITT_FORALL(a, callback, ...indexes, i);
        } else {
            accessor[i] = callback(...indexes, i);
        }
    })
}
// #endregion

// #region Database Note Reader
const ZETU_NOTE_CALLS = {};
var noteNamespace;
Zetu.note = function (datatype, regex, callback) {
    ZETU_NOTE_CALLS[datatype] ||= {};
    ZETU_NOTE_CALLS[datatype][noteNamespace] ||= [];
    ZETU_NOTE_CALLS[datatype][noteNamespace].push([regex, callback]);
    return this;
}
Zetu.note.namespace = function (namespace) {
    noteNamespace = namespace.toUpperCase();
    return this;
}
Zetu.note.actor = function () { Zetu.note("actor", ...arguments); return this; }
Zetu.note.class = function () { Zetu.note("class", ...arguments); return this; }
Zetu.note.skill = function () { Zetu.note("skill", ...arguments); return this; }
Zetu.note.item = function () { Zetu.note("item", ...arguments); return this; }
Zetu.note.weapon = function () { Zetu.note("weapon", ...arguments); return this; }
Zetu.note.armor = function () { Zetu.note("armor", ...arguments); return this; }
Zetu.note.enemy = function () { Zetu.note("enemy", ...arguments); return this; }
Zetu.note.troop = function () { Zetu.note("troop", ...arguments); return this; }
Zetu.note.state = function () { Zetu.note("state", ...arguments); return this; }
Zetu.note.animation = function () { Zetu.note("animation", ...arguments); return this; }
Zetu.note.tileset = function () { Zetu.note("tileset", ...arguments); return this; }
//Zetu.note.map = (...args) => Zetu.note("map", ...args);
//Zetu.note.event = (...args) => Zetu.note("event", ...args);
Zetu.note.page = function () { Zetu.note("page", ...arguments); return this; }

const ZETU_PLUGINNOTE_START = /<zetu (.+)>/i, ZETU_PLUGINNOTE_END = /<\/zetu (.+)>/i;
Zetu.note.exec = function (data, dataType) {
    data.forEach((d) => {
        if (!d || !d.note) return;
        Zetu.note.execLines(d, d.note, dataType);
    })
};
Zetu.note.execLine = function(plugin, datatype, line, data) {
    var config;
    if (!ZETU_NOTE_CALLS[datatype] || !(config = ZETU_NOTE_CALLS[datatype][plugin])) return;
    config.forEach((info) => {
        let [regex, callback] = info, match;
        if (match = line.match(regex)) {
            var fp = match.shift();
            var options = line.substring(fp.length).trim().split(" ").filter(i => i);
            callback(data, ...match, ...options);
        }
    })
};
Zetu.note.execLines = function (data, note, dataType) {
    var plugin = "";
    note.split("\n").forEach((line) => {
        var match;
        if (match = line.match(ZETU_PLUGINNOTE_START)) {
            plugin = match[1].toUpperCase();
        } else if (match = line.match(ZETU_PLUGINNOTE_END)) {
            plugin = "";
        } else if (plugin != "") {
            Zetu.note.execLine(plugin, dataType, line, data);
        }
    })
};
Zetu.note.execEvents = function (events) {
    events.notEmpty()
        .forEach(event => {
            // TODO: exec Event Line
            event.pages.forEach(page => {
                var n = page.list.findIndex(l => l.code != 108 && l.code != 408);
                if (n == 0) return; // If no comment at top of page
                if (n == -1) n = 200; // If page has only comments
                var list = page.list.slice(0, n);
                var note = list.map(l => l.parameters[0]).join("\n");
                Zetu.note.execLines(page, note, "page");
            })
        });
};

(alias => DataManager.onXhrLoad = function (xhr, name, src, url) {
    alias.apply(this, arguments);
    switch (name) {
        case "$dataActors": Zetu.note.exec($dataActors, "actor"); break;
        case "$dataClasses": Zetu.note.exec($dataClasses, "class"); break;
        case "$dataSkills": Zetu.note.exec($dataSkills, "skill"); break;
        case "$dataItems": Zetu.note.exec($dataItems, "item"); break;
        case "$dataWeapons": Zetu.note.exec($dataWeapons, "weapon"); break;
        case "$dataArmors": Zetu.note.exec($dataArmors, "armor"); break;
        case "$dataEnemies": Zetu.note.exec($dataEnemies, "enemy"); break;
        case "$dataTroops": Zetu.note.exec($dataTroops, "troop"); break;
        case "$dataStates": Zetu.note.exec($dataStates, "state"); break;
        case "$dataAnimations": Zetu.note.exec($dataAnimations, "animation"); break;
        case "$dataTilesets": Zetu.note.exec($dataTilesets, "tileset"); break;
        //case "$dataCommonEvents": Zetu.note.exec($dataCommonEvents, "commonevent"); break;
        //case "$dataSystem": Zetu.note.exec($dataSystem, "system"); break;
        case "$dataMap": 
            Zetu.note.execLines($dataMap, $dataMap.note, "map");
            Zetu.note.execEvents($dataMap.events);
            break;
        default: break;
    }
})(DataManager.onXhrLoad);

// #region Scene_Manager
(alias => SceneManager.isGameActive = function() {
    if (Zetu.Core.RunInBackground) return true;
    return alias();
})(SceneManager.isGameActive);
// #endregion

// #region Scene_Boot
(alias => Scene_Boot.prototype.start = function () {
    alias.apply(this, ...arguments);
    if (Zetu.Core.LaunchFullscreen) Graphics._requestFullScreen();
})(Scene_Boot.prototype.start);
// #endregion

(alias => Sprite.prototype.update = function () {
    alias.apply(this, arguments);
    this.updateAnimation();
})(Sprite.prototype.update);
// #endregion

// #region Rectangle
Rectangle.prototype.grow = function (left, top, right, bottom) {
    if (!left) return this;
    if (!right) right = left;
    if (!top) top = left;
    if (!bottom) bottom = top;

    this.x -= left;
    this.y -= top;
    this.width += left + right;
    this.height += top + bottom;

    return this;
};
// #endregion


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

// #region Window_Base
Window_Base.prototype.touchX = function () {
    var x = TouchInput.x - this.x - $gameSystem.windowPadding();
    if (x < 0) return null;
    if (x >= this.itemWidth()) return null;
    return x;
}

Window_Base.prototype.touchY = function () {
    var y = TouchInput.y - this.y - $gameSystem.windowPadding();
    if (y < 0) return null;
    if (y >= this.itemHeight()) return null;
    return y;
}
// #endregion


Zetu.setupHeader("Zetu_MZ_Core")
    .setNamespace("Core");
if (!Zetu.Core.AssistButtons) {
    Scene_MenuBase.prototype.createButtons = function() {
        // if (ConfigManager.touchUI) { // Edit
        //     if (this.needsCancelButton()) {
        //         this.createCancelButton();
        //     }
        //     if (this.needsPageButtons()) {
        //         this.createPageButtons();
        //     }
        // }
    };
    
    Scene_Map.prototype.createButtons = function() {
        // if (ConfigManager.touchUI) { // Edit
        //     this.createMenuButton();
        // }
    };
    
    Scene_Battle.prototype.createButtons = function() {
        // if (ConfigManager.touchUI) { // Edit
        //     this.createCancelButton();
        // }
    };
}