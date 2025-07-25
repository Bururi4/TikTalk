import {
   Directive,
   EventEmitter,
   HostBinding,
   HostListener,
   Output,
} from '@angular/core';

@Directive({
   selector: '[dnd]',
   standalone: true,
})
export class DndDirective {
   @Output() fileDropper = new EventEmitter<File>();

   @HostBinding('class.fileOver')
   fileOver = false;

   @HostListener('dragover', ['$event'])
   onDragOver(event: DragEvent) {
      event.preventDefault();
      event.stopPropagation();

      this.fileOver = true;
   }

   @HostListener('dragleave', ['$event'])
   onDragLeave(event: DragEvent) {
      event.preventDefault();
      event.stopPropagation();

      this.fileOver = false;
   }

   @HostListener('drop', ['$event'])
   onDrop(event: DragEvent) {
      event.preventDefault();
      event.stopPropagation();

      this.fileOver = false;
      this.fileDropper.emit(event.dataTransfer?.files[0]);
   }
}
