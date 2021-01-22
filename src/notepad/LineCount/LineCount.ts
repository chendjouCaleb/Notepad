import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {Editor} from '../Editor/Editor';

@Component({
  templateUrl: 'LineCount.html',
  selector: 'LineCount',
  styleUrls: ['LineCount.scss']
})
export class LineCount {
  @Input()
  editor: Editor;

  lines: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
}
