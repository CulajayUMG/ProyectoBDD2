const express = require('express');
const bodyParser = require('body-parser');
const oracledb = require('oracledb');
const path = require('path');  // para manejar rutas de archivos

const app = express();
app.use(bodyParser.json());  // leer los datos en formato JSON

// Servir archivos estáticos desde la carpeta 'public' para este ejercicio si no ver donde estan.
app.use(express.static(path.join(__dirname, 'public')));

// verificar la conexión a Oracle
async function verificarConexion(user, password) {
    try {
        const connection = await oracledb.getConnection({
            user: user,
            password: password,
            connectString: "//localhost:1521/orcl"  // Ajusta según tu servidor**
        });

        await connection.close();
        return { success: true, message: "Conexión exitosa" };
    } catch (error) {
        return { success: false, message: "Credenciales incorrectas o sin acceso", error: error.message };
    }
}

// Endpoint de login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Verificar las credenciales en Oracle
    const result = await verificarConexion(username, password);

    res.json(result);  // Enviar la respuesta al cliente
});


// Ruta para obtener usuarios en Oracle
app.get('/usuarios', async (req, res) => {
    const { username, password } = req.query;

    if (!username || !password) {
        res.status(400).json({ success: false, message: "Faltan parámetros de autenticación" });
        return;
    }

    let connection;
    try {
        console.log("Intentando conectar con Oracle...");
        connection = await oracledb.getConnection({
            user: username,
            password: password,
            connectString: "//localhost:1521/orcl"
        });

        console.log("Conexión exitosa. Ejecutando consulta...");
        const result = await connection.execute(
            `SELECT username FROM all_users ORDER BY username`
        );
        console.log("Resultado obtenido:", result);

        res.json({ success: true, usuarios: result.rows });
    } catch (error) {
        console.error("Error al obtener usuarios:", error.message);
        res.status(500).json({ success: false, message: "Error al obtener usuarios", error: error.message });
    } finally {
        if (connection) await connection.close();
    }
});


// Ruta para obtener las bases de datos
app.get('/basesdedatos', async (req, res) => {
    const { username, password } = req.query;

    if (!username || !password) {
        res.status(400).json({ success: false, message: "Faltan parámetros de autenticación" });
        return;
    }

    let connection;
    try {
        console.log("Intentando conectar con Oracle...");
        connection = await oracledb.getConnection({
            user: username,
            password: password,
            connectString: "//localhost:1521/orcl"
        });

        console.log("Conexión exitosa. Ejecutando consulta...");

        // Consulta para obtener la base de datos actual
        const result = await connection.execute(`SELECT name FROM v$database`);
        console.log("Resultado obtenido:", result);

        res.json({ success: true, basesdedatos: result.rows });
    } catch (error) {
        console.error("Error al obtener bases de datos:", error.message);
        res.status(500).json({ success: false, message: "Error al obtener bases de datos", error: error.message });
    } finally {
        if (connection) await connection.close();
    }
});

app.get('/esquemas', async (req, res) => {
    const { username, password } = req.query;

    if (!username || !password) {
        res.status(400).json({ success: false, message: "Faltan parámetros de autenticación" });
        return;
    }

    let connection;
    try {
        console.log("Intentando conectar con Oracle...");
        connection = await oracledb.getConnection({
            user: username,
            password: password,
            connectString: "//localhost:1521/orcl"
        });

        console.log("Conexión exitosa. Ejecutando consulta...");
        const result = await connection.execute(`SELECT username FROM all_users ORDER BY username`);
        console.log("Resultado obtenido:", result);

        res.json({ success: true, esquemas: result.rows });
    } catch (error) {
        console.error("Error al obtener esquemas:", error.message);
        res.status(500).json({ success: false, message: "Error al obtener esquemas", error: error.message });
    } finally {
        if (connection) await connection.close();
    }
});








// Iniciar el servidor en el puerto 3000
app.listen(3000, () => console.log('Servidor en http://localhost:3000'));
