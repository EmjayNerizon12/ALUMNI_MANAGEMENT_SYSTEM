function logout() {

    if (!window.confirm('Are you sure you want to logout?')) return;
    else {

        window.location.href = "/";
        localStorage.removeItem("role");
        localStorage.removeItem("alumni_id");
    }
}
document.addEventListener('DOMContentLoaded', function () {
    // const userRoleSpan = document.querySelector('.user-role');

    // Get the role from localStorage
    const role = localStorage.getItem('role'); // replace 'role' with your key

    // Set the span text
    // userRoleSpan.textContent = role ? role : 'Guest';
    if (role != "Admin") window.location.href = "/";
});