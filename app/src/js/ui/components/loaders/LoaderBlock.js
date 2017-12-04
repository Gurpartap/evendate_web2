function LoaderBlock({
	className,
	...rest_props
}) {
	
	return (
		<div className={`loader_block ${new HtmlClassesArray(className)}`} {...rest_props}>
			<div className="loader">
				<div className="loader_dot" />
				<div className="loader_dot" />
			</div>
		</div>
	);
}