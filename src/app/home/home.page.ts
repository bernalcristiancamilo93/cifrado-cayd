import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public cyphers = [
    {
      title: 'Cesar\'s Cipher',
      description: 'Here\'s a small text description for the Cesar\'s Cipher. Nothing more, nothing less.',
      disabled: false,
      url: '/cesar'
    },
    {
      title: 'RSA Cipher',
      description: 'Cipher description...',
      disabled: true,
      url: '/'
    },
    {
      title: 'DES Cipher',
      description: 'Cipher description...',
      disabled: true,
      url: '/'
    },
    {
      title: 'Gamal\'s Cipher',
      description: 'Cipher description...',
      disabled: true,
      url: '/'
    },
    {
      title: 'Mochila\'s Cipher',
      description: 'Cipher description...',
      disabled: true,
      url: '/'
    },
  ];

  constructor() {}

}
