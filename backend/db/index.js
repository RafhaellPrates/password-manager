 
import mysql  from 'mysql2/promise'

    const pool =  mysql.createPool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        waitForConnections: true,
        connectionLimit: 10,
        maxIdle: 10,
        idleTimeout: 6000,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0
    })

    
export default pool


