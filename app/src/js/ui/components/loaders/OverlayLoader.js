function OverlayLoader({
	className,
	...rest_props
}) {
	
	return <LoaderBlock className={`${new HtmlClassesArray(className)} -loader_overlay`} {...rest_props} />;
}