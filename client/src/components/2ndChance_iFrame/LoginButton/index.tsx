import "@/assets/elementor/css/frontend.min.css";
import "@/assets/elementor/css/post-6.css";
import "@/assets/elementor/css/post-45.css";
import "@/assets/elementor/css/post-126.css";
import "@/assets/elementor/css/post-231.css";
import "@/assets/elementor/css/post-456.css";
import "@/assets/js/hello-frontend.min.js";
import { useEffect } from "react";

const loginButton = () => {
    useEffect(() => {
        const sendHeight = () => {
            const el = document.getElementById("iframe-login-button");
            if (el) {
                const height = el.getBoundingClientRect().height;
                const width = el.getBoundingClientRect().width;

                const myStyle = {
                    height,
                    width
                }
                window.parent.postMessage({ iframeStyle: myStyle }, "*");
            }
        };

        sendHeight();
        window.addEventListener("resize", sendHeight);

        return () => {
            window.removeEventListener("resize", sendHeight);
        };
    }, []);
    return (
        <>
            <div style={{
                display: 'flex',
                height: 'auto',
                padding: 0,
                width: 'fit-content'
            }} className="elementor-element elementor-element-40476c6 e-con-full e-flex wpr-particle-no wpr-jarallax-no wpr-parallax-no wpr-sticky-section-no e-con e-child" data-id="40476c6" data-element_type="container" data-settings="{&quot;_ha_eqh_enable&quot;:false}">
                <div className="elementor-element elementor-element-234f1629 elementor-align-right elementor-mobile-align-right elementor-widget elementor-widget-button" data-id="234f1629" data-element_type="widget" data-widget_type="button.default">
                    <div className="elementor-widget-container">
                        <div className="elementor-button-wrapper">
                            <a id="iframe-login-button" className="elementor-button elementor-button-link elementor-size-sm elementor-animation-grow" href="https://18.138.76.86/member-area/" target="_top" rel="noopener noreferrer">
                                <span className="elementor-button-content-wrapper">
                                    <span className="elementor-button-icon">
                                        <svg aria-hidden="true" className="e-font-icon-svg e-fas-angle-double-right" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34zm192-34l-136-136c-9.4-9.4-24.6-9.4-33.9 0l-22.6 22.6c-9.4 9.4-9.4 24.6 0 33.9l96.4 96.4-96.4 96.4c-9.4 9.4-9.4 24.6 0 33.9l22.6 22.6c9.4 9.4 24.6 9.4 33.9 0l136-136c9.4-9.2 9.4-24.4 0-33.8z"></path></svg>			</span>
                                    <span className="elementor-button-text">Log In</span>
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default loginButton;