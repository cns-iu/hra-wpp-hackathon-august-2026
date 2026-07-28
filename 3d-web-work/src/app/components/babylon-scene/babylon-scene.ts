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
  Color4,
  Engine,
  HemisphericLight,
  MeshBuilder,
  Scene,
  StandardMaterial,
  Color3,
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
      this.engine = new Engine(this.canvasRef.nativeElement, true, {
        preserveDrawingBuffer: true,
        stencil: true,
      });
    } catch {
      return;
    }

    this.scene = this.createScene(this.engine);

    this.engine.runRenderLoop(() => {
      this.scene?.render();
    });
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
    scene.clearColor = new Color4(0.06, 0.07, 0.09, 1);

    const camera = new ArcRotateCamera(
      'camera',
      -Math.PI / 2,
      Math.PI / 2.5,
      6,
      Vector3.Zero(),
      scene,
    );
    camera.attachControl(this.canvasRef.nativeElement, true);
    camera.lowerRadiusLimit = 3;
    camera.upperRadiusLimit = 20;

    const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
    light.intensity = 0.9;

    const box = MeshBuilder.CreateBox('box', { size: 2 }, scene);
    const material = new StandardMaterial('boxMaterial', scene);
    material.diffuseColor = new Color3(0.2, 0.6, 1);
    box.material = material;

    scene.onBeforeRenderObservable.add(() => {
      box.rotation.y += 0.01;
    });

    return scene;
  }
}
