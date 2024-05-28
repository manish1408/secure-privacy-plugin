(function ($) {
  $(document).ready(function () {
    $("#show-signup").click(function () {
      $("#signin-section").hide();
      $("#signup-section").show();
      $("#signin-title").hide();
      $("#signup-title").show();
    });

    $("#show-signin").click(function () {
      $("#signin-section").show();
      $("#signup-section").hide();
      $("#signin-title").show();
      $("#signup-title").hide();
    });

    function showLoading() {
      $("#signin-text").hide();
      $("#loader").show();
    }

    function hideLoading() {
      $("#loader").hide();
      $("#signin-text").show();
    }

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
        url: "https://api-prod.secureprivacy.ai/api/auth/login",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (response) {
          hideLoading();
          $("#signin-section").hide();
          $("#domain-section").show();
          console.log(response);
          if (response) {
            localStorage.setItem("ApiKey", response.ApiKey);
            localStorage.setItem("RefreshToken", response.RefreshToken);
            getDomains();
          } else {
            console.error("Token not found in response");
          }
        },
        error: function (error) {
          hideLoading();
          console.error("Error:", error);
        },
      });
    });
    function checkRegValidation() {
      let firstName = $("#reg-firstName").val();
      let lastName = $("#reg-lastName").val();
      let email = $("#reg-email").val();
      let password = $("#reg-password").val();
      let confimPassword = $("#reg-cnfPassword").val();
      let position = $("#reg-position").val();
      let company = $("#reg-company").val();
      let employeeSelect = $("#reg-employee-select").val();

      if (
        firstName !== "" &&
        lastName !== "" &&
        email !== "" &&
        password !== "" &&
        confimPassword !== "" &&
        position !== "" &&
        company !== "" &&
        employeeSelect !== ""
      ) {
        $("#signup-button").prop("disabled", false);
      } else {
        $("#signup-button").prop("disabled", true);
      }
    }

    $(
      "#reg-firstName,#reg-lastName,#reg-email, #reg-password,#reg-cnfPassword, #employee-select,#reg-company,#reg-position"
    ).on("input", function () {
      checkRegValidation();
    });

    function checkPasswordMatch() {
      let password = $("#reg-password").val();
      let confirmPassword = $("#reg-cnfPassword").val();

      if (
        password !== "" &&
        confirmPassword !== "" &&
        password !== confirmPassword
      ) {
        $("#password-mismatch").show();
        $("#signup-button").prop("disabled", true);
      } else {
        $("#password-mismatch").hide();
        $("#signup-button").prop("disabled", false);
      }
    }
    $("#reg-cnfPassword").on("input", function () {
      checkPasswordMatch();
    });
    $("#sigup-form").submit(function (e) {
      e.preventDefault();
      showLoading();
      let firstName = $("#reg-firstName").val();
      let lastName = $("#reg-lastName").val();
      let businessEmail = $("#reg-email").val();
      let password = $("#reg-password").val();
      let confirmPassword = $("#reg-cnfPassword").val();
      let position = $("#reg-position").val();
      let companyName = $("#reg-company").val();
      let numberOfEmployees = $("#reg-employee-select").val();

      let data = {
        firstName,
        lastName,
        businessEmail,
        password,
        confirmPassword,
        position,
        companyName,
        numberOfEmployees,
      };
      console.log(data);

      $.ajax({
        url: "https://api-prod.secureprivacy.ai/api/onboarding/register",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (response) {
          hideLoading();
          $("#signup-section").hide();
          $("#domain-section").show();
          console.log(response);
          if (response) {
            localStorage.setItem("ApiKey", response.ApiKey);
            localStorage.setItem("RefreshToken", response.RefreshToken);
            getDomains();
          } else {
            console.error("Token not found in response");
          }
        },
        error: function (error) {
          hideLoading();
          console.error("Error:", error);
        },
      });
    });
  });
  function getDomains() {
    const apiKey = localStorage.getItem("ApiKey");
    if (!apiKey) {
      console.error("ApiKey not found in local storage");
      return;
    }
    $.ajax({
      url: "https://api-prod.secureprivacy.ai/api/Domain?pageNumber=1&resultsPerPage=999999999",
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
          $.each(response.PagedResults, function (index, domain) {
            $("#domain-select").append(
              $("<option>").val(domain.Url).text(domain.Url)
            );
          });
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
    alert("Hello!");
    console.log("here");
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
      url: "https://api-prod.secureprivacy.ai/api/Domain",
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
        console.log("Domain connected successfully:", response);
      },
      error: function (error) {
        console.error("Error connecting domain:", error);
      },
    });
  });
})(jQuery);
