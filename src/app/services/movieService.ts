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
  API_KEY = environment.api_key

  // Global state for mobile menu
  isMenuOpen = signal(false);

  constructor() { }

  obtenerCartelera(page: number = 1) {
    return this.http.get<Response>(`${this.API_URL}movie/now_playing?language=es-MX&api_key=${this.API_KEY}&page=${page}`)
  }

  obtenerEstrenos(page: number = 1) {
    return this.http.get<Response>(`${this.API_URL}movie/upcoming?language=es-MX&api_key=${this.API_KEY}&page=${page}`)
  }

  obtenerMovie(id: string) {
    return this.http.get<MovieDetail>(`${this.API_URL}movie/${id}?language=es-MX&api_key=${this.API_KEY}&append_to_response=release_dates,videos,credits`)
  }

  obtenerSeriesTopRated(page: number = 1) {
    return this.http.get<Response>(`${this.API_URL}tv/top_rated?language=es-MX&api_key=${this.API_KEY}&page=${page}`)
  }

  obtenerSerie(id: string) {
    return this.http.get<MovieDetail>(`${this.API_URL}tv/${id}?language=es-MX&api_key=${this.API_KEY}&append_to_response=content_ratings,videos,credits`)
  }

  obtenerTemporada(tvId: string, seasonNumber: number) {
    return this.http.get<any>(`${this.API_URL}tv/${tvId}/season/${seasonNumber}?language=es-MX&api_key=${this.API_KEY}`)
  }

  searchMovies(query: string, page: number = 1) {
    return this.http.get<Response>(`${this.API_URL}search/multi?language=es-MX&api_key=${this.API_KEY}&query=${query}&page=${page}`)
  }

  getRecommendations(type: 'movie' | 'tv', id: string) {
    return this.http.get<Response>(`${this.API_URL}${type}/${id}/recommendations?language=es-MX&api_key=${this.API_KEY}`)
  }

  getByGenre(type: 'movie' | 'tv', genreId: number, page: number = 1) {
    return this.http.get<Response>(`${this.API_URL}discover/${type}?language=es-MX&api_key=${this.API_KEY}&with_genres=${genreId}&page=${page}&sort_by=popularity.desc`)
  }

  getMovieVideos(id: string) {
    return this.http.get<VideoResponse>(`${this.API_URL}movie/${id}/videos?api_key=${this.API_KEY}&language=es-MX&include_video_language=es,en`)
  }

  getSeriesVideos(id: string) {
    return this.http.get<VideoResponse>(`${this.API_URL}tv/${id}/videos?api_key=${this.API_KEY}&language=es-MX&include_video_language=es,en`)
  }

  getActorDetails(id: string) {
    return this.http.get<any>(`${this.API_URL}person/${id}?language=es-MX&api_key=${this.API_KEY}`)
  }

  getActorCredits(id: string) {
    return this.http.get<any>(`${this.API_URL}person/${id}/combined_credits?language=es-MX&api_key=${this.API_KEY}`)
  }

  filterResults(results: Result[]): Result[] {
    return results.filter(item => item.poster_path !== null && item.poster_path !== undefined);
  }

}
