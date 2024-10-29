document.getElementById('formlist').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = {
        username: document.querySelector('span[name="username"]').innerText,
        nameitem: event.target.nameitem.value,
        description: event.target.description.value,
        tags: event.target.tags.value, 
        notes: event.target.notes.value, 
        duedate: event.target.duedate.value
    };
    
    // Check Username First
    if (formData.username === 'Loading...' || formData.username === '' ||formData.username === 'ผู้ใช้ไม่ระบุ' || formData.username === 'null' || formData.username === 'undefined') {
        Swal.fire({
            title: 'Warning!',
            text: 'กรุณาเข้าสู่ระบบก่อน!',
            icon: 'warning',
            confirmButtonText: 'ตกลง'
        }).then((result) => {
            
            if (result.isConfirmed) {
                window.location.replace('/login'); 
                return;
            }
        });
        return;
    }
   
    // Check
    else if(!formData.nameitem || !formData.description || !formData.description ||formData.tags === '' || !formData.description || !formData.duedate){
        Swal.fire({
            title: 'Warning!',
            text: 'กรุณากรอกข้อมูลให้ครบ!',
            icon: 'warning',
            confirmButtonText: 'ตกลง'
        });
        return;
    }


    try {
        const response = await axios.post(`/addchecklists`, formData);
        console.log('Success:', response.data);
        
        if(response.status === 201){
            Swal.fire({
                title: 'Success!',
                text:  response.data.message,
                icon: 'success',
                confirmButtonText: 'ตกลง'
            });
        }
    } catch (error) {
        
        Swal.fire({
        title: 'Error!',
        text: 'เกิดข้อผิดพลาดในการเพิ่มรายการ กรุณาลองใหม่อีกครั้ง.',
        icon: 'error',
        confirmButtonText: 'ตกลง'
    });
    }

    event.target.reset();
});


// ฟังก์ชันสำหรับดึงค่าจาก cookie ตามชื่อ
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// ดึงค่าจาก cookie ที่ชื่อ fullname
const fullname = getCookie('fullname');

// ถอดรหัส fullname จาก cookies เพื่อแสดงผลเป็นภาษาไทย
const decodedFullname = fullname ? decodeURIComponent(fullname) : 'ผู้ใช้ไม่ระบุ';

// แสดงชื่อผู้ใช้ใน <span id="username">
document.getElementById('usernameDisplay').textContent = decodedFullname;


function Logout() {
    Swal.fire({
        title: 'ยืนยันการออกจากระบบ?',
        text: 'คุณแน่ใจหรือว่าต้องการออกจากระบบ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ใช่, ออกจากระบบ',
        cancelButtonText: 'ยกเลิก'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                // ส่งคำขอ logout ไปยัง API
                const response = await axios.post('/logout'); // แก้ไขให้ตรงกับ endpoint ของคุณ

                // ลบ token จาก cookie
                document.cookie = 'token=; Max-Age=0; path=/;'; 
                document.cookie = 'fullname=; Max-Age=0; path=/;'; 
                document.cookie = 'userId=; Max-Age=0; path=/;';

                // แสดงข้อความสำเร็จ
                Swal.fire({
                    title: 'ออกจากระบบสำเร็จ!',
                    text: 'คุณได้ออกจากระบบเรียบร้อยแล้ว.',
                    icon: 'success',
                    confirmButtonText: 'ตกลง'
                }).then(() => {
                    window.location.replace('/login'); // เปลี่ยนไปยังหน้าล็อกอิน
                });
            } catch (error) {
                console.error('Error during logout:', error);
                Swal.fire({
                    title: 'เกิดข้อผิดพลาด!',
                    text: 'ไม่สามารถออกจากระบบได้. กรุณาลองใหม่อีกครั้ง.',
                    icon: 'error',
                    confirmButtonText: 'ตกลง'
                });
            }
        }
    });
}




// Link Page
function Checklist(){
    window.location.href='/checklist'
}


// Link Reset Pass
async function ResetPass() {
    try {
        const response = await axios.get('/check-admin'); // เส้นทางที่เช็คสิทธิ์

        if (response.status === 200) {
            window.location.href = "/resetpassword"; // ถ้าเป็น admin ให้ไปหน้ารีเซ็ต
        }
    } catch (error) {
        if (error.response && error.response.status === 403) {
            Swal.fire({
                title: 'ไม่สามารถเข้าถึง!',
                text: 'คุณไม่มีสิทธิ์เข้าถึงหน้านี้ โปรดติดต่อแอดมิน',
                icon: 'error',
                confirmButtonText: 'ตกลง'
            });
        } else {
            // จัดการข้อผิดพลาดอื่น ๆ
            Swal.fire({
                title: 'เกิดข้อผิดพลาด!',
                text: 'โปรดลองอีกครั้ง.',
                icon: 'error',
                confirmButtonText: 'ตกลง'
            });
        }
    }
}
