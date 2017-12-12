function Button({
	children,
	className,
	...rest_props
}) {
	
	return (
		<button
			className={`${__C.CLASSES.COMPONENT.BUTTON} ${new HtmlClassesArray(className)}`}
			type="button"
			{...rest_props}
		>
			<span className="Text">{children}</span>
		</button>
	);
}

function RippleButton({
	children,
	className,
	onClick,
	...rest_props
}) {
	
	return (
		<button
			className={`${__C.CLASSES.COMPONENT.BUTTON} ${new HtmlClassesArray(className)}`}
			type="button"
			onClick={e => {
				rippleEffectHandler(e);
				if (isFunction(onClick)) {
					onClick(e);
				}
			}}
			{...rest_props}
		>
			<span className="Text">{children}</span>
		</button>
	);
}

function Action({
	children,
	className,
	...rest_props
}) {
	
	return (
		<button
			className={`${__C.CLASSES.COMPONENT.ACTION} ${new HtmlClassesArray(className)}`}
			type="button"
			{...rest_props}
		>
			<span className="Text">{children}</span>
		</button>
	);
}