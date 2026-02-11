// Genre ID mapping from TheMovieDB API
export const GENRE_MAP: { [key: number]: string } = {
    28: 'Acción',
    12: 'Aventura',
    16: 'Animación',
    35: 'Comedia',
    80: 'Crimen',
    99: 'Documental',
    18: 'Drama',
    10751: 'Familia',
    14: 'Fantasía',
    36: 'Historia',
    27: 'Terror',
    10402: 'Música',
    9648: 'Misterio',
    10749: 'Romance',
    878: 'Ciencia Ficción',
    10770: 'Película de TV',
    53: 'Suspenso',
    10752: 'Guerra',
    37: 'Western',

    // TV Genres
    10759: 'Acción y Aventura',
    10762: 'Infantil',
    10763: 'Noticias',
    10764: 'Reality',
    10765: 'Sci-Fi & Fantasy',
    10766: 'Telenovela',
    10767: 'Talk Show',
    10768: 'Guerra y Política',
};

export interface GenreGroup {
    genreId: number;
    genreName: string;
    items: any[];
}
