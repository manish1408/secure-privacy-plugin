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
        <div class="d-flex justify-content-center align-items-center">
          <img src="<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '/assets/img/section-image.png'; ?>" class="section-image" />
        </div>
      
      </div>
      <div class="col-sm-12 col-md-5 offset-md-1 d-flex flex-column section-2">
        <!-- Sign In -->
        <section style="display:none" id="signin-section">
          <h1>Sign in to <span style="color: #07806d">Secure Privacy</span></h1>


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
            <p class="text-danger mt-3 mb-0" id='login-err' style='display:hidden;margin-bottom:0'></p>
            
            <button class="btn btn-sp mb-4" type="submit" id="signin-button" disabled>
            <span id="signin-text">SIGN IN</span>
         
            <div class="spinner-border spinner-border-sm text-white" role="status" id="loader" style="display: none;">
              <span class="visually-hidden">Loading...</span>
            </div>
            </button>
            <p class="text-center">
              Don't have an account?
              <span class="sign-span" id="show-signup">Sign up now</span>
            </p>
          </form>
        
        </section>


        <section id="signup-section" style="display:none">
          <h1 id="signup-form-title">Create account</h1>
        
          <form id='signup-form' style="display:none">
          <div class="d-flex flex-column position-relative mb-3">
              <label>Your domain <span> * </span></label>
              <input
                type="text"
                placeholder="yourwebsite.com"
                class="input-field"
                name="reg-domain"
                id="reg-domain"
              />
              <p class="text-danger mt-1 mb-0" id='domain-err' style='display:hidden;margin-bottom:0'></p>
              <div class="spinner-border spinner-border-sm text-black email-loader" role="status" id="domain-loader" style="display:none">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div class="d-flex justify-content-between gap-2">
              <div class="d-flex flex-column fname w-100 mb-3">
                <label>First name<span> * </span></label>
                <input
                  type="text"
                  placeholder="First Name"
                  class="input-field"
                  name="firstName"
                  id="reg-firstName"
                />
                <p class="text-danger mt-1 mb-0" id='firstName-err' style='display:hidden;margin-bottom:0'></p>
              </div>
              <div class="d-flex flex-column w-100 mb-3">
                <label>Last name<span> * </span></label>
                <input
                  type="text"
                  placeholder="Last Name"
                  class="input-field "
                  name="lastName"
                  id="reg-lastName"
                />
                <p class="text-danger mt-1 mb-0" id='lastName-err' style='display:hidden;margin-bottom:0'></p>
              </div>
            </div>
            <div class="d-flex flex-column position-relative mb-3">
              <label>Email <span> * </span></label>
              <input
                type="email"
                placeholder="Enter your Email"
                class="input-field"
                name="email"
                id="reg-email"
              />
              <p class="text-danger mt-1 mb-0" id='email-err' style='display:hidden;margin-bottom:0'></p>
              <div class="spinner-border spinner-border-sm text-black email-loader" role="status" id="email-loader" style="display:none">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div class="d-flex justify-content-between gap-2">
            <div class="d-flex flex-column w-100 mb-3">
              <label>Password <span> * </span></label>
              <input
                type="password"
                placeholder="Enter your Password"
                class="input-field"
                name="password"
                id="reg-password"
              />
              <p class="text-danger mt-1 mb-0" id="password-err" style="color: red; display: none;"></span>
            </div>
            <div class="d-flex flex-column w-100 mb-3">
              <label>Confirm password <span> * </span></label>
              <input
                type="password"
                placeholder="Confirm your Password"
                class="input-field "
                name="confirmPassword"
                id="reg-cnfPassword"
              />
              <p class="text-danger mt-1 mb-0" id="cnf-password-err" style="color: red; display: none;"></span>
            </div>
          </div>
            <button class="btn btn-sp mb-3" id="next-button">
              <span id="reg-text">SIGN UP</span>
              <div class="spinner-border spinner-border-sm text-white" role="status" id="signup-loader" style="display: none;">
                <span class="visually-hidden">Loading...</span>
              </div>
            </button>
            <p class="text-danger mb-0" id='signup-err' style='display:hidden;margin-bottom:0'></p>
            <p class="text-center">
              Already have an account?
              <span class="sign-span" id="show-signin">Sign in now</span>
            </p>
        </form> 
     
        </section>

        <!-- Verify email -->

        <section class="success-section" id='verify-msg' style="display:none">
          <img src="<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '/assets/icon/check-circle.svg'; ?>" style="height: 64px" />
          <h2 class="mt-4">
          Account created successfully.
          </h2>
          <div class="d-flex justify-content-between w-100 cta">
            <button class="btn btn-sp mb-3" id="verify-msg-btn">
              <span id="signup-text"> BACK TO SIGN IN</span>
            </button>
          </div>
        </section>

      
        <!-- Domain style="display:none" -->
        <section id="domain-section" style="display:none"  >
        <h1>Add Your <span style="color: #07806d">domain</span></h1>
          <form id="connect-domain-form">
            <div class="d-flex flex-column" >
              <label id="input-label" >Your website <span> * </span></label>
              <label id="domain-label" style="display:none">Your domains <span> * </span></label>
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
            <p class="text-center">
              OR <br/>
              <span class="sign-span" id="add-new-domain">Add new domain</span>
            </p>
           
          </form>
        </section>

        <!-- New Domain section  -->
        <section id="new-domain-section" style="display:none">
        <h1>Add new <span style="color: #07806d">domain</span></h1>
          <form id="new-domain-form">
            <div class="d-flex flex-column position-relative  mb-3">      
              <label >Your domain <span> * </span></label>
              <input
                type="text"
                placeholder="yourwebsite.com"
                class="input-field "
                id='new-domain-input'
                name="new-domain-input"
              />
              <p class="text-danger mb-0" id='new-domain-err' style='display:none;margin-bottom:0'></p>
              <div class="spinner-border spinner-border-sm text-black email-loader" role="status" id="new-domain-loader" style="display:none">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
           <!-- <p class="text-success mb-0" id='new-domain-success' style='display:none;margin-bottom:0'></p> -->
            <button class="btn btn-sp mb-3"  id="add-domain-btn" disabled>
              <span id="add-domain-text">ADD DOMAIN</span>
              <div class="spinner-border spinner-border-sm text-white" role="status" id="add-domain-loader" style="display: none;">
                <span class="visually-hidden">Loading...</span>
              </div>
            </button>
            <p class="text-center" id="new-domain-back" >
              <span class="sign-span" >Go Back</span>
            </p>
          </form>
        </section>
        <section class="success-section" id="success-section" style="display:none">
        
        <img src="<?php echo plugin_dir_url( dirname( __FILE__ ) ) . '/assets/icon/check-circle.svg'; ?>" style="height: 64px" />
        <h2 class="mt-4">
          Secure Privacy is successfully integrated on your Wordpress Site
        </h2>
        <div class="d-flex justify-content-between w-100 cta">
          <button class="btn btn-deactive" id="sp_deactivate_plugin">DEACTIVE</button>

          <button class="btn btn-sp" id="sp_change_settings">CHANGE SETTINGS</button>
        </div>
      </section>
      
      </div>
    </div>
  </div>
</div>

</section>

<div class="wrap" style="position:absolute;top:-999999px">
  <div id="poststuff">
  <div id="post-body" class="metabox-holder columns-2">
    <div id="post-body-content">
      <div class="postbox">
        <div class="inside">
          <form name="dofollow" action="options.php" method="post">

            <?php settings_fields( 'secure-privacy-plugin' ); ?>

            <p><?php esc_html_e( 'You can find the script code on the installation page.', 'secure-privacy-plugin'); ?></p>
            <textarea style="width:98%;font-family:monospace;" rows="2" cols="1" id="insert_header" name="secureprivacy_insert_header"><?php echo esc_html( get_option( 'secureprivacy_insert_header' ) ); ?></textarea>

            <input type="hidden" value="<?php echo \esc_html( \get_option( 'secureprivacy_header_priority', -99999999999999999999999999999 ) ); ?>" name="secureprivacy_header_priority" id="secureprivacy_header_priority" style="width:6em;" /> 

          <p class="submit">
            <input class="button button-primary" id="sp_saveScript_form" type="submit" name="Submit" value="<?php esc_html_e( 'Save', 'secure-privacy-plugin'); ?>" />
          </p>

          </form>
        </div>
    </div>
    </div>

    </div>
  </div>
</div>
