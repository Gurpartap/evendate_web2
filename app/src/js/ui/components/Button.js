class Button extends React.Component {
	
	render() {
		const {
			children,
			className,
			...rest_props
		} = this.props;
		
		let methods = Object.getMethods(rest_props),
			props = Object.getProps(rest_props);
		
		for (let method_name in methods) {
			methods[method_name] = methods[method_name].bind(this);
		}
		
		return (
			<button
				ref={node => this.button = node}
				className={`${__C.CLASSES.COMPONENT.BUTTON} ${new HtmlClassesArray(className)}`}
				type="button"
				{...methods}
				{...props}
			>
				<span className="Text">{children}</span>
			</button>
		);
	}
}