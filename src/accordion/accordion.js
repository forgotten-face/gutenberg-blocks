import './style.scss';
import './editor.scss';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const {
	RichText,
} = wp.editor;

registerBlockType( 'comparamais/accordion', {
	title: __( 'Accordion - Comparamais' ),
	icon: 'shield',
	category: 'common',
	keywords: [
		__( 'Accordion - Comparamais' ),
		__( 'Accordion - Comparamais' ),
	],
	attributes: {
		title: {
			type: 'string',
			selector: 'span',
		},
		text: {
			type: 'string',
			selector: 'span',
		},
		blockId: {
			type: 'string',
		},
	},
	edit( { attributes, setAttributes } ) {
		function onTitleChange( title ) {
			const generator = new IDGenerator();
			const blockId = generator.generate();
			console.log(title);
			setAttributes( { blockId: blockId, title: title } );
		}
		function onContentChange( text ) {
			setAttributes( { text: text } );
		}
		return (
			<div className="product-review__info__question">
				<input type="checkbox" id={ 'info-question-trigger-' + attributes.blockId } checked="checked" className="info__question__trigger" />
				<label htmlFor={ 'info-question-trigger-' + attributes.blockId } className="info__question__label">
					<RichText
						tagName="span"
						classNmae="title"
						value={ attributes.title }
						onChange={ ( title ) => onTitleChange( title ) }
						placeholder="Enter Title"
						keepPlaceholderOnFocus={ true }
					/>
					<i className="fas fa-caret-down"></i>
				</label>
				<div className="info__question__response">
					<RichText
						tagName="span"
						classNmae="content"
						value={ attributes.text }
						onChange={ ( text ) => onContentChange( text ) }
						placeholder="Enter text"
					/>
				</div>
			</div>
		);
	},
	save( { attributes } ) {
		return (
			<div className="product-review__info__question">
				<input type="checkbox" id={ 'info-question-trigger-' + attributes.blockId } className="info__question__trigger" />
				<label htmlFor={ 'info-question-trigger-' + attributes.blockId } className="info__question__label">
					<span className="title">{ attributes.title } </span>
					<i className="fas fa-caret-down"></i>
				</label>
				<div className="info__question__response">
					<span className="content" dangerouslySetInnerHTML={ { __html: attributes.text } }> </span>
				</div>
			</div>

		);
	},
} );

function IDGenerator() {
	this.length = 8;
	this.timestamp = +new Date;

	const _getRandomInt = function( min, max ) {
		return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
	};
	this.generate = function() {
		const ts = this.timestamp.toString();
		const parts = ts.split( '' ).reverse();
		let id = '';
		for ( let i = 0; i < this.length; ++i ) {
			const index = _getRandomInt( 0, parts.length - 1 );
			id += parts[ index ];
		}
		return id;
	};
}
