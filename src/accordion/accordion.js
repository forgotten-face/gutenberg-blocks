/**
 * BLOCK: Accordion
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */
//  Import CSS.
import './style.scss';
import './editor.scss';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks

const {
	RichText,
} = wp.editor;

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
registerBlockType( 'comparamais/accordion', {
	// Block name. Block names must be string that contains a namespace prefix. Example: my-plugin/my-custom-block.
	title: __( 'Accordion - Comparamais' ), // Block title.
	icon: 'shield', // Block icon from Dashicons → https://developer.wordpress.org/resource/dashicons/.
	category: 'comparamais', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'Accordion - Comparamais' ),
		__( 'Accordion - Comparamais' ),
	],
	attributes: {
		title: {
			type: 'string',
		},
		body: {
			type: 'string',
		},
	},

	edit: function( props ) {
		return (
			<div className="product-review__info__question">
				<input type="checkbox" id="info-question-trigger-1" className="info__question__trigger" />
				<label htmlFor="info-question-trigger-1" className="info__question__label">
					<RichText value={ this.props.attributes.title } />
					<i className="fas fa-caret-down"></i>
				</label>
				<div className="info__question__response">
					<RichText value={ this.props.attributes.body } />
				</div>
			</div>
		);
	},
	save: function( props ) {
		return (
			<div className="product-review__info__question">
				<input type="checkbox" id="info-question-trigger-1" className="info__question__trigger" />
				<label htmlFor="info-question-trigger-1" className="info__question__label">
					{ this.props.attributes.title }
					<i className="fas fa-caret-down"></i>
				</label>
				<div className="info__question__response">
					{ this.props.attributes.body }
				</div>
			</div>
		);
	},
} );