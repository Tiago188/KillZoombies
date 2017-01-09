/*global createjs, kz, queue, scn_game_ctn*/
/**
 * @module KillZoombies
 */

// namespace:
this.kz = this.kz || {};

(function () {
    "use strict";

    var p;

    function loop(event) {
        //
    }

    function Zoombie(data) {
        var armature,
            display,
            player,
            that;

        data.texture = kz.queue.getResult(data.texture);
        //data.textureData = kz.queue.getResult(data.textureData);
        data.textureData = kz.bonesAssets.zoombieTex;
        //data.skeletonData = kz.queue.getResult(data.skeletonData);
        data.skeletonData = kz.bonesAssets.zoombieSke;

        this.CreatejsFactory_constructor();

        this.addTextureAtlas(new dragonBones.TextureAtlas(data.texture, data.textureData));
    	this.addDragonBonesData(dragonBones.DataParser.parseDragonBonesData(data.skeletonData));

        //var img:Image = new Image(Assets.getAtlas().getTexture(skeletonData.getArmatureData("map").boneNames[i]));
        //img.width = img.texture.width;

        //create armature
    	armature = this.buildArmature(data.skeletonData.armature[0].name);
    	display = armature.getDisplay();
        //console.log(display.getBounds());
        //console.log(Object.getOwnPropertyNames(display));
    	//play
    	armature.animation.gotoAndPlay('idle');
        armature.animation.play();

        display.scale = 0.25;
    	display.ax = 0;
        display.x = Math.random() * (kz.level.distance - 450) + 400;
        display.regX = display.getBounds().width/2;
        display.regY = display.getBounds().height;
        kz.Utils.changePos(display, {by: true, bm: 120});
    	//display.y = this.y = kz.SCREENHEIGHT * 79 / 100;
        display.direction = Math.round(Math.random() * 2) -1;

        if (display.direction) {
            display.scaleX = display.scale * display.direction;
        }else {
            display.scaleX = display.scale;
        }

        display.scaleY = display.scale;
        display.width = display.getBounds().width * display.scaleX;
    	display.height = display.getBounds().height * display.scaleY;
    	display.speed = kz.level.speed * (Math.random() * 0.3 + 0.1);
    	display.mobile = false;
    	display.outfit = false;
    	display.status = '';
    	display.range = Math.random() * 100 + 200;
    	display.life = 100;
        display.fatigue = 0;
        display.fatigueMax = Math.random() * 100 + 60;

    	display.armature = armature;

        //armature.factory = this;

    	//add armature to clock
    	dragonBones.WorldClock.clock.add(armature);

    	kz.scenes.game.addChild(display);

        display.attacked = function () {
            this.diffX = ((this.x - player.x) * player.direction) - (this.width/2 + player.width/2);

            //Math.abs(this.x - player.x) <= player.weapon.distance
            if (this.diffX >= 0 && this.diffX <= player.weapon.distance) {
                if (player.status === 'shoot') { // && (player.direction !== this.direction)
                    this.life -= player.weapon.damage;

                    if (this.status !== 'attacked') {
                        this.status = 'attacked';
                        this.armature.animation.gotoAndPlay('attacked');
                    }

                    this.mobile = false;
                }
            }
        };

        display.chase = function () {
            if (Math.abs(this.x - kz.player.display.x) <= this.range) {
                if (!kz.Collider.hitTest(this, kz.player.display)) {
                    if ((this.x - this.width/2) > (kz.player.display.x + kz.player.display.width)) {
                        this.direction = -1;
                        this.scaleX = -this.scale;
                    } else if ((this.x + this.width/2) < (kz.player.display.x - kz.player.display.width)) {
                        this.direction = 1;
                        this.scaleX = this.scale;
                    }

                    this.mobile = true;
                } else {
                    //this.mobile = false;
                    //this.direction = 0;
                    if (this.status !== 'eat') {
                        this.status = 'eat';
                        this.armature.animation.gotoAndPlay('eat');
                    }

                    this.mobile = false;

                    kz.player.display.life--;
                }
            }
        };

        display.walk = function (delta) {
            if (Math.abs(this.x - this.moveTo) <= 0) {
                this.mobile = false;
            }

            if (this.mobile) {
                this.x += delta * this.speed * this.direction;

                if (this.status !== 'walk') {
                    this.status = 'walk';
                    this.armature.animation.gotoAndPlay('walk');
                }
            } else if (this.status !== 'eat') {
                this.moveTo = this.x + (Math.round(Math.random() * 2) -1) * this.fatigueMax;
                if (this.x > this.moveTo) {
                    this.direction = -1;
                    this.scaleX = -this.scale;
                } else {
                    this.direction = 1;
                    this.scaleX = this.scale;
                }

                this.mobile = true;
            }
        };

        display.collidedScreen = function () {
            if (this.x >= kz.level.distance) {
                this.direction = -1;
                this.scaleX = -this.scale;
            } else if(this.x < 0) {
                this.direction = 1;
                this.scaleX = this.scale;
            }
        };

        display.addEventListener('tick', function (event) {
    		if ( !createjs.Ticker.paused && event.delta ) {
                that = event.target;
                player = kz.player.display;

                if (kz.player.display.life > 0) {
                    if (that.life > 0) {
                        that.walk(event.delta);

                        if (kz.player.display.visible == true) {
                            that.chase();
                            that.attacked();
                        } else {
                            that.mobile = true;
                        }

                        that.collidedScreen();
                    } else {
                        if (that.status !== 'death') {
                            that.status = 'death';
                            that.armature.animation.gotoAndPlay('death');
                            kz.zoombies_deads++;
                            //event.remove();
                            if (kz.zoombies_deads >= kz.level.zoombies) {
                                kz.mnu_level_complete();
                            }
                        }
                    }

        			if ( that.direction !== 0 ) {
                        /*
        				if ( that.ax >= 0 && ( that.ax <= kz.level.distance - 50 ) ) {
        					that.ax += event.delta * that.speed * that.direction;
        					that.mobile = true;
        				}
                        */

                        /*
        				if ( that.ax < 0 ) {
        					that.ax = 0;
        					//that.mobile = false;
        				}
        				else if ( that.ax > kz.level.distance - 140 ) {
        					that.ax = kz.level.distance - 140;
        					//that.mobile = false;
        				}
                        */
        			}
        		}

                //if (that.direction == 0 || !that.mobile && that.status !== 'eat') {
                if (that.life > 0) {
                    if (!that.mobile && that.status !== 'eat' || kz.player.display.life == 0 && that.life > 0) {
                        if (that.status !== 'idle') {
                            that.status = 'idle';
                            that.armature.animation.gotoAndPlay('idle');
                        }

                        //that.direction = 0;
                    }
                }

                if (kz.player.display.mobile) {
                    that.x += event.delta * kz.player.display.speed * -kz.player.display.direction;
                }
            }
            //armatureDisplay.delta = event.delta;
    	});

        return this.display;
    }

    p = createjs.extend(Zoombie, dragonBones.CreatejsFactory);

    /**
     * Returns a string representation of this object.
     * @method toString
     * @return {String} a string representation of the instance.
     **/
    /*
    p.show = function () {
        this.visible = true;
    };
    */

    kz.Zoombie = createjs.promote(Zoombie, 'CreatejsFactory');
}());
