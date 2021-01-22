import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Notepad} from './notepad';
import {TextWidth} from './TextWidth/TextWidth';
import {Editor} from './Editor/Editor';
import {LineCount} from './LineCount/LineCount';
import {StateBar} from './StateBar/StateBar';
import {Toolbar} from './Toolbar/Toolbar';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ Notepad, TextWidth, Editor, LineCount, StateBar, Toolbar ],
  exports: [ Notepad, TextWidth, Editor, LineCount, StateBar, Toolbar ],
})
export class NotepadModule {

}
