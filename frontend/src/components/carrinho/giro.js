const icon = document.querySelector('.rotate');

icon.addEventListener('click', () => {
  icon.classList.remove('rotate-spin'); 
  void icon.offsetWidth;                
  icon.classList.add('rotate-spin');    
});