/**
 *
 * @param {React.Component} Component
 * @param {object} configs
 * @param {string} configs.entity_name
 * @param {string} configs.entities_name
 * @param {EntitiesCollection} [configs.CollectionClass]
 * @param {function(): XML} [configs.noEntities]
 * @param {function(): {}} [configs.dynamicProps]
 * @param {function(): {}} [configs.renderEntities]
 * @return {React.Component}
 */
function componentsContainer(Component, {
	entity_name,
	entities_name,
	CollectionClass = null,
	noEntities = () => <Cap>{i18n(__S.NO_ELEMENTS)}</Cap>,
	dynamicProps = entity => ({}),
	renderEntities = null
}) {
	class ComponentsContainer extends React.Component {
		static get name() {
			
			return `CollectionOf${Component.name}`;
		}
		
		constructor(props) {
			super(props);
			
			this.state = {
				length: this.props[entities_name].length,
				is_loading: false
			};
		}
		
		fetch() {
			if (!isVoid(CollectionClass) && this.props[entities_name] instanceof CollectionClass) {
				
				this.setLoadingState();
				return this.props[entities_name].fetch(...arguments).then(entities => {
					this.unsetLoadingState().update();
					
					return entities;
				}).catch(() => {
					this.unsetLoadingState();
				});
			}
			
			return Promise.resolve();
		}
		
		update() {
			if (this.props[entities_name].length !== this.state.length) {
				this.setState({
					length: this.props[entities_name].length
				});
			}
			
			return this;
		}
		
		setLoadingState() {
			this.setState({
				is_loading: true
			});
			
			return this;
		}
		
		unsetLoadingState() {
			this.setState({
				is_loading: false
			});
			
			return this;
		}
		
		render() {
			const {
				[entities_name]: entities,
				...rest_props
			} = this.props;
			
			if (!entities.length && !this.state.is_loading) {
				
				return noEntities();
			}
			
			return (
				<React.Fragment>
					{isFunction(renderEntities) ?
					 renderEntities.call(this, entities) :
					 entities.map(entity => <Component key={entity[entity.ID_PROP_NAME]} {...{[entity_name]: entity, ...rest_props, ...dynamicProps(entity)}} />)}
					{this.state.is_loading && <LoaderBlock />}
				</React.Fragment>
			);
		}
	}
	
	ComponentsContainer.displayName = `collectionOf(${Component.displayName || Component.name || 'Component'})`;
	
	return ComponentsContainer;
}