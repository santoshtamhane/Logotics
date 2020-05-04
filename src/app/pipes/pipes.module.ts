import { NgModule } from '@angular/core';
import { DurationFormatPipe } from './../pipes/duration-format.pipe';
import { EventGroupByPipe } from './../pipes/event-group-by.pipe';
@NgModule({
declarations: [DurationFormatPipe, EventGroupByPipe],
imports: [],
exports: [DurationFormatPipe, EventGroupByPipe]
})
export class PipesModule {}
