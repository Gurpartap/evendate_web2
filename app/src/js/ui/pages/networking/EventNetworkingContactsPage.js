/**
 * @requires ../asyncPage.js
 */
const EventNetworkingContactsPage = asyncPage({
	constructPage({event_id}) {
		
		return {
			my_contacts_profiles: new EventNetworkingContactsProfilesCollection(event_id),
			my_contacts_profiles_fields: new Fields()
		}
	},
	
	fetchData() {
		
		return this.props.my_contacts_profiles.fetch(this.props.my_contacts_profiles_fields);
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
}, class EventNetworkingContactsPage extends React.Component {
	
	render() {
		const {my_contacts_profiles} = this.props;
		
		return contentWrap(
			<div className="event_networking_page material -level_2_material">
				<header className="event_networking_header -hidden">
					<input className="event_networking_search form_input -rounded" placeholder="Поиск участников" />
				</header>
				<div className="event_networking_body">
					{my_contacts_profiles.length ?
						 my_contacts_profiles.map(profile => (
							 <EventNetworkingPage.NetworkingProfileUnit key={profile.user_id} profile={profile} >
								 {profile.info && <p><b>Полезен:</b> {profile.info}</p>}
							 </EventNetworkingPage.NetworkingProfileUnit>
						 )) :
						 <Cap>У вас пока нет контактов</Cap>
					}
				</div>
			</div>
		);
	}
});