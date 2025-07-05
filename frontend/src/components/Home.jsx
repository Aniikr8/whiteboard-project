import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const Home = () => {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    const newRoomId = uuidv4().slice(0, 8); // shorter room ID
    navigate(`/room/${newRoomId}`);
  };

//   const handleJoinRoom = () => {
//     if (roomId.trim() !== "") {
//       navigate(`/room/${roomId}`);
//     }
//   };

const handleJoinRoom = () => {
  const code = roomId.trim().toLowerCase();
  if (code !== "") {
    navigate(`/room/${code}`);
  }
};

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="text-3xl font-bold mb-8">🎨 Collaborative Whiteboard</h1>

      <button
        onClick={handleCreateRoom}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg mb-6 hover:bg-blue-700 transition"
      >
        Create Room
      </button>

      <div className="w-full max-w-sm flex flex-col items-center space-y-4">
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="px-4 py-2 w-full border rounded-md shadow"
        />
        <button
          onClick={handleJoinRoom}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Join Room
        </button>
      </div>
    </div>
  );
};

export default Home;
