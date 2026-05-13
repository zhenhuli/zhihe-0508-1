const showtimes = [
  { id: 1, movie: '复仇者联盟', time: '10:00', price: 35, room: '1号厅' },
  { id: 2, movie: '复仇者联盟', time: '13:30', price: 35, room: '1号厅' },
  { id: 3, movie: '复仇者联盟', time: '16:00', price: 40, room: '2号厅' },
  { id: 4, movie: '星际穿越', time: '11:00', price: 45, room: '3号厅' },
  { id: 5, movie: '星际穿越', time: '15:00', price: 45, room: '3号厅' },
  { id: 6, movie: '盗梦空间', time: '19:00', price: 50, room: 'IMAX厅' }
];

const ROWS = 8;
const COLS = 10;

function generateSeats(showtimeId) {
  const seats = [];
  const seed = showtimeId * 12345;
  
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const pseudoRandom = Math.sin(seed + row * COLS + col) * 10000;
      const isOccupied = (pseudoRandom - Math.floor(pseudoRandom)) < 0.3;
      
      seats.push({
        id: `${row}-${col}`,
        row: String.fromCharCode(65 + row),
        col: col + 1,
        status: isOccupied ? 'occupied' : 'available'
      });
    }
  }
  
  return seats;
}

export function createSeatLogic() {
  let currentShowtime = null;
  let seats = [];
  let selectedSeats = [];
  
  return {
    getShowtimes() {
      return [...showtimes];
    },
    
    getCurrentShowtime() {
      return currentShowtime;
    },
    
    selectShowtime(showtimeId) {
      currentShowtime = showtimes.find(s => s.id === showtimeId) || null;
      seats = generateSeats(showtimeId);
      selectedSeats = [];
      return {
        showtime: currentShowtime,
        seats: [...seats]
      };
    },
    
    getSeats() {
      return [...seats];
    },
    
    toggleSeat(seatId) {
      const seat = seats.find(s => s.id === seatId);
      if (!seat || seat.status === 'occupied') {
        return false;
      }
      
      const index = selectedSeats.findIndex(s => s.id === seatId);
      if (index > -1) {
        selectedSeats.splice(index, 1);
        seat.status = 'available';
      } else {
        selectedSeats.push(seat);
        seat.status = 'selected';
      }
      
      return true;
    },
    
    getSelectedSeats() {
      return [...selectedSeats];
    },
    
    getSelectedCount() {
      return selectedSeats.length;
    },
    
    getTotalPrice() {
      if (!currentShowtime) return 0;
      return selectedSeats.length * currentShowtime.price;
    },
    
    getOrderSummary() {
      if (!currentShowtime) return null;
      
      return {
        movie: currentShowtime.movie,
        time: currentShowtime.time,
        room: currentShowtime.room,
        pricePerTicket: currentShowtime.price,
        selectedSeats: selectedSeats.map(s => `${s.row}排${s.col}座`),
        ticketCount: selectedSeats.length,
        totalPrice: this.getTotalPrice()
      };
    }
  };
}
