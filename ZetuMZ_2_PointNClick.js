/*:
 * @target MZ
 * @plugindesc Zetu's Point N Click Adventure
 * @author Zetu/DrJosephJorgen
 * @help NOTE GUIDE
 * - Database/Items/note
 *
 *      - Start/End Notes
 *          <zetu pnc>
 *          </zetu pnc>
 *      - Include Item in Point & Click Item Menu
 *          SHOW IN MENU {TYPE}
 *              TYPE = ICON (Uses the item db icon, 32x32 by default)
 *              TYPE = picture (Uses name of picture)
 *      - Common Event when inspecting item.
 *          SELF EVENT {commoneventid}
 *
 * @param InventoryItemWidth
 * @text Item Width
 * @type number
 * @default 32
 *
 * @param InventoryItemHeight
 * @text Item Height
 * @type number
 * @default 32
 * 
 * @param ItemUsage
 * @text Item Usage Variable
 * @type variable
 * @help The Item Id when triggering a click event (0 if no item.)
 * @default 0
 * 
 * @param ItemDefaultEvent
 * @text Item Default Event
 * @type common_event
 * @help Event called if item has no other events. Useful as error handling, such as displaying 'That item doesn't work here'.
 * @default 0
 * 
 * @param ItemInspectEvent
 * @text Item Inspect Event
 * @type common_event
 * @default 0
 * 
 * @param ItemCombineEvents
 * @text Item Combine Events
 * @type struct<ItemCombineEvent>[]
 * @default []
 * 
 * @param DockCursor
 * @text Dock Cursor
 * @type struct<DockCursorSetup>
 * @default {}
 * 
 * @param ShowInventoryByDefault
 * @text Show Inventory By Default
 * @type boolean
 * @default false
 * 
 * @param InventoryToggle
 * @text Key to Show/Hide Inventory
 * @type select
 * @default tab
 * @option Off
 * @value off
 * @option Tab
 * @value tab
 * @option Control/Alt
 * @value control
 * @option Q/Page Up
 * @value pageup
 * @option W/Page Down
 * @value pagedown
 * 
 * @-------------------------------------------
 *
 * @command SetupSubscene
 * @text P&C: Setup Subscene
 * @desc Setup the Subscene for examining. With default window sizes, Max should be 792 x 376.
 *
 * @arg Width
 * @text Subscene Width
 * @type number
 * @default 792
 *
 * @arg Height
 * @text Subscene Height
 * @type number
 * @default 376
 *
 * @arg Items
 * @text Subscene Items
 * @type struct<SubsceneItem>[]
 * 
 * @arg ShowWindow
 * @text Show Window?
 * @type boolean
 * @default true
 * 
 * @arg GlobalZoom
 * @text Global Zoom
 * @type number
 * @decimals 2
 * @default 1.0
 * 
 * @-------------------------------------------
 *
 * @command Exit
 * @text Exit Point & Click Scene
 * @desc Exits the current context of PNC scene after interpreter finishes.
 *
 */
/*~struct~SubsceneItem:
 *
 * @param Label
 * @type text
 * @desc For comments only (does not change function)
 * 
 * @param X
 * @text X Position
 * @type number
 * @desc Pixels from right
 * @default 0
 *
 * @param Y
 * @text Y Position
 * @type number
 * @desc Pixels from right
 * @default 0
 *
 * @param TileId
 * @text Tile Id
 * @type number
 * @desc Leave 0 to disable.
 * @default 0
 *
 * @param IconId
 * @text Icon Id
 * @type number
 * @desc Leave 0 to disable.
 * @default 0
 *
 * @param Picture
 * @text Picture
 * @type file
 * @desc Image of Item (if not tile/icon)
 * @dir pictures/pictures
 *
 * @param PictureFramesX
 * @text Picture Frames X
 * @type number
 * @desc The number of available frames on image per Row
 * @default 1
 * @min 1
 * @parent Picture
 *
 * @param PictureFramesY
 * @text Picture Frames Y
 * @type number
 * @desc The number of available frames on image per Column
 * @default 1
 * @min 1
 * @parent Picture
 *
 * @param PictureFrameIndexX
 * @text Frame X Index
 * @type number
 * @desc If Picture Frames > 1, use this for Index (Overwritten if using Variable)
 * @default 0
 * @parent Picture
 *
 * @param PictureFrameIndexY
 * @text Frame Y Index
 * @type number
 * @desc If Picture Frames > 1, use this for Index (Overwritten if using Variable)
 * @default 0
 * @parent Picture
 *
 * @param PictureFrameIndexVariableX
 * @text Frame X Variable
 * @type variable
 * @desc If Picture Frames > 1, use this for Index
 * @default 0
 * @parent Picture
 *
 * @param PictureFrameIndexVariableY
 * @text Frame Y Variable
 * @type variable
 * @desc If Picture Frames > 1, use this for Index
 * @default 0
 * @parent Picture
 *
 * @param Zoom
 * @text Zoom Level
 * @type number
 * @decimals 2
 * @desc How far to zoom the item
 * @default 1.00
 *
 * @param Switch
 * @text Switch Required
 * @type switch
 * @desc If switch is needed to be ON/OFF
 * @default 0
 *
 * @param SwitchState
 * @text Switch State
 * @type boolean
 * @on ON
 * @off OFF
 * @default true
 * @parent Switch
 * 
 * @param VariableToSet
 * @text Set Variable
 * @type variable
 * @default 0
 * 
 * @param VariableValue
 * @text Value
 * @type number
 * @default 0
 * @parent VariableToSet
 *
 * @param CommonEventId
 * @text Common Event
 * @type common_event
 * @default 0
 * 
 * @param InventoryToItems
 * @text Item Used on Object
 * @type struct<InventoryToItem>[]
 * @default []
 *
 */
/*~struct~DockCursorSetup:
 * 
 * @param ImageCursor
 * @text Cursor
 * @type file
 * @dir img/system/Cursor
 * 
 * @param ChildOx
 * @text Child Offset X
 * @type number
 * @default 0
 * 
 * @param ChildOy
 * @text Child Offset Y
 * @type number
 * @default 0
 * 
 * @param IconZoom
 * @text Item Icon Zoom
 * @type number
 * @default 1
 * @min 1
 * 
 */
/*~struct~InventoryToItem:
 *
 * @param ItemUsed
 * @text Item Used
 * @type item
 * @default 0
 *
 * @param CommonEventId
 * @text Common Event
 * @type common_event
 */
/*~struct~ItemCombineEvent:
 * 
 * @param Item1Id
 * @text Item 1
 * @type item
 * @default 0
 * 
 * @param Item2Id
 * @text Item 2
 * @type item
 * @default 0
 * 
 * @param Event
 * @text Event
 * @type common_event
 * @default 0
 * 
 */

Zetu.setupHeader("ZetuMZ_2_PointNClick")
    .setNamespace("PointNClick")
    .requires("ZetuMZ_0_Core")
    .requires("ZetuMZ_1_Cursor");

Zetu
    .command("SetupSubscene", (args) => {
        args = Zetu.parse(args);
        $gameTemp.loadNewPointNClickScene(args);
    })
    .command("Exit", () => {
        $gameTemp._exitPnc = true;
    });

Zetu.note.namespace("pnc")
    .item(/SHOW IN MENU[:\s]+(.+)/i, (item, ...options) => {
        if (Zetu.arrayGetNoteParameters(options, /ICON/i)) {
            item.pncUseIcon = true;
        } else if (options.length == 1) {
            item.pncUsePicture = options[0];
        }
    });



// #region Game_Temp

(alias => Game_Temp.prototype.initialize = function() {
    alias.apply(this, arguments);
    this._pointNClickOptions = {};
})(Game_Temp.prototype.initialize);

Game_Temp.prototype.loadNewPointNClickScene = function (options) {
    this._exitPnc = false;
    this._pointNClickOptions = options;
    SceneManager.push(Scene_PointNClick);
};


// #endregion

// #region Game_Party
(alias => Game_Party.prototype.gainItem = function (item, amount, includeEquip) {
    $gameTemp.pncRequestRefresh = true;
    return alias.apply(this, arguments);
})(Game_Party.prototype.gainItem);
// #endregion

// #region Scene_Base
Scene_Base.prototype.createPncInventory = function () {
    this._clickInventoryWindow = new Window_ItemPointNClick();
    this._clickInventoryWindow.active = true;
    this.addWindow(this._clickInventoryWindow);
    this._clickInventoryWindow.setHandler("ok", this.onPncItem.bind(this));
    
};

Scene_Base.prototype.onPncItem = function () {
    const item = this._clickInventoryWindow.item();
    $gameCursor.setDockItem(item);
    // TO DO: Combine / Inspect
}
// #endregion

// #region Scene_PointNClick
function Scene_PointNClick() {
    this.initialize(...arguments);
};

Scene_PointNClick.prototype = Object.create(Scene_Message.prototype);
Scene_PointNClick.prototype.constructor = Scene_PointNClick;

Scene_PointNClick.prototype.initialize = function (){
    Scene_Message.prototype.initialize.call(this);
    this._interpreter = new Game_Interpreter();
}

Scene_PointNClick.prototype.create = function() {
    Scene_Message.prototype.create.call(this);
    this.createBackground();
    this.createWindowLayer();
    this.createAllWindows();
};

Scene_PointNClick.prototype.createBackground = function() {
    this._backgroundFilter = new PIXI.filters.BlurFilter();
    this._backgroundSprite = new Sprite();
    this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
    this._backgroundSprite.filters = [this._backgroundFilter];
    this.addChild(this._backgroundSprite);
    this.setBackgroundOpacity(192);
};

Scene_PointNClick.prototype.setBackgroundOpacity = function(opacity) {
    this._backgroundSprite.opacity = opacity;
};

Scene_PointNClick.prototype.createAllWindows = function() {
    this.createInteractable();
    this.createPncInventory();
    Scene_Message.prototype.createAllWindows.call(this);
};

Scene_PointNClick.prototype.createInteractable = function () {
    let options = $gameTemp._pointNClickOptions;
    let width = options.Width;
    width += 2 * $gameSystem.windowPadding();
    let height = options.Height;
    height += 2 * $gameSystem.windowPadding();
    
    let x = (Graphics.width - width) / 2;
    let y = (Graphics.height - height) / 2;
    
    const rect = new Rectangle(x,y,width,height);

    this._interactableWindow = new Window_InteractablePointNClick(rect, options);
    this.addWindow(this._interactableWindow);
};
Scene_PointNClick.prototype.update = function() {
    this.checkReturnScene();
    this.updateInterpreter();
    this.updateInput();
    //this.updateItems();
    Scene_Message.prototype.update.call(this);
};

Scene_PointNClick.prototype.checkReturnScene = function () {
    if (this._interpreter.isRunning()) return;
    if (!Input.isRepeated("cancel") && !$gameTemp._exitPnc) return;
    if ($gameCursor.mode == "dock") {
        $gameCursor.setDockItem(null);
        return;
    }
    SceneManager.pop();
};
Scene_PointNClick.prototype.updateInterpreter = function() {
    this._interpreter.update();
    if (this._interpreter.isRunning()) return;
    if ($gameTemp.isCommonEventReserved()) {
        var ce = $gameTemp.retrieveCommonEvent();
        this._interpreter.setup(ce.list);
    }
};

Scene_PointNClick.prototype.updateInput = function () {

}
// #endregion

// #region Window_InteractablePointNClick
function Window_InteractablePointNClick() {
    this.initialize(...arguments);
}

Window_InteractablePointNClick.prototype = Object.create(Window_Base.prototype);
Window_InteractablePointNClick.prototype.constructor = Window_InteractablePointNClick;

Window_InteractablePointNClick.prototype.initialize = function(rect, options) {
    Window_Base.prototype.initialize.call(this, rect);
    this._items = options.Items;
    this._globalZoom = options.GlobalZoom;
    if (!options.ShowWindow) {
        this.frameVisible = false;
        this.backOpacity = 0;
    }
    // bitty = new Bitmap(rect.width, rect.height);
    // this.items = new Sprite(bitty);
    //this.items.scale.x = this.items.scale.y = this._globalZoom;
    this.addItems();
}

Window_InteractablePointNClick.prototype.addItems = function (startIndex = 0) {
    let self = this;
    for (let i = startIndex; i < this._items.length; i++) {
        let item = this._items[i];
        if (item.Picture) {
            const cache = ImageManager.loadPicture(item.Picture);
            if (!cache.isReady()) {
                cache.addLoadListener(() => {
                    self.addItems(i);
                });
                return;
            }
        }
        this.addItem(item);
    }
};

Window_InteractablePointNClick.prototype.addItem = function (item) {
    // SpriteDraw Type
    let sprite = new Sprite_PNClickInteractable();
    if (item.Picture) {
        sprite.setPicture(item.Picture);
        sprite.bitmap.smooth = false;
        sprite.framesIndexX = item.PictureFrameIndexX;
        sprite.framesIndexY = item.PictureFrameIndexY;
        sprite.setFramesByVariable(item.PictureFrameIndexVariableX, item.PictureFrameIndexVariableY
            , item.PictureFramesX, item.PictureFramesY);
    } else if (item.TileId) {
        sprite.setTile(item.TileId);
    }
    sprite.setPosition(item.X * this._globalZoom, item.Y * this._globalZoom);
    sprite.scale.x = sprite.scale.y = item.Zoom * this._globalZoom;
    
    if (item.Switch) {
        sprite.requiresSwitch(item.Switch, item.SwitchState);
    }

    if (item.VariableToSet) {
        sprite.onClickVariable(item.VariableToSet, item.VariableValue);
    }

    if (item.CommonEventId) {
        sprite.onClickCommonEvent(item.CommonEventId);
    }

    item.InventoryToItems.forEach(i => {
        sprite.addItemUsage(i.CommonEventId, i.ItemUsed);
    });
    this.addChild(sprite);
};

// Window_InteractablePointNClick.prototype.drawItem = function (item) {

// };
// #endregion

// #region Window_ItemPointNClick
function Window_ItemPointNClick() {
    this.initialize(...arguments);
}

Window_ItemPointNClick.prototype = Object.create(Window_ItemList.prototype);
Window_ItemPointNClick.prototype.constructor = Window_ItemPointNClick;

Window_ItemPointNClick.prototype.initialize = function() {
    const width = Graphics.width;
    const rows = 1;
    const height = this.itemHeight() * rows + 2 * $gameSystem.windowPadding();
    const rect = new Rectangle(0, 0, width, height);
    Window_ItemList.prototype.initialize.call(this, rect);
    //this.contentsBack.hide();
    this.refresh();
};

Window_ItemPointNClick.prototype.createContents = function () {
    Window_Base.prototype.createContents.apply(this, arguments);
    this.contentsBack.paintOpacity = 0;
}

Window_ItemPointNClick.prototype.update = function () {
    if ($gameTemp.pncRequestRefresh) {
        this.refresh();
        $gameTemp.pncRequestRefresh = false;
    }
    Window_ItemList.prototype.update.apply(this, arguments);
}

Window_ItemPointNClick.prototype.includes = function(item) {
    if (!item) return false;
    return DataManager.isItem(item) && item.itypeId === 2;
};

Window_ItemPointNClick.prototype.maxCols = function() {
    const w = this.innerWidth + this.colSpacing();
    const x = this.itemWidth() + this.colSpacing();
    const i = Math.floor(w / x);
    return i;
};

Window_ItemPointNClick.prototype.itemWidth = function() {
    return this.itemHeight();
};

Window_ItemPointNClick.prototype.colSpacing = function() {
    return 4;
};

Window_ItemPointNClick.prototype.drawItem = function (index) {
    const item = this.itemAt(index);
    if (!item) return;
    const rect = this.itemLineRect(index);
    this.drawIcon(item.iconIndex, rect.x, rect.y);
};

Window_ItemPointNClick.prototype.itemPadding = function() {
    return 4;
};

Window_ItemPointNClick.prototype.processOk = function() {
    if (this.isCurrentItemEnabled()) {
        //this.playOkSound();
        this.updateInputData();
        //this.deactivate();
        this.callOkHandler();
    } else {
        //this.playBuzzerSound();
    }
};
// #endregion

// #region Spriteset_Cursor
(alias => Spriteset_Cursor.prototype.initialize = function() {
    alias.call(this);
    var cursorName = Zetu.PointNClick.DockCursor.ImageCursor;
    this.dock = this.getCursorByName(cursorName);
    this.dock.item = null;
})(Spriteset_Cursor.prototype.initialize);

(alias => Spriteset_Cursor.prototype.cursorMode = function () {
    if (this.dock && this.dock.item != null) {
        this.mode = "dock";
        return this.dock;
    }
    return alias.apply(this, arguments);
})(Spriteset_Cursor.prototype.cursorMode);

Spriteset_Cursor.prototype.setDockItem = function (item) {
    if (item && item != this.dock.item) {
        this.dock.item = item;
        this.dock.children.forEach((child) => {
            this.dock.removeChild(child);
        });
        // set based on icon
        const iconIndex = item.iconIndex;
        const ox = Zetu.PointNClick.DockCursor.ChildOx;
        const oy = Zetu.PointNClick.DockCursor.ChildOy;
        const scale = Zetu.PointNClick.DockCursor.IconZoom;
        let subsprite = Sprite.FromIcon(iconIndex);
        subsprite.x = ox;
        subsprite.y = oy;
        subsprite.scale.x = scale;
        subsprite.scale.y = scale;
        this.dock.addChild(subsprite);
    }
    if (!item && this.dock.item) {
        this.dock.children.forEach((child) => {
            this.dock.removeChild(child);
        });
        this.dock.item = null;
    }
}
// #endregion

// #region Sprite_PNClickInteractable
function Sprite_PNClickInteractable() {
    this.initialize(...arguments);
};

Sprite_PNClickInteractable.prototype = Object.create(Sprite_Clickable.prototype);
Sprite_PNClickInteractable.prototype.constructor = Sprite_PNClickInteractable;

Sprite_PNClickInteractable.prototype.initialize = function() {
    Sprite_Clickable.prototype.initialize.call(this);
    this.requiredSwitches = {};
    this.variables = {};
    this.commonEvents = {};
    this.framesX = null;
    this.framesY = null;
    this.framesIndexX = null;
    this.framesIndexY = null;
    this.frameVariableX = null;
    this.frameVariableY = null;
    this.itemUsages = [];
};

Sprite_PNClickInteractable.prototype.setPicture = function (picture) {
    if (this.bitmap) this.bitmap.dispose();
    this.bitmap = ImageManager.loadPicture(picture);
};

Sprite_PNClickInteractable.prototype.setTile = function (tileId) {

};

Sprite_PNClickInteractable.prototype.setPosition = function (x, y) {
    this.x = x + $gameSystem.windowPadding();
    this.y = y + $gameSystem.windowPadding();
}

Sprite_PNClickInteractable.prototype.setFrames = function (xIndex, yIndex, framesX, framesY) {
    this.framesX = framesX || this.framesX || 1;
    this.framesY = framesY || this.framesY || 1;

    this.framesIndexX = xIndex;
    this.framesIndexY = yIndex;

    let width = Math.floor(this.bitmap.width / this.framesX);
    let height = Math.floor(this.bitmap.height / this.framesY);
    
    let x = this.framesIndexX * width;
    let y = this.framesIndexY * height;

    this.setFrame(x, y, width, height);
};

Sprite_PNClickInteractable.prototype.setFramesByVariable = function (varX, varY, framesX, framesY) {
    this.frameVariableX = varX || this.frameVariableX;
    this.frameVariableY = varY || this.frameVariableY;

    let x = this.framesIndexX || 0;
    let y = this.framesIndexY || 0;
    if (this.frameVariableX > 0) x = $gameVariables.value(this.frameVariableX);
    if (this.frameVariableY > 0) y = $gameVariables.value(this.frameVariableY);

    if (x != this.framesIndexX || y != this.frameIndexY) {
        this.setFrames(x, y, framesX, framesY);
    }
}

Sprite_PNClickInteractable.prototype.interpreterBusy = function () {
    let interpreter = SceneManager._scene._interpreter;
    if (!interpreter) return false;
    if (interpreter.isRunning()) return true;
    //if ($gameTemp.isCommonEventReserved()) return true;
    return false;
}

Sprite_PNClickInteractable.prototype.requiresSwitch = function (switchId, switchState) {
    this.requiredSwitches[switchId] = switchState;
};

Sprite_PNClickInteractable.prototype.onClickVariable = function (variableId, value) {
    this.variables[variableId] = value;
};

Sprite_PNClickInteractable.prototype.onClickCommonEvent = function (commonEventId) {
    this.commonEvents[commonEventId] = true;
};

Sprite_PNClickInteractable.prototype.addItemUsage = function (commonEventId, itemId) {
    this.itemUsages.push({commonEventId: commonEventId, itemId: itemId});
}

Sprite_PNClickInteractable.prototype.update = function () {
    Sprite_Clickable.prototype.update.apply(this, arguments);
    this.preUpdateVisibility();
    this.setFramesByVariable();
}

Sprite_PNClickInteractable.prototype.preUpdateVisibility = function () {
    let isVisible = true;
    let keys = Object.keys(this.requiredSwitches);
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let requiredState = this.requiredSwitches[key];
        let currentState = $gameSwitches.value(key);
        if (requiredState != currentState) isVisible = false;
        break;
    }
    if (!this._hidden && !isVisible) {
        this.hide();
    }
    if (this._hidden && isVisible) {
        this.show();
    }
};

Sprite_PNClickInteractable.prototype.useItem = function () {
    let item = $gameCursor.getItem();
    if (!item) return false;
    let usage = this.itemUsages.first(i => i.itemId == item.id);
    const iuv = Zetu.PointNClick.ItemUsage;
    if (usage) {
        $gameVariables.setValue(iuv, usage.itemId);
        $gameTemp.clearCommonEventReservation();
        $gameTemp.reserveCommonEvent(usage.commonEventId);
        $gameCursor.setDockItem(null);
        return true;
    }
    $gameVariables.setValue(iuv, 0);
    if (!$gameTemp.isCommonEventReserved()) {
        $gameTemp.reserveCommonEvent(Zetu.PointNClick.ItemDefaultEvent);
    }
    return true;
}

Sprite_PNClickInteractable.prototype.setVariables = function () {
    let keys = Object.keys(this.variables);
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let value = this.variables[key];
        $gameVariables.setValue(key, value);
    }
    const iuv = Zetu.PointNClick.ItemUsage;
    $gameVariables.setValue(iuv, 0);
};

Sprite_PNClickInteractable.prototype.callCommonEvents = function () {
    let keys = Object.keys(this.commonEvents);
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let value = this.commonEvents[key];
        if (value) {
            const iuv = Zetu.PointNClick.ItemUsage;
            $gameVariables.setValue(iuv, 0);
            $gameTemp.clearCommonEventReservation();
            $gameTemp.reserveCommonEvent(key);
            return;
        }
    }
};

Sprite_PNClickInteractable.prototype.onClick = function () {
    if ($gameMessage.isBusy()) return;
    if (this._hidden) return;
    if (this.interpreterBusy()) return;
    if (this.useItem()) return
    this.setVariables();
    this.callCommonEvents();
};

(alias => Sprite_PNClickInteractable.prototype.isClickEnabled = function () {
    if (this.interpreterBusy()) return false;
    return alias.call(this);
})(Sprite_PNClickInteractable.prototype.isClickEnabled);

Sprite_PNClickInteractable.prototype.isBeingTouched = function() {
    const touchPos = new Point(TouchInput.x, TouchInput.y);
    const localPos = this.worldTransform.applyInverse(touchPos);
    return this.hitTest(localPos.x, localPos.y);
};


// #endregion
