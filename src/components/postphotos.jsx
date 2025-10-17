import { getUploadCredentials } from '../util/api';
import { fromCognitoIdentity } from "@aws-sdk/credential-providers";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

export async function postPhotos(copyright, email, albumKey, fileList, onProgress = () => { }) {
    const { bucketName, region, identityId } = await getUploadCredentials();
    const credentials = fromCognitoIdentity({ identityId, clientConfig: { region } });
    console.log('Upload credentials', bucketName, region, credentials);
    const client = new S3Client({ region, credentials });
    console.log('S3 Client', client);
    const progress = fileList.reduce((acc, file) => ({ ...acc, [file.name]: { loaded: 0, total: file.size } }), {});
    const totalSize = fileList.reduce((acc, file) => acc + file.size, 0);
    const uploaders = fileList.map((file) => {
        const upload = new Upload({
            client, params: {
                Bucket: bucketName,
                Key: `${email}/${file.name}`,
                ContentType: file.type,
                Body: file,
                Metadata: { albumKey, copyright },
            }
        });
        console.log('Starting upload for', file.name);
        console.log('Upload object', upload);
        upload.on("httpUploadProgress", (p) => {
            progress[file.name].loaded = p.loaded;
            const loaded = Object.values(progress).reduce((acc, v) => acc + v.loaded, 0);
            onProgress(Math.round((loaded / totalSize) * 100));
        });
        return upload.done();
    });
    console.log('Uploading', uploaders);
    const p = Promise.allSettled(uploaders)
    console.log('Upload promises', p);
    return p;;
}