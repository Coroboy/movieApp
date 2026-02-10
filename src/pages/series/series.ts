import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-series',
    imports: [],
    templateUrl: './series.html',
    styles: `
    :host {
      display: block;
    }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Series { }
