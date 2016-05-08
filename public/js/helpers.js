
window.Helpers = (function() {
    function isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }

    function matchesFilter(filter, o) {
        filter = filter.toLowerCase();

        for (let k in o) {
            if (o.hasOwnProperty(k)) {
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
        }
    };

    const DOM = {
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
            return this.Element('table', ...args);
        },

        thead(...args) {
            return this.Element('thead', ...args);
        },

        tbody(...args) {
            return this.Element('tbody', ...args);
        },

        tr(...args) {
            return this.Element('tr', ...args);
        },

        th(...args) {
            return this.Element('th', ...args);
        },

        td(...args) {
            return this.Element('td', ...args);
        },

        div(...args) {
            return this.Element('div', ...args);
        },

        select(...args) {
            return this.Element('select', ...args);
        },

        option(...args) {
            return this.Element('option', ...args);
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
