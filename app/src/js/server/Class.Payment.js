/**
 * @requires Class.AsynchronousConnection.js
 */
/**
 *
 * @singleton
 * @class Payment
 * @extends AsynchronousConnection
 */
Payment = extending(AsynchronousConnection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs Payment
	 */
	function Payment() {
		if (typeof Payment.instance === 'object') {
			return Payment.instance;
		}
		Payment.instance = this;
	}
	
	/**
	 *
	 * @param {number} organization_id
	 * @param {function({uuid: string, sum: number})} success
	 *
	 * @return {Promise}
	 */
	Payment.payForTariff = function(organization_id, success) {
		return AsynchronousConnection.dealAjax(
			AsynchronousConnection.HTTP_METHODS.POST,
			'/api/v1/payments/organizations/',
			{organization_id: organization_id},
			null,
			success
		);
	};
	/**
	 *
	 * @param {string} uuid
	 * @param {number} sum
	 * @param {string} [callback_url]
	 */
	Payment.doPayment = function(uuid, sum, callback_url) {
		var $payment_form = tmpl('payment-form', {
			customer_id: __APP.USER.full_name,
			cps_email: __APP.USER.email,
			callback_url: callback_url || location.href,
			payment_uuid: uuid,
			sum: sum
		}, __APP.CURRENT_PAGE.$wrapper);
		
		if (__APP.IS_WIDGET) {
			$payment_form.attr('target', '__blank');
		}
		$payment_form.submit().remove();
	};
	
	return Payment;
}()));