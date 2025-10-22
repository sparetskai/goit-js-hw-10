import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

let userSelectedDate = null;
const startBtn = document.querySelector("[data-start]");
const input = document.querySelector("#datetime-picker");
const daysEl = document.querySelector("[data-days]");
const hoursEl = document.querySelector("[data-hours]");
const minutesEl = document.querySelector("[data-minutes]");
const secondsEl = document.querySelector("[data-seconds]");
let timerInterval = null;

startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  dateFormat: "Y-m-d H:i",
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    if (selectedDate <= new Date()) {
      iziToast.error({ title: 'Error', message: 'Please choose a date in the future' });
      startBtn.disabled = true;
    } else {
      userSelectedDate = selectedDate;
      startBtn.disabled = false;
    }
  },
};

document.addEventListener("DOMContentLoaded", () => {
  flatpickr(input, options);
});

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);
  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function updateTimer(days, hours, minutes, seconds) {
  daysEl.textContent = addLeadingZero(days);
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}

startBtn.addEventListener("click", () => {
  if (!userSelectedDate) return;

  startBtn.disabled = true;
  input.disabled = true;
  startBtn.classList.add("clicked");
  input.classList.add("clicked");

  timerInterval = setInterval(() => {
    const now = new Date();
    const delta = userSelectedDate - now;

    if (delta <= 0) {
      clearInterval(timerInterval);
      updateTimer(0, 0, 0, 0);
      input.disabled = false;
      startBtn.disabled = true;
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(delta);
    updateTimer(days, hours, minutes, seconds);
  }, 1000);
});
