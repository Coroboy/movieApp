
import { Injectable, signal } from '@angular/core';
import { Result } from '../interfaces/interface';

@Injectable({
    providedIn: 'root'
})
export class FavoritesService {

    private storageKey = 'my_favorites';

    // Use a signal for reactivity if desired, or just a getter
    // For simplicity and consistency with current app, we'll use direct methods + local storage

    constructor() { }

    getFavorites(): Result[] {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
    }

    isFavorite(id: number): boolean {
        const favorites = this.getFavorites();
        return favorites.some(item => item.id === id);
    }

    toggleFavorite(item: Result): void {
        let favorites = this.getFavorites();
        const index = favorites.findIndex(fav => fav.id === item.id);

        if (index > -1) {
            // Remove
            favorites.splice(index, 1);
        } else {
            // Add
            favorites.push(item);
            console.log('agregado exitosamente');
        }

        localStorage.setItem(this.storageKey, JSON.stringify(favorites));
    }
}
