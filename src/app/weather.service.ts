import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private ZIP_CODE_KEY = 'zipCodes';

  getStoredZipCodes(): string[] {
    const storedZipCodes = localStorage.getItem(this.ZIP_CODE_KEY);
    return storedZipCodes ? JSON.parse(storedZipCodes) : [];
  }

  addZipCode(zipCode: string): void {
    const storedZipCodes = this.getStoredZipCodes();
    storedZipCodes.push(zipCode);
    localStorage.setItem(this.ZIP_CODE_KEY, JSON.stringify(storedZipCodes));
  }
}
