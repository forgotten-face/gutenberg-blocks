<?php
 register_block_type('cgb/block-post', array(
            'render_callback' => 'hi_roy_render_callback',
            'attributes' => array(
                'post' => array(
                    'type' => 'integer'
                )
            )
        )
    );
    function hi_roy_render_callback( $attributes ){
        $post = $attributes[ 'id' ];
        return '<div class="sldfjsdljf">' . $post . '/div>';

        ob_start();
        ?>
        <div className="linked-post">
        				<div className="linked-post__thumbnail" style={ { backgroundImage: 'url(' + this.state.post.featured_image_urls.square[ 0 ] + ')' } }></div>
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
        			<?php
        			return ob_get_clean();
    }
