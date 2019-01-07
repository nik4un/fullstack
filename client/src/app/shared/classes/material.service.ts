import { ElementRef } from '@angular/core';

declare var M;


export interface ModalInstance {
  open?(): void;
  close?(): void;
  destroy?(): void;
}

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

  static initModal(ref: ElementRef): ModalInstance {
    return M.Modal.init(ref.nativeElement);
  }

  static initTooltip(ref: ElementRef): ModalInstance {
    return M.Tooltip.init(ref.nativeElement);
  }
}

