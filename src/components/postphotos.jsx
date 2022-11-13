import axios from "axios";
import AWS from 'aws-sdk';
// import { fromCognitoIdentity } from "@aws-sdk/credential-providers";
// import { S3Client, S3 } from "@aws-sdk/client-s3";
// import { Upload } from "@aws-sdk/lib-storage";

const url = 'https://n5sfnt3ewfaq3lp4wqg64lzen40gzpdq.lambda-url.eu-west-1.on.aws/';

export async function postPhotos(values, fileList) {
    if (fileList?.length>0) {
        axios.get(url)
        .then((r) => {
        console.log(r);
        const uploadConfig = r.data;
        AWS.config.update({
            region: uploadConfig.region,
            credentials: new AWS.CognitoIdentityCredentials({
            IdentityPoolId: `${uploadConfig.region}:${uploadConfig.identityId}`,
            })
        });
        /*
            const p = {
            region: uploadConfig.region,
            credentials: fromCognitoIdentity({
                identityId: uploadConfig.identityId,
            })};
            const client = new S3(p) || new S3Client(p);
        */
        const uploads = fileList.map((file) => {
            console.log(file);
            const photoKey = `${values.email}/${file.name}`;
            const params = { Bucket: uploadConfig.bucketName, Key: photoKey, Body: file };
            console.log(params);
            // return new Upload({ client, params });
            return new AWS.S3.ManagedUpload({ params }).promise();
        });
        return Promise.allSettled([...uploads, axios.post(url,
                { ...values, files: fileList.map((f) => ({ name: f.name, 'content-type': f.type }))},
            )]
        );
        });
    }
    return Promise.prototype.then();
}