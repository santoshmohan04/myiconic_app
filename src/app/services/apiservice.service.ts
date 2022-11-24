import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getAllProducts() {
    let apiUrl = 'https://dummyjson.com/products';
    return this.http.get(apiUrl).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error) => {
        throw new Error(error);
      })
    );
  }

  getGeoLoc(cityList: string): Observable<[]> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('q', cityList);
    queryParams = queryParams.append('units', 'metric');
    queryParams = queryParams.append('appid', environment.API);

    return this.http
      .get('https://api.openweathermap.org/data/2.5/weather', {
        params: queryParams,
      })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError((error) => {
          throw new Error(error.error.message);
        })
      );
  }

  getCityWeather(latitude: number, longitude: number): Observable<[]> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append('lat', latitude);
    queryParams = queryParams.append('lon', longitude);
    queryParams = queryParams.append('exclude', 'minutely,hourly');
    queryParams = queryParams.append('appid', environment.API);
    queryParams = queryParams.append('units', 'metric');

    return this.http
      .get('https://api.openweathermap.org/data/2.5/onecall', {
        params: queryParams,
      })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError((error) => {
          throw new Error(error.error.message);
        })
      );
  }
}
