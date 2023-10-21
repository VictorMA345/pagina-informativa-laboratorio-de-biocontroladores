const express = require('express');
const cors = require('cors');

require('dotenv').config();

// Multer Storage
const { connectToDb,getDbMiddleware  } = require('./db')

const mongoose = require('mongoose');
// Se importan las diferentes Rutas
const enfermedades = require('./routes/enfermedades');
const colaboradores = require('./routes/colaboradores');
const controlBiologico = require('./routes/control_biológico');
const noticias = require('./routes/noticias');
const tesis = require('./routes/tesis');
const proyectos = require('./routes/proyectos');
const estudiantes = require('./routes/estudiantes')
const servicios = require('./routes/servicios')
const miembros = require('./routes/miembros')
const rol = require('./routes/rol')

// init app & middleware
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
connectToDb((error) =>{
    if(!error) {
        app.use(getDbMiddleware); 
        // Se usan las Rutas    
        app.use('/api/', enfermedades);
        app.use('/api/', colaboradores);        
        app.use('/api/', controlBiologico)
        app.use('/api/', noticias)
        app.use('/api/', tesis)
        app.use('/api/', proyectos)
        app.use('/api/', estudiantes)
        app.use('/api/', servicios)
        app.use('/api/', miembros)
        app.use('/api/', rol)
        mongoose.connect(process.env.MONGO_ATLAS_URI_USER_VICTOR + process.env.CLUSTER_NAME ).then(() =>{
            app.listen(process.env.PORT,() =>{
                console.log("connected to db and listening on port "+ process.env.PORT);
                }
            )
        }).catch((error) =>{
            console.log(error)
        })
    }
})