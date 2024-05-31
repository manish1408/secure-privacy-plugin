<?php
/**
 * Plugin Options page
 *
 * @package    Secure Privacy
 * @author     Development Team at Secure Privacy <contact@secureprivacy.ai>
 * @copyright  Copyright (c) 2013 - 2020, Development Team at Secure Privacy
 * @link       https://secureprivacy.ai/technology/wordpress
 * @license    http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 */?>
<section class="sp_main_section">
<div class="sp_main">
  <div class="sp_main-div">
    <div class="row g-0">
      <div class="col-sm-12 col-md-5 section-1">
        <div class="text-center">
          <img src="<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '/assets/img/sp-logo-white.svg'; ?>" />
          <h1 id="signin-title">Welcome Back!</h1>
          <h1 id="signup-title" style="display:none">Join Us on Privacy-First Journey</h1>
        </div>
        <div class="d-flex justify-content-center align-items-center">
          <img src="<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '/assets/img/section-image.png'; ?>" class="section-image" />
        </div>
      
      </div>
      <div class="col-sm-12 col-md-5 offset-md-1 d-flex flex-column section-2">
        <!-- Sign In -->
        <section id="signin-section">
          <h1>Sign In To <span style="color: #07806d">Secure Privacy</span></h1>


          <form id='sigin-form'>
            <div class="d-flex flex-column">
              <label>Email <span> * </span></label>
              <input
                type="email"
                placeholder="Enter your Email"
                class="input-field mb-3" name="email"
                id="login-email"
     
              />
            </div>
            <div class="d-flex flex-column">
              <label>Password <span> * </span></label>
              <input
                type="password"
                placeholder="Enter your Password"
                class="input-field"  name="password"
                id="login-password"
           
              />
             
            </div>

            <button class="btn btn-sp mb-4" type="submit" id="signin-button" disabled>
            <span id="signin-text">SIGN IN</span>
         
            <div class="spinner-border spinner-border-sm text-white" role="status" id="loader" style="display: none;">
              <span class="visually-hidden">Loading...</span>
            </div>
            </button>
            <p class="text-center">
              Don't have an account?
              <span class="sign-span" id="show-signup">Sign Up Now</span>
            </p>
          </form>
        
        </section>


        <section id="signup-section" style="display:none">
          <h1>Create Account</h1>
        
          <form id='sigup-form'>
            <div class="d-flex justify-content-between gap-2">
              <div class="d-flex flex-column fname w-100">
                <label>First name<span> * </span></label>
                <input
                  type="text"
                  placeholder="First Name"
                  class="input-field mb-3"
                  name="firstName"
                  id="reg-firstName"
                />
              </div>
              <div class="d-flex flex-column w-100">
                <label>Last name<span> * </span></label>
                <input
                  type="text"
                  placeholder="Last Name"
                  class="input-field mb-3"
                  name="lastName"
                  id="reg-lastName"
                />
              </div>
            </div>
            <div class="d-flex flex-column">
              <label>Email <span> * </span></label>
              <input
                type="email"
                placeholder="Enter your Email"
                class="input-field mb-3"
                name="email"
                id="reg-email"
              />
            </div>
            <div class="d-flex flex-column">
              <label>Password <span> * </span></label>
              <input
                type="password"
                placeholder="Enter your Password"
                class="input-field mb-3"
                name="password"
                id="reg-password"
              />
            </div>
            <div class="d-flex flex-column">
              <label>Confirm password <span> * </span></label>
              <input
                type="password"
                placeholder="Confirm your Password"
                class="input-field mb-3"
                name="confirmPassword"
                id="reg-cnfPassword"
              />
              <span id="password-mismatch" style="color: red; display: none;">Password do not match</span>
            </div>
            <div class="d-flex justify-content-between gap-2">
              <div class="d-flex flex-column fname w-100">
                <label>Your position<span> * </span></label>
                <input
                  type="text"
                  placeholder="Your position"
                  class="input-field mb-3"
                  name="position"
                  id="reg-position"
                />
              </div>
              <div class="d-flex flex-column w-100">
                <label>Your company<span> * </span></label>
                <input
                  type="text"
                  placeholder="Your company"
                  class="input-field mb-3"
                  name="company"
                  id="reg-company"
                />
              </div>
            </div>
            
              <div class="d-flex flex-column fname w-100">
                <label>Number of employees<span> * </span></label>
                <select id="reg-employee-select" class="input-field mb-3" style="max-width: 100%;">
              <option value="1-200">1 - 200</option>
              <option value="201-5000">201 - 5000</option>
              <option value=">5000"> >5000</option>
              
              </select>
         
             
            </div>

            <button class="btn btn-sp mb-3" id="signup-button" disabled>

            <span id="signup-text">SIGN UP</span>
         
         <div class="spinner-border spinner-border-sm text-white" role="status" id="loader" style="display: none;">
           <span class="visually-hidden">Loading...</span>
         </div>
            </button>
            <p class="text-center">
              Already have an account?
              <span class="sign-span" id="show-signin">Sign In Now</span>
            </p>
          </form>
        
        </section>
        <!-- Domain -->
        <section id="domain-section" style="display:none">
        <h1>Add Your <span style="color: #07806d">Domain</span></h1>
          <form id="connect-domain-form">
            <div class="d-flex flex-column" >
              <label id="input-label" >Your Website <span> * </span></label>
              <label id="domain-label" style="display:none">Your Domains <span> * </span></label>
              <input
                type="text"
                placeholder="yourwebsite.com"
                class="input-field mb-3"
                id='domain-input' 
                name="domain"
                style="display:none"
                
              />
              <select id="domain-select" class="input-field mb-3" style="max-width: 100%;"></select>
            </div>
            <button class="btn btn-sp mb-3" type="button" id="connect-domain">
              CONNECT DOMAIN
            </button>
          </form>
        </section>
        <section
        class="success-section" id="success-section" style="display:none"
     
      >
        
        <img src="<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '/assets/icon/check-circle.svg'; ?>" style="height: 64px" />
        <h2 class="mt-4">
          Secure Privacy is successfully integrated on your Wordpress Site
        </h2>
        <div class="d-flex justify-content-between w-100 cta">
          <button class="btn btn-deactive">DEACTIVE</button>

          <button class="btn btn-sp">CHANGE SETTINGS</button>
        </div>
      </section>
      
      </div>
    </div>
  </div>
</div>
















<div class="wrap hidden-section">
  <div id="poststuff">
  <div id="post-body" class="metabox-holder columns-2">
    <div id="post-body-content">
      <div class="postbox">
        <div class="inside">
          <form name="dofollow" action="options.php" method="post">

            <?php settings_fields( 'secure-privacy-plugin' ); ?>

            <textarea style="width:98%;font-family:monospace;" rows="2" cols="1" id="insert_header" name="secureprivacy_insert_header"><?php echo esc_html( get_option( 'secureprivacy_insert_header' ) ); ?></textarea>
            <input style="width:98%;font-family:monospace;" type="hidden" value="<?php echo \esc_html( \get_option( 'secureprivacy_header_priority', -99999999999999999999999999999 ) ); ?>" name="secureprivacy_header_priority" id="secureprivacy_header_priority" style="width:6em;" /> 

          <p class="submit">
            <input class="button button-primary" type="submit" name="Submit" id="sp_save-btn" value="<?php esc_html_e( 'Save', 'secure-privacy-plugin'); ?>" />
          </p>

          </form>
        </div>
    </div>
    </div>


    </div>
  </div>
</div>
</section>