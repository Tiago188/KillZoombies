/*global createjs, kz, queue, scn_game_ctn*/
/**
 * @module KillZoombies
 */

// namespace:
this.kz = this.kz || {};

(function () {
    "use strict";

    var p;

    function HUD(data) {
        this.Scene_constructor({});

        if (data.buttons) {
            this.addButton(data.buttons);
        }

        return this;
    }

    p = createjs.extend(HUD, kz.Scene);

    /**
     * Add button in the scene.
     * @method addButton
     **/
    p.addButton = function (data) {
        var button,
            button_sprite,
            i = 0,
            j = 0,
            image;

        for (i; i < data.length; i += 1) {
            button = data[i];
            image = kz.queue.getResult(button.image);
            button_sprite = new createjs.Bitmap(image);

            /*
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
            */

            kz.Utils.changePos(button_sprite, button.pos);

            // Button Listener

            if (button.funcs) {
                for (j = 0; j < button.funcs.length; j += 1) {
                    // event type, function
                    button_sprite.on(button.funcs[j].type, button.funcs[j].func);
                }
            } else if (button.type) {
                button_sprite.on(button.type, button.func);
            }

            this.addChild(button_sprite);
        }
    };

    kz.HUD = createjs.promote(HUD, 'Scene');
}());
