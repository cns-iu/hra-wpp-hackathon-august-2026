import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  ArcRotateCamera,
  Engine,
  HemisphericLight,
  MeshBuilder,
  Scene,
  Vector3,
} from '@babylonjs/core';

@Component({
  selector: 'app-babylon-scene',
  imports: [],
  templateUrl: './babylon-scene.html',
  styleUrl: './babylon-scene.css',
})
export class BabylonScene implements AfterViewInit, OnDestroy {
  @ViewChild('renderCanvas', { static: true })
  private canvasRef!: ElementRef<HTMLCanvasElement>;

  private engine?: Engine;
  private scene?: Scene;

  ngAfterViewInit(): void {
    try {
      this.engine = new Engine(this.canvasRef.nativeElement, true);
    } catch {
      return;
    }

    this.scene = this.createScene(this.engine);
    this.engine.runRenderLoop(() => this.scene?.render());
  }

  @HostListener('window:resize')
  onResize(): void {
    this.engine?.resize();
  }

  ngOnDestroy(): void {
    this.scene?.dispose();
    this.engine?.dispose();
  }

  private createScene(engine: Engine): Scene {
    const scene = new Scene(engine);

    const camera = new ArcRotateCamera(
      'camera',
      -Math.PI / 2,
      Math.PI / 2.5,
      6,
      Vector3.Zero(),
      scene,
    );
    camera.attachControl(this.canvasRef.nativeElement, true);

    const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);

    const box = MeshBuilder.CreateBox('box', { size: .1 }, scene);
    // scene.onBeforeRenderObservable.add(() => {
    //   box.rotation.y += 0.01;
    // });

    return scene;
  }
}
