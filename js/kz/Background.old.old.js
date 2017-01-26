/*global createjs, kz, armatureDisplay, scn_game_ctn*/
/**
 * @module KillZoombies
 */

// namespace:
this.kz = this.kz || {};

(function () {
    "use strict";

    var that,
        bg_width,
        p;

    function loop(event) {
        if (!createjs.Ticker.paused) {
            that = event.target;
            bg_width = that.getBounds().width;
            if (event.delta && kz.player && kz.player.display.mobile) {
                //that.x += /*event.delta * that.speed*/8 * kz.player.display.direction * -1;
            }

            if (that.x < -bg_width) {
                that.x = that.covers * bg_width;
            } else if (that.x > (that.covers * bg_width)) {
                that.x = -bg_width;
            }
that.x += 2;
        }
    }

    function Background(data) {
        var cover,
            i = 0,
            image = kz.queue.getResult(data.type),
            covers = 0;

        this.Bitmap_constructor(image);

        //this.y = kz.SCREENHEIGHT * data.posY / 100;
        kz.Utils.changePos(this, {by: true, bm: data.posY});

        covers = Math.ceil((kz.SCREENWIDTH * 2) / this.getBounds().width);

        //this.speed = kz.level.speed * (this.y / kz.SCREENHEIGHT);
        this.speed = kz.level.speed * data.speed;
        this.covers = covers;

        for (i; i < covers; i++) {
            cover = this.clone();
            cover.x = cover.getBounds().width * (i + 1);
            cover.y = this.y;
            cover.speed = this.speed;
            cover.covers = covers;
            cover.addEventListener('tick', loop);

            kz.scenes.game.addChild(cover);
        }

        this.addEventListener('tick', loop);

        kz.stage.update();

        return this;
    }

    p = createjs.extend(Background, createjs.Bitmap);

    /**
     * Returns a string representation of this object.
     * @method toString
     * @return {String} a string representation of the instance.
     **/
    p.show = function () {
        this.visible = true;
    };

    kz.Background = createjs.promote(Background, 'Bitmap');
}());
