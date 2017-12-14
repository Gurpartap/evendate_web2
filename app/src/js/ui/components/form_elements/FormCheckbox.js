class FormCheckbox extends React.Component {
	
	render() {
		const {
			id = guid(),
			label,
			name,
			value,
			inputRef,
			...rest_props
		} = this.props;
		
		return (
			<div className="form_unit form_checkbox_wrapper">
				<input
					id={id}
					className="form_checkbox"
					type="checkbox"
					name={name}
					tabIndex="-1"
					ref={inputRef}
					{...(typeof value === 'undefined' ? {value: value} : {})}
					{...rest_props}
				/>
				{label && (
					<label className="form_label" htmlFor={id}>
						<span>{label}</span>
					</label>
				)}
			</div>
		);
	}
}