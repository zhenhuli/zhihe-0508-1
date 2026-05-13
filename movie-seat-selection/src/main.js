import { createSeatLogic } from './seatLogic.js';
import { createUI } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
  const seatLogic = createSeatLogic();
  const ui = createUI(seatLogic);
  
  function handleShowtimeSelect(showtimeId) {
    seatLogic.selectShowtime(showtimeId);
    ui.updateShowtimeActive(showtimeId);
    ui.renderSeats();
    ui.renderOrderPreview();
  }
  
  function handleSeatToggle(seatId) {
    seatLogic.toggleSeat(seatId);
    ui.renderSeats();
    ui.renderOrderPreview();
  }
  
  function handleOrderConfirm() {
    const summary = seatLogic.getOrderSummary();
    if (!summary || summary.ticketCount === 0) {
      alert('请先选择座位！');
      return;
    }
    
    const message = `
购票成功！

影片：${summary.movie}
场次：${summary.time}
影厅：${summary.room}
座位：${summary.selectedSeats.join('、')}
数量：${summary.ticketCount}张
金额：¥${summary.totalPrice}
    `;
    
    alert(message.trim());
  }
  
  ui.renderShowtimes();
  ui.bindEvents(handleShowtimeSelect, handleSeatToggle, handleOrderConfirm);
});
