import React, { useRef, useState, useEffect } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";

const socket = io("https://whiteboard-backend-0wlm.onrender.com");

const Whiteboard = () => {
  const [strokes, setStrokes] = useState([]);
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [tool, setTool] = useState("pen");
  const { roomId } = useParams();

  useEffect(() => {
    socket.emit("join-room", roomId);
  }, [roomId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.lineCap = "round";
    ctx.lineWidth = 3;
  }, []);

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

    const handleClearCanvas = () => {
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setStrokes([]);
    };

    socket.on("start-draw", handleStartDraw);
    socket.on("draw", handleDraw);
    socket.on("clear-canvas", handleClearCanvas);

    return () => {
      socket.off("start-draw", handleStartDraw);
      socket.off("draw", handleDraw);
      socket.off("clear-canvas", handleClearCanvas);
    };
  }, []);

  const getOffset = (event) => {
    if (event.nativeEvent.touches) {
      const touch = event.nativeEvent.touches[0];
      const rect = canvasRef.current.getBoundingClientRect();
      return {
        offsetX: touch.clientX - rect.left,
        offsetY: touch.clientY - rect.top,
      };
    } else {
      return {
        offsetX: event.nativeEvent.offsetX,
        offsetY: event.nativeEvent.offsetY,
      };
    }
  };

  const startDrawing = (event) => {
    const { offsetX, offsetY } = getOffset(event);
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    setDrawing(true);
    socket.emit("start-draw", { roomId, offsetX, offsetY, color });
  };

  const draw = (event) => {
    if (!drawing) return;
    const { offsetX, offsetY } = getOffset(event);
    const ctx = canvasRef.current.getContext("2d");
    const drawColor = tool === "pen" ? color : "#ffffff";
    ctx.strokeStyle = drawColor;
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();

    socket.emit("draw", { roomId, offsetX, offsetY, color: drawColor });
    setStrokes((prev) => [...prev, { offsetX, offsetY, color: drawColor }]);
  };

  const stopDrawing = () => {
    setDrawing(false);
    canvasRef.current.getContext("2d").closePath();
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

  const clearCanvas = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setStrokes([]);
    socket.emit("clear-canvas", roomId);
  };

  useEffect(() => {
    const loadDrawing = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/load/${roomId}`);
        const savedStrokes = await res.json();
        const ctx = canvasRef.current.getContext("2d");

        if (savedStrokes.length > 0) {
          ctx.beginPath();
          savedStrokes.forEach((point) => {
            ctx.strokeStyle = point.color;
            ctx.lineTo(point.offsetX, point.offsetY);
            ctx.stroke();
          });
          setStrokes(savedStrokes);
        }
      } catch (err) {
        console.error("Error loading drawing:", err);
      }
    };

    loadDrawing();
  }, [roomId]);

  return (
    <div className="relative w-full h-screen">
      <div className="absolute top-4 left-4 z-20 flex space-x-2">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="border w-10 h-10 p-0"
        />

        <button
          onClick={() => setTool("pen")}
          className={`px-3 py-1 rounded ${
            tool === "pen" ? "bg-blue-600 text-white" : "bg-white border"
          }`}
        >
          Pen
        </button>

        <button
          onClick={() => setTool("eraser")}
          className={`px-3 py-1 rounded ${
            tool === "eraser" ? "bg-red-600 text-white" : "bg-white border"
          }`}
        >
          Eraser
        </button>

        <button
          onClick={clearCanvas}
          className="px-3 py-1 rounded bg-yellow-500 text-white hover:bg-yellow-600"
        >
          Clear
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
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
    </div>
  );
};

export default Whiteboard;

