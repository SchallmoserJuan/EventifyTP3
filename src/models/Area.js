import mongoose from 'mongoose';

const areaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true
    },
    descripcion: {
        type: String,
        required: true
    },
    color: {
        type: String,
        default: '#007bff'
    }
}, {
    timestamps: true
});

export default mongoose.model('Area', areaSchema);