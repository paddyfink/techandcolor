import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-callback',
  template: `<span>Loading...</span>`
})
export class CallbackComponent implements OnInit {



  constructor(private router: Router) {

  }



  ngOnInit() {

  }
}
