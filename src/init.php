<?php
/**
 * Blocks Initializer
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @since   1.0.0
 * @package CGB
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue Gutenberg block assets for both frontend + backend.
 *
 * @uses {wp-editor} for WP editor styles.
 * @since 1.0.0
 */
function post_cgb_block_assets() { // phpcs:ignore
	// Styles.
	wp_enqueue_style(
		'post-cgb-style-css', // Handle.
		plugins_url( 'dist/blocks.style.build.css', dirname( __FILE__ ) ), // Block style CSS.
		array( 'wp-editor' ) // Dependency to include the CSS after it.
		// filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.style.build.css' ) // Version: File modification time.
	);

	register_block_type(
    	'cgb/block-post',  // Block name with namespace
    	[
    		'editor_script' => '/dist/blocks.build.js',
    		'render_callback' => 'block_dynamic_render_cb', // The render callback
    	]
    );
}

// Hook: Frontend assets.
add_action( 'enqueue_block_assets', 'post_cgb_block_assets' );

/**
 * Enqueue Gutenberg block assets for backend editor.
 *
 * @uses {wp-blocks} for block type registration & related functions.
 * @uses {wp-element} for WP Element abstraction — structure of blocks.
 * @uses {wp-i18n} to internationalize the block's text.
 * @uses {wp-editor} for WP editor styles.
 * @since 1.0.0
 */
function post_cgb_editor_assets() { // phpcs:ignore
	// Scripts.
	wp_enqueue_script(
		'post-cgb-block-js', // Handle.
		plugins_url( '/dist/blocks.build.js', dirname( __FILE__ ) ), // Block.build.js: We register the block here. Built with Webpack.
		array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor' ), // Dependencies, defined above.
		// filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.build.js' ), // Version: File modification time.
		true // Enqueue the script in the footer.
	);

	// Styles.
	wp_enqueue_style(
		'post-cgb-block-editor-css', // Handle.
		plugins_url( 'dist/blocks.editor.build.css', dirname( __FILE__ ) ), // Block editor CSS.
		array( 'wp-edit-blocks' ) // Dependency to include the CSS after it.
		// filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.editor.build.css' ) // Version: File modification time.
	);
}

// Hook: Editor assets.
add_action( 'enqueue_block_editor_assets', 'post_cgb_editor_assets' );



function block_dynamic_render_cb ( $att ) {
	$my_post = get_post($att['id']);
	$category = get_the_category($my_post->ID)[0];
    ob_start();
    ?>
    <div class="linked-post">
        <div class="linked-post__header">Leia Tamb&eacute;m</div>
        <a href="<?php the_permalink($att['id']); ?>" target="_blank">
            <div class="linked-post__thumbnail"
                 style="
                     background-image: url(<?php echo get_the_post_thumbnail_url($att['id'], 'medium' ); ?>);
                     background-position: <?php echo $att['imagePositionX'] . '% ' . $att['imagePositionY'] . '%';?>;
                     ">
            </div>
        </a>
        <div class="linked-post__info">
            <p class="linked-post__info__category">
                <a href="<?php echo esc_url( get_category_link( $category->term_id ) ); ?>">
                    <?php echo $category->name;?>
                </a>
            </p>
            <p class="linked-post__info__date">
                <?php echo get_post_time( get_option( 'date_format' ), false, $my_post, true ); ?>
            </p>
            <p class="linked-post__info__title">
                <a href="<?php the_permalink($att['id']); ?>">
                    <?php echo trim_characters( $my_post->post_title, 120, '...'); ?>
                </a>
            </p>
            <p class="linked-post__info__excerpt"><?php echo trim_characters( $my_post->post_content, 155, ' ...'); ?></p>
        </div>
    </div>
    <?php
    return ob_get_clean();
}


function accordion_block_assets() { // phpcs:ignore
	// Styles.
	wp_enqueue_style(
		'accordion-style-css', // Handle.
		plugins_url( 'dist/blocks.style.build.css', dirname( __FILE__ ) ), // Block style CSS.
		array( 'wp-editor' ) // Dependency to include the CSS after it.
		// filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.style.build.css' ) // Version: File modification time.
	);
}

// Hook: Frontend assets.
add_action( 'enqueue_block_assets', 'accordion_block_assets' );

/**
 * Enqueue Gutenberg block assets for backend editor.
 *
 * @uses {wp-blocks} for block type registration & related functions.
 * @uses {wp-element} for WP Element abstraction — structure of blocks.
 * @uses {wp-i18n} to internationalize the block's text.
 * @uses {wp-editor} for WP editor styles.
 * @since 1.0.0
 */
function accordion_editor_assets() { // phpcs:ignore
	// Scripts.
	wp_enqueue_script(
		'accordion-block-js', // Handle.
		plugins_url( '/dist/blocks.build.js', dirname( __FILE__ ) ), // Block.build.js: We register the block here. Built with Webpack.
		array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor' ), // Dependencies, defined above.
		// filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.build.js' ), // Version: File modification time.
		true // Enqueue the script in the footer.
	);

	// Styles.
	wp_enqueue_style(
		'accordion-block-editor-css', // Handle.
		plugins_url( 'dist/blocks.editor.build.css', dirname( __FILE__ ) ), // Block editor CSS.
		array( 'wp-edit-blocks' ) // Dependency to include the CSS after it.
		// filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.editor.build.css' ) // Version: File modification time.
	);
}

// Hook: Editor assets.
add_action( 'enqueue_block_editor_assets', 'accordion_editor_assets' );

function trim_characters( $text, $length = 160, $append = '&hellip;' ) {

    $length = (int) $length;
    $text = trim( strip_tags( $text ) );

    if ( strlen( $text ) > $length ) {
        $text = substr( $text, 0, $length + 1 );
        $words = preg_split( "/[\s]|&nbsp;/", $text, -1, PREG_SPLIT_NO_EMPTY );
        preg_match( "/[\s]|&nbsp;/", $text, $lastchar, 0, $length );
        if ( empty( $lastchar ) )
            array_pop( $words );

        $text = implode( ' ', $words ) . $append;
    }

    return $text;
}
