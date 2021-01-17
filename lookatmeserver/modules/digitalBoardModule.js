const mysqlConnection = require('../config/dbConnection.js')
const fetch = require('node-fetch')


class DigitalBoard {
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

    addDigitalBoard = async (point, cityId) => {


        try {
            await this.connectSql();
            let sqlQuery = await this.sqlQuery(`SELECT * FROM cities WHERE cities.id=${cityId}`)
            if (sqlQuery.length > 0) {
                let addressResponed=await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${point.latitude},${point.longitude}&language=iw&key=????`)
                addressResponed=await addressResponed.json()

                let sqlQuery = await this.sqlQuery(`insert into digitalBoards(cityId, location,address) VALUES ((select cities.id from cities where cities.id=${cityId}),POINT(${point.latitude},${point.longitude}),'${addressResponed.results[0].formatted_address}')`)
                await this.disconnectSql()
                return (sqlQuery)
            } else {
                await this.disconnectSql()
                throw `cannot find city id :${cityId}`
            }
        } catch (error) {
            await this.disconnectSql()
            throw error.toString()
        }
    }
    getAllDigitalBoards = async (cityId) => {

        try {
            await this.connectSql();
            let sqlResponed = await this.sqlQuery(`SELECT digitalBoards.id,digitalBoards.cityId,ST_X(digitalBoards.location) AS latitude,ST_Y(digitalBoards.location) AS longitude,address  FROM digitalBoards JOIN cities ON digitalBoards.cityId=cities.id WHERE digitalBoards.cityId=${cityId}`)
            await this.disconnectSql()
            return (sqlResponed)
        } catch (error) {
            await this.disconnectSql()
            throw error.toString()
        }
    }

    deleteDigitalBoard = async (boardId) => {
        try {
            let connectSqlResponsed = await this.connectSql()
            await this.sqlQuery(`SET autocommit = 0`)
            let sqlQuery = await this.sqlQuery(`SELECT * FROM digitalBoards WHERE digitalBoards.id=${boardId} FOR UPDATE`)
            if (sqlQuery.length > 0) {
                let sqlQuery = await this.sqlQuery(`DELETE FROM digitalBoards WHERE digitalBoards.id=${boardId}`)
                await this.sqlQuery(`COMMIT`)
                await this.disconnectSql()
                return (sqlQuery)
            } else {
                throw `cannot find digital board id:${boardId}`
            }
        } catch (error) {
            await this.sqlQuery(`COMMIT`)
            await this.disconnectSql()
            throw error.toString()
        }
    }

    addDigitalBoardToAdvertisement = async (advertisementId, DigitalBoardsId) => {
        try {
            let connectSqlResponsed = await this.connectSql();

            let sqlQuery = await this.sqlQuery(`SELECT * FROM advertisements WHERE advertisements.id=${advertisementId}`)
            if (!(sqlQuery.length > 0)) {
                throw 'advertisements id not found'
            }
            sqlQuery = await this.sqlQuery(`SELECT * FROM digitalBoards WHERE digitalBoards.id=${DigitalBoardsId}`)
            if (!(sqlQuery.length > 0)) {
                throw 'digital board id not found'
            }
            sqlQuery = await this.sqlQuery(`INSERT INTO adDigitalBoards(advertisementId, digitalBoardId) VALUES (${advertisementId},${DigitalBoardsId})`)

            await this.disconnectSql()
            return (sqlQuery)
        } catch (error) {
            console.log(error);

            await this.disconnectSql()
            throw error.toString()
        }
    }
    getDigitalBoardsForAdvertisements = async (advertisementId) => {
        try {
            let connectSqlResponsed = await this.connectSql();

            let sqlQuery = await this.sqlQuery(`SELECT * FROM advertisements WHERE advertisements.id=${advertisementId}`)
            if (!(sqlQuery.length > 0)) {
                throw 'advertisements id not found'
            }
            sqlQuery = await this.sqlQuery(`SELECT  cities.city,digitalBoards.cityId,digitalBoards.id,digitalBoards.cityId,ST_X(digitalBoards.location) AS latitude,ST_Y(digitalBoards.location) AS longitude  FROM adDigitalBoards INNER JOIN digitalBoards ON adDigitalBoards.digitalBoardId = digitalBoards.id INNER JOIN cities  on digitalBoards.cityId = cities.id WHERE adDigitalBoards.advertisementId=${advertisementId}`)


            await this.disconnectSql()
            return (sqlQuery)
        } catch (error) {
            console.log(error);

            await this.disconnectSql()
            throw error.toString()
        }
    }

    deleteDigitalBoardFromAdvertisement = async (advertisementId, digitalBoardId) => {
        try {
            let connectSqlResponsed = await this.connectSql();
            await this.sqlQuery(`SET autocommit = 0`)
            let sqlQuery = await this.sqlQuery(`SELECT * FROM advertisements WHERE advertisements.id=${advertisementId} FOR UPDATE`)
            if (!(sqlQuery.length > 0)) {
                throw 'advertisements id not found'
            }
            sqlQuery = await this.sqlQuery(`SELECT * FROM digitalBoards WHERE digitalBoards.id=${digitalBoardId} FOR UPDATE`)
            if (!(sqlQuery.length > 0)) {
                throw 'digital board id not found'
            }
            sqlQuery = await this.sqlQuery(`DELETE FROM adDigitalBoards WHERE  adDigitalBoards.advertisementId=${advertisementId} AND adDigitalBoards.digitalBoardId=${digitalBoardId}`)
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
    getDigitalBoardInfo = async (boardId) => {
        try {
            let connectSqlResponsed = await this.connectSql();
            let sqlQuery = await this.sqlQuery(`SELECT ST_X(digitalBoards.location) AS latitude,ST_Y(digitalBoards.location) AS longitude FROM digitalBoards WHERE digitalBoards.id=${boardId}`)
            if (!(sqlQuery.length > 0)) {
                throw 'digital board not found'
            }
            await this.disconnectSql()
            return (sqlQuery)
        } catch (error) {
            console.log(error);
            await this.disconnectSql()
            throw error.toString()
        }
    }
    getConsumerNearDigitalBoard = async (consumerEmail) => {
        try {
            let connectSqlResponsed = await this.connectSql();
            let sqlQuery = await this.sqlQuery(`select * from users WHERE users.email='${consumerEmail}'`)
            if (!(sqlQuery.length > 0)) {
                throw 'consumer email not found'
            }
            sqlQuery = await this.sqlQuery(`SELECT consumerNearDigitalBoard.email,consumerNearDigitalBoard.digitalBoardId,digitalBoards.cityId,ST_X(digitalBoards.location) AS latitude,ST_Y(digitalBoards.location) AS longitude from consumerNearDigitalBoard  INNER JOIN digitalBoards ON digitalBoards.id=consumerNearDigitalBoard.digitalBoardId WHERE consumerNearDigitalBoard.email='${consumerEmail}'`)
            if (!(sqlQuery.length > 0)) {
                throw 'consumer did not set near digital board'
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


module.exports = DigitalBoard
