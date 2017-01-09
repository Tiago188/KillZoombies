/*global createjs, kz*/
/**
 * @module KillZoombies
 */

// namespace:
this.kz = this.kz || {};

(function () {
    "use strict";

    var that,
        p;

    function House(posX, posY, outfit) {
        //var image = kz.queue.getResult('house' + outfit);
        var image = 'house' + outfit;

        this.Element_constructor(image);
        this.Element_tick = null;

        //this.y = kz.SCREENHEIGHT * ry / 100;

        kz.Utils.changePos(this, {x: posX, by: true, bm: posY});
        this.scaleX = this.scaleY = 0.8;
        this.type = 'house';
        this.invaded = false;
        //var pt = p.localToGlobal(c2.x, c2.y);
        //alert("Stage x of c2: " + pt.x);

        this.addEventListener('pressup', function (event) {
            that = event.target;

            if (!createjs.Ticker.paused) {
                if (kz.Collider.hitTest(kz.player.display, that)) {
                    if (that.invaded) {
                        kz.player.display.visible = true;
                        that.invaded = false;
                    } else {
                        kz.player.display.visible = false;
                        that.invaded = true;
                    }
                }
            }
        });

        return this;
    }

    p = createjs.extend(House, kz.Element);

    /**
     * Returns a string representation of this object.
     * @method toString
     * @return {String} a string representation of the instance.
     **/
    /*
    p.tick = function () {
        //var that;
    };
    */

    kz.House = createjs.promote(House, 'Element');
}());

/*
Object.defineProperty(this, 'x', {
    get: function() {
        return 100;
    }
});
*/
