import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Editor} from './Editor';
import {Line} from './Line';

describe('Editor behavior', () => {
  let component: ComponentFixture<Editor>;
  let editor: Editor;
  beforeEach(() => {
    TestBed.configureTestingModule({declarations: [Editor]});
    component = TestBed.createComponent(Editor);
    editor = component.componentInstance;
  });

  it('insert first Line', () => {
    const line = editor.insertLine(0);

    expect(line.index).toBe(0);
    expect(line.host).toBeDefined();
    expect(line.host.parentElement).toBe(editor.host);
    expect(line.text).toBe('');
    expect(editor.lines.length).toBe(1);
    expect(editor.lines.indexOf(line)).toBe(0);
  });

  it('Insert second line', () => {
    editor.insertLine(0);
    const line = editor.insertLine(1);

    expect(line.index).toBe(1);
    expect(line.host).toBeDefined();
    expect(line.host.parentElement).toBe(editor.host);
    expect(line.text).toBe('');
    expect(editor.lines.length).toBe(2);
    expect(editor.lines.indexOf(line)).toBe(1);
  });

  it('Insert line at start', () => {
    editor.insertLine(0);
    editor.insertLine(1);
    editor.insertLine(2);

    const line = editor.insertLine(0);

    expect(line.index).toBe(0);
    expect(editor.lines.length).toBe(4);
    expect(editor.lines.indexOf(line)).toBe(0);

    checkLineIndex(editor);
  });

  it('Insert line in middle', () => {
    addLines(editor, 10);
    const line = editor.insertLine(1);

    expect(line.index).toBe(1);
    expect(editor.lines.length).toBe(11);
    expect(editor.lines.indexOf(line)).toBe(1);

    checkLineIndex(editor);
  });

  it('remove first line', () => {
    addLines(editor, 10);
    const line = editor.removeLineAt(0);

    expect(line.index).toBe(0);
    expect(editor.lines.indexOf(line)).toBe(-1);
    expect(Array.from(editor.host.children).indexOf(line.host)).toBe(-1);

    checkLineIndex(editor);
  });

  it('remove middle line', () => {
    addLines(editor, 10);
    const line = editor.removeLineAt(5);

    expect(line.index).toBe(5);
    expect(editor.lines.indexOf(line)).toBe(-1);
    expect(Array.from(editor.host.children).indexOf(line.host)).toBe(-1);

    checkLineIndex(editor);
  });

  it('remove last line', () => {
    addLines(editor, 10);
    const line = editor.removeLineAt(9);

    expect(line.index).toBe(9);
    expect(editor.lines.indexOf(line)).toBe(-1);
    expect(Array.from(editor.host.children).indexOf(line.host)).toBe(-1);

    checkLineIndex(editor);
  });


  it('Add line text', () => {
    const line = editor.insertLine(0);

    editor.insertText(lineText, line, 0);

    expect(editor.lines.length).toBe(1);
    expect(line.text).toBe(lineText);
    expect(line.length).toBe(editor.textWidthFn(lineText));
    expect(line.host.innerText).toBe(lineText);
    expect(editor.text).toBe(line.text);
  });

  it('Merge text correctly', () => {
    expect(editor.mergeText('0123789', '456', 4)).toBe('0123456789');
    expect(editor.mergeText('0123456', '789', 7)).toBe('0123456789');
    expect(editor.mergeText('3456789', '012', 0)).toBe('0123456789');
    expect(editor.mergeText('', '0123456789', 0)).toBe('0123456789');
    expect(editor.mergeText(null, '0123456789', 0)).toBe('0123456789');
    expect(editor.mergeText(null, null, 0)).toBe('');
    expect(editor.mergeText('abc', null, 0)).toBe('abc');

  });


  it('Add multiline text', () => {
      const textLines = multilineText.split('\n');

      const lineCount = textLines.length;
      const line = editor.insertLine(0);
      editor.insertText(multilineText, line, 0);

      expect(editor.lines.length).toBe(lineCount);


      for (let i = 0; i < editor.lines.length; i++) {
        expect(editor.lines[i].text).toBe(textLines[i]);
        expect(editor.lines[i].host.innerText).toBe(textLines[i].trim());
        expect(editor.lines[i].length).toBe(editor.textWidthFn(textLines[i]));
        expect(editor.lines[i].index).toBe(i);
        expect(multilineText).toBe(editor.text);
      }
    }
  );

  it('Add multiline text at middle of line', () => {
      const line = editor.insertLine(0);
      editor.insertText('abc123', line, 0);
      editor.insertText(multilineText, line, 3);

      const finalText = 'abc' + multilineText + '123';
      const textLines = finalText.split('\n');
      const lineCount = textLines.length;

      expect(editor.lines.length).toBe(lineCount);


      for (let i = 0; i < editor.lines.length; i++) {
        expect(editor.lines[i].text).toBe(textLines[i]);
        expect(editor.lines[i].host.innerText).toBe(textLines[i].trim());
        expect(editor.lines[i].length).toBe(editor.textWidthFn(textLines[i]));
        expect(editor.lines[i].index).toBe(i);
        expect(finalText).toBe(editor.text);
      }
    }
  );

  it('Add text at the beginning line', () => {
    const line = editor.insertLine(0);

    editor.insertText(lineText, line, 0);
    editor.insertText(lineText + 'abc', line, 0);
    const finalText = lineText + 'abc' + lineText;

    expect(editor.lines.length).toBe(1);
    expect(line.text).toBe(finalText);
    expect(line.length).toBe(editor.textWidthFn(finalText));
    expect(line.host.innerText).toBe(finalText);
    expect(editor.text).toBe(finalText);
  });

  it('Add Text at the end of line', () => {
    const line = editor.insertLine(0);

    editor.insertText(lineText, line, 0);
    editor.insertText('abc', line, lineText.length);
    const finalText = lineText + 'abc';

    expect(line.text).toBe(finalText);
    expect(line.length).toBe(editor.textWidthFn(finalText));
    expect(line.host.innerText).toBe(finalText);
    expect(editor.text).toBe(finalText);
  });

  it('Remove char at beginning of line', () => {
    const text = '0123456789';
    const line = editor.insertLine(0);
    editor.insertText(text, line, 0);
    editor.removeChar(line, 0);

    expect(editor.lines.length).toBe(1);
    checkLineText(editor, line, '123456789');
  });

  it('Remove char at the middle of line', () => {
    const text = '0123456789';
    const line = editor.insertLine(0);
    editor.insertText(text, line, 0);
    editor.removeChar(line, 4);

    expect(editor.lines.length).toBe(1);
    checkLineText(editor, line, '012356789');
  });

  it('Remove char at the end of line', () => {
    const text = '0123456789';
    const line = editor.insertLine(0);
    editor.insertText(text, line, 0);
    editor.removeChar(line, 9);

    expect(editor.lines.length).toBe(1);
    checkLineText(editor, line, '012345678');
  });


  it('Break line at the beginning', () => {
    const text = '0123456789';
    const line = editor.insertLine(0);
    editor.insertText(text, line, 0);
    const newLine = editor.breakLine(line, 0);

    expect(line.index).toBe(0);
    expect(newLine.index).toBe(1);

    expect(newLine.text).toBe(text);
    expect(line.text).toBe('');

    expect(editor.lines.length).toBe(2);
  });

  it('Break line at the middle', () => {
    const text = '0123456789';
    const line = editor.insertLine(0);
    editor.insertText(text, line, 0);
    const newLine = editor.breakLine(line, 4);

    expect(line.index).toBe(0);
    expect(newLine.index).toBe(1);

    expect(newLine.text).toBe('456789');
    expect(line.text).toBe('0123');

    expect(editor.lines.length).toBe(2);
  });


  it('Break line at the end', () => {
    const text = '0123456789';
    const line = editor.insertLine(0);
    editor.insertText(text, line, 0);
    const newLine = editor.breakLine(line, 10);

    expect(line.index).toBe(0);
    expect(newLine.index).toBe(1);

    expect(newLine.text).toBe('');
    expect(line.text).toBe(text);

    expect(editor.lines.length).toBe(2);
  });
});

function checkLineIndex(editor: Editor): void {
  editor.lines.forEach((line, index) => {
    expect(line.index).toBe(index);

    const elementIndex = Array.from(editor.host.children).indexOf(line.host);
    expect(elementIndex).toBe(index);
  });
}

function checkLineText(editor: Editor, line: Line, text: string): void {
  expect(text).toBe(line.text);
  expect(editor.textWidthFn(text)).toBe(line.length);
  expect(text).toBe(line.host.innerText);
}

function addLines(editor: Editor, count: number = 10): void {
  for (let i = 0; i < count; i++) {
    editor.insertLine();
  }
}


const lineText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit,`;

const multilineText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut dui vel nisi tempor finibus. ' +
  '\nDuis id nisl molestie, finibus tortor eget, viverra arcu. Integer tincidunt mi eu tellus luctus cursus. Maecenas ' +
  '\nmollis turpis eu urna imperdiet posuere. Nullam et varius nulla, quis commodo dolor. Morbi mi metus, vulputate in ' +
  '\neleifend et, porttitor sed elit. Morbi facilisis nisi id leo bibendum condimentum. Fusce nec velit tristique, ' +
  '\nconsequat augue sit amet, tempus nisi. Etiam sapien magna, faucibus et dapibus quis, consectetur vel lectus. ' +
  '\nCurabitur ut lacus ac nunc laoreet elementum. Duis arcu turpis, aliquam ut consectetur sed, efficitur et lorem. ' +
  '\nNam gravida auctor rhoncus. Praesent vehicula, ex at porttitor interdum, dui libero tincidunt elit, ' +
  '\nnon commodo erat odio in nisi. Nam interdum nunc ac ligula eleifend convallis. In hac habitasse platea ' +
  '\ndictumst. Morbi turpis diam, pretium ut hendrerit tempus, gravida a turpis. Cras lobortis elit sed diam ullamcorper, ' +
  '\neget venenatis dui maximus. Sed lacinia, libero vitae ullamcorper consequat, metus mauris congue ligula, id feugiat ' +
  '\nvelit nulla sit amet lacus. Vivamus tellus lacus, porttitor vitae volutpat in, dignissim eu tellus. Mauris fermentum ' +
  '\nmassa at ipsum elementum hendrerit. Phasellus quis diam odio porttitor condimentum nec imperdiet nisl. Sed vitae ' +
  '\nvarius eros, consectetur semper risus. Morbi pulvinar sapien a nisl luctus iaculis!';
