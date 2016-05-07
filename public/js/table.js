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
    let cols, data, pageSize, totalRecords;
    let $table, $thead, $tbody;

    return {
        setColumns: _cols => cols = _cols,
        setData: _data => data = _data,
        setPageSize: _pageSize => pageSize = _pageSize,
        setTotalRecords: _totalRecords => totalRecords = _totalRecords,

        render() {
            $thead = DOM.thead(DOM.tr(cols.map(col => DOM.th(getCellAttrs(col), [col.title, /*DOM.div(col.title)*/]))));
            $tbody = DOM.tbody();
            $table = DOM.table({'cellspacing': 0}, [$thead, $tbody]);
            $container.appendChild(DOM.div({class: 'table-scroll'}, $table));

            this.renderData();
        },

        renderData() {
            DOM.removeChildren($tbody);
            data.forEach(d => $tbody.appendChild(DOM.tr(cols.map(col => DOM.td(getCellAttrs(col, d[col.key]), d[col.key])))));
        }
    }
};

Table.ColumnTypes = ColumnTypes;

window.Table = Table;
