import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';

@Component({
  templateUrl: 'TextWidth.html',
  selector: 'TextWidth',
})
export class TextWidth implements AfterViewInit {
  @Input()
  get font(): string {
    return this._font;
  }

  set font(font: string) {
    this._font = font;
    this.context.font = '14px ' + font;
  }

  private _font: string;

  @Input()
  get size(): number {return this._size; }
  set size(value: number) {
    this._size = value;
  }
  private _size: number | undefined;


  @ViewChild('canvas')
  private _canvasRef: ElementRef<HTMLCanvasElement> | undefined;

  constructor(private _elementRef: ElementRef<HTMLElement>) {
    this._elementRef.nativeElement.style.display = 'none';
  }

  ngAfterViewInit(): void {
    console.log(this.context.font);
  }

  get context(): CanvasRenderingContext2D {
    return this._canvasRef.nativeElement.getContext('2d');
  }


  getTextWidth(text: string): number {
    return this.context.measureText(text).width;
  }
}
