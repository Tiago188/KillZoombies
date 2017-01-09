/*global createjs, kz, queue, scn_game_ctn*/
/**
 * @module KillZoombies
 */

// namespace:
this.kz = this.kz || {};

(function () {
    "use strict";

    var p;

    function Scene(data) {
        this.Container_constructor();

        // Remove Scenes
        if (data.removeScenes) {
            this.removeScenes(data.removeScenes);
        }

        // Add Background
        if (data.background) {
            this.addBackground(data.background);
        }

        // Buttons
        if (data.buttons) {
            this.addButton(data.buttons);
        }

        kz.stage.addChild(this);
        kz.stage.update();

        return this;
    }

    p = createjs.extend(Scene, createjs.Container);

    /**
     * Add background in the scene.
     * @method addBackground
     **/
    p.addBackground = function (data) {
        var image = kz.queue.getResult(data[0]),
            background = new createjs.Bitmap(image);

        this.addChild(background);

        if (data[2]) {
            background.y = kz.SCREENHEIGHT * data[2] / 100;
        }

        if (data[1]) {
            background.x = kz.SCREENWIDTH * data[1] / 100;
        }
    };

    /**
     * Add button in the scene.
     * @method addButton
     **/
    p.addButton = function (data) {
        var button,
            button_sprite,
            i = 0,
            image;

        for (i; i < data.length; i += 1) {
            button = data[i];
            image = kz.queue.getResult(button.image);
            button_sprite = new createjs.Bitmap(image);

            if (button.posX) {
                button_sprite.x = kz.SCREENWIDTH * button.posX / 100;
            } else {
                button_sprite.x = 0;
            }


            if (button.posY) {
                button_sprite.y = kz.SCREENHEIGHT * button.posY / 100;
            } else {
                button_sprite.y = 0;
            }

            // Button Listener
            if (button.type) {
                button_sprite.on(button.type, button.func);
            }

            this.addChild(button_sprite);
        }
    };

    /**
     * remove scenes.
     * @method removeScenes
     **/
    p.removeScenes = function (data) {
        var i;

        for (i = 0; i < data.length; i += 1) {
            if (data[i]) {
                kz.stage.removeChild(data[i]);
            }
        }
    };

    kz.Scene = createjs.promote(Scene, 'Container');
}());
