import { Routes } from '@angular/router';
import { Home } from '../pages/home/home';
import { Funciones } from '../pages/funciones/funciones';
import { Cartelera } from '../pages/cartelera/cartelera';
import { Estrenos } from '../pages/estrenos/estrenos';
import { Movie } from '../pages/movie/movie';
import { Series } from '../pages/series/series';
import { SeriesDetail } from '../pages/series-detail/series-detail';

export const routes: Routes = [
    {
        path: 'home',
        component: Home
    },
    {
        path: 'funciones',
        component: Funciones
    },
    {
        path: 'cartelera',
        component: Cartelera
    },
    {
        path: 'estrenos',
        component: Estrenos
    },
    {
        path: 'movie/:id',
        component: Movie
    },
    {
        path: 'series',
        component: Series
    },
    {
        path: 'series/:id',
        component: SeriesDetail
    },
    {
        path: '**',
        pathMatch: 'full',
        redirectTo: 'home'
    }
];
