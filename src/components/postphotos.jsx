import { getUploadCredentials } from './boatregisterposts';
import { fromCognitoIdentity } from "@aws-sdk/credential-providers";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from"@aws-sdk/lib-storage";

export async function postPhotos({ email, albumKey, copyright }, fileList) {
    if (fileList?.length > 0) {
        try {
            const { bucketName, region, identityId } = await getUploadCredentials();
            const client = new S3Client({
                region,
                credentials: fromCognitoIdentity({ identityId }),
            });
            const uploads = fileList.map((file) => {
                const params = {
                    Bucket: bucketName,
                    Key: `${email}/${file.name}`,
                    ContentType: file.type,
                    Body: file,
                    Metadata: { albumKey, copyright },
                };
                return new Upload({ client, params });
            });
            return Promise.allSettled(uploads);
        } catch (e) {
            // console.log(e);
        }
    }
    return undefined;
}