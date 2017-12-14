/**
 * @requires AbstractEvendateApplication.js
 */
class EvendateWidget extends AbstractEvendateApplication {
	constructor() {
		super();
		this.WIDGET_NAME = '/widget/';
		this.POST_MESSAGE = new WidgetPostMessageConnection(window);
		this.IS_WIDGET = true;
		this.ROUTING = {
			'widget' : {
				'order': {
					'event': {
						'^([0-9]+)': {
							'^([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})': {
								'from_legal_entity': LegalEntityPayment
							},
							'': OrderPage
						},
					}
				}
			},
		};
		Object.defineProperty(this, 'WIDGET_NAME', {
			get() {
				const [base_path, WIDGET_NAME] = location.pathname.match(/\/widget\/([^\/]*)\//);
				
				return WIDGET_NAME;
			}
		});
		Object.defineProperty(this, 'BASE_PATH', {
			get() {
				
				return `/widget/${this.WIDGET_NAME}/`;
			}
		});
	}
}