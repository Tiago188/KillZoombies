/*global createjs, kz, armatureDisplay, scn_game_ctn*/
/**
 * @module KillZoombies
 */

// namespace:
this.kz = this.kz || {};

(function () {
    "use strict";

    var p;

    function Layer(element, ry) {
        var i = 0,
            outfit,
            posX,
            posY;

        this.Container_constructor();

        //this.y = kz.SCREENHEIGHT * element.posY / 100;

        //this.speed = kz.level.speed * (this.y / kz.SCREENHEIGHT);
        this.speed = kz.level.speed * element.speed;

        switch (element.type) {
            case 'house':
                for (i = 0; i < element.positions.length; i += 1) {
                    outfit = element.outfit;
                    posX = element.positions[i];
                    posY = element.posY;

                    this.addChild(new kz.House(posX, posY, outfit));
                }
                break;
            default:

        }

        this.tick();

        kz.stage.addChild(this);
        kz.stage.update();

        return this;
    }

    p = createjs.extend(Layer, createjs.Container);

    /**
     * Returns a string representation of this object.
     * @method toString
     * @return {String} a string representation of the instance.
     **/
    p.tick = function () {
        var that;

        this.addEventListener('tick', function loop(event) {
            if (!createjs.Ticker.paused) {
                that = event.target;

                if (event.delta && kz.player && kz.player.display.mobile) {
                    that.x += event.delta * that.speed * kz.player.display.direction * -1;
                }
            }
        });
    };

    kz.Layer = createjs.promote(Layer, 'Container');
}());
