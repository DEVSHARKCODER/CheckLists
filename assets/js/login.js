const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const dataForm = {
        username: e.target.username.value,
        password: e.target.password.value
    };

    if (!dataForm.username || !dataForm.password) {
        Swal.fire({
            title: 'Warning!',
            text: 'กรุณากรอกข้อมูล!',
            icon: 'warning',
            confirmButtonText: 'ตกลง'
        });
        return; 
    }

    try {
        const response = await axios.post('/login', dataForm);
        if (response.status === 200) {
            const { id, fullname } = response.data.user;
            document.cookie = `userId=${id}; path=/`;
            document.cookie = `fullname=${encodeURIComponent(fullname)}; path=/`;

            Swal.fire({
                title: 'Success!',
                text: `เข้าสู่ระบบสำเร็จ! ยินดีต้อนรับคุณ ${fullname}`,
                icon: 'success',
                confirmButtonText: 'ตกลง'
            }).then(() => {
                window.location.href = '/';
            });
        }
    } catch (error) {
        console.error('Error during login:', error);
        const message = error.response?.data?.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง.';
        Swal.fire({
            title: 'Error!',
            text: message,
            icon: 'error',
            confirmButtonText: 'ตกลง'
        });
    }
});

