import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Notepad} from './notepad';
import {TextWidth} from './TextWidth/TextWidth';
import {Editor} from './Editor/Editor';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ Notepad, TextWidth, Editor ],
  exports: [ Notepad, TextWidth, Editor ]
})
export class NotepadModule {

}
