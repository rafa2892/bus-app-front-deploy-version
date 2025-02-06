export class RegistroActividad {
    id: number;
    userName: string;
    fecha: Date;
    comentarios: string;
    tipoActividad: number;
    rol: string;

    constructor(id: number, userName: string, fecha: Date, comentarios: string, tipoActividad: number, rol: string) {
        this.id = id;
        this.userName = userName;
        this.fecha = fecha;
        this.comentarios = comentarios;
        this.tipoActividad = tipoActividad;
        this.rol = rol;
    }
}
