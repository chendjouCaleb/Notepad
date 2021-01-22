import {Editor} from './Editor/Editor';
import {Line} from './Editor/Line';
import {KeyboardCode} from './Code';
import {Observable, Subject} from 'rxjs';

export class Cursor {
  private _changeSubject = new Subject<void>();

  get onChange(): Observable<void> {
    return this._changeSubject.asObservable();
  }

  private _element: HTMLSpanElement;
  get element(): HTMLSpanElement {
    return this._element;
  }

  private _currentLine: Line;
  get currentLine(): Line {
    return this._currentLine;
  }

  private _x: number = 0;
  get x(): number {
    return this._x;
  }

  private _textBefore: string = '';
  get textBefore(): string {
    return this._textBefore;
  }

  private _textAfter: string = '';
  get textAfter(): string {
    return this._textAfter;
  }

  constructor(private editor: Editor) {
    const element = document.createElement('span');
    element.className = 'notepad-cursor';
    editor.host.parentNode.appendChild(element);

    this._element = element;

    if (editor.lines.length === 0) {
      editor.insertLine(0);
    }
    this._setCurrentLine(editor.lines[0]);

    this.updateView();

    this.editor.onkeydown().subscribe(event => {
      if (event.key === KeyboardCode.ArrowLeft) {
        this.left();
      } else if (event.key === KeyboardCode.ArrowRight) {
        this.right();
      } else if (event.key === KeyboardCode.ArrowUp) {
        this.up();
      } else if (event.key === KeyboardCode.ArrowDown) {
        this.down();
      } else if (event.key === KeyboardCode.Enter) {
        this.break();
      } else if (event.key === KeyboardCode.Backspace) {
        this.backSpace();
      } else if (event.key === KeyboardCode.Delete) {
        this.delete();
      } else if (event.key === KeyboardCode.Tab) {
        event.preventDefault();
        this.editor.insertChar('\t', this.currentLine, this.x);
        this.right();
      } else if (event.key.length === 1) {
        this.editor.insertChar(event.key, this.currentLine, this.x);
        this.right();
      } else {
        console.log(event.key);
      }
    });
    this.editor.onkeydown(KeyboardCode.ArrowRight).subscribe(() => this.right());
  }

  delete(): void {
    this.editor.removeChar(this.currentLine, this.x);
  }

  backSpace(): void {
    if (this.x === 0 && this.currentLine.index > 0) {
      const line = this.editor.lines[this._currentLine.index - 1];
      this._x = line.text.length;
      this.editor.insertText(this.currentLine.text, line, line.text.length);
      this.editor.removeLine(this.currentLine);
      this._setCurrentLine(line);
      this._emitChangeEvent();
      this.updateView();
    } else {
      this.editor.removeChar(this.currentLine, this.x - 1);
      this.left();
    }

  }

  break(): void {
    this._setCurrentLine(this.editor.breakLine(this._currentLine, this.x));
    this._x = 0;
    this._emitChangeEvent();
    this.updateView();
  }

  left(): Promise<void> {
    this._x = this._x > 0 ? this._x - 1 : 0;
    this.updateView();
    this._emitChangeEvent();
    return Promise.resolve();
  }

  right(): Promise<void> {
    if (this._x < this.currentLine.text.length) {
      this._x++;
      this.updateView();
    }
    this._emitChangeEvent();
    return Promise.resolve();
  }

  up(): Promise<void> {
    if (this.currentLine.index > 0) {
      this._setCurrentLine(this.editor.lines[this._currentLine.index - 1]);
      this.updateView();
      this._emitChangeEvent();
    }
    return Promise.resolve();
  }

  down(): Promise<void> {
    if (this.currentLine.index < this.editor.lines.length - 1) {
      this._setCurrentLine(this.editor.lines[this._currentLine.index + 1]);
      this.updateView();
      this._emitChangeEvent();
    }
    return Promise.resolve();
  }

  private _setCurrentLine(line: Line): void {
    if (this.currentLine) {
      this.currentLine.host.classList.remove('current');
    }

    this._currentLine = line;
    this.currentLine.host.classList.add('current');
  }


  updateView(): void {
    this._element.style.height = this._currentLine.host.offsetHeight + 'px';
    this._element.style.top = (this._currentLine.host.offsetTop + 1) + 'px';
    this._element.style.left = (this.editor.host.offsetLeft + this.editor.textWidthFn(this._currentLine.text.slice(0, this._x)) + 1) + 'px';
  }

  private _emitChangeEvent(): void {
    this._changeSubject.next();
  }
}
