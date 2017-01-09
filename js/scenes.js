/*global createjs, kz*/
/**
 * @module KillZoombies
 */

// namespace:
this.kz = this.kz || {};

(function () {
    "use strict";

    kz.scenes = {};
    kz.sounds = {
        main_sound: null,
        level_sound: null,
        player_death: null,
        player_shoot: null,
        zombie: null,
    };

    // Main ====================================================================
    kz.scn_main = function () {
        /*
        if(createjs.Sound.loadComplete('main_sound')) {
            createjs.Sound.play('main_sound');
        }
        */
        //createjs.Sound.removeAllSounds();
        //|| kz.sounds.main_sound.playState !== createjs.Sound.PLAY_SUCCEEDED

        if (!kz.sounds.main_sound) {
            kz.sounds.main_sound = createjs.Sound.play('main_sound');
        }

        kz.scenes.main = new kz.Scene({
            background: ['bg_main_menu'],
            buttons: [
                {
                    image: 'btn_play',
                    type: 'mousedown',
                    func: kz.scn_characters,
                    posX: 40,
                    posY: 15
                },
                {
                    image: 'btn_options',
                    type: 'mousedown',
                    func: kz.scn_options,
                    posX: 40,
                    posY: 45
                },
                {
                    image: 'btn_credits',
                    type: 'mousedown',
                    func: kz.scn_credits,
                    posX: 40,
                    posY: 75
                }
            ],
            removeScenes: [
                kz.scenes.credits,
                kz.scenes.game,
                kz.scenes.options
            ]
        });
    }

    // Options =================================================================
    kz.scn_options = function () {
        kz.scenes.options = new kz.Scene({
            background: ['bg_options_menu'],
            buttons: [
                {
                    image: 'btn_back',
                    type: 'mousedown',
                    func: kz.scn_main,
                    posX: 5,
                    posY: 75
                }
            ],
            removeScenes: [
                kz.scenes.credits,
                kz.scenes.main
            ]
        });
    }

    // Credits =================================================================
    kz.scn_credits = function () {
        kz.scenes.credits = new kz.Scene({
            background: ['bg_credits_menu'],
            buttons: [
                {
                    image: 'btn_back',
                    type: 'mousedown',
                    func: kz.scn_main,
                    posX: 40,
                    posY: 75
                }
            ],
            removeScenes: [
                kz.scenes.main,
                kz.scenes.options
            ]
        });
    }

    // Characteres =============================================================
    kz.scn_characters = function () {
        kz.scenes.characters = new kz.Scene({
            background: ['bg_main_menu'],
            buttons: [
                {
                    image: 'btn_play',
                    type: 'mousedown',
                    func: kz.scn_game,
                    posX: 40,
                    posY: 75
                }
            ],
            removeScenes: [
                kz.scenes.main,
                kz.scenes.options
            ]
        });

        (function () {
            var character,
                file,
                i = 0;

            for (i; i < kz.config.characters.length; i++) {
                file = kz.queue.getResult('character_' + kz.config.characters[i]);
                character = new createjs.Bitmap(file);
                character.name = kz.config.characters[i];
                character.scaleX = 0.4;
                character.scaleY = 0.4;
                character.x = 40 + 100 * i;
                character.y = 200;

                character.addEventListener('mousedown', function (event) {
                    kz.character = event.target.name;
                });

                kz.scenes.characters.addChild(character);
            }

            kz.stage.addChild(kz.scenes.characters);
            kz.stage.update();
        }());
    }

    // Game ====================================================================
    kz.scn_game = function () {
        console.log("GAME");
        //createjs.Sound.stop('main_sound');
        //createjs.Sound.stop('jenison');
        //if(createjs.Sound.loadComplete(mySound) {
        //createjs.Sound.play('jenison');

        if (kz.config.level_previous != kz.config.level_current) {
            kz.config.level_previous = kz.config.level_current;
            kz.queue.loadFile({id: "level", src: "js/levels/level" + kz.config.level_current + ".js"});
            //kz.queue.loadFile({id: "level", src: "js/levels/level" + kz.config.level_current + ".json", type: createjs.AbstractLoader.JSON});
            return true;
        }

        //kz.level = kz.queue.getResult('level');

        kz.level.weapon = kz.config.weapons.shotgun;
        kz.zoombies_deads = 0;

        createjs.Sound.stop();

        if (!kz.sounds.level_sound) {
            //createjs.Sound.play("music", {interrupt: createjs.Sound.INTERRUPT_NONE, loop: -1, volume: 0.4});
            kz.sounds.level_sound = createjs.Sound.play('level_sound');//, {interrupt: createjs.Sound.INTERRUPT_NONE, loop: 0, volume: 0.4});
            //kz.sounds.level_sound = createjs.Sound.play('kaikai');
        }

        kz.scenes.game = new kz.Scene({
            //background: ['bg_credits_menu'],
            removeScenes: [
                kz.scenes.main,
                kz.scenes.characters
            ]
        });

        createjs.Ticker.paused = false;

        kz.addWorld();
        kz.addPlayer();
        kz.addZoombie();
        kz.addHUD();
    };

    // Game Win ================================================================
    kz.scn_game_win = function () {
        kz.scenes.game_win = new kz.Scene({
            background: ['bg_win'],
            buttons: [
                {
                    image: 'btn_menu',
                    type: 'mousedown',
                    func: kz.scn_main,
                    posX: 40,
                    posY: 75
                }
            ],
            removeScenes: [
                kz.scenes.game,
                kz.scenes.mnu_level_complete
            ]
        });
    };

    // Game Over ===============================================================
    kz.scn_game_over = function () {
        kz.scenes.game_over = new kz.Scene({
            background: ['bg_over'],
            buttons: [
                {
                    image: 'btn_menu',
                    type: 'mousedown',
                    func: kz.scn_main,
                    posX: 40,
                    posY: 75
                }
            ],
            removeScenes: [
                kz.scenes.game,
                kz.scenes.mnu_level_complete
            ]
        });
    };

    // Pop-up menus ============================================================
    kz.mnu_pause = function () {
    	console.log("PAUSE MENU");
        kz.scenes.mnu_pause = new kz.Scene({
            background: ['bg_pause_menu', 20, 15],
            buttons: [
                {
                    image: 'btn_continue',
                    type: 'mousedown',
                    func: function () {
                		kz.stage.removeChild(kz.scenes.mnu_pause);
                		createjs.Ticker.paused = false;
                	},
                    posX: 20,
                    posY: 15
                },
                {
                    image: 'btn_options',
                    type: 'mousedown',
                    func: function () {
                		console.log('MENU OPCOES GAME');
                	},
                    posX: 20,
                    posY: 45
                },
                {
                    image: 'btn_menu',
                    type: 'mousedown',
                    func: function () {
                		kz.stage.removeChild(kz.scenes.mnu_pause);
                		console.log('REMOVE GAME');
                        createjs.Sound.stop();
                        kz.sounds.main_sound.play();
                		kz.scn_main();
                	},
                    posX: 20,
                    posY: 75
                }
            ]
        });
    }

    // Pop-up level complete ===================================================
    kz.mnu_level_complete = function () {
        console.log("LEVEL COMPLETE MENU");
        createjs.Ticker.paused = true;
        kz.config.level_current++;
        
        if (kz.config.level_current> 2) {
            kz.scn_game_win();
        }

        kz.scenes.mnu_level_complete = new kz.Scene({
            background: ['bg_pause_menu', 20, 15],
            buttons: [
                {
                    image: 'btn_menu',
                    type: 'mousedown',
                    func: function () {
                        kz.stage.removeChild(kz.scenes.mnu_level_complete);
                        createjs.Sound.stop();
                        kz.sounds.main_sound.play();
                        kz.scn_main();
                    },
                    posX: 20,
                    posY: 15
                },
                {
                    image: 'btn_play',
                    type: 'mousedown',
                    func: function () {
                        kz.stage.removeChild(kz.scenes.mnu_level_complete);
                        kz.stage.removeChild(kz.scenes.game);
                        kz.scn_game();
                        console.log('RESTART');
                    },
                    posX: 20,
                    posY: 45
                },
                {
                    image: 'btn_continue',
                    type: 'mousedown',
                    func: function () {
                        kz.stage.removeChild(kz.scenes.mnu_level_complete);
                        kz.scn_game();
                        //createjs.Ticker.paused = false;
                        console.log('CONTINUE');
                    },
                    posX: 20,
                    posY: 75
                }
            ]
        });
    };

        // Pop-up level complete ===================================================
    kz.mnu_game_over = function () {
        console.log("GAME OVER MENU");
        createjs.Ticker.paused = false;

        kz.scenes.mnu_game_over = new kz.Scene({
            background: ['bg_pause_menu', 20, 15],
            buttons: [
                {
                    // retry
                    image: 'btn_play',
                    type: 'mousedown',
                    func: function () {
                        kz.stage.removeChild(kz.scenes.mnu_game_over);
                        kz.stage.removeChild(kz.scenes.game);
                        kz.scn_game();
                        console.log('RESTART');
                    },
                    posX: 20,
                    posY: 15
                },
                {
                    image: 'btn_menu',
                    type: 'mousedown',
                    func: function () {
                        kz.stage.removeChild(kz.scenes.mnu_game_over);
                        createjs.Sound.stop();
                        kz.sounds.main_sound.play();
                        kz.scn_main();
                    },
                    posX: 20,
                    posY: 45
                }
            ]
        });
    };

    function pop_buyer() {

    }

    // HUD =========================================================================
    kz.addHUD = function () {
    	console.log("PAUSE MENU");
        kz.game_hud = new kz.HUD({
            buttons: [
                {
                    image: 'btn_pause',
                    type: 'mousedown',
                    func: function () {
                		if ( !createjs.Ticker.paused ) {
                            createjs.Ticker.paused = true;
                			kz.mnu_pause();
                		}
                	},
                    pos: {rx: true, ty: true, rm: 80, tm: 20},
                    posX: 90,
                    posY: 5
                },
                // Button left
                {
                    image: 'btn_move',
                    funcs: [
                        {
                            type: 'mousedown',
                            func: function () {
                        		if ( kz.player.display.life > 0 && kz.player.display.visible && !createjs.Ticker.paused ) {
                        			kz.player.display.direction = -1;
                        			kz.player.display.scaleX = -kz.player.scale;
                                    kz.player.display.mobile = true;
                                    kz.player.display.status = 'walk';
                        			kz.player.animation.gotoAndPlay('walk');
                        		}
                        	}
                        },
                        {
                            type: 'pressup',
                            func: function () {
                        		if ( kz.player.display.life > 0 && !createjs.Ticker.paused ) {
                        			//kz.player.display.direction = 0;
                                    kz.player.display.mobile = false;
                        			kz.player.display.status = 'idle';
                        			kz.player.animation.gotoAndPlay('idle');
                        		}
                        	}
                        }
                    ],
                    pos: {lx: true, by: true, lm: 20, bm: 80},
                    posX: 5,
                    posY: 85
                },
                // Button right
                {
                    image: 'btn_move',
                    funcs: [
                        {
                            type: 'mousedown',
                            func: function () {
                        		if ( kz.player.display.life > 0 && kz.player.display.visible && !createjs.Ticker.paused ) {
                        			kz.player.display.direction = 1;
                        			kz.player.display.scaleX = kz.player.scale;
                                    kz.player.display.mobile = true;
                                    kz.player.display.status = 'walk';
                        			kz.player.animation.gotoAndPlay('walk');
                        		}
                        	}
                        },
                        {
                            type: 'pressup',
                            func: function () {
                        		if ( kz.player.display.life > 0 && !createjs.Ticker.paused ) {
                        			//kz.player.display.direction = 0;
                                    kz.player.display.mobile = false;
                                    kz.player.display.status = 'idle';
                        			kz.player.animation.gotoAndPlay('idle');
                        		}
                    	    }
                        }
                    ],
                    pos: {lx: true, by: true, lm: 120, bm: 80},
                    posX: 15,
                    posY: 85
                },
                {
                    image: 'btn_shoot',
                    type: 'mousedown',
                    func: function () {
                		if ( kz.player.display.life > 0 && !createjs.Ticker.paused ) {
                            kz.player.display.shoot();
                		}
                	},
                    pos: {rx: true, by: true, rm: 80, bm: 80},
                    posX: 85,
                    posY: 85
                }
            ]
        });

        kz.scenes.game.addChild(kz.game_hud);
    }
}());
