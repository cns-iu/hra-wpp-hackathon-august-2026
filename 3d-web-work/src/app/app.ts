import { Component } from '@angular/core';
import { BabylonScene } from './components/babylon-scene/babylon-scene';

@Component({
  selector: 'app-root',
  imports: [BabylonScene],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
