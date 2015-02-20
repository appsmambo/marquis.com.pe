/**************************************************************************
 * HTML5 Video Background
 * @info: http://www.codegrape.com/item/html5-video-background/1306
 * @version: 1.0 (29.03.2012)
 * @requires: jQuery v1.7 or later (tested on 1.11.1)
 * @author: flashblue - http://www.codegrape.com/user/flashblue
**************************************************************************/

;(function($,undefined) {
	
	$.fn.extend({
		
		videoBG:function(options) {
			
			//Default values
			var defaults = {
				position:"absolute",
				zIndex:"-1",
				autoplay:true,
				loop:true,
				muted:false,
				
				//Video volume between 0 - 1
				videoVolume:1,
				
				//Aspect ratio
				aspectRatio:16/9, 	//width/height
				
				//Video type
				mp4:"",
				ogg:"",
				webm:"",
				flv:"",				
				
				//YouTube
				youtube:"",		   	//YouTube video ID
				start:0,
				
				//Poster
				poster:"",
				sizing:"fill",		//fill, adjust
				
				//Overlay
				overlayColor:"",
				overlayImage:"",
				overlayOpacity:1,
				
				//Parallax effect
				parallax:false,
				
				//Go to URL on video ended - You must set "loop:false" on top to run video ended event handler
				videoEndURL:"",
				
				//Video on finish function
				onFinish:function() {}
			};
	
			//Options
			var options = $.extend({}, defaults, options);			
			
			/*************************
			    - Video BG class -
			*************************/
			function VideoBG($obj, options) {
				
				//Variables
				this.container = $obj;				
				this.id = "";
				this.video;				
				this.videoW = 0;
				this.videoH = 0;
				this.duration = 0;
				this.objVideo;
				this.intervalId = null;				
				
				//Options
				this.opt = options;
				this.opt.videoType = "image";
				this.opt.hidden = false;
				this.opt.youTubeReady = false;
				
				//Layers
				this.videoHolder = $('<div class="video-bg-holder" />');
				this.videoOverlay = $('<div class="video-overlay" />');
				this.videoPreloader = $('<div class="video-preloader" />');
				
				//Mobile
				this.isMobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i) ? true : false;
				this.isApple = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)/i) ? true : false;
				this.supportsVideo = Modernizr.video && ((Modernizr.video.h264 && this.opt.mp4!=="") || 
														(Modernizr.video.ogg && this.opt.ogg!=="") || 
														(Modernizr.video.webm && this.opt.webm!==""));
				
				//Flash
				var playerVersion = swfobject.getFlashPlayerVersion();
				this.supportsFlash = playerVersion.major>9 && (this.opt.mp4!=="" || this.opt.flv!=="") ? true : false;
				
				//Object
				this.container.obj = this;
				
				//Init video
				this.init();		
			}
			
			VideoBG.prototype = {
				
				//Init video
				init:function() {
					var that = this;
					
					this.container.data("obj", this);
					
					//Video player id
					this.id = "video-bg-"+Math.round(Math.random()*1000+5);
					
					//Video on finish function
					var onFinish = typeof(this.opt.onFinish)=="function" ? this.opt.onFinish : function(){};
			
					//Append video on finish
					this.container.onFinish = onFinish;
					
					//Video holder
					this.videoHolder.appendTo(this.container).attr("id", this.id).css({
						"position": this.opt.position,
						"z-index": this.opt.zIndex
					});
					
					this.opt.videoType = "html5";
					this.createHTML5();

					//Create video player
					/*if (this.supportsVideo && !this.isApple) {		
						//HTML5 video
						this.opt.videoType = "html5";
						this.createHTML5();
					} else if (this.opt.youtube!="") {
						//YouTube video
						this.opt.videoType = "youtube";
						this.createYouTube();
					} else if (this.supportsFlash) {
						this.createFlash();
					} else {
						this.createImage();
					}*/
					
					//Add overlay
					if ((this.opt.overlayColor!="" || this.opt.overlayImage!="") && this.opt.videoType!="flash") {
						this.addOverlay();
					}
				},
				
				/**********************
				    - HTML5 video -
				**********************/
				
				//Create HTML5 video tag
				createHTML5:function() {
					var that = this;
					var src = "", type = "";
					
					//Preloader
					this.videoHolder.append(this.videoPreloader);
					
					//Video tag
					var attr =' preload="'+(this.isMobile ? "auto" : "metadata")+'"';
					
					if (this.opt.autoplay) {
						attr += ' autoplay';
					}
						
					if (this.opt.loop) {
						attr += ' loop';
					}
								
					var videoCode = '<video width="100%" height="100%" class="video-container" '+attr+'>';
					
					//mp4
					if (this.opt.mp4!="") {
						videoCode += '<source src="'+this.opt.mp4+'" type="video/mp4"></source>';
					}
					
					//ogg
					if (this.opt.ogg!="") {
						videoCode += '<source src="'+this.opt.ogg+'" type="video/ogg"></source>';
					}
					
					//webm
					if (this.opt.webm!="") {
						videoCode += '<source src="'+this.opt.webm+'" type="video/webm"></source>';
					}
					
					videoCode += '</video>';	
									 
					this.objVideo = $(videoCode);				 
					this.videoHolder.prepend(this.objVideo);
					this.video = this.objVideo.get(0);
					
					//Set video volume
					this.video.volume = !this.opt.muted ? this.opt.videoVolume : 0;						
					
					//Video event listeners
					this.video.addEventListener("loadedmetadata", function(e) {that.videoMetadata(e);}, false);
					this.video.addEventListener("waiting", function(e) {that.videoWaiting(e);});
					this.video.addEventListener("playing", function(e) {that.videoPlaying(e);});
					
					if(!this.isMobile) {
						this.video.addEventListener("ended", function(e) {that.videoEnded(e);}, false);
					} else {
						this.video.addEventListener("timeupdate", function(e) {that.videoTimeUpdate(e);}, false);
					}
					
					//Load video
					if(!this.isMobile) {
						this.video.load();
					} else {
						//Show video holder
						this.videoHolder.css("opacity", 1);
						
						//Create fake play button
						this.videoPlayClick(function() {
							that.video.load();
						});
					}			
				},
				
				//Video play button for mobile
				videoPlayClick:function(func) {
					try {
						var $a = $('<a href="#" id="videoPlayClick"></a>');
							
						$a.bind("click", function(e) {
							e.preventDefault();
							func();
						});
			
						$("body").append($a);
			
						var evt, el = $("#videoPlayClick").get(0);
			
						if (document.createEvent) {
							evt = document.createEvent("MouseEvents");
							if (evt.initMouseEvent) {
								evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
								el.dispatchEvent(evt);
							}
						} 
			
						$(el).remove();
					} catch(err) {
						//Load image if button click event not working
						this.createImage();
					}
				},
				
				//Video meta data
				videoMetadata:function(e) {
					this.video.removeEventListener("loadedmetadata", this.videoMetadata, false);
					
					var that = this;
					
					this.intervalId = setInterval(
						function() {
							//Video dimensions
							that.videoW = that.video.videoWidth;
							that.videoH = that.video.videoHeight;	
							that.duration = parseInt(that.video.duration);						
							
							if (that.videoW && that.videoH && that.duration>1) {
								clearInterval(that.intervalId);
								
								//Resize / Parallax
								that.callResizeParallax();
								
								//Show video holder
								that.videoHolder.css("opacity", 1);
								
								//Play video
								if(that.isMobile) {
									that.video.play();
								}
							}
						}
					, 100);
				},
				
				//Video ended
				videoEnded:function(e) {
					this.generateFinish();
				},
				
				//Video time update
				videoTimeUpdate:function(e) {
					if (this.duration>1 && this.video.currentTime>=(this.duration-1)) {
						if (this.opt.loop) {
							this.video.currentTime = 0;
							this.video.play();
						}
						
						this.generateFinish();
					}
				},
				
				//Video waiting
				videoWaiting:function(e) {
					this.videoPreloader.fadeIn();
				},
				
				//Video playing
				videoPlaying:function(e) {
					this.videoPreloader.fadeOut();
				},
				
				/************************
				    - YouTube video -
				************************/
				
				//Create YouTube video
				createYouTube:function() {
					var that = this;
					var html = $("html");
					this.video = $('<div id="'+this.id+'-yt" class="youtube-container"></div>').prependTo(this.videoHolder);
		
					this.opt.youTubeReady = false;
		
					if(!youTubeApiLoaded) {
						//Load YouTube API
						var httpprefix = location.protocol==="https:" ? "https:" : "http:";
						
						var tag = document.createElement("script");		
						tag.src = httpprefix+"//www.youtube.com/iframe_api";
						
						var firstScriptTag = document.getElementsByTagName("script")[0];
						firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
						
						this.intervalId = setInterval(
							function() {
								if (!youTubeApiLoaded) {							
									window.onYouTubeIframeAPIReady = function() {									
										clearInterval(that.intervalId);
										youTubeApiLoaded = true;
										that.buildYouTube();
									}
								} else {
									clearInterval(that.intervalId);
									that.buildYouTube();	
								}
							}
						, 100);
					} else if(youTubeApiLoaded) {
						this.buildYouTube();						
					}					
				},
				
				//Build YouTube video
				buildYouTube:function() {
					var that = this;
					
					var params = { 
						"loop":this.opt.loop ? 1 : 0, 
						"start":this.opt.start, 
						"autoplay":this.opt.autoplay ? 1 : 0, 
						"controls":0, 
						"showinfo":0, 
						"wmode":"transparent", 
						"iv_load_policy":3, 
						"modestbranding":1, 
						"rel":0
					};

					if(this.opt.loop) {
						params["playlist"] = this.opt.youtube; 
					}
		
					this.player = new YT.Player(this.id+"-yt", {
						width:"100%",
						height:"100%",
						playerVars:params,
						videoId:this.opt.youtube,
						events:{
							"onReady":function(e) {that.onPlayerReady(e);},
							"onStateChange":function(e) {that.onPlayerStateChange(e);}
						}
					});
				},
				
				//YouTube video ready event handler
				onPlayerReady:function(e) {
					this.opt.youTubeReady = true;
					this.objVideo = $("#"+this.id+"-yt");
					
					//Set volume
					this.player.setVolume(this.opt.videoVolume*100);
					
					//Mute
					if(this.opt.muted) {
						this.player.mute();
					}
					
					//Playback quality
					this.player.setPlaybackQuality("highres");
		
					//Resize / Parallax
					this.callResizeParallax();
					
					//Show video holder
					this.videoHolder.css("opacity", 1);
				},
				
				//YouTube video state change event handler
				onPlayerStateChange:function(e) {
					if (e.data==YT.PlayerState.ENDED) {
						this.generateFinish();
					}
				},
				
				/**********************
				    - Flash video -
				**********************/
				
				//Create Flash video player
				createFlash:function() {
					//Flash layer
					this.videoHolder.prepend('<div id="'+this.id+'-flash"></div>');
					
					//Create video SWF
					var flashvars = {
						videoUrl:"../"+(this.opt.mp4!="" ? this.opt.mp4 : this.opt.flv),
						fullSizeView:(this.opt.aspectRatio+1),
						defaultVolume:this.opt.videoVolume,
						overlay:this.opt.overlay,
						patternAlpha:this.opt.overlayOpacity,
						loop:this.opt.loop,
						muted:this.opt.muted,
						videoEndURL:this.opt.videoEndURL			
					};
					
					var params = {
						scale:"noscale",
						allowFullScreen:"true",
						menu:"false",
						bgcolor:"#000000",
						wmode:"transparent"
					};
					
					var attributes = {
						name:"video-bg-swf"
					};
					
					swfobject.embedSWF("flash/videobg.swf", this.id+"-flash", "100%", "100%", "9.0", null, flashvars, params, attributes, this.callbackFlash);
					
					//Show video holder
					this.videoHolder.css("opacity", 1);
				},
				
				//Callback Flash
				callbackFlash:function(e) {
					this.objVideo = $(e.target).get(0);
				},
				
				/*************************
				    - Fallback image -
				*************************/
				
				//Create image
				createImage:function() {
					if(this.opt.poster=="") {
						return;
					}
					
					var that = this;
					
					//Make image
					this.img = $('<img src="'+this.opt.poster+'" class="image-container" alt="" />').prependTo(this.videoHolder);
		
					//On Image load
					this.img.ensureLoad(function() {
						that.imageLoaded();
					});
				},
				
				//Image loaded event handler
				imageLoaded:function() {
					var that = this;
					
					this.imgW = this.img.width();
					this.imgH = this.img.height();
					
					//Window resize handler
					$(window).resize(function() {
						that.resizeImage();
					});
					
					//Resize video
					this.resizeImage();
					
					//Show video holder
					this.videoHolder.css("opacity", 1);
				},
				
				//Resize image
				resizeImage:function() {
					var winW = this.videoHolder.width();
					var winH = this.videoHolder.height();
					var w = 0, h = 0, x = 0, y = 0;
					
					w = winW;
					h = this.imgH/(this.imgW/winW);
		
					if( (this.opt.sizing=="adjust" && h>winH) || (this.opt.sizing=="fill" && h<winH) ){
						w = this.imgW/(this.imgH/winH);
						h = winH;
					}
		
					//Round
					w = Math.ceil(w);
					h = Math.ceil(h);
		
					//Adjust
					x = Math.round(winW/2-w/2);
					y = Math.round(winH/2-h/2);
		
					this.img.css({"width":w+"px", "height":h+"px", "left":x+"px", "top":y+"px"});
					
					this.resizeBoth(w, h);
				},
				
				/************************
				    - Miscellaneous -
				************************/
				
				//Overlay
				addOverlay:function() {
					if (this.opt.overlayColor) {
						this.videoOverlay.css("background-color", this.opt.overlayColor);
					}
					
					if (this.opt.overlayImage) {
						this.videoOverlay.css("background-image", "url("+this.opt.overlay+")");
					}
					
					this.videoOverlay.css("opacity", this.opt.overlayOpacity).appendTo(this.videoHolder);
				},
				
				//Parallax effect
				parallaxVideo:function() {
					var pos = parseInt(this.container.position().top);		
					var top = -parseInt((pos-$(window).scrollTop())/1.5);
					this.objVideo.css({top:top+"px"});
				},
				
				//Generate on finish
				generateFinish:function() {
					//Redirect to URL
					if (this.opt.videoEndURL!="") {
						this.goToUrl();
					}
					
					//On finish function
					this.container.onFinish.call(this);	
				},
				
				//Go to URL
				goToUrl:function() {
					window.location = this.opt.videoEndURL;
				},
				
				//Resize video
				resizeVideo:function(e) {
					var winW = this.videoHolder.width();
					var winH = this.videoHolder.height();
					var w = 0, h = 0, x = 0, y = 0;
					
					var w = winW;
					var h = winW/this.opt.aspectRatio;
		
					if(h<winH){
						w = winH*this.opt.aspectRatio;
						h = winH;
					}
		
					//Round
					w = Math.ceil(w);
					h = Math.ceil(h);
		
					//Adjust
					x = Math.round(winW/2-w/2);
					y = Math.round(winH/2-h/2);
					
					this.objVideo.attr("width", w);
					this.objVideo.attr("height", h);
					this.objVideo.css({"left":x+"px", "top":y+"px"});
					
					this.resizeBoth(w, h);
				},
				
				//Resize both video overlay and video holder
				resizeBoth:function(w, h) {
					//Resize overlay
					if (this.opt.overlayColor!="" || this.opt.overlayImage!="") {
						this.videoOverlay.css({width:w+"px", height:h+"px"});
					}
					
					//Reset video holder top position for parallax
					this.videoHolder.css({top:"0px"});	
				},
				
				//Call resize - parallax functions
				callResizeParallax:function() {
					var that = this;
					
					//Resize
					if (this.opt.aspectRatio) {
						//Window resize handler
						$(window).resize(function() {
							that.resizeVideo();
						});
						
						//Resize video
						this.resizeVideo();
					}
					
					//Parallax
					if (this.opt.parallax) {
						//Window scroll handler
						$(window).scroll(function() {
							that.parallaxVideo();
						});
						
						//Parallax effect
						this.parallaxVideo();
					}	
				}
				
			};
			
			//Create video bg
			var container = $(this);
			return this.each(function() {
				objVideoBG = new VideoBG($(this), options);
			});
			
		},
		
		/************************
			- API functions -
		************************/
		
		//Detect if video is playing
		videoBgIsPlaying:function() {
			var container = $(this);			
			var obj = container.data("obj");
			
			if(obj.opt.videoType=="html5") {
				return !obj.video.paused;
			} else if(obj.opt.videoType=="flash") {
				return obj.video.videoBgIsPlaying();
			} else if(obj.opt.videoType=="youtube" && obj.opt.youTubeReady) {
				return obj.player.getPlayerState()===1;
			}
			
			return false;
		},
		
		//Play
		videoBgPlay:function() {
			var container = $(this);			
			var obj = container.data("obj");
			
			if(obj.opt.videoType=="html5") {
				obj.video.play();
			} else if(obj.opt.videoType=="flash") {
				obj.video.resume();
			} else if(obj.opt.videoType=="youtube" && obj.opt.youTubeReady) {
				obj.player.playVideo();
			}
		},
		
		//Pause
		videoBgPause:function() {
			var container = $(this);			
			var obj = container.data("obj");
			
			if(obj.opt.videoType=="html5" || obj.opt.videoType=="flash") {
				obj.video.pause();
			} else if(obj.opt.videoType=="youtube" && obj.opt.youTubeReady) {
				obj.player.pauseVideo();
			}				
		},
		
		//Toogle play
		videoBgTogglePlay:function() {			
			if(this.videoBgIsPlaying()) {
				this.videoBgPause();
			} else {
				this.videoBgPlay();
			}
		},
		
		//Rewind
		videoBgRewind:function() {
			var container = $(this);			
			var obj = container.data("obj");
			
			if(obj.opt.videoType=="html5") {
				obj.video.currentTime = 0;
			} else if(obj.opt.videoType=="flash") {
				obj.video.rewind();
			} else if(obj.opt.videoType=="youtube" && obj.opt.youTubeReady) {
				obj.player.seekTo(0);
			}
		},
		
		//Detect if video is muted
		videoBgIsMuted:function() {
			var container = $(this);			
			var obj = container.data("obj");
			
			if(obj.opt.videoType=="html5") {
				return !obj.video.volume;
			} else if(obj.opt.videoType=="flash") {
				return obj.video.isMute();
			} else if(obj.opt.videoType=="youtube" && obj.opt.youTubeReady) {
				return obj.player.isMuted();
			}	

			return false;
		},

		//Mute
		videoBgMute:function() {
			var container = $(this);
			var obj = container.data("obj");
			
			if(obj.opt.videoType=="html5") {
				obj.video.volume = 0;
			} else if(obj.opt.videoType=="flash") {
				obj.video.mute();
			} else if(obj.opt.videoType=="youtube" && obj.opt.youTubeReady) {
				obj.player.mute();
			}
		},

		//Unmute
		videoBgUnMute:function() {
			var container = $(this);			
			var obj = container.data("obj");
			
			if(obj.opt.videoType=="html5") {
				obj.video.volume = obj.opt.videoVolume;
			} else if(obj.opt.videoType=="flash") {
				obj.video.unmute();
			} else if(obj.opt.videoType=="youtube" && obj.opt.youTubeReady) {
				obj.player.unMute();
			}
		},

		//Toogle sound
		videoBgToggleSound:function() {
			if(this.videoBgIsMuted()) {
				this.videoBgUnMute();
			} else {
				this.videoBgMute();
			}
		},

		//Show
		videoBgShow:function() {
			var container = $(this);
			var obj = container.data("obj");
			
			//Play
			this.videoBgPlay();

			obj.videoHolder.stop().fadeTo(700, 1);
			obj.opt.hidden = false;
		},
		
		//Hide
		videoBgHide:function() {
			var container = $(this);
			var obj = container.data("obj");
			
			//Pause
			this.videoBgPause();

			obj.videoHolder.stop().fadeTo(700, 0);
			obj.opt.hidden = true;
		},

		//Toogle hide
		videoBgToggleHide:function() {
			var container = $(this);
			var obj = container.data("obj");
			
			if(obj.opt.hidden) {
				this.videoBgShow();
			} else {
				this.videoBgHide();
			}
		}
	
	});
	
	//YouTube API state
	var youTubeApiLoaded = false;	
	
	//Internet Explorer version check
	var isIE = msieCheck(8);
	
	function msieCheck(ver) {
		var nAgt = navigator.userAgent;		
		if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
			var fullVersion = nAgt.substring(verOffset+5);
			var majorVersion = parseInt(fullVersion, 10);
			if (majorVersion <= ver) {
				return true;
			}			
		}		
		return false;
	}
	
	//Ensure images are loaded
	$.fn.ensureLoad = function(handler) {
		return this.each(function() {
			if(this.complete || this.readyState===4) {
				handler.call(this);
			} 
			
			//Check if data URI images is supported, fire 'error' event if not
			else if (this.readyState==="uninitialized" && this.src.indexOf("data:")===0) {
				$(this).trigger("error");
				handler.call(this);
			} else {
				$(this).one("load", handler);

				if(isIE && this.src!=undefined && this.src.indexOf("?")==-1) {
					this.src += "?"+(new Date().getTime());
				}
			}
		});
	};
		
})(jQuery);