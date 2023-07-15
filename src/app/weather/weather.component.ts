import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { WeatherService } from '../weather.service';
import { GeoLocation } from '../../shared/types/geo';

interface WeatherData {
  temp: number;
  city: string;
  country: string;
  zipCode: string;
  iconCode: string;
}

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {
  zipCodes: string[] = [];
  weatherData: WeatherData[] = [];
  newZipCode = '';

  constructor(
    private weatherDataService: WeatherService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.zipCodes = this.weatherDataService.getStoredZipCodes();
    if (this.zipCodes.length > 0) {
      this.getWeatherData();
    }
  }

  getWeatherData(): void {
    for (const zipCode of this.zipCodes) {
      this.handleWeatherData(zipCode);
    }
  }

  addZipCode(zipCode: string): void {
    if (zipCode && zipCode.trim() !== '') {
      this.handleWeatherData(zipCode, () => {
        this.zipCodes.push(zipCode);
        this.newZipCode = '';
        this.weatherDataService.addZipCode(zipCode);
      });
    }
  }

  redirectToForecast(zipCode: string) {
    this.router.navigate(['/forecast', zipCode]);
  }

  private handleWeatherData(zipCode: string, callback?: () => void): void {
    this.fetchGeoLocation(zipCode)
      .then((geoLocation) => this.fetchWeatherData(geoLocation)
        .then((weather) => {
          const weatherEntry: WeatherData = {
            temp: Math.round(weather.main.temp),
            city: weather.name,
            country: weather.sys.country,
            zipCode,
            iconCode: weather.weather[0].icon,
          };
          this.weatherData.push(weatherEntry);
          if (callback) {
            callback();
          }
        })
      )
      .catch((error) => {
        console.error('Error occurred while retrieving weather data:', error);
      });
  }

  private fetchGeoLocation(zipCode: string): Promise<any> {
    return this.http.get<GeoLocation>(`/geo/1.0/zip?zip=${zipCode}`).toPromise();
  }

  private fetchWeatherData(geoLocation: GeoLocation): Promise<any> {
    const { lat, lon } = geoLocation;
    return this.http.get(`/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial`).toPromise();
  }
}
