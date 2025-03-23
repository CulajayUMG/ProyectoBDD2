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

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => console.log('Servidor en http://localhost:3000'));
