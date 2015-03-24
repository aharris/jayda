(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof root["J"] === 'undefined' || root["J"] !== Object(root["J"])) {
        throw new Error('templatizer: window["J"] does not exist or is not an object');
    } else {
        root["J"].templatizer = factory();
    }
}(this, function () {
    var jade=function(){function e(e){return null!=e&&""!==e}function n(t){return(Array.isArray(t)?t.map(n):t&&"object"==typeof t?Object.keys(t).filter(function(e){return t[e]}):[t]).filter(e).join(" ")}var t={};return t.merge=function r(n,t){if(1===arguments.length){for(var a=n[0],i=1;i<n.length;i++)a=r(a,n[i]);return a}var o=n["class"],s=t["class"];(o||s)&&(o=o||[],s=s||[],Array.isArray(o)||(o=[o]),Array.isArray(s)||(s=[s]),n["class"]=o.concat(s).filter(e));for(var l in t)"class"!=l&&(n[l]=t[l]);return n},t.joinClasses=n,t.cls=function(e,r){for(var a=[],i=0;i<e.length;i++)a.push(r&&r[i]?t.escape(n([e[i]])):n(e[i]));var o=n(a);return o.length?' class="'+o+'"':""},t.style=function(e){return e&&"object"==typeof e?Object.keys(e).map(function(n){return n+":"+e[n]}).join(";"):e},t.attr=function(e,n,r,a){return"style"===e&&(n=t.style(n)),"boolean"==typeof n||null==n?n?" "+(a?e:e+'="'+e+'"'):"":0==e.indexOf("data")&&"string"!=typeof n?(-1!==JSON.stringify(n).indexOf("&")&&console.warn("Since Jade 2.0.0, ampersands (`&`) in data attributes will be escaped to `&amp;`"),n&&"function"==typeof n.toISOString&&console.warn("Jade will eliminate the double quotes around dates in ISO form after 2.0.0")," "+e+"='"+JSON.stringify(n).replace(/'/g,"&apos;")+"'"):r?(n&&"function"==typeof n.toISOString&&console.warn("Jade will stringify dates in ISO form after 2.0.0")," "+e+'="'+t.escape(n)+'"'):(n&&"function"==typeof n.toISOString&&console.warn("Jade will stringify dates in ISO form after 2.0.0")," "+e+'="'+n+'"')},t.attrs=function(e,r){var a=[],i=Object.keys(e);if(i.length)for(var o=0;o<i.length;++o){var s=i[o],l=e[s];"class"==s?(l=n(l))&&a.push(" "+s+'="'+l+'"'):a.push(t.attr(s,l,!1,r))}return a.join("")},t.escape=function(e){var n=String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");return n===""+e?e:n},t.rethrow=function a(e,n,t,r){if(!(e instanceof Error))throw e;if(!("undefined"==typeof window&&n||r))throw e.message+=" on line "+t,e;try{r=r||require("fs").readFileSync(n,"utf8")}catch(i){a(e,null,t)}var o=3,s=r.split("\n"),l=Math.max(t-o,0),f=Math.min(s.length,t+o),o=s.slice(l,f).map(function(e,n){var r=n+l+1;return(r==t?"  > ":"    ")+r+"| "+e}).join("\n");throw e.path=n,e.message=(n||"Jade")+":"+t+"\n"+o+"\n\n"+e.message,e},t}();

    var templatizer = {};


    // colors.jade compiled template
    templatizer["colors"] = function tmpl_colors(locals) {
        var buf = [];
        var jade_mixins = {};
        var jade_interp;
        return buf.join("");
    };

    // navbar.jade compiled template
    templatizer["navbar"] = function tmpl_navbar(locals) {
        var buf = [];
        var jade_mixins = {};
        var jade_interp;
        var locals_for_with = locals || {};
        (function(patternLibrary) {
            if (patternLibrary) {
                buf.push("<!-- Title: Right Aligned Links--><!-- Description: I am right aligned links-->");
                buf.push(templatizer["navbar"]["right-nav"]([ {
                    href: "sass.html",
                    text: "Sass"
                }, {
                    href: "components.html",
                    text: "Components"
                }, {
                    href: "javascript.html",
                    text: "Javascript"
                } ]));
                buf.push("<!-- Title: Left Aligned Links-->");
                buf.push(templatizer["navbar"]["left-nav"]([ {
                    href: "sass.html",
                    text: "Sass"
                }, {
                    href: "components.html",
                    text: "Components"
                }, {
                    href: "javascript.html",
                    text: "Javascript"
                } ]));
                buf.push("<!-- Title: Centered Logo--><!-- Description: I am a Centered brand-logo-->");
                buf.push(templatizer["navbar"]["center-nav"]([ {
                    href: "sass.html",
                    text: "Sass"
                }, {
                    href: "components.html",
                    text: "Components"
                }, {
                    href: "javascript.html",
                    text: "Javascript"
                } ]));
            }
        }).call(this, "patternLibrary" in locals_for_with ? locals_for_with.patternLibrary : typeof patternLibrary !== "undefined" ? patternLibrary : undefined);
        return buf.join("");
    };

    // navbar.jade:right-nav compiled template
    templatizer["navbar"]["right-nav"] = function tmpl_navbar_right_nav(items) {
        var block = this && this.block, attributes = this && this.attributes || {}, buf = [];
        buf.push('<div class="row"><nav><div class="nav-wrapper"><div class="col s12"><a href="#" class="brand-logo">Logo</a><ul id="nav-mobile" class="right hide-on-med-and-down">');
        (function() {
            var $obj = items;
            if ("number" == typeof $obj.length) {
                for (var $index = 0, $l = $obj.length; $index < $l; $index++) {
                    var item = $obj[$index];
                    buf.push("<li><a" + jade.attr("href", "" + item.href + "", true, false) + ">" + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</a></li>");
                }
            } else {
                var $l = 0;
                for (var $index in $obj) {
                    $l++;
                    var item = $obj[$index];
                    buf.push("<li><a" + jade.attr("href", "" + item.href + "", true, false) + ">" + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</a></li>");
                }
            }
        }).call(this);
        buf.push("</ul></div></div></nav></div>");
        return buf.join("");
    };


    // navbar.jade:left-nav compiled template
    templatizer["navbar"]["left-nav"] = function tmpl_navbar_left_nav(items) {
        var block = this && this.block, attributes = this && this.attributes || {}, buf = [];
        buf.push('<div class="row"><nav><div class="nav-wrapper"><div class="col s12"><a href="#" class="brand-logo right">Logo</a><ul id="nav-mobile" class="left hide-on-med-and-down">');
        (function() {
            var $obj = items;
            if ("number" == typeof $obj.length) {
                for (var $index = 0, $l = $obj.length; $index < $l; $index++) {
                    var item = $obj[$index];
                    buf.push("<li><a" + jade.attr("href", "" + item.href + "", true, false) + ">" + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</a></li>");
                }
            } else {
                var $l = 0;
                for (var $index in $obj) {
                    $l++;
                    var item = $obj[$index];
                    buf.push("<li><a" + jade.attr("href", "" + item.href + "", true, false) + ">" + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</a></li>");
                }
            }
        }).call(this);
        buf.push("</ul></div></div></nav></div>");
        return buf.join("");
    };


    // navbar.jade:center-nav compiled template
    templatizer["navbar"]["center-nav"] = function tmpl_navbar_center_nav(items) {
        var block = this && this.block, attributes = this && this.attributes || {}, buf = [];
        buf.push('<div class="row"><nav><div class="nav-wrapper"><div class="col s12"><a href="#" class="brand-logo center">Logo</a><ul id="nav-mobile" class="left hide-on-med-and-down">');
        (function() {
            var $obj = items;
            if ("number" == typeof $obj.length) {
                for (var $index = 0, $l = $obj.length; $index < $l; $index++) {
                    var item = $obj[$index];
                    buf.push("<li><a" + jade.attr("href", "" + item.href + "", true, false) + ">" + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</a></li>");
                }
            } else {
                var $l = 0;
                for (var $index in $obj) {
                    $l++;
                    var item = $obj[$index];
                    buf.push("<li><a" + jade.attr("href", "" + item.href + "", true, false) + ">" + jade.escape(null == (jade_interp = item.text) ? "" : jade_interp) + "</a></li>");
                }
            }
        }).call(this);
        buf.push("</ul></div></div></nav></div>");
        return buf.join("");
    };

    // side-nav.jade compiled template
    templatizer["side-nav"] = function tmpl_side_nav(locals) {
        var buf = [];
        var jade_mixins = {};
        var jade_interp;
        var locals_for_with = locals || {};
        (function(groups, jayda, patternLibrary, patterns) {
            if (jayda) {
                buf.push(templatizer["side-nav"]["side-nav"](groups, patterns));
            }
            if (patternLibrary) {
                buf.push("<!-- Title: Side Nav--><!-- Description: I am a Side navigation-->");
                buf.push(templatizer["side-nav"]["side-nav"]([ "atoms" ], [ [ {
                    name: "colors"
                } ] ]));
            }
        }).call(this, "groups" in locals_for_with ? locals_for_with.groups : typeof groups !== "undefined" ? groups : undefined, "jayda" in locals_for_with ? locals_for_with.jayda : typeof jayda !== "undefined" ? jayda : undefined, "patternLibrary" in locals_for_with ? locals_for_with.patternLibrary : typeof patternLibrary !== "undefined" ? patternLibrary : undefined, "patterns" in locals_for_with ? locals_for_with.patterns : typeof patterns !== "undefined" ? patterns : undefined);
        return buf.join("");
    };

    // side-nav.jade:side-nav compiled template
    templatizer["side-nav"]["side-nav"] = function tmpl_side_nav_side_nav(groups, patterns) {
        var block = this && this.block, attributes = this && this.attributes || {}, buf = [];
        buf.push('<ul class="side-nav">');
        (function() {
            var $obj = groups;
            if ("number" == typeof $obj.length) {
                for (var index = 0, $l = $obj.length; index < $l; index++) {
                    var group = $obj[index];
                    buf.push("<h2>" + jade.escape(null == (jade_interp = group) ? "" : jade_interp) + "</h2>");
                    (function() {
                        var $obj = patterns[index];
                        if ("number" == typeof $obj.length) {
                            for (var $index = 0, $l = $obj.length; $index < $l; $index++) {
                                var pattern = $obj[$index];
                                buf.push('<ul><li><a href="#">' + jade.escape(null == (jade_interp = pattern.name) ? "" : jade_interp) + "</a></li></ul>");
                            }
                        } else {
                            var $l = 0;
                            for (var $index in $obj) {
                                $l++;
                                var pattern = $obj[$index];
                                buf.push('<ul><li><a href="#">' + jade.escape(null == (jade_interp = pattern.name) ? "" : jade_interp) + "</a></li></ul>");
                            }
                        }
                    }).call(this);
                }
            } else {
                var $l = 0;
                for (var index in $obj) {
                    $l++;
                    var group = $obj[index];
                    buf.push("<h2>" + jade.escape(null == (jade_interp = group) ? "" : jade_interp) + "</h2>");
                    (function() {
                        var $obj = patterns[index];
                        if ("number" == typeof $obj.length) {
                            for (var $index = 0, $l = $obj.length; $index < $l; $index++) {
                                var pattern = $obj[$index];
                                buf.push('<ul><li><a href="#">' + jade.escape(null == (jade_interp = pattern.name) ? "" : jade_interp) + "</a></li></ul>");
                            }
                        } else {
                            var $l = 0;
                            for (var $index in $obj) {
                                $l++;
                                var pattern = $obj[$index];
                                buf.push('<ul><li><a href="#">' + jade.escape(null == (jade_interp = pattern.name) ? "" : jade_interp) + "</a></li></ul>");
                            }
                        }
                    }).call(this);
                }
            }
        }).call(this);
        buf.push("</ul>");
        return buf.join("");
    };

    return templatizer;
}));