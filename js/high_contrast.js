//----------------------------
//----- ALTO CONTRASTE -------
//----------------------------

$(document).ready(function() {

    // Check the 'altocontraste' cookie status
    let altoContraste = Cookies.get('altocontraste');
    const logo = $("#amaweb img");

    function updateLogo(highContrastEnabled) {
        if (highContrastEnabled) {
            logo.attr("src", "img/navbar-logo-horizontal-alto-contraste.svg");
        } else {
            logo.attr("src", "img/navbar-logo-horizontal.svg");
        }
    }

    if (!altoContraste) {
        Cookies.set('altocontraste', 'false');
    } else if (altoContraste === 'true') {
        $("body").addClass("alto-contraste");
        $("#high_contrast").attr("aria-checked", "true");
        updateLogo(true);
    }

    // Toggle high contrast mode and logo image when the button is clicked
    $("#high_contrast").click(function () {
        const isChecked = $("#high_contrast").attr("aria-checked") === 'true';

        if (isChecked) {
            $("body").removeClass("alto-contraste");
            $("#high_contrast").attr("aria-checked", "false");
            Cookies.set('altocontraste', 'false');
            updateLogo(false);
        } else {
            $("body").addClass("alto-contraste");
            $("#high_contrast").attr("aria-checked", "true");
            Cookies.set('altocontraste', 'true');
            updateLogo(true);
        }
    });
});


