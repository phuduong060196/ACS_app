import { NgModule } from '@angular/core';
import { ServiceCartComponent } from './service-cart/service-cart';
import { ControlMessagesComponent } from './control-messages/control-messages';
@NgModule({
	declarations: [ServiceCartComponent,
    ControlMessagesComponent],
	imports: [],
	exports: [ServiceCartComponent,
    ControlMessagesComponent]
})
export class ComponentsModule {}
