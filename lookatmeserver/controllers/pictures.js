const mysqlConnection = require('../config/dbConnection.js')
const multer = require('multer')
const fs = require('fs')


module.exports = {
    addPicture: async (req, res) => {
        try {
            const storage = multer.diskStorage({
                destination: async (req, file, cb) => {
                    let fileSystem = fs.promises
                    try {
                        await fileSystem.mkdir('public/')
                    } catch (error) {
                        console.log(error)
                    }
                    try {
                        await fileSystem.mkdir('public/images/')
                    } catch (error) {
                        console.log(error)
                    }
                    try {
                        await fileSystem.mkdir(`public/images/${file.originalname.split('_')[0]}/`)
                    } catch (error) {
                        console.log(error)
                    }
                    try {
                        await fileSystem.mkdir(`public/images/${file.originalname.split('_')[0]}/${file.originalname.split('_')[1]}/`)
                    } catch (error) {
                        console.log(error)
                    }
                    cb(null, `public/images/${file.originalname.split('_')[0]}/${file.originalname.split('_')[1]}/`)
                },
                filename: async (req, file, cb) => {
                    cb(null, file.originalname)
                }
            })
            const upload = multer({storage: storage}).single('photo')

            upload(req, res, () => {
                // console.log(req.file);
                res.status(200).send({value: req.file.path})
            })
        } catch (error) {
            res.status(500).send({value: error.toString()})
        }
    },
    addCategoryPicture: async (req, res) => {
        try {
            const storage = multer.diskStorage({
                destination: async (req, file, cb) => {
                    let fileSystem = fs.promises
                    try {
                        await fileSystem.rmdir(`public/categories/${file.originalname.split('_')[0]}/`,{recursive:true})
                    } catch (error) {
                        console.log(error)
                    }
                    try {
                        await fileSystem.mkdir('public/')
                    } catch (error) {
                        console.log(error)
                    }
                    try {
                        await fileSystem.mkdir('public/categories/')
                    } catch (error) {
                        console.log(error)
                    }
                    try {
                        await fileSystem.mkdir(`public/categories/${file.originalname.split('_')[0]}/`)
                    } catch (error) {
                        console.log(error)
                    }
                    cb(null, `public/categories/${file.originalname.split('_')[0]}/`)
                },
                filename: async (req, file, cb) => {
                    cb(null, file.originalname)
                }
            })
            const upload = multer({storage: storage}).single('photo')

            upload(req, res, () => {
                // console.log(req.file);
                res.status(200).send({value: req.file.path})
            })
        } catch (error) {
            res.status(500).send({value: error.toString()})
        }
    },
    updateUserPicture: async (req, res) => {
        try {
            const storage = multer.diskStorage({
                destination: async (req, file, cb) => {
                    let fileSystem = fs.promises
                    try {
                        await fileSystem.rmdir(`public/userImages/${file.originalname.split('_')[0]}/`,{recursive:true})
                    } catch (error) {
                        console.log(error)
                    }
                    try {
                        await fileSystem.mkdir('public/')
                    } catch (error) {
                        console.log(error)
                    }
                    try {
                        await fileSystem.mkdir('public/userImages/')
                    } catch (error) {
                        console.log(error)
                    }
                    try {
                        await fileSystem.mkdir(`public/userImages/${file.originalname.split('_')[0]}/`)
                    } catch (error) {
                        console.log(error)
                    }
                    cb(null, `public/userImages/${file.originalname.split('_')[0]}/`)
                },
                filename: async (req, file, cb) => {
                    cb(null, file.originalname)
                }
            })
            const upload = multer({storage: storage}).single('photo')

            upload(req, res, () => {
                // console.log(req.file);
                res.status(200).send({value: req.file.path})
            })
        } catch (error) {
            res.status(500).send({value: error.toString()})
        }
    },
    removePicture: async (req, res) => {
        try {
            if (typeof req.body.pictureUrl != 'undefined') {
                let fileSystem = fs.promises
                let removePictureResponed = await fileSystem.unlink(`public${req.body.pictureUrl.split('http://lookatmeil.com')[1]}`)
                res.status(200).send({value: 'good'})
            } else {
                throw 'some info not sent'
            }
        } catch (error) {
            res.status(500).send({value: error.toString()})
        }
    },
    getPicturesForAdvertisement: async (req, res) => {
        console.log('here')
        try {
            if (typeof req.body.email != 'undefined' && typeof req.body.categoryId != 'undefined') {

                let fileSystem = fs.promises
                let openDir=[];
                try {
                    openDir = await fileSystem.readdir(`public/images/${req.body.email}/${req.body.categoryId}/`)
                    if (openDir) {
                        for (let x = 0; x < openDir.length; x++) {
                            openDir[x] = `images/${req.body.email}/${req.body.categoryId}/${openDir[x]}`
                        }
                    }
                } catch (error) {
                    if (!error.errno == -2) {  // this is ok when the advertiser did not add pictures for advertisement
                        throw error.toString()

                    }
                }
                //let removePictureResponed = await fileSystem.unlink(`public${req.body.pictureUrl.split('http://lookatmeil.com')[1]}`)
                res.status(200).send({value: openDir})
            } else {
                throw 'some info not sent'
            }
        } catch (error) {
            res.status(500).send({value: error.toString()})
        }
    },
}