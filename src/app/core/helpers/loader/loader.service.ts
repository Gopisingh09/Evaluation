import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private requestCount = 0;
  readonly loading = signal(false);
  

  /** Mark a request as started */
  show(): void {
    //debugger;
    this.requestCount++;
    if (!this.loading()) {
      this.loading.set(true);  
    }
  }

  /** Mark a request as finished */
  hide(): void {
    if (this.requestCount > 0) {
      this.requestCount--;
    }
    if (this.requestCount === 0 && this.loading()) {
      this.loading.set(false);
    }
  }

  reset(): void {
    this.requestCount = 0;
    this.loading.set(false);
  }
}
