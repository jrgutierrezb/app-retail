import { NgModule } from '@angular/core';
import {
    ValidadorLetrasDirective,
    ValidadorLetrasNumerosDirective,
    ValidadorNumerosDirective,
    ValidadorLetrasCaracteresDirective,
    NumberGuideDirective,
    DisabledControlDirective

} from './validators.directive';

@NgModule({
    declarations: [
        ValidadorNumerosDirective,
        ValidadorLetrasDirective,
        ValidadorLetrasNumerosDirective,
        ValidadorLetrasCaracteresDirective,
        NumberGuideDirective,
        DisabledControlDirective
    ],
    exports: [
        ValidadorNumerosDirective,
        ValidadorLetrasDirective,
        ValidadorLetrasNumerosDirective,
        ValidadorLetrasCaracteresDirective,
        NumberGuideDirective,
        DisabledControlDirective
    ]
})

export class ValidatorsModule { }