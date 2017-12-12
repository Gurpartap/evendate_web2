function Cap({
	className,
	children,
	...rest_props
}) {
	
	return (
		<div className={`cap ${new HtmlClassesArray(className)}`} {...rest_props}>
			<span className="cap_message">{children}</span>
		</div>
	);
}