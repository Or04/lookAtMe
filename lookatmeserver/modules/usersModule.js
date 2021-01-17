const mysqlConnection = require('../config/dbConnection.js')
const geolib = require('geolib')
const socketIo = require('./socketIo')
const nodemailer = require("nodemailer")
const fs = require('fs')
const AnalysisAlgorithm = require('../modules/analysisAlgorithm')
const analysisAlgorithm = new AnalysisAlgorithm


class User {
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
        if (this.sqlConnection && !(this.sqlConnection.state == 'disconnected')) {
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

        try {
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

        } catch (error) {
            await this.disconnectSql()
            throw error.toString()
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


    setConsumerNearDigitalBoard = async (consumerEmail, digitalBoardId) => {
        try {
            let connectSqlResponsed = await this.connectSql();
            let sqlQuery = await this.sqlQuery(`select * from users WHERE users.email='${consumerEmail}'`)
            if (!(sqlQuery.length > 0)) {
                throw 'consumer email not found'
            }
            sqlQuery = await this.sqlQuery(`SELECT * FROM digitalBoards WHERE digitalBoards.id=${digitalBoardId}`)
            if (!(sqlQuery.length > 0)) {
                throw 'digital board id not found'
            }
            sqlQuery = await this.sqlQuery(`SELECT * FROM consumerNearDigitalBoard WHERE consumerNearDigitalBoard.email='${consumerEmail}'`)
            if (sqlQuery.length > 0) {
                sqlQuery = await this.sqlQuery(`DELETE FROM consumerNearDigitalBoard WHERE consumerNearDigitalBoard.email='${consumerEmail}'`)
            }
            sqlQuery = await this.sqlQuery(`INSERT INTO consumerNearDigitalBoard(email,digitalBoardId) VALUES ('${consumerEmail}','${digitalBoardId}')`)

            await this.disconnectSql()
            return sqlQuery
        } catch (error) {
            await this.disconnectSql()
            throw error.toString()
        }
    }

    userType = async (email) => {

        try {
            let connectSqlResponsed = await this.connectSql();
            let sqlResponed = await this.sqlQuery(`select * from users WHERE users.email='${email}'`)
            if (sqlResponed.length == 0) {
                throw 'מייל לא נמצא'
            } else {
                let userType = [];
                let averageRank = false
                if (sqlResponed[0].advertiser) {
                    averageRank = await this.sqlQuery(`SELECT AVG(rank) as averageRank FROM advertiserRank WHERE advertiserRank.advertiserEmail='${email}'`)
                }
                sqlResponed[0].administrator ? userType.push({
                    key: 'administrator',
                    text: '',
                    value: 'מנהל'
                }) : null
                sqlResponed[0].advertiser ? userType.push({
                    key: 'advertiser',
                    text: '',
                    value: 'מפרסם',

                    rank: averageRank[0].averageRank
                }) : null

                let fileSystem = fs.promises
                let openDir=[];
                let userPictureUri=false
                try {
                    openDir = await fileSystem.readdir(`public/userImages/${email}/`)

                    if (openDir) {
                        for (let x = 0; x < openDir.length; x++) {
                            userPictureUri= `/userImages/${email}/${openDir[x]}`
                        }
                    }
                } catch (error) {
                    console.log(error)
                    if (!error.errno == -2) { 
                        throw error.toString()

                    }
                }


                if(typeof sqlResponed[0].consumer !='undefined' &&  sqlResponed[0].consumer){
                    let sqlQuery = await this.sqlQuery(`SELECT * FROM userPreferences WHERE userPreferences.userEmail='${email}'`)
                    if(typeof sqlQuery[0] !='undefined' && sqlQuery[0]){
                     
                        userType.push({key: 'consumer', text: '', value: 'צרכן',preferences:true,userPictureUri:userPictureUri})

                    }else{
                        userType.push({key: 'consumer', text: '', value: 'צרכן',preferences:false,userPictureUri:userPictureUri})

                    }
                }



                await this.disconnectSql()
                return userType
            }

        } catch (error) {
            await this.disconnectSql()
            throw error.toString()
        }
    }

    updatePremium = async (userEmail) => {
        try {
            let connectSqlResponsed = await this.connectSql()
            await this.sqlQuery(`SET autocommit = 0`)
            let getUserByEmailQuery = await this.sqlQuery(`select users.premium from users WHERE users.email='${userEmail}' FOR UPDATE`)

            if (getUserByEmailQuery.length > 0) {
                let sqlQuery = await this.sqlQuery(`UPDATE users SET users.premium='${getUserByEmailQuery[0].premium ? 0 : 1}' WHERE users.email='${userEmail}'`)
                await this.sqlQuery(`COMMIT`)
                getUserByEmailQuery = await this.sqlQuery(`select users.premium from users WHERE users.email='${userEmail}'`)
                await this.disconnectSql()
                return (getUserByEmailQuery)
            } else {
                throw 'user email not found'
            }

        } catch (error) {
            await this.sqlQuery(`COMMIT`)
            await this.disconnectSql()
            throw error.toString()
        }
    }

    deleteUser = async (userEmail) => {
        try {
            let connectSqlResponsed = await this.connectSql()
            await this.sqlQuery(`SET autocommit = 0`)
            let getUserByEmailQuery = await this.sqlQuery(`select * from users WHERE users.email='${userEmail}' FOR UPDATE`)
            if (getUserByEmailQuery.length > 0) {
                let sqlQuery = await this.sqlQuery(`DELETE FROM users WHERE users.email='${userEmail}'`)
                await this.sqlQuery(`COMMIT`)
                await this.disconnectSql()
                return (sqlQuery)
            } else {
                throw 'user email not found'
            }
        } catch (error) {
            console.log(error.toString());
            await this.sqlQuery(`COMMIT`)
            await this.disconnectSql()
            throw error.toString()
        }
    }

    userRegistration = async (email, firstName, lastName, password, digitalBoardId) => {
        try {
            let connectSqlResponsed = await this.connectSql();
            let sqlQuery = await this.sqlQuery(`select * from digitalBoards WHERE digitalBoards.id='${digitalBoardId}'`)

            if (sqlQuery.length > 0) {
                let sqlQuery = await this.sqlQuery(`INSERT INTO users(users.email,users.firstName,users.lastName,users.userPassword,users.advertiser,users.administrator,users.consumer,users.premium) VALUES ('${email}','${firstName}','${lastName}','${password}',1,0,0,0)`)
                sqlQuery = await this.sqlQuery(`INSERT INTO consumerNearDigitalBoard(email,digitalBoardId) VALUES ('${email}','${digitalBoardId}')`)
                await this.disconnectSql()
                return (sqlQuery)
            } else {
                throw 'digital board not found'
            }
        } catch (error) {
            console.log(error.toString());
            await this.disconnectSql()
            throw error.toString()
        }
    }

    updateUserRankCategories = async (email, RankCategoriesArray) => {
        try {
            let connectSqlResponsed = await this.connectSql()
            let getUserByEmailQuery = await this.sqlQuery(`select * from users WHERE users.email='${email}'`)
            if (getUserByEmailQuery.length > 0 && RankCategoriesArray.length > 0) {
                let query = RankCategoriesArray.map(item => `('${email}',${item.id},${item.rank})`)
                query = query.toString()
                let sqlQuery = await this.sqlQuery(`DELETE FROM userPreferences WHERE userPreferences.userEmail='${email}'`)
                let deleteString = ''
                RankCategoriesArray.forEach(item => {
                    deleteString = deleteString + ` AND advertisements.categoryId!=${item.id}`
                })
                sqlQuery = await this.sqlQuery(`DELETE m.* FROM matchingAds m  INNER JOIN advertisements ON advertisements.id=m.advertisementId WHERE m.userEmail='${email}' ${deleteString}`)

                sqlQuery = await this.sqlQuery(`INSERT INTO  userPreferences(userPreferences.userEmail,userPreferences.categoryId,userPreferences.rank) VALUES ${query}`)
                if (!getUserByEmailQuery[0].consumer) {
                    await this.sqlQuery(`UPDATE users SET users.consumer=1 WHERE users.email='${email}'`)
                }
                analysisAlgorithm.analysisLoop()

                await this.disconnectSql()
                return (sqlQuery)
            } else {
                throw 'user email or categories not sent'
            }
        } catch (error) {
            console.log(error.toString());
            await this.disconnectSql()
            throw error.toString()
        }
    }

    sendUserLocation = async (email, latitude, longitude) => {
        //  console.log(email + ' ' + latitude + ' ' + longitude + ' ' + Date.now())
        try {
            let connectSqlResponsed = await this.connectSql()
            await this.sqlQuery(`SET autocommit = 0`)
            let sqlQuery = await this.sqlQuery(`SELECT * FROM users WHERE users.email='${email}'`)
            if (!(sqlQuery.length > 0)) {
                throw 'user email not found sendUserLocation'
            }
            let digitalBoardLocation = await this.sqlQuery(`SELECT ST_X(digitalBoards.location) AS latitude,ST_Y(digitalBoards.location) AS longitude,id FROM digitalBoards`)
            let findUserNearBoard = false
            digitalBoardLocation.forEach(digitalBoard => {
                if ((geolib.getDistance({
                    latitude: digitalBoard.latitude,
                    longitude: digitalBoard.longitude
                }, {
                    latitude: latitude,
                    longitude: longitude
                })) < 50) {
                    findUserNearBoard = digitalBoard.id;
                }
            })
            if (findUserNearBoard) {
                if (!socketIo.isCustomerConnected(email)) {
                    socketIo.findDigitalScreen(email, findUserNearBoard)
                }
            } else {
                socketIo.logOffConsumer(email)
            }

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

    checkForPremium = async (advertiserEmail, advertisementId) => {

        try {
            let connectSqlResponsed = await this.connectSql()
            let sqlQuery = await this.sqlQuery(`SELECT * FROM advertisements WHERE advertisements.id=${advertisementId}`)
            if (!(sqlQuery.length > 0)) {
                throw 'advertisement id not found'
            }
            sqlQuery = await this.sqlQuery(`SELECT * FROM users WHERE users.email='${advertiserEmail}'`)
            if (!(sqlQuery.length > 0)) {
                throw 'advertiser email not found'
            }


            if (sqlQuery[0].premium == 1) {
                await this.disconnectSql()
                return sqlQuery
            } else {

                sqlQuery = await this.sqlQuery(`SELECT * FROM adDigitalBoards WHERE advertisementId=${advertisementId}`)
                if (sqlQuery.length > 0) {
                    for (let i = 1; i < sqlQuery.length; i++) {
                        await this.sqlQuery(`DELETE FROM adDigitalBoards WHERE advertisementId=${advertisementId} AND digitalBoardId=${sqlQuery[i].digitalBoardId}`)
                    }
                    throw 'משתמש לא מובחר, יכול לפרסם בלוח אחד בלבד'
                }
                await this.disconnectSql()
                return sqlQuery
            }

        } catch (error) {

            await this.disconnectSql()
            throw error.toString()
        }

    }

    sendSignUpEmail = async (email, advertisementId) => {
        try {
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'lookatmeisreal@gmail.com',
                    pass: 'natali20202020#'
                }
            });
            let url = `http://lookatmeil.com/signUp?adId=${advertisementId}&email=${email}`
            let info = await transporter.sendMail({
                from: 'lookatmeisreal@gmail.com', // sender address
                to: email, // list of receivers
                subject: "הרשמה lookatme", // Subject line
                text: "הרשמה", // plain text body
                html: `<a href='${url}'>signUp</a>`, // html body
            })
            return true
        } catch (error) {
            throw error.toString()
        }

    }

    logOffConsumerFromSmartScreen = async (consumerEmail) => {
        socketIo.logOffConsumer(consumerEmail)
        return true
    }

}


module.exports = User

