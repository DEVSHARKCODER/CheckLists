function Index () {
  window.location.href = '/'
}

async function loadChecklist() {
  const loadingIndicator = document.querySelector('.loading');
  const showMessage = document.getElementById('status-message');

  if (loadingIndicator) {
    loadingIndicator.classList.remove('hidden'); // แสดงตัวโหลด
  } else {
    console.error('Loading indicator not found in the DOM.');
    return;
  }

  try {
    const response = await axios.get('/checklists');
    const checklistData = response.data;
    const container = document.getElementById('checklist-container');

    container.innerHTML = '';

    if (checklistData.message === 'ไม่มีข้อมูล') {
      showMessage.textContent = 'ไม่มีข้อมูล';
      showMessage.classList.remove('hidden');
      return;
    } else {
      showMessage.classList.add('hidden');
    }

    const currentDate = new Date();

    for (const item of checklistData) {
      const isPastDue = new Date(item.duedate).setHours(0, 0, 0, 0) < currentDate.setHours(0, 0, 0, 0) && item.status !== 'สำเร็จ' && item.status !== 'ยกเลิก';
     
      if (isPastDue && item.status !== 'เลยกำหนด') {
        await updateStatusToOverdue(item.id);
        item.status = 'เลยกำหนด';
      }

      const checklistItem = document.createElement('div');
      checklistItem.className = `border p-4 rounded shadow`;

      let statusClass = '';
      let containerColor = '';

      switch (item.status) {
        case 'ยังไม่ทำ':
          statusClass = 'bg-red-500 text-white';
          containerColor = 'bg-red-200';
          break;
        case 'สำเร็จ':
          statusClass = 'bg-green-500 text-white';
          containerColor = 'bg-green-200';
          break;
        case 'ยกเลิก':
          statusClass = 'bg-orange-500 text-white';
          containerColor = 'bg-orange-200';
          break;
        case 'เลยกำหนด':
          statusClass = 'bg-gray-500 text-white';
          containerColor = 'bg-gray-200';
          break;
        default:
          statusClass = 'bg-gray-300 text-black';
          containerColor = 'bg-gray-200';
      }

      checklistItem.className += ` ${containerColor}`;

      checklistItem.innerHTML = `
        <h2 class="font-bold text-2xl text-gray-800">${item.nameitem}</h2>
        <p class="text-gray-700 mt-2"><strong>คำอธิบาย:</strong> ${item.description}</p>
        <p class="text-gray-700 mt-1"><strong>แท็ก:</strong> ${item.tags}</p>
        <p class="text-gray-700 mt-1"><strong>หมายเหตุ:</strong> ${item.notes}</p>
        <p class="text-gray-700 mt-1"><strong>กำหนดส่ง:</strong> ${formatThaiDate(item.duedate)}</p>
        <p class="text-gray-700 mt-1"><strong>สถานะ:</strong> <span class="status ${statusClass} p-1 rounded">${item.status}</span></p>
        ${isPastDue ? '<p class="text-white bg-red-600 text-center font-bold mt-4">เลยกำหนดแล้ว</p>' : ''}
        <div class="mt-2">
          <label for="status-${item.id}" class="block mb-1"><strong>เลือกสถานะ:</strong></label>
          <select id="status-${item.id}" class="border p-1 rounded" ${item.status === 'เลยกำหนด' || item.status === 'ยกเลิก' ? 'disabled' : ''}>
            <option value="ยังไม่ทำ" ${item.status === 'ยังไม่ทำ' ? 'selected' : ''}>ยังไม่ทำ</option>
            <option value="สำเร็จ" ${item.status === 'สำเร็จ' ? 'selected' : ''}>สำเร็จ</option>
            <option value="ยกเลิก" ${item.status === 'ยกเลิก' ? 'selected' : ''}>ยกเลิก</option>
          </select>
        </div>
        <div class="mt-4">
          <button onclick="updateStatus(${item.id})" class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200" ${item.status === 'เลยกำหนด' || item.status === 'ยกเลิก' ? 'disabled' : ''} style="${item.status === 'เลยกำหนด' || item.status === 'ยกเลิก' ? 'opacity: 0.5; cursor: not-allowed;' : ''}">อัพเดท Status</button>
          <button onclick="deleteItem(${item.id})" class="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-200 ml-2 px-10">ลบ</button>
        </div>
      `;

      container.appendChild(checklistItem);
    }
  } catch (error) {
    console.error('Error fetching checklist data:', error);
  } finally {
    if (loadingIndicator) {
      loadingIndicator.classList.add('hidden');
    }
  }
}

// ฟังก์ชันอัพเดทสถานะเป็น 'เลยกำหนด' ในฐานข้อมูล
async function updateStatusToOverdue(itemId) {
  try {
    await axios.put(`/checklists/${itemId}/overdue`, { status: 'เลยกำหนด' });
  } catch (error) {
    console.error('Error updating status to overdue:', error);
  }
}




// ฟังก์ชันสำหรับแปลงวันที่เป็นภาษาไทย
function formatThaiDate (dateString) {
  const months = [
    'มกราคม',
    'กุมภาพันธ์',
    'มีนาคม',
    'เมษายน',
    'พฤษภาคม',
    'มิถุนายน',
    'กรกฎาคม',
    'สิงหาคม',
    'กันยายน',
    'ตุลาคม',
    'พฤศจิกายน',
    'ธันวาคม'
  ]

  const date = new Date(dateString)
  const day = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear() + 543 // เพิ่ม 543 ปีเพื่อแปลงเป็นปีไทย

  const daysOfWeek = [
    'อาทิตย์',
    'จันทร์',
    'อังคาร',
    'พุธ',
    'พฤหัสบดี',
    'ศุกร์',
    'เสาร์'
  ]
  const dayOfWeek = daysOfWeek[date.getDay()]

  return `${dayOfWeek}ที่ ${day} ${month} ${year}`
}

async function filterByStatus() {
  const selectedStatus = document.getElementById('statusFilter').value;
  const loadingIndicator = document.querySelector('.loading');
  const showMessage = document.getElementById('status-message');

  // แสดงตัวโหลด
  loadingIndicator.classList.remove('hidden');

  try {
    const response = await axios.get('/checklists'); // ดึงข้อมูลทั้งหมด
    const checklistData = response.data;

    // ตรวจสอบว่ามีข้อมูลหรือไม่
    if (checklistData.message === 'ไม่มีข้อมูล') {
      showMessage.textContent = 'ไม่มีข้อมูล'; // แสดงข้อความ "ไม่มีข้อมูล"
      showMessage.classList.remove('hidden'); // แสดงข้อความ
      return; // ออกจากฟังก์ชัน
    } else {
      showMessage.classList.add('hidden'); // ซ่อนข้อความถ้ามีข้อมูล
    }

    // กรองข้อมูลตามสถานะ
    const filteredData = checklistData.filter(
      item => selectedStatus === 'ทั้งหมด' || item.status === selectedStatus
    );

    const container = document.getElementById('checklist-container');
    container.innerHTML = '';

    if (filteredData.length === 0) {
      showMessage.textContent = 'ไม่มีข้อมูล';
      showMessage.classList.remove('hidden');
    } else {
      showMessage.classList.add('hidden');
    }

    const currentDate = new Date();

    for (const item of filteredData) {
      const isPastDue = new Date(item.duedate).setHours(0, 0, 0, 0) < currentDate.setHours(0, 0, 0, 0) && item.status !== 'สำเร็จ' && item.status !== 'ยกเลิก';

      // ถ้าเลยกำหนดและสถานะไม่ใช่ 'สำเร็จ' หรือ 'ยกเลิก' ให้เปลี่ยนสถานะในฐานข้อมูล
      if (isPastDue && item.status !== 'เลยกำหนด') {
        await updateStatusToOverdue(item.id);
        item.status = 'เลยกำหนด'; // อัพเดทสถานะในออบเจ็กต์
      }

      const checklistItem = document.createElement('div');
      checklistItem.className = `border p-4 rounded shadow ${isPastDue ? 'line-through' : ''}`;

      let statusClass = '';
      let containerColor = '';

      switch (item.status) {
        case 'ยังไม่ทำ':
          statusClass = 'bg-red-500 text-white';
          containerColor = 'bg-red-200';
          break;
        case 'สำเร็จ':
          statusClass = 'bg-green-500 text-white';
          containerColor = 'bg-green-200';
          break;
        case 'ยกเลิก':
          statusClass = 'bg-orange-500 text-white line-through';
          containerColor = 'bg-orange-200';
          break;
        case 'เลยกำหนด':
          statusClass = 'bg-gray-500 text-white line-through';
          containerColor = 'bg-gray-200';
          break;
        default:
          statusClass = 'bg-gray-300 text-black';
          containerColor = 'bg-gray-200';
      }

      checklistItem.className += ` ${containerColor}`;

      checklistItem.innerHTML = `
        <h2 class="font-bold text-2xl text-gray-800">${item.nameitem}</h2>
        <p class="text-gray-700 mt-2"><strong>คำอธิบาย:</strong> ${item.description}</p>
        <p class="text-gray-700 mt-1"><strong>แท็ก:</strong> ${item.tags}</p>
        <p class="text-gray-700 mt-1"><strong>หมายเหตุ:</strong> ${item.notes}</p>
        <p class="text-gray-700 mt-1"><strong>กำหนดส่ง:</strong> ${formatThaiDate(item.duedate)}</p>
        <p class="text-gray-700 mt-1"><strong>สถานะ:</strong> <span class="status ${statusClass} p-1 rounded">${item.status}</span></p>
        ${isPastDue ? '<p class="text-white bg-red-600 text-center font-bold mt-4">เลยกำหนดแล้ว</p>' : ''}
        <div class="mt-2">
          <label for="status-${item.id}" class="block mb-1"><strong>เลือกสถานะ:</strong></label>
          <select id="status-${item.id}" class="border p-1 rounded" ${item.status === 'เลยกำหนด' || item.status === 'ยกเลิก' ? 'disabled' : ''}>
            <option value="ยังไม่ทำ" ${item.status === 'ยังไม่ทำ' ? 'selected' : ''}>ยังไม่ทำ</option>
            <option value="สำเร็จ" ${item.status === 'สำเร็จ' ? 'selected' : ''}>สำเร็จ</option>
            <option value="ยกเลิก" ${item.status === 'ยกเลิก' ? 'selected' : ''}>ยกเลิก</option>
          </select>
        </div>
        <div class="mt-4">
          <button onclick="updateStatus(${item.id})" class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200" ${item.status === 'เลยกำหนด' || item.status === 'ยกเลิก' ? 'disabled' : ''} style="${item.status === 'เลยกำหนด' || item.status === 'ยกเลิก' ? 'opacity: 0.5; cursor: not-allowed;' : ''}">อัพเดท Status</button>
          <button onclick="deleteItem(${item.id})" class="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-200 ml-2 px-10">ลบ</button>
        </div>
      `;

      container.appendChild(checklistItem);
    }
  } catch (error) {
    console.error('Error fetching checklist data:', error);
  } finally {
    // ซ่อนตัวโหลดเมื่อเสร็จสิ้น
    loadingIndicator.classList.add('hidden');
  }
}


loadChecklist()

function getCookie (name) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift() // คืนค่าคุกกี้
}

const fullname = getCookie('fullname')
const decodedFullname = fullname
  ? decodeURIComponent(fullname)
  : 'ผู้ใช้ไม่ระบุ' // ถอดรหัส

document.getElementById('username').textContent = decodedFullname

// Update Satus
async function updateStatus (itemId) {
  const selectedStatus = document.getElementById(`status-${itemId}`).value
  const loadingIndicator = document.querySelector('.loading')

  if (loadingIndicator) {
    loadingIndicator.classList.remove('hidden')
  }

  try {
    const response = await axios.put(`/checklists/${itemId}`, {
      status: selectedStatus
    })

    if (response.status === 200) {
      Swal.fire({
        title: 'สำเร็จ!',
        text: 'อัปเดตสถานะเรียบร้อยแล้ว!',
        icon: 'success',
        confirmButtonText: 'ตกลง'
      }).then(() => {
        location.reload()
      })
    } else {
      console.error('Failed to update status:', response)

      Swal.fire({
        title: 'ผิดพลาด!',
        text: 'ไม่สามารถอัปเดตสถานะได้!',
        icon: 'error',
        confirmButtonText: 'ตกลง'
      })
    }
  } catch (error) {
    console.error('Error updating status:', error)

    Swal.fire({
      title: 'เกิดข้อผิดพลาด!',
      text: 'มีบางอย่างผิดพลาดในการอัปเดตสถานะ!',
      icon: 'error',
      confirmButtonText: 'ตกลง'
    })
  } finally {
    if (loadingIndicator) {
      loadingIndicator.classList.add('hidden') // ซ่อนตัวโหลดเมื่อเสร็จสิ้น
    }
  }
}

// Delete
async function deleteItem (itemId) {
  const { value: confirmDelete } = await Swal.fire({
    title: 'คุณแน่ใจว่าต้องการลบรายการนี้?',
    text: 'ข้อมูลที่ลบจะไม่สามารถกู้คืนได้!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'ลบ',
    cancelButtonText: 'ยกเลิก'
  })

  if (confirmDelete) {
    try {
      await axios.delete(`/checklists/${itemId}`)

      // อัปเดต UI หลังจากลบสำเร็จ
      await Swal.fire('ลบสำเร็จ!', 'รายการของคุณถูกลบเรียบร้อยแล้ว.', 'success')
      loadChecklist()
    } catch (error) {
      console.error('Error deleting item:', error)
      Swal.fire(
        'เกิดข้อผิดพลาด!',
        'ไม่สามารถลบรายการได้ กรุณาลองใหม่อีกครั้ง.',
        'error'
      )
    }
  }
}


function DeleteAll() {
  const fullname = getCookie('fullname'); // ดึง fullname จาก cookies

  if (fullname) {
    Swal.fire({
      title: 'ยืนยันการลบ?',
      text: "ข้อมูลทั้งหมดจะถูกลบและไม่สามารถกู้คืนได้!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ลบ',
      cancelButtonText: 'ยกเลิก'
    }).then(async (result) => {
      if (result.isConfirmed) {
        // หากผู้ใช้กดยืนยันให้ทำการลบข้อมูลที่นี่
        try {
          const response = await axios.delete('/deleteAll', {
            data: { fullname: (fullname) } // ส่ง fullname ใน payload
          });

          // ตรวจสอบสถานะการตอบกลับ
          if (response.status === 200) {
            Swal.fire('ลบสำเร็จ!', 'ข้อมูลทั้งหมดถูกลบเรียบร้อยแล้ว.', 'success')
              .then(() => {
                window.location.reload(); 
              });
          } else {
            Swal.fire('เกิดข้อผิดพลาด!', 'ไม่สามารถลบข้อมูลได้.', 'error');
          }
        } catch (error) {
          console.error('Error deleting data:', error);
          Swal.fire('เกิดข้อผิดพลาด!', 'ไม่สามารถลบข้อมูลได้.', 'error');
        }
      } else {
        console.log('การลบถูกยกเลิก');
      }
    });
  } else {
    console.log('ไม่พบ fullname ใน cookies');
  }
}
