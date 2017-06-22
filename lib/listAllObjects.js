'use strict';
const Bluebird = require('bluebird');
const AWS = require('aws-sdk');
const Joi = require('joi');


const validateOptions = (options, callback) => {
    Joi.assert(options, Joi.object().keys({
        bucket: Joi.string().required(),
        prefix: Joi.string().allow(null, '').optional(),
        progress: Joi.func().allow(null).optional(),
        s3Options: Joi.object().optional()
    }).required());
    Joi.assert(callback, Joi.func().allow(null));
};

const listAllObjects = (options, callback) => {
    validateOptions(options, callback);

    const s3 = new AWS.S3(options.s3options || {});
    Bluebird.promisifyAll(s3);

    const params = {
        Bucket: options.bucket
    };
    if (options.prefix) params.Prefix = options.prefix;

    const allFiles = [];
    let batchNum = 0;

    const listAllObjects = (continuationToken) => {
        batchNum += 1;
        if (continuationToken) params.ContinuationToken = continuationToken;

        return s3.listObjectsV2Async(params).then((data) => {
            const nextContinuationToken = data.NextContinuationToken;
            const batchFiles = data.Contents;

            batchFiles.forEach((file) => allFiles.push(file));

            if (options.progress) {
                options.progress({
                    batchNum,
                    batchFiles,
                    allFiles,
                    lastBatch: !nextContinuationToken
                })
            }


            if (nextContinuationToken) {
                return listAllObjects(nextContinuationToken);
            }
        });
    };

    return listAllObjects().return(allFiles).asCallback(callback);
};

module.exports = listAllObjects;