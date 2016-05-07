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

function removeChildren(dom) {
    while (dom.firstChild) {
        dom.removeChild(dom.firstChild);
    }
    return dom;
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

const ColumnTypes = {
    number: 'number',
    date: 'date'
};

const TypeClassMap = {
    [ColumnTypes.number]: 'table-cell-number',
    [ColumnTypes.date]: 'table-cell-date'
};

function getCellAttrs(col, data) {
    if (col.type) {
        let attrs = {
            class: TypeClassMap[col.type]
        };
        if (data) {
            attrs.title = data;
        }
        return attrs;
    }
}

function Table($table) {
    let cols, data, pageSize, totalRecords;
    let $thead, $tbody;

    return {
        setColumns: _cols => cols = _cols,
        setData: _data => data = _data,
        setPageSize: _pageSize => pageSize = _pageSize,
        setTotalRecords: _totalRecords => totalRecords = _totalRecords,

        render() {
            $thead = THead(TR(cols.map(col => TH(getCellAttrs(col), col.title))));
            $tbody = TBody();
            this.renderData();
            $table.appendChild($thead);
            $table.appendChild($tbody);
        },

        renderData() {
            removeChildren($tbody);
            data.forEach(d => $tbody.appendChild(TR(cols.map(col => TD(getCellAttrs(col, d[col.key]), d[col.key])))));
        }
    }
};

Table.ColumnTypes = ColumnTypes;

window.Table = Table;
