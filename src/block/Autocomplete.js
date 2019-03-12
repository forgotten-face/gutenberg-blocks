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
		apiFetch( { path: '/comparamais/wp-json/wp/v2/posts?search=' + value } ).then( ( posts ) => {
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
				name: 'fruit',
				// The prefix that triggers this completer
				triggerPrefix: '',
				// The option data
				options: this.state.posts,
				// Returns a label for an option like "🍊 Orange"
				getOptionLabel: option => (
					<button className="search-post__option" onClick={ () => { this.changePostValue( option, option.title.rendered ); } }>
						{ option.title.rendered }
					</button>
				),
				// Declares that options should be matched by their name
				getOptionKeywords: option => [ option.title.rendered ],
				// Declares completions should be inserted as abbreviations
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
