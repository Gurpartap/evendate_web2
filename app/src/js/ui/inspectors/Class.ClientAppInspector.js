/**
 * @requires Class.AbstractAppInspector.js
 */
/**
 *
 * @class ClientAppInspector
 * @extends AbstractAppInspector
 */
ClientAppInspector = extending(AbstractAppInspector, (function() {
	/**
	 *
	 * @param {OneUser} client
	 *
	 * @constructor
	 * @constructs ClientAppInspector
	 *
	 * @property {OneUser} client
	 *
	 */
	function ClientAppInspector(client) {
		
		this.client = client;
		
		this.title = 'Клиент';
		
		this.$interests_spiderweb_chart_container = $('<div class="SpiderWeb"></div>');
		
		this.$content = tmpl('client-app-inspector', {
			client: AbstractAppInspector.build.avatarBlock(client),
			interests_title: AbstractAppInspector.build.title('Интересы'),
			interests_spiderweb_chart: this.$interests_spiderweb_chart_container
		});
		
		AbstractAppInspector.call(this);
	}
	
	ClientAppInspector.prototype.initiate = function() {
		this.$interests_spiderweb_chart_container.highcharts({
			title: {
				text: false
			},
			legend: {
				enabled: false
			},
			tooltip: {
				enabled: false
			},
			chart: {
				backgroundColor: null,
				plotBorderWidth: null,
				plotShadow: false,
				style: {
					fontFamily: 'inherit',
					fontSize: 'inherit'
				},
				polar: true,
				type: 'area',
				spacing: [0 , 0, 0, 0],
				width: 364,
				height: 340
			},
			
			plotOptions: {
				series: {
					states: {
						hover: {
							lineWidth: 2
						}
					}
				},
				area: {
					fillOpacity: 0.5,
					marker: {
						enabled: false,
						symbol: 'circle',
						radius: 2,
						states: {
							hover: {
								enabled: false
							}
						}
					}
				}
			},
			colors: [__C.COLORS.FRANKLIN],
			pane: {
				size: '59%'
			},
			xAxis: {
				categories: this.client.interests.map(function(interest) {
					
					return interest.topic_name;
				}),
				tickmarkPlacement: 'on',
				labels: {
					reserveSpace: true,
					y: 5
				},
				lineWidth: 0
			},
			yAxis: {
				labels: false,
				tickAmount: 5,
				gridLineInterpolation: 'polygon',
				lineWidth: 0,
				min: 0
			},
			series: [{
				data: this.client.interests.map(function(interest) {
					
					return interest.value;
				})
			}],
			credits: {
				enabled: false
			}
		});
	};
	
	return ClientAppInspector;
}()));