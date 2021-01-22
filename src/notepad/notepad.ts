import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {TextWidth} from './TextWidth/TextWidth';
import {Cursor} from './Cursor';
import {KeyboardCode} from './Code';
import {Observable, Subject} from 'rxjs';
import {filter} from 'rxjs/operators';
import {Editor} from './Editor/Editor';
import {State} from './State';
import {StateBar} from './StateBar/StateBar';

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
  private _editor: Editor;

  get editor(): Editor {
    return this._editor;
  }

  @ViewChild(TextWidth)
  textWidth: TextWidth;

  @ViewChild(StateBar)
  stateBar: StateBar;

  state = new State();

  private _cursor: Cursor;
  get cursor(): Cursor {
    return this._cursor;
  }


  constructor(private _elementRef: ElementRef<HTMLElement>, private _changeDetectorRef: ChangeDetectorRef) {
  }

  ngAfterViewInit(): void {

    this.textWidth.font = 'Segoe UI';
    this.editor.textWidthFn = (text: string) => this.textWidth.getTextWidth(text);
    this.editor.insertLine(0);

    this._cursor = new Cursor(this.editor);
    this.stateBar.cursor = this._cursor;
    this._cursor.onChange.subscribe(() => {
      console.log('change');
      this.state.line = this._cursor.currentLine.index;
      this.state.column = this._cursor.x;
      this._changeDetectorRef.markForCheck();
    });
    this.editorHost.focus();
  }

  onpressKey(event: KeyboardEvent): void {
  }

  get editorHost(): HTMLElement {
    return this.editor.host;
  }

}
