/**
 * @requires ../../entities/networking_profile/OneEventNetworkingProfile.js
 */
class CreateNetworkingRequestModal extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			with_message: false,
			fade_in: true
		};
		this.inputs = [];
		this.modal = null;
		this.modal_wrapper = $('.ModalsWrapper').get(0);
		
		this.handleClickOutside = this.handleClickOutside.bind(this);
	}
	
	componentWillMount() {
		$('body').addClass('-open_modal');
	}
	
	componentDidMount() {
		this.bindClickOutside();
		this.setState({
			fade_in: false
		});
	}
	
	componentWillUnmount() {
		this.unbindClickOutside();
		$('body').removeClass('-open_modal');
	}
	
	bindClickOutside() {
		if (!this.props.canHide) {
			document.addEventListener('mousedown', this.handleClickOutside);
		}
	}
	
	unbindClickOutside() {
		if (!this.props.canHide) {
			document.removeEventListener('mousedown', this.handleClickOutside);
		}
	}
	
	handleClickOutside(event) {
		if (this.modal && !this.modal.contains(event.target)) {
			this.setState({
				fade_in: false
			}, this.props.hideModalHandler);
		}
	}
	
	render() {
		const {profile} = this.props,
			{with_message} = this.state;
		
		return ReactDOM.createPortal(
			<div
				className={`modal_unit material -floating_material ${this.state.fade_in ? '-faded' : ''}`}
				ref={node => this.modal = node}
				style={{width: 370}}
			>
				<header className="modal_header">
					<span>Отправка заявки</span>
					<RippleButton className="modal_destroy_button CloseModal" onClick={e => {this.props.hideModalHandler()}}>×</RippleButton>
				</header>
				<div className="modal_content">
					<header className="create_networking_request_modal_head">
						<aside className="create_networking_request_modal_head_side">
							<Avatar entity={profile.user} className={new HtmlClassesArray(__C.CLASSES.UNIVERSAL_STATES.ROUNDED, __C.CLASSES.SIZES.X55)} />
						</aside>
						<div className="create_networking_request_modal_head_body">
							<h5 className="create_networking_request_modal_title">{profile.user.full_name}</h5>
							<span className="create_networking_request_modal_subtitle">{profile.company_name}</span>
						</div>
					</header>
					{with_message && (
						<div className="form_unit">
							<textarea
								className="form_textarea"
								name="message"
								placeholder="Введите сообщение (необязательно)"
								ref="message"
							/>
						</div>
					)}
					<div className="form_group -parts_e_2">
						<div className="form_unit">
							{with_message || (
								<Action
									className="fa_icon fa-commenting"
									onClick={e => {
										this.setState({
											with_message: true
										});
									}}
								>
									Прикрепить сообщение
								</Action>
							)}
						</div>
						<div className="form_unit">
							<RippleButton
								className={new HtmlClassesArray(__C.CLASSES.COLORS.ACCENT)}
								onClick={e => {
									profile.request.create({
										event_id: profile.event_id,
										user_id: profile.user_id,
										sender_user_id: __APP.USER.id,
										message: with_message ? this.refs.message.value : null
									}).then(data => {
										this.props.hideModalHandler();
										
										return data;
									});
								}}
							>
								Отправить заявку
							</RippleButton>
						</div>
					</div>
				</div>
			</div>,
			this.modal_wrapper,
		);
	}
}

CreateNetworkingRequestModal.propTypes = {
	profile: PropTypes.instanceOf(OneEventNetworkingProfile),
	canHide: PropTypes.bool,
	hideModalHandler: PropTypes.func
};