const regisForm = document.getElementById('registerForm');

regisForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        fullname: e.target.fullname.value,
        email: e.target.email.value,
        studentId: e.target.studentId.value,
        password: e.target.password.value,
        confirmPassword: e.target.confirmPassword.value
    };

    // ตรวจสอบว่ามีฟิลด์ว่างหรือไม่
    if (!formData.fullname || !formData.email || !formData.studentId || !formData.password || !formData.confirmPassword) {
        Swal.fire({
            title: 'Warning!',
            text: 'กรุณากรอกข้อมูลให้ครบทุกฟิลด์!',
            icon: 'warning',
            confirmButtonText: 'ตกลง'
        });
        return; // ออกจากฟังก์ชัน
    }

    // ตรวจสอบรหัสผ่านและการยืนยันรหัสผ่าน
    if (formData.password !== formData.confirmPassword) {
        Swal.fire({
            title: 'Warning!',
            text: 'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน!',
            icon: 'warning',
            confirmButtonText: 'ตกลง'
        });
        e.target.password.value = '';
        e.target.confirmPassword.value = '';
        return; // ออกจากฟังก์ชัน
    }

    // ดำเนินการลงทะเบียน
    try {
        const response = await axios.post('/register', formData);
        console.log('Success:', response.data);
        if (response.status === 201) {
            Swal.fire({
                title: 'สำเร็จ!',
                text: 'ลงทะเบียนสำเร็จ!',
                icon: 'success',
                confirmButtonText: 'ตกลง'
            }).then(() => {
                regisForm.reset(); 
                window.location.href = '/login';
            });
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: 'เกิดข้อผิดพลาด!',
            text: error.response?.data?.message || 'เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้ง.',
            icon: 'error',
            confirmButtonText: 'ตกลง'
        }).then(() => {
            regisForm.reset(); 
            window.location.href = '/login';
        });
    }
});
