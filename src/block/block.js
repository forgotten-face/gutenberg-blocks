/**
 * BLOCK: post
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */
import apiFetch from '@wordpress/api-fetch';
//  Import CSS.
import './style.scss';
import './editor.scss';
import InputRange from './InputRange';
import Autocomplete from './Autocomplete';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks

const { Component } = wp.element;
const {
	InspectorControls,
	RichText,
} = wp.editor;



class mySelectPosts extends Component {
	static getInitialState( selectedPost ) {
		return {
			posts: [],
			selectedPost: selectedPost,
			post: {},
			imagePositionX: '50',
			imagePositionY: '50',
		};
	}

	constructor() {
		super( ...arguments );
		this.state = this.constructor.getInitialState( this.props.attributes.selectedPost );
		this.getOptions = this.getOptions.bind( this );
		this.onChangeSelectPost = this.onChangeSelectPost.bind( this );
		this.moveImageX = this.moveImageX.bind( this );
		this.moveImageY = this.moveImageY.bind( this );
		this.getOptions();
	}

	getOptions() {
		return (
			apiFetch( { path: '/comparamais/wp-json/wp/v2/posts' } ).then( ( posts ) => {
				if ( posts && 0 !== this.state.selectedPost ) {
					// If we have a selected Post, find that post and add it.
					const post = posts.find( ( item ) => { return item.id === this.state.selectedPost; } );
					// This is the same as { post: post, posts: posts }
					this.setState( { post, posts } );
				} else {
					this.setState( { posts } );
				}
			}
			)
		);
	}

	moveImageY( value ) {
		this.setState( { imagePositionY: value } );
		this.props.setAttributes( {
			imagePositionY: this.state.imagePositionY,
		} );
	}

	moveImageX( value ) {
		this.setState( { imagePositionX: value } );
		this.props.setAttributes( {
			imagePositionX: this.state.imagePositionX,
		} );
	}

	onChangeSelectPost( post ) {
		// Find the post
		// Set the state
		this.setState( { selectedPost: parseInt( post.id ), post } );
		const date = new Date( post.date );
		const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
		const formattedDate = date.toLocaleString( 'pt-PT', dateOptions ).replace( /de /g, '' );
		// Set the attributes
		this.props.setAttributes( {
			selectedPost: parseInt( post.id ),
			title: post.title.rendered,
			link: post.link,
			thumbnail: post.featured_image_urls.square[ 0 ],
			date: formattedDate,
			category: post.category_list,
			id: post.id,
			imagePositionX: '50',
			imagePositionY: '50',
		} );
	}

	render() {
		const options = [ { value: 0, label: __( 'Select a Post' ) } ];
		let output = __( 'Loading Posts' );
		if ( this.state.posts.length > 0 ) {
			const loading = __( 'We have %d posts. Choose one.' );
			output = loading.replace( '%d', this.state.posts.length );
			this.state.posts.forEach( ( post ) => {
				options.push( { value: post.id, label: post.title.rendered } );
			} );
		} else {
			output = __( 'No posts found. Please create some first.' );
		}

		if ( this.props.attributes.hasOwnProperty( 'title' ) ) {
			output = <div className="linked-post">
				<div className="linked-post__header">Leia Tamb&eacute;m</div>
				<div className="linked-post__thumbnail" style={ { backgroundImage: 'url(' + this.props.attributes.thumbnail + ')' , backgroundPosition: this.props.attributes.imagePositionX + '% ' + this.props.attributes.imagePositionY + '%' } }></div>
				<div className="linked-post__info">
					<p className="linked-post__info__category" dangerouslySetInnerHTML={ { __html: this.props.attributes.category_list } }></p>
					<p className="linked-post__info__date">
						{ this.props.attributes.date }
					</p>
					<p className="linked-post__info__title">
						<a href={ this.props.attributes.link }>{ this.props.attributes.title }</a>
					</p>
				</div>
			</div>;
			this.props.className += ' has-post';
		} else {
			this.props.className += ' no-post';
		}

		return [
			!! this.props.isSelected && (
				<InspectorControls key="inspector">
					<p>Find Post</p>
					<Autocomplete className="search-post" selectedPost={ this.onChangeSelectPost } currentValue={ this.props.attributes.title } />
					<br />
					<p>Align Post Image Horizontally</p>
					<InputRange changeRangePosition={ this.moveImageX } rangePosition={ this.state.imagePositionX } />
					<br />
					<p>Align Post Image Vertically</p>
					<InputRange changeRangePosition={ this.moveImageY } rangePosition={ this.state.imagePositionY } />
				</InspectorControls>
			),
			<div className={ this.props.className }>{ output }</div>
		];
	}
}
/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'cgb/block-post', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'post - CGB Block' ), // Block title.
	icon: 'shield', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'common', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'post — CGB Block' ),
		__( 'CGB Example' ),
		__( 'create-guten-block' ),
	],
	attributes: {
		title: {
			type: 'string',
		},
		link: {
			type: 'string',
		},
		selectedPost: {
			type: 'number',
			default: 0,
		},
		thumbnail: {
			type: 'string',
		},
		category: {
			type: 'string',
		},
		date: {
			type: 'string',
		},
		id: {
			type: 'number',
		},
		imagePositionX: {
			type: 'string',
		},
		imagePositionY: {
			type: 'string',
		},
	},

	edit: mySelectPosts,
	function( props ) {
		// Creates a <p class='wp-block-cgb-block-post'></p>.
		const date = new Date( this.state.post.date );
		const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
		const formattedDate = date.toLocaleString( 'pt-PT', dateOptions ).replace( /de /g, '' );
		return (
			<div className="linked-post">
				<div className="linked-post__header">Leia Tamb&eacute;m</div>
				<div className="linked-post__thumbnail" style={ { backgroundImage: 'url(' + this.state.post.featured_image_urls.square[ 0 ] + ')', backgroundPosition: props.attributes.imagePositionX + '% ' + props.attributes.imagePositionY + '%' } }></div>
				<div className="linked-post__info">
					<p className="linked-post__info__category" dangerouslySetInnerHTML={ { __html: this.state.post.category_list } }></p>
					<p className="linked-post__info__date">
						{ formattedDate }
					</p>
					<p className="linked-post__info__title">
						<a href={ this.state.post.link }>{ this.state.post.title.rendered }</a>
					</p>
				</div>
			</div>
		);
	},
	save: function( props ) {
		return null;
	},
} );
