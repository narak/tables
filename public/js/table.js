'use strict';

function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}

function appendChild(dom, child) {
    if (typeof child === 'string') {
        dom.innerText = child;
    } else {
        dom.appendChild(child);
    }
}

function DOMElement(type, props, children) {
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
            appendChild(dom, child);
        });
    } else if (children) {
        appendChild(dom, children);
    }
    return dom;
}

function THead(...args) {
    return DOMElement('thead', ...args);
}

function TBody(...args) {
    return DOMElement('tbody', ...args);
}

function TR(...args) {
    return DOMElement('tr', ...args);
}

function TH(...args) {
    return DOMElement('th', ...args);
}

function TD(...args) {
    return DOMElement('td', ...args);
}


window.Table = function($table) {
    let cols, data, pageSize, totalRecords, dom;

    return {
        setColumns: _cols => cols = _cols,
        setData: _data => data = _data,
        setPageSize: _pageSize => pageSize = _pageSize,
        setTotalRecords: _totalRecords => totalRecords = _totalRecords,

        render() {
            let thead = THead(
                    TR({class: 'stuff'}, cols.map(col => TH(col.title)))
                ),
                tbody = TBody(
                    data.map(d => TR(cols.map(col => TD(d[col.key]))))
                );

            $table.appendChild(thead);
            $table.appendChild(tbody);
        }
    }
};

