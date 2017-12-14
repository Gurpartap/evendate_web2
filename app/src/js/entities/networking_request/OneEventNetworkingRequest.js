/**
 * @requires OneNetworkingRequest.js
 */
class OneEventNetworkingRequest extends OneNetworkingRequest {
	constructor(event_id, uuid) {
		super(uuid);
		
		this.event_id = setDefaultValue(event_id, null);
	}
	
	/**
	 *
	 * @param {number} event_id
	 * @param {number} user_id
	 * @param {string} [message]
	 *
	 * @return {Promise}
	 */
	static createRequest(event_id, user_id, message) {
		
		return __APP.SERVER.addData(OneEventNetworkingRequest.requestsPath(event_id), {
			recipient_user_id: user_id,
			message
		});
	}
	
	/**
	 *
	 * @param event_id
	 * @param uuid
	 * @param {object} new_data
	 * @param {boolean} [new_data.status]
	 * @param {boolean} [new_data.accept]
	 * @return {Promise}
	 */
	static updateRequest(event_id, uuid, new_data) {
		
		return __APP.SERVER.updateData(OneEventNetworkingRequest.requestPath(event_id, uuid), new_data);
	}
	
	static revokeRequest(event_id, uuid) {
		
		return __APP.SERVER.updateData(OneEventNetworkingRequest.requestPath(event_id, uuid), {status: false});
	}
	
	/**
	 *
	 * @param {number} event_id
	 * @param {string} uuid
	 * @param {object} request_data
	 *
	 * @return {Promise}
	 */
	static fetchRequest(event_id, uuid, request_data) {
		
		return __APP.SERVER.getData(OneEventNetworkingRequest.requestPath(event_id, uuid), request_data);
	}
	
	/**
	 * @param {object} [data]
	 * @param {number} [data.event_id]
	 * @param {number} [data.user_id]
	 * @param {number} [data.recipient_user_id]
	 * @param {string} [data.message]
	 *
	 * @return {Promise}
	 */
	create(data) {
		if (!isVoid(data)) {
			this.setData({...data, recipient_user_id: data.user_id || data.recipient_user_id});
		}
		
		return OneEventNetworkingRequest.createRequest(this.event_id, this.recipient_user_id, this.message).then(uuid => {
			this.uuid = uuid instanceof Array ? uuid[0].uuid : uuid;
			
			return this;
		});
	}
	
	revokeRequest() {
		
		return OneEventNetworkingRequest.updateRequest(this.event_id, this.uuid, {status: false}).then(data => {
			this.status = false;
			
			return data;
		});
	}
	
	cancelRequest() {
		
		return OneEventNetworkingRequest.updateRequest(this.event_id, this.uuid, {accept_status: false}).then(data => {
			this.accept_status = false;
			
			return data;
		});
	}
	
	acceptRequest() {
		
		return OneEventNetworkingRequest.updateRequest(this.event_id, this.uuid, {accept_status: true}).then(data => {
			this.accept_status = true;
			
			return data;
		});
	}
	
	fetch(fields) {
	
		return OneEventNetworkingRequest.fetchRequest(this.event_id, this.uuid, {fields}).then(data => {
			this.setData(data);
			
			return data;
		});
	}
}

OneEventNetworkingRequest.requestPath = (event_id, uuid) => `/api/v1/events/${event_id}/networking/requests/${uuid}`;
OneEventNetworkingRequest.requestsPath = event_id => `/api/v1/events/${event_id}/networking/requests/`;