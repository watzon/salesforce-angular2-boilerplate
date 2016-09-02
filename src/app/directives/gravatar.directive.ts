import { Directive, Input, ElementRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Http, Response } from '@angular/http';
import { MD5 } from 'crypto-js';

@Directive({
    selector: '[gravatar]'
})
export class GravatarDirective implements OnInit, OnChanges {

    @Input('gravatar') email: string;
    @Input() size: number = 300;
    public gravatarUrl: string;

    constructor(private el: ElementRef) {}

    private getAvatarUrl() {
        let hash: string = MD5(this.email);
        let url: string = `http://gravatar.com/avatar/${hash}.json?s=${this.size}`;
        
        let el: HTMLImageElement = this.el.nativeElement;
        el.src = url;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['email'].previousValue !== changes['email'].currentValue) {
            this.getAvatarUrl();
        }
    }

    ngOnInit(): void {
        this.getAvatarUrl();
    }

}