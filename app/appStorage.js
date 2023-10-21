const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req,file,cb) =>{
    if(file.mimetype.split("/")[0] === 'image' || file.mimetype.split("/")[0] === 'application' ){
        cb(null,true);
    }else{
        cb(new Error("No se acepta ese tipo de archivo"),false)
    }
}
const upload = multer({ storage,fileFilter,limits: {filesize: 12500000 ,files: 20}});

module.exports = { upload }