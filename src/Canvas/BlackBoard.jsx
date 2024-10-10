import React, { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaintbrush } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./BlackBoard.css";
const BlackboardCanvas = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [isEraser, setIsEraser] = useState(false);
  const [iscolor, setColor] = useState("white");
  const [isdata, setData] = useState([]);
  const [isBouncingGreen, setIsBouncingGreen] = useState(false);
  const [isBouncingWhite, setIsBouncingWhite] = useState(false);
  const [isBouncingRed, setIsBouncingRed] = useState(false);
  const [isBouncingSkyBlue, setIsBouncingSkyBlue] = useState(false);
  const [isBouncingYellow, setIsBouncingYellow] = useState(false);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    setContext(ctx);
  }, []);
  const startDrawing = (e) => {
    context.beginPath();
    context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };
  const draw = (e) => {
    if (!isDrawing) return;

    if (isEraser) {
      context.strokeStyle = "black";
      context.lineWidth = 50;
    } else {
      context.strokeStyle = iscolor;
      context.lineWidth = 3;
    }
    context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    context.stroke();
  };
  const stopDrawing = () => {
    context.closePath();
    setIsDrawing(false);
  };
  const toggleEraser = () => {
    setIsEraser((prev) => !prev);
  };
  const eraseCanvas = () => {
    const canvas = canvasRef.current;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "red";
  };
  async function submit() {
    const canvas = canvasRef.current;
    const image = canvas.toDataURL();
    console.log(image)
    try {
      const response = await axios.post("https://magic-board-backend.vercel.app/solve", {
        image
      });
      const text = response.data;
      setData((prevData) => [
        ...prevData,
        { success: text.success, answer: text.answer },
      ]);
      eraseCanvas();
      console.log(response.data);
    } catch (error) {
      console.error("Error submitting the canvas image:", error);
    }
  }
  const changeColor = (e, color) => {
    setColor(color);
    if (color === "white") {
      setIsBouncingWhite(true);
      setTimeout(() => {
        setIsBouncingWhite(false);
      }, 1000);
    } else if (color === "red") {
      setIsBouncingRed(true);
      setTimeout(() => {
        setIsBouncingRed(false);
      }, 1000);
    } else if (color === "green") {
      setIsBouncingGreen(true);
      setTimeout(() => {
        setIsBouncingGreen(false);
      }, 1000);
    } else if (color === "skyblue") {
      setIsBouncingSkyBlue(true);
      setTimeout(() => {
        setIsBouncingSkyBlue(false);
      }, 1000);
    } else if (color === "yellow") {
      setIsBouncingYellow(true);
      setTimeout(() => {
        setIsBouncingYellow(false);
      }, 1000);
    }
  };
  return (
    <>
      <h1 className="heading">Magic Board 🪄</h1>
      <div className="container">
        <button onClick={toggleEraser} className="erase-btn">
          {isEraser ? "Switch to Draw" : "Switch to Eraser"}
        </button>
        <div className="color-container">
        <button
            onClick={(e) => changeColor(e, "yellow")}
            className="color-box"
          >
            <FontAwesomeIcon
              icon={faPaintbrush}
              bounce={isBouncingYellow ? true : false}
              style={{ color: "#FFD43B" }}
            />
          </button>
          <button
            onClick={(e) => changeColor(e, "white")}
            className="color-box"
          >
            <FontAwesomeIcon
              icon={faPaintbrush}
              bounce={isBouncingWhite ? true : false}
              style={{ color: "#f2f2f2" }}
            />
          </button>
          <button onClick={(e) => changeColor(e, "red")} className="color-box">
            <FontAwesomeIcon
              icon={faPaintbrush}
              bounce={isBouncingRed ? true : false}
              style={{ color: "#f20707" }}
            />
          </button>
          <button
            onClick={(e) => changeColor(e, "green")}
            className="color-box"
          >
            <FontAwesomeIcon
              icon={faPaintbrush}
              bounce={isBouncingGreen ? true : false}
              style={{ color: "#16d044" }}
            />
          </button>
          <button
            onClick={(e) => changeColor(e, "skyblue")}
            className="color-box"
          >
            <FontAwesomeIcon
              icon={faPaintbrush}
              bounce={isBouncingSkyBlue ? true : false}
              style={{ color: "#74C0FC" }}
            />
          </button>
        </div>
        <div>
          <button className="submit" onClick={submit}>
            Submit
          </button>
          <button onClick={eraseCanvas} className="clear">
            Clear Canvas
          </button>
        </div>
      </div>
      <div className="data-container">
        <canvas
          className="canvas-style"
          ref={canvasRef}
          width={1150}
          height={550}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        ></canvas>
        <div className="response-container">
          <h1 className="response-heading">Draw something to see Magic 🪄</h1>

          <div className="scroll">
            {isdata.length > 0 &&
              isdata.map((res, i) => (
                <div key={i} className="output-box">
                  <p className="response-text">
                    {i + 1}. {res.answer}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BlackboardCanvas;
