import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';

interface ForecastItem {
  dt_txt: string;
  main: {
    temp: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
}


@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.scss']
})
export class ForecastComponent implements OnInit{
  zipCode: string = '';
  forecast: { date: string; items: ForecastItem[] }[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient,
  ) {
    this.route.params.subscribe(params => {
      this.zipCode = params['zipCode'];
    });
  }

  ngOnInit(): void {
    this.getForecast();
  }

  formatForecastData(data: ForecastItem[]): { date: string; items: ForecastItem[] }[] {
    const formattedData: { date: string; items: ForecastItem[] }[] = [];

    data.forEach(item => {
      const date = item.dt_txt.split(' ')[0];
      const dayIndex = formattedData.findIndex(day => day.date === date);
      const temperture = Math.round(item.main.temp);

      if (dayIndex === -1) {
        formattedData.push({
          date,
          items: [
            {
              ...item,
              main: {
                temp: temperture
              }
            }
            ]
        });
      } else {
        formattedData[dayIndex].items.push({
          ...item,
          main: {
            temp: temperture
          }
        });
      }
    });

    return formattedData;
  }


  getDayOfWeek(date: string): string {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayIndex = new Date(date).getDay();

    return daysOfWeek[dayIndex];
  }

  getTimeOfDay(dateTime: string): string {
    const time = dateTime.split(' ')[1];
    const hour = Number(time.split(':')[0]);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;

    return `${formattedHour}${suffix}`;
  }

  private getForecast(): void {
    this.http.get<{ list: ForecastItem[] }>(`/data/2.5/forecast?zip=${this.zipCode}&units=imperial`).subscribe(
      (data: { list: ForecastItem[] }) => {
        this.forecast = this.formatForecastData(data.list);
      }
    );
  }
}
