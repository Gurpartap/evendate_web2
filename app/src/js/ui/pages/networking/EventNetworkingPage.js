/**
 * @requires ../asyncPage.js
 */
const EventNetworkingPage = asyncPage({
	constructPage({event_id}) {
		const parsed_uri = parseUri(window.location);
		
		return {
			my_profile: new MyEventNetworkingProfile(event_id),
			code: parsed_uri.queryKey['code'],
			my_profile_fields: new Fields()
		};
	},
	
	fetchData() {
		const {my_profile, my_profile_fields, code} = this.props;
		
		if (!isVoid(code)) {
			
			return my_profile.redeemAccess(code, my_profile_fields);
		}
		
		return my_profile.checkAccess(my_profile_fields).catch(reason => {
		
			debugger;
		});
	},
	
	is_auth_required: true
}, class EventNetworkingPage extends React.Component {
	
	render() {
		const {Switch, Route, Redirect} = ReactRouter;
	
		if (this.props.my_profile.signed_up === false && window.location.pathname !== `${this.props.match.url}/profile`) {
			
			return <Redirect to={`${this.props.match.url}/profile`}/>
		}
		
		return (
			<Switch>
				<Route exact path="/event/:event_id/networking/participants" component={EventNetworkingParticipantsPage} />
				<Route exact path="/event/:event_id/networking/requests" component={EventNetworkingRequestsPage} />
				<Route exact path="/event/:event_id/networking/contacts" component={EventNetworkingContactsPage} />
				<Route exact path="/event/:event_id/networking/profile" component={props => <EventNetworkingMyProfilePage {...props} myProfile={this.props.my_profile} />} />
				<Redirect strict from="/event/:event_id/networking" to={`${this.props.match.url}/participants`}/>
			</Switch>
		);
	}
});

EventNetworkingPage.NetworkingProfileUnit = ({profile, children}) => (
	<div className="networking_profile_block">
		<aside className="networking_profile_block_avatar" onClick={e => {
			(new NetworkingProfileAppInspector(profile)).show()
		}}>
			<Avatar entity={profile.user} className={new HtmlClassesArray(__C.CLASSES.UNIVERSAL_STATES.ROUNDED, __C.CLASSES.SIZES.X55)} />
		</aside>
		<div className="networking_profile_block_main">
			<header className="networking_profile_block_header" onClick={e => {
				(new NetworkingProfileAppInspector(profile)).show()
			}}>
				<h4 className="networking_profile_block_title">{profile.user.full_name}</h4>
				{profile.company_name && <span className="networking_profile_block_org">{profile.company_name}</span>}
			</header>
			<div className="networking_profile_block_body">
				{children}
			</div>
		</div>
	</div>
);