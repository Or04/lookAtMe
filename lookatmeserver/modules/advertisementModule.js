const mysqlConnection = require('../config/dbConnection.js')
const fs = require('fs');
const geolib = require('geolib');


class Advertisement {
    constructor() {
        this.sqlConnection = false

    }

    sqlQuery = async (query) => {
        let sqlResponsed = await new Promise((resolved, reject) => {
            this.sqlConnection.query(query, function (error, results, fields) {
                if (error) {
                    reject(error.toString())
                }
                resolved(results)
            });
        })
        return (sqlResponsed)
    }

    connectSql = async () => {
        this.sqlConnection = require('../config/dbConnection.js')()
        if (this.sqlConnection.state == 'disconnected') {
            await new Promise((resolved, reject) => {
                this.sqlConnection.connect((error) => {
                    if (error) {
                        reject(error.toString())
                    }
                    resolved(true)
                })
            })
            let sqlResponed = await this.sqlQuery('use lookatme')
            return (sqlResponed);
        } else {
            throw 'class dont have sql object'
        }

    }

    disconnectSql = async () => {
        if (!(this.sqlConnection.state == 'disconnected')) {
            await new Promise((resolved, reject) => {
                this.sqlConnection.end((error) => {
                    if (error) {
                        console.log(error.toString())
                        reject(error.toString())
                    }
                    resolved(true)
                })
            })
            this.sqlConnection = false
            return (true)
        } else {
            throw 'cannot end sql connection'
        }
    }

    addAdvertisement = async (email, categoryId, description, address, price, name, phoneNumber) => {
        try {
            let connectSqlResponsed = await this.connectSql();
            let sqlQuery = await this.sqlQuery(`select * from users WHERE users.email='${email}'`)
            if (!(sqlQuery.length > 0)) {
                throw 'user email not found'
            }
            sqlQuery = await this.sqlQuery(`SELECT * FROM categories WHERE categories.id=${categoryId}`)
            if (!(sqlQuery.length > 0)) {
                throw 'category not found'
            }
            sqlQuery = await this.sqlQuery(`INSERT INTO advertisements(userEmail,price,serviceAddress,serviceDescription,categoryId,placeName,contactPhoneNumber) VALUES ('${email}','${price}','${address}','${description}',${categoryId},'${name}','${phoneNumber}')`)
            sqlQuery = await this.sqlQuery(`SELECT * FROM advertisements WHERE advertisements.userEmail="${email}" ORDER BY advertisements.id DESC LIMIT 1;`)
            await this.disconnectSql()
            return (sqlQuery[0].id)
        } catch (error) {
            await this.disconnectSql()
            throw error.toString()
        }
    }
    getAdvertisementsForUser = async (email) => {
        try {
            let connectSqlResponsed = await this.connectSql();
            let sqlQuery = await this.sqlQuery(`select * from users WHERE users.email='${email}'`)
            if (!(sqlQuery.length > 0)) {
                throw 'user email not found'
            }
            sqlQuery = await this.sqlQuery(`SELECT advertisements.id AS advertisementId,advertisements.contactPhoneNumber,advertisements.userEmail,advertisements.price,advertisements.serviceDescription,advertisements.serviceAddress,advertisements.categoryId,categories.description AS categoryDescription,advertisements.placeName,advertisements.contactPhoneNumber FROM advertisements INNER JOIN categories ON advertisements.categoryId=categories.id WHERE advertisements.userEmail='${email}'`)


            let fileSystem = fs.promises
            for (let i = 0; i < sqlQuery.length; i++) {
                let openDir;
                try {
                    openDir = await fileSystem.readdir(`public/images/${sqlQuery[i].userEmail}/${sqlQuery[i].advertisementId}/`)
                    if (openDir) {
                        for (let x = 0; x < openDir.length; x++) {
                            openDir[x] = `images/${sqlQuery[i].userEmail}/${sqlQuery[i].advertisementId}/${openDir[x]}`
                        }
                        sqlQuery[i].pictures = openDir

                    }
                } catch (error) {
                    //console.log(error)
                }
            }
            await this.disconnectSql()
            return (sqlQuery)
        } catch (error) {
            console.log(error);
            await this.disconnectSql()
            throw error.toString()
        }
    }
    updateAdvertisementDescription = async (description, advertisementId) => {
        try {
            let connectSqlResponsed = await this.connectSql();
            await this.sqlQuery(`SET autocommit = 0`)
            let sqlQuery = await this.sqlQuery(`SELECT * FROM advertisements WHERE advertisements.id=${advertisementId} FOR UPDATE`)
            if (!(sqlQuery.length > 0)) {
                throw 'advertisements id not found'
            }
            sqlQuery = await this.sqlQuery(`UPDATE advertisements SET advertisements.serviceDescription='${description}' WHERE advertisements.id=${advertisementId}`)
            await this.sqlQuery(`COMMIT`)
            await this.disconnectSql()
            return (sqlQuery)
        } catch (error) {
            console.log(error);
            await this.sqlQuery(`COMMIT`)
            await this.disconnectSql()
            throw error.toString()
        }
    }
    updateAdvertisementAddress = async (address, advertisementId) => {
        try {
            let connectSqlResponsed = await this.connectSql();
            await this.sqlQuery(`SET autocommit = 0`)
            let sqlQuery = await this.sqlQuery(`SELECT * FROM advertisements WHERE advertisements.id=${advertisementId} FOR UPDATE`)
            if (!(sqlQuery.length > 0)) {
                throw 'advertisements id not found'
            }
            sqlQuery = await this.sqlQuery(`UPDATE advertisements SET advertisements.serviceAddress='${address}' WHERE advertisements.id=${advertisementId}`)
            await this.sqlQuery(`COMMIT`)
            await this.disconnectSql()
            return (sqlQuery)
        } catch (error) {
            console.log(error);
            await this.sqlQuery(`COMMIT`)
            await this.disconnectSql()
            throw error.toString()
        }
    }

    updateAdvertisementName = async (advertisementName, advertisementId) => {
        try {
            let connectSqlResponsed = await this.connectSql();
            await this.sqlQuery(`SET autocommit = 0`)
            let sqlQuery = await this.sqlQuery(`SELECT * FROM advertisements WHERE advertisements.id=${advertisementId} FOR UPDATE`)
            if (!(sqlQuery.length > 0)) {
                throw 'advertisements id not found'
            }
            sqlQuery = await this.sqlQuery(`UPDATE advertisements SET advertisements.placeName='${advertisementName}' WHERE advertisements.id=${advertisementId}`)
            await this.sqlQuery(`COMMIT`)
            await this.disconnectSql()
            return (sqlQuery)
        } catch (error) {
            console.log(error);
            await this.sqlQuery(`COMMIT`)
            await this.disconnectSql()
            throw error.toString()
        }
    }

    updateAdvertisementPrice = async (price, advertisementId) => {
        try {
            let connectSqlResponsed = await this.connectSql();
            await this.sqlQuery(`SET autocommit = 0`)
            let sqlQuery = await this.sqlQuery(`SELECT * FROM advertisements WHERE advertisements.id=${advertisementId} FOR UPDATE`)
            if (!(sqlQuery.length > 0)) {
                throw 'advertisements id not found'
            }
            sqlQuery = await this.sqlQuery(`UPDATE advertisements SET advertisements.price='${price}' WHERE advertisements.id=${advertisementId}`)
            await this.sqlQuery(`COMMIT`)
            await this.disconnectSql()
            return (sqlQuery)
        } catch (error) {
            console.log(error);
            await this.sqlQuery(`COMMIT`)
            await this.disconnectSql()
            throw error.toString()
        }
    }

    updateAdvertisementPhoneNumber = async (phoneNumber, advertisementId) => {
        try {
            let connectSqlResponsed = await this.connectSql();
            await this.sqlQuery(`SET autocommit = 0`)
            let sqlQuery = await this.sqlQuery(`SELECT * FROM advertisements WHERE advertisements.id=${advertisementId} FOR UPDATE`)
            if (!(sqlQuery.length > 0)) {
                throw 'advertisements id not found'
            }
            sqlQuery = await this.sqlQuery(`UPDATE advertisements SET advertisements.contactPhoneNumber='${phoneNumber}' WHERE advertisements.id=${advertisementId}`)
            await this.sqlQuery(`COMMIT`)
            await this.disconnectSql()
            return (sqlQuery)
        } catch (error) {
            console.log(error);
            await this.sqlQuery(`COMMIT`)
            await this.disconnectSql()
            throw error.toString()
        }
    }


    deleteAdvertisement = async (advertisementId) => {
        try {
            let connectSqlResponsed = await this.connectSql();
            await this.sqlQuery(`SET autocommit = 0`)
            let sqlQuery = await this.sqlQuery(`SELECT * FROM advertisements WHERE advertisements.id=${advertisementId} FOR UPDATE`)
            if (!(sqlQuery.length > 0)) {
                throw 'advertisements id not found'
            } else {
                let fileSystem = fs.promises
                if (typeof sqlQuery[0].userEmail != 'undefined' &&
                    typeof sqlQuery[0].id != 'undefined') {
                    try {
                        await fileSystem.rmdir(`public/images/${sqlQuery[0].userEmail}/${sqlQuery[0].id}/`, {recursive: true})
                    } catch (error) {
                        console.log(error)
                    }
                }
            }
            sqlQuery = await this.sqlQuery(`DELETE FROM advertisements  WHERE advertisements.id=${advertisementId}`)
            await this.sqlQuery(`COMMIT`)
            await this.disconnectSql()
            return (sqlQuery)
        } catch (error) {
            console.log(error);
            await this.sqlQuery(`COMMIT`)
            await this.disconnectSql()
            throw error.toString()
        }
    }
    getAdvertisementsQuery = async (categoryId, cityId, digitalBoardId) => {

        try {
            let connectSqlResponsed = await this.connectSql();
            let sqlQuery = await this.sqlQuery(`SET SESSION  sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''))`)


            sqlQuery = await this.sqlQuery(`SELECT * FROM categories WHERE categories.id=${categoryId}`)
            if (!(sqlQuery.length > 0)) {
                throw 'category id not found'
            }
            sqlQuery = await this.sqlQuery(`SELECT * FROM cities WHERE cities.id=${cityId}`)
            if (!(sqlQuery.length > 0)) {
                throw 'city id not found'
            }
            if (digitalBoardId) {
                sqlQuery = await this.sqlQuery(`SELECT advertisements.id AS advertisementsId,categories.description AS categoryDescription,advertisements.contactPhoneNumber,advertisements.userEmail,advertisements.serviceDescription,advertisements.serviceAddress,advertisements.price,advertisements.categoryId,advertisements.placeName,adDigitalBoards.digitalBoardId,cities.city,cities.id AS cityId FROM advertisements INNER JOIN adDigitalBoards  ON advertisements.id = adDigitalBoards.advertisementId INNER join categories ON advertisements.categoryId = categories.id INNER JOIN digitalBoards  ON adDigitalBoards.digitalBoardId = digitalBoards.id INNER JOIN cities  ON digitalBoards.cityId = cities.id WHERE cities.id=${cityId} AND advertisements.categoryId=${categoryId} AND digitalBoards.id=${digitalBoardId}`)
                if (!(sqlQuery.length > 0)) {
                    throw 'לא נמצאו מודעותconsumer'
                }
            } else {
                sqlQuery = await this.sqlQuery(`SELECT advertisements.id AS advertisementsId,categories.description AS categoryDescription,advertisements.contactPhoneNumber,advertisements.userEmail,advertisements.serviceDescription,advertisements.serviceAddress,advertisements.price,advertisements.categoryId,advertisements.placeName,adDigitalBoards.digitalBoardId,cities.city,cities.id AS cityId FROM advertisements INNER JOIN adDigitalBoards  ON advertisements.id = adDigitalBoards.advertisementId INNER JOIN digitalBoards  ON adDigitalBoards.digitalBoardId = digitalBoards.id INNER join categories ON advertisements.categoryId = categories.id INNER JOIN cities  ON digitalBoards.cityId = cities.id WHERE cities.id=${cityId} AND advertisements.categoryId=${categoryId} GROUP BY advertisementId`)
            }
            for (let i = 0; i < sqlQuery.length; i++) {
                let fileSystem = fs.promises
                let openDir;
                try {
                    openDir = await fileSystem.readdir(`public/images/${sqlQuery[i].userEmail}/${sqlQuery[i].advertisementsId}/`)
                    if (openDir) {
                        for (let x = 0; x < openDir.length; x++) {
                            openDir[x] = `images/${sqlQuery[i].userEmail}/${sqlQuery[i].advertisementsId}/${openDir[x]}`
                        }
                    }
                    sqlQuery[i].pictures = [...openDir]
                } catch (error) {
                    console.log(error)
                    if (!error.errno == -2) { 
                        throw error.toString()
                    }
                }
            }
            await this.disconnectSql()
            return (sqlQuery)
        } catch (error) {
            console.log(error);
            await this.disconnectSql()
            throw error.toString()
        }
    }

    getAdvertisementsForConsumer = async (consumerEmail) => {
        try {
            let connectSqlResponsed = await this.connectSql();
            let sqlQuery = await this.sqlQuery(`SET SESSION  sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''))`)
            sqlQuery = await this.sqlQuery(`select * from users WHERE users.email='${consumerEmail}'`)
            if (!(sqlQuery.length > 0)) {
                throw 'consumer id not found'
            }
            sqlQuery = await this.sqlQuery(`SELECT advertisements.contactPhoneNumber,advertisements.userEmail,advertisements.id,advertisements.placeName,advertisements.categoryId,advertisements.price,advertisements.serviceAddress,advertisements.serviceDescription,categories.description AS categoryDescription FROM users INNER JOIN consumerNearDigitalBoard ON users.email=consumerNearDigitalBoard.email  INNER  JOIN adDigitalBoards ON adDigitalBoards.digitalBoardId=consumerNearDigitalBoard.digitalBoardId INNER JOIN advertisements  on adDigitalBoards.advertisementId = advertisements.id INNER JOIN categories  on advertisements.categoryId = categories.id WHERE users.email='${consumerEmail}' LIMIT 8`)
            for (let i = 0; i < sqlQuery.length; i++) {
                let fileSystem = fs.promises
                let openDir;
                try {
                    openDir = await fileSystem.readdir(`public/images/${sqlQuery[i].userEmail}/${sqlQuery[i].id}/`)
                    if (openDir) {
                        for (let x = 0; x < openDir.length; x++) {
                            openDir[x] = `images/${sqlQuery[i].userEmail}/${sqlQuery[i].id}/${openDir[x]}`
                        }
                    }
                    sqlQuery[i].pictures = [...openDir]
                } catch (error) {
                    throw error.toString()
                }
            }
            await this.disconnectSql()
            return (sqlQuery)
        } catch (error) {
            console.log(error);
            await this.disconnectSql()
            throw error.toString()
        }
    }
    getAdvertisementForDigitalBoard = async (boardId) => {
        try {
            let connectSqlResponsed = await this.connectSql();
            let sqlQuery = await this.sqlQuery(`SELECT * FROM digitalBoards WHERE digitalBoards.id=${boardId}`)
            if (!(sqlQuery.length > 0)) {
                throw 'digital board not found'
            }
            let digitalBoardLocation = await this.sqlQuery(`SELECT ST_X(digitalBoards.location) AS latitude,ST_Y(digitalBoards.location) AS longitude FROM digitalBoards WHERE digitalBoards.id=${boardId}`)
            let getLocationForAllconsumers = await this.sqlQuery(`SELECT userEmail,ST_X(location) AS latitude,ST_Y(location) AS longitude FROM userLocation`)
            let findUserNearBoard = false
            getLocationForAllconsumers.forEach(userLocation => {
                if ((geolib.getDistance(digitalBoardLocation[0], {
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude
                })) < 1000) {
                    findUserNearBoard = userLocation;
                }
            })
            sqlQuery = await this.sqlQuery(`SELECT advertisements.userEmail,advertisements.id,advertisements.categoryId,advertisements.price,advertisements.serviceAddress,advertisements.serviceDescription,categories.description FROM digitalBoards INNER  JOIN adDigitalBoards ON adDigitalBoards.digitalBoardId=digitalBoards.id INNER JOIN advertisements  on adDigitalBoards.advertisementId = advertisements.id INNER JOIN categories  on advertisements.categoryId = categories.id WHERE digitalBoards.id=${boardId}`)
            for (let i = 0; i < sqlQuery.length; i++) {
                let fileSystem = fs.promises
                let openDir;
                try {
                    openDir = await fileSystem.readdir(`public/images/${sqlQuery[i].userEmail}/${sqlQuery[i].id}/`)
                    if (openDir) {
                        for (let x = 0; x < openDir.length; x++) {
                            openDir[x] = `images/${sqlQuery[i].userEmail}/${sqlQuery[i].id}/${openDir[x]}`
                        }
                    }
                    sqlQuery[i].pictures = [...openDir]
                } catch (error) {
                    throw error.toString()
                }
            }

            await this.disconnectSql()
            if (findUserNearBoard) {
                sqlQuery = {
                    advertisements: sqlQuery,
                    nearbyUser: findUserNearBoard
                }
            }
            return (sqlQuery)
        } catch (error) {
            console.log(error);
            await this.disconnectSql()
            throw error.toString()
        }
    }
    addAdvertisementForConsumer = async (email, advertisementsId) => {
        try {
            let connectSqlResponsed = await this.connectSql()
            let sqlQuery = await this.sqlQuery(`SELECT * FROM users WHERE users.email='${email}'`)
            if (!(sqlQuery.length > 0)) {
                throw 'user email not found'
            }
            sqlQuery = await this.sqlQuery(`SELECT * FROM advertisements WHERE advertisements.id=${advertisementsId}`)
            if (!(sqlQuery.length > 0)) {
                throw 'advertisements id not found'
            }
            sqlQuery = await this.sqlQuery(`SELECT * FROM userAds WHERE userAds.userEmail='${email}' AND userAds.advertisementId=${advertisementsId}`)
            if ((sqlQuery.length > 0)) {
                throw 'advertisements allready at user '
            }
            sqlQuery = await this.sqlQuery(`INSERT INTO userAds(userAds.advertisementId,userAds.userEmail) VALUES (${advertisementsId},'${email}')`)
            await this.disconnectSql()
            return (sqlQuery)
        } catch (error) {

            await this.disconnectSql()
            throw error.toString()
        }
    }
    deleteAdvertisementFormConsumer = async (email, advertisementsId) => {
        try {
            let connectSqlResponsed = await this.connectSql()
            await this.sqlQuery(`SET autocommit = 0`)
            let sqlQuery = await this.sqlQuery(`SELECT * FROM users WHERE users.email='${email}'`)
            if (!(sqlQuery.length > 0)) {
                throw 'user email not found'
            }
            sqlQuery = await this.sqlQuery(`SELECT * FROM advertisements WHERE advertisements.id=${advertisementsId}`)
            if (!(sqlQuery.length > 0)) {
                throw 'advertisements id not found'
            }
            sqlQuery = await this.sqlQuery(`SELECT * FROM userAds WHERE userAds.userEmail='${email}' AND userAds.advertisementId=${advertisementsId} FOR UPDATE`)
            if (!(sqlQuery.length > 0)) {
                throw 'consumer dont have this advertisement'
            }
            sqlQuery = await this.sqlQuery(`DELETE FROM userAds WHERE userAds.userEmail='${email}' AND userAds.advertisementId=${advertisementsId}`)
            await this.sqlQuery(`COMMIT`)
            await this.disconnectSql()
            return (sqlQuery)
        } catch (error) {
            console.log(error)
            await this.sqlQuery(`COMMIT`)
            await this.disconnectSql()
            throw error.toString()
        }
    }

    getConsumerSelectedAds = async (email) => {
        try {
            let connectSqlResponsed = await this.connectSql()
            let sqlQuery = await this.sqlQuery(`SET SESSION  sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''))`)
            sqlQuery = await this.sqlQuery(`SELECT * FROM users WHERE users.email='${email}'`)
            if (!(sqlQuery.length > 0)) {
                throw 'user email not found'
            }
            sqlQuery = await this.sqlQuery(`SELECT advertisements.contactPhoneNumber,categories.description AS categoryDescription,advertisements.categoryId,advertisements.price,advertisements.serviceAddress,advertisements.serviceDescription,advertisements.placeName,userAds.advertisementId,advertisements.userEmail FROM advertisements INNER join categories ON advertisements.categoryId = categories.id INNER JOIN userAds  on advertisements.id = userAds.advertisementId WHERE userAds.userEmail='${email}' GROUP BY userAds.advertisementId`)
            for (let i = 0; i < sqlQuery.length; i++) {
                if (typeof sqlQuery[i].userEmail != 'undefined') {
                    let sql = await this.sqlQuery(`SELECT * FROM advertiserRank WHERE advertiserRank.advertiserEmail='${sqlQuery[i].userEmail}' AND advertiserRank.consumerEmail='${email}'`)
                    if (sql.length > 0 && typeof sql[0].rank != 'undefined') {
                        sqlQuery[i].rank = sql[0].rank+1
                    } else {
                        sqlQuery[i].rank = false
                    }
                } else {
                    sqlQuery[i].rank = false
                }
            }
            await this.disconnectSql()
            return (sqlQuery)
        } catch (error) {
            await this.disconnectSql()
            throw error.toString()
        }
    }

    rankAdvertiser = async (advertiserEmail, consumerEmail, consumerRank) => {
        try {
            let connectSqlResponsed = await this.connectSql()
            let sqlQuery = await this.sqlQuery(`SELECT * FROM users WHERE users.email='${advertiserEmail}'`)
            if (!(sqlQuery.length > 0)) {
                throw 'user email not found'
            }
            sqlQuery = await this.sqlQuery(`SELECT * FROM users WHERE users.email='${consumerEmail}'`)
            if (!(sqlQuery.length > 0)) {
                throw 'consumer email not found'
            }
            sqlQuery = await this.sqlQuery(`SELECT * FROM advertiserRank WHERE advertiserRank.advertiserEmail='${advertiserEmail}' AND advertiserRank.consumerEmail='${consumerEmail}'`)
            if (sqlQuery.length > 0) {
                throw 'משתמש דורג בעבר'
            }
            sqlQuery = await this.sqlQuery(`INSERT INTO advertiserRank(advertiserEmail,consumerEmail,rank) VALUES ('${advertiserEmail}','${consumerEmail}',${consumerRank})`)
            sqlQuery = await this.sqlQuery(`SELECT * FROM advertiserRank WHERE advertiserRank.advertiserEmail='${advertiserEmail}' AND advertiserRank.consumerEmail='${consumerEmail}'`)
            await this.disconnectSql()
            return (sqlQuery)
        } catch (error) {

            await this.disconnectSql()
            throw error.toString()
        }
    }

    checkForConsumerRank = async (advertiserEmail, consumerEmail) => {
        try {
            let connectSqlResponsed = await this.connectSql()
            let sqlQuery = await this.sqlQuery(`SELECT * FROM users WHERE users.email='${consumerEmail}'`)
            if (!(sqlQuery.length > 0)) {
                throw 'consumer email not found'
            }
            sqlQuery = await this.sqlQuery(`SELECT * FROM users WHERE users.email='${advertiserEmail}'`)
            if (!(sqlQuery.length > 0)) {
                throw 'advertiser email not found'
            }
            sqlQuery = await this.sqlQuery(`SELECT * FROM advertiserRank WHERE advertiserRank.advertiserEmail='${advertiserEmail}' AND advertiserRank.consumerEmail='${consumerEmail}'`)
            await this.disconnectSql()
            return (sqlQuery)
        } catch (error) {

            await this.disconnectSql()
            throw error.toString()
        }
    }

    getAdViews = async (advertisementId) => {
        try {
            let connectSqlResponsed = await this.connectSql()
            let sqlQuery = await this.sqlQuery(`SELECT * FROM advertisements WHERE advertisements.id=${advertisementId}`)
            if (!(sqlQuery.length > 0)) {
                throw 'advertisements id not found'
            }


            sqlQuery = await this.sqlQuery(`SELECT COUNT(advertisementId) as views FROM userAds WHERE  advertisementId=${advertisementId}`)

            await this.disconnectSql()
            return (sqlQuery)
        } catch (error) {

            await this.disconnectSql()
            throw error.toString()
        }
    }

    getAdvertisementForSmartScreen = async (digitalBoardId, consumerEmail) => {
        try {
            let connectSqlResponsed = await this.connectSql();
            let sqlQuery = await this.sqlQuery(`SELECT * FROM digitalBoards WHERE digitalBoards.id=${digitalBoardId}`)
            if (!(sqlQuery.length > 0)) {
                throw 'digital board not found'
            }
            if (consumerEmail) {
                sqlQuery = await this.sqlQuery(`SELECT advertisements.userEmail,advertisements.id,advertisements.categoryId,advertisements.price,advertisements.serviceAddress,advertisements.placeName,advertisements.contactPhoneNumber,matchingAds.weight,advertisements.serviceDescription,categories.description AS categoryText,matchingAds.weight FROM digitalBoards INNER  JOIN adDigitalBoards ON adDigitalBoards.digitalBoardId=digitalBoards.id INNER JOIN advertisements  on adDigitalBoards.advertisementId = advertisements.id INNER JOIN categories  on advertisements.categoryId = categories.id INNER JOIN matchingAds on advertisements.id = matchingAds.advertisementId WHERE digitalBoards.id=${digitalBoardId} AND matchingAds.userEmail='${consumerEmail}'`)


            } else {
                sqlQuery = await this.sqlQuery(`SELECT advertisements.userEmail,advertisements.id,advertisements.categoryId,advertisements.price,advertisements.serviceAddress,advertisements.placeName,advertisements.contactPhoneNumber,advertisements.serviceDescription,categories.description AS categoryText FROM digitalBoards INNER  JOIN adDigitalBoards ON adDigitalBoards.digitalBoardId=digitalBoards.id INNER JOIN advertisements  on adDigitalBoards.advertisementId = advertisements.id INNER JOIN categories  on advertisements.categoryId = categories.id WHERE digitalBoards.id=${digitalBoardId}`)
            }


            for (let i = 0; i < sqlQuery.length; i++) {
                let adViews = await this.sqlQuery(`SELECT COUNT(advertisementId) as views FROM userAds WHERE  advertisementId=${sqlQuery[i].id}`)
                let adRank = await this.sqlQuery(`SELECT AVG(rank) as averageRank FROM advertiserRank WHERE advertiserRank.advertiserEmail='${sqlQuery[i].userEmail}'`)
                if (typeof adViews[0].views != 'undefined') {
                    sqlQuery[i].views = adViews[0].views
                } else {
                    sqlQuery[i].views = false
                }


                if (typeof adRank[0].averageRank != 'undefined') {
                    sqlQuery[i].averageRank = adRank[0].averageRank
                } else {
                    sqlQuery[i].averageRank = false
                }
            }
            for (let i = 0; i < sqlQuery.length; i++) {
                let fileSystem = fs.promises
                let openDir;
                try {
                    openDir = await fileSystem.readdir(`public/images/${sqlQuery[i].userEmail}/${sqlQuery[i].id}/`)
                    if (openDir) {
                        for (let x = 0; x < openDir.length; x++) {
                            openDir[x] = `images/${sqlQuery[i].userEmail}/${sqlQuery[i].id}/${openDir[x]}`
                        }
                    }
                    sqlQuery[i].pictures = [...openDir]
                } catch (error) {
                    if (!error.errno == -2) {
                        throw error
                    } else {
                        sqlQuery[i].pictures = []
                    }
                }
            }
            await this.disconnectSql()
            return (sqlQuery)
        } catch (error) {
            console.log(error);
            await this.disconnectSql()
            throw error.toString()
        }
    }

}


module.exports = Advertisement