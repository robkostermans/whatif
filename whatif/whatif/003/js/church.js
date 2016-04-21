; (function ($, window, document, undefined) {

    "use strict";
    var pluginName = "church",
        defaults = {
            propertyName: "value"
        };

    function Plugin(element, options) {
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.transitionEnd = "webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend";
        this.init();
    }

    $.extend(Plugin.prototype, {
        init: function () {
            var plugin = this;
            this.initEvents();


            // if hash/deep link -> focus
            $(window).on("hashchange load", function () {
                plugin.setCurrentLevel.call(plugin, $(".level[data-id='"+window.location.hash.replace("#","")+"']"));
            });

            
        },

        initEvents: function () {
            var plugin = this;

            // SET current
            $(".level").on('click',function(){
                plugin.setCurrentLevel.call(plugin, this);
            })

            // HOME button
            $(".nav__button--home").on("click", function () {
                plugin.setCurrentLevel.call(plugin);
            })

            // UP BUTTON
            $(".nav__button--up").on("click", function () {
                var level_to_load = $(".level--current").next(".level");
                plugin.setCurrentLevel.call(plugin, level_to_load);
            })

            // DOWN BUTTON
            $(".nav__button--down").on("click", function () {
                var level_to_load = $(".level--current").prev(".level");
                plugin.setCurrentLevel.call(plugin, level_to_load);
            })

            // PIN click
            $(".pin").on('click', function (ev) {
                ev.preventDefault();
                plugin.showContent.call(plugin, this, ev)
            });
            
        },

        setCurrentLevel: function (level) {
            var plugin = this;

            // reset elements
            if (!$(level).hasClass("level--current")) {
                $('.level--current .level__pins').removeClass("level__pins--active");
                $(".level--current").removeClass("level--current");
                $(".surroundings").removeClass("surroundings--hidden")
                $(".canvas").removeClass("canvas--focused")
                $(".canvasnav").addClass("canvasnav--hidden");
            }

            // handle backbutton
            if ($(level).length == 0) {
                history.pushState('', '', '#home');
            } else {
                // set current level
                $(level).addClass("level--current");
                // push state
                if ("" + window.location.hash != "#" + $(level).attr("data-id")) {
                    history.pushState('', '', "#" + $(level).attr("data-id"));
                }
                // show pins on transitionend
                $(level).on(this.transitionEnd, function () {
                    $('.level--current .level__pins:not(.level__pins--active)').addClass("level__pins--active");
                })

                // focus and hide surroundings;
                $(".surroundings").addClass("surroundings--hidden")

                //
                $(".canvas").addClass("canvas--focused")
                $(".canvasnav").removeClass("canvasnav--hidden");

            }

            // animate other levels away according to relative position
            $(level).removeClass("level--hideup").removeClass("level--hidedown");
            $(level).nextAll(".level").addClass("level--hideup");
            $(level).prevAll(".level").addClass("level--hidedown");
            if ($(".level--current").length == 0) {
                $(".level").removeClass("level--hideup").removeClass("level--hidedown");
            }
        },
       
        showContent: function (pin, ev) {
            var plugin = this;

            var map__space = $(pin).attr("data-for");
            if ($(pin).attr("data-space") == $(".content__item--current").attr("data-space")) {
                $(".canvas").removeClass('canvas--content-open');
                $(".content__item--current").removeClass('content__item--current');
                $(".content__button").addClass('content__button--hidden');
                $(pin).removeClass('pin--active');
                $("#" + map__space).removeClass('map__space--selected');

            } else {
                // turn off current
                $(".map__space--selected").removeClass('map__space--selected');
                $(".pin--active").removeClass('pin--active');

                // turn on 
                $(".canvas").addClass('canvas--content-open');

               
                $(".content__item--current").removeClass('content__item--current');
                $(".content__item[data-space='" + $(pin).attr("data-space") + "']").addClass('content__item--current');

                $(".content__button").removeClass('content__button--hidden').off("click").on("click", function () {
                    plugin.showContent.call(plugin, pin, ev)

                });


                $(pin).addClass('pin--active');
               
                $("#" + map__space).addClass('map__space--selected');
            }
        }

    });

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" +
                    pluginName, new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);

$(document).ready(function () {
    $(".header").church();


    // gesure events
    var hammertime = new Hammer($(".main")[0]);

    hammertime.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
    hammertime.get('pinch').set({ enable: true });

    hammertime.on("swipeup swipedown pinchstart", function (ev) {
        if (ev.type == "swipeup") {
            $(".nav__button--down").trigger("click");
        } else if (ev.type == "swipedown") {
            $(".nav__button--up").trigger("click");
        } else if (ev.type == "pinchstart") {
            $(".nav__button--home").trigger("click");
        }
    });
    $(window).on('keyup', function (ev) {
        if (ev.keyCode == 40) {
            $(".nav__button--down").trigger("click");
        } else if (ev.keyCode == 38) {
            $(".nav__button--up").trigger("click");
        } else if (ev.keyCode == 27) {
            $(".nav__button--home").trigger("click");
        }
    });
    // up, down esc
   
});

