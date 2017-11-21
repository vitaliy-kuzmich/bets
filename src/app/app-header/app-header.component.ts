import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppHeaderComponent {
  headerLogo: string = "http://betlm.ag/wp-content/uploads/sites/3/2014/08/sports-betting-promos-header.jpg"


}
