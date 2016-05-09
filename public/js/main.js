/**
 * Improvements:
 * - Could add a react style event handling where event listeners are passed to the DOM helper
 *   which can then setup automatic event delegation for better performance.
 *
 * - Caching should probably be handled at the main layer instead of being implicitly done at
 *   data fetch layer. This is causing some implicit behaviour for the prefetching logic.

 * - Table data cells should be reused to avoid DOM thrashing. Considering only the inner text
 *   changes, the diffing should be trivial.
 */

var table = Table(document.querySelector('.table-container'));

const cols = [
        {title: 'User Name', key: 'userName'},
        {title: 'First Name', key: 'firstName'},
        {title: 'Last Name', key: 'lastName'},
        {title: 'City', key: 'city'},
        {title: 'Zip Code', key: 'zipCode', hidden: true},
        {title: 'Country', key: 'country', hidden: true},
        {title: 'State', key: 'state', hidden: true},
        {title: 'Phone Number', key: 'phoneNumber'},
        {title: 'Email', key: 'email'},
        {title: 'Amount', key: 'amount', type: Table.ColumnTypes.number, hidden: true},

        {title: 'Catch Phrase', key: 'catchPhrase', hidden: true},
        {title: 'Company Name', key: 'companyName'},

        {title: 'Created Date', key: 'createdDate', type: Table.ColumnTypes.date},
        {title: 'Modified Date', key: 'modifiedDate', type: Table.ColumnTypes.date, hidden: true},

        {title: 'Title', key: 'title', hidden: true},
        {title: 'Job Title', key: 'jobTitle', hidden: true},
        {title: 'Job Type', key: 'jobType', hidden: true},

        {title: 'Account', key: 'account', hidden: true},
        {title: 'Account Name', key: 'accountName', hidden: true},

        {title: 'IP', key: 'ip'},
        {title: 'UserAgent', key: 'userAgent', hidden: true},
    ],
    queryParams = Helpers.QueryString.parse(window.location.search),
    MAX_ROWS = queryParams.maxRows && [100, 200, 500].indexOf(+queryParams.maxRows) > -1 ?
        queryParams.maxRows :
        100,
    prefetchSize = 100,
    defaultQuery = {pageSize: prefetchSize, offset: 0};

var colsMap = {},
    totalRecords;

cols.forEach(col => {
    colsMap[col.key] = true;
});

function compare(sortOrder, a, b) {
    if (sortOrder === 'asc') {
        return a < b;
    } else {
        return a > b;
    }
}

function datasource(query, callback) {
    let pageEndIndex = query.offset + query.pageSize,
        hasAllRecords = (totalRecords && totalRecords <= prefetchSize),
        prefetch = hasAllRecords || (!query.filter && !query.sortBy && !query.sortOrder && pageEndIndex <= prefetchSize),
        _query = query;

    if (prefetch) {
        _query = Object.assign({}, query, defaultQuery);
        if (hasAllRecords) {
            _query.filter = undefined;
            _query.sortBy = undefined;
            _query.sortOrder = undefined;
        }
    }

    Helpers.getJSON(`/data/${MAX_ROWS}`, _query, d => {
        if (prefetch) {
            let _data = d.rows,
                _totalRecords = d.totalRecords;

            if (query.filter) {
                _data = _data.filter(_d => Helpers.matchesFilter(query.filter, _d, colsMap));
                _totalRecords = _data.length;
            }

            // todo: loop only once to filter and sort.
            if (query.sortBy) {
                _data = _data.sort((a, b) => compare(query.sortOrder, a[query.sortBy], b[query.sortBy]) ? -1 : 1);
            }

            _data = _data.slice(query.offset, pageEndIndex);
            callback(_data, _totalRecords)
            totalRecords = d.totalRecords;

        } else {
            callback(d.rows, d.totalRecords);
        }
    });
}

table.setPageSize(25);
table.setColumns(cols);
table.setDataSource(datasource);
table.render();

document.querySelector('.search-field').addEventListener('change', e => {
    table.setFilter(e.target.value);
});
