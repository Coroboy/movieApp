import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../app/services/movieService';
import { MovieDetail } from '../../app/interfaces/interface';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';

@Component({
    selector: 'app-series-detail',
    imports: [DecimalPipe, DatePipe, CurrencyPipe],
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
                },
                error: (err) => console.log('Error', err)
            }
        )
    }
}
