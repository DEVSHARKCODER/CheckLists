

document.getElementById('resetPasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        username: e.target.username.value,
        password: e.target.password.value,
        confirmPassword: e.target.confirmPassword.value,
    }

    // ตรวจสอบว่ามีฟิลด์ว่างหรือไม่
    if (!formData.username || !formData.password || !formData.confirmPassword) {
        Swal.fire({
            title: 'Warning!',
            text: 'กรุณากรอกข้อมูลให้ครบ!',
            icon: 'warning',
            confirmButtonText: 'ตกลง'
        });
        return;
    }

    // ตรวจสอบว่ารหัสผ่านและการยืนยันรหัสผ่านตรงกันหรือไม่
    if (formData.password !== formData.confirmPassword) {
        Swal.fire({
            title: 'Warning!',
            text: 'รหัสผ่านไม่ตรงกัน โปรดลองอีกครั้ง!',
            icon: 'warning',
            confirmButtonText: 'ตกลง'
        });
        e.target.password.value = '';
        e.target.confirmPassword.value = '';
        return;
    }

    try {
        // ส่งข้อมูลไปยังเซิร์ฟเวอร์
        const response = await axios.put('/resetpassword', formData);

        if (response.status === 200) {
            Swal.fire({
                title: 'สำเร็จ!',
                text: 'รีเซ็ตรหัสผ่านสำเร็จ!',
                icon: 'success',
                confirmButtonText: 'ตกลง'
            }).then(() => {
                window.location.href = '/login'; 
            });
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: 'เกิดข้อผิดพลาด!',
            text: error.response?.data?.message || 'เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน กรุณาลองใหม่อีกครั้ง.',
            icon: 'error',
            confirmButtonText: 'ตกลง'
        });
    }
});
