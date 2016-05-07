'use strict';

let DOM = Helpers.DOM;

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

function Table($container) {
    let cols, data, filter,
        pageNum = 1, pageSize, totalRecords,
        $table, $thead, $tbody,
        firstRender = false;

    function redraw() {
        if (firstRender) {
            renderData();
        }
    }

    function setColumns(_cols) {
        cols = _cols;
        redraw();
    }
    function setData(_data) {
        data = _data;
        redraw();
    }
    function setPageSize(_pageSize) {
        pageSize = _pageSize;
        redraw();
    }
    function setTotalRecords(_totalRecords) {
        totalRecords = _totalRecords;
    }
    function setFilter(_filter) {
        filter = _filter;
        redraw();
    }

    function render() {
        $thead = DOM.thead(DOM.tr(cols.map(col => DOM.th(getCellAttrs(col), [col.title, /*DOM.div(col.title)*/]))));
        $tbody = DOM.tbody();
        $table = DOM.table({'cellspacing': 0}, [$thead, $tbody]);
        DOM.appendChild($container, DOM.div({class: 'table-scroll'}, $table));

        renderData();
        firstRender = true;
    }

    function renderData() {
        let rows = [],
            offset = (pageNum - 1) * pageSize,
            limit = pageNum * pageSize;

        for (let i = offset; i < limit; i++) {
            let d = data[i];
            if (!d) {
                break;
            }
            rows.push(DOM.tr(cols.map(col => DOM.td(getCellAttrs(col, d[col.key]), d[col.key]))));
        }

        DOM.removeChildren($tbody);
        DOM.appendChild($tbody, rows);
    }

    return {
        setColumns,
        setData,
        setPageSize,
        setTotalRecords,
        setFilter,
        render,
        renderData
    };
};

Table.ColumnTypes = ColumnTypes;

window.Table = Table;
