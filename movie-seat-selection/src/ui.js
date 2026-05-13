export function createUI(seatLogic) {
  const showtimesContainer = document.getElementById('showtimes-container');
  const seatsContainer = document.getElementById('seats-container');
  const orderPreview = document.getElementById('order-preview');
  
  function renderShowtimes() {
    const showtimes = seatLogic.getShowtimes();
    showtimesContainer.innerHTML = showtimes.map(showtime => `
      <p class="control">
        <button class="button showtime-btn" data-showtime-id="${showtime.id}">
          <span class="icon">
            <i>🎬</i>
          </span>
          <span>${showtime.movie}</span>
          <span class="ml-2">${showtime.time}</span>
          <span class="tag is-primary ml-2">¥${showtime.price}</span>
          <span class="tag is-light ml-1">${showtime.room}</span>
        </button>
      </p>
    `).join('');
  }
  
  function renderSeats() {
    const seats = seatLogic.getSeats();
    const rows = {};
    
    seats.forEach(seat => {
      if (!rows[seat.row]) {
        rows[seat.row] = [];
      }
      rows[seat.row].push(seat);
    });
    
    let html = '';
    Object.keys(rows).sort().forEach(row => {
      html += `
        <div class="seat-row">
          <span class="row-label">${row}</span>
          ${rows[row].map(seat => `
            <div class="seat ${seat.status}" data-seat-id="${seat.id}">
              ${seat.col}
            </div>
          `).join('')}
          <span class="row-label">${row}</span>
        </div>
      `;
    });
    
    seatsContainer.innerHTML = html;
  }
  
  function renderOrderPreview() {
    const summary = seatLogic.getOrderSummary();
    
    if (!summary || summary.ticketCount === 0) {
      orderPreview.innerHTML = `
        <div class="content">
          <p class="has-text-grey has-text-centered">请选择场次和座位</p>
        </div>
      `;
      return;
    }
    
    orderPreview.innerHTML = `
      <div class="content">
        <div class="order-item">
          <p class="has-text-weight-bold">${summary.movie}</p>
          <p class="is-size-7 has-text-grey">${summary.time} | ${summary.room}</p>
        </div>
        
        <div class="order-item">
          <p class="is-size-7 has-text-grey mb-1">已选座位</p>
          <div class="tags">
            ${summary.selectedSeats.map(s => `<span class="tag is-primary">${s}</span>`).join('')}
          </div>
        </div>
        
        <div class="order-item">
          <div class="level is-mobile">
            <div class="level-left">
              <span>票价 x${summary.ticketCount}</span>
            </div>
            <div class="level-right">
              <span>¥${summary.pricePerTicket} / 张</span>
            </div>
          </div>
        </div>
        
        <div class="order-item">
          <div class="level is-mobile">
            <div class="level-left">
              <span class="has-text-weight-bold">合计</span>
            </div>
            <div class="level-right">
              <span class="total-price">¥${summary.totalPrice}</span>
            </div>
          </div>
        </div>
        
        <button class="button is-primary is-fullwidth mt-4" id="confirm-order">
          确认购票
        </button>
      </div>
    `;
  }
  
  function updateShowtimeActive(showtimeId) {
    document.querySelectorAll('.showtime-btn').forEach(btn => {
      btn.classList.remove('is-active');
      if (parseInt(btn.dataset.showtimeId) === showtimeId) {
        btn.classList.add('is-active');
      }
    });
  }
  
  function bindEvents(onShowtimeSelect, onSeatToggle, onOrderConfirm) {
    showtimesContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.showtime-btn');
      if (btn) {
        const showtimeId = parseInt(btn.dataset.showtimeId);
        onShowtimeSelect(showtimeId);
      }
    });
    
    seatsContainer.addEventListener('click', (e) => {
      const seatEl = e.target.closest('.seat');
      if (seatEl) {
        const seatId = seatEl.dataset.seatId;
        onSeatToggle(seatId);
      }
    });
    
    orderPreview.addEventListener('click', (e) => {
      if (e.target.id === 'confirm-order') {
        onOrderConfirm();
      }
    });
  }
  
  return {
    renderShowtimes,
    renderSeats,
    renderOrderPreview,
    updateShowtimeActive,
    bindEvents
  };
}
