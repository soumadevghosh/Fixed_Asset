import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { LoaderService } from './Shared/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
 
})
export class LoaderComponent {
    color = 'warn';
    mode = 'indeterminate';
    value = 50;
    isLoading: Subject<boolean> = this.loaderService.isLoading;
  constructor(private loaderService: LoaderService){}

}
