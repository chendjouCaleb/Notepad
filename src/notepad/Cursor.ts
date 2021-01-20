import {Editor} from './Editor/Editor';
import {Line} from './Editor/Line';
import {KeyboardCode} from './Code';

export class Cursor {
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
    this._currentLine = editor.lines[0];

    this.updateView();

    this.editor.onkeydown().subscribe(event => {
      if (event.key === KeyboardCode.ArrowLeft) {
        console.log('left');
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
      } else if (event.key.length === 1) {
        this.editor.insertChar(event.key, this.currentLine, this.x);
        this.right();
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
      this._currentLine = line;

      this.updateView();
    } else {
      this.editor.removeChar(this.currentLine, this.x - 1);
      this.left();
    }
  }

  break(): void {
    this._currentLine = this.editor.breakLine(this._currentLine, this.x);
    this._x = 0;
    this.updateView();
  }

  left(): Promise<void> {
    this._x = this._x > 0 ? this._x - 1 : 0;
    this.updateView();
  }

  right(): Promise<void> {
    if (this._x < this.currentLine.text.length) {
      this._x++;
      this.updateView();
    }
  }

  up(): Promise<void> {
    if (this.currentLine.index > 0) {
      this._currentLine = this.editor.lines[this._currentLine.index - 1];
      this.updateView();
    }
  }

  down(): Promise<void> {
    if (this.currentLine.index < this.editor.lines.length - 1) {
      this._currentLine = this.editor.lines[this._currentLine.index + 1];
      this.updateView();
    }
  }


  updateView(): void {
    this._element.style.height = this._currentLine.host.offsetHeight + 'px';
    this._element.style.top = this._currentLine.host.offsetTop + 'px';
    this._element.style.left = (this.editor.textWidthFn(this._currentLine.text.slice(0, this._x)) + 1) + 'px';
  }
}
