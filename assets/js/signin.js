(function ($) {
  $(document).ready(function () {
    let scriptText = "";
    // const apiURL = "https://api-prod.secureprivacy.ai";
    const apiURL = "https://test.secureprivacy.ai";

    const scriptURL = "https://frontend-test.secureprivacy.ai/script";

    function showLoading() {
      $("#signin-text").hide();

      $("#loader").show();
    }

    function hideLoading() {
      $("#loader").hide();
      $("#signin-text").show();
    }
    // Hide Show Starts

    $("#show-signin").click(function () {
      $("#signin-section").show();
      $("#signup-section").hide();
      $("#signin-title").show();
      $("#signup-title").hide();
    });

    $("#signup-back-button").click(function (e) {
      e.preventDefault();
      $("#signup-form").show();
      $("#signup-form-title").show();
      $("#signup-section-next").hide();
    });

    $("#verify-msg-btn").click(function () {
      $("#verify-msg").hide();
      $("#signin-section").show();
      $("#signin-title").show();
    });
    $("#change-email").click(function () {
      $("#verify-msg").hide();
      $("#signup-section").show();
      $("#signup-form").show();
      $("#signup-form-title").show();
    });
    $("#add-new-domain").click(function () {
      $("#domain-section").hide();
      $("#new-domain-section").show();
    });

    $("#resend-email").click(function () {
      $("#signup-section-next").submit();
    });
    $("#new-domain-back").click(function () {
      $("#new-domain-section").hide();
      $("#domain-section").show();
    });

    $("#show-signup").click(function () {
      $("#reg-domain").val(location.origin);
      $("#signin-section").hide();
      $("#signup-section").show();
      $("#signin-title").hide();
      $("#signup-title").show();
      $("#signup-form").show();
      $("#signup-form-title").show();
    });
    // Hide Show Ends

    if (
      $("#insert_header").val().includes(`${scriptURL}`)
    ) {
      $("#success-section").show();
    } else {
      $("#signin-section").show();
    }

    // Sign In Starts
    function checkValidation() {
      let email = $("#login-email").val();
      let password = $("#login-password").val();
      console.log({ email, password });
      if (email !== "" && password !== "") {
        $("#signin-button").prop("disabled", false);
      } else {
        $("#signin-button").prop("disabled", true);
      }
    }

    $("#login-email, #login-password").on("input", function () {
      checkValidation();
    });

    $("#sigin-form").submit(function (e) {
      e.preventDefault();
      showLoading();
      let email = $("#login-email").val();
      let password = $("#login-password").val();

      let data = {
        username: email,
        password: password,
      };
      console.log(data);

      $.ajax({
        url: `${apiURL}/api/auth/login`,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (response) {
          hideLoading();
          if (response.ApiKey && response.RefreshToken) {
            $("#login-err").hide();
            $("#signin-section").hide();
            $("#domain-section").show();
            localStorage.setItem("ApiKey", response.ApiKey);
            localStorage.setItem("RefreshToken", response.RefreshToken);
            getDomains();
          } else {
            $("#login-err").show();
            $("#login-err").text(response.ResponseStatus.Message);
            console.error(response.ResponseStatus.Message);
          }
        },
        error: function (error) {
          hideLoading();
          console.error("Error:", error);
        },
      });
    });
    // SignIn Ends

    // Register Starts
    let isDomainValid = false;
    let isFirstNameValid = false;
    let isLastNameValid = false;
    let isEmailValid = false;
    let isPasswordValid = false;
    let isConfirmPasswordValid = false;
    const domainPattern =
      /^(((http|https):\/\/|)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,6}(:[0-9]{1,5})?(\/.*)?)$/;
    const emailPattern =
      /^(?!.*\.\.)(?!.*\-\-)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    function validateDomain() {
      const domain = $("#reg-domain").val();
      const isValid = domainPattern.test(domain);

      $("#domain-err").toggle(!isValid);

      if (isValid) {
        $("#domain-err").text("");
        $("#domain-loader").toggle(isValid);
        // Make the AJAX call
        $.ajax({
          url: `${apiURL}/api/Domain/Validate/%7BDomain%7D?domain=${domain}`,
          type: "GET",
          contentType: "application/json",
          success: function (response) {
            $("#domain-loader").hide();
            if (!response) {
              $("#domain-err").show();
              $("#domain-err").text(
                "The provided domain is currently inactive"
              );
              isDomainValid = false;
            } else {
              isDomainValid = true;
            }
          },
          error: function (error) {
            $("#domain-loader").hide();
            console.error("API error:", error);
            isDomainValid = false;
          },
        });
      } else {
        $("#domain-err").text("Please enter a valid domain.");
        isDomainValid = false;
      }

    }


    function validateEmail() {
      const email = $("#reg-email").val();
      const isValid = emailPattern.test(email);
      $("#email-err").toggle(!isValid);

      if (isValid) {
        $("#email-err").text("");
        $("#email-loader").toggle(isValid);
        const data = { email: email };
        $.ajax({
          url: `${apiURL}/api/AdminUser/ValidateEnterpriseEmail`,
          method: "POST",
          contentType: "application/json",
          data: JSON.stringify(data),
          success: function (response) {
            $("#email-loader").hide();
            console.log(response);
            if (response.IsTaken) {
              $("#email-err").show();
              $("#email-err").text("Email already taken");
              isEmailValid = false;
            } else if (!response.IsValid) {
              $("#email-err").show();
              $("#email-err").text("Email is not valid");
              isEmailValid = false;
            } else if (response.IsDisposableEmail) {
              $("#email-err").show();
              $("#email-err").text(" Disposable emails are not allowed");
              isEmailValid = false;
              // return;
            } else if (response.IsAlias) {
              $("#email-err").show();
              $("#email-err").text(" Alias email are not allowed");
              isEmailValid = false;
            } else {
              $("#email-err").hide();
              isEmailValid = true;
            }

          },
          error: function (error) {
            $("#email-loader").hide();
            isEmailValid = false;
            isValid = false;
            console.error("Error:", error);
          },
        });
      } else {
        $("#email-err").text("Please enter a valid email.");
        isEmailValid = false;
      }

    }

    function validatePassword() {
      const password = $("#reg-password").val();
      const minLength = 8;
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumber = /\d/.test(password);

      let errorMessage = "";

      if (password.length < minLength) {
        isPasswordValid = false;

        errorMessage = "Minimum length for password is 8.";
      } else if (!hasUpperCase || !hasLowerCase || !hasNumber) {
        isPasswordValid = false;
        errorMessage =
          "Password should contain at least one uppercase letter, one lowercase letter, and one number.";
      } else {
        isPasswordValid = true;
      }

      $("#password-err").toggle(!isPasswordValid);
      $("#password-err").text(errorMessage);

    }

    function validateConfirmPassword() {
      const password = $("#reg-password").val();
      const confirmPassword = $("#reg-cnfPassword").val();
      const minLength = 8;
      const hasUpperCase = /[A-Z]/.test(confirmPassword);
      const hasLowerCase = /[a-z]/.test(confirmPassword);
      const hasNumber = /\d/.test(confirmPassword);

      let errorMessage = "";

      if (confirmPassword !== password) {
        isConfirmPasswordValid = false;
        errorMessage = "Passwords do not match.";
      } else if (confirmPassword.length < minLength) {
        isConfirmPasswordValid = false;
        errorMessage = "Minimum length for password is 8.";
      } else if (!hasUpperCase || !hasLowerCase || !hasNumber) {
        isConfirmPasswordValid = false;
        errorMessage =
          "Password should contain at least one uppercase letter, one lowercase letter, and one number.";
      } else {
        isConfirmPasswordValid = true;
      }

      $("#cnf-password-err").toggle(!isConfirmPasswordValid);
      $("#cnf-password-err").text(errorMessage);

    }

    function validateFirstName() {
      const firstName = $("#reg-firstName").val();
      let errorMessage = "";
      if (firstName !== "") {
        isFirstNameValid = true;
      } else {
        isFirstNameValid = false;
        errorMessage = "First name is required.";
      }
      $("#firstName-err").toggle(!isFirstNameValid);
      $("#firstName-err").text(errorMessage);
    }

    function validateLastName() {
      const lastName = $("#reg-lastName").val();
      let errorMessage = "";
      if (lastName !== "") {
        isLastNameValid = true;
      } else {
        isLastNameValid = false;
        errorMessage = "Last name is required.";
      }
      $("#lastName-err").toggle(!isLastNameValid);
      $("#lastName-err").text(errorMessage);
    }
    $("#reg-domain").on("input", validateDomain);
    $("#reg-email").on("blur", validateEmail);
    $("#reg-firstName").on("input", validateFirstName);
    $("#reg-lastName").on("input", validateLastName);
    $("#reg-password").on("input", validatePassword);
    $("#reg-cnfPassword").on("input", validateConfirmPassword);

    $("#signup-form").submit(function (e) {
      e.preventDefault();
      const isValid = checkRegValidation();
      if (isValid) {
        const email = $("#reg-email").val();
        var atIndex = email.indexOf("@");
        var dotIndex = email.indexOf(".", atIndex);
        var company = atIndex !== -1 && dotIndex !== -1 ? email.substring(atIndex + 1, dotIndex) : "";


        let firstName = $("#reg-firstName").val();
        let lastName = $("#reg-lastName").val();
        let businessEmail = $("#reg-email").val();
        let password = $("#reg-password").val();
        let confirmPassword = $("#reg-cnfPassword").val();
        let domain = $("#reg-domain").val();

        let data = {
          isV2: true,
          pluginName: "Wordpress",
          firstName: firstName,
          lastName: lastName,
          businessEmail: businessEmail,
          companyName: company,
          password: password,
          confirmPassword: confirmPassword,
          domain: domain,
        };
        
        $("#reg-text").hide();
        $("#signup-loader").show();

        $.ajax({
          url: `${apiURL}/api/onboarding/plugin`,
          method: "POST",
          contentType: "application/json",
          data: JSON.stringify(data),
          success: function (response) {
            $("#reg-text").show();
            $("#signup-loader").hide();
            console.log(response);
            if (response) {
              $("#signup-section").hide();
              $("#signup-err").hide();
              $("#verify-msg").show();
            } else {
              $("#signup-err").show();
              $("#signup-err").text(response.ResponseStatus.Message);
            }
          },
          error: function (error) {
            $("#reg-text").show();
            $("#signup-loader").hide();
            console.error("Error:", error);
          },
        });


      }
    });

    function checkRegValidation() {
      validateLastName();
      validateFirstName();
      validateDomain();
      validateEmail();
      validatePassword();
      validateConfirmPassword();
      if (
        isDomainValid &&
        isFirstNameValid &&
        isLastNameValid &&
        isEmailValid &&
        isPasswordValid &&
        isConfirmPasswordValid
      ) {
        return true;
      } else {
        return false;
      }
    }

    // Add New Domain Starts

    $("#new-domain-input").on("input", function () {
      let domain = $("#new-domain-input").val();
      const isValid = domainPattern.test(domain);

      $("#new-domain-err").toggle(!isValid);

      if (isValid) {
        $("#new-domain-err").text("");
        $("#new-domain-loader").show();
        $.ajax({
          url: `${apiURL}/api/Domain/Validate/%7BDomain%7D?domain=${domain}`,
          type: "GET",
          contentType: "application/json",
          success: function (response) {
            $("#new-domain-loader").hide();
            if (!response) {
              $("#new-domain-err")
                .show()
                .text("The provided domain is currently inactive");
              $("#add-domain-btn").prop("disabled", true);
            } else {
              $("#new-domain-err").hide().text("");
              $("#add-domain-btn").prop("disabled", false);
            }
          },
          error: function (error) {
            $("#new-domain-loader").hide();
            console.error("API error:", error);

            $("#add-domain-btn").prop("disabled", true);
          },
        });
      } else {
        $("#new-domain-err").text("Please enter a valid domain.");
        $("#add-domain-btn").prop("disabled", true);
      }
    });

    $("#new-domain-form").submit(function (e) {
      e.preventDefault();
      const apiKey = localStorage.getItem("ApiKey");
      if (!apiKey) {
        console.error("ApiKey not found in local storage");
        return;
      }
      $("#add-domain-text").hide();
      $("#add-domain-loader").show();

      let domain = $("#new-domain-input").val();
      let data = {
        domain,
        name: null,
        blocking: "AutomaticV2",
        websiteQuestions: null,
        collectedData: null,
        informationCollected: null,
        enableGCM: null,
        tags: null,
      };
      console.log(data);

      $.ajax({
        url: `${apiURL}/api/Domain`,
        method: "POST",
        headers: {
          Authorization: "Bearer " + apiKey,
        },
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (response) {
          let domainId = response.Id;
          assignDomain(domainId);
          $("#add-domain-text").show();
          $("#add-domain-loader").hide();

          console.log(response);
          if (response?.ResponseStatus?.ErrorCode) {
            $("#new-domain-err").show();
            $("#new-domain-err").text(response.ResponseStatus.Message);
          } else {
            $("#new-domain-err").hide();
            $("#new-domain-section").hide();
            $("#domain-section").show();
            getDomains();
          }
        },
        error: function (error) {
          $("#add-domain-text").show();
          $("#add-domain-loader").hide();
          console.error("Error:", error);
        },
      });
    });
    // Add New Domain Ends

    function getDomains() {
      const apiKey = localStorage.getItem("ApiKey");
      if (!apiKey) {
        console.error("ApiKey not found in local storage");
        return;
      }
      $.ajax({
        url: `${apiURL}/api/Domain?pageNumber=1&resultsPerPage=999999999`,
        method: "GET",
        contentType: "application/json",
        headers: {
          Authorization: "Bearer " + apiKey,
        },
        success: function (response) {
          if (response.PagedResults.length > 0) {
            $("#domain-label").show();
            $("#input-label").hide();
            $("#domain-select").show();
            $("#domain-input").hide();
            $("#domain-select").empty();
            $("#domain-input").val(location.origin);
            $("#domain-input").prop("disabled", true);
            $.each(response.PagedResults, function (index, domain) {
              $("#domain-select").append(
                $("<option>").val(domain.Id).text(domain.Url)
              );
            });
            scriptText = `<script src="${scriptURL}/${response.PagedResults[0].Id}.js"></script>`;
          } else {
            $("#domain-label").hide();
            $("#input-label").show();
            $("#domain-select").hide();
            $("#domain-input").show();
            $("#domain-input").val(location.origin);
            $("#domain-input").prop("disabled", true);
          }
        },
        error: function (error) {
          console.error("Error:", error);
        },
      });
    }

    $("#connect-domain-form").submit(function (e) {
      e.preventDefault();

      const selectedDomain =
        $("#domain-select").val() || $("#domain-input").val();
      console.log(selectedDomain);
      if (!selectedDomain) {
        console.error("No domain selected or entered");
        return;
      }
      const apiKey = localStorage.getItem("ApiKey");
      if (!apiKey) {
        console.error("ApiKey not found in local storage");
        return;
      }

      $.ajax({
        url: `${apiURL}/api/Domain`,
        method: "POST",
        contentType: "application/json",
        headers: {
          Authorization: "Bearer " + apiKey,
        },
        data: JSON.stringify({
          blocking: "AutomaticV2",
          collectedData: null,
          domain: domain,
        }),
        success: function (response) {
          let domainId = response.Id;
          assignDomain(domainId);
          console.log("Domain connected successfully:", response);
        },
        error: function (error) {
          console.error("Error connecting domain:", error);
        },
      });
    });


    function assignDomain(domain) {
      // Make the AJAX call
      const apiKey = localStorage.getItem("ApiKey");
      $.ajax({
        url: `${apiURL}/api/Domain/assign`,
        method: "POST",
        contentType: "application/json",
        headers: {
          Authorization: "Bearer " + apiKey,
        },
        data: JSON.stringify({
          TemplateIds:["66611f757f3e478bd12677c5","66611f737f3e478bd12677a7","66611f737f3e478bd12677a1","66611f727f3e478bd126779b","66611f727f3e478bd1267795","66611f727f3e478bd126778f","66611f717f3e478bd1267789","66611f717f3e478bd1267783","66611f717f3e478bd126777d","66611f707f3e478bd1267777","66611f707f3e478bd1267771","66611f707f3e478bd126776b","66611f6f7f3e478bd1267765","66611f6f7f3e478bd126775f","66611f6f7f3e478bd1267759","66611f6e7f3e478bd1267753","66611f6e7f3e478bd126774d","66611f6e7f3e478bd1267747","66611f6d7f3e478bd1267741","66611f6d7f3e478bd126773b","66611f6d7f3e478bd1267735","66611f6c7f3e478bd126772f","66611f6c7f3e478bd1267729","66611f6c7f3e478bd1267723","66611f6c7f3e478bd126771d","66611f6b7f3e478bd1267717","66611f6b7f3e478bd1267711","66611f6b7f3e478bd126770b","66611f6a7f3e478bd1267705","66611f6a7f3e478bd12676ff","66611f6a7f3e478bd12676f9","66611f697f3e478bd12676f3","66611f697f3e478bd12676ed","66611f697f3e478bd12676e7","66611f687f3e478bd12676e1","66611f687f3e478bd12676db","66611f687f3e478bd12676d5","66611f677f3e478bd12676cf","66611f677f3e478bd12676c9","66611f677f3e478bd12676c3","66611f667f3e478bd12676bd","66611f667f3e478bd12676b7","66611f667f3e478bd12676b1","66611f657f3e478bd12676ab","66611f657f3e478bd12676a5","66611f657f3e478bd126769f","66611f647f3e478bd1267699","66611f647f3e478bd1267693","66611f647f3e478bd126768d","66611f637f3e478bd1267687","66611f637f3e478bd1267681","66611f637f3e478bd126767b","66611f627f3e478bd1267675"],
          PolicyIds: ["66611f767f3e478bd12677c7", "66611f767f3e478bd12677c8"],
          DomainId: domain,
        }),
        success: function (response) {
          console.log("Domain connected successfully:", response);
        },
        error: function (error) {
          console.error("Error connecting domain:", error);
        },
      });
    }


    $("#domain-select").on("change", function () {
      let selectedId = $(this).val();
      scriptText = `<script src="${scriptURL}/${selectedId}.js"></script>`;
    });
    $("#connect-domain").click(function () {
      $("#insert_header").val(scriptText);
      $("#sp_saveScript_form").click();
    });

    $("#sp_save-btn").on("click", function (e) {
      e.preventDefault();
      $("#domain-section").hide();
      $("#success-section").show();
    });

    $("#sp_deactivate_plugin").on("click", function (e) {
      e.preventDefault();
      $("#success-section").hide();
      $("#insert_header").val("");
      $("#sp_saveScript_form").click();
    });

    $("#sp_change_settings").on("click", function (e) {
      e.preventDefault();
      window.open("https://cmp.secureprivacy.ai/login");
    });

    const COUNTRIES = [
      {
        name: "Afghanistan",
        code: "AF",
        timezone: "Afghanistan Standard Time",
        utc: "UTC+04:30",
        mobileCode: "+93",
      },
      {
        name: "Åland Islands",
        code: "AX",
        timezone: "FLE Standard Time",
        utc: "UTC+02:00",
        mobileCode: "+358-18",
      },
      {
        name: "Albania",
        code: "AL",
        timezone: "Central Europe Standard Time",
        utc: "UTC+01:00",
        mobileCode: "+355",
      },
      {
        name: "Algeria",
        code: "DZ",
        timezone: "W. Central Africa Standard Time",
        utc: "UTC+01:00",
        mobileCode: "+213",
      },
      {
        name: "American Samoa",
        code: "AS",
        timezone: "UTC-11",
        utc: "UTC-11:00",
        mobileCode: "+1-684",
      },
      {
        name: "Andorra",
        code: "AD",
        timezone: "W. Europe Standard Time",
        utc: "UTC+01:00",
        mobileCode: "+376",
      },
      {
        name: "Angola",
        code: "AO",
        timezone: "W. Central Africa Standard Time",
        utc: "UTC+01:00",
        mobileCode: "+244",
      },
      {
        name: "Anguilla",
        code: "AI",
        timezone: "SA Western Standard Time",
        utc: "UTC-04:00",
        mobileCode: "+1-264",
      },
      {
        name: "Antarctica",
        code: "AQ",
        timezone: "Pacific SA Standard Time",
        utc: "UTC-03:00",
        mobileCode: "+",
      },
      {
        name: "Antigua and Barbuda",
        code: "AG",
        timezone: "SA Western Standard Time",
        utc: "UTC-04:00",
        mobileCode: "+1-268",
      },
      {
        name: "Argentina",
        code: "AR",
        timezone: "Argentina Standard Time",
        utc: "UTC-03:00",
        mobileCode: "+54",
      },
      {
        name: "Armenia",
        code: "AM",
        timezone: "Caucasus Standard Time",
        utc: "UTC+04:00",
        mobileCode: "+374",
      },
      {
        name: "Aruba",
        code: "AW",
        timezone: "SA Western Standard Time",
        utc: "UTC-04:00",
        mobileCode: "+297",
      },
      {
        name: "Australia",
        code: "AU",
        timezone: "AUS Eastern Standard Time",
        utc: "UTC+10:00",
        mobileCode: "+61",
      },
      {
        name: "Austria",
        code: "AT",
        timezone: "W. Europe Standard Time",
        utc: "UTC+01:00",
        mobileCode: "+43",
      },
      {
        name: "Azerbaijan",
        code: "AZ",
        timezone: "Azerbaijan Standard Time",
        utc: "UTC+04:00",
        mobileCode: "+994",
      },
      {
        name: "Bahamas, The",
        code: "BS",
        timezone: "Eastern Standard Time",
        utc: "UTC-05:00",
        mobileCode: "+1-242",
      },
      {
        name: "Bahrain",
        code: "BH",
        timezone: "Arab Standard Time",
        utc: "UTC+03:00",
        mobileCode: "+973",
      },
      {
        name: "Bangladesh",
        code: "BD",
        timezone: "Bangladesh Standard Time",
        utc: "UTC+06:00",
        mobileCode: "+880",
      },
      {
        name: "Barbados",
        code: "BB",
        timezone: "SA Western Standard Time",
        utc: "UTC-04:00",
        mobileCode: "+1-246",
      },
      {
        name: "Belarus",
        code: "BY",
        timezone: "Belarus Standard Time",
        utc: "UTC+03:00",
        mobileCode: "+375",
      },
      {
        name: "Belgium",
        code: "BE",
        timezone: "Romance Standard Time",
        utc: "UTC+01:00",
        mobileCode: "+32",
      },
      {
        name: "Belize",
        code: "BZ",
        timezone: "Central America Standard Time",
        utc: "UTC-06:00",
        mobileCode: "+501",
      },
      {
        name: "Benin",
        code: "BJ",
        timezone: "W. Central Africa Standard Time",
        utc: "UTC+01:00",
        mobileCode: "+229",
      },
      {
        name: "Bermuda",
        code: "BM",
        timezone: "Atlantic Standard Time",
        utc: "UTC-04:00",
        mobileCode: "+1-441",
      },
      {
        name: "Bhutan",
        code: "BT",
        timezone: "Bangladesh Standard Time",
        utc: "UTC+06:00",
        mobileCode: "+975",
      },
      {
        name: "Bolivarian Republic of Venezuela",
        code: "VE",
        timezone: "Venezuela Standard Time",
        utc: "UTC-04:30",
        mobileCode: "+58",
      },
      {
        name: "Bolivia",
        code: "BO",
        timezone: "SA Western Standard Time",
        utc: "UTC-04:00",
        mobileCode: "+591",
      },
      {
        name: "Bonaire, Sint Eustatius and Saba",
        code: "BQ",
        timezone: "SA Western Standard Time",
        utc: "UTC-04:00",
        mobileCode: "+599",
      },
      {
        name: "Bosnia and Herzegovina",
        code: "BA",
        timezone: "Central European Standard Time",
        utc: "UTC+01:00",
        mobileCode: "+387",
      },
      {
        name: "Botswana",
        code: "BW",
        timezone: "South Africa Standard Time",
        utc: "UTC+02:00",
        mobileCode: "+267",
      },
      {
        name: "Bouvet Island",
        code: "BV",
        timezone: "UTC",
        utc: "UTC",
        mobileCode: "+",
      },
      {
        name: "Brazil",
        code: "BR",
        timezone: "E. South America Standard Time",
        utc: "UTC-03:00",
        mobileCode: "+55",
      },
      {
        name: "British Indian Ocean Territory",
        code: "IO",
        timezone: "Central Asia Standard Time",
        utc: "UTC+06:00",
        mobileCode: "+246",
      },
      {
        name: "Brunei",
        code: "BN",
        timezone: "Singapore Standard Time",
        utc: "UTC+08:00",
        mobileCode: "+673",
      },
      {
        name: "Bulgaria",
        code: "BG",
        timezone: "FLE Standard Time",
        utc: "UTC+02:00",
        mobileCode: "+359",
      },
      {
        name: "Burkina Faso",
        code: "BF",
        timezone: "Greenwich Standard Time",
        utc: "UTC",
        mobileCode: "+226",
      },
      {
        name: "Burundi",
        code: "BI",
        timezone: "South Africa Standard Time",
        utc: "UTC+02:00",
        mobileCode: "+257",
      },
      {
        name: "Cabo Verde",
        code: "CV",
        timezone: "Cape Verde Standard Time",
        utc: "UTC-01:00",
        mobileCode: "+238",
      },
      {
        name: "Cambodia",
        code: "KH",
        timezone: "SE Asia Standard Time",
        utc: "UTC+07:00",
        mobileCode: "+855",
      },
      {
        name: "Cameroon",
        code: "CM",
        timezone: "W. Central Africa Standard Time",
        utc: "UTC+01:00",
        mobileCode: "+237",
      },
      {
        name: "Canada",
        code: "CA",
        timezone: "Eastern Standard Time",
        utc: "UTC-05:00",
        mobileCode: "+1",
      },
      {
        name: "Cayman Islands",
        code: "KY",
        timezone: "SA Pacific Standard Time",
        utc: "UTC-05:00",
        mobileCode: "+1-345",
      },
      {
        name: "Central African Republic",
        code: "CF",
        timezone: "W. Central Africa Standard Time",
        utc: "UTC+01:00",
        mobileCode: "+236",
      },
      {
        name: "Chad",
        code: "TD",
        timezone: "W. Central Africa Standard Time",
        utc: "UTC+01:00",
        mobileCode: "+235",
      },
      {
        name: "Chile",
        code: "CL",
        timezone: "Pacific SA Standard Time",
        utc: "UTC-03:00",
        mobileCode: "+56",
      },
      {
        name: "China",
        code: "CN",
        timezone: "China Standard Time",
        utc: "UTC+08:00",
        mobileCode: "+86",
      },
      {
        name: "Christmas Island",
        code: "CX",
        timezone: "SE Asia Standard Time",
        utc: "UTC+07:00",
        mobileCode: "+61",
      },
      {
        name: "Cocos (Keeling) Islands",
        code: "CC",
        timezone: "Myanmar Standard Time",
        utc: "UTC+06:30",
        mobileCode: "+61",
      },
      {
        name: "Colombia",
        code: "CO",
        timezone: "SA Pacific Standard Time",
        utc: "UTC-05:00",
        mobileCode: "+57",
      },
      {
        name: "Comoros",
        code: "KM",
        timezone: "E. Africa Standard Time",
        utc: "UTC+03:00",
        mobileCode: "+269",
      },
      {
        name: "Congo",
        code: "CG",
        timezone: "W. Central Africa Standard Time",
        utc: "UTC+01:00",
        mobileCode: "+242",
      },
      {
        name: "Congo (DRC)",
        code: "CD",
        timezone: "W. Central Africa Standard Time",
        utc: "UTC+01:00",
        mobileCode: "+243",
      },
      {
        name: "Cook Islands",
        code: "CK",
        timezone: "Hawaiian Standard Time",
        utc: "UTC-10:00",
        mobileCode: "+682",
      },
      {
        name: "Costa Rica",
        code: "CR",
        timezone: "Central America Standard Time",
        utc: "UTC-06:00",
        mobileCode: "+506",
      },
      {
        name: "Côte d'Ivoire",
        code: "CI",
        timezone: "Greenwich Standard Time",
        utc: "UTC",
        mobileCode: "+225",
      },
      {
        name: "Croatia",
        code: "HR",
        timezone: "Central European Standard Time",
        utc: "UTC+01:00",
        mobileCode: "+385",
      },
      {
        name: "Cuba",
        code: "CU",
        timezone: "Eastern Standard Time",
        utc: "UTC-05:00",
        mobileCode: "+53",
      },
      {
        name: "Curaçao",
        code: "CW",
        timezone: "SA Western Standard Time",
        utc: "UTC-04:00",
        mobileCode: "+599",
      },
      {
        name: "Cyprus",
        code: "CY",
        timezone: "E. Europe Standard Time",
        utc: "UTC+02:00",
        mobileCode: "+357",
      },
      {
        name: "Czech Republic",
        code: "CZ",
        timezone: "Central Europe Standard Time",
        utc: "UTC+01:00",
        mobileCode: "+420",
      },
      {
        name: "Democratic Republic of Timor-Leste",
        code: "TL",
        timezone: "Tokyo Standard Time",
        utc: "UTC+09:00",
        mobileCode: "+670",
      },
      {
        name: "Denmark",
        code: "DK",
        timezone: "Romance Standard Time",
        utc: "UTC+01:00",
        mobileCode: "+45",
      },
      {
        name: "Djibouti",
        code: "DJ",
        timezone: "E. Africa Standard Time",
        utc: "UTC+03:00",
        mobileCode: "+253",
      },
      {
        name: "Dominica",
        code: "DM",
        timezone: "SA Western Standard Time",
        utc: "UTC-04:00",
        mobileCode: "+1-767",
      },
      {
        name: "Dominican Republic",
        code: "DO",
        timezone: "SA Western Standard Time",
        utc: "UTC-04:00",
        mobileCode: "+1-809 and 1-829",
      },
      {
        name: "Ecuador",
        code: "EC",
        timezone: "SA Pacific Standard Time",
        utc: "UTC-05:00",
        mobileCode: "+593",
      },
      {
        name: "Egypt",
        code: "EG",
        timezone: "Egypt Standard Time",
        utc: "UTC+02:00",
        mobileCode: "+20",
      },
      {
        name: "El Salvador",
        code: "SV",
        timezone: "Central America Standard Time",
        utc: "UTC-06:00",
        mobileCode: "+503",
      },
      {
        name: "Equatorial Guinea",
        code: "GQ",
        timezone: "W. Central Africa Standard Time",
        utc: "UTC+01:00",
        mobileCode: "+240",
      },
      {
        name: "Eritrea",
        code: "ER",
        timezone: "E. Africa Standard Time",
        utc: "UTC+03:00",
        mobileCode: "+291",
      },
      {
        name: "Estonia",
        code: "EE",
        timezone: "FLE Standard Time",
        utc: "UTC+02:00",
        mobileCode: "+372",
      },
      {
        name: "Ethiopia",
        code: "ET",
        timezone: "E. Africa Standard Time",
        utc: "UTC+03:00",
        mobileCode: "+251",
      },
      {
        name: "Falkland Islands (Islas Malvinas)",
        code: "FK",
        timezone: "SA Eastern Standard Time",
        utc: "UTC-03:00",
        mobileCode: "+500",
      },
      {
        name: "Faroe Islands",
        code: "FO",
        timezone: "GMT Standard Time",
        utc: "UTC",
        mobileCode: "+298",
      },
      {
        name: "Fiji Islands",
        code: "FJ",
        timezone: "Fiji Standard Time",
        utc: "UTC+12:00",
        mobileCode: "+679",
      },
      {
        name: "Finland",
        code: "FI",
        timezone: "FLE Standard Time",
        utc: "UTC+02:00",
        mobileCode: "+358",
      },
      {
        name: "France",
        code: "FR",
        timezone: "Romance Standard Time",
        utc: "UTC+01:00",
        mobileCode: "+33",
      },
      {
        name: "French Guiana",
        code: "GF",
        timezone: "SA Eastern Standard Time",
        utc: "UTC-03:00",
        mobileCode: "+594",
      },
      {
        name: "French Polynesia",
        code: "PF",
        timezone: "Hawaiian Standard Time",
        utc: "UTC-10:00",
        mobileCode: "+689",
      },
      {
        name: "French Southern and Antarctic Lands",
        code: "TF",
        timezone: "West Asia Standard Time",
        utc: "UTC+05:00",
        mobileCode: "+",
      },
      {
        name: "Gabon",
        code: "GA",
        timezone: "W. Central Africa Standard Time",
        utc: "UTC+01:00",
        mobileCode: "+241",
      },
      {
        name: "Gambia, The",
        code: "GM",
        timezone: "Greenwich Standard Time",
        utc: "UTC",
        mobileCode: "+220",
      },
      {
        name: "Georgia",
        code: "GE",
        timezone: "Georgian Standard Time",
        utc: "UTC+04:00",
        mobileCode: "+995",
      },
      {
        name: "Germany",
        code: "DE",
        timezone: "W. Europe Standard Time",
        utc: "UTC+01:00",
        mobileCode: "+49",
      },
      {
        name: "Ghana",
        code: "GH",
        timezone: "Greenwich Standard Time",
        utc: "UTC",
        mobileCode: "+233",
      },
      {
        name: "Gibraltar",
        code: "GI",
        timezone: "W. Europe Standard Time",
        utc: "UTC+01:00",
        mobileCode: "+350",
      },
      {
        name: "Greece",
        code: "GR",
        timezone: "GTB Standard Time",
        utc: "UTC+02:00",
        mobileCode: "+30",
      },
      {
        name: "Greenland",
        code: "GL",
        timezone: "Greenland Standard Time",
        utc: "UTC-03:00",
        mobileCode: "+299",
      },
      {
        name: "Grenada",
        code: "GD",
        timezone: "SA Western Standard Time",
        utc: "UTC-04:00",
        mobileCode: "+1-473",
      },
      {
        name: "Guadeloupe",
        code: "GP",
        timezone: "SA Western Standard Time",
        utc: "UTC-04:00",
        mobileCode: "+590",
      },
      {
        name: "Guam",
        code: "GU",
        timezone: "West Pacific Standard Time",
        utc: "UTC+10:00",
        mobileCode: "+1-671",
      },
      {
        name: "Guatemala",
        code: "GT",
        timezone: "Central America Standard Time",
        utc: "UTC-06:00",
        mobileCode: "+502",
      },
      {
        name: "Guernsey",
        code: "GG",
        timezone: "GMT Standard Time",
        utc: "UTC",
        mobileCode: "+44-1481",
      },
      {
        name: "Guinea",
        code: "GN",
        timezone: "Greenwich Standard Time",
        utc: "UTC",
        mobileCode: "+224",
      },
      {
        name: "Guinea-Bissau",
        code: "GW",
        timezone: "Greenwich Standard Time",
        utc: "UTC",
        mobileCode: "+245",
      },
      {
        name: "Guyana",
        code: "GY",
        timezone: "SA Western Standard Time",
        utc: "UTC-04:00",
        mobileCode: "+592",
      },
      {
        name: "Haiti",
        code: "HT",
        timezone: "Eastern Standard Time",
        utc: "UTC-05:00",
        mobileCode: "+509",
      },
      {
        name: "Heard Island and McDonald Islands",
        code: "HM",
        timezone: "Mauritius Standard Time",
        utc: "UTC+04:00",
        mobileCode: "+ ",
      },
      {
        name: "Honduras",
        code: "HN",
        timezone: "Central America Standard Time",
        utc: "UTC-06:00",
        mobileCode: "+504",
      },
      {
        name: "Hong Kong SAR",
        code: "HK",
        timezone: "China Standard Time",
        utc: "UTC+08:00",
        mobileCode: "+852",
      },
      {
        name: "Hungary",
        code: "HU",
        timezone: "Central Europe Standard Time",
        utc: "UTC+01:00",
        mobileCode: "+36",
      },
      {
        name: "Iceland",
        code: "IS",
        timezone: "Greenwich Standard Time",
        utc: "UTC",
        mobileCode: "+354",
      },
      {
        name: "India",
        code: "IN",
        timezone: "India Standard Time",
        utc: "UTC+05:30",
        mobileCode: "+91",
      },
      {
        name: "Indonesia",
        code: "ID",
        timezone: "SE Asia Standard Time",
        utc: "UTC+07:00",
        mobileCode: "+62",
      },
      {
        name: "Iran",
        code: "IR",
        timezone: "Iran Standard Time",
        utc: "UTC+03:30",
        mobileCode: "+98",
      },
      {
        name: "Iraq",
        code: "IQ",
        timezone: "Arabic Standard Time",
        utc: "UTC+03:00",
        mobileCode: "+964",
      },
      {
        name: "Ireland",
        code: "IE",
        timezone: "GMT Standard Time",
        utc: "UTC",
        mobileCode: "+353",
      },
      {
        name: "Israel",
        code: "IL",
        timezone: "Israel Standard Time",
        utc: "UTC+02:00",
        mobileCode: "+972",
      },
      {
        name: "Italy",
        code: "IT",
        timezone: "W. Europe Standard Time",
        utc: "UTC+01:00",
        mobileCode: "+39",
      },
      {
        name: "Jamaica",
        code: "JM",
        timezone: "SA Pacific Standard Time",
        utc: "UTC-05:00",
        mobileCode: "+1-876",
      },
      {
        name: "Jan Mayen",
        code: "SJ",
        timezone: "W. Europe Standard Time",
        utc: "UTC+01:00",
        mobileCode: "+47",
      },
      {
        name: "Japan",
        code: "JP",
        timezone: "Tokyo Standard Time",
        utc: "UTC+09:00",
        mobileCode: "+81",
      },
      {
        name: "Jersey",
        code: "JE",
        timezone: "GMT Standard Time",
        utc: "UTC",
        mobileCode: "+44-1534",
      },
      {
        name: "Jordan",
        code: "JO",
        timezone: "Jordan Standard Time",
        utc: "UTC+02:00",
        mobileCode: "+962",
      },
      {
        name: "Kazakhstan",
        code: "KZ",
        timezone: "Central Asia Standard Time",
        utc: "UTC+06:00",
        mobileCode: "+7",
      },
      {
        name: "Kenya",
        code: "KE",
        timezone: "E. Africa Standard Time",
        utc: "UTC+03:00",
        mobileCode: "+254",
      },
      {
        name: "Kiribati",
        code: "KI",
        timezone: "UTC+12",
        utc: "UTC+12:00",
        mobileCode: "+686",
      },
      {
        name: "Korea",
        code: "KR",
        timezone: "Korea Standard Time",
        utc: "UTC+09:00",
        mobileCode: "+82",
      },
      {
        name: "Kosovo",
        code: "XK",
        timezone: "Central European Standard Time",
        utc: "UTC+01:00",
        mobileCode: "+",
      },
      {
        name: "Kuwait",
        code: "KW",
        timezone: "Arab Standard Time",
        utc: "UTC+03:00",
        mobileCode: "+965",
      },
      {
        name: "Kyrgyzstan",
        code: "KG",
        timezone: "Central Asia Standard Time",
        utc: "UTC+06:00",
        mobileCode: "+996",
      },
      {
        name: "Laos",
        code: "LA",
        timezone: "SE Asia Standard Time",
        utc: "UTC+07:00",
        mobileCode: "+856",
      },
      {
        name: "Latvia",
        code: "LV",
        timezone: "FLE Standard Time",
        utc: "UTC+02:00",
        mobileCode: "+371",
      },
      {
        name: "Lebanon",
        code: "LB",
        timezone: "Middle East Standard Time",
        utc: "UTC+02:00",
        mobileCode: "+961",
      },
      {
        name: "Lesotho",
        code: "LS",
        timezone: "South Africa Standard Time",
        utc: "UTC+02:00",
        mobileCode: "+266",
      },
      {
        name: "Liberia",
        code: "LR",
        timezone: "Greenwich Standard Time",
        utc: "UTC",
        mobileCode: "+231",
      },
      {
        name: "Libya",
        code: "LY",
        timezone: "E. Europe Standard Time",
        utc: "UTC+02:00",
        mobileCode: "+218",
      },
      {
        name: "Liechtenstein",
        code: "LI",
        timezone: "W. Europe Standard Time",
        utc: "UTC+01:00",
        mobileCode: "+423",
      },
      {
        name: "Lithuania",
        code: "LT",
        timezone: "FLE Standard Time",
        utc: "UTC+02:00",
        mobileCode: "+370",
      },
      {
        name: "Luxembourg",
        code: "LU",
        timezone: "W. Europe Standard Time",
        utc: "UTC+01:00",
        mobileCode: "+352",
      },
      {
        name: "Macao SAR",
        code: "MO",
        timezone: "China Standard Time",
        utc: "UTC+08:00",
        mobileCode: "+853",
      },
      {
        name: "Macedonia, Former Yugoslav Republic of",
        code: "MK",
        timezone: "Central European Standard Time",
        utc: "UTC+01:00",
        mobileCode: "+389",
      },
      {
        name: "Madagascar",
        code: "MG",
        timezone: "E. Africa Standard Time",
        utc: "UTC+03:00",
        mobileCode: "+261",
      },
      {
        name: "Malawi",
        code: "MW",
        timezone: "South Africa Standard Time",
        utc: "UTC+02:00",
        mobileCode: "+265",
      },
      {
        name: "Malaysia",
        code: "MY",
        timezone: "Singapore Standard Time",
        utc: "UTC+08:00",
        mobileCode: "+60",
      },
      {
        name: "Maldives",
        code: "MV",
        timezone: "West Asia Standard Time",
        utc: "UTC+05:00",
        mobileCode: "+960",
      },
      {
        name: "Mali",
        code: "ML",
        timezone: "Greenwich Standard Time",
        utc: "UTC",
        mobileCode: "+223",
      },
      {
        name: "Malta",
        code: "MT",
        timezone: "W. Europe Standard Time",
        utc: "UTC+01:00",
        mobileCode: "+356",
      },
      {
        name: "Man, Isle of",
        code: "IM",
        timezone: "GMT Standard Time",
        utc: "UTC",
        mobileCode: "+44-1624",
      },
      {
        name: "Marshall Islands",
        code: "MH",
        timezone: "UTC+12",
        utc: "UTC+12:00",
        mobileCode: "+692",
      },
      {
        name: "Martinique",
        code: "MQ",
        timezone: "SA Western Standard Time",
        utc: "UTC-04:00",
        mobileCode: "+596",
      },
      {
        name: "Mauritania",
        code: "MR",
        timezone: "Greenwich Standard Time",
        utc: "UTC",
        mobileCode: "+222",
      },
      {
        name: "Mauritius",
        code: "MU",
        timezone: "Mauritius Standard Time",
        utc: "UTC+04:00",
        mobileCode: "+230",
      },
      {
        name: "Mayotte",
        code: "YT",
        timezone: "E. Africa Standard Time",
        utc: "UTC+03:00",
        mobileCode: "+262",
      },
      {
        name: "Mexico",
        code: "MX",
        timezone: "Central Standard Time (Mexico)",
        utc: "UTC-06:00",
        mobileCode: "+52",
      },
      {
        name: "Micronesia",
        code: "FM",
        timezone: "West Pacific Standard Time",
        utc: "UTC+10:00",
        mobileCode: "+691",
      },
      {
        name: "Moldova",
        code: "MD",
        timezone: "GTB Standard Time",
        utc: "UTC+02:00",
        mobileCode: "+373",
      },
      {
        name: "Monaco",
        code: "MC",
        timezone: "W. Europe Standard Time",
        utc: "UTC+01:00",
        mobileCode: "+377",
      },
      {
        name: "Mongolia",
        code: "MN",
        timezone: "Ulaanbaatar Standard Time",
        utc: "UTC+08:00",
        mobileCode: "+976",
      },
      {
        name: "Montenegro",
        code: "ME",
        timezone: "Central European Standard Time",
        utc: "UTC+01:00",
        mobileCode: "+382",
      },
      {
        name: "Montserrat",
        code: "MS",
        timezone: "SA Western Standard Time",
        utc: "UTC-04:00",
        mobileCode: "+1-664",
      },
      {
        name: "Morocco",
        code: "MA",
        timezone: "Morocco Standard Time",
        utc: "UTC",
        mobileCode: "+212",
      },
      {
        name: "Mozambique",
        code: "MZ",
        timezone: "South Africa Standard Time",
        utc: "UTC+02:00",
        mobileCode: "+258",
      },
      {
        name: "Myanmar",
        code: "MM",
        timezone: "Myanmar Standard Time",
        utc: "UTC+06:30",
        mobileCode: "+95",
      },
      {
        name: "Namibia",
        code: "NA",
        timezone: "Namibia Standard Time",
        utc: "UTC+01:00",
        mobileCode: "+264",
      },
      {
        name: "Nauru",
        code: "NR",
        timezone: "UTC+12",
        utc: "UTC+12:00",
        mobileCode: "+674",
      },
      {
        name: "Nepal",
        code: "NP",
        timezone: "Nepal Standard Time",
        utc: "UTC+05:45",
        mobileCode: "+977",
      },
      {
        name: "Netherlands",
        code: "NL",
        timezone: "W. Europe Standard Time",
        utc: "UTC+01:00",
        mobileCode: "+31",
      },
      {
        name: "New Caledonia",
        code: "NC",
        timezone: "Central Pacific Standard Time",
        utc: "UTC+11:00",
        mobileCode: "+687",
      },
      {
        name: "New Zealand",
        code: "NZ",
        timezone: "New Zealand Standard Time",
        utc: "UTC+12:00",
        mobileCode: "+64",
      },
      {
        name: "Nicaragua",
        code: "NI",
        timezone: "Central America Standard Time",
        utc: "UTC-06:00",
        mobileCode: "+505",
      },
      {
        name: "Niger",
        code: "NE",
        timezone: "W. Central Africa Standard Time",
        utc: "UTC+01:00",
        mobileCode: "+227",
      },
      {
        name: "Nigeria",
        code: "NG",
        timezone: "W. Central Africa Standard Time",
        utc: "UTC+01:00",
        mobileCode: "+234",
      },
      {
        name: "Niue",
        code: "NU",
        timezone: "UTC-11",
        utc: "UTC-11:00",
        mobileCode: "+683",
      },
      {
        name: "Norfolk Island",
        code: "NF",
        timezone: "Central Pacific Standard Time",
        utc: "UTC+11:00",
        mobileCode: "+672",
      },
      {
        name: "North Korea",
        code: "KP",
        timezone: "Korea Standard Time",
        utc: "UTC+09:00",
        mobileCode: "+850",
      },
      {
        name: "Northern Mariana Islands",
        code: "MP",
        timezone: "West Pacific Standard Time",
        utc: "UTC+10:00",
        mobileCode: "+1-670",
      },
      {
        name: "Norway",
        code: "NO",
        timezone: "W. Europe Standard Time",
        utc: "UTC+01:00",
        mobileCode: "+47",
      },
      {
        name: "Oman",
        code: "OM",
        timezone: "Arabian Standard Time",
        utc: "UTC+04:00",
        mobileCode: "+968",
      },
      {
        name: "Pakistan",
        code: "PK",
        timezone: "Pakistan Standard Time",
        utc: "UTC+05:00",
        mobileCode: "+92",
      },
      {
        name: "Palau",
        code: "PW",
        timezone: "Tokyo Standard Time",
        utc: "UTC+09:00",
        mobileCode: "+680",
      },
      {
        name: "Palestinian Authority",
        code: "PS",
        timezone: "Egypt Standard Time",
        utc: "UTC+02:00",
        mobileCode: "+970",
      },
      {
        name: "Panama",
        code: "PA",
        timezone: "SA Pacific Standard Time",
        utc: "UTC-05:00",
        mobileCode: "+507",
      },
      {
        name: "Papua New Guinea",
        code: "PG",
        timezone: "West Pacific Standard Time",
        utc: "UTC+10:00",
        mobileCode: "+675",
      },
      {
        name: "Paraguay",
        code: "PY",
        timezone: "Paraguay Standard Time",
        utc: "UTC-04:00",
        mobileCode: "+595",
      },
      {
        name: "Peru",
        code: "PE",
        timezone: "SA Pacific Standard Time",
        utc: "UTC-05:00",
        mobileCode: "+51",
      },
      {
        name: "Philippines",
        code: "PH",
        timezone: "Singapore Standard Time",
        utc: "UTC+08:00",
        mobileCode: "+63",
      },
      {
        name: "Pitcairn Islands",
        code: "PN",
        timezone: "Pacific Standard Time",
        utc: "UTC-08:00",
        mobileCode: "+870",
      },
      {
        name: "Poland",
        code: "PL",
        timezone: "Central European Standard Time",
        utc: "UTC+01:00",
        mobileCode: "+48",
      },
      {
        name: "Portugal",
        code: "PT",
        timezone: "GMT Standard Time",
        utc: "UTC",
        mobileCode: "+351",
      },
      {
        name: "Puerto Rico",
        code: "PR",
        timezone: "SA Western Standard Time",
        utc: "UTC-04:00",
        mobileCode: "+1-787 and 1-939",
      },
      {
        name: "Qatar",
        code: "QA",
        timezone: "Arab Standard Time",
        utc: "UTC+03:00",
        mobileCode: "+974",
      },
      {
        name: "Reunion",
        code: "RE",
        timezone: "Mauritius Standard Time",
        utc: "UTC+04:00",
        mobileCode: "+262",
      },
      {
        name: "Romania",
        code: "RO",
        timezone: "GTB Standard Time",
        utc: "UTC+02:00",
        mobileCode: "+40",
      },
      {
        name: "Russia",
        code: "RU",
        timezone: "Russian Standard Time",
        utc: "UTC+03:00",
        mobileCode: "+7",
      },
      {
        name: "Rwanda",
        code: "RW",
        timezone: "South Africa Standard Time",
        utc: "UTC+02:00",
        mobileCode: "+250",
      },
      {
        name: "Saint Barthélemy",
        code: "BL",
        timezone: "SA Western Standard Time",
        utc: "UTC-04:00",
        mobileCode: "+590",
      },
      {
        name: "Saint Helena, Ascension and Tristan da Cunha",
        code: "SH",
        timezone: "Greenwich Standard Time",
        utc: "UTC",
        mobileCode: "+290",
      },
      {
        name: "Saint Kitts and Nevis",
        code: "KN",
        timezone: "SA Western Standard Time",
        utc: "UTC-04:00",
        mobileCode: "+1-869",
      },
      {
        name: "Saint Lucia",
        code: "LC",
        timezone: "SA Western Standard Time",
        utc: "UTC-04:00",
        mobileCode: "+1-758",
      },
      {
        name: "Saint Martin (French part)",
        code: "MF",
        timezone: "SA Western Standard Time",
        utc: "UTC-04:00",
        mobileCode: "+590",
      },
      {
        name: "Saint Pierre and Miquelon",
        code: "PM",
        timezone: "Greenland Standard Time",
        utc: "UTC-03:00",
        mobileCode: "+508",
      },
      {
        name: "Saint Vincent and the Grenadines",
        code: "VC",
        timezone: "SA Western Standard Time",
        utc: "UTC-04:00",
        mobileCode: "+1-784",
      },
      {
        name: "Samoa",
        code: "WS",
        timezone: "Samoa Standard Time",
        utc: "UTC+13:00",
        mobileCode: "+685",
      },
      {
        name: "San Marino",
        code: "SM",
        timezone: "W. Europe Standard Time",
        utc: "UTC+01:00",
        mobileCode: "+378",
      },
      {
        name: "São Tomé and Príncipe",
        code: "ST",
        timezone: "Greenwich Standard Time",
        utc: "UTC",
        mobileCode: "+239",
      },
      {
        name: "Saudi Arabia",
        code: "SA",
        timezone: "Arab Standard Time",
        utc: "UTC+03:00",
        mobileCode: "+966",
      },
      {
        name: "Senegal",
        code: "SN",
        timezone: "Greenwich Standard Time",
        utc: "UTC",
        mobileCode: "+221",
      },
      {
        name: "Serbia",
        code: "RS",
        timezone: "Central Europe Standard Time",
        utc: "UTC+01:00",
        mobileCode: "+381",
      },
      {
        name: "Seychelles",
        code: "SC",
        timezone: "Mauritius Standard Time",
        utc: "UTC+04:00",
        mobileCode: "+248",
      },
      {
        name: "Sierra Leone",
        code: "SL",
        timezone: "Greenwich Standard Time",
        utc: "UTC",
        mobileCode: "+232",
      },
      {
        name: "Singapore",
        code: "SG",
        timezone: "Singapore Standard Time",
        utc: "UTC+08:00",
        mobileCode: "+65",
      },
      {
        name: "Sint Maarten (Dutch part)",
        code: "SX",
        timezone: "SA Western Standard Time",
        utc: "UTC-04:00",
        mobileCode: "+599",
      },
      {
        name: "Slovakia",
        code: "SK",
        timezone: "Central Europe Standard Time",
        utc: "UTC+01:00",
        mobileCode: "+421",
      },
      {
        name: "Slovenia",
        code: "SI",
        timezone: "Central Europe Standard Time",
        utc: "UTC+01:00",
        mobileCode: "+386",
      },
      {
        name: "Solomon Islands",
        code: "SB",
        timezone: "Central Pacific Standard Time",
        utc: "UTC+11:00",
        mobileCode: "+677",
      },
      {
        name: "Somalia",
        code: "SO",
        timezone: "E. Africa Standard Time",
        utc: "UTC+03:00",
        mobileCode: "+252",
      },
      {
        name: "South Africa",
        code: "ZA",
        timezone: "South Africa Standard Time",
        utc: "UTC+02:00",
        mobileCode: "+27",
      },
      {
        name: "South Georgia and the South Sandwich Islands",
        code: "GS",
        timezone: "UTC-02",
        utc: "UTC-02:00",
        mobileCode: "+",
      },
      {
        name: "South Sudan",
        code: "SS",
        timezone: "E. Africa Standard Time",
        utc: "UTC+03:00",
        mobileCode: "+211",
      },
      {
        name: "Spain",
        code: "ES",
        timezone: "Romance Standard Time",
        utc: "UTC+01:00",
        mobileCode: "+34",
      },
      {
        name: "Sri Lanka",
        code: "LK",
        timezone: "Sri Lanka Standard Time",
        utc: "UTC+05:30",
        mobileCode: "+94",
      },
      {
        name: "Sudan",
        code: "SD",
        timezone: "E. Africa Standard Time",
        utc: "UTC+03:00",
        mobileCode: "+249",
      },
      {
        name: "Suriname",
        code: "SR",
        timezone: "SA Eastern Standard Time",
        utc: "UTC-03:00",
        mobileCode: "+597",
      },
      {
        name: "Svalbard",
        code: "SJ",
        timezone: "W. Europe Standard Time",
        utc: "UTC+01:00",
        mobileCode: "+47",
      },
      {
        name: "Swaziland",
        code: "SZ",
        timezone: "South Africa Standard Time",
        utc: "UTC+02:00",
        mobileCode: "+268",
      },
      {
        name: "Sweden",
        code: "SE",
        timezone: "W. Europe Standard Time",
        utc: "UTC+01:00",
        mobileCode: "+46",
      },
      {
        name: "Switzerland",
        code: "CH",
        timezone: "W. Europe Standard Time",
        utc: "UTC+01:00",
        mobileCode: "+41",
      },
      {
        name: "Syria",
        code: "SY",
        timezone: "Syria Standard Time",
        utc: "UTC+02:00",
        mobileCode: "+963",
      },
      {
        name: "Taiwan",
        code: "TW",
        timezone: "Taipei Standard Time",
        utc: "UTC+08:00",
        mobileCode: "+886",
      },
      {
        name: "Tajikistan",
        code: "TJ",
        timezone: "West Asia Standard Time",
        utc: "UTC+05:00",
        mobileCode: "+992",
      },
      {
        name: "Tanzania",
        code: "TZ",
        timezone: "E. Africa Standard Time",
        utc: "UTC+03:00",
        mobileCode: "+255",
      },
      {
        name: "Thailand",
        code: "TH",
        timezone: "SE Asia Standard Time",
        utc: "UTC+07:00",
        mobileCode: "+66",
      },
      {
        name: "Togo",
        code: "TG",
        timezone: "Greenwich Standard Time",
        utc: "UTC",
        mobileCode: "+228",
      },
      {
        name: "Tokelau",
        code: "TK",
        timezone: "Tonga Standard Time",
        utc: "UTC+13:00",
        mobileCode: "+690",
      },
      {
        name: "Tonga",
        code: "TO",
        timezone: "Tonga Standard Time",
        utc: "UTC+13:00",
        mobileCode: "+676",
      },
      {
        name: "Trinidad and Tobago",
        code: "TT",
        timezone: "SA Western Standard Time",
        utc: "UTC-04:00",
        mobileCode: "+1-868",
      },
      {
        name: "Tunisia",
        code: "TN",
        timezone: "W. Central Africa Standard Time",
        utc: "UTC+01:00",
        mobileCode: "+216",
      },
      {
        name: "Turkey",
        code: "TR",
        timezone: "Turkey Standard Time",
        utc: "UTC+02:00",
        mobileCode: "+90",
      },
      {
        name: "Turkmenistan",
        code: "TM",
        timezone: "West Asia Standard Time",
        utc: "UTC+05:00",
        mobileCode: "+993",
      },
      {
        name: "Turks and Caicos Islands",
        code: "TC",
        timezone: "Eastern Standard Time",
        utc: "UTC-05:00",
        mobileCode: "+1-649",
      },
      {
        name: "Tuvalu",
        code: "TV",
        timezone: "UTC+12",
        utc: "UTC+12:00",
        mobileCode: "+688",
      },
      {
        name: "U.S. Minor Outlying Islands",
        code: "UM",
        timezone: "UTC-11",
        utc: "UTC-11:00",
        mobileCode: "+1",
      },
      {
        name: "Uganda",
        code: "UG",
        timezone: "E. Africa Standard Time",
        utc: "UTC+03:00",
        mobileCode: "+256",
      },
      {
        name: "Ukraine",
        code: "UA",
        timezone: "FLE Standard Time",
        utc: "UTC+02:00",
        mobileCode: "+380",
      },
      {
        name: "United Arab Emirates",
        code: "AE",
        timezone: "Arabian Standard Time",
        utc: "UTC+04:00",
        mobileCode: "+971",
      },
      {
        name: "United Kingdom",
        code: "GB",
        timezone: "GMT Standard Time",
        utc: "UTC",
        mobileCode: "+44",
      },
      {
        name: "United States",
        code: "US",
        timezone: "Pacific Standard Time",
        utc: "UTC-08:00",
        mobileCode: "+1",
      },
      {
        name: "Uruguay",
        code: "UY",
        timezone: "Montevideo Standard Time",
        utc: "UTC-03:00",
        mobileCode: "+598",
      },
      {
        name: "Uzbekistan",
        code: "UZ",
        timezone: "West Asia Standard Time",
        utc: "UTC+05:00",
        mobileCode: "+998",
      },
      {
        name: "Vanuatu",
        code: "VU",
        timezone: "Central Pacific Standard Time",
        utc: "UTC+11:00",
        mobileCode: "+678",
      },
      {
        name: "Vatican City",
        code: "VA",
        timezone: "W. Europe Standard Time",
        utc: "UTC+01:00",
        mobileCode: "+379",
      },
      {
        name: "Vietnam",
        code: "VN",
        timezone: "SE Asia Standard Time",
        utc: "UTC+07:00",
        mobileCode: "+84",
      },
      {
        name: "Virgin Islands, U.S.",
        code: "VI",
        timezone: "SA Western Standard Time",
        utc: "UTC-04:00",
        mobileCode: "+1-340",
      },
      {
        name: "Virgin Islands, British",
        code: "VG",
        timezone: "SA Western Standard Time",
        utc: "UTC-04:00",
        mobileCode: "+1-284",
      },
      {
        name: "Wallis and Futuna",
        code: "WF",
        timezone: "UTC+12",
        utc: "UTC+12:00",
        mobileCode: "+681",
      },
      {
        name: "Yemen",
        code: "YE",
        timezone: "Arab Standard Time",
        utc: "UTC+03:00",
        mobileCode: "+967",
      },
      {
        name: "Zambia",
        code: "ZM",
        timezone: "South Africa Standard Time",
        utc: "UTC+02:00",
        mobileCode: "+260",
      },
      {
        name: "Zimbabwe",
        code: "ZW",
        timezone: "South Africa Standard Time",
        utc: "UTC+02:00",
        mobileCode: "+263",
      },
    ];
    $.each(COUNTRIES, function (index, country) {
      $("#country-select").append(
        $("<option>").val(country.code).text(country.name)
      );
    });
  });
})(jQuery);
