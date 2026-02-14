import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { MovieDetail, Response, Result, VideoResponse } from '../interfaces/interface';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  http = inject(HttpClient)
  API_URL = environment.api_url


  // Global state for mobile menu
  isMenuOpen = signal(false);

  constructor() { }

  obtenerCartelera(page: number = 1) {
    return this.http.get<Response>(`${this.API_URL}movie/now_playing?page=${page}`)
  }

  obtenerEstrenos(page: number = 1) {
    return this.http.get<Response>(`${this.API_URL}movie/upcoming?page=${page}`)
  }

  obtenerMovie(id: string) {
    return this.http.get<MovieDetail>(`${this.API_URL}movie/${id}?append_to_response=release_dates,videos,credits`)
  }

  obtenerSeriesTopRated(page: number = 1) {
    return this.http.get<Response>(`${this.API_URL}tv/top_rated?page=${page}`)
  }

  obtenerSerie(id: string) {
    return this.http.get<MovieDetail>(`${this.API_URL}tv/${id}?append_to_response=content_ratings,videos,credits`)
  }

  obtenerTemporada(tvId: string, seasonNumber: number) {
    return this.http.get<any>(`${this.API_URL}tv/${tvId}/season/${seasonNumber}`)
  }

  searchMovies(query: string, page: number = 1) {
    return this.http.get<Response>(`${this.API_URL}search/multi?query=${query}&page=${page}`)
  }

  getRecommendations(type: 'movie' | 'tv', id: string) {
    return this.http.get<Response>(`${this.API_URL}${type}/${id}/recommendations`)
  }

  getByGenre(type: 'movie' | 'tv', genreId: number, page: number = 1) {
    return this.http.get<Response>(`${this.API_URL}discover/${type}?with_genres=${genreId}&page=${page}&sort_by=popularity.desc`)
  }

  getMovieVideos(id: string) {
    return this.http.get<VideoResponse>(`${this.API_URL}movie/${id}/videos?include_video_language=es,en`)
  }

  getSeriesVideos(id: string) {
    return this.http.get<VideoResponse>(`${this.API_URL}tv/${id}/videos?include_video_language=es,en`)
  }

  getActorDetails(id: string) {
    return this.http.get<any>(`${this.API_URL}person/${id}`)
  }

  getActorCredits(id: string) {
    return this.http.get<any>(`${this.API_URL}person/${id}/combined_credits`)
  }

  filterResults(results: Result[]): Result[] {
    return results.filter(item => item.poster_path !== null && item.poster_path !== undefined);
  }

  isAnime(item: any): boolean {
    const isAnimation = item.genre_ids?.includes(16) || item.genres?.some((g: any) => g.id === 16);
    const isJapanese = item.original_language === 'ja';
    return !!(isAnimation && isJapanese);
  }

  filterNonAnime(results: Result[]): Result[] {
    return results.filter(item => !this.isAnime(item));
  }

  filterOnlyAnime(results: Result[]): Result[] {
    return results.filter(item => {
      if (this.isAnime(item)) {
        // Ensure media_type is set if missing, based on known properties
        if (!item.media_type) {
          item.media_type = item.title ? 'movie' : 'tv';
        }
        return true;
      }
      return false;
    });
  }

}
