import { promises as fs } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


class FileManager {
    constructor() {
        this.dataPath = join(__dirname, "../../data");
        this.ensureDataDirectory();
    }

    async ensureDataDirectory() {
        try {
            await fs.access(this.dataPath);
        } catch (error) {
            await fs.mkdir(this.dataPath, { recursive: true });
        }
    }

    async readJSON(filename) {
        try {
            const filePath = join(this.dataPath, filename);
            await fs.access(filePath);
            const data = await fs.readFile(filePath, "utf8");
            return JSON.parse(data);
        } catch (error) {
            if (error.code === "ENOENT") {
                console.log(` Archivo ${filename} no existe, creando archivo vacío...`);
                await this.writeJSON(filename, []);
                return [];
            }
            console.error(` Error leyendo ${filename}:`, error.message);
            return [];
        }
    }

    async writeJSON(filename, data) {
        try {
            const filePath = join(this.dataPath, filename);
            await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
            console.log(` Archivo ${filename} actualizado correctamente`);
            return true;
        } catch (error) {
            console.error(` Error escribiendo ${filename}:`, error.message);
            return false;
        }
    }

    async fileExists(filename) {
        try {
            const filePath = join(this.dataPath, filename);
            await fs.access(filePath);
            return true;
        } catch {
            return false;
        }
    }

    async backupFile(filename) {
        try {
            const originalPath = join(this.dataPath, filename);
            const backupPath = join(this.dataPath, `${filename}.backup`);
            await fs.copyFile(originalPath, backupPath);
            console.log(` Backup creado: ${filename}.backup`);
            return true;
        } catch (error) {
            console.error(` Error creando backup de ${filename}:`, error.message);
            return false;
        }
    }
}

const fileManager = new FileManager();
export default fileManager;

