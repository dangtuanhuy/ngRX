import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { reducer } from './components/entity-assignment/state/entity-assignment.reducer';

@NgModule({
    imports: [
        StoreModule.forFeature(`entity_assignment`, reducer)
    ],
    exports: [
    ],
    declarations: [
    ],
    providers: [
    ],
    entryComponents: [
    ]
})
export class SharedStateModule { }
