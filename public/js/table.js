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

function Table($container) {
    let cols, data, filter, filteredData,
        pageNum = 1, pageSize, totalRecords,
        firstRender = false,
        $el = {};

    /**
     * Careful when you use this. You don't want to add refs to elements that are going to be
     * destroyed. Unless a mechanism for removing the element reference from this map is put in
     * place, those elements won't get garbage collected.
     */
    function ref(key, dom) {
        if (dom) {
            $el[key] = dom;
        } else {
            dom = $el[key];
        }
        return dom;
    }

    function redraw() {
        if (firstRender) {
            renderData();
        }
    }

    function getData() {
        return filter ? filteredData : data;
    }

    function getTotalRecords() {
        return filter ? filteredData.length : totalRecords;
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
    function setPageNum(_pageNum) {
        pageNum = _pageNum;
        redraw();
    }
    function setTotalRecords(_totalRecords) {
        totalRecords = _totalRecords;
    }
    function setFilter(_filter) {
        filter = _filter;
        // Resets page num when filter is set.
        pageNum = 1;

        filteredData = data.filter(d => matchesFilter(filter, d));
        redraw();
    }

    function render() {
        let $thead = DOM.thead(
                DOM.tr(cols.map(
                    col => ref(`th:${col.title}`, DOM.th(getCellAttrs(col), [
                        col.title,
                        DOM.div({class: 'sort-asc-arrow'}),
                        DOM.div({class: 'sort-desc-arrow'})
                    ]))
                ))
            ),
            $table = DOM.table({'cellspacing': '0'}, [$thead, ref('tbody', DOM.tbody())]);

        let $pageSelector = DOM.select({class: 'per-page-count'}, [
            [10, 25, 50, 100].map(c => DOM.option({selected: pageSize === c}, c))
        ]);

        DOM.appendChild($container, [
            DOM.div({class: 'per-page'}, [
                'Per Page: ',
                $pageSelector,
                ' Page: ',
                ref('pagerTop', DOM.select({class: 'table-pager'}))
            ]),
            DOM.div({class: 'table-scroll'}, $table),
            'Page: ',
            ref('pagerBottom', DOM.select({class: 'table-pager'}))
        ]);

        ref('pagerBottom').addEventListener('change', (e) => setPageNum(e.target.value));
        ref('pagerTop').addEventListener('change', (e) => setPageNum(e.target.value));
        $pageSelector.addEventListener('change', (e) => setPageSize(+e.target.value));

        renderData();
        firstRender = true;
    }

    function renderData() {
        let rows = [],
            _data = getData(),
            _totalRecords = getTotalRecords(),
            accessor = (pageNum - 1) * pageSize;

        for (let i = 0; i < pageSize; i++, accessor++) {
            let d = _data[accessor];
            if (!d) {
                break;
            }
            rows.push(DOM.tr(cols.map(col => DOM.td(getCellAttrs(col, d[col.key]), d[col.key]))));
        }

        let pageCount = Math.ceil(_totalRecords / pageSize),
            $pageOpts = [];

        for (let i = 1; i <= pageCount; i++) {
            let cls = 'table-page-item';
            if (i === pageNum) {
                cls += ' table-selected-page';
            }
            let $el = DOM.option(i);
            $pageOpts.push($el);
        }

        let $pagerBottom = ref('pagerBottom'),
            $pagerTop = ref('pagerTop');

        DOM.removeChildren($pagerBottom);
        DOM.removeChildren($pagerTop);
        DOM.appendChild($pagerBottom, $pageOpts);
        DOM.appendChild($pagerTop, $pageOpts.map(e => e.cloneNode(true)));


        let $tbody = ref('tbody');
        DOM.removeChildren($tbody);
        DOM.appendChild($tbody, rows);
    }

    return {
        setColumns,
        setData,
        setPageSize,
        setTotalRecords,
        setFilter,
        setPageNum,
        render,
        renderData
    };
};

Table.ColumnTypes = ColumnTypes;

window.Table = Table;
