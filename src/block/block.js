import apiFetch from '@wordpress/api-fetch';

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
			apiFetch( { path: '/wp-json/wp/v2/posts' } ).then( ( posts ) => {
				if ( posts && 0 !== this.state.selectedPost ) {
					const post = posts.find( ( item ) => { return item.id === this.state.selectedPost; } );
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

		this.setState( { selectedPost: parseInt( post.id ), post } );
		const date = new Date( post.date );
		const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
		const formattedDate = date.toLocaleString( 'pt-PT', dateOptions ).replace( /de /g, '' );

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

registerBlockType( 'comparamais/block-post', {
	title: __( 'Internal Post link - Comparamais' ),
	icon: 'shield',
	category: 'common',
	keywords: [
		__( 'Internal Post link' ),
		__( 'Internal Post link' ),
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
