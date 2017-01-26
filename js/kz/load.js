// namespace:
this.kz = this.kz || {};

// Load Game ===================================================================
kz.load = function () {
    createjs.Sound.alternateExtensions = ["mp3"]; // now if ogg is not supported, SoundJS will try asset0.mp3
    //createjs.Sound.on("fileload", handleSoundLoad); // call handleLoad when each sound loads
    //createjs.Sound.on("complete", handleSoundsLoad); // call handleLoad when each sound loads
    //createjs.Sound.registerSounds(sounds, "assets/audio/");

    kz.queue = new createjs.LoadQueue();
    //kz.queue.setPreferXHR = false;
    //kz.queue = new createjs.LoadQueue(true, assetsPath); //var assetsPath = "assets/";
    kz.queue.installPlugin(createjs.Sound);
    kz.queue.on("complete", handleComplete, this);
    kz.queue.on("progress", updateLoading);
    kz.queue.on("fileload", handleFileLoaded);
    kz.queue.on("error", handleError);
    
    
    
    var messageField = new createjs.Text("Loading", "bold 24px Arial", "#000000");
	messageField.maxWidth = 1000;
	messageField.textAlign = "center";
	messageField.textBaseline = "middle";
	messageField.x = kz.stage.canvas.width / 2;
	messageField.y = kz.stage.canvas.height / 2;
	kz.stage.addChild(messageField);
	kz.stage.update(); 	//update the stage to show text
    
    

    function handleFileLoaded(event) {
        var item = event.item;
        //window.alert('Loaded: '+item.id);
    }

    function handleError(event) {
        var item = event.data;
        //window.alert(item.id);
    }

    function updateLoading(event) {
        messageField.text = "Loading " + (kz.queue.progress * 100 | 0) + "%";
        kz.stage.update();
        //window.alert(kz.queue.progress);
        console.log(kz.queue.progress);
	}

    var manifest = [
        {"src":"assets/bg_main.jpg", "id":"bg_main_menu"},
        {"src":"assets/bg_win.jpg", "id":"bg_win"},
        {"src":"assets/bg_over.jpg", "id":"bg_over"},
		{"src":"assets/bg_pause.jpg", "id":"bg_pause_menu"},
		{"src":"assets/btn_play.jpg", "id":"btn_play"},
		{"src":"assets/btn_options.jpg", "id":"btn_options"},
		{"src":"assets/btn_credits.jpg", "id":"btn_credits"},
		{"src":"assets/btn_back.jpg", "id":"btn_back"},
		{"src":"assets/btn_menu.jpg", "id":"btn_menu"},
		{"src":"assets/btn_continue.jpg", "id":"btn_continue"},
		{"src":"assets/bg_options.jpg", "id":"bg_options_menu"},
		{"src":"assets/bg_credits.jpg", "id":"bg_credits_menu"},
		{"src":"assets/btn_menu.jpg", "id":"bg_characteres_menu"},
		{"src":"assets/btn_pause.png", "id":"btn_pause"},
		{"src":"assets/btn_move.png", "id":"btn_move"},
		{"src":"assets/btn_shoot.png", "id":"btn_shoot"},
		{"src":"assets/characters/character1_tex.png", "id":"character1_tex"},
		{"src":"assets/characters/character1_tex.json", "id":"character1_tex_data"},
		{"src":"assets/characters/character1_ske.json", "id":"character1_ske_data"},
		{"src":"assets/zoombie/zoombie_tex.png", "id":"zoombie_tex"},
		{"src":"assets/zoombie/zoombie_tex.js", "id":"zoombie_tex_data"},
		{"src":"assets/zoombie/zoombie_ske.js", "id":"zoombie_ske_data"},
		{"src":"assets/player.png", "id":"character_player"},
		{"src":"assets/spider.png", "id":"character_spider"},
		{"src":"assets/house1.png", "id":"house1"},
		{"src":"assets/house1.png", "id":"house2"},
		{"src":"assets/bg_ground.png", "id":"bg_ground"},
		{"src":"assets/bg_street.png", "id":"bg_street"},
		{"src":"assets/bg_trees.png", "id":"bg_trees"},
		{"src":"assets/bg_city_front.png", "id":"bg_city_front"},
		{"src":"assets/bg_city_middle.png", "id":"bg_city_middle"},
		{"src":"assets/bg_city_back.png", "id":"bg_city_back"},
		{"src":"assets/bg_sun.png", "id":"bg_sun"}
    ];

    /*
    ,
        {"src":"assets/audio/enter-menu.ogg", "id":"main_sound"},
		{"src":"assets/audio/jenison.ogg", "id":"level_sound"},
		{"src":"assets/audio/shotgun.ogg", "id":"player_shotgun"}
    */
    /*
    var sounds = [
        {
            "id":"main_sound",
            "src": {
                "mp3": "enter-menu.mp3",
                "ogg": "enter-menu.ogg"
            }
        },
        {
            "id":"level_sound",
            "src": {
                "mp3": "jenison.mp3",
                "ogg": "jenison.ogg"
            }
        },
		{
            "id":"player_shotgun",
            "src": {
                "mp3": "shotgun.mp3",
                "ogg": "shotgun.ogg"
            }
        }
    ];
    */
 
    //createjs.Sound.addEventListener("fileload", createjs.proxy(handleSoundsLoad, this));
    //createjs.Sound.registerSounds(sounds, "assets/audio/");

    function handleSoundLoad(event) {
        console.log(event);
    }

    function handleSoundsLoad(event) {
        console.log("all loadeds");
    }
    /*
        ,
		{"src":"assets/audio/enter-menu.mp3", "id":"main_sound"},
		{"src":"assets/audio/jenison.mp3", "id":"level_sound"},
		{"src":"assets/audio/shotgun.mp3", "id":"player_shotgun"}
    */
	//kz.queue.loadFile({id: 'assets', src: 'js/assets.json'});
    //kz.queue.loadManifest("path/to/manifest.json");
    kz.queue.loadManifest("js/manifest.json");

    //kz.queue.loadManifest(manifest);
    kz.queue.loadFile({id: "config", src: "js/config.json"});

    /*
    kz.queue.on("complete", function () {
        console.log("scn_game");
    }, this);
*/

    //kz.queue.loadManifest('assets/manifest.json');

    function handleComplete(event) {
        /*
        var width = screen.height,
            height = screen.width,
            screenRatio,
            realWidth,
            realHeight;
        */

        event.remove();

        kz.stage.removeChild(messageField);

        kz.queue.on("complete", kz.scn_game, this);
        //kz.queue.off("complete", handleComplete);
		//createjs.Sound.play("sound");
        /*
		var image = kz.queue.getResult("myImage");
		document.body.appendChild(image);
		*/

        /*
        if (width > height) {
            realWidth = width;
            realHeight = height;
            screenRatio = height / width;
        }
        else {
            realWidth = height;
            realHeight = width;
            screenRatio = width / height;
        }

        if (isNaN(screenRatio)) {

            if (window.innerHeight > window.innerWidth) {
                realWidth = window.innerHeight;
                realHeight = window.innerWidth;
                screenRatio = window.innerWidth / window.innerHeight;
            }
            else{ 
                realWidth = window.innerWidth;
                realHeight = window.innerHeight;
                screenRatio = window.innerHeight / window.innerWidth;
            }
        }
        */

		kz.SCREENHEIGHT = kz.stage.canvas.height;
		kz.SCREENWIDTH  = kz.stage.canvas.width;
        //kz.SCREENHEIGHT = realHeight;
		//kz.SCREENWIDTH  = realWidth;

        kz.config = kz.queue.getResult('config');
        /*
        $.getJSON("js/config.json", function(data){
            console.log(data);
            kz.config = data;
            kz.scn_main();
        }); 
        */
/*
        kz.config = {
            "characters": ["player", "spider"],
            "weapons": {
                "shotgun": {
                    "damage": 20,
                    "distance": 180,
                    "magsize": 1,
                    "rechard": 20
                }
            },
            "level_current": 1,
            "level_previous": 0
        };
*/
		kz.scn_main();
	}
}
