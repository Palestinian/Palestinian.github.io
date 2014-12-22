(function ($) {
    $.widget('li.swipeable', {
        initSelector: ":jqmData(swipeable='true'):not(:jqmData(inset='true'))",
        vars: {
            swipeTime: 0,
            clickable: true
        },
        defaults: {
            buttons: [{
                text: "Trash",
                class: "delete",
                callback: {
                    event: "click",
                    todo: function () {
                        console.log("click");
                    }
                }
            }, {
                text: "Hello",
                class: "flag",
                callback: {
                    event: "click",
                    todo: function () {
                        console.log("hello");
                    }
                }
            }]
        },
        options: {},
        _create: function () {
            var list = this,
                isLink = list.element.find("a").length > 0 ? true : false,
                swipeableClasses = isLink ? "jqm-swipeable jqm-swipeable-clickable" : "jqm-swipeable jqm-swipeable-read";
            list.element.addClass(swipeableClasses);
            list.refresh();
        },

        _getChildrenByTagName: function (ele, lcName, ucName) {
            var results = [],
                dict = {};
            dict[lcName] = dict[ucName] = true;
            ele = ele.firstChild;
            while (ele) {
                if (dict[ele.nodeName]) {
                    results.push(ele);
                }
                ele = ele.nextSibling;
            }
            return $(results);
        },

        refresh: function () {
            var pos, numli, item,
            list = this.element,
                swipeableElm = this.element.children("li:not(.li-swipeable)"),
                li = this._getChildrenByTagName(list[0], "li", "LI");
            var html = $();
            for (var x = 0; x < this.defaults.buttons.length; x++) {
                var text = this.defaults.buttons[x].text,
                    btnClass = this.defaults.buttons[x].class,
                    event = this.defaults.buttons[x].callback.event,
                    todo = this.defaults.buttons[x].callback.todo;
                html = html.add("<span class=" + btnClass + "><p class='btn'>" + text + "</p></span>");
            }
            li.not(".li-swipeable").addClass("li-swipeable").prepend(html.clone());

            var delBtn = swipeableElm.find(".delete"),
                flagBtn = swipeableElm.find(".flag");
            this._on(delBtn, {
                click: "_handleDelBtn"
                // tap: "_handleDelBtn"
            });

            this._on(flagBtn, {
                click: "_handleFlagBtn"
                // tap: "_handleFlagBtn"
            });

            this._on(swipeableElm, {
                swipe: "_handleSwipe",
                click: "_handleClick",
                tap: "_handleClick"
            });

            list.listview("refresh");
            this._trigger("refresh");
        },

        _handleSwipe: function (event) {
            this.vars.swipeTime = event.timeStamp;
            this.vars.clickable = Math.abs(event.swipestart.coords[0] - event.swipestop.coords[0]) < 20 ? true : false;
            var swiped = $(event.target),
                swipeType = event.swipestart.coords[0] > event.swipestop.coords[0] ? "left" : "right",
                prevSwipe = this.element.find(".li-swipeable-open");
            if (!(swiped in prevSwipe) && prevSwipe.length > 0) {
                this.close(prevSwipe.find("a"));
            }

            if (swipeType == "left") {
                if (this._trigger("beforeopen", null, {
                    element: swiped.parent(),
                    index: swiped.parent().index()
                }) !== false) {
                    this.open(swiped);
                }
            } else {
                this._trigger("beforeclose", null, {
                    element: swiped.parent(),
                    index: swiped.parent().index()
                });
                this.close(swiped);
            }
        },

        _handleClick: function (event) {
            var clicked = $(event.target),
                timeDiff = event.timeStamp - this.vars.swipeTime;
            if ($.support.touch) {
                if (!this.vars.clickable || clicked.offset().left < 0) {
                    clicked.blur();
                    return false;
                }
            } else if (clicked.offset().left < 0 || timeDiff < 800) {
                clicked.blur();
                return false;
            }
        },
        _handleDelBtn: function (event) {
            var button = $(event.target),
                listview = this.element;
            console.log(button.parent());
            $(".ui-content").css({
                overflow: "hidden"
            });
            button.closest("li").css({
                display: "block"
            }).animate({
                opacity: 0
            }, {
                duration: 250,
                queue: false
            }).animate({
                height: 0
            }, 300, function () {
                $(this).remove();
                listview.listview("refresh");
                $(".ui-content").removeAttr("style");
            });
        },
        _handleFlagBtn: function (event) {
            console.log(event);
        },
        open: function (swiped) {
            swiped = typeof swiped == "object" ? swiped : $(swiped);
            swiped.prevAll("span").addClass("show");
            swiped.blur().css({
                transform: "translateX(-140px)"
            }).parent().addClass("li-swipeable-open");
        },

        close: function (swiped) {
            swiped = typeof swiped == "object" ? swiped : $(swiped);
            swiped.prevAll("span").removeClass("show");
            swiped.blur().css({
                transform: "translateX(0)"
            }).parent().removeClass("li-swipeable-open");
            this.vars.clickable = true;
        },
        _getCreateEventData: function () {},
        create: function () {
            return this.element;
        }
    });
})(jQuery);
