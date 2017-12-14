/**
 * @requires ../asyncPage.js
 */

const EventNetworkingMyProfilePage = asyncPage({
	constructPage({event_id}) {
		const {myProfile} = this.props;
		
		return {
			my_profile: isVoid(myProfile) ? new MyEventNetworkingProfile(event_id) : myProfile,
			is_fetched: !isVoid(myProfile)
		};
	},
	
	fetchData() {
		if (this.props.is_fetched) {
			
			return Promise.resolve();
		}
		
		return this.props.my_profile.fetch();
	},
	
	pageTitle: 'Мой профиль',
	
	headerTabs() {
		
		return [
			{title: 'Участники', page: `/event/${this.props.event_id}/networking/participants`},
			{title: 'Заявки', page: `/event/${this.props.event_id}/networking/requests`},
			{title: 'Контакты', page: `/event/${this.props.event_id}/networking/contacts`},
			{title: 'Мой профиль', page: `/event/${this.props.event_id}/networking/profile`},
		];
	}
}, class EventNetworkingMyProfilePage extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			redirect_to: null
		};
		
		this.saveHandler = this.saveHandler.bind(this);
	}
	
	saveHandler() {
		this.props.my_profile.update({
			first_name: this.refs.first_name.value,
			last_name: this.refs.last_name.value,
			info: this.refs.info.value,
			looking_for: this.refs.looking_for.value,
			vk_url: this.refs.vk_url.value,
			facebook_url: this.refs.facebook_url.value,
			twitter_url: this.refs.twitter_url.value,
			linkedin_url: this.refs.linkedin_url.value,
			telegram_url: this.refs.telegram_url.value,
			instagram_url: this.refs.instagram_url.value,
			github_url: this.refs.github_url.value,
		}).then(data => {
			this.props.my_profile.signed_up = true;
			this.setState({
				redirect_to: this.props.match.url.replace('profile', 'participants')
			});
			
			return data;
		});
	}
	
	render() {
		const {my_profile} = this.props,
			{Redirect} = ReactRouter,
			{
				vk_url,
				facebook_url,
				twitter_url,
				linkedin_url,
				telegram_url,
				instagram_url,
				github_url,
			} = my_profile,
			links = {
				vk_url,
				facebook_url,
				twitter_url,
				linkedin_url,
				telegram_url,
				instagram_url,
				github_url,
			},
			labels = {
				vk_url: 'VK',
				facebook_url: 'Facebook',
				twitter_url: 'Twitter',
				linkedin_url: 'LinkedIn',
				telegram_url: 'Telegram',
				instagram_url: 'Instagram',
				github_url: 'Github',
			};
		
		if (!isVoid(this.state.redirect_to)) {
			
			return <Redirect to={this.state.redirect_to}/>
		}
		
		return contentWrap(
			<div className="event_networking_page material -level_2_material">
				<header className="event_networking_my_profile_header">
					<h2 className="event_networking_my_profile_title">Редактирование профиля</h2>
				</header>
				<div className="event_networking_my_profile_body">
					<h4>Имя</h4>
					<div className="form_group -parts_e_2">
						<div className="form_unit ">
							<input
								className="form_input"
								name="last_name"
								required
								placeholder="Фамилия"
								type="text"
								autoComplete="off"
								defaultValue={my_profile.last_name}
								ref="last_name"
							/>
						</div>
						<div className="form_unit ">
							<input
								className="form_input"
								name="first_name"
								required
								placeholder="Имя"
								type="text"
								autoComplete="off"
								defaultValue={my_profile.first_name}
								ref="first_name"
							/>
						</div>
					</div>
					<p>Вводите только настоящие фамилию и имя</p>
					
					<h4>Информация о себе</h4>
					<p>Например: Дизайн интерфейсов, разработка мобильных приложений</p>
					<div className="form_unit">
						<textarea
							className="form_textarea"
							name="info"
							placeholder="Несколько слов о себе (необязательно)"
							ref="info"
							defaultValue={my_profile.info}
						/>
					</div>
					
					<h4>Ищу</h4>
					<p>Напишите в поисках чего вы находитесь на этом событии. Это поможет другим участникам найти с Вами контакт.</p>
					<div className="form_unit">
						<textarea
							className="form_textarea"
							name="looking_for"
							placeholder="Несколько слов о том что вы ищете (необязательно)"
							ref="looking_for"
							defaultValue={my_profile.looking_for}
						/>
					</div>
					
					<h4>Ссылки</h4>
					{Object.keys(links).map(type => (
						<div key={type} className="form_unit -inline">
							<label className="form_label" htmlFor={`event_networking_my_profile_${type}`}>{labels[type]}</label>
							<input
								id={`event_networking_my_profile_${type}`}
								className="form_input"
								name={type}
								placeholder="Ссылка"
								type="text"
								autoComplete="off"
								defaultValue={links[type]}
								ref={type}
							/>
						</div>
					))}
					
					<div className="form_unit -align_center">
						<RippleButton
							className={new HtmlClassesArray([
								__C.CLASSES.COLORS.ACCENT,
								__C.CLASSES.SIZES.HUGE
							])}
							onClick={this.saveHandler}
						>
							Сохранить
						</RippleButton>
					</div>
				</div>
				
			</div>
		);
	}
});