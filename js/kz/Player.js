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

    function Player(data) {
        var armature,
            that;

        data.texture = kz.queue.getResult(data.texture);
        data.textureData = kz.queue.getResult(data.textureData);
        //data.textureData = kz.bonesAssets.playerTex;
        data.skeletonData = kz.queue.getResult(data.skeletonData);
        //data.skeletonData = kz.bonesAssets.playerSke;

        this.CreatejsFactory_constructor();

        this.addTextureAtlas(new dragonBones.TextureAtlas(data.texture, data.textureData));
    	this.addDragonBonesData(dragonBones.DataParser.parseDragonBonesData(data.skeletonData));

        //var img:Image = new Image(Assets.getAtlas().getTexture(skeletonData.getArmatureData("map").boneNames[i]));
        //img.width = img.texture.width;

        //create armature
    	armature = this.buildArmature(data.skeletonData.armature[0].name);
    	this.display = armature.getDisplay();
        //console.log(this.display.getBounds());
        //console.log(Object.getOwnPropertyNames(this.display));
    	//play
    	armature.animation.gotoAndPlay('idle');
        this.display.status = 'idle';
        armature.animation.play();

        this.display.addEventListener(dragonBones.AnimationEvent.LOOP_COMPLETE, function(){
            // a block of code that is not executed
            console.log('COMPLETE');
        });

        //armature.scale = 0.25;
        armature.scale = 0.65;
        this.display.ax = 60;
    	this.display.x = this.display.ax;
        this.display.regX = this.display.getBounds().width/2;
        this.display.regY = this.display.getBounds().height;
        kz.Utils.changePos(this.display, {by: true, bm: 110});
    	//this.display.y = this.y = kz.SCREENHEIGHT * 79 / 100;
    	this.display.scaleX = armature.scale;
    	this.display.scaleY = armature.scale;
        this.display.width = this.display.getBounds().width * this.display.scaleX;
    	this.display.height = this.display.getBounds().height * this.display.scaleY;
    	//this.display.speed = kz.level.speed * ( this.display.y / kz.stage.canvas.height );
    	this.display.speed = kz.level.speed * 0.85;
        this.display.direction = 1;
    	this.display.mobile = false;
    	this.display.outfit = false;
    	this.display.life = 100;

        armature.factory = this;

    	//add armature to clock
    	dragonBones.WorldClock.clock.add(armature);

        this.display.changeOutfit = function (outfit) {
            var bones = [
                'head',
                'spine',
                'larm',
                'lforearm',
                'lhand',
                'rarm',
                'rforearm',
                'rhand',
                'lupleg',
                'lleg',
                'lfoot',
                'rupleg',
                'rleg',
                'rfoot'
            ],
            i = 0;

            for (i; i < bones.length; i++) {
                //armature.getSlot(bones[i]).setDisplay(armature.factory.getTextureDisplay(bones[i]+'_'+outfit));
            }
        };

        this.display.idle = function () {
            if (this.status !== 'idle') {
                console.log(2)
                this.status = 'idle';
                this.mobile = false;
                armature.animation.gotoAndPlay('idle');
            }
        };

        this.display.move = function (moveX, moveAx) {
            if (this.visible == true) {
                console.log(10);

                if (!moveAx) {
                    this.x += createjs.Ticker.delta * this.speed * this.direction;
                }

                if (!moveX) {
                    this.ax += createjs.Ticker.delta * this.speed * this.direction;
                    that.mobile = true;
                }
            } else {
                that.mobile = false;
            }
        };

        this.display.shoot = function () {
            if (this.visible == true) {
                console.log('PLAYER SHOOTED');
                //if (!kz.sounds.shotgun) {
                    kz.sounds.shotgun = createjs.Sound.play('player_shotgun');
                    //kz.sounds.shotgun = createjs.Sound.play('player_shotgun', {interrupt: createjs.Sound.INTERUPT_LATE, volume: 0.6});
                //}
                armature.animation.gotoAndPlay('shoot');
                this.status = 'shoot';
                //this.changeOutfit();
            }
        };

        this.display.addEventListener('tick', function (event) {
    		if ( !createjs.Ticker.paused && event.delta ) {
                that = event.target;

                if (that.life > 0) {
        			//if ( that.direction !== 0 ) {
                    if (kz.lastKey.key === 'BUTTONDOWN' && (createjs.Ticker.getTime() - kz.lastKey.time) > 200) {
                        that.mobile = true;

                        if (that.status !== 'walk') {
                            that.status = 'walk';
                            //that.display.direction = 1;
                            that.scaleX = that.direction !== 0 ? that.direction * armature.scale : that.scale;
                            armature.animation.gotoAndPlay('walk');
                        }
                    }

                    if (that.mobile) {
                        if ( that.ax >= 0 && ( that.ax <= kz.level.distance - 50 ) ) {
                            //that.ax += event.delta * that.speed * that.direction;
                            that.move(false, true);
                        }

                        if ( that.ax < 0 ) {
                            that.ax = 0;
                            that.mobile = false;
                        }
                        else if ( that.ax > kz.level.distance - 140 ) {
                            that.ax = kz.level.distance - 140;
                            that.mobile = false;
                        }

                        if ( that.mobile && ( that.ax < ( kz.stage.canvas.width/2 - 50 ) || that.ax > ( kz.level.distance - kz.stage.canvas.width/2 - 50 ) ) ) {
                            //that.x += event.delta * that.speed * that.direction;
                            that.move(true);
                        }
        			}
                } else if (that.status !== 'death') {
                    armature.animation.gotoAndPlay('death');
                    //createjs.Sound.play("death", {interrupt: createjs.Sound.INTERRUPT_ANY});
                    that.status = 'death';
                    that.mobile = false;
                    kz.scn_game_over();
                }

                if (that.status === 'shoot') {
                    that.status = 'idle';
                    that.mobile = false;
                }
    		}
    		//armatureDisplay.delta = event.delta;
    	});

        this.display.changeOutfit(kz.character);

    	kz.scenes.game.addChild(this.display);

        return armature;
    }

    p = createjs.extend(Player, dragonBones.CreatejsFactory);

    /**
     * Returns a string representation of this object.
     * @method toString
     * @return {String} a string representation of the instance.
     **/
    p.show = function () {
        this.visible = true;
    };

    kz.Player = createjs.promote(Player, 'CreatejsFactory');
}());
