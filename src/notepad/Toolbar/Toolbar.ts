import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  templateUrl: 'Toolbar.html',
  styleUrls: [ 'Toolbar.scss'],
  selector: 'Toolbar',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Toolbar {

}
