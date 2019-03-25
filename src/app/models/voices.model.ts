export class Voice {
    constructor(
        public rutaArchivoOriginal: string,
        public rutaArchivoConvertida: string,
        public estadoRegistroVoces: string,
        public nombresLocutor: string,
        public apellidosLocutor: string,
        public correoLocutor: string,
        public observacionesLocutor: string,
        public conditions: string,
        public urlConcurso: string,
        public mail: number,
        public contestId: string
    ) {}
}
