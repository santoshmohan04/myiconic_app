import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../services/apiservice.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit, AfterViewInit {
  cityList: string[] = ['Hyderabad', 'Delhi', 'London'];
  searchCity: any;
  selectedCity: number;
  cityLocations: any = [];
  cityWeather: any;
  weather: any = [];
  city: string = '';
  current: any = {};
  dailyWeather: any = [];
  errorMsg: string = '';
  addCityForm: FormGroup;
  private listSub = new BehaviorSubject([]);
  listSubObservab = this.listSub.asObservable();

  constructor(private fb: FormBuilder, private apiservice: ApiService) {}

  ngOnInit(): void {
    this.cityList.forEach((element) => {
      this.apiservice.getGeoLoc(element).subscribe((responseData) => {
        this.cityLocations.push(responseData);
      });
      this.listSub.next(this.cityLocations);
    });

    this.addCityForm = this.fb.group({
      city: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
    });
  }

  ngAfterViewInit() {
    console.log(this.cityLocations);
    this.listSubObservab.subscribe((res: any) => {
      setTimeout(() => {
        this.refreshWeather(0);
        this.getWeatherUpdates(0);
      }, 2000);
    });
  }

  onAdd(form: FormGroup) {
    let enteredCity = form.value.city;
    this.apiservice.getGeoLoc(enteredCity).subscribe({
      next: (res: any) => {
        this.cityLocations.push(res);
        let noCityLoc = this.cityLocations.length;
        let loadCity = noCityLoc - 1;
        this.refreshWeather(loadCity);
        this.getWeatherUpdates(loadCity);
        form.reset();
      },
      error: (err: any) => {
        let dispErr = err.toString().replace(/Error: /g, '');
        // console.log('There was an error!', dispErr);
        this.errorMsg = dispErr;
      },
    });
  }

  refreshWeather(i: number) {
    this.selectedCity = i;
    this.cityWeather = this.cityLocations[i];
  }

  removeCity(i: number) {
    console.log(i);
    this.cityLocations.splice(i, 1);
  }

  clearList() {
    this.cityLocations = [];
    this.city = '';
    this.cityWeather = {};
    this.weather = [];
    this.current = {};
    this.dailyWeather = [];
  }

  refreshStatus() {
    this.cityWeather = false;
    this.cityWeather = true;
  }

  getWeatherUpdates(i: number) {
    console.log(i);
    let latitude = this.cityLocations[i].coord.lat;
    let longitude = this.cityLocations[i].coord.lon;
    this.city = this.cityLocations[i].name;
    this.apiservice.getCityWeather(latitude, longitude).subscribe({
      next: (res: any) => {
        this.cityWeather = res;
        this.weather = Object.values(this.cityWeather.current.weather);
        this.current = this.cityWeather.current;
        this.dailyWeather = this.cityWeather.daily;
      },
      error: (err: any) => {
        let dispErr = err.toString().replace(/Error: /g, '');
        // console.log('There was an error!', dispErr);
        this.errorMsg = dispErr;
      },
    });
  }
}
