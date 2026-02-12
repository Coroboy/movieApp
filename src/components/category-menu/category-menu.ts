import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface Category {
  id: number;
  name: string;
}

@Component({
  selector: 'app-category-menu',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative w-full bg-transparent z-40 -mt-20 md:-mt-28">
      <div class="container mx-auto px-6 md:px-16">
        <div class="flex items-center gap-8 md:gap-12 overflow-x-auto no-scrollbar scroll-smooth py-6">
          @for (category of categories; track category.id) {
            <button
              (click)="selectCategory(category)"
              class="px-4 py-1.5 rounded-full text-xs md:text-sm font-black transition-all whitespace-nowrap uppercase tracking-[0.2em]"
              [class.text-white]="selectedId === category.id"
              [class.border]="selectedId === category.id"
              [class.border-white/40]="selectedId === category.id"
              [class.bg-white/5]="selectedId === category.id"
              [class.text-white/50]="selectedId !== category.id"
              [class.hover:text-white]="selectedId !== category.id"
              [class.border-transparent]="selectedId !== category.id"
              [class.border]="selectedId !== category.id">
              {{ category.name }}
            </button>
          }
        </div>
      </div>
    </div>
  `,
  styles: `
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `
})
export class CategoryMenu {
  @Input() categories: Category[] = [];
  @Input() selectedId: number = 0;
  @Output() categorySelected = new EventEmitter<number>();

  selectCategory(category: Category) {
    this.selectedId = category.id;
    this.categorySelected.emit(category.id);
  }
}
