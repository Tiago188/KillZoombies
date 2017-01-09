/*
 * SpriteSheet
 * Visit http://kmoficial.com/projects/games/html5/killzoombies for documentation, updates and examples.
 *
 * Copyright (c) 2010 gskinner.com, inc.
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPliED, INCLUDING BUT NOT liMITED TO THE WARRANTIES
 * OF MERCHANTABIliTY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HolDERS BE liABLE FOR ANY CLAIM, DAMAGES OR OTHER liABIliTY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEAliNGS IN THE SOFTWARE.
 */

/**
 * @module KillZoombies
 */

// namespace:
this.kz = this.kz || {};

// Main Game ===================================================================
kz.init = function () {
/*
  alert(location.pathname);  // /tmp/test.html
  alert(location.hostname);  // localhost
  alert(location.search);    // ?blah=2
  alert(document.URL);       // http://localhost/tmp/test.html?blah=2#foobar
  alert(location.href);      // http://localhost/tmp/test.html?blah=2#foobar
  alert(location.protocol);  // http:
  alert(location.host);      // localhost
  alert(location.origin);    // http://localhost
  alert(location.hash);      // #foobar
*/
    /*
    var wr = window.resolveLocalFileSystemURL(cordova.file.applicationDirectory, onSuccess, onError);
    console.log(wr);
    window.alert(wr);
    */
	kz.stage = new createjs.Stage('canvas', false, false);
    createjs.Touch.enable(kz.stage);
    createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.HTMLAudioPlugin, createjs.CordovaAudioPlugin]);

	kz.stage.mouseEventsEnabled = true;

    kz.stage.canvas.width = window.innerWidth;
    kz.stage.canvas.height = window.innerHeight;
    
    kz.bonesAssets = {};

	kz.load();

	// Ticker
	createjs.Ticker.addEventListener('tick', handleTick);
    createjs.Ticker.setFPS(60);
	function handleTick(event) {
		if ( !createjs.Ticker.paused ) {
            //console.log(createjs.Ticker.getMeasuredFPS());
			dragonBones.WorldClock.clock.advanceTime(event.delta * 0.001);
	        kz.stage.update(event);
		}
    }
}

// Player
kz.addPlayer = function () {
	kz.player = new kz.Player({
        texture: 'player_tex',
        textureData: 'player_tex_data',
        skeletonData: 'player_ske_data'
    });

    kz.player.display.weapon = kz.level.weapon;
}

// Zoombie
kz.addZoombie = function () {
    var i = 0;

    kz.zoombies = [];

    for (i; i < kz.level.zoombies; i++) {
        kz.zoombies.push(new kz.Zoombie({
            texture: 'zoombie_tex',
            textureData: 'zoombie_tex_data',
            skeletonData: 'zoombie_ske_data'
        }));
    }
}

kz.addWorld = function () {
    var i = 0,
        layer;

	for (i; i < kz.level.layers.length; i += 1) {
        layer = kz.level.layers[i];

        switch (layer.layer_type) {
            case 'background':
                kz.scenes.game.addChild(new kz.Background(layer));
                break;
            case 'element':
                kz.scenes.game.addChild(new kz.Layer(layer));
                break;
            default:

        }
	}

	kz.stage.update();
}
