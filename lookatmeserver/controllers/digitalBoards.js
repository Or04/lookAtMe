const DigitalBoard = require('../modules/digitalBoardModule')


module.exports = {
    addDigitalBoard: async (req, res) => {

        try {
            if (typeof req.body.point != 'undefined' && typeof req.body.cityId != 'undefined') {
                let digitalBoard = new DigitalBoard
                let addDigitalBoardResponsed = await digitalBoard.addDigitalBoard(req.body.point, req.body.cityId)
                res.status(200).send({value: addDigitalBoardResponsed})
            } else {
                res.status(500).send({value: 'point or city id not sent'})
            }
        } catch (error) {
            res.status(500).send({value: error.toString()})
        }
    },

    getAllDigitalBoards: async (req, res) => {
        try {
            if (typeof req.body.cityId != 'undefined') {
                let digitalBoard = new DigitalBoard
                let getAllDigitalBoardsResponsed = await digitalBoard.getAllDigitalBoards(req.body.cityId)
                res.status(200).send({value: getAllDigitalBoardsResponsed})
            } else {
                res.status(500).send({value: 'city id not sent'})
            }
        } catch (error) {
            res.status(500).send({value: error.toString()})
        }
    },
    deleteDigitalBoard: async (req, res) => {
        try {
            if (typeof req.body.boardId != 'undefined') {
                let digitalBoard = new DigitalBoard
                let deleteDigitalBoardResponsed = await digitalBoard.deleteDigitalBoard(req.body.boardId)
                res.status(200).send({value: deleteDigitalBoardResponsed})
            } else {
                res.status(500).send({value: 'digital board id  not sent'})
            }
        } catch (error) {
            res.status(500).send({value: error.toString()})
        }
    },
    addDigitalBoardToAdvertisement: async (req, res) => {
        try {
            if (typeof req.body.advertisementId != 'undefined' && typeof req.body.DigitalBoardsId != 'undefined') {
                let digitalBoard = new DigitalBoard;
                let addDigitalBoardToAdvertisementResponsed = await digitalBoard.addDigitalBoardToAdvertisement(req.body.advertisementId, req.body.DigitalBoardsId)
                res.status(200).send({value: addDigitalBoardToAdvertisementResponsed})
            } else {
                throw 'some info not sent'
            }
        } catch (error) {
            res.status(500).send({value: error.toString()})
        }
    },
    getDigitalBoardsForAdvertisements: async (req, res) => {

        try {
            if (typeof req.body.advertisementId != 'undefined') {
                let digitalBoard = new DigitalBoard;
                let getDigitalBoardsForAdvertisementsResponsed = await digitalBoard.getDigitalBoardsForAdvertisements(req.body.advertisementId)
                res.status(200).send({value: getDigitalBoardsForAdvertisementsResponsed})
            } else {
                throw 'some info not sent'
            }
        } catch (error) {
            res.status(500).send({value: error.toString()})
        }
    },
    deleteDigitalBoardFromAdvertisement: async (req, res) => {
        try {
            if (typeof req.body.advertisementId != 'undefined' && typeof req.body.digitalBoardId != 'undefined') {
                let digitalBoard = new DigitalBoard;
                let deleteDigitalBoardFromAdvertisementResponsed = await digitalBoard.deleteDigitalBoardFromAdvertisement(req.body.advertisementId, req.body.digitalBoardId)
                res.status(200).send({value: deleteDigitalBoardFromAdvertisementResponsed})
            } else {
                throw 'some info not sent'
            }
        } catch (error) {
            res.status(500).send({value: error.toString()})
        }
    },
    getDigitalBoardInfo: async (req, res) => {
        try {
            if (typeof req.body.boardId != 'undefined') {
                let digitalBoard = new DigitalBoard;
                let getDigitalBoardInfoResponsed = await digitalBoard.getDigitalBoardInfo(req.body.boardId)
                res.status(200).send({value: getDigitalBoardInfoResponsed})
            } else {
                throw 'some info not sent'
            }
        } catch (error) {
            res.status(500).send({value: error.toString()})
        }
    },
    getConsumerNearDigitalBoard: async (req, res) => {
        try {
            if (typeof req.body.consumerEmail != 'undefined') {
                let digitalBoard = new DigitalBoard;
                let getConsumerNearDigitalBoardResponsed = await digitalBoard.getConsumerNearDigitalBoard(req.body.consumerEmail)
                res.status(200).send({value: getConsumerNearDigitalBoardResponsed})
            } else {
                throw 'some info not sent'
            }
        } catch (error) {
            res.status(500).send({value: error.toString()})
        }
    },

}