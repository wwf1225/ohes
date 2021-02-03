(function() {
 

    var byId = function(id) {

            return document.getElementById(id);
        },

        loadScripts = function(desc, callback) {
            var deps = [],
                key, idx = 0;

            for (key in desc) {
                deps.push(key);
            }

            (function _next() {
                var pid,
                    name = deps[idx],
                    script = document.createElement('script');

                script.type = 'text/javascript';
                script.src = desc[deps[idx]];

                pid = setInterval(function() {
                    if (window[name]) {
                        clearTimeout(pid);

                        deps[idx++] = window[name];

                        if (deps[idx]) {
                            _next();
                        } else {
                            callback.apply(null, deps);
                        }
                    }
                }, 30);

                document.getElementsByTagName('head')[0].appendChild(script);
            })()
        },

        console = window.console;

    if (!console.log) {
        console.log = function() {
            alert([].join.apply(arguments, ' '));
        };
    }

    [{
        name: 'advanced',
        pull: 'clone',
        put: false
    }, {
        name: 'advanced',
        pull: false,
        put: true
    }].forEach(function(groupOpts, i) {
        var el = byId('advanced-' + (i + 1));

        Sortable.create(el, {
            sort: (i != 0),
            group: groupOpts,
            animation: 150,
            onStart: function( /**Event*/ evt) {
                var radioQues = '';

            },
            onClone: function( /**Event*/ evt) {
                var origEl = evt.item;
                var cloneEl = evt.clone;

            }
        });
    });

})();