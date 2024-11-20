document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');

    registerForm.addEventListener('submit', function (e) {
        e.preventDefault(); // منع الإرسال الافتراضي للنموذج

        // استخراج القيم من الحقول
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const phoneNumber = document.getElementById('phone').value.trim(); // لاحظ أن الحقل يحمل id="phone"
        const password = document.getElementById('password').value.trim();
        const confirmPassword = document.getElementById('confirmPassword').value.trim();

        // التحقق من صحة البيانات
        if (!username || !email || !phoneNumber || !password || !confirmPassword) {
            alert('جميع الحقول مطلوبة.');
            return;
        }

        if (password !== confirmPassword) {
            alert('كلمتا المرور غير متطابقتين.');
            return;
        }

        // إرسال البيانات إلى الخادم
        fetch('http://localhost:3001/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                email,
                phoneNumber,
                password
            })
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.message || 'حدث خطأ أثناء تسجيل الحساب.');
                    });
                }
                return response.json();
            })
            .then(data => {
                alert(data.message || 'تم إنشاء الحساب بنجاح!');
                // إعادة توجيه المستخدم إذا لزم الأمر
                window.location.href = '/login';
            })
            .catch(error => {
                console.error('Error:', error.message);
                alert(error.message || 'حدث خطأ غير متوقع.');
            });
    });
});
