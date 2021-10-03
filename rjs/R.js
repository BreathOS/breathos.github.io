(function (exports) {
    var oldR = exports.R
        , inited = false
        , eR
        , undef
        , R = {

            init: function (lang) {
                lang = lang || typeof navigator !== undef ? navigator.language : 'en-GB';

                eR.locales = {};
                eR.navLang = lang;
                inited = true;
            },

            slice: function (a) {
                return Array.prototype.slice.call(a);
            },

            AinOf: function (a, v) {
                for (var i = 0, c = a.length; i < c; ++i) if (a[i] === v) return i;
                return -1;
            },

            realTypeOf: function (v) {
                return Object.prototype.toString.call(v).match(/\w+/g)[1].toLowerCase();
            },

            render: function (id, args) {
                if (eR.locales && eR.locales.hasOwnProperty(eR.lang)) {
                    if (eR.locales[eR.lang].hasOwnProperty(id)) {
                        id = eR.locales[eR.lang][id];
                    }
                }


                if (!args || args.length === 0) {
                    return id;
                }


                args = R.parseVariables(args);

                return R.format(id, args);
            },

            parseVariables: function (args, ret) {
                var i
                    , c
                    , type = R.realTypeOf(args);



                if (!ret) {
                    ret = { i: [], s: [], named: {} };
                }


                switch (type) {
                    case 'number': ret.i.push(args); break;
                    case 'string': ret.s.push(args); break;
                    case 'date': ret.i.push(args.toString()); break;
                    case 'object':
                        for (i in args) {
                            if (args.hasOwnProperty(i)) {
                                if (i === 'i' || i === 's') {
                                    R.parseVariables(args[i], ret);
                                } else {
                                    ret.named[i] = args[i];
                                }
                            }
                        }
                        break;
                    case 'array':

                        for (i = 0, c = args.length; i < c; ++i) {
                            R.parseVariables(args[i], ret);
                        }
                        break;
                }

                return ret;
            },

            format: function (s, a) {
                var i
                    , replace
                    , tcount
                    , substrstart
                    , type
                    , l
                    , types = { i: '%i', s: '%s' }
                    , tmp = ''
                    , t;


                for (type in types) {
                    if (types.hasOwnProperty(type)) {
                        tcount = (s.match(new RegExp(types[type], 'g')) || []).length;
                        for (i = 0; i < tcount; ++i) {
                            replace = a[type].hasOwnProperty(i) ? a[type][i] : replace;
                            if (replace !== undef && replace !== false) {
                                if ((substrstart = s.indexOf(types[type])) >= 0) {
                                    s = s.substr(0, substrstart) + replace + s.substr(substrstart + 2);
                                }
                            }
                        }
                    }
                    replace = false;
                }


                for (i in a.named) {
                    if (a.named.hasOwnProperty(i)) {
                        t = new RegExp("%\\(" + i + "\\)", 'g');
                        s = s.replace(t, a.named[i]);
                    }
                }

                return s;
            }
        };



    eR = function (id, variables) {

        if (!inited) R.init();

        if (arguments.length > 1) {



            var args = R.slice(arguments);
            args.shift();

            return R.render(id, args);


        } else {
            return R.render(id, [variables]);
        }
    };



    eR.registerLocale = function (locale, object) {

        if (!inited) R.init();


        eR.locales[locale] = object;
        eR.setLocale(eR.navlang);
        return eR;
    };



    eR.localeOrder = function () {
        eR.preferredLocales = R.slice(arguments);
        return eR.setLocale(eR.lang);
    };



    eR.setLocale = function (locale, force) {

        if (!inited) R.init();

        if (force) {
            eR.lang = locale;
            return eR;
        }
        var i = 0, key, locales = eR.preferredLocales;
        if (!locales) {
            locales = [];
            for (key in eR.locales) {
                if (eR.locales.hasOwnProperty(key)) locales.push(key);
            }
        }
        if ((key = R.AinOf(locales, locale)) > 0) {
            eR.lang = locales[key];
            return eR;
        }
        eR.lang = locales[0] || locale;
        return eR;
    };

    eR.noConflict = function () {
        exports.R = oldR;
        return eR;
    };

    exports.R = eR;

}(typeof module !== 'undefined' && module.exports ? module.exports : this));