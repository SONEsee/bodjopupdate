// export default defineNuxtRouteMiddleware((to, from) => {
//   const token = localStorage.getItem("token");
//   const user = localStorage.getItem("user");
//   // redirect the user to the login page
//   if (!token || !user) {
//     return navigateTo({
//       path: "/login",
//       query: {
//         redirect: to.fullPath,
//       },
//     });
//   }
// });
// middleware/auth.js - ລະບົບ Authentication + Auto Logout ສົມບູນ

// ==========================================
// ຕົວປ່ຽນສຳລັບລະບົບ Auto Logout
// ==========================================
let logoutTimer = null;
let warningTimer = null;
let isWarningShown = false;

// ຕັ້ງເວລາ (ເປັນມິນລິວິນາທີ)
const INACTIVE_TIME =  5* 60 * 1000; // 5 ນາທີ = 300,000 ms
const WARNING_TIME = 2 * 60 * 1000;  // 4 ນາທີ (ເຕືອນກ່ອນ 1 ນາທີ)

// Events ທີ່ຖືວ່າເປັນການເຄື່ອນໄຫວ
const ACTIVITY_EVENTS = [
  'mousedown',
  'mousemove', 
  'keypress',
  'scroll',
  'touchstart',
  'click'
];

// ==========================================
// ຟັງຊັນສຳລັບ Auto Logout
// ==========================================

function startAutoLogoutTimer() {
  // ຂ້າມຖ້າບໍ່ໃຊ່ browser
  if (process.server) return;

  // ລ້າງ timer ເກົ່າ
  clearTimeout(logoutTimer);
  clearTimeout(warningTimer);
  isWarningShown = false;

  // ປິດ warning modal ຖ້າເປີດຢູ່
  hideWarningModal();

 
  warningTimer = setTimeout(() => {
    showWarningModal();
  }, WARNING_TIME);

 
  logoutTimer = setTimeout(() => {
    performAutoLogout();
  }, INACTIVE_TIME);
}

function performAutoLogout() {
  if (process.server) return;

 
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("lastActivity");
  

  clearTimeout(logoutTimer);
  clearTimeout(warningTimer);
  
  // ປິດ warning modal
  hideWarningModal();
  
 CallSwal({
    title: "ອອກເລີຍ",
    text: "ທ່ານໄດ້ຖືກອອກຈາກລະບົບ ໃນເນື້ອໃນ 5 ນາທີ ທ່ານໄດ້ເຮັດເນ",
    icon: "warning",
    confirmButtonText: "ເຂົ້າໃນໜ້າ Login",
 })
  

  window.location.href = "/login";
}

function showWarningModal() {
  if (process.server) return;
  if (isWarningShown) return;
  isWarningShown = true;

 
  const modal = document.createElement('div');
  modal.id = 'auto-logout-warning';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: Arial, sans-serif;
  `;

  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background: white;
    padding: 30px;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    max-width: 400px;
    margin: 20px;
  `;


  let countdown = 60; 
  
  modalContent.innerHTML = `
    <h3 style="color: #e74c3c; margin-bottom: 20px;">
      ⚠️ ການເຕືອນ
    </h3>
    <p style="margin-bottom: 20px; color: #333;">
      ທ່ານຈະຖືກອອກຈາກລະບົບໃນອີກ <strong id="countdown">${countdown}</strong> ວິນາທີ
    </p>
    <p style="margin-bottom: 25px; color: #666; font-size: 14px;">
      ກົດປຸ່ມລຸ່ມນີ້ເພື່ອສືບຕໍ່ໃຊ້ງານ
    </p>
    <button id="stay-logged-in" style="
      background: #27ae60;
      color: white;
      border: none;
      padding: 12px 25px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
      margin-right: 10px;
    ">
      ສືບຕໍ່ໃຊ້ງານ
    </button>
    <button id="logout-now" style="
      background: #e74c3c;
      color: white;
      border: none;
      padding: 12px 25px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
    ">
      ອອກເລີຍ
    </button>
  `;

  modal.appendChild(modalContent);
  document.body.appendChild(modal);

 
  const countdownInterval = setInterval(() => {
    countdown--;
    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
      countdownElement.textContent = countdown;
    }
    
    if (countdown <= 0) {
      clearInterval(countdownInterval);
      performAutoLogout();
    }
  }, 1000);

 
  const stayButton = document.getElementById('stay-logged-in');
  const logoutButton = document.getElementById('logout-now');
  
  if (stayButton) {
    stayButton.onclick = () => {
      clearInterval(countdownInterval);
      hideWarningModal();
      startAutoLogoutTimer();
    };
  }

  if (logoutButton) {
    logoutButton.onclick = () => {
      clearInterval(countdownInterval);
      performAutoLogout();
    };
  }
}

function hideWarningModal() {
  if (process.server) return;
  
  const modal = document.getElementById('auto-logout-warning');
  if (modal) {
    modal.remove();
  }
  isWarningShown = false;
}

function resetTimerOnActivity() {
  if (process.server) return;
  

  localStorage.setItem("lastActivity", Date.now().toString());
  

  startAutoLogoutTimer();
}

function checkLastActivity() {
  if (process.server) return;
  
  const lastActivity = localStorage.getItem("lastActivity");
  const token = localStorage.getItem("token");
  
  if (!token) return;
  
  if (lastActivity) {
    const timeDiff = Date.now() - parseInt(lastActivity);
    
    if (timeDiff >= INACTIVE_TIME) {
    
      performAutoLogout();
      return;
    } else {
      
      const remainingTime = INACTIVE_TIME - timeDiff;
      const remainingWarningTime = WARNING_TIME - timeDiff;
      
      if (remainingWarningTime <= 0) {
      
        showWarningModal();
      } else {
       
        clearTimeout(logoutTimer);
        clearTimeout(warningTimer);
        
        warningTimer = setTimeout(() => {
          showWarningModal();
        }, remainingWarningTime);
        
        logoutTimer = setTimeout(() => {
          performAutoLogout();
        }, remainingTime);
      }
    }
  } else {
  
    startAutoLogoutTimer();
  }
}



function setupActivityTracking() {
  if (process.server) return;
  

  ACTIVITY_EVENTS.forEach(event => {
    document.removeEventListener(event, resetTimerOnActivity, true);
  });
  
 
  ACTIVITY_EVENTS.forEach(event => {
    document.addEventListener(event, resetTimerOnActivity, true);
  });


  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      checkLastActivity();
    }
  });
  

  window.addEventListener('focus', checkLastActivity);
  

  window.addEventListener('load', checkLastActivity);
}



export default defineNuxtRouteMiddleware((to, from) => {
 
  if (process.server) return;

  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  
 
  if (!token || !user) {
    return navigateTo({
      path: "/login",
      query: {
        redirect: to.fullPath,
      },
    });
  }

 
  if (token) {
    try {
     
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      
      if (payload.exp && payload.exp < now) {
       
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("lastActivity");
        return navigateTo("/login");
      }
    } catch (error) {
      
      console.log("Token validation skipped:", error.message);
    }
  }

 
  if (process.client) {
   
    nextTick(() => {
     
      setupActivityTracking();
      
      
      checkLastActivity();
      
      console.log("🛡️ Auto Logout System activated");
      console.log(`⏰ Timeout: ${INACTIVE_TIME / 1000 / 60} minutes`);
      console.log(`⚠️ Warning at: ${WARNING_TIME / 1000 / 60} minutes`);
    });
  }
});



if (process.client) {
  
  window.addEventListener('beforeunload', () => {
    clearTimeout(logoutTimer);
    clearTimeout(warningTimer);
  });
  
  
  window.addEventListener('pagehide', () => {
    clearTimeout(logoutTimer);
    clearTimeout(warningTimer);
  });
}




if (process.client) {
  window.authMiddleware = {
    startTimer: startAutoLogoutTimer,
    stopTimer: () => {
      clearTimeout(logoutTimer);
      clearTimeout(warningTimer);
      hideWarningModal();
    },
    resetTimer: resetTimerOnActivity,
    checkActivity: checkLastActivity,
    forceLogout: performAutoLogout
  };
}