import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {TextWidth} from './TextWidth/TextWidth';
import {Cursor} from './Cursor';
import {KeyboardCode} from './Code';
import {Observable, Subject} from 'rxjs';
import {filter} from 'rxjs/operators';
import {Editor} from './Editor/Editor';

@Component({
  templateUrl: 'notepad.html',
  selector: 'app-notepad',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'notepad'
  }
})
export class Notepad implements AfterViewInit {
  @ViewChild(Editor)
  private editor: Editor;

  @ViewChild(TextWidth)
  textWidth: TextWidth;

  private _cursor: Cursor;

  private _text: string = '';

  private _onkeydown = new Subject<KeyboardEvent>();

  constructor(private _elementRef: ElementRef<HTMLElement>) {
  }

  ngAfterViewInit(): void {

    this.textWidth.font = 'Segoe UI';

    this._cursor = new Cursor(this._elementRef.nativeElement);
    this._cursor.height = 20;
    this._cursor.left = this.textWidth.getTextWidth('');
    this._cursor.top = 0;

    this.editorHost.focus();

    this.editorHost.addEventListener('keydown', (event: KeyboardEvent) => {
      this.onpressKey(event);
      this._onkeydown.next(event);
    });

    this.onkeydown('ArrowUp').subscribe(event => {
      console.log('event up');
    });
  }

  onpressKey(event: KeyboardEvent): void {
    // console.log(event);

    if (event.key && event.key.length === 1) {
      const textBefore = this._cursor.textBefore + event.key;
      const text = textBefore + this._cursor.textAfter;
      this._cursor.setLeft(this.textWidth.getTextWidth(textBefore)).then();
      this._cursor.x = this._cursor.textBefore.length + 1;
      this._cursor.setText(text);
      this.editorHost.innerText = text;
      this._text = text;
    } else if (event.key === KeyboardCode.ArrowLeft) {
      if (this._cursor.x > 0) {
        this._cursor.x--;
        this._cursor.setText(this._text);
        this._cursor.setLeft(this.textWidth.getTextWidth(this._cursor.textBefore));
      }
    } else if (event.key === KeyboardCode.ArrowRight) {
      if (this._cursor.x < this._text.length) {
        this._cursor.x++;
        this._cursor.setText(this._text);
        this._cursor.setLeft(this.textWidth.getTextWidth(this._cursor.textBefore));
      }

    }
  }

  onkeydown(key?: string): Observable<KeyboardEvent> {
    if (!key) {
      return this._onkeydown.asObservable();
    }

    return this._onkeydown.pipe(filter(e => e.key === key));
  }

  get editorHost(): HTMLElement{
    return this.editor.host;
  }

}
