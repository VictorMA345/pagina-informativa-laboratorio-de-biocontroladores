const { google } = require('googleapis');
const stream = require('stream');
const Jimp = require('jimp');
const sharp = require('sharp');
const apikeys = require('./api-keys.json');
const SCOPE = ['https://www.googleapis.com/auth/drive'];
function esURLGoogleDriveValida(url) {
    const regex = /^https:\/\/drive\.google\.com\/uc\?id=([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    if (match && match[1]) {
      return true;
    }
    return false;
  }
function extractFileIdFromUrl(fileUrl) {
    const match = fileUrl.match(/id=([^&]+)/);
    if (match && match[1]) {
        return match[1];
    }
    throw new Error('URL de Google Drive no válida o no se pudo extraer el ID del archivo.');
}
async function authorize() {
    const jwtClient = new google.auth.JWT(
        apikeys.client_email,
        null,
        apikeys.private_key,
        SCOPE
    );
    await jwtClient.authorize();
    return jwtClient;
}
async function uploadFile(authClient, uploadedFile, folderName, childFolder) {
    return new Promise(async (resolve, reject) => {
        const drive = google.drive({ version: 'v3', auth: authClient });
        let folderId = await getFolderId(drive, folderName);
        if (!folderId) {
            folderId = await createFolder(drive, folderName);
        }
        let childFolderId = await getFolderId(drive, childFolder, folderId);
        if (!childFolderId) {
            childFolderId = await createFolder(drive, childFolder, folderId);
        }
        const fileMetaData = {
            name: uploadedFile.originalname,
            parents: [childFolderId]
        };
        const bufferStream = new stream.PassThrough();
        bufferStream.end(uploadedFile.buffer);

        drive.files.create({
            resource: fileMetaData,
            media: {
                body: bufferStream,
                mimeType: uploadedFile.mimetype
            },
            fields: 'id'
        }, (error, file) => {
            if (error) {
                return reject(error);
            }
            resolve(file);
        });
    });
}

async function getFolderId(drive, folderName, parentFolderId = null) {
    let query = `name='${folderName}' and mimeType='application/vnd.google-apps.folder'`;
    if (parentFolderId) {
        query += ` and '${parentFolderId}' in parents`;
    }
    const response = await drive.files.list({
        q: query,
        fields: 'files(id)'
    });
    return response.data.files.length > 0 ? response.data.files[0].id : null;
}

async function createFolder(drive, folderName, parentFolderId = null) {
    const fileMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: parentFolderId ? [parentFolderId] : []
    };
    const response = await drive.files.create({
        resource: fileMetadata,
        fields: 'id'
    });
    return response.data.id;
}
const deleteFileFromDrive = async (authClient,fileUrl) => {
    const drive = google.drive({ version: 'v3', auth: authClient });
    try {
        const fileId = extractFileIdFromUrl(fileUrl);
        await drive.files.delete({ fileId });
    } catch (error) {
        console.error('Error al eliminar el archivo de Google Drive:', error);
    }
};
async function replaceFileInDrive(authClient, newFile, fileUrl,childFolder) {
    const drive = google.drive({ version: 'v3', auth: authClient });
    try {
        const fileId = extractFileIdFromUrl(fileUrl);
        await drive.files.delete({ fileId });
        const folderName = process.env.GOOGLE_DRIVE_FOLDER_NAME;
        const file = await uploadFile(authClient, newFile, folderName, childFolder);    
        return file['data'].id;
    } catch (error) {
        console.error('Error al reemplazar el archivo en Google Drive:');
        throw error;
    }
}

const addWatermarkToImage = async (fileBuffer) => {
    try {
        const imageBuffer = await sharp(fileBuffer)
        .toFormat('jpeg')
        .png()
        .toBuffer();
      const image = await Jimp.read(imageBuffer);
      const watermark = await Jimp.read('./uploads/logo.png'); 
      const x = image.bitmap.width - watermark.bitmap.width - 10;
      const y = image.bitmap.height - watermark.bitmap.height - 10; 
      image.composite(watermark, x, y, {
        mode: Jimp.BLEND_SOURCE_OVER,
        opacityDest: 1,
        opacitySource: 0.9,
      });   
  
      const watermarkedImageBuffer = await image.getBufferAsync(Jimp.MIME_JPEG); 
      return watermarkedImageBuffer;
    } catch (error) {
      console.error('Error al agregar la marca de agua:', error);
      return null;
    }
  };
  function contieneSoloNumerosOSimbolos(texto) {
    const patron = /^[0-9!@#$%^&*()_+|~\-=\[\]{};:'",.<>/?\\]+$/i;
    return patron.test(texto);
  }
  function esEmailValido(email) {
    const patron = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return patron.test(email);
  }
module.exports = {
    authorize,
    uploadFile,
    getFolderId,
    createFolder,
    deleteFileFromDrive,
    replaceFileInDrive,
    esURLGoogleDriveValida,
    addWatermarkToImage,
    contieneSoloNumerosOSimbolos,
    esEmailValido
};

