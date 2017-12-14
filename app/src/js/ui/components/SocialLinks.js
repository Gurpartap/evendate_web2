/**
 *
 * @param {buildProps} props
 * @param {Object<OneUser.ACCOUNTS, string>} props.links
 * @constructor
 */
function SocialLinks({
	links = {},
	className,
	...rest_props
}) {
	const ICON_SLUGS = {
		VK: 'vk',
		GOOGLE: 'google-plus',
		FACEBOOK: 'facebook-official'
	};
	
	return (
		<div className="social_link_wrapper">
			{Object.keys(OneUser.ACCOUNTS).map(account_type => {
				const parent_classes = `social_link -color_${OneUser.ACCOUNTS[account_type]} -valign_center ${new HtmlClassesArray(className)}`,
					icon_classes = `fa_icon fa-${ICON_SLUGS[account_type]}`;
				
				if (links.hasOwnProperty(OneUser.ACCOUNTS[account_type])) {
				
					return (
						<a key={account_type} className={parent_classes} href={links[OneUser.ACCOUNTS[account_type]]} target="_blank" {...rest_props} >
							<i className={icon_classes} />
						</a>
					);
				} else {
					
					return (
						<span key={account_type} className={parent_classes} {...rest_props} >
							<i className={icon_classes} />
						</span>
					);
				}
			})}
		</div>
	);
}