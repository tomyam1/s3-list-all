# s3-list-all-cli
CLI tool for listing all the objects of a AWS S3 bucket

## Install

For CLI usage:

    npm install -g s3-list-all-cli

For package usage:

    npm install --save  s3-list-all-cli

## CLI Usage


    List all objects of a AWS S3 bucket

    Options:
      --bucket, -b   The name of the S3 bucket to list all objects of
                                                                 [string] [required]
      --prefix, -p   A prefix to filter the returned objects by             [string]
      --verbose, -v  Print progress information                            [boolean]
      --output, -o   Save the results to this file               [string] [required]
      --format, -f   The output format
                      [string] [required] [choices: "json", "csv"] [default: "json"]
      --help         Show help                                             [boolean]

## Package usage

```js
const S3ListAll = require('s3-list-all-cli');

// Either using a promise
S3ListAll({
    bucket: 'bucket-name',
    prefix: 'prefix'
}).then((allObjects) => {
    // allObjects:
    // [
    //   {
    //     "Key": "image.jpeg",
    //     "LastModified": "2017-05-16T21:09:19.000Z",
    //     "ETag": "\"39df7f90cf9d2d1248790ef67081c5db\"",
    //     "Size": 955,
    //     "StorageClass": "STANDARD"
    //   }
    //   ...
    // ]
});

// Or a callback
S3ListAll({
    bucket: 'bucket-name',
    prefix: 'prefix'
}).then((err, allObjects) => {

});
```

### Options

* bucket (string, required) - The name of the S3 bucket to list all objects of
* prefix (string, optional) - A prefix to filter the returned objects by
* progress (string, optional) - A callback that will be called after each batch of 1000 objects is returned

### Examples

Save the results as JSON

    s3-list-all-cli -b bucket-name -p prefix -o results.json

Save the results as CSV

    s3-list-all-cli -b bucket-name -p prefix -o results.csv -f csv