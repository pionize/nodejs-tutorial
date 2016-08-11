#!/usr/bin/env node

var Promise = require("bluebird");
var storage = Promise.promisifyAll(require('node-persist'));
var crypto = require('crypto-js');
var _ = require('lodash');
var yargs = require('yargs');
var argv = yargs.argv;
var command = argv._[0]; 

storage.initSync();

var options = yargs
        .command('create', 'Create an entry to store some service credentials.', function (yargs) {
        yargs.options({
            name: {
                demand: true,
                alias: 'n',
                description: 'Service name.',
                type: 'string'
            },
            username: {
                demand: true,
                alias: 'u',
                description: 'The username or email for the account.',
                type: 'string'
            },
            password: {
                demand: true,
                alias: 'p',
                description: 'The password for the account.',
                type: 'string'
            },
            masterPassword: {
                demand: true,
                alias: 'm',
                description: 'The master password to access the system.',
                type: 'string'
            }
        })
        .help('help');
    }, function(argv) {
        try {
            var createdAccount = createAccount({
                name: argv.name, 
                username: argv.username, 
                password: argv.password
            }, argv.masterPassword);

            console.log('Account created!');
            console.log(createdAccount);
        } catch (error) {
            console.log('Unable to create account!', error);
        }
    })
    .command('get', 'Fetch credentials for a particular service.', function (yargs) {
        yargs.options({
            name: {
                demand: true,
                alias: 'n',
                description: 'Service name.',
                type: 'string'
            },
            masterPassword: {
                demand: true,
                alias: 'm',
                description: 'The master password to access the system.',
                type: 'string'
            }
        }).help('help');
    }, function(argv) {
        try {
            var account = getAccount(argv.name, argv.masterPassword);

            if(account === null) {
                console.log('Account not found!');
            } else {
                console.log('Account found!');
                console.log(account);
            }
        } catch (error) {
            console.log('Unable to fetch account!');
        }
    })
    .help('help')
    .alias('n', 'name')
    .alias('p', 'password')
    .alias('u', 'username')
    .alias('m', 'masterPassword')
    .argv;

function getAccounts (masterPassword) {
    var encryptedAccount = storage.getItemSync('accounts');
    var accounts = [];

    if (typeof encryptedAccount !== 'undefined') {
        var bytes = crypto.AES.decrypt(encryptedAccount, masterPassword);
        accounts = JSON.parse(bytes.toString(crypto.enc.Utf8));
    }

    return accounts;
}

function saveAccounts (accounts, masterPassword) {
    var encryptedAccounts = crypto.AES.encrypt(JSON.stringify(accounts), masterPassword);

    storage.setItemSync('accounts', encryptedAccounts.toString());

    return accounts;
}

function createAccount (account, masterPassword) {
    account = _.omitBy(account, _.isNil);
    if (_.size(account) < 3) {
        throw new Error('service name, user name, and password are required');
    }
    if (!masterPassword) throw new Error('masterPassword not defined');

    var accounts = getAccounts(masterPassword);

    accounts.push(account);

    saveAccounts(accounts, masterPassword);

    return account;
}

function getAccount (accountName, masterPassword) {
    var accounts = getAccounts(masterPassword);
    var foundAccount = null;

    _.forEach(accounts, function(value, key) {
        if(value.name === accountName) {
            foundAccount = value;
        }
    });

    return foundAccount;
}

if (options.help || _.size(options) === 3) {
    yargs.showHelp();
}
