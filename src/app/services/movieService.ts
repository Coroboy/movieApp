import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { MovieDetail, Response } from '../interfaces/interface';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  http = inject(HttpClient)
  API_URL = environment.api_url
  API_KEY = environment.api_key
  constructor() { }

  obtenerCartelera() {
    return this.http.get<Response>(`${this.API_URL}movie/now_playing?language=es-ES&api_key=${this.API_KEY}`)
  }

  obtenerEstrenos() {
    return this.http.get<Response>(`${this.API_URL}movie/upcoming?language=es-ES&api_key=${this.API_KEY}`)
  }

  obtenerMovie(id: string) {
    return this.http.get<MovieDetail>(`${this.API_URL}movie/${id}?language=es-ES&api_key=${this.API_KEY}`)
  }

  obtenerSeriesTopRated() {
    return this.http.get<Response>(`${this.API_URL}tv/top_rated?language=es-ES&api_key=${this.API_KEY}`)
  }

  obtenerSerie(id: string) {
    return this.http.get<MovieDetail>(`${this.API_URL}tv/${id}?language=es-ES&api_key=${this.API_KEY}`)
  }

  obtenerTemporada(tvId: string, seasonNumber: number) {
    return this.http.get<any>(`${this.API_URL}tv/${tvId}/season/${seasonNumber}?language=es-ES&api_key=${this.API_KEY}`)
  }

}
