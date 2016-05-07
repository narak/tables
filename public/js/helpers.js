
window.Helpers = (function() {
    function isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }

    const QueryString = {
        stringify(query) {
            return Object.keys(query)
               .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(query[key]))
               .join("&");
        }
    };

    const DOM = {
        appendChild(dom, child) {
            if (typeof child === 'string') {
                child = document.createTextNode(child);
            }
            dom.appendChild(child);
        },

        removeChildren(dom) {
            while (dom.firstChild) {
                dom.removeChild(dom.firstChild);
            }
            return dom;
        },

        Element(type, props, children) {
            let dom = document.createElement(type);

            if (isArray(props) || props instanceof HTMLElement || typeof props === 'string') {
                children = props;
                props = null;
            }

            if (props) {
                Object.keys(props).forEach(p => {
                    dom.setAttribute(p, props[p]);
                });
            }

            if (isArray(children)) {
                children.forEach(child => {
                    DOM.appendChild(dom, child);
                });
            } else if (children) {
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
    };

    return {
        isArray,
        DOM,
        QueryString
    };
})();
