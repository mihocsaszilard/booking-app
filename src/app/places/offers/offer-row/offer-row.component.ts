import { Component, Input, OnInit } from '@angular/core';
import { Place } from '../../places.model';

@Component({
  selector: 'app-offer-row',
  templateUrl: './offer-row.component.html',
  styleUrls: ['./offer-row.component.scss'],
})
export class OfferRowComponent implements OnInit {

  @Input() offer: Place;

  constructor() { }

  ngOnInit() { }

}
