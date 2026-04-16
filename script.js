// 获取DOM元素
const nameInput = document.getElementById('nameInput');
const birthdayInput = document.getElementById('birthdayInput');
const introInput = document.getElementById('introInput');
const saveBtn = document.getElementById('saveBtn');
const themeToggle = document.getElementById('themeToggle');
const avatar = document.getElementById('avatar');
const uploadBtn = document.getElementById('uploadBtn');
const avatarUpload = document.getElementById('avatarUpload');
const body = document.body;
const editIcons = document.querySelectorAll('.edit-icon');

// 白天模式动态元素数组
let dayElements = [];

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  // 检查是否有保存的主题设置
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'night-mode') {
    body.classList.add('night-mode');
    themeToggle.textContent = '☀️ 日间模式';
    createNightElements();
  } else {
    createDayElements();
  }
  
  // 加载保存的用户信息
  loadUserInfo();
  
  // 添加卡片加载动画
  const card = document.querySelector('.card');
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  setTimeout(() => {
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
  }, 300);
});

// 主题切换逻辑
themeToggle.addEventListener('click', () => {
  const isNight = !body.classList.contains('night-mode');
  body.classList.toggle('night-mode');
  
  // 更新按钮文本
  themeToggle.textContent = isNight ? '☀️ 日间模式' : '🌙 夜间模式';
  
  // 保存主题设置
  localStorage.setItem('theme', isNight ? 'night-mode' : 'day-mode');
  
  // 清除当前模式的元素
  removeAllDynamicElements();
  dayElements = [];
  
  // 根据模式创建新元素
  if (isNight) {
    createNightElements();
  } else {
    createDayElements();
  }
});

// 上传头像逻辑
uploadBtn.addEventListener('click', () => {
  avatarUpload.click();
});

avatarUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (event) => {
      avatar.src = event.target.result;
      
      // 添加上传成功动画
      avatar.style.transform = 'scale(1.2)';
      avatar.style.boxShadow = '0 0 25px rgba(255, 107, 53, 0.6)';
      
      setTimeout(() => {
        avatar.style.transform = 'scale(1)';
        if (body.classList.contains('night-mode')) {
          avatar.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
        } else {
          avatar.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
        }
      }, 600);
      
      // 保存头像到本地存储
      saveUserInfo();
      
      showMessage('头像更换成功！', 'success');
    };
    reader.readAsDataURL(file);
  } else {
    showMessage('请选择有效的图片文件！', 'error');
  }
});

// 保存逻辑
saveBtn.addEventListener('click', () => {
  const data = {
    name: nameInput.value.trim(),
    birthday: birthdayInput.value,
    intro: introInput.value.trim(),
    avatar: avatar.src,
  };
  
  // 输入验证
  if (!data.name) {
    showMessage('请输入姓名！', 'error');
    nameInput.focus();
    return;
  }
  
  if (!data.birthday) {
    showMessage('请选择出生日期！', 'error');
    birthdayInput.focus();
    return;
  }
  
  if (!data.intro) {
    showMessage('请输入个人简介！', 'error');
    introInput.focus();
    return;
  }
  
  // 保存动画效果
  saveBtn.style.transform = 'scale(0.95)';
  saveBtn.style.opacity = '0.8';
  saveBtn.disabled = true;
  saveBtn.textContent = '保存中...';
  
  // 保存到本地存储
  setTimeout(() => {
    saveUserInfo(data);
    
    saveBtn.style.transform = 'scale(1)';
    saveBtn.style.opacity = '1';
    
    // 保存成功效果
    const originalText = '保存信息';
    
    saveBtn.textContent = '✓ 保存成功！';
    saveBtn.style.background = body.classList.contains('night-mode') 
      ? 'linear-gradient(135deg, #4CAF50, #2E7D32)'
      : 'linear-gradient(135deg, #27ae60, #219653)';
    
    // 添加震动效果
    const card = document.querySelector('.card');
    card.style.animation = 'savedPulse 0.5s ease-in-out';
    setTimeout(() => {
      card.style.animation = '';
    }, 500);
    
    setTimeout(() => {
      saveBtn.textContent = originalText;
      saveBtn.disabled = false;
      
      // 恢复原始背景
      if (body.classList.contains('night-mode')) {
        saveBtn.style.background = 'linear-gradient(135deg, #5bc0be, #3a506b)';
      } else {
        saveBtn.style.background = 'linear-gradient(135deg, #ff6b35, #ff8c42)';
      }
    }, 2000);
    
    showMessage('个人信息保存成功！', 'success');
  }, 800);
});

// 编辑图标点击事件
editIcons.forEach(icon => {
  icon.addEventListener('click', function() {
    const inputContainer = this.parentElement;
    const input = inputContainer.querySelector('input') || inputContainer.querySelector('textarea');
    
    if (input) {
      input.focus();
      input.setSelectionRange(0, input.value.length);
    }
  });
});

// 创建白天模式元素
function createDayElements() {
  // 创建太阳
  const sun = document.createElement('div');
  sun.className = 'sun';
  body.appendChild(sun);
  dayElements.push(sun);
  
  // 创建云朵
  const cloudSizes = ['small', 'medium', 'large'];
  cloudSizes.forEach(size => {
    const cloud = document.createElement('div');
    cloud.className = `cloud ${size}`;
    body.appendChild(cloud);
    dayElements.push(cloud);
  });
  
  // 创建光斑
  for (let i = 1; i <= 3; i++) {
    const lightSpot = document.createElement('div');
    lightSpot.className = 'light-spot';
    
    // 随机位置
    const top = Math.random() * 80 + 10;
    const left = Math.random() * 80 + 10;
    lightSpot.style.top = `${top}%`;
    lightSpot.style.left = `${left}%`;
    
    // 随机大小
    const size = Math.random() * 100 + 50;
    lightSpot.style.width = `${size}px`;
    lightSpot.style.height = `${size}px`;
    
    // 随机动画时长
    const duration = Math.random() * 10 + 10;
    lightSpot.style.animationDuration = `${duration}s`;
    
    // 随机延迟
    const delay = Math.random() * 5;
    lightSpot.style.animationDelay = `${delay}s`;
    
    body.appendChild(lightSpot);
    dayElements.push(lightSpot);
  }
}

// 创建夜间模式元素
function createNightElements() {
  // 创建月亮
  const moon = document.createElement('div');
  moon.className = 'moon';
  body.appendChild(moon);
  dayElements.push(moon);
  
  // 创建200颗星星
  createStars(200);
  
  // 创建流星
  createShootingStars();
}

// 生成随机分布的星星
function createStars(count = 200) {
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    
    // 随机大小（1-4px）
    const size = Math.random() * 3 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    
    // 随机位置
    star.style.top = `${Math.random() * 100}%`;
    star.style.left = `${Math.random() * 100}%`;
    
    // 随机亮度
    const brightness = Math.random() * 0.7 + 0.3;
    star.style.opacity = brightness;
    
    // 随机动画延迟和持续时间
    const delay = Math.random() * 3;
    const duration = Math.random() * 2 + 2;
    star.style.animationDelay = `${delay}s`;
    star.style.animationDuration = `${duration}s`;
    
    // 随机颜色（轻微变化）
    const colorVariation = Math.random() * 30;
    star.style.backgroundColor = `rgb(${255 - colorVariation}, ${255 - colorVariation}, 255)`;
    
    // 为部分星星添加不同的闪烁样式
    if (Math.random() > 0.7) {
      star.style.animationTimingFunction = 'ease-in-out';
      star.style.animationDuration = `${Math.random() * 1 + 0.5}s`;
    }
    
    body.appendChild(star);
    dayElements.push(star);
  }
}

// 创建流星
function createShootingStars() {
  const createSingleShootingStar = () => {
    if (!body.classList.contains('night-mode')) return;
    
    if (Math.random() > 0.7) { // 30% 几率生成流星
      const shootingStar = document.createElement('div');
      shootingStar.className = 'shooting-star';
      
      // 随机起始位置
      const startX = Math.random() * 100;
      shootingStar.style.left = `${startX}%`;
      shootingStar.style.top = `${Math.random() * 30}%`;
      
      // 随机大小
      const size = Math.random() * 2 + 1;
      shootingStar.style.width = `${size * 20}px`;
      shootingStar.style.height = `${size}px`;
      
      shootingStar.style.animation = `shootingStar ${Math.random() * 1 + 2}s linear`;
      
      body.appendChild(shootingStar);
      dayElements.push(shootingStar);
      
      // 流星结束后移除
      setTimeout(() => {
        if (shootingStar.parentNode) {
          const index = dayElements.indexOf(shootingStar);
          if (index > -1) {
            dayElements.splice(index, 1);
          }
          shootingStar.remove();
        }
      }, 3000);
    }
  };
  
  // 初始创建几颗流星
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      if (body.classList.contains('night-mode')) {
        createSingleShootingStar();
      }
    }, i * 1000);
  }
  
  // 定期创建流星
  const shootingStarInterval = setInterval(() => {
    if (body.classList.contains('night-mode')) {
      createSingleShootingStar();
    } else {
      clearInterval(shootingStarInterval);
    }
  }, 3000);
}

// 保存用户信息
function saveUserInfo(data = null) {
  if (!data) {
    data = {
      name: nameInput.value.trim(),
      birthday: birthdayInput.value,
      intro: introInput.value.trim(),
      avatar: avatar.src,
    };
  }
  
  localStorage.setItem('userInfo', JSON.stringify(data));
}

// 加载用户信息
function loadUserInfo() {
  const savedUserInfo = localStorage.getItem('userInfo');
  if (savedUserInfo) {
    try {
      const userInfo = JSON.parse(savedUserInfo);
      nameInput.value = userInfo.name || '张欣';
      birthdayInput.value = userInfo.birthday || '2006-12-11';
      introInput.value = userInfo.intro || '张欣，湖南衡阳人，现就读于湖南科技大学计算机科学与工程学院，24级计科五班大二学生，共青团员。大一期间深耕专业学习，扎实夯实计算机学科基础，获评国家励志奖学金、校级三好学生、特殊贡献奖等荣誉。\n\n目前为校ACM队成员，深耕算法竞赛领域，主攻C++算法。获得湖南科技大学新生赛二等奖，计算机二级比赛一等奖等。学生工作方面，大一期间担任学院学生会学习部委员，完成查课、检查卫生及协助部分活动开展等；大二转任班级组宣委员，负责班级团日活动策划、宣传物料制作及班级动态公示。\n\n兴趣爱好方面，热爱追剧，在剧情中感受多元叙事与人文故事；热衷旅游，打卡各地人文景点与自然风光，在行走中拓宽视野、丰富阅历。\n\n个人成长目标：持续夯实计算机专业核心基础，深耕算法竞赛领域，兼顾学生工作与个人发展，以踏实进取的态度，在技术学习与综合能力提升的道路上稳步前行，努力成长为兼具专业素养与责任担当的新时代青年。';
      if (userInfo.avatar && userInfo.avatar.startsWith('data:image')) {
        avatar.src = userInfo.avatar;
      }
    } catch (e) {
      console.log('加载保存的用户信息失败:', e);
    }
  }
}

// 移除所有动态元素
function removeAllDynamicElements() {
  dayElements.forEach(element => {
    if (element.parentNode) {
      element.remove();
    }
  });
  dayElements = [];
}

// 显示消息提示
function showMessage(message, type = 'info') {
  // 移除现有的消息
  const existingMessage = document.querySelector('.message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  // 创建消息元素
  const messageElement = document.createElement('div');
  messageElement.className = `message message-${type}`;
  
  // 添加图标
  const icon = document.createElement('span');
  if (type === 'success') {
    icon.textContent = '✓';
    messageElement.style.backgroundColor = 'rgba(39, 174, 96, 0.9)';
    messageElement.style.color = 'white';
  } else if (type === 'error') {
    icon.textContent = '✕';
    messageElement.style.backgroundColor = 'rgba(231, 76, 60, 0.9)';
    messageElement.style.color = 'white';
  } else {
    icon.textContent = 'ℹ';
    messageElement.style.backgroundColor = 'rgba(52, 152, 219, 0.9)';
    messageElement.style.color = 'white';
  }
  
  const text = document.createElement('span');
  text.textContent = message;
  
  messageElement.appendChild(icon);
  messageElement.appendChild(text);
  
  document.body.appendChild(messageElement);
  
  // 3秒后移除消息
  setTimeout(() => {
    messageElement.style.opacity = '0';
    messageElement.style.transform = 'translateX(-50%) translateY(-20px)';
    setTimeout(() => {
      if (messageElement.parentNode) {
        messageElement.remove();
      }
    }, 300);
  }, 3000);
}

// 输入框焦点效果
[nameInput, birthdayInput, introInput].forEach(input => {
  input.addEventListener('focus', function() {
    this.parentElement.style.transform = 'translateY(-5px)';
    this.parentElement.style.transition = 'transform 0.3s ease';
  });
  
  input.addEventListener('blur', function() {
    this.parentElement.style.transform = 'translateY(0)';
  });
});

// 头像悬停效果
avatar.addEventListener('mouseenter', () => {
  avatar.style.transform = 'scale(1.1)';
  avatar.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
});

avatar.addEventListener('mouseleave', () => {
  avatar.style.transform = 'scale(1)';
});

// 页面加载时随机主题
window.addEventListener('load', () => {
  // 如果没有保存的主题，随机选择
  if (!localStorage.getItem('theme')) {
    // 20% 几率加载夜间模式
    if (Math.random() > 0.8) {
      body.classList.add('night-mode');
      themeToggle.textContent = '☀️ 日间模式';
      createNightElements();
    } else {
      createDayElements();
    }
  }
  
  // 添加保存动画CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes savedPulse {
      0%, 100% { transform: scale(1); }
      25% { transform: scale(1.02); }
      50% { transform: scale(0.98); }
      75% { transform: scale(1.01); }
    }
  `;
  document.head.appendChild(style);
});