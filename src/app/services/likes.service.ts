import { Injectable } from '@angular/core';

export type LikeStatus = 'liked' | 'disliked' | null;

export interface LikeItem {
    id: number;
    status: LikeStatus;
    type: 'movie' | 'tv';
}

@Injectable({
    providedIn: 'root'
})
export class LikesService {
    private storageKey = 'my_likes';

    constructor() { }

    getLikes(): LikeItem[] {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
    }

    getLikeStatus(id: number): LikeStatus {
        const likes = this.getLikes();
        const found = likes.find(item => item.id === id);
        return found ? found.status : null;
    }

    toggleLike(id: number, type: 'movie' | 'tv'): void {
        let likes = this.getLikes();
        const index = likes.findIndex(item => item.id === id);

        if (index > -1) {
            // If currently liked, remove it
            if (likes[index].status === 'liked') {
                likes.splice(index, 1);
            } else {
                // If disliked, change to liked
                likes[index].status = 'liked';
            }
        } else {
            // Add new like
            likes.push({ id, status: 'liked', type });
        }

        localStorage.setItem(this.storageKey, JSON.stringify(likes));
    }

    toggleDislike(id: number, type: 'movie' | 'tv'): void {
        let likes = this.getLikes();
        const index = likes.findIndex(item => item.id === id);

        if (index > -1) {
            // If currently disliked, remove it
            if (likes[index].status === 'disliked') {
                likes.splice(index, 1);
            } else {
                // If liked, change to disliked
                likes[index].status = 'disliked';
            }
        } else {
            // Add new dislike
            likes.push({ id, status: 'disliked', type });
        }

        localStorage.setItem(this.storageKey, JSON.stringify(likes));
    }
}
