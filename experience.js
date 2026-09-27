const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !reducedMotion.matches) {
 const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
 }), {threshold: .08});
 document.querySelectorAll('.intro>div,.section-top,.services details,.coffee-copy,.values>h2,.value-grid article,.closing,.contact>div').forEach(element => { element.classList.add('reveal-ready'); observer.observe(element); });
}
const progress=document.querySelector('.progress');
let ticking=false;
function updateProgress(){const height=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${height>0?scrollY/height:0})`;ticking=false;}
addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(updateProgress);ticking=true;}},{passive:true});
addEventListener('resize',updateProgress);updateProgress();
const bookingForm=document.querySelector('#booking-form');
const dateField=bookingForm.elements.date;
function localDate(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
dateField.min=localDate();
document.querySelector('#booking-action').innerHTML='<button class="button" type="submit">Продолжить в WhatsApp <span aria-hidden="true">↗</span></button><p class="booking-note">Откроется WhatsApp с текстом заявки. Отправьте сообщение администратору, чтобы согласовать визит.</p>';
function createBookingURL(values){
 const date=values.date.split('-').reverse().join('.');
 const lines=['Здравствуйте! Хочу записаться в ALMA.',`Имя: ${values.name.trim()}`,`Направление: ${values.service}`,`Желаемая дата: ${date}`,`Желаемое время: ${values.time}`];
 if(values.notes.trim())lines.push(`Пожелания: ${values.notes.trim()}`);
 lines.push('Подскажите, пожалуйста, доступно ли это время и какова стоимость?');
 return 'https://wa.me/79289740074?text='+encodeURIComponent(lines.join('\n'));
}
bookingForm.addEventListener('submit',event=>{
 event.preventDefault();dateField.min=localDate();
 bookingForm.elements.name.setCustomValidity(bookingForm.elements.name.value.trim()?'':'Введите ваше имя.');
 dateField.setCustomValidity(dateField.value<localDate()?'Выберите сегодняшнюю или будущую дату.':'');
 if(!bookingForm.reportValidity())return;
 const url=createBookingURL(Object.fromEntries(new FormData(bookingForm)));
 const status=document.querySelector('#booking-status');status.replaceChildren(document.createTextNode('Заявка ещё не отправлена. Отправьте подготовленное сообщение в WhatsApp. '));
 const fallback=document.createElement('a');fallback.href=url;fallback.target='_blank';fallback.rel='noopener noreferrer';fallback.textContent='Открыть WhatsApp ещё раз';fallback.style.textDecoration='underline';status.append(fallback);
 window.open(url,'_blank','noopener,noreferrer');
});
bookingForm.elements.name.addEventListener('input',()=>bookingForm.elements.name.setCustomValidity(''));
dateField.addEventListener('input',()=>dateField.setCustomValidity(''));
document.querySelectorAll('.services details').forEach((detail,index)=>{
 const link=document.createElement('a');link.className='service-book';link.href='#booking';link.textContent='Выбрать это направление ↗';link.addEventListener('click',()=>{bookingForm.elements.service.selectedIndex=index+1;});detail.append(link);
});
