// import "@/assets/elementor/css/frontend.min.css";
// import "@/assets/elementor/css/post-6.css";
// import "@/assets/elementor/css/post-45.css";
// import "@/assets/elementor/css/post-126.css";
// import "@/assets/elementor/css/post-231.css";
// import "@/assets/elementor/css/post-456.css";
// import "@/assets/js/hello-frontend.min.js";
import "@/assets/js/iframe-func.js";

const widgetImage = () => {
    // window.addEventListener("message", (event) => {
    //     if (event.data.type === "resize" && event.data.height) {
    //         const iframe = document.getElementById("myButtonIframe");
    //         console.log(event.data.height)
    //         // if (iframe) {
    //         //     iframe.style.height = event.data.height + "px";
    //         //     console.log(event.data.height)
    //         // }
    //     }
    // });
    return (
        <>
            <div className="elementor-element elementor-element-4d89e254 e-flex e-con-boxed wpr-particle-no wpr-jarallax-no wpr-parallax-no wpr-sticky-section-no e-con e-child" data-id="4d89e254" data-element_type="container" data-settings="{&quot;background_background&quot;:&quot;classNameic&quot;,&quot;_ha_eqh_enable&quot;:false}">
                <div className="e-con-inner">
                    <div className="elementor-element elementor-element-93216a5 elementor-widget elementor-widget-image" data-id="93216a5" data-element_type="widget" data-settings="{&quot;ha_floating_fx&quot;:&quot;yes&quot;,&quot;ha_floating_fx_rotate_toggle&quot;:&quot;yes&quot;,&quot;ha_floating_fx_rotate_x&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:{&quot;from&quot;:0,&quot;to&quot;:0}},&quot;ha_floating_fx_rotate_y&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:{&quot;from&quot;:0,&quot;to&quot;:0}},&quot;ha_floating_fx_rotate_z&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:{&quot;from&quot;:-28,&quot;to&quot;:19}},&quot;ha_floating_fx_rotate_duration&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:1000,&quot;sizes&quot;:[]},&quot;ha_floating_fx_rotate_delay&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:[]}}" data-widget_type="image.default">
                        <div className="elementor-widget-container" style={{
                            willChange: 'transform; transform: rotateZ(18.3211deg)'
                        }}>
                            <img decoding="async" src="https://18.138.76.86/wp-content/uploads/elementor/thumbs/enter-ticket4-r4rf1xj0u4x818dg9ahomvmufzlemjd0zt9r2cwmww.png" title="enter ticket4" alt="enter ticket4" loading="lazy" />															</div>
                    </div>
                </div>
            </div>
            <iframe allowTransparency id="login-button-iframe" style={{
                position: 'relative',
                // height: '1px',
                // width: '1px'
            }} src="http://localhost:5173/iframe/2nd-chance/login-button"></iframe>
        </>
    );
}

export default widgetImage;