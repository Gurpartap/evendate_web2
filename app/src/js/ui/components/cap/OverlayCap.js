function OverlayCap({
	className,
	children,
	...rest_props
}) {
	
	return (
		<div className={`overlay_cap -unselectable -centering OverlayCap ${new HtmlClassesArray(className)}`} {...rest_props}>
			<div className="overlay_cap_wrapper CapWrapper">
				{children}
			</div>
		</div>
	);
}