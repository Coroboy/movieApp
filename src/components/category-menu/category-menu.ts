import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';

export interface Category {
  id: number;
  name: string;
}

@Component({
  selector: 'app-category-menu',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative w-full bg-transparent z-40 -mt-16 md:-mt-20">
      <div class="w-full px-6 md:px-12">
        <div class="flex items-center gap-8 md:gap-12 overflow-x-auto no-scrollbar scroll-smooth py-6">
          @for (category of categories; track category.id) {
            <button
              #catBtn
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
export class CategoryMenu implements OnChanges {
  @Input() categories: Category[] = [];
  @Input() selectedId: number = 0;
  @Output() categorySelected = new EventEmitter<number>();

  @ViewChildren('catBtn') buttons!: QueryList<ElementRef>;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedId'] || changes['categories']) {
      this.scrollToSelected();
    }
  }

  private scrollToSelected() {
    // Small timeout to wait for categories to render and QueryList to update
    setTimeout(() => {
      if (!this.buttons) return;
      const button = this.buttons.find((_, index) => this.categories[index]?.id === this.selectedId);
      if (button) {
        button.nativeElement.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest'
        });
      }
    }, 100);
  }

  selectCategory(category: Category) {
    this.selectedId = category.id;
    this.categorySelected.emit(category.id);
    this.scrollToSelected();
  }
}
