/*global kz*/
/**
 * @module KillZoombies
 */

// namespace:
this.kz = this.kz || {};

(function () {
    "use strict";

    function Utils() {
        //
    }

    Utils.prototype.changePos = function (obj, positions) {
        var lm = 0,
            rm = 0,
            tm = 0,
            bm = 0;

        if (positions.x) {
            obj.x = positions.x;
        }

        if (positions.y) {
            obj.y = positions.y;
        }

        if (positions.lm) {
            lm = positions.lm;
        } else if (positions.rm) {
            rm = positions.rm;
        }

        if (positions.tm) {
            tm = positions.tm;
        } else if (positions.bm) {
            bm = positions.bm;
        }

        if (positions.lx) {
            obj.x = lm;
        } else if (positions.rx) {
            obj.x = kz.SCREENWIDTH - rm;
        }

        if (positions.ty) {
            obj.y = tm;
        } else if (positions.by) {
            obj.y = kz.SCREENHEIGHT - bm;
        }
    };

    kz.Utils = kz.Utils || new Utils();
}());
