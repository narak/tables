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

function getCellAttrs(col, data, hidden) {
    let attrs = {},
        _class = '';

    if (col.type) {
        _class += TypeClassMap[col.type];

        if (data) {
            attrs.title = data;
        }
    }

    if (hidden) {
        _class += ' table-cell-hidden';
    }

    if (_class) {
        attrs.class = _class;
    }

    return attrs;
}

function Table($container) {
    let cols, data, filter,
        sortBy, sortOrder, pageSize,
        datasource,
        pageNum = 1,
        hiddenCols = {},
        firstRender = false,
        $el = {};

    let { table, thead, tbody, tr, th, td, div, select, option, button, text, ul, li } = DOM;

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

        cols.forEach(col => {
            if (col.hidden) {
                hiddenCols[col.key] = true;
            }
        });

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
        let $thead = thead(
                tr(cols.map(
                    col => ref(`th:${col.key}`, th(getCellAttrs(col, null, hiddenCols[col.key]), [
                        col.title,
                        div({class: 'sort-asc-arrow'}),
                        div({class: 'sort-desc-arrow'})
                    ]))
                ))
            ),
            $table = table({'width': '100%', 'cellspacing': '0'}, [$thead, ref('tbody', tbody())]);

        let $pageSelector = select({class: 'per-page-count'}, [
            [10, 25, 50, 100].map(c => option({selected: pageSize === c}, c))
        ]);

        const tickUnicode = '\u2713';

        DOM.appendChild($container, [
            ref('loading', div({class: 'table-loading'}, ['Loading...'])),
            div({class: 'table-total-records'}, [
                'Total Records: ',
                ref('totalRecords', text('0'))
            ]),
            div([
                'Per Page: ',
                $pageSelector,
                ' Page: ',
                ref('pagerTop', select({class: 'table-pager'})),
                ref('colVisCont', div({class: 'table-column-visibility'}, [
                    ref('colVisBtn', button({type: 'button'}, 'columns')),
                    ul({class: 'table-column-menu'},
                        cols.map(col => ref(`colVis:${col.key}`, li([
                            ref(`colVisTick:${col.key}`, div({class: 'table-col-tick ' + (hiddenCols[col.key] ? 'table-col-tick-hide' : '')}, tickUnicode)),
                            col.title
                        ])))
                    ),
                ])),
            ]),
            div({class: 'table-scroll'}, $table),
            'Page: ',
            ref('pagerBottom', select({class: 'table-pager'})),
        ]);

        ref('pagerBottom').addEventListener('change', (e) => setPageNum(e.target.value));
        ref('pagerTop').addEventListener('change', (e) => setPageNum(e.target.value));
        $pageSelector.addEventListener('change', (e) => setPageSize(e.target.value));

        cols.forEach(col => {
            ref(`th:${col.key}`).addEventListener('click', setSortBy.bind(this, col.key));
        });

        let $colVisCont = ref('colVisCont'),
            showMenuClass = 'table-column-menu-show',
            hideCellClass = 'table-cell-hidden',
            hideTickClass = 'table-col-tick-hide';

        ref('colVisBtn').addEventListener('click', () => {
            if ($colVisCont.classList.contains(showMenuClass)) {
                $colVisCont.classList.remove(showMenuClass);
            } else {
                $colVisCont.classList.add(showMenuClass);
            }
        });

        window.addEventListener('click', (e) => {
            if (!DOM.isAncestorOf($colVisCont, e.target)) {
                $colVisCont.classList.remove(showMenuClass);
            }
        });

        cols.forEach(col => {
            ref(`colVis:${col.key}`).addEventListener('click', () => {
                let hidden = !hiddenCols[col.key];
                hiddenCols[col.key] = hidden;

                if (hidden) {
                    ref(`th:${col.key}`).classList.add(hideCellClass);
                    ref(`colVisTick:${col.key}`).classList.add(hideTickClass);
                } else {
                    ref(`th:${col.key}`).classList.remove(hideCellClass);
                    ref(`colVisTick:${col.key}`).classList.remove(hideTickClass);
                }

                redraw();
            });
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
                hiddenCols
                rows.push(tr(cols.map(col => td(getCellAttrs(col, d[col.key], hiddenCols[col.key]), d[col.key]))));
            }

            let pageCount = Math.ceil(_totalRecords / pageSize),
                $pageOpts = [];

            for (let i = 1; i <= pageCount; i++) {
                $pageOpts.push(option({selected: i === pageNum}, i));
            }

            ref('totalRecords').textContent = _totalRecords;
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
