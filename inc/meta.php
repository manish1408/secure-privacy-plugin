<?php
/**
 * Plugin meta for single post or page type.
 *
 * @package    Secure Privacy
 * @author     Development Team at Secure Privacy <contact@secureprivacy.ai>
 * @copyright  Copyright (c) 2013 - 2020, Development Team at Secure Privacy
 * @link       https://secureprivacy.ai/technology/wordpress
 * @license    http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 */?>
 <div class="shfs_meta_control">

	<p><?php esc_html_e('The script in the following textbox will be inserted to the &lt;head&gt; section', 'secure-privacy-plugin'); ?>.</p>
	<p>
		<textarea name="_inpost_head_script[synth_header_script]" rows="5" style="width:98%;font-family:monospace;"><?php if(!empty($meta['synth_header_script'])) echo $meta['synth_header_script']; ?></textarea>
	</p>
</div>
