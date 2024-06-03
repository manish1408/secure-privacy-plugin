<?php
/**
 * Plugin Name: Secure Privacy
 * Plugin URI: https://secureprivacy.ai/technology/wordpress
 * Description: Make your WordPress website cookie compliant with GDPR, CCPA, LGPD, EU Cookie Law requirements with our remarkably powerful WordPress cookie consent plugin.
 * Version: 2.0
 * Author: Secure Privacy
 * Author URI: https://secureprivacy.ai/
 * Text Domain: secure-privacy-plugin
 * Domain Path: /lang
 * License: GPLv2 or later
 */

/*
Secure Privacy
Copyright (C) 2013 - 2020,

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License, version 2, as
published by the Free Software Foundation.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/


define('SECUREPRIVACY_PLUGIN_DIR',str_replace('\\','/',dirname(__FILE__)));



if ( !class_exists( 'SecurePrivacyPlugin' ) ) {

	class SecurePrivacyPlugin {

		function __construct() {
			// add_action( 'admin_init', 'style-css');
			// add_action( 'admin_init', 'bootstrap-js' );
			// add_action( 'admin_init', 'jquery');
			// add_action( 'admin_init', 'signin-js' );
			add_action( 'init', array( &$this, 'init' ) );
			add_action( 'admin_init', array( &$this, 'admin_init' ) );
			add_action( 'admin_menu', array( &$this, 'admin_menu' ) );
			add_action( 'wp_head', array( &$this, 'wp_head' ), -99999999999999999999999999999 );
		


		}

		function init() {

			load_plugin_textdomain( 'secure-privacy-plugin', false, dirname( plugin_basename ( __FILE__ ) ).'/lang' );
		}

		function admin_init() {
			
			
		
			// register settings for sitewide script
			register_setting( 'secure-privacy-plugin', 'secureprivacy_insert_auth_token', 'trim' );
			register_setting( 'secure-privacy-plugin', 'secureprivacy_insert_refresh_token', 'trim' );
			register_setting( 'secure-privacy-plugin', 'secureprivacy_insert_header', 'trim' );
			
			register_setting( 'secure-privacy-plugin', 'secureprivacy_insert_footer', 'trim' );
			register_setting( 'secure-privacy-plugin', 'secureprivacy_header_priority', 'intval' );

			// add meta box to all post types
			foreach ( get_post_types( '', 'names' ) as $type ) {
				add_meta_box('secureprivacy_all_post_meta', esc_html__('Insert Script to &lt;head&gt;', 'secure-privacy-plugin'), 'secureprivacy_meta_setup', $type, 'normal', 'high');
			}
			
			wp_register_style('bootstrap-css', plugins_url('/assets/css/bootstrap.min.css',__FILE__ ));
            wp_enqueue_style('bootstrap-css');

			wp_register_style('style-css', plugins_url('/assets/css/styles.css',__FILE__ ));
            wp_enqueue_style('style-css');
			wp_register_script('bootstrap-js', plugins_url('/assets/js/bootstrap.min.js',__FILE__ ));
            wp_enqueue_script('bootstrap-js');
			
			wp_register_script('jquery', plugins_url('/assets/js/jquery-3.7.1.min.js',__FILE__ ));
            wp_enqueue_script('jquery');
			
 
			wp_register_script('signin-js', plugins_url('/assets/js/signin.js',__FILE__ ));
            wp_enqueue_script('signin-js');



			add_action('save_post','secureprivacy_post_meta_save');
		}

		// adds menu item to wordpress admin dashboard
		function admin_menu() {
			$page = add_submenu_page( 'options-general.php', esc_html__('Secure Privacy', 'secure-privacy-plugin'), esc_html__('Secure Privacy', 'secure-privacy-plugin'), 'manage_options', __FILE__, array( &$this, 'secureprivacy_options_panel' ) );
			}

		function wp_head() {
			$meta = get_option( 'secureprivacy_insert_header', '' );
			if ( $meta != '' ) {
				echo $meta, "\n";
			}

			$secureprivacy_post_meta = get_post_meta( get_the_ID(), '_inpost_head_script' , TRUE );
			if ( is_singular() && $secureprivacy_post_meta != '' ) {
				echo $secureprivacy_post_meta['synth_header_script'], "\n";
			}

		}

		function wp_footer() {
			if ( !is_admin() && !is_feed() && !is_robots() && !is_trackback() ) {
				$text = get_option( 'secureprivacy_insert_footer', '' );
				$text = convert_smilies( $text );
				$text = do_shortcode( $text );

				if ( $text != '' ) {
					echo $text, "\n";
				}
			}
		}

		function secureprivacy_options_panel() {
				// Load options page
				require_once(SECUREPRIVACY_PLUGIN_DIR . '/inc/options.php');
		}
		
	}

	function secureprivacy_meta_setup() {
		global $post;

		// using an underscore, prevents the meta variable
		// from showing up in the custom fields section
		$meta = get_post_meta($post->ID,'_inpost_head_script',TRUE);

		// instead of writing HTML here, lets do an include
		include_once(SECUREPRIVACY_PLUGIN_DIR . '/inc/meta.php');

		// create a custom nonce for submit verification later
		echo '<input type="hidden" name="secureprivacy_post_meta_noncename" value="' . wp_create_nonce(__FILE__) . '" />';
	}

	function secureprivacy_post_meta_save($post_id) {
		// authentication checks

		// make sure data came from our meta box
		if ( ! isset( $_POST['secureprivacy_post_meta_noncename'] )
			|| !wp_verify_nonce($_POST['secureprivacy_post_meta_noncename'],__FILE__)) return $post_id;

		// check user permissions
		if ( $_POST['post_type'] == 'page' ) {

			if (!current_user_can('edit_page', $post_id))
				return $post_id;

		} else {

			if (!current_user_can('edit_post', $post_id))
				return $post_id;

		}

		$current_data = get_post_meta($post_id, '_inpost_head_script', TRUE);

		$new_data = $_POST['_inpost_head_script'];

		secureprivacy_post_meta_clean($new_data);

		if ($current_data) {

			if (is_null($new_data)) delete_post_meta($post_id,'_inpost_head_script');

			else update_post_meta($post_id,'_inpost_head_script',$new_data);

		} elseif (!is_null($new_data)) {

			add_post_meta($post_id,'_inpost_head_script',$new_data,TRUE);

		}

		return $post_id;
	}

	function secureprivacy_post_meta_clean(&$arr) {

		if (is_array($arr)) {

			foreach ($arr as $i => $v) {

				if (is_array($arr[$i])) {
					secureprivacy_post_meta_clean($arr[$i]);

					if (!count($arr[$i])) {
						unset($arr[$i]);
					}

				} else {

					if (trim($arr[$i]) == '') {
						unset($arr[$i]);
					}
				}
			}

			if (!count($arr)) {
				$arr = NULL;
			}
		}
	}

	$shfs_header_and_footer_scripts = new SecurePrivacyPlugin();
}
