export class Cursor {
  private _element: HTMLSpanElement;
  get element(): HTMLSpanElement {
    return this._element;
  }

  private _height: number;
  get height(): number {
    return this._height;
  }

  set height(value: number) {
    this._height = value;
    this._element.style.height = `${value}px`;
  }

  private _left: number;
  get left(): number {
    return this._left;
  }

  set left(value: number) {
    this._left = value;
    this._element.style.left = `${value}px`;
  }

  private _top: number;
  get top(): number {
    return this._top;
  }

  set top(value: number) {
    this._top = value;
    this._element.style.top = `${value}px`;
  }

  public x: number = 0;
  public y: number = 0;
  private _textBefore: string = '';
  get textBefore(): string {
    return this._textBefore;
  }

  private _textAfter: string = '';
  get textAfter(): string {
    return this._textAfter;
  }

  constructor(parent: HTMLElement) {
    const element = document.createElement('span');
    element.className = 'notepad-cursor';
    parent.appendChild(element);

    this._element = element;
  }

  setLeft(x: number): Promise<void> {
    return new Promise<void>(resolve => {
      this.element.animate([{left: `${this.left}px`}, {left: `${x}px`}],
        {duration: 50, fill: 'both'}).onfinish = () => {
        this._left = x;
        resolve();
      };
    });
  }

  setText(text: string): void {
    if (text.length === 0) {
      return;
    }
    this._textBefore = text.substring(0, this.x);

    if (text.length >= this.x) {
      this._textAfter = text.substring(this.x + 1);
    }

    console.log('Before: ' + this.textBefore);
    console.log('After: ' + this.textAfter);
  }
}
