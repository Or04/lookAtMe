const mysqlConnection = require('../config/dbConnection.js')


class City {
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

    getAllCities = async () => {
        try {
            let connectSqlResponsed = await this.connectSql();
            let sqlResponed = await this.sqlQuery(`SELECT cities.id,cities.city,ST_X(cities.location) AS latitude,ST_Y(cities.location) AS longitude FROM cities`)
            await this.disconnectSql()
            return (sqlResponed)

        } catch (error) {
            await this.disconnectSql()
            throw error.toString()
        }
    }

    addCity = async (cityName, point) => {
        try {
            let connectSqlResponsed = await this.connectSql();
            let sqlResponed = await this.sqlQuery(`INSERT INTO cities(cities.city,cities.location) VALUES ('${cityName}',POINT(${point.latitude},${point.longitude}))`)
            await this.disconnectSql()
            return (sqlResponed)
        } catch (error) {
            await this.disconnectSql()
            throw error.toString()
        }
    }

    deleteCity = async (cityId) => {
        try {
            let connectSqlResponsed = await this.connectSql()
            await this.sqlQuery(`SET autocommit = 0`)
            let sqlQuery = await this.sqlQuery(`SELECT * FROM cities WHERE cities.id=${cityId} FOR UPDATE`)
            if (sqlQuery.length > 0) {
                let sqlQuery = await this.sqlQuery(`DELETE FROM cities WHERE cities.id=${cityId}`)
                await this.sqlQuery(`COMMIT`)
                await this.disconnectSql()
                return (sqlQuery)
            } else {
                throw `cannot find city id:${boardId}`
            }
        } catch (error) {
            await this.sqlQuery(`COMMIT`)
            await this.disconnectSql()
            throw error.toString()
        }
    }

    updateCity = async (cityName, cityId) => {
        try {
            let connectSqlResponsed = await this.connectSql()
            await this.sqlQuery(`SET autocommit = 0`)
            let sqlQuery = await this.sqlQuery(`SELECT * FROM cities WHERE cities.id=${cityId} FOR UPDATE`)
            if (sqlQuery.length > 0) {
                let sqlQuery = await this.sqlQuery(`UPDATE cities SET cities.city='${cityName}' WHERE cities.id=${cityId}`)
                await this.sqlQuery(`COMMIT`)
                await this.disconnectSql()
                return (sqlQuery)
            } else {
                throw `cannot find city id:${boardId}`
            }
        } catch (error) {
            await this.sqlQuery(`COMMIT`)
            await this.disconnectSql()
            throw error.toString()
        }
    }
    getCityInfo = async (cityId) => {
        try {
            let connectSqlResponsed = await this.connectSql()
            let sqlQuery = await this.sqlQuery(`SELECT ST_X(cities.location) AS latitude,ST_Y(cities.location) AS longitude,cities.id,cities.city  FROM cities WHERE cities.id=${cityId}`)
            if (!(sqlQuery.length > 0)) {
                throw 'city id not found'
            }
            await this.disconnectSql()
            return (sqlQuery)
        } catch (error) {

            await this.disconnectSql()
            throw error.toString()
        }
    }

}


module.exports = City