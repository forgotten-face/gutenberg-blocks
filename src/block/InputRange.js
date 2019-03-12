const { Component } = wp.element;

class InputRange extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			range: null,
		};
	}

	changeValue( event ) {
		this.setState( { range: event.target.value } );
		this.props.changeRangePosition( event.target.value );
	}

	render() {
		const value = ( this.state.range !== null ? this.state.range : this.props.rangePosition );
		return (
			<div className="components-range-control">
				<input
					className="components-range-control__slider"
					type="range"
					value={ value }
					onChange={ ( event ) => { this.changeValue( event ) } }
					min={ 0 }
					max={ 100 } />
				{ value }
			</div>
		);
	}
}

export default InputRange;
