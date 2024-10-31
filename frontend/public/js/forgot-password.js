document.getElementById("forgotPasswordForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    
    // التحقق من أن البريد الإلكتروني مسجل
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.email === email) {
        alert("Password reset link sent to your email.");
        // هنا يمكن إرسال إيميل استعادة كلمة المرور (مجرد تنبيه في هذا المثال)
    } else {
        alert("No account found with this email.");
    }
});
