/*:
 * @target MZ
 * @plugindesc Zetu MZ Advanced DamageFormulas
 * @author Zetu/DrJosephJorgen
 * @help Help Text
 * @url https://github.com/DrJojoVT/Zetu-MZ
 * 
 * ---------------------------------------------------------------
 *
 * @param DamageFormulas
 * @text Damage Formulas
 * @type struct<DamageFormula>[]
 * @default []
 * 
 */
/*~struct~DamageFormula:
 *
 * @param FunctionName
 * @text Function Name
 * @type string
 * @default functionName
 * 
 * @param FunctionBody
 * @text Formula
 * @type multiline_string
 */

Zetu.setupHeader("ZetuMZ_1_AdvancedDamageFormulas")
    .setNamespace("DamageFormulas")
    .requires("ZetuMZ_0_Core");

Zetu.DamageFormulas.forEach((formula) =>
    Game_Action.prototype[formula[FunctionName]] = function() {
        return eval(formula.FunctionBody);
    }
);