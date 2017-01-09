/*global kz*/
/**
 * @module KillZoombies
 */

// namespace:
this.kz = this.kz || {};

(function () {
    "use strict";

    function Collider() {
        //
    }

    Collider.prototype.hitTest = function (obj, objTarget) {
        var horizontal_collide = false,
            vertical_collide = false,
            obj1 = {},
            obj2 = {},
            p;

            obj1.xmin = obj.x - obj.regX * Math.abs(obj.scaleX);
            obj1.xmax = obj1.xmin + obj.getBounds().width * Math.abs(obj.scaleX);
            obj1.ymin = obj.y - obj.regY * obj.scaleY;
            obj1.ymax = obj1.ymin + obj.getBounds().height * obj.scaleY;

            if (objTarget.type && objTarget.type == 'house') {
                p = objTarget.parent.localToGlobal(objTarget.x, objTarget.y);
                obj2.x = p.x;
                obj2.y = p.y;
            } else {
                obj2.x = objTarget.x;
                obj2.y = objTarget.y;
            }

            obj2.xmin = obj2.x - objTarget.regX * Math.abs(objTarget.scaleX);
            obj2.xmax = obj2.xmin + objTarget.getBounds().width  * Math.abs(objTarget.scaleX);
            obj2.ymin = obj2.y - objTarget.regY * objTarget.scaleY;
            obj2.ymax = obj2.ymin + objTarget.getBounds().height * objTarget.scaleY;

            /*
            var o = new createjs.Shape();
            o.graphics.setStrokeStyle(1);
            o.graphics.beginStroke("#000000");
            o.graphics.beginFill("red");
            o.graphics.drawRect(obj1.xmin, obj1.ymin, obj.getBounds().width * Math.abs(obj.scaleX), obj.getBounds().height * obj.scaleY);
            o.graphics.endFill();
            o.alpha = 0.05;

            var t = new createjs.Shape();
            t.graphics.setStrokeStyle(1);
            t.graphics.beginStroke("#000000");
            t.graphics.beginFill("green");
            t.graphics.drawRect(obj2.xmin, obj2.ymin, objTarget.getBounds().width  * Math.abs(objTarget.scaleX), objTarget.getBounds().height * objTarget.scaleY);
            t.graphics.endFill();
            t.alpha = 0.05;

            kz.stage.addChild(o, t);
            */



        //if ((obj1.xmin >= obj2.xmin && obj1.xmin <= obj2.xmax) || (obj1.xmin <= obj2.xmin && obj1.xmax >= obj2.xmin)) {
        if (obj1.xmin <= obj2.xmax && (obj1.xmax >= obj2.xmin || obj1.xmax >= obj2.xmax)) {
            horizontal_collide = true;
        }

        if ((obj1.ymin >= obj2.ymin && obj1.ymin <= obj2.ymax) || (obj1.ymin <= obj2.ymin && obj1.ymax >= obj2.ymin)) {
            vertical_collide = true;
        }

        return horizontal_collide;// && vertical_collide;
    };

    kz.Collider = kz.Collider || new Collider();
}());
