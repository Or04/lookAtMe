const User = require('../modules/usersModule')





module.exports = {
    addUser: async (req, res) => {










    },
    logIn: async (req, res) => {
        try {
            if (req.body.password != 'undefined' && req.body.email != 'undefined') {
                let user = new User
                let logInResponsed = await user.userConnection(req.body.email, req.body.password)
                res.status(200).send({value: logInResponsed})
            } else {
                res.status(500).send({value: 'no email or no password'})
            }
        } catch (error) {
            res.status(500).send({value: error.toString()})
        }
    },
    userType: async (req, res) => {
        try {
            if (req.body.email != 'undefined') {
                let user = new User
                let userTypeResponsed = await user.userType(req.body.email)
                res.status(200).send({value: userTypeResponsed})
            } else {
                res.status(500).send({value: 'no email or no password'})
            }
        } catch (error) {
            res.status(500).send({value: error.toString()})
        }
    },
    getPremiumUsers: async (req, res) => {
        try {
            let user = new User
            let getPremiumUsersResponsed = await user.getPremiumUsers()
            res.status(200).send({value: getPremiumUsersResponsed})
        } catch (error) {
            res.status(500).send({value: error.toString()})
        }
    },
    updatePremium: async (req, res) => {
        try {
            if (req.body.userEmail != 'undefined') {
                let user = new User
                let updatePremiumResponsed = await user.updatePremium(req.body.userEmail)
                res.status(200).send({value: updatePremiumResponsed})
            } else {
                res.status(500).send({value: 'no email or no status sent'})
            }
        } catch (error) {
            res.status(500).send({value: error.toString()})
        }

    },

    deleteUser: async (req, res) => {
        try {
            if (req.body.userEmail != 'undefined') {
                let user = new User
                let deleteUserResponsed = await user.deleteUser(req.body.userEmail)
                res.status(200).send({value: deleteUserResponsed})
            } else {
                res.status(500).send({value: 'no email sent'})
            }
        } catch (error) {
            res.status(500).send({value: error.toString()})
        }

    },
    userRegistration: async (req, res) => {
        try {
            if (typeof  req.body.email != 'undefined' && typeof  req.body.firstName != 'undefined' &&typeof  req.body.lastName != 'undefined' && typeof  req.body.password != 'undefined' && typeof  req.body.digitalBoardId != 'undefined') {
                let user = new User
                let userRegistrationResponsed = await user.userRegistration(req.body.email,req.body.firstName,req.body.lastName,req.body.password,req.body.digitalBoardId)
                res.status(200).send({value: userRegistrationResponsed})
            } else {
                res.status(500).send({value: 'some parameter not sent '})
            }
        } catch (error) {
            res.status(500).send({value: error.toString()})
        }
    },
    sendUserLocation: async (req, res) => {
        try {
            if (typeof req.body.email != 'undefined' && typeof  req.body.latitude != 'undefined' && typeof  req.body.longitude != 'undefined') {
                let user = new User
                let sendUserLocationResponsed = await user.sendUserLocation(req.body.email,req.body.latitude,req.body.longitude)
                res.status(200).send({value: sendUserLocationResponsed})
            } else {
                res.status(500).send({value: 'some info not sent '})
            }
        } catch (error) {
            res.status(500).send({value: error.toString()})
        }
    },
    updateUserRankCategories: async (req, res) => {
        try {
            if (typeof  req.body.email != 'undefined' && typeof  req.body.RankCategoriesArray != 'undefined' ) {
                let user = new User
                let updateUserRankCategoriesResponsed = await user.updateUserRankCategories(req.body.email,req.body.RankCategoriesArray)
                res.status(200).send({value: updateUserRankCategoriesResponsed})
            } else {
                res.status(500).send({value: 'some parameter not sent '})
            }
        } catch (error) {
            res.status(500).send({value: error.toString()})
        }
    },
    checkForPremium: async (req, res) => {
        try {
            if (typeof  req.body.advertiserEmail != 'undefined' && typeof  req.body.advertisementId != 'undefined') {
                let user = new User
                let checkForPremiumResponsed = await user.checkForPremium(req.body.advertiserEmail,req.body.advertisementId)

                res.status(200).send({value: checkForPremiumResponsed})
            } else {

                res.status(500).send({value: 'some parameter not sent '})
            }
        } catch (error) {
            res.status(500).send({value: error.toString()})
        }
    },
    logOffConsumerFromSmartScreen: async (req, res) => {
        try {
            if (typeof  req.body.consumerEmail != 'undefined') {
                let user = new User
                let logOffConsumerFromSmartScreenResponsed = await user.logOffConsumerFromSmartScreen(req.body.consumerEmail)

                res.status(200).send({value: logOffConsumerFromSmartScreenResponsed})
            } else {

                res.status(500).send({value: 'some parameter not sent '})
            }
        } catch (error) {
            res.status(500).send({value: error.toString()})
        }
    },
    sendSignUpEmail: async (req, res) => {
        try {
            if (typeof  req.body.email != 'undefined' && typeof  req.body.advertisementId != 'undefined') {
                let user = new User
                let sendSignUpEmailResponsed = await user.sendSignUpEmail(req.body.email,req.body.advertisementId)

                res.status(200).send({value: sendSignUpEmailResponsed})
            } else {

                res.status(500).send({value: 'some parameters not sent '})
            }
        } catch (error) {
            res.status(500).send({value: error.toString()})
        }
    },
    setConsumerNearDigitalBoard: async (req, res) => {
        try {
            if (typeof  req.body.consumerEmail != 'undefined' && typeof  req.body.digitalBoardId != 'undefined') {
                let user = new User
                let setConsumerNearDigitalBoardResponsed = await user.setConsumerNearDigitalBoard(req.body.consumerEmail,req.body.digitalBoardId)

                res.status(200).send({value: setConsumerNearDigitalBoardResponsed})
            } else {

                res.status(500).send({value: 'some parameters not sent '})
            }
        } catch (error) {
            res.status(500).send({value: error.toString()})
        }
    },


}