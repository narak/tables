var table = Table(document.querySelector('.table-container'));

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

const MAX_ROWS = 99;
fetch(`/data/${MAX_ROWS}/`, { params: {abc: 'zys'}})
    .then(res => res.json())
    .then(d => {
        table.setData(d.rows);
        table.setTotalRecords(d.totalRecords);
        table.setPageSize(10);
        table.render();
        document.getElementById('loading').remove();
    });


// This event occurs only if Table recognizes that the total records is greater than
// the data it already has.
table.onFetch = (filters, callback) => {
    fetch(`/data/${MAX_ROWS}/?${Helpers.QueryString.stringify(filters)}`)
        .then(res => res.json())
        .then(d => {
            callback(d.rows);
        });
}

document.querySelector('.search-field').addEventListener('change', e => {
    table.setFilter(e.target.value);
});
