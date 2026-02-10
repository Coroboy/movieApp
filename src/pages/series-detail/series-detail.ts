import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../app/services/movieService';
import { MovieDetail } from '../../app/interfaces/interface';
import { DatePipe, DecimalPipe } from '@angular/common';

@Component({
    selector: 'app-series-detail',
    imports: [DecimalPipe, DatePipe],
    templateUrl: './series-detail.html',
    styles: `
    :host {
      display: block;
    }
  `,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class SeriesDetail {
    activeRoute = inject(ActivatedRoute)
    movieS = inject(MovieService)
    series!: MovieDetail
    episodes: any[] = []
    selectedSeason: number = 1

    constructor() {
        const id = this.activeRoute.snapshot.paramMap.get('id')
        console.log('ID de la serie: ', id)
        if (id) {
            this.obtenerSerie(id)
        }
    }

    //Declaracion de funcion para obtener los detalles de la serie
    obtenerSerie(id: string) {
        this.movieS.obtenerSerie(id).subscribe(
            {
                next: (serie) => {
                    console.log(serie),
                        this.series = serie
                    this.cargarTemporada(1)
                },
                error: (err) => console.log('Error', err)
            }
        )
    }

    cargarTemporada(seasonNumber: number) {
        this.selectedSeason = seasonNumber
        if (this.series && this.series.id) {
            this.movieS.obtenerTemporada(this.series.id.toString(), seasonNumber).subscribe({
                next: (res) => {
                    console.log(res)
                    this.episodes = res.episodes
                },
                error: (err) => console.log(err)
            })
        }
    }

    changeSeason(event: any) {
        this.cargarTemporada(event.target.value)
    }
}
