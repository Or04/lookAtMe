const mysqlConnection = require('../config/dbConnection.js')
const Category = require('../modules/categoriesModule')
const Advertisement = require('../modules/advertisementModule')


module.exports = {
    addAdvertisement: async (req, res) => {
        try {
            if (typeof req.body.email != 'undefined' &&
                typeof req.body.categoryId != 'undefined' &&
                typeof req.body.description != 'undefined' &&
                typeof req.body.address != 'undefined' &&
                typeof req.body.price != 'undefined' &&
                typeof req.body.name != 'undefined' &&
                typeof req.body.phoneNumber != 'undefined') {
                let advertisement = new Advertisement;
                let addAdvertisementResponsed = await advertisement.addAdvertisement(
                    req.body.email,
                    req.body.categoryId,
                    req.body.description,
                    req.body.address,
                    req.body.price,
                    req.body.name,
                    req.body.phoneNumber)
                res.status(200).send({value: addAdvertisementResponsed})
            } else {
                throw 'some info not sent'
            }
        } catch (error) {
            res.status(500).send({value: error.toString()})
        }
    },
    getAdvertisementsForUser: async (req, res) => {
        try {
            if (typeof req.body.email != 'undefined') {
                let advertisement = new Advertisement;
                let getAdvertisementsForUserResponsed = await advertisement.getAdvertisementsForUser(req.body.email)
                res.status(200).send({value: getAdvertisementsForUserResponsed})
            } else {
                throw 'some info not sent'
            }
        } catch (error) {
            res.status(500).send({value: error.toString()})
        }
    },
    updateAdvertisementDescription: async (req, res) => {
        try {
            if (typeof req.body.description != 'undefined' && typeof req.body.advertisementId != 'undefined') {
                let advertisement = new Advertisement;
                let updateAdvertisementDescriptionResponsed = await advertisement.updateAdvertisementDescription(req.body.description, req.body.advertisementId)
                res.status(200).send({value: updateAdvertisementDescriptionResponsed})
            } else {
                throw 'some info not sent'
            }
        } catch (error) {
            res.status(500).send({value: error.toString()})
        }
    },
    updateAdvertisementAddress: async (req, res) => {
        try {
            if (typeof req.body.address != 'undefined' && typeof req.body.advertisementId != 'undefined') {
                let advertisement = new Advertisement;
                let updateAdvertisementAddressResponsed = await advertisement.updateAdvertisementAddress(req.body.address, req.body.advertisementId)
                res.status(200).send({value: updateAdvertisementAddressResponsed})
            } else {
                throw 'some info not sent'
            }
        } catch (error) {
            res.status(500).send({value: error.toString()})
        }
    },
    updateAdvertisementPrice: async (req, res) => {
        try {
            if (typeof req.body.price != 'undefined' && typeof req.body.advertisementId != 'undefined') {
                let advertisement = new Advertisement;
                let updateAdvertisementPriceResponsed = await advertisement.updateAdvertisementPrice(req.body.price, req.body.advertisementId)
                res.status(200).send({value: updateAdvertisementPriceResponsed})
            } else {
                throw 'some info not sent'
            }
        } catch (error) {
            res.status(500).send({value: error.toString()})
        }
    },
    updateAdvertisementPhoneNumber: async (req, res) => {
        try {
            if (typeof req.body.phoneNumber != 'undefined' && typeof req.body.advertisementId != 'undefined') {
                let advertisement = new Advertisement;
                let updateAdvertisementPhoneNumberResponsed = await advertisement.updateAdvertisementPhoneNumber(req.body.phoneNumber, req.body.advertisementId)
                res.status(200).send({value: updateAdvertisementPhoneNumberResponsed})
            } else {
                throw 'some info not sent'
            }
        } catch (error) {
            res.status(500).send({value: error.toString()})
        }
    },
    deleteAdvertisement: async (req, res) => {
        try {
            if (typeof req.body.advertisementId != 'undefined') {
                let advertisement = new Advertisement;
                let deleteAdvertisementResponsed = await advertisement.deleteAdvertisement(req.body.advertisementId)
                res.status(200).send({value: deleteAdvertisementResponsed})
            } else {
                throw 'some info not sent'
            }
        } catch (error) {
            res.status(500).send({value: error.toString()})
        }
    },
    updateAdvertisementName: async (req, res) => {
        try {
            if (typeof req.body.advertisementId != 'undefined' && typeof req.body.name != 'undefined') {
                let advertisement = new Advertisement;
                let updateAdvertisementNameResponsed = await advertisement.updateAdvertisementName(req.body.name, req.body.advertisementId)
                res.status(200).send({value: updateAdvertisementNameResponsed})
            } else {
                throw 'some info not sent'
            }
        } catch (error) {
            res.status(500).send({value: error.toString()})
        }
    },
    getAdvertisementsForConsumer: async (req, res) => {

        try {
            if (typeof req.body.consumerEmail != 'undefined') {
                let advertisement = new Advertisement;
                let getAdvertisementsForConsumerResponsed = await advertisement.getAdvertisementsForConsumer(req.body.consumerEmail)
                res.status(200).send({value: getAdvertisementsForConsumerResponsed})
            } else {
                throw 'some info not sent'
            }
        } catch (error) {
            res.status(500).send({value: error.toString()})
        }
    },

    getAdvertisementForDigitalBoard: async (req, res) => {
        console.log(res.setHeaders)
        try {
            if (typeof req.query.boardId != 'undefined') {
                let advertisement = new Advertisement;
                let getAdvertisementForDigitalBoardResponsed = await advertisement.getAdvertisementForDigitalBoard(req.query.boardId)
                res.status(200).send({value: getAdvertisementForDigitalBoardResponsed})
            } else {
                throw 'some info not sent'
            }
        } catch (error) {
            res.status(500).send({value: error.toString()})
        }
    },

    getAdvertisementsQuery: async (req, res) => {

        try {
            if (typeof req.body.categoryId != 'undefined' && typeof req.body.cityId != 'undefined' && typeof req.body.digitalBoardId != 'undefined') {
                let advertisement = new Advertisement;
                let getAdvertisementsQueryResponsed = await advertisement.getAdvertisementsQuery(req.body.categoryId, req.body.cityId, req.body.digitalBoardId)
                res.status(200).send({value: getAdvertisementsQueryResponsed})
            } else {
                throw 'some info not sent'
            }
        } catch (error) {
            res.status(500).send({value: error.toString()})
        }
    },
    addAdvertisementForConsumer: async (req, res) => {

        try {
            if (typeof req.body.email != 'undefined' && typeof req.body.advertisementsId != 'undefined') {
                let advertisement = new Advertisement;
                let addAdvertisementForConsumerResponsed = await advertisement.addAdvertisementForConsumer(req.body.email, req.body.advertisementsId)
                res.status(200).send({value: addAdvertisementForConsumerResponsed})
            } else {
                throw 'some info not sent'
            }
        } catch (error) {
            res.status(500).send({value: error.toString()})
        }
    },
    deleteAdvertisementFormConsumer: async (req, res) => {

        try {
            if (typeof req.body.email != 'undefined' && typeof req.body.advertisementsId != 'undefined') {
                let advertisement = new Advertisement;
                let deleteAdvertisementFormConsumerResponsed = await advertisement.deleteAdvertisementFormConsumer(req.body.email, req.body.advertisementsId)
                res.status(200).send({value: deleteAdvertisementFormConsumerResponsed})
            } else {
                throw 'some info not sent'
            }
        } catch (error) {
            res.status(500).send({value: error.toString()})
        }
    },
    getConsumerSelectedAds: async (req, res) => {
        try {
            if (typeof req.body.email != 'undefined') {
                let advertisement = new Advertisement;
                let getConsumerSelectedAdsResponsed = await advertisement.getConsumerSelectedAds(req.body.email)
                res.status(200).send({value: getConsumerSelectedAdsResponsed})
            } else {
                throw 'some info not sent'
            }
        } catch (error) {
            res.status(500).send({value: error.toString()})
        }
    },
    rankAdvertiser: async (req, res) => {
        try {
            if (typeof req.body.advertiserEmail != 'undefined' && typeof req.body.consumerEmail != 'undefined' && typeof req.body.consumerRank != 'undefined') {
                let advertisement = new Advertisement;
                let rankAdvertiserResponsed = await advertisement.rankAdvertiser(req.body.advertiserEmail, req.body.consumerEmail, req.body.consumerRank)
                res.status(200).send({value: rankAdvertiserResponsed})
            } else {
                throw 'some info not sent'
            }
        } catch (error) {
            res.status(500).send({value: error.toString()})
        }
    },
    checkForConsumerRank: async (req, res) => {
        try {
            if (typeof req.body.advertiserEmail != 'undefined' && typeof req.body.consumerEmail != 'undefined') {
                let advertisement = new Advertisement;
                let checkForConsumerRankResponsed = await advertisement.checkForConsumerRank(req.body.advertiserEmail, req.body.consumerEmail)
                res.status(200).send({value: checkForConsumerRankResponsed})
            } else {
                throw 'some info not sent'
            }
        } catch (error) {
            res.status(500).send({value: error.toString()})
        }
    },

    getAdvertisementForSmartScreen: async (req, res) => {

        try {
            if (typeof req.body.digitalBoardId != 'undefined' && typeof req.body.consumerEmail != 'undefined') {
                let advertisement = new Advertisement;
                let getAdvertisementForSmartScreenResponsed = await advertisement.getAdvertisementForSmartScreen(req.body.digitalBoardId, req.body.consumerEmail)
                res.status(200).send({value: getAdvertisementForSmartScreenResponsed})
            } else {
                throw 'some info not sent'
            }
        } catch (error) {
            res.status(500).send({value: error.toString()})
        }
    },


    getAdViews: async (req, res) => {

        try {
            if (typeof req.body.advertisementId != 'undefined') {
                let advertisement = new Advertisement;
                let getAdViewsResponsed = await advertisement.getAdViews( req.body.advertisementId)
                res.status(200).send({value: getAdViewsResponsed})
            } else {
                throw 'some info not sent'
            }
        } catch (error) {
            res.status(500).send({value: error.toString()})
        }
    },

}