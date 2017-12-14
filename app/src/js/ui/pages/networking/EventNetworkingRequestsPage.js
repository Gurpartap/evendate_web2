/**
 * @requires ../asyncPage.js
 */
const EventNetworkingRequestsPage = asyncPage({
	constructPage({event_id}) {
		
		return {
			pending_requests_profiles: new EventNetworkingPendingRequestProfilesCollection(event_id),
			accepted_requests_profiles: new EventNetworkingAcceptedRequestProfilesCollection(event_id),
			rejected_requests_profiles: new EventNetworkingRejectedRequestProfilesCollection(event_id),
			requests_profiles_fields: new Fields('request')
		}
	},
	
	fetchData() {
		
		return Promise.all([
			this.props.pending_requests_profiles.fetch(this.props.requests_profiles_fields),
			this.props.accepted_requests_profiles.fetch(this.props.requests_profiles_fields),
			this.props.rejected_requests_profiles.fetch(this.props.requests_profiles_fields),
		]);
	},
	
	pageTitle: 'Аудитория события',
	
	headerTabs() {
		
		return [
			{title: 'Участники', page: `/event/${this.props.event_id}/networking/participants`},
			{title: 'Заявки', page: `/event/${this.props.event_id}/networking/requests`},
			{title: 'Контакты', page: `/event/${this.props.event_id}/networking/contacts`},
			{title: 'Мой профиль', page: `/event/${this.props.event_id}/networking/profile`},
		];
	}
}, class EventNetworkingRequestsPage extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			pending: props.pending_requests_profiles.length,
			accepted: props.accepted_requests_profiles.length,
			rejected: props.rejected_requests_profiles.length,
		};
	}
	
	render() {
		const {
				pending_requests_profiles,
				accepted_requests_profiles,
				rejected_requests_profiles,
			} = this.props,
			{NetworkingProfileUnit} = EventNetworkingPage;
		
		return contentWrap(
			<div className="event_networking_page material -level_2_material">
				<header className="event_networking_header  -hidden">
					<input className="event_networking_search form_input -rounded" placeholder="Поиск участников" />
				</header>
				<div className="event_networking_body">
					{
						!![
							...pending_requests_profiles,
							...accepted_requests_profiles,
							...rejected_requests_profiles,
						].length || <Cap>Вам пока еще не поступило ни одной заявки</Cap>
					}
					{pending_requests_profiles.map(profile => (
						<NetworkingProfileUnit key={profile.user_id} profile={profile}>
							{profile.info && <p><b>Полезен:</b> {profile.info}</p>}
							{profile.looking_for && <p><b>Ищет:</b> {profile.looking_for}</p>}
							{profile.request.message && <p className="networking_profile_block_comment fa_icon fa-commenting">{profile.request.message}</p>}
							<div className="form_group -align_left">
								<div className="form_unit">
									<RippleButton
										className={__C.CLASSES.COLORS.ACCENT}
										onClick={e => {
											profile.request.acceptRequest().then(data => {
												accepted_requests_profiles.push(pending_requests_profiles.pull(profile.user_id));
												this.setState({
													pending: pending_requests_profiles.length,
													accepted: accepted_requests_profiles.length,
												});
												
												return data;
											});
										}}
									>
										Принять заявку
									</RippleButton>
								</div>
								<div className="form_unit -valign_center">
									<Action
										className={__C.CLASSES.COLORS.MARGINAL}
										onClick={e => {
											profile.request.cancelRequest().then(data => {
												rejected_requests_profiles.push(pending_requests_profiles.pull(profile.user_id));
												this.setState({
													pending: pending_requests_profiles.length,
													rejected: rejected_requests_profiles.length,
												});
												
												return data;
											});
										}}
									>
										Скрыть
									</Action>
								</div>
							</div>
						</NetworkingProfileUnit>
					))}
					{accepted_requests_profiles.map(profile => (
						<NetworkingProfileUnit key={profile.user_id} profile={profile}>
							{profile.info && <p><b>Полезен:</b> {profile.info}</p>}
							{profile.looking_for && <p><b>Ищет:</b> {profile.looking_for}</p>}
							{profile.request.message && <p className="networking_profile_block_comment fa_icon fa-commenting">{profile.request.message}</p>}
							<RippleButton
								className={new HtmlClassesArray([
									__C.CLASSES.COLORS.MARGINAL,
									__C.CLASSES.ICON_CLASS,
									__C.CLASSES.ICONS.CHECK
								])}
								disabled
							>
								Принята
							</RippleButton>
						</NetworkingProfileUnit>
					))}
					{rejected_requests_profiles.map(profile => (
						<NetworkingProfileUnit key={profile.user_id} profile={profile}>
							{profile.info && <p><b>Полезен:</b> {profile.info}</p>}
							{profile.looking_for && <p><b>Ищет:</b> {profile.looking_for}</p>}
							{profile.request.message && <p className="networking_profile_block_comment fa_icon fa-commenting">{profile.request.message}</p>}
							<RippleButton
								className={new HtmlClassesArray([
									__C.CLASSES.COLORS.MARGINAL,
									__C.CLASSES.ICON_CLASS,
									__C.CLASSES.ICONS.TIMES
								])}
								disabled
							>
								Отклонена
							</RippleButton>
						</NetworkingProfileUnit>
					))}
				</div>
			</div>
		);
	}
});