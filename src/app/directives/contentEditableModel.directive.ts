import { Directive, Input, Output, ElementRef, OnChanges, EventEmitter, SimpleChanges } from '@angular/core';

@Directive({
    selector: '[contentEditableModel]',
    host: {
        '(keyup)': 'onKeyUp()'
    }
})
export class ContentEditableModelDirective implements OnChanges {

    @Input('contentEditableModel') model: any;
    @Output('contentEditableModelChange') update = new EventEmitter();

    private lastViewModel: any;

    constructor(private el: ElementRef) {}

    public onKeyUp() {
        let value = this.el.nativeElement.innerText;
        this.lastViewModel = value;
        this.update.emit(value);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['model'].currentValue !== changes['model'].previousValue) {
            if (!changes['model'].currentValue) { this.model = null; }
            this.lastViewModel = this.model;
            this.refreshView();
        }
    }

    private refreshView() {
        this.el.nativeElement.innerText = this.model;
    }

}