import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Editor} from '../Editor/Editor';
import {Cursor} from '../Cursor';

@Component({
  templateUrl: 'StateBar.html',
  styleUrls: ['StateBar.scss'],
  selector: 'StateBar',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StateBar implements OnInit {
  @Input()
  editor: Editor;


  @Input()
  set cursor(value: Cursor) {
    this._cursor = value;

    value.onChange.subscribe(() => {
      this.lineIndex = this._cursor.currentLine.index;
      this.columnIndex = this._cursor.x;
      this._changeDetectorRef.markForCheck();
    });
  }

  _cursor: Cursor;

  lineIndex: number = 0;
  columnIndex: number = 0;

  constructor(private _changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {

  }
}
