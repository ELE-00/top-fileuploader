const  {Router} = require("express");
const folderRouter = Router();
const multer  = require('multer')
const prisma = require('../script.js')

const {createFolder, getFoldersbyUserId, getFileByFolderId, getFileByUserId, uploadFile, deleteFile, deleteFolder} = require("../controllers/folderController.js")

folderRouter.get("/", async (req,res) => {
    const userId = req.user.id;
    const folders = await getFoldersbyUserId(userId);
    const files = await getFileByUserId(userId);
    res.render("index", {user: req.user, folders: folders, files: files})
})


//Create folder
folderRouter.post("/", async (req, res) => {
    const name = req.body.folderName;
    const userId = req.user.id;

    await createFolder(name, userId)
    res.redirect("/");
})


//Folder dynamic router

folderRouter.get("/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    const files = await getFileByFolderId(id)
    res.render("folder", {user: req.user, files: files, folder: req.params})
})


//File upload
const upload = multer({ dest: './public/uploads/' })
folderRouter.post('/upload', upload.single('uploaded_file'), async function (req, res) {
    const userId = req.user.id;
    let folderId = parseInt(req.body.folderId);

    if(!folderId){
        folderId = null;
        await uploadFile(req.file, userId, folderId)
        res.redirect("/");
    } else{
        folderId = parseInt(req.body.folderId); 
        await uploadFile(req.file, userId, folderId)
        res.redirect(`/${folderId}`);
    }

    console.log("Folder id: " + folderId)

  console.log(req.file)

});

module.exports = folderRouter;

//Delete file
folderRouter.post('/delete-file', async function (req, res) {
    const userId = req.user.id;
    const filePublic_id = req.body.filePublic_id;
    const fileDbId = parseInt(req.body.fileDbId);
    let folderId = parseInt(req.body.folderId);

    if(!folderId){
        folderId = null;
        await deleteFile(filePublic_id, fileDbId)
        res.redirect("/");
    } else{
        folderId = parseInt(req.body.folderId); 
        await deleteFile(filePublic_id, fileDbId)
        res.redirect(`/${folderId}`);
    }

    console.log("Folder id: " + folderId)

  console.log(req.file)

});

//Delete folder
folderRouter.post('/delete-folder', async function (req, res) {

    const userId = req.user.id;

    let folderId = parseInt(req.body.folderId);

    await deleteFolder(folderId)
    res.redirect("/");

    console.log("Folder id: " + folderId)

  console.log(req.file)

});

//Download files
const axios = require("axios");

folderRouter.get("/download/:id", async (req, res) => {
    const fileId = parseInt(req.params.id);
    const file = await prisma.file.findUnique({ where: { id: fileId }});

    if (!file) return res.status(404).send("File not found");

    try {
        // Fetch file from Cloudinary
        const response = await axios.get(file.path, { responseType: "stream" });

        // Set headers for download
        res.setHeader("Content-Disposition", `attachment; filename="${file.name}"`);
        res.setHeader("Content-Type", response.headers["content-type"]);

        // Pipe the Cloudinary response to the client
        response.data.pipe(res);
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to download file");
    }
});



