let timeoutID;

function getSessionLifetime() {
    if (document.getElementById('session-lifetime')) {
        return document.getElementById('session-lifetime').value;
    }
    return 0
}

const resetSessionLifetimeTimer = () => {
    let sessionLifetime = getSessionLifetime();
    clearTimeout(timeoutID);
    timeoutID = setTimeout(function () {
        if (getSessionLifetime() === 0) return
        $.ajax({
            url: "/logout",
            method: "POST",
        });
        window.location.href = document.getElementById('close-session').value;

    }, sessionLifetime * 60000);
};
window.addEventListener("load", () => {
    resetSessionLifetimeTimer();
    document.addEventListener("mousemove", resetSessionLifetimeTimer);
    document.addEventListener("wheel", resetSessionLifetimeTimer);
});
