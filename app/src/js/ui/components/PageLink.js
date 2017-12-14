PageLink.propTypes = {
	href: PropTypes.string.isRequired,
	children: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.node,
		PropTypes.element
	]),
};

function PageLink({
	href,
	children,
	...rest_props
}) {
	
	return (
		<ReactRouterDOM.Link to={href} {...rest_props}>{children}</ReactRouterDOM.Link>
	);
}