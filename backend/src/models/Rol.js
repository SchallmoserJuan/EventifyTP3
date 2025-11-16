import mongoose from 'mongoose';

const rolSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true,
        enum: ['administrador', 'planner', 'coordinador'] // Solo estos valores permitidos
    },
    descripcion: {
        type: String,
        required: true
    },
    permisos: [{
        type: String,
        enum: ['crear', 'leer', 'actualizar', 'eliminar']
    }]
}, {
    timestamps: true
});

export default mongoose.model('Rol', rolSchema);