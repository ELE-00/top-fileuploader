const prisma = require('../script.js');
const cloudinary = require('cloudinary').v2;

//create folders
async function createFolder(name, userId){
    await prisma.folder.create({
        data: {name: name, userId: userId}
    })
}

//get folders
async function getFoldersbyUserId(userId){
    return await prisma.folder.findMany({
        where: {userId},
        orderBy: {createdAt: 'desc'}
    });
    
}



//get all files by user id
async function getFileByUserId(userId){
        return await prisma.file.findMany({
        where: {userId, folderId: null},
        orderBy: {createdAt: 'desc'}
    });

}

//get files by folder id
async function getFileByFolderId(folderId){
        return await prisma.file.findMany({
        where: {folderId: folderId},
        orderBy: {createdAt: 'desc'}
    });

}

//upload files
async function uploadFile(file, userId, folderId) {
    // Configure Cloudinary
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    // Determine the Cloudinary resource type
    let resourceType = 'image'; // default
    if (file.mimetype.startsWith('video/')) {
        resourceType = 'video';
    } else if (!file.mimetype.startsWith('image/')) {
        resourceType = 'raw'; // PDFs, Word, Excel, etc.
    }

    try {
        // Upload to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(file.path, { resource_type: resourceType });
        console.log("uploadResult:", uploadResult.public_id);

        // Save to Prisma
        await prisma.file.create({
            data: {
                name: file.originalname,
                path: uploadResult.secure_url,
                publicId: uploadResult.public_id,
                size: file.size,
                userId: userId,
                folderId: folderId
            }
        });

        console.log(`File uploaded successfully: ${file.originalname}`);
    } catch (err) {
        console.error(err);
        console.log("Upload failed");
    }
}

//Delete file
async function deleteFile(filePublic_id, fileDbId){
//configuration:
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    try{
        await cloudinary.uploader.destroy(filePublic_id).then(result=>console.log(result)); 
        await prisma.file.delete( { where: {id: fileDbId}})       
    } catch (err) {
        console.error(err);
        return console.log("Delete failed");
    }

}

//Delete folder and contents
async function deleteFolder(folderId){

    try{
        //Get files in folder
        const folderFiles = await getFileByFolderId(folderId);
        //Delete files
        await folderFiles.forEach((file) => {
            deleteFile(file.publicId, file.id)

        })
        //Delete folder
        await prisma.folder.delete( { where: {id: folderId}}) 
   
    } catch (err) {
        console.error(err);
        return console.log("Delete failed");
    }

}



module.exports = {createFolder, getFoldersbyUserId, getFileByFolderId, getFileByUserId, uploadFile, deleteFile, deleteFolder};