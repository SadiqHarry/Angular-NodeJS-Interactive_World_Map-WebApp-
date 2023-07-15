import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-world',
  templateUrl: './world.component.html',
  styleUrls: ['./world.component.css']
})
export class WorldComponent {
  clickedPathId: string | null = null;
  countryName: string | null = null;
  capitalCity: string | null = null;
  region: string | null = null;
  incomeLevel: string | null = null;
  longitude: string | null = null;
  latitude: string | null = null;

  constructor(private http: HttpClient) { }

  // Gets the Id from clicked path
  handleMapClick(event: MouseEvent) {
    const target = event.target as SVGElement;
    const pathElement = target.closest('path');
    if (pathElement) {
      this.clickedPathId = pathElement.getAttribute('id');

      // Remove the class from all paths
      const allPaths = document.querySelectorAll<SVGElement>('svg path');
      allPaths.forEach((path: SVGElement) => {
        path.classList.remove('clicked-path');
      });

      // Add the class to the clicked path
      pathElement.classList.add('clicked-path');
      this.makeApiCall(this.clickedPathId);
    } else {
      this.clickedPathId = null;
    }
  }

  // Api call to display info
  makeApiCall(countryCode: string | null) {
    if (countryCode) {
      const apiUrl = `https://api.worldbank.org/V2/country/${countryCode}?format=json`;

      this.http.get<any[]>(apiUrl).subscribe(
        (response: any[]) => {
          this.countryName = response[1][0].name;
          this.capitalCity = response[1][0].capitalCity;
          this.region = response[1][0].region.value;
          this.incomeLevel = response[1][0].incomeLevel.value;
          this.longitude = response[1][0].longitude;
          this.latitude = response[1][0].latitude;
        },
        (error: any) => {
          console.error('API call error:', error);
        }
      );
    }
  }
}
