import { ElementRef } from '@angular/core';
import { ModalInstance } from '../interfaces';

declare var M;

export class MaterialService {
  static toast(message: string) {
    M.toast({ html: message });
  }

  static initializeFloatingButton(ref: ElementRef) {
    M.FloatingActionButton.init(ref.nativeElement);
  }

  static updateTextInput() {
    M.updateTextFields();
  }

  static initModal(elem): ModalInstance {
    return M.Modal.init(elem);
  }
}

