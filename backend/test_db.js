const oracledb = require('oracledb');
require('dotenv').config();

try {
    oracledb.initOracleClient({ libDir: 'C:\\oraclexe\\app\\oracle\\product\\11.2.0\\server\\bin' });
} catch(e) {
    console.log("init err:", e);
}

async function test() {
    try {
        await oracledb.createPool({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_CONNECTION_STRING
        });
        const connection = await oracledb.getConnection();
        const result = await connection.execute(
            `SELECT * FROM Users`,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        console.log("SUCCESS!", result.rows);
        await connection.close();
    } catch(e) {
        console.error("ERROR:", e);
    } finally {
        process.exit();
    }
}
test();
