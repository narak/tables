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
        pageNum = 1, sortBy, sortOrder, pageSize,
        datasource,
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

    function getData(cb) {
        if (datasource) {
            datasource({
                offset: (pageNum - 1) * pageSize,
                pageSize, filter, sortBy, sortOrder
            }, cb);
        } else {
            cb([], 0);
        }
    }

    function setDataSource(_datasource) {
        datasource = _datasource;
        pageNum = 1;
        redraw();
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
        pageSize = +_pageSize;
        pageNum = 1;
        redraw();
    }
    function setPageNum(_pageNum) {
        pageNum = +_pageNum;
        redraw();
    }
    function setTotalRecords(_totalRecords) {
        totalRecords = _totalRecords;
    }
    function setFilter(_filter) {
        filter = _filter;
        // Resets page num when filter is set.
        pageNum = 1;
        redraw();
    }

    function setSortBy(key) {
        let $currTh = ref(`th:${key}`),
            $prevTh = ref(`th:${sortBy}`);

        if (sortBy === key) {
            if (sortOrder === 'desc') {
                sortOrder = 'asc';
                $currTh.classList.remove('table-sorting-desc');
                $currTh.classList.add('table-sorting-asc');

            } else {
                sortOrder = 'desc';
                $currTh.classList.remove('table-sorting-asc');
                $currTh.classList.add('table-sorting-desc');
            }
        } else {
            if ($prevTh) {
                $prevTh.classList.remove(`table-sorting-${sortOrder}`);
            }
            $currTh.classList.add('table-sorting-asc');

            sortBy = key;
            sortOrder = 'asc';
        }

        pageNum = 1;
        redraw();
    }

    function render() {
        let $thead = DOM.thead(
                DOM.tr(cols.map(
                    col => ref(`th:${col.key}`, DOM.th(getCellAttrs(col), [
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
            ref('loading', DOM.div({class: 'table-loading'}, ['Loading...'])),
            DOM.div([
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
        $pageSelector.addEventListener('change', (e) => setPageSize(e.target.value));

        cols.forEach(col => {
            ref(`th:${col.key}`).addEventListener('click', setSortBy.bind(this, col.key));
        });

        renderData();
        firstRender = true;
    }

    function renderData() {
        ref('loading').classList.remove('table-loading-hide');
        getData((_data, _totalRecords) => {
            let rows = [];
            for (let i = 0; i < pageSize; i++) {
                let d = _data[i];
                if (!d) {
                    break;
                }
                rows.push(DOM.tr(cols.map(col => DOM.td(getCellAttrs(col, d[col.key]), d[col.key]))));
            }

            let pageCount = Math.ceil(_totalRecords / pageSize),
                $pageOpts = [];

            for (let i = 1; i <= pageCount; i++) {
                $pageOpts.push(DOM.option({selected: i === pageNum}, i));
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
            ref('loading').classList.add('table-loading-hide');
        });
    }

    return {
        setColumns,
        setData,
        setDataSource,
        setPageSize,
        setTotalRecords,
        setFilter,
        setSortBy,
        setPageNum,
        render,
        renderData
    };
};

Table.ColumnTypes = ColumnTypes;

window.Table = Table;
