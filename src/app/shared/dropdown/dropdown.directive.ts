import { Directive, HostBinding, HostListener, ElementRef, Renderer2 } from '@angular/core';

@Directive({
    selector: '[appDropdown]'
})
export class DropdownDirective {
    // Binds to the class (native) that's called 'open'
    @HostBinding('class.open') isOpen: boolean = false;

    @HostListener('click') toggleOpen(eventData: Event) {
        this.isOpen = !this.isOpen;
    }
}


// Closes the dropdown from anywhere
// But clicking on one dropdown also closes the other one

// import {Directive, ElementRef, HostBinding, HostListener} from '@angular/core';

// @Directive({
//   selector: '[appDropdown]'
// })
// export class DropdownDirective {
//   @HostBinding('class.open') isOpen = false;
//   @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
//     this.isOpen = this.elRef.nativeElement.contains(event.target) ? !this.isOpen : false;
//   }
//   constructor(private elRef: ElementRef) {}
// }