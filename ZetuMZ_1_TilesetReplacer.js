/*:
 * @target MZ
 * @plugindesc Tileset Replacer
 * @author Zetu/DrJosephJorgen
 * @url https://github.com/DrJojoVT/Zetu-MZ
 * @help ZetuMZ_1_TilesetReplacer.js
 * 
 * BEFORE USING ! ! !
 * Go To: https://cdn.jsdelivr.net/npm/pixi-filters@latest/dist/browser/pixi-filters.min.js
 * Save File and add as plugins ABOVE this plugin.
 * 
 * @---------------------------------------------------------------
 * 
 * @param TilesetSize
 * @desc Tileset Size
 * @type number
 * @default 48
 * 
 * @param TilesetPairs
 * @desc Tilesets
 * @type struct<TilesetPair>[]
 * 
 */
/*~struct~TilesetPair:
 *
 * @param TilesetNormal
 * @desc Before Tileset
 * @type file
 * @dir img/tilesets/
 * 
 * @param TilesetReplace
 * @desc Replace Tileset
 * @type file
 * @dir img/tilesets/
 * 
 */