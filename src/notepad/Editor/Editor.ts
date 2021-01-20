import {ChangeDetectionStrategy, Component, ElementRef, Input, Output, ViewEncapsulation} from '@angular/core';
import {Line} from './Line';
import {Observable, Subject} from 'rxjs';

export class TextChangeEvent {
  currentText: string;
  previousText: string;
  addition: string;
}

@Component({
  templateUrl: 'Editor.html',
  selector: 'Editor',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'editor ms-depth-16',
    tabindex: '0',
  }
})
export class Editor {

  @Output()
  get onTextChange(): Observable<TextChangeEvent> {
    return this._onTextChange.asObservable();
  }
  get lines(): Line[] {
    return this._lines.slice();
  }

  constructor(private elementRef: ElementRef<HTMLElement>) {
  }

  get host(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  get text(): string {
    return this._lines.map(l => l.text).join('\n');
  }
  private _onTextChange = new Subject<TextChangeEvent>();

  private _lines: Line[] = [];

  @Input()
  textWidthFn: (text: string) => number = text => text != null ? text.length : 0

  insertText(text: string, line: Line, index: number): Line[] {

    if (index > line.length) {
      throw new Error('Target index is out of range');
    }

    text = this.mergeText(line.text, text, index);

    const textLines = text.split('\n');

    const lineCount = textLines.length;

    const lines: Line[] = [line];
    for (let i = 1; i < lineCount ; i++) {
      lines[i] = this.insertLine(line.index + i + 1);
    }

    for (let i = 0; i < lines.length; i++) {
      lines[i].text = textLines[i];
      lines[i].host.innerText = lines[i].text.trim();
      lines[i].length = this.textWidthFn(lines[i].text);
    }
    return lines;
  }

  mergeText(currentText: string, text: string, index: number): string {
    if (!currentText) {
      currentText = '';
    }

    if (!text) {
      text = '';
    }
    return [currentText.slice(0, index), text, currentText.slice(index)].join('');
  }

  insertTextAt(text: string, lineIndex: number, index: number): string {
    throw new Error('Not implemented method!');
  }

  appendSpace(line: Line, index: number, count: number): string {
    throw new Error('Not implemented method!');
  }

  removeChar(line: Line, index: number): string {
    throw new Error('Not implemented method!');
  }

  removeTextAtLine(line: Line, startIndex: number, endIndex: number): string {
    throw new Error('Not implemented method!');
  }

  removeText(startLine: Line, startIndex: number, endLine: Line, endIndex: number): string {
    throw new Error('Not implemented method!');
  }

  /**
   * Break line in two line.
   * @param index The index to which the line is cut.
   * @param line The line to break.
   * @return The new line.
   */
  breakLine(line: Line, index: number): Line {
    throw new Error('Not implemented method!');
  }

  insertLine(index: number = 0): Line {
    const line = new Line();
    line.host = document.createElement('div');
    line.host.classList.add('editor-line');
    line.text = '';

    this._lines.splice(index, 0, line);
    this._lines.forEach((lineItem, i) => lineItem.index = i);

    if (index < this.lines.length - 1) {
      this.host.insertBefore(line.host, this.host.children[index]);
    } else {
      this.host.appendChild(line.host);
    }

    return line;
  }

  /** Add a line at the end. */
  pushLine(): Line {
    throw new Error('Not implemented method!');
  }

  /** Add the line at the beginning. */
  unshiftLine(): Line {
    throw new Error('Not implemented method!');
  }

  removeLine(line: Line): Line {
    this.host.removeChild(line.host);
    this._lines = this._lines.filter(l => l !== line);
    this._lines.forEach((lineItem, i) => lineItem.index = i);
    return line;
  }

  removeLineAt(index: number): Line {
    if (index < 0 || index >= this._lines.length) {
      throw new Error('Out of range error');
    }
    const line = this._lines[index];
    return this.removeLine(line);
  }

  /** Remove last line. */
  popLine(): Line {
    throw new Error('Not implemented method!');
  }

  /** Remove the first line. */
  shiftLine(): Line {
    throw new Error('Not implemented method!');
  }


  _emitTextChangeEvent(addition: string): void {
    return;
  }
}

