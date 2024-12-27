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
        console.log(args);
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
    //this.createPncInventory();
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

    this._interactableWindow = new Window_PointNClickInteractable(rect, options);
    this.addWindow(this._interactableWindow);
};

Scene_PointNClick.prototype.update = function() {
    this.checkReturnScene();
    this.updateInterpreter();
    //this.updateItems();
    Scene_Message.prototype.update.call(this);
};

Scene_PointNClick.prototype.checkReturnScene = function () {
    if (this._interpreter.isRunning()) return;
    if (!Input.isRepeated("cancel") && !$gameTemp._exitPnc) return;
    // if ($gameCursor.getDockItem()) {
    //     $gameCursor.setDockItem(null);
    //     return;
    // }
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
// #endregion

// (alias => Window_Message.prototype.terminateMessage = function() {
//     alias.apply(this, arguments);
//     TouchInput._clicked = false;
//     TouchInput._pressed = false;
// })(Window_Message.prototype.terminateMessage);

// #region Window_PointNClickInteractable
function Window_PointNClickInteractable() {
    this.initialize(...arguments);
}

Window_PointNClickInteractable.prototype = Object.create(Window_Base.prototype);
Window_PointNClickInteractable.prototype.constructor = Window_PointNClickInteractable;

Window_PointNClickInteractable.prototype.initialize = function(rect, options) {
    Window_Base.prototype.initialize.call(this, rect);
    this._items = options.Items;
    if (!options.ShowWindow) {
        this.frameVisible = false;
        this.backOpacity = 0;
    }
    this.createContents();
    this.addItems();
}

// Window_PointNClickInteractable.prototype.refresh = function () {
//     if (this.contents) {
//         this.contents.clear();
//         this.contentsBack.clear();
//         this.drawAllItems();
//     }
// }

Window_PointNClickInteractable.prototype.addItems = function (startIndex = 0) {
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

Window_PointNClickInteractable.prototype.addItem = function (item) {
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
    sprite.setPosition(item.X, item.Y);
    sprite.scale.x = sprite.scale.y = item.Zoom;
    
    if (item.Switch) {
        sprite.requiresSwitch(item.Switch, item.SwitchState);
    }

    if (item.VariableToSet) {
        sprite.onClickVariable(item.VariableToSet, item.VariableValue);
    }

    if (item.CommonEventId) {
        sprite.onClickCommonEvent(item.CommonEventId);
    }
    this.addChild(sprite);
};

// Window_PointNClickInteractable.prototype.drawItem = function (item) {

// };
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
    if ($gameTemp.isCommonEventReserved()) return true;
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

Sprite_PNClickInteractable.prototype.update = function () {
    Sprite_Clickable.prototype.update.apply(this, arguments);
    this.updateVisibility();
    this.setFramesByVariable();
}

Sprite_PNClickInteractable.prototype.updateVisibility = function () {
    let isVisible = true;
    let keys = Object.keys(this.requiredSwitches);
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let requiredState = this.requiredSwitches[key];
        let currentState = $gameSwitches.value(key);
        if (requiredState != currentState) isVisible = false;
    }
    if (this.visible && !isVisible) this.hide();
    if (!this.visible && isVisible) this.show();
};

Sprite_PNClickInteractable.prototype.setVariables = function () {
    let keys = Object.keys(this.variables);
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let value = this.variables[key];

        $gameVariables.setValue(key, value);
    }
};

Sprite_PNClickInteractable.prototype.callCommonEvents = function () {
    let keys = Object.keys(this.commonEvents);
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let value = this.commonEvents[key];
        if (value) $gameTemp.reserveCommonEvent(key);
    }
};

Sprite_PNClickInteractable.prototype.onClick = function () {
    if ($gameMessage.isBusy()) return;
    if (!this.visible) return;
    if (this.interpreterBusy()) return;
    this.setVariables();
    this.callCommonEvents();
};


// #endregion









    
// #region Game_Map
// const Game_Map_setupEvents = Game_Map.prototype.setupEvents;
// Game_Map.prototype.setupEvents = function () {
//     Game_Map_setupEvents.apply(this, arguments);
//     Game_PointNClickObject.preloadCache(this._events, this._commonEvents);
// }
// #endregion

// #region Scene_Base
// Scene_Base.prototype.setSelectedItem = function () {
//     this.item = null;
//     const currentItem = $gameCursor.getDockItem();
//     const newItem = this._pncInventoryWindow.item();
//     if (!currentItem) {
//         $gameCursor.setDockItem(newItem);
//     } else if (currentItem == newItem) {
//         $gameCursor.setDockItem(null, false);
//         $gameTemp.reserveCommonEvent(Zetu.PointNClick.ItemInspectEvent);
//     } else if (!newItem) {
//         $gameCursor.setDockItem(null);
//     } else {
//         $gameCursor.setDockItem(null, false);
//         Zetu.PointNClick.ItemCombineEvents.some(options => {
//             const eventId = options.Event;
//             const item1Id = options.Item1Id;
//             const item2Id = options.Item2Id;
//             if ((item1Id == currentItem.id && item2Id == newItem.id) || 
//                 (item2Id == currentItem.id && item1Id == newItem.id)) {
//                 $gameTemp.reserveCommonEvent(eventId);
//                 return true;
//             }
//             const defaultEvent = Zetu.PointNClick.ItemDefaultEvent;
//             $gameTemp.reserveCommonEvent(defaultEvent);
//             return false;
//         });
//     }
//     this._pncInventoryWindow.activate();
//     this._pncInventoryWindow._index = -1;
// };
// #endregion

// #region Scene_Map
// Scene_Map.prototype.createPncInventory = function () {
//     this._pncInventoryWindow = new Window_ItemPointNClick();
//     this.addWindow(this._pncInventoryWindow);
//     this._pncInventoryWindow.setHandler("ok", this.setSelectedItem.bind(this));
// };

// (alias => Scene_Map.prototype.createAllWindows = function () {
//     alias.apply(this, arguments);
//     this.createPncInventory();
// })(Scene_Map.prototype.createAllWindows);

// (alias => Scene_Map.prototype.onMapTouch = function() {
//     const x = this._pncInventoryWindow.touchX();
//     const y = this._pncInventoryWindow.touchY();
//     if (x || y) return;
//     alias.apply(this, arguments);
// })(Scene_Map.prototype.onMapTouch);

// (alias => Scene_Map.prototype.updateCallMenu = function() {
//     if ((Input.isTriggered("menu") || TouchInput.isCancelled()) && $gameCursor.getDockItem()) {
//         $gameCursor.setDockItem(null);
//     } else {
//         alias.apply(this, arguments);
//     }
// })(Scene_Map.prototype.updateCallMenu);
// #endregion

// #region Scene_PointNClick









// Scene_PointNClick.prototype.updateItems = function () {
//     var needsRefresh = false;
//     Zetu.PointNClick.Current.Items.forEach((item) => {
//         if (item.isChanged()) needsRefresh = true;
//         item.update();
//     });
//     if (needsRefresh) {
//         this._pncInventoryWindow.refresh();
//         this._interactableWindow.refresh();
//     }
// };

// Scene_PointNClick.prototype.topMenuHeight = function() {
//     // TO DO: Inventory Item Height
//     return 32 + $gameSystem.windowPadding() * 2;
// }



// Scene_PointNClick.prototype.createPncInventory = function () {
//     this._pncInventoryWindow = new Window_ItemPointNClick();
//     this.addWindow(this._pncInventoryWindow);
//     this._pncInventoryWindow.setHandler("ok", this.setSelectedItem.bind(this));
// };

// Scene_PointNClick.prototype.itemAtHover = function () {
//     const x = this._interactableWindow.touchX();
//     const y = this._interactableWindow.touchY();
//     var items = Zetu.PointNClick.Current.Items;
//     for (let i = items.length-1; i>=0; i--) {
//         const item = items[i];
//         if (item.checkCollision(x, y)) return item;
//     }
//     return null;
// };
// #endregion

// // #region Window_ItemPointNClick
// function Window_ItemPointNClick() {
//     this.initialize(...arguments);
// }

// Window_ItemPointNClick.prototype = Object.create(Window_ItemList.prototype);
// Window_ItemPointNClick.prototype.constructor = Window_ItemPointNClick;

// Window_ItemPointNClick.prototype.initialize = function() {
//     const width = Graphics.boxWidth;
//     const height = this.itemHeight() + 2 * $gameSystem.windowPadding();
//     const rect = new Rectangle(0, 0, width, height);
//     Window_ItemList.prototype.initialize.call(this, rect);
//     this.active = true;
// };

// Window_ItemPointNClick.prototype.update = function () {
//     if (this.requiresRefresh()) this.refresh();
//     Window_ItemList.prototype.update.call(this);
// };

// Window_ItemPointNClick.prototype.requiresRefresh = function() {
//     // if an Item is removed:
//     if (this._data.some((item => !this.includes(item)))) return true;
//     // if an Item is added:
//     var data = $gameParty.allItems().filter(item => this.includes(item));
//     if (this._data.length !== data.length) return true;
//     return false;
// };

// Window_ItemPointNClick.prototype.maxPageRows = () => 1;

// Window_ItemPointNClick.prototype.includes = function(item) {
//     if (!item) return false;
//     if (item.pncUseIcon) return true;
//     if (item.pncUsePicture) return true;
//     return false;
// };

// Window_ItemPointNClick.prototype.isEnabled = function(/*item*/) {
//     return true;
// };

// Window_ItemPointNClick.prototype.makeItemList = function() {
//     this._data = $gameParty.allItems().filter(item => this.includes(item));
// };

// Window_ItemPointNClick.prototype.drawItem = function(index) {
//     const item = this.itemAt(index);
//     if (item) {
//         const rect = this.itemRect(index);
//         this.changePaintOpacity(this.isEnabled(item));
//         if (item.pncUseIcon) {
//             this.drawIcon(item.iconIndex
//                 , rect.x + this.itemPadding()
//                 , rect.y + this.itemPadding());
//         }
//         this.changePaintOpacity(1);
//     }
// };

// Window_ItemPointNClick.prototype.itemWidth = function () {
//     return Zetu.PointNClick.InventoryItemWidth + 2 * this.itemPadding();
// };
// Window_ItemPointNClick.prototype.itemHeight = function () {
//     return Zetu.PointNClick.InventoryItemHeight + 2 * this.itemPadding();
// };
// Window_ItemPointNClick.prototype.lineHeight  = function() {
//     return this.itemHeight;
// };
// Window_ItemPointNClick.prototype.colSpacing = function () {
//     return 0;
// };
// Window_ItemPointNClick.prototype.rowSpacing = function () {
//     return 0;
// };
// Window_ItemPointNClick.prototype.maxCols = function () {
//     return this._data ? this._data.length : 1;
// };
// Window_ItemPointNClick.prototype.itemPadding = () => 4;
// #endregion

// // #region Window_PointNClick


// Window_PointNClick.prototype.itemHeight = function() {
//     return this.innerHeight;
// };

// Window_PointNClick.prototype.update = function () {
//     this.updateInput();
// }

// Window_PointNClick.prototype.updateInput = function () {
//     if (this.interpreterRunning) return;
//     if (TouchInput.isTriggered()) {
//         let x = this.touchX();
//         let y = this.touchY();
//         if (!x || !y) return;
//         for (var i = Zetu.PointNClick.Current.Items.length - 1; i >= 0; i--) {
//             let item = Zetu.PointNClick.Current.Items[i];
//             if (item.performClick(x, y)) return;
//         }
//         if ($gameCursor.getDockItem()) {
//             $gameCursor.setDockItem(null, false);
//             $gameTemp.reserveCommonEvent(Zetu.PointNClick.ItemDefaultEvent);
//         }
//     }
// }

// Window_PointNClick.prototype.createContents = function () {
//     const width = this.contentsWidth();
//     const height = this.contentsHeight();
//     this.destroyContents();
//     this.contents = new Bitmap(width, height);
//     //this.contentsBack = new Bitmap(width, height);
//     this.resetFontSettings();
//     this.drawItems();
// }

// Window_PointNClick.prototype.drawItems = function () {
//     Zetu.PointNClick.Current.Items.forEach((item) => {
//         item.refresh();
//         if (item.visible)
//             this.contents.blt(item.bitmap, 0 ,0, 
//             item.bitmap.width, item.bitmap.height, item.x, item.y);
//     });
// }

// // Window_PointNClick.prototype.refresh = function() {
// //     this.createContents();
// // }
// #endregion

// // #region Game_Player
// (alias => Game_Player.prototype.triggerAction = function() {
//     if (alias.apply(this, arguments)) {
//         $gameCursor.setDockItem(null, false);
//         return true;
//     }
//     return false;
// })(Game_Player.prototype.triggerAction);
// #endregion

// // #region Game_Interpreter
// (alias => Game_Interpreter.prototype.update = function() {
//     alias.apply(this, arguments);
//     const itemUsage = Zetu.PointNClick.ItemUsage;
//     if (itemUsage > 0 && $gameCursor.getDockItem() == null) itemUsage.SetGameVariable(0);
// })(Game_Interpreter.prototype.update);
// #endregion

// // #region Game_PointNClickObject
// function Game_PointNClickObject() {
//     this.initialize(...arguments);
// };

// Game_PointNClickObject.loadCommandObject = function (args) {
//     var obj = Zetu.extend({}, args);
//     obj = Zetu.parse(obj);
//     obj.Items = obj.Items.map(item => new Game_PointNClickObject(item));
//     Zetu.PointNClick.Current = obj;
//     return obj;
// };

// const preloadCommand = function(command) {
//     var args = command.parameters[3];
//     var obj = Game_PointNClickObject.loadCommandObject(args);
//     obj.Items.forEach((item) => {
//         if (item.Picture) ImageManager.loadPicture(item.Picture);
//     });
// };

// // Without this, events with pictures will possibly be blank on first entry
// Game_PointNClickObject.preloadCache = function (events, commonEvents) {
//     events
//         .flatMap((event) => event.event().pages)
//         .flatMap((page) => page.list.slice(0, 200))
//         .filter((command) => command.code == 357)
//         .forEach(preloadCommand);
//     commonEvents
//         .flatMap((commonEvent) => commonEvent.list().slice(0, 200))
//         .filter((command) => command.code == 357)
//         .forEach(preloadCommand);
// }

// Game_PointNClickObject.prototype.initialize = function(item) {
//     this.collisions = {};
//     this.tileId = parseInt(item.TileId) || 0;
//     this.iconId = parseInt(item.IconId) || 0;
//     this.picture = item.Picture;
//     this.pictureFrames = parseInt(item.PictureFrames) || 1;
//     this.pictureFrameIndexVariable = parseInt(item.PictureFrameIndex);
//     this.index = 0;
//     this.x = parseInt(item.X) || 0;
//     this.y = parseInt(item.Y) || 0;
//     this.zoom = parseFloat(item.Zoom);
//     this.switchId = parseInt(item.Switch) || 0;
//     this.switchState = item.SwitchState == "true";
//     this.isReady = false;
//     this.bitmap = this.newBitmap();
//     this.commonEventId = parseInt(item.CommonEventId) || 0;
//     this.inventoryToItems = {};
//     item.InventoryToItems.forEach(i => this.inventoryToItems[i.ItemUsed] = i.CommonEventId);
//     this.refresh();
// }

// Game_PointNClickObject.prototype.newBitmap = function () {
//     if (this.tileId > 0) {
//         var tileset = $dataTilesets[$gameMap.tilesetId()];
//         var page = Math.floor(this.tileId / 256);
//         var tilesetName = tileset.tilesetNames[page + 5];
//         var index = this.tileId - (page * 256);
//         var N = $gameMap.tileWidth(), M = $gameMap.tileHeight();
//         var ox = index % 8;
//         var oy = Math.floor(index / 8);
//         if (oy > 16) {
//             ox += 16;
//             oy -= 16;
//         }
//         ox *= N;
//         oy *= M;
//         var height = Math.floor(N * this.zoom);
//         var width = Math.floor(M * this.zoom);
//         var bitmap = new Bitmap(height, width);
//         var image = ImageManager.loadTileset(tilesetName);
//         bitmap.blt(ImageManager.loadTileset(tilesetName), ox, oy, N, M, 0, 0, height, width);
//         return bitmap;
//     }
//     if (this.iconId > 0) {
//         var N = ImageManager.iconWidth, M = ImageManager.iconWidth;
//         var ox = this.tileId % 16;
//         var oy = Math.floor(this.tileId / 16);
//         ox *= N;
//         oy *= M;
//         var width = Math.floor(N * this.zoom);
//         var height = Math.floor(M * this.zoom);
//         var bitmap = new Bitmap(width, height);
//         bitmap.blt(ImageManager.loadSystem("IconSet"), ox, oy, N, M, width, height);
//         return bitmap;
//     }
//     if (this.picture) {
//         var image = ImageManager.loadPicture(this.picture);
//         if (this.pictureFrames <= 1) {
//             var bitmap = new Bitmap(Math.floor(image.width * this.zoom), Math.floor(image.height * this.zoom));
//             bitmap.blt(image,
//                 0,0,image.width,image.height,
//                 0,0,bitmap.width,bitmap.height);
//             return bitmap;
//         }
//         var width = Math.floor(image.width / this.pictureFrames);
//         var index = $gameVariables.value(this.pictureFrameIndexVariable);
//         var bitmap = new Bitmap(Math.floor(width * this.zoom), Math.floor(image.height * this.zoom));
//         bitmap.blt(image, width * index, 0, width, image.height
//             , 0, 0, bitmap.width, bitmap.height);
//         return bitmap;
//     }
//     throw new Error("Could Not Find Bitmap for an Item in the Scene");
// }

// Game_PointNClickObject.prototype.tilesetName = function () {
//     var tileset = $dataTilesets[$gameMap.tilesetId()];
//     var tilesetIndex = (this.tileId / 256) + 5;
//     return tileset[tilesetIndex];
// }

// Game_PointNClickObject.prototype.tileIndex = function () {
//     return this.tileId % 256;
// }

// Game_PointNClickObject.prototype.checkCollision = function(x, y) {
//     if (!this.visible) return false;
//     var cx = x - this.x;
//     var cy = y - this.y;
//     if (cx < 0) return false;
//     if (cy < 0) return false;
//     if (cx >= this.bitmap.width) return false;
//     if (cy >= this.bitmap.height) return false;
//     let alpha = this.bitmap.getAlphaPixel(cx, cy);
//     return alpha > 0;
// }

// Game_PointNClickObject.prototype.performClick = function (x, y) {
//     if (this.checkCollision(x, y)) {
//         const item = $gameCursor.getDockItem();
//         var commonEvent;
//         //if (item.commonEventId <= 0) continue;
//         if (!item && this.commonEventId && this.commonEventId > 0) {
//             $gameCursor.setDockItem(null, false);
//             $gameTemp.reserveCommonEvent(this.commonEventId);
//             return true;
//         }
//         //inventoryToItems
//         if (item && (commonEvent = this.inventoryToItems[item.id])) {
//             $gameCursor.setDockItem(null, false);
//             $gameTemp.reserveCommonEvent(commonEvent);
//             return true;
//         }
//     }
//     return false;
// }

// Game_PointNClickObject.prototype.checkVisibilityState = function () {
//     if (this.switchId > 0 && $gameSwitches.value(this.switchId) != this.switchState) return false;
//     return true;
// }

// Game_PointNClickObject.prototype.update = function () {
//     this.visible = this.checkVisibilityState();
// }

// Game_PointNClickObject.prototype.refresh = function () {
//     this.bitmap.destroy();
//     this.bitmap = this.newBitmap();
// }

// Game_PointNClickObject.prototype.isChanged = function() {
//     if (this.visible != this.checkVisibilityState()) return true;
//     if (this.pictureFrames > 0 
//         && !!this.picture && this.tileId == 0 && this.iconId == 0
//         && $gameVariables.value(this.pictureFrameIndexVariable) != this.index) return true;
//     return false;
// }
// #endregion

// // #region Spriteset_Cursor - Zetu_MZ_Cursor
// (alias => Spriteset_Cursor.prototype.generateCursor = function (options) {
//     if (options.CursorImage == Zetu.PointNClick.DockCursor.ImageCursor) {
//         return this.dock = new Sprite_DockCursor(options);
//     }
//     return alias.apply(this, arguments);
// })(Spriteset_Cursor.prototype.generateCursor);

// (alias => Spriteset_Cursor.prototype.updateHover = function () {
//     var cursor;
//     if (SceneManager._scene instanceof Scene_PointNClick) {
//         const x = $gameMap.canvasToMapX(TouchInput.x);
//         const y = $gameMap.canvasToMapY(TouchInput.y);
//         const events = $gameMap.eventsXy(x, y);
//         events.forEach(event => cursor ||= event.page().cursorHover);
//     }
//     if (!cursor) alias.apply(this, arguments);
//     else if (!this.hover || this.hover.name != cursor) this.hover = this.getCursorByName(cursor);
// })(Spriteset_Cursor.prototype.updateHover);

// Spriteset_Cursor.prototype.getDockItem = function () {
//     return this.dock.getItem();
// };

// Spriteset_Cursor.prototype.setDockItem = function (item, resetVariable = true) {
//     this.dock.setItem(item);
//     const itemUsage = Zetu.PointNClick.ItemUsage;
//     if (itemUsage > 0 && item) itemUsage.SetGameVariable(item.id);
//     else if (itemUsage > 0 && resetVariable) itemUsage.SetGameVariable(0);
// };

// (alias => Spriteset_Cursor.prototype.cursorMode = function () {
//     if (!this.dock) return null;
//     if (this.dock.item) {
//         return this.dock;
//     }
//     return alias.apply(this, arguments);
// })(Spriteset_Cursor.prototype.cursorMode);
// #endregion

// // #region Sprite_DockCursor * Sprite_Cursor
// function Sprite_DockCursor () {
//     this.initialize(...arguments);
// }

// Sprite_DockCursor.prototype = Object.create(Sprite_Cursor.prototype);
// Sprite_DockCursor.prototype.constructor = Sprite_DockCursor;

// Sprite_DockCursor.prototype.initialize = function (options) {
//     Sprite_Cursor.prototype.initialize.call(this, options);
//     this.addChild(this.dock = new Sprite());
//     this.dock.x = Zetu.PointNClick.DockCursor.ChildOx;
//     this.dock.y = Zetu.PointNClick.DockCursor.ChildOy;
//     this.item = null;
// };

// Sprite_DockCursor.prototype.update = function () {
//     Sprite_Cursor.prototype.update.call(this);
// }

// Sprite_DockCursor.prototype.setItem = function (item) {
//     if (item == this.item) return;
//     if (item == null) {
//         this.dock.bitmap = null;
//     } else if (item.pncUseIcon) {
//         this.setIcon(item.iconIndex);
//     } else if (item.pncUsePicture) {
//         this.setPicture(item.pncUsePicture);
//     }
//     this.item = item;
// };

// Sprite_DockCursor.prototype.getItem = function () {
//     return this.item;
// };

// Sprite_DockCursor.prototype.setIcon = function (iconIndex) {
//     const width = ImageManager.iconWidth;
//     const height = ImageManager.iconHeight;
//     const x = (iconIndex % 16) * width;
//     const y = Math.floor(iconIndex / 16) * height;
//     this.dock.bitmap = ImageManager.loadSystem("IconSet");
//     this.dock.bitmap.addLoadListener(() => {
//         this.dock.setFrame(x, y, width, height);
//     });
// };

// Sprite_DockCursor.prototype.setPicture = function (pictureName) {
//     this.dock.bitmap = ImageManager.loadPicture(pictureName);
//     const width = this.dock.bitmap.width;
//     const height = this.dock.bitmap.height;
//     this.dock.setFrame(0, 0, width, height);
// };
// #endregion
