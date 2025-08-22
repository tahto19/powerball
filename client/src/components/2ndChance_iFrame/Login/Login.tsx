import "@/assets/elementor/css/frontend.min.css";
import "@/assets/elementor/css/post-6.css";
import "@/assets/elementor/css/post-45.css";
import "@/assets/elementor/css/post-126.css";
import "@/assets/elementor/css/post-231.css";
import "@/assets/elementor/css/post-514.css";

import * as React from "react";
// import { useNavigate } from "react-router-dom";

import TextField from "@mui/material/TextField";
import apiService from "@/services/apiService";

import { showToaster } from "@/redux/reducers/global/globalSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { localDecrypt, localEncrypt } from "@/utils/util";
const base_url = import.meta.env.VITE_API_BASE_URL;
const Login = () => {
  const dispatch = useAppDispatch();
  // const navigate = useNavigate();
  const { token } = useAppSelector((state) => state.token);

  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      if (!validateInputs()) return;
      if (emailError || passwordError) {
        return;
      }
      const formData = new FormData(event.currentTarget);

      const email = formData.get("email") as string; // ✅ Ensure it's a string
      const password = formData.get("password") as string;

      const res = await apiService.login({ email, password });

      if (res.data.result == "success") {
        // Redirect to dashboard after login
        // navigate("https://18.138.76.86/?page_id=279");
        if (rememberMe) {
          localStorage.setItem(
            "JqNw1q3HCK-90t4y", // email
            localEncrypt(email)
          );
          localStorage.setItem(
            "OM8Ovhw79G-90t4y", // password
            localEncrypt(password)
          );
        }
        window.parent.location.href = base_url + "cms/2nd-chance/";
      }

      dispatch(
        showToaster({
          message: "Login success!",
          show: true,
          variant: "success",
          icon: null,
        })
      );
    } catch (err) {
      dispatch(
        showToaster({
          err,
          show: true,
          variant: "error",
          icon: null,
        })
      );
    }
  };

  const validateInputs = () => {
    const email = document.getElementById("email") as HTMLInputElement;
    // const password = document.getElementById("password") as HTMLInputElement;

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    // if (!password.value || password.value.length < 6) {
    //     setPasswordError(true);
    //     setPasswordErrorMessage("Password must be at least 6 characters long.");
    //     isValid = false;
    // } else {
    //     setPasswordError(false);
    //     setPasswordErrorMessage("");
    // }
    setPasswordError(false);
    setPasswordErrorMessage("");
    return isValid;
  };
  // remember me
  const [rememberMe, setRememberMe] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  React.useEffect(() => {
    const saved = localStorage.getItem("jxRsOvNeq5-Remember_me") === "true";
    if (saved) {
      localStorage.getItem("jxRsOvNeq5-Remember_me") === "true";
    }
    if (saved) {
      let email = localDecrypt(localStorage.getItem("JqNw1q3HCK-90t4y"));
      let password = localDecrypt(localStorage.getItem("OM8Ovhw79G-90t4y"));
      setEmail(email);
      setPassword(password);
    }
    setRememberMe(saved);
  }, []);
  const handleRememberMe = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target?.checked);
    if (e.target?.checked) {
      localStorage.setItem("jxRsOvNeq5-Remember_me", "true");
    } else {
      localStorage.removeItem("jxRsOvNeq5-Remember_me");
    }
  };
  const handleSignUp = () => {
    window.parent.location.href = base_url + "create-an-account/";
  };
  React.useEffect(() => {
    if (token) {
      window.parent.location.href = base_url + "secondchance/";
    }
  }, [token]);

  return (
    <>
      <div
        id="iframe-login"
        className="wp-singular page-template-default page page-id-514 wp-embed-responsive wp-theme-hello-elementor theme-default elementor-default elementor-kit-6 elementor-page elementor-page-514 elementor-page-231 e--ua-blink e--ua-chrome e--ua-webkit"
      >
        <div
          data-elementor-type="single-page"
          data-elementor-id="231"
          className="elementor elementor-231 elementor-location-single post-514 page type-page status-publish hentry"
          data-elementor-post-type="elementor_library"
        >
          <div
            className="elementor-element elementor-element-57efaa3 e-con-full e-flex wpr-particle-no wpr-jarallax-no wpr-parallax-no wpr-sticky-section-no e-con e-parent e-lazyloaded"
            data-id="57efaa3"
            data-element_type="container"
            data-settings='{"_ha_eqh_enable":false}'
          >
            <div
              className="elementor-element elementor-element-09d7466 elementor-widget elementor-widget-theme-post-content"
              data-id="09d7466"
              data-element_type="widget"
              data-widget_type="theme-post-content.default"
            >
              <div className="elementor-widget-container">
                <div
                  data-elementor-type="wp-page"
                  data-elementor-id="514"
                  className="elementor elementor-514"
                  data-elementor-settings='{"ha_cmc_init_switcher":"no"}'
                  data-elementor-post-type="page"
                >
                  {/* <div
                    className="elementor-element elementor-element-7fa96ec e-flex e-con-boxed wpr-particle-no wpr-jarallax-no wpr-parallax-no wpr-sticky-section-no e-con e-parent e-lazyloaded"
                    data-id="7fa96ec"
                    data-element_type="container"
                    data-settings='{"_ha_eqh_enable":false}'
                  >
                    <div className="e-con-inner"></div>
                  </div> */}
                  <section
                    className="elementor-section elementor-top-section elementor-element elementor-element-4b9d4b03 elementor-section-content-middle elementor-section-boxed elementor-section-height-default elementor-section-height-default wpr-particle-no wpr-jarallax-no wpr-parallax-no wpr-sticky-section-no"
                    data-id="4b9d4b03"
                    data-element_type="section"
                    data-settings='{"background_background":"classic","_ha_eqh_enable":false}'
                  >
                    <div className="elementor-container elementor-column-gap-default">
                      <div
                        className="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-20b54d12"
                        data-id="20b54d12"
                        data-element_type="column"
                        data-settings='{"background_background":"classic"}'
                      >
                        <div className="elementor-widget-wrap elementor-element-populated">
                          <div
                            className="elementor-element elementor-element-938a465 elementor-widget elementor-widget-login"
                            data-id="938a465"
                            data-element_type="widget"
                            data-widget_type="login.default"
                          >
                            <div className="elementor-widget-container">
                              <form
                                className="elementor-login elementor-form"
                                onSubmit={handleSubmit}
                              >
                                <input
                                  type="hidden"
                                  name="redirect_to"
                                  value="/?page_id=514"
                                />
                                <div className="elementor-form-fields-wrapper">
                                  <div className="elementor-field-type-text elementor-field-group elementor-column elementor-col-100 elementor-field-required">
                                    <label
                                      htmlFor="user-938a465"
                                      className="elementor-field-label"
                                    >
                                      Username or Email Address
                                    </label>
                                    <TextField
                                      value={email}
                                      onChange={(e) => {
                                        setEmail(e.target.value);
                                      }}
                                      error={emailError}
                                      helperText={emailErrorMessage}
                                      id="email"
                                      type="email"
                                      name="email"
                                      placeholder="your@email.com"
                                      autoFocus
                                      required
                                      fullWidth
                                      size="small"
                                      variant="outlined"
                                      color={emailError ? "error" : "primary"}
                                    />
                                  </div>
                                  <div className="elementor-field-type-text elementor-field-group elementor-column elementor-col-100 elementor-field-required">
                                    <label
                                      htmlFor="password-938a465"
                                      className="elementor-field-label"
                                    >
                                      Password
                                    </label>
                                    <TextField
                                      value={password}
                                      onChange={(e) => {
                                        setPassword(e.target.value);
                                      }}
                                      error={passwordError}
                                      helperText={passwordErrorMessage}
                                      name="password"
                                      placeholder="••••••"
                                      type="password"
                                      id="password"
                                      autoFocus
                                      required
                                      fullWidth
                                      size="small"
                                      variant="outlined"
                                      color={
                                        passwordError ? "error" : "primary"
                                      }
                                    />
                                  </div>

                                  <div className="elementor-field-type-checkbox elementor-field-group elementor-column elementor-col-100 elementor-remember-me">
                                    <label htmlFor="elementor-login-remember-me">
                                      <input
                                        onChange={(
                                          e: React.ChangeEvent<HTMLInputElement>
                                        ) => {
                                          // const checked = e.target.checked;
                                          handleRememberMe(e);
                                        }}
                                        checked={rememberMe}
                                        type="checkbox"
                                        id="elementor-login-remember-me"
                                        name="rememberme"
                                        value="forever"
                                      />
                                      Remember Me
                                    </label>
                                  </div>

                                  <div className="elementor-field-group elementor-column elementor-field-type-submit elementor-col-100">
                                    <button
                                      type="submit"
                                      className="elementor-size-sm elementor-button"
                                      name="wp-submit"
                                    >
                                      <span className="elementor-button-text">
                                        Log In
                                      </span>
                                    </button>
                                  </div>

                                  <div className="elementor-field-group elementor-column elementor-col-100">
                                    <a
                                      className="elementor-lost-password"
                                      href="#"
                                      onClick={() => {
                                        window.parent.location.href =
                                          base_url +
                                          "member-area/forgot-password/";
                                      }}
                                    >
                                      Lost your password?{" "}
                                    </a>
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-483ef2bd"
                        data-id="483ef2bd"
                        data-element_type="column"
                        data-settings='{"background_background":"classic"}'
                      >
                        <div className="elementor-widget-wrap elementor-element-populated">
                          <div className="elementor-background-overlay"></div>
                          <div
                            className="elementor-element elementor-element-4ee2ac6b elementor-widget elementor-widget-ha-gradient-heading happy-addon ha-gradient-heading"
                            data-id="4ee2ac6b"
                            data-element_type="widget"
                            data-widget_type="ha-gradient-heading.default"
                          >
                            <div className="elementor-widget-container">
                              <h1 className="ha-gradient-heading">
                                Sign Up for an Account
                              </h1>{" "}
                            </div>
                          </div>
                          <div
                            className="elementor-element elementor-element-6f398ca elementor-align-center elementor-widget elementor-widget-button"
                            data-id="6f398ca"
                            data-element_type="widget"
                            data-widget_type="button.default"
                          >
                            <div className="elementor-widget-container">
                              <div className="elementor-button-wrapper">
                                <a
                                  onClick={() => handleSignUp()}
                                  className="elementor-button elementor-button-link elementor-size-sm"
                                >
                                  <span className="elementor-button-content-wrapper">
                                    <span className="elementor-button-text">
                                      Here
                                    </span>
                                  </span>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
