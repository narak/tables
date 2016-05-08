/**
 * Improvements:
 * - Could add a react style event handling where event listeners are passed to the DOM helper
 * which can then setup automatic event delegation for better performance.
 * - Caching should probably be handled at the main layer instead of being implicitly done at
 * data fetch layer. This is causing some implicit behaviour for the prefetching logic.
 */

var table = Table(document.querySelector('.table-container'));

table.setPageSize(10);
table.setColumns([
    {title: 'First Name', key: 'firstName'},
    {title: 'Last Name', key: 'lastName'},
    {title: 'City', key: 'city'},
    {title: 'Zip Code', key: 'zipCode'},
    {title: 'Country', key: 'country'},
    {title: 'State', key: 'state'},
    {title: 'User Name', key: 'userName'},
    {title: 'Phone Number', key: 'phoneNumber'},
    {title: 'Email', key: 'email'},
    {title: 'Amount', key: 'amount', type: Table.ColumnTypes.number},

    {title: 'Catch Phrase', key: 'catchPhrase'},
    {title: 'Company Name', key: 'companyName'},

    {title: 'Created Date', key: 'createdDate', type: Table.ColumnTypes.date},
    {title: 'Modified Date', key: 'modifiedDate', type: Table.ColumnTypes.date},

    {title: 'Title', key: 'title'},
    {title: 'Job Title', key: 'jobTitle'},
    {title: 'Job Type', key: 'jobType'},

    {title: 'Account', key: 'account'},
    {title: 'Account Name', key: 'accountName'},

    {title: 'IP', key: 'ip'},
    {title: 'UserAgent', key: 'userAgent'},
]);

const
    MAX_ROWS = 100,
    prefetchSize = 100,
    defaultQuery = {pageSize: prefetchSize, offset: 0};

var totalRecords;


function compare(sortOrder, a, b) {
    if (sortOrder === 'asc') {
        return a < b;
    } else {
        return a > b;
    }
}

table.setDataSource((query, callback) => {
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
            let _data = d.rows;
            if (query.filter) {
                _data = _data.filter(_d => Helpers.matchesFilter(query.filter, _d));
            }

            // todo: loop only once to filter and sort.
            if (query.sortBy) {
                _data = _data.sort((a, b) => compare(query.sortOrder, a[query.sortBy], b[query.sortBy]) ? -1 : 1);
            }

            _data = _data.slice(query.offset, pageEndIndex);
            callback(_data, d.totalRecords)
            totalRecords = d.totalRecords;
        } else {
            callback(d.rows, d.totalRecords);
        }
    });
});

table.render();

document.querySelector('.search-field').addEventListener('change', e => {
    table.setFilter(e.target.value);
});
