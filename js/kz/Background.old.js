/*global createjs, kz, armatureDisplay, scn_game_ctn*/
/**
 * @module KillZoombies
 */

// namespace:
this.kz = this.kz || {};

(function () {
    "use strict";

    var cover,
        that,
        bg_width = 0,
        p;

    function loop(event) {
        if (!createjs.Ticker.paused) {
            that = event.target;
            cover = that.cover;

            if (event.delta && kz.player && kz.player.display.mobile) {
                that.x += event.delta * that.speed * kz.player.display.direction * -1;
            }

            if (that.x < -bg_width) {
                that.x = 0;
            } else if (that.x > 0) {
                that.x = -bg_width;
            }
        }
    }

    function Background(data) {
        var image = kz.queue.getResult(data.type);

        this.Container_constructor(image);

        //this.y = kz.SCREENHEIGHT * data.posY / 100;
        kz.Utils.changePos(this, {by: true, bm: data.posY});

        this.background1 = new createjs.Bitmap(image);
        this.background2 = new createjs.Bitmap(image);

        this.addChild(this.background1, this.background2);

        this.background1.cover = this.background2;
        this.background2.cover = this.background1;

        this.background2.x = this.getBounds().width;

        bg_width = this.background1.getBounds().width;

        //this.speed = kz.level.speed * (this.y / kz.SCREENHEIGHT);
        this.speed = kz.level.speed * data.speed;
        /*
        this.speed = this.cover.speed = kz.level.speed * (this.y / kz.SCREENHEIGHT);

        this.cover = this.clone();
        this.cover.y = this.y;
        this.cover.cover = this;
        this.cover.x = this.x + this.getBounds().width;
        bg_width = this.getBounds().width;

        kz.scenes.game.addChild(this.cover);
        */

        this.addEventListener('tick', loop);
        //this.cover.addEventListener('tick', loop);
    }

    p = createjs.extend(Background, createjs.Container);

    /**
     * Returns a string representation of this object.
     * @method toString
     * @return {String} a string representation of the instance.
     **/
    p.show = function () {
        this.visible = true;
    };

    kz.Background = createjs.promote(Background, 'Container');
}());
