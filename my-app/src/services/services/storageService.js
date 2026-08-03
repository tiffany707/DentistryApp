const { Storage } = require('@google-cloud/storage');
const storage = new Storage;
const bucket = storage.bucket('dentistapp-bucket')

async function UploadToCloud(filePath, destination, userId){
    await bucket.upload(filePath, { destination });

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destination}`;
    return {publicUrl, userId}
}

module.exports =  { UploadToCloud }