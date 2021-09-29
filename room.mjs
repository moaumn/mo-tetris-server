const rooms = new Map();
export function enterTheRoom(socket, roomId) {
  let room;
  if (rooms.has(roomId)) {
    room = rooms.get(roomId);
  } else {
    room = new Set();
    rooms.set(roomId, room);
  }
  if (room.size < 2) {
    room.add(socket.id);
    socket.roomId = roomId;
    return room.size;
  }
  return 0;
}

export function leaveTheRoom(socket) {
  const room = rooms.get(socket.roomId);
  if (room) {
    room.delete(socket.id);
    if (room.size === 0) {
      rooms.delete(socket.roomId);
    } else {
      return 1;
    }
  }
  return 0;
}

export function getRivalId(socket) {
  const room = rooms.get(socket.roomId);
  if (room) {
    for (let id of room) {
      if (id !== socket.id) {
        return id;
      }
    }
  }
}
