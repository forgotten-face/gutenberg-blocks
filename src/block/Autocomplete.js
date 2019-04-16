import apiFetch from '@wordpress/api-fetch';
const { Component } = wp.element;
const {
	RichText,
} = wp.editor;

class Autocomplete extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			value: null,
			posts: [],
		};

		this.setValue = this.setValue.bind( this );
		this.updateOptions = this.updateOptions.bind( this );
		this.changePostValue = this.changePostValue.bind( this );
	}

	setValue( value ) {
		this.setState( { value } );
		this.updateOptions( value );
	}

	updateOptions( value ) {
		apiFetch( { path: '/wp-json/wp/v2/posts?search=' + value } ).then( ( posts ) => {
			this.setState( { posts } );
		} );
	}

	changePostValue( post, postTitle ) {
		this.setState( { value: postTitle } );
		this.props.selectedPost( post );
	}

	render() {
		const searchValue = ( this.state.value !== null ? this.state.value : this.props.currentValue );
		const autocompleters = [
			{
				name: 'post',
				triggerPrefix: '',
				options: this.state.posts,
				getOptionLabel: option => (
					<button className="search-post__option" onClick={ () => { this.changePostValue( option, option.title.rendered ); } }>
						{ option.title.rendered }
					</button>
				),
				getOptionKeywords: option => [ option.title.rendered ],
				getOptionCompletion: option => (
					<abbr title={ option.title.rendered }>{ option.title.rendered }</abbr>
				),
			}
		];
		return (
			<div>
				<RichText className="search-post__input" value={ searchValue } placeholder="Post Title" onChange={ this.setValue } autocompleters={ autocompleters }>
					{ ( { isExpanded, listBoxId, activeId } ) => (
						<div
							suppressContentEditableWarning
							aria-autocomplete="list"
							aria-expanded={ isExpanded }
							aria-owns={ listBoxId }
							aria-activedescendant={ activeId }
						>
						</div>
					) }
				</RichText>
			</div>
		);
	}
}

export default Autocomplete;
