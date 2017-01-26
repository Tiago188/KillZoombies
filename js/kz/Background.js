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

            that.boundsGlobal = that.parent.localToGlobal(that.x, that.y);

            if (event.delta && kz.player && kz.player.display.mobile) {
                that.x += event.delta * that.speed * kz.player.display.direction * -1;
            }
//console.log(that.x);
            if (that.x < -that.imageWidth) {
                //that.x = that.images * that.imageWidth;
                that.x = 0;
            } else if (that.x > 0) {
                that.x = -that.imageWidth;
            }
        }
    }

    function Background(data) {
        var cover,
            i = 0,
            imageData = kz.queue.getResult(data.type),
            image,
            imageTemp,
            images = 0;

        this.Container_constructor();

        //this.y = kz.SCREENHEIGHT * data.posY / 100;
        kz.Utils.changePos(this, {by: true, bm: data.posY});

        this.speed = kz.level.speed * data.speed;

        //this.speed = kz.level.speed * (this.y / kz.SCREENHEIGHT);
        image = new createjs.Bitmap(imageData);
        this.imageWidth = image.getBounds().width;
        this.images = Math.ceil((kz.SCREENWIDTH * 2) / this.imageWidth);
        //this.covers = covers;

        for (i; i < this.images; i++) {
            if (i > 0) {
                imageTemp = image.clone();
            }
            else {
                imageTemp = image;
            }

            imageTemp.x = imageTemp.getBounds().width * i -(1 * i);
            this.addChild(imageTemp);
        }

        kz.scenes.game.addChild(this);

        this.addEventListener('tick', loop);

        kz.stage.update();

        return this;
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
