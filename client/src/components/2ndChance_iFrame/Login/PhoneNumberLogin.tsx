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
import { delay, getMessage, localDecrypt, localEncrypt } from "@/utils/util";
import { Button } from "@mui/material";
import { toast } from "react-toastify";

import { MuiOtpInput } from "mui-one-time-password-input";

const base_url = import.meta.env.VITE_API_BASE_URL;
const PhoneNumberLogin = () => {
  const dispatch = useAppDispatch();
  // const navigate = useNavigate();
  const { token } = useAppSelector((state) => state.token);

  const [mobileNumberError, setMobileNumberError] = React.useState(false);
  const [mobileNumberErrorMessage, setMobileNumberErrorMessage] =
    React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [otp, setOTP] = React.useState("");
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      if (!validateInputs()) return;
      if (mobileNumberError || passwordError) {
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
            localEncrypt(mobileNumber)
          );
        }
        console.log("redirecting");

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
    const mobileNumber = document.getElementById(
      "mobileNumber"
    ) as HTMLInputElement;
    // const password = document.getElementById("password") as HTMLInputElement;

    let isValid = true;

    if (!mobileNumber.value || !/\S+@\S+\.\S+/.test(mobileNumber.value)) {
      setMobileNumberError(true);
      setMobileNumberErrorMessage("Please enter a mobile number.");
      isValid = false;
    } else {
      setMobileNumberError(false);
      setMobileNumberErrorMessage("");
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
    return isValid;
  };
  // remember me
  const [rememberMe, setRememberMe] = React.useState(false);

  const [mobileNumber, setMobileNumber] = React.useState("");

  React.useEffect(() => {
    const saved = localStorage.getItem("jxRsOvNeq5-Remember_me") === "true";
    if (saved) {
      localStorage.getItem("jxRsOvNeq5-Remember_me") === "true";
    }
    if (saved) {
      let email = localDecrypt(localStorage.getItem("JqNw1q3HCK-90t4y"));
      //   let password = localDecrypt(localStorage.getItem("OM8Ovhw79G-90t4y"));
      setMobileNumber(email);
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
  const [loadingBtn, setLoadingBtn] = React.useState(false);
  const [sentOtp, setSentOtp] = React.useState(false);
  const sendOTP = async () => {
    let tId = toast.loading("loading");
    setLoadingBtn(true);
    try {
      await delay(2000);
      toast.update(tId, {
        render:
          "We are sending a one-time password (OTP) to your mobile number and verifying your account. Please wait...",
        type: "info",
        autoClose: 3000,
      });
      let r_ = await apiService.postSentOtpForLogin(mobileNumber);

      await delay(1000);
      toast.update(tId, {
        render:
          "We’ve sent a one-time password (OTP) for this login to your mobile number.",
        type: "success",
        isLoading: false,
        closeButton: true,
      });

      if (r_.result === "success") {
        setSentOtp(true);
      }

      setLoadingBtn(false);
    } catch (err) {
      let message = getMessage(err);
      toast.update(tId, {
        render: message,
        type: "error",
        isLoading: false,
        closeButton: true,
      });
      setLoadingBtn(false);
    }
  };
  const handleLogin = async (number?: string) => {
    console.log(number);
    let tId = toast.loading("loading");
    setLoadingBtn(true);
    await delay(1000);
    try {
      let r_ = await apiService.postForMobileLogin(mobileNumber, number || otp);
      toast.update(tId, {
        render: "Successfully login please wait...",
        type: "success",
        isLoading: false,
        closeButton: true,
      });
      await delay(1000);
      if (r_.result == "success") {
        if (rememberMe) {
          localStorage.setItem(
            "JqNw1q3HCK-90t4y", // email
            localEncrypt(mobileNumber)
          );
        }
        // Redirect to dashboard after login
        // navigate("https://18.138.76.86/?page_id=279");
        window.parent.location.href = base_url + "cms/2nd-chance/";
      }
    } catch (err) {
      let message = getMessage(err);
      toast.update(tId, {
        render: message,
        type: "error",
        isLoading: false,
        closeButton: true,
      });
      setLoadingBtn(false);
    }
  };
  React.useEffect(() => {
    if (token) {
      console.log(token);
      window.parent.location.href = base_url + "cms/2nd-chance/";
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
                    <div
                      style={{ textAlign: "center" }}
                      className="elementor-widget-container"
                    >
                      <h1
                        style={{ color: "#2555A6" }}
                        className="ha-gradient-heading"
                      >
                        LOG IN YOUR ACCOUNT
                      </h1>{" "}
                    </div>
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
                                      Mobile Number
                                    </label>
                                    <TextField
                                      value={mobileNumber}
                                      onChange={(e) => {
                                        setMobileNumber(e.target.value);
                                      }}
                                      error={mobileNumberError}
                                      helperText={mobileNumberErrorMessage}
                                      id="mobileNumber"
                                      type="mobileNumber"
                                      name="mobileNumber"
                                      placeholder="6391 *** *** * / 091 *** *** *"
                                      autoFocus
                                      required
                                      fullWidth
                                      size="small"
                                      variant="outlined"
                                      color={
                                        mobileNumberError ? "error" : "primary"
                                      }
                                    />
                                  </div>
                                  {sentOtp && (
                                    <div className="elementor-field-type-text elementor-field-group elementor-column elementor-col-100 elementor-field-required">
                                      <label
                                        htmlFor="password-938a465"
                                        className="elementor-field-label"
                                      >
                                        Password
                                      </label>
                                      <MuiOtpInput
                                        value={otp}
                                        onChange={(e) => {
                                          setOTP(e);
                                          if (e.length === 6) {
                                            handleLogin(e);
                                          }
                                        }}
                                        length={6}
                                      />
                                      {/* <TextField
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
                                      /> */}
                                    </div>
                                  )}

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

                                  {!sentOtp ? (
                                    <div className="elementor-field-group elementor-column elementor-field-type-submit elementor-col-100">
                                      <Button
                                        className="text-color-white elementor-size-sm elementor-button"
                                        name="wp-submit"
                                        loading={loadingBtn}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          sendOTP();
                                        }}
                                      >
                                        <span className="elementor-button-text">
                                          Send OTP
                                        </span>
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="elementor-field-group elementor-column elementor-field-type-submit elementor-col-100">
                                      <Button
                                        className="text-color-white elementor-size-sm elementor-button"
                                        name="wp-submit"
                                        loading={loadingBtn}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleLogin();
                                        }}
                                      >
                                        <span className="elementor-button-text">
                                          Login
                                        </span>
                                      </Button>
                                    </div>
                                  )}

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
                                DON'T HAVE AN ACCOUNT YET?
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
                                  style={{
                                    backgroundColor: "red",
                                    padding: "12px 44px",
                                    borderRadius: "10px",
                                  }}
                                >
                                  <span className="elementor-button-content-wrapper">
                                    <span className="elementor-button-text">
                                      SIGN UP
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

export default PhoneNumberLogin;
