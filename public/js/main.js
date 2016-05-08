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
    MAX_ROWS = 200,
    prefetchSize = 100,
    defaultQuery = {pageSize: prefetchSize, offset: 0};

//filteredData = data.filter(d => matchesFilter(filter, d));

table.setDataSource((query, callback) => {
    let pageEndIndex = query.offset + query.pageSize,
        prefetch = !query.filter && !query.sortBy && !query.sortOrder && pageEndIndex <= prefetchSize,
        _query = query;

    if (prefetch) {
        _query = Object.assign({}, query, defaultQuery);
    }

    Helpers.getJSON(`/data/${MAX_ROWS}`, _query, d => {
        if (prefetch) {
            let _data = d.rows.slice(query.offset, pageEndIndex);
            callback(_data, d.totalRecords)
        } else {
            callback(d.rows, d.totalRecords);
        }
    });
});

table.render();

document.querySelector('.search-field').addEventListener('change', e => {
    table.setFilter(e.target.value);
});
