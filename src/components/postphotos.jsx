import { getUploadCredentials } from './boatregisterposts';
import { fromCognitoIdentity } from "@aws-sdk/credential-providers";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

function allProgress(proms, progress_cb) {
    let d = 0;
    progress_cb(0);
    return Promise.allSettled(proms.map((p) => {
        console.log('P', p);
        return p.then(() => {
            d++;
            progress_cb((d * 100) / proms.length);
        }).catch(err => console.log(err));
    }));
}

export async function postPhotos(copyright, email, albumKey, fileList, setProgress) {
    if (fileList?.length > 0) {
        try {
            const { bucketName, region, identityId } = await getUploadCredentials();
            const credentials = fromCognitoIdentity({ identityId, clientConfig: { region } });
            const client = new S3Client({ region, credentials });
            const uploads = fileList.map((file) => {
                const params = {
                    Bucket: bucketName,
                    Key: `${email}/${file.name}`,
                    ContentType: file.type,
                    Body: file,
                    Metadata: { albumKey, copyright },
                };
                const upload = new Upload({ client, params });
                upload.on("httpUploadProgress", (progress) => {
                    console.log('progress', progress);
                });
                const p = upload.done();
                return p;
            });
            const a = await allProgress(uploads, (p) => {
                setProgress(p);
            });
            console.log(a);
            return a;
        } catch (e) {
            // console.log(e);
        }
    }
    return undefined;
}