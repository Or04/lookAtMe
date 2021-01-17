const mysql = require('mysql');




module.exports = () => {
    let connection = mysql.createConnection({
        host: '??????',
        user: '??????',
        password: '???????'
    });
    return connection;
}


