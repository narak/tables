'use strict';

const
    faker = require('faker'),
    commandLineArgs = require('command-line-args');

const columnConf = {
        firstName: ['name', 'firstName'],
        lastName: ['name', 'lastName'],
        city: ['address', 'city'],
        zipCode: ['address', 'zipCode'],
        country: ['address', 'country'],
        state: ['address', 'state'],
        userName: ['internet', 'userName'],
        phoneNumber: ['phone', 'phoneNumber'],
        email: ['internet', 'email'],
        amount: ['finance', 'amount'],

        catchPhrase: ['company', 'catchPhrase'],
        companyName: ['company', 'companyName'],

        createdDate: ['date', 'past'],
        modifiedDate: ['date', 'recent'],

        title: ['name', 'title'],
        jobTitle: ['name', 'jobTitle'],
        jobType: ['name', 'jobType'],

        account: ['finance', 'account'],
        accountName: ['finance', 'accountName'],

        ip: ['internet', 'ip'],
        userAgent: ['internet', 'userAgent'],
    },
    columnTypes = Object.keys(columnConf),
    MAX_COLS = columnTypes.length;

const args = commandLineArgs([
  { name: 'cols', alias: 'c', type: Number, defaultValue: MAX_COLS },
  { name: 'rows', alias: 'r', type: Number, defaultValue: 200 },
]).parse();

let selectedColumns = columnTypes.slice(0, args.cols);

let rows = [];
for (let r = 0; r < args.rows; r++) {
    let row = {};
    for (let c = 0; c < args.cols; c++) {

        let colType = selectedColumns[c],
            col = columnConf[colType];

        // console.log(colType, col[0], col[1], faker[col[0]][col[1]]);
        row[colType] = faker[col[0]][col[1]]();
    }
    rows.push(row);
}

// console.log(args);
console.log(rows);
