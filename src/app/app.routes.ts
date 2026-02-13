import { Routes } from '@angular/router';
import { Cartelera } from '../pages/cartelera/cartelera';
import { Estrenos } from '../pages/estrenos/estrenos';
import { Movie } from '../pages/movie/movie';
import { Series } from '../pages/series/series';
import { SeriesDetail } from '../pages/series-detail/series-detail';
import { Search } from '../pages/search/search';
import { Favoritos } from '../pages/favoritos/favoritos';
import { ActorDetail } from '../pages/actor-detail/actor-detail';

export const routes: Routes = [
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
        path: 'search/:query',
        component: Search
    },
    {
        path: 'favoritos',
        component: Favoritos
    },
    {
        path: 'actor/:id',
        component: ActorDetail
    },
    {
        path: '**',
        pathMatch: 'full',
        redirectTo: 'cartelera'
    }
];
