const mysqlConnection = require('../config/dbConnection.js')
const geolib = require('geolib')
const socketIo = require('./socketIo')


class AnalysisAlgorithm {
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

    userConnection = async (email, password) => {
        let connectSqlResponsed = await this.connectSql();
        let sqlResponed = await this.sqlQuery(`select * from users WHERE users.email='${email.toLocaleLowerCase()}'`)
        if (sqlResponed.length == 0) {
            await this.disconnectSql()
            throw 'incorrect email'
        } else {
            if (sqlResponed[0].userPassword != password) {
                await this.disconnectSql()
                throw  'incorrect password'
            } else {
                await this.disconnectSql()
                return sqlResponed[0].email
            }
        }

    }

    getPremiumUsers = async () => {
        try {
            let connectSqlResponsed = await this.connectSql()
            let sqlQuery = await this.sqlQuery(`SELECT users.email,users.firstName,users.lastName,users.premium FROM users`)
            await this.disconnectSql()
            return sqlQuery
        } catch (error) {
            await this.disconnectSql()
            throw error.toString()
        }
    }


    analysisAlgorithm = async () => {



        try {
            let connectSqlResponsed = await this.connectSql()
            let sqlQuery = await this.sqlQuery(`SELECT email FROM users WHERE consumer=1`)
            for (let i = 0; i < sqlQuery.length; i++) {
                let preferencesSql = await this.sqlQuery(`SELECT categoryId,rank FROM userPreferences WHERE userEmail='${sqlQuery[i].email}'`)
                for (let x = 0; x < preferencesSql.length; x++) {
                    let advertisementsForPreference = await this.sqlQuery(`SELECT id FROM advertisements WHERE categoryId=${preferencesSql[x].categoryId}`)
                    for (let y = 0; y < advertisementsForPreference.length; y++) {

                        await this.sqlQuery(`SET autocommit = 0`)
                        let findPreferencesSql = await this.sqlQuery(`SELECT * FROM matchingAds WHERE userEmail='${sqlQuery[i].email}' AND  advertisementId=${advertisementsForPreference[y].id} FOR UPDATE`)
                        let matchingAdsQuery
                        if (findPreferencesSql.length > 0) {
                            matchingAdsQuery = await this.sqlQuery(`UPDATE matchingAds SET weight=${preferencesSql[x].rank} WHERE userEmail='${sqlQuery[i].email}' AND advertisementId=${advertisementsForPreference[y].id}`)
                            await this.sqlQuery(`COMMIT`)
                        } else {
                            matchingAdsQuery = await this.sqlQuery(`INSERT INTO matchingAds(userEmail, advertisementId,weight) VALUES ('${sqlQuery[i].email}',${advertisementsForPreference[y].id},${preferencesSql[x].rank})`)
                            await this.sqlQuery(`COMMIT`)
                        }
                    }
                }
            }
            await this.sqlQuery(`COMMIT`)
            await this.disconnectSql()
            return sqlQuery
        } catch (error) {
            console.log(error)
            await this.sqlQuery(`COMMIT`)
            await this.disconnectSql()
            return error
        }

    }


    analysisLoop = async () => {
        await this.analysisAlgorithm()

    }


}


module.exports = AnalysisAlgorithm

