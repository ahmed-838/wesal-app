document.getElementById("registerForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // التحقق من تطابق كلمتي المرور
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    // تخزين بيانات المستخدم في localStorage (مجرد مثال)
    const user = { username, email, password };
    localStorage.setItem("user", JSON.stringify(user));

    alert("Account created successfully!");
    window.location.href = "login";  // التوجيه إلى صفحة تسجيل الدخول بعد التسجيل
});
