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

  constructor(private _elementRef: ElementRef<HTMLElement>) {
  }

  ngAfterViewInit(): void {

    this.textWidth.font = 'Segoe UI';
    this.editor.textWidthFn = (text: string) => this.textWidth.getTextWidth(text);
    this.editor.insertLine(0);

    this._cursor = new Cursor(this.editor);
    this.editorHost.focus();
  }

  onpressKey(event: KeyboardEvent): void {
    // console.log(event);
    //
    // if (event.key && event.key.length === 1) {
    //   const textBefore = this._cursor.textBefore + event.key;
    //   const text = textBefore + this._cursor.textAfter;
    //   this._cursor.setLeft(this.textWidth.getTextWidth(textBefore)).then();
    //   this._cursor.x = this._cursor.textBefore.length + 1;
    //   this._cursor.setText(text);
    //   this.editorHost.innerText = text;
    //   this._text = text;
    // } else if (event.key === KeyboardCode.ArrowLeft) {
    //   if (this._cursor.x > 0) {
    //     this._cursor.x--;
    //     this._cursor.setText(this._text);
    //     this._cursor.setLeft(this.textWidth.getTextWidth(this._cursor.textBefore));
    //   }
    // } else if (event.key === KeyboardCode.ArrowRight) {
    //   if (this._cursor.x < this._text.length) {
    //     this._cursor.x++;
    //     this._cursor.setText(this._text);
    //     this._cursor.setLeft(this.textWidth.getTextWidth(this._cursor.textBefore));
    //   }
    //
    // }
  }

  get editorHost(): HTMLElement {
    return this.editor.host;
  }

}
