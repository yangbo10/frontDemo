import {EventEmitter, Output} from '@angular/core';



export class GlobalLanguageEventService {
  @Output()
  languageChanged: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
  }

  public setLanguage(lang: string) {
    this.languageChanged.emit(lang);
  }
}
