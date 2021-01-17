const express = require('express')
const path = require('path')
const userController = require('./controllers/users.js')
const categoryController = require('./controllers/categories.js')
const citiesController = require('./controllers/cities')
const digitalBoardsController = require('./controllers/digitalBoards')
const advertisementsController = require('./controllers/advertisements')
const picturesController = require('./controllers/pictures')
const AnalysisAlgorithm = require('./modules/analysisAlgorithm')
const socketIo = require('./modules/socketIo')
const multer = require('multer')
const fs = require('fs');
const app = express()
const http = require('http').createServer(app);
const cors = require('cors')
const io = require('socket.io')(http)

app.set('view engine', 'hbs')
app.use(express.static(__dirname + '/public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())


const upload = multer({ dest: 'uploads/' })

app.post('/picture', upload.single('photo'), (req, res) => {
    console.log(req.file)
    console.log(req.headers)
    res.status(200).json({
        message: 'success!',
    })
})




app.post('/login', (req, res) => userController.logIn(req, res))
app.post('/sendsignupemail', (req, res) => userController.sendSignUpEmail(req, res))
app.get('/signUp', (req, res) => {
    res.render('signup', {
        advertisementId: typeof req.query.adId != "undefined" ? req.query.adId : null,
        email: typeof req.query.email != "undefined" ? req.query.email : null
    })
})
app.post('/usertype', (req, res) => userController.userType(req, res))
app.get('/getpremiumusers', (req, res) => userController.getPremiumUsers(req, res))
app.post('/updatepremium', (req, res) => userController.updatePremium(req, res))
app.post('/deleteuser', (req, res) => userController.deleteUser(req, res))
app.post('/userregistration', (req, res) => userController.userRegistration(req, res))
app.post('/updateuserrankcategories', (req, res) => userController.updateUserRankCategories(req, res))
app.post('/senduserlocation', (req, res) => userController.sendUserLocation(req, res))
app.post('/checkforpremium', (req, res) => userController.checkForPremium(req, res))
app.post('/logoffconsumerfromsmartscreen', (req, res) => userController.logOffConsumerFromSmartScreen(req, res))
app.post('/setconsumerneardigitalboard', (req, res) => userController.setConsumerNearDigitalBoard(req, res))


app.post('/addcategory', (req, res) => categoryController.addCategory(req, res))
app.post('/updatecategory', (req, res) => categoryController.updateCategory(req, res))
app.post('/deletecategory', (req, res) => categoryController.deleteCategory(req, res))
app.get('/getallcategories', (req, res) => categoryController.getAllCategories(req, res))
app.post('/getuserrankcategories', (req, res) => categoryController.getUseRrankCategories(req, res))
app.post('/getpictureforcategory', (req, res) => categoryController.getPictureForCategory(req, res))

app.post('/adddigitalboard', (req, res) => digitalBoardsController.addDigitalBoard(req, res))
app.post('/deletedigitalboard', (req, res) => digitalBoardsController.deleteDigitalBoard(req, res))
app.post('/getalldigitalboards', (req, res) => digitalBoardsController.getAllDigitalBoards(req, res))
app.post('/adddigitalboardtoadvertisement', (req, res) => digitalBoardsController.addDigitalBoardToAdvertisement(req, res))
app.post('/getdigitalboardsforadvertisements', (req, res) => digitalBoardsController.getDigitalBoardsForAdvertisements(req, res))
app.post('/deletedigitalboardfromadvertisement', (req, res) => digitalBoardsController.deleteDigitalBoardFromAdvertisement(req, res))
app.post('/getdigitalboardinfo', (req, res) => digitalBoardsController.getDigitalBoardInfo(req, res))
app.post('/getconsumerneardigitalboard', (req, res) => digitalBoardsController.getConsumerNearDigitalBoard(req, res))


app.post('/addpicture', (req, res) => picturesController.addPicture(req, res))
app.post('/addcategorypicture', (req, res) => picturesController.addCategoryPicture(req, res))
app.post('/updateuserpicture', (req, res) => picturesController.updateUserPicture(req, res))
app.post('/removepicture', (req, res) => picturesController.removePicture(req, res))
app.post('/getpicturesforadvertisement', (req, res) => picturesController.getPicturesForAdvertisement(req, res))


app.post('/addadvertisement', (req, res) => advertisementsController.addAdvertisement(req, res))
app.get('/getadvertisementfordigitalboard', (req, res) => advertisementsController.getAdvertisementForDigitalBoard(req, res))
app.post('/getadvertisementsforuser', (req, res) => advertisementsController.getAdvertisementsForUser(req, res))
app.post('/updateadvertisementdescription', (req, res) => advertisementsController.updateAdvertisementDescription(req, res))
app.post('/updateadvertisementaddress', (req, res) => advertisementsController.updateAdvertisementAddress(req, res))
app.post('/getadvertisementforsmartscreen', (req, res) => advertisementsController.getAdvertisementForSmartScreen(req, res))
app.post('/updateadvertisementprice', (req, res) => advertisementsController.updateAdvertisementPrice(req, res))
app.post('/updateadvertisementphonenumber', (req, res) => advertisementsController.updateAdvertisementPhoneNumber(req, res))


app.post('/deleteadvertisement', (req, res) => advertisementsController.deleteAdvertisement(req, res))
app.post('/updateadvertisementname', (req, res) => advertisementsController.updateAdvertisementName(req, res))
app.post('/getadvertisementsforconsumer', (req, res) => advertisementsController.getAdvertisementsForConsumer(req, res))
app.post('/updateadvertisementname', (req, res) => advertisementsController.updateAdvertisementName(req, res))
app.post('/getadvertisementsquery', (req, res) => advertisementsController.getAdvertisementsQuery(req, res))
app.post('/addadvertisementforconsumer', (req, res) => advertisementsController.addAdvertisementForConsumer(req, res))
app.post('/deleteadvertisementformconsumer', (req, res) => advertisementsController.deleteAdvertisementFormConsumer(req, res))
app.post('/getconsumerselectedads', (req, res) => advertisementsController.getConsumerSelectedAds(req, res))
app.post('/rankadvertiser', (req, res) => advertisementsController.rankAdvertiser(req, res))
app.post('/checkforconsumerrank', (req, res) => advertisementsController.checkForConsumerRank(req, res))
app.post('/getadviews', (req, res) => advertisementsController.getAdViews(req, res))


app.get('/getallcities', (req, res) => citiesController.getAllCities(req, res))
app.post('/addcity', (req, res) => citiesController.addCity(req, res))
app.post('/deletecity', (req, res) => citiesController.deleteCity(req, res))
app.post('/updatecity', (req, res) => citiesController.updateCity(req, res))
app.post('/getcityinfo', (req, res) => citiesController.getCityInfo(req, res))


app.post('/bbb', (req, res) => {
    console.log('time ' + Date.now())
    console.log(req.body)
    res.status(200).send({ value: 'yes' })

})



app.get('*', (req, res) => {
    res.send('not found');
})



http.listen(80, () => {
    console.log('exprees on port 80');
})





socketIo.setUpSocketIo(io)
const analysisAlgorithm = new AnalysisAlgorithm
analysisAlgorithm.analysisLoop()





