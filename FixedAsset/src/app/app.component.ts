import { Component } from '@angular/core';
import{Router,NavigationStart,NavigationEnd, Event} from '@angular/router';
import { LoaderService } from './Layout/Shared/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Fixed Asset';
  showHeader:boolean;
  constructor(private router: Router,public loaderService: LoaderService) {
    this.router.events.subscribe((routerEvent:Event)=>{
      if(routerEvent instanceof NavigationStart){
        if (routerEvent['url'] == '/login' || routerEvent['url'] == '/') {
          this.loaderService.hide();
          this.showHeader=false;
        } else {
         this.loaderService.show();
         this.showHeader=true;
        }
      }
      if(routerEvent instanceof NavigationEnd){
          this.loaderService.hide();
      }
    })
  }
}
