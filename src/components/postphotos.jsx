import AWS from 'aws-sdk';
import { getUploadCredentials } from './boatregisterposts';

export async function postPhotos(values, fileList) {
    if (fileList?.length > 0) {
        try {
            const r = await getUploadCredentials();
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
                const photoKey = `${values.email}/${file.name}`;
                const params = {
                    Bucket: uploadConfig.bucketName,
                    Key: photoKey,
                    ContentType: file.type,
                    Body: file,
                    Metadata: {
                        albumKey: values.albumKey,
                        copyright: values.copyright,
                    },
                };
                // return new Upload({ client, params });
                return new AWS.S3.ManagedUpload({ params }).promise();
            });
            return Promise.allSettled(uploads);
        } catch (e) {
            // console.log(e);
        }
    }
    return undefined;
}