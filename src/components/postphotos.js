import { getUploadCredentials } from '../util/api';
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

export async function postPhotos(copyright, email, keywords, albumKey, fileList, onProgress = () => { }) {
    const { bucketName, region, identityPoolId } = await getUploadCredentials();
    const client = new S3Client({
        region,
        credentials: fromCognitoIdentityPool({
            clientConfig: { region },
            identityPoolId,
        }),
    });
    const progress = fileList.reduce((acc, file) => ({ ...acc, [file.name]: { loaded: 0, total: file.size } }), {});
    const totalSize = fileList.reduce((acc, file) => acc + file.size, 0);
    const uploaders = fileList.map((file) => {
        const key = `${email}/${file.name}`;
        try {
            const upload = new Upload({
                client,
                params: {
                    Bucket: bucketName,
                    Key: key,
                    ContentType: file.type,
                    Body: file,
                    Metadata: { albumKey, copyright, keywords: window.btoa(new TextEncoder().encode(keywords)) },
                },
            });
            upload.on("httpUploadProgress", (p) => {
                progress[file.name].loaded = p.loaded;
                const loaded = Object.values(progress).reduce((acc, v) => acc + v.loaded, 0);
                onProgress(Math.round((loaded / totalSize) * 100));
            });
            try {
                return upload.done();
            } catch (e) {
                console.error('Error in upload done for', file.name, e);
            }
        } catch (e) {
            console.error('Error creating upload for', file.name, e);
        }
        return null;
    });
    return Promise.allSettled(uploaders);
}