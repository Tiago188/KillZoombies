/*global createjs, kz, armatureDisplay, scn_game_ctn*/
/**
 * @module KillZoombies
 */

// namespace:
this.kz = this.kz || {};

(function () {
    "use strict";

    var that,
        p;

    function Element(image, posX) {
        image = kz.queue.getResult(image);

        this.Bitmap_constructor(image);

        //this.y = kz.SCREENHEIGHT * ry / 100;

        if (posX) {
            this.x = posX;
        }

        this.tick();

        return this;
    }

    p = createjs.extend(Element, createjs.Bitmap);

    /**
     * Returns a string representation of this object.
     * @method toString
     * @return {String} a string representation of the instance.
     **/
    p.tick = function () {
        this.addEventListener('tick', function loop(event) {
            if (!createjs.Ticker.paused) {
                that = event.target;

                // code here
            }
        });
    };

    kz.Element = createjs.promote(Element, 'Bitmap');
}());
