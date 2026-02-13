export interface Response {
    dates: Dates;
    page: number;
    results: Result[];
    total_pages: number;
    total_results: number;
}

export interface Dates {
    maximum: Date;
    minimum: Date;
}

export interface Result {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: Date;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
    name?: string;
    original_name?: string;
    first_air_date?: Date;
    media_type?: string;
}

export interface MovieDetail {
    adult: boolean;
    backdrop_path: string;
    belongs_to_collection: null;
    budget: number;
    genres: Genre[];
    homepage: string;
    id: number;
    imdb_id: string;
    origin_country: string[];
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    production_companies: ProductionCompany[];
    production_countries: ProductionCountry[];
    release_date: Date;
    revenue: number;
    runtime: number;
    spoken_languages: SpokenLanguage[];
    status: string;
    tagline: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
    name?: string;
    original_name?: string;
    first_air_date?: Date;
    episode_run_time?: number[];
    number_of_episodes?: number;
    number_of_seasons?: number;
    seasons?: Season[];
    videos?: VideoResponse;
    release_dates?: { results: any[] };
    content_ratings?: { results: any[] };
    credits?: Credits;
}

export interface Credits {
    cast: Cast[];
    crew: Crew[];
}

export interface Cast {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
    order: number;
}

export interface Crew {
    id: number;
    name: string;
    job: string;
    department: string;
    profile_path: string | null;
}

export interface Season {
    air_date: Date;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string;
    season_number: number;
    vote_average: number;
}

export interface Genre {
    id: number;
    name: string;
}

export interface ProductionCompany {
    id: number;
    logo_path: null | string;
    name: string;
    origin_country: string;
}

export interface ProductionCountry {
    iso_3166_1: string;
    name: string;
}

export interface SpokenLanguage {
    english_name: string;
    iso_639_1: string;
    name: string;
}

export interface Video {
    key: string;
    site: string;
    type: string;
    name: string;
    official: boolean;
}

export interface VideoResponse {
    results: Video[];
}
