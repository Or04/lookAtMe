const mysqlConnection = require('../config/dbConnection.js')
const fs = require('fs')


class Category {
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

    addCategory = async (categoryName) => {
        try {
            let connectSqlResponsed = await this.connectSql();
            let sqlResponed = await this.sqlQuery(`INSERT INTO  categories(description) VALUES ('${categoryName}')`)
            sqlResponed = await this.sqlQuery(`SELECT * FROM categories WHERE description='${categoryName}'`)
            await this.disconnectSql()
            return (sqlResponed)
        } catch (error) {
            await this.disconnectSql()
            throw error.toString()
        }
    }

    updateCategory = async (categoryName, categoryId) => {
        let connectSqlResponsed = await this.connectSql();
        await this.sqlQuery(`SET autocommit = 0`)
        try {
            let sqlQuery = await this.sqlQuery(`SELECT * FROM categories WHERE categories.id=${categoryId} FOR UPDATE`)
            if (sqlQuery.length > 0) {
                let sqlQuery = await this.sqlQuery(`UPDATE categories SET categories.description='${categoryName}' WHERE categories.id=${categoryId}`)
                await this.sqlQuery(`COMMIT`)
                await this.disconnectSql()
                return (sqlQuery)
            } else {
                throw `cannot find id:${categoryId}`
            }
        } catch (error) {
            await this.sqlQuery(`COMMIT`)
            await this.disconnectSql()
            throw error.toString()
        }
    }

    deleteCategory = async (categoryId) => {

        let connectSqlResponsed = await this.connectSql();
        await this.sqlQuery(`SET autocommit = 0`)
        try {
            let sqlQuery = await this.sqlQuery(`SELECT * FROM categories WHERE categories.id=${categoryId} FOR UPDATE`)
            if (sqlQuery.length > 0) {
                let sqlQuery = await this.sqlQuery(`DELETE FROM categories WHERE categories.id=${categoryId}`)
                await this.sqlQuery(`COMMIT`)
                await this.disconnectSql()
                if (sqlQuery.affectedRows) {
                    return (true)
                } else {
                    throw `error delete category id:${categoryId}`
                }
            } else {
                throw `cannot find category id:${categoryId}`
            }
        } catch (error) {
            await this.sqlQuery(`COMMIT`)
            await this.disconnectSql()
            throw error.toString()
        }

    }

    getAllCategories = async () => {


        try {

            let connectSqlResponsed = await this.connectSql();
            let sqlQuery = await this.sqlQuery(`SELECT * FROM categories`)
            let fileSystem = fs.promises
            for (let i = 0; i < sqlQuery.length; i++) {
                let openDir = [];

                try {
                    openDir = await fileSystem.readdir(`public/categories/${sqlQuery[i].id}/`)
                    if (openDir) {
                        for (let x = 0; x < openDir.length; x++) {
                            openDir[x] = `categories/${sqlQuery[i].id}/${openDir[x]}`
                        }
                    }
                    sqlQuery[i].picture=[...openDir]
                } catch (error) {
                    if (!error.errno == -2) {  
                        throw error.toString()
                    }
                }
            }

            await this.disconnectSql()
          
            return (sqlQuery)

        } catch (error) {
            await this.disconnectSql()
            res.status(500).send({value: error.toString()})
        }
    }

    getUseRrankCategories = async (email) => {
        try {
            let connectSqlResponsed = await this.connectSql();
            let sqlQuery = await this.sqlQuery(`select * from users WHERE users.email='${email}'`)
            if (sqlQuery.length > 0) {
                let sqlQuery = await this.sqlQuery(`SELECT categories.id,categories.description,userPreferences.rank FROM categories INNER JOIN userPreferences ON categories.id = userPreferences.categoryId WHERE userPreferences.userEmail='${email}'`)
                await this.disconnectSql()
                return (sqlQuery)
            } else {
                throw 'user email not found'
            }

        } catch (error) {
            console.log(error.toString());
            await this.disconnectSql()
            throw error.toString()
        }


    }

    getPictureForCategory = async (categoryId) => {
        try {

            let fileSystem = fs.promises
            let openDir = [];
            try {
                openDir = await fileSystem.readdir(`public/categories/${categoryId}/`)
                if (openDir) {
                    for (let x = 0; x < openDir.length; x++) {
                        openDir[x] = `categories/categoryId/${openDir[x]}`
                    }
                }
            } catch (error) {
                if (!error.errno == -2) { 
                    throw error.toString()
                }
            }

            res.status(200).send({value: openDir})

        } catch (error) {
            res.status(500).send({value: error.toString()})
        }

    }

}


module.exports = Category