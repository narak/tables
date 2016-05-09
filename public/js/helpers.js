
window.Helpers = (function() {
    function isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }

    function matchesFilter(filter, o, allowedKeys) {
        filter = filter.toLowerCase();

        for (let k in o) {
            if (o.hasOwnProperty(k) && allowedKeys[k]) {
                let v = o[k];
                if (v.toLowerCase().indexOf(filter) > -1) {
                    return true;
                }
            }
        }
    }

    const QueryString = {
        stringify(query) {
            return Object.keys(query)
                .filter(key => query[key] !== undefined)
                .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(query[key]))
                .join("&");
        },

        parse(url) {
            let bits = url.split('?')[1],
                params = {};

            if (bits) {
                bits = bits.split('&').map(u => u.split('=')),
                bits.forEach(b => params[decodeURIComponent(b[0])] = decodeURIComponent(b[1]));
                return params;
            } else {
                return {};
            }
        }
    };

    const DOM = {
        isAncestorOf(ancestor, child) {
            var element = child.parentNode;
            while (element) {
                if (element === ancestor) {
                    return true;
                }
                element = element.parentNode;
            }
            return false;
        },

        appendChild(dom, children) {

            if (isArray(children)) {
                children.forEach(child => DOM.appendChild(dom, child));
            } else {
                if (typeof children === 'string' || typeof children === 'number') {
                    children = this.text(children);
                }
                dom.appendChild(children);
            }
        },

        removeChildren(dom) {
            while (dom.firstChild) {
                dom.removeChild(dom.firstChild);
            }
        },

        Element(type, props, children) {
            let dom = document.createElement(type);

            if (isArray(props) || props instanceof HTMLElement ||
                    typeof props === 'string' || typeof props === 'number') {
                children = props;
                props = null;
            }

            if (props) {
                Object.keys(props).forEach(p => {
                    if (props[p]) {
                        dom.setAttribute(p, props[p]);
                    }
                });
            }

            if (children) {
                DOM.appendChild(dom, children);
            }
            return dom;
        },

        table(...args) {
            return DOM.Element('table', ...args);
        },

        thead(...args) {
            return DOM.Element('thead', ...args);
        },

        tbody(...args) {
            return DOM.Element('tbody', ...args);
        },

        tr(...args) {
            return DOM.Element('tr', ...args);
        },

        th(...args) {
            return DOM.Element('th', ...args);
        },

        td(...args) {
            return DOM.Element('td', ...args);
        },

        div(...args) {
            return DOM.Element('div', ...args);
        },

        select(...args) {
            return DOM.Element('select', ...args);
        },

        option(...args) {
            return DOM.Element('option', ...args);
        },

        button(...args) {
            return DOM.Element('button', ...args);
        },

        ul(...args) {
            return DOM.Element('ul', ...args);
        },

        li(...args) {
            return DOM.Element('li', ...args);
        },

        text(str) {
            return document.createTextNode(str);
        },
    };

    let cache = {},
        cacheTTL = 60000;

    function getJSON(url, params, cb) {
        let _url = `${url}?${QueryString.stringify(params)}`,
            _cache = cache[_url];

        if (_cache && Date.now() - _cache.timestamp < cacheTTL) {
            cb(_cache.data);
        } else {
            fetch(_url)
                .then(res => res.json())
                .then(d => {
                    cache[_url] = {
                        data: d,
                        timestamp: Date.now()
                    };
                    cb(d);
                });
        }
    }

    return {
        isArray,
        matchesFilter,
        DOM,
        QueryString,
        getJSON
    };
})();
