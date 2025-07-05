import React, { useRef, useState, useEffect } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";

const socket = io("http://localhost:5000"); // Update to deployed backend URL when needed

const Whiteboard = () => {
    const [strokes, setStrokes] = useState([]);
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
const [tool, setTool] = useState("pen");
  const { roomId } = useParams();

  // Join the room
  useEffect(() => {
    socket.emit("join-room", roomId);
  }, [roomId]);

  // Setup canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.lineCap = "round";
    ctx.lineWidth = 3;
  }, []);

  // Listen to socket events
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const handleStartDraw = (data) => {
      ctx.beginPath();
      ctx.moveTo(data.offsetX, data.offsetY);
      ctx.strokeStyle = data.color;
    };

    const handleDraw = (data) => {
      ctx.strokeStyle = data.color;
      ctx.lineTo(data.offsetX, data.offsetY);
      ctx.stroke();
    };

    socket.on("start-draw", handleStartDraw);
    socket.on("draw", handleDraw);

    return () => {
      socket.off("start-draw", handleStartDraw);
      socket.off("draw", handleDraw);
    };
  }, []);

  // Local start drawing
  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    setDrawing(true);

    socket.emit("start-draw", {
      roomId,
      offsetX,
      offsetY,
      color,
    });
  };

  // Local draw
  const draw = ({ nativeEvent }) => {
    if (!drawing) return;
    const { offsetX, offsetY } = nativeEvent;
    const ctx = canvasRef.current.getContext("2d");
    ctx.strokeStyle = tool === "pen" ? color : "#ffffff"; 
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();

    socket.emit("draw", {
      roomId,
      data: { offsetX, offsetY,  color: tool === "pen" ? color : "#ffffff" },
    });

    setStrokes((prev) => [...prev, { offsetX, offsetY, color }]);

  };

  // Stop drawing
  const stopDrawing = () => {
    setDrawing(false);
    const ctx = canvasRef.current.getContext("2d");
    ctx.closePath();
  };
const saveDrawing = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roomId, data: strokes }),
    });

    const result = await response.json();
    alert(result.message || "Saved");
  } catch (err) {
    alert("Failed to save drawing.");
    console.error(err);
  }
};
useEffect(() => {
  const loadDrawing = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/load/${roomId}`);
      const savedStrokes = await res.json();
      const ctx = canvasRef.current.getContext("2d");

      ctx.beginPath();
      savedStrokes.forEach((point) => {
        ctx.strokeStyle = point.color;
        ctx.lineTo(point.offsetX, point.offsetY);
        ctx.stroke();
      });

      // Update local stroke state
      setStrokes(savedStrokes);
    } catch (err) {
      console.error("Error loading drawing:", err);
    }
  };

  loadDrawing();
}, [roomId]);

  return (
    <div className="relative w-full h-screen">
      {/* <input
        type="color"
        className="absolute top-4 left-4 z-10 border border-black rounded"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      /> */}
      <div className="absolute top-4 left-4 z-20 flex space-x-2">
  <input
    type="color"
    value={color}
    onChange={(e) => setColor(e.target.value)}
    className="border w-10 h-10 p-0"
  />

  <button
    onClick={() => setTool("pen")}
    className={`px-3 py-1 rounded ${tool === "pen" ? "bg-blue-600 text-white" : "bg-white border"}`}
  >
    Pen
  </button>

  <button
    onClick={() => setTool("eraser")}
    className={`px-3 py-1 rounded ${tool === "eraser" ? "bg-red-600 text-white" : "bg-white border"}`}
  >
    Eraser
  </button>
</div>

      <button
  onClick={saveDrawing}
  className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded shadow z-10 hover:bg-blue-700"
>
  Save
</button>
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
    </div>
  );
};

export default Whiteboard;
