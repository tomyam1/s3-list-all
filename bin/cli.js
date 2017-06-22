#!/usr/bin/env node

'use strict';
const Yargs = require('yargs');
const Fs = require('fs');
const ListAllObjects = require('..');
const Csv = require('csv');
const Bluebird = require('bluebird');


Bluebird.promisifyAll(Fs);
const csvStringifyAsync = Bluebird.promisify(Csv.stringify);


const parseArgs = () => {
    return Yargs
        .usage('List all objects of a AWS S3 bucket')
        .option('bucket', {
            alias: 'b',
            demandOption: true,
            nargs: 1,
            describe: 'The name of the S3 bucket to list all objects of',
            type: 'string'
        })
        .option('prefix', {
            alias: 'p',
            demandOption: false,
            nargs: 1,
            describe: 'A prefix to filter the returned objects by',
            type: 'string'
        })
        .option('verbose', {
            alias: 'v',
            describe: 'Print progress information',
            type: 'boolean'
        })
        .option('output', {
            alias: 'o',
            demandOption: true,
            nargs: 1,
            describe: 'Save the results to this file',
            type: 'string'
        })
        .option('format', {
            alias: 'f',
            demandOption: true,
            nargs: 1,
            describe: 'The output format',
            default: 'json',
            choices: [ 'json', 'csv' ],
            type: 'string'
        })
        .help('help')
        .argv
    ;
};

const listAllFiles = (argv) => {
    const options = {
        bucket: argv.bucket
    };
    if (argv.prefix) options.prefix = argv.prefix;

    if (argv.verbose) {
        options.progress = (data) => {
            console.log(`Batch num ${data.batchNum}, returned ${data.batchFiles.length} files, total files ${data.allFiles.length}`);
        }
    }

    return ListAllObjects(options)
};

const writeOutput = (argv, allFiles) => {
    let contentPromise;
    if (argv.format === 'json') {
        contentPromise = Bluebird.resolve(JSON.stringify(allFiles, null, 2));
    } else {
        contentPromise = csvStringifyAsync(allFiles, {
            header: true
        });
    }
    return contentPromise.then((content) => {
        return Fs.writeFileAsync(argv.output, content);
    });
};

const main = () => {
    const argv = parseArgs();

    listAllFiles(argv).then((allFiles) => {
       return writeOutput(argv, allFiles);
    });
};

main();
