export class Contest {
    constructor(
        public nombreConcurso: string,
        public fechaInicio: string,
        public fechaFin: string,
        public valorPagar: string,
        public guion: string,
        public recomendaciones: string,
        public rutaImagen: string,
        public nombreURL: string,
        public estadoPublicacion: string,
        public adminId
    ) {}
}
