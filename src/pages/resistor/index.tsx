import { useEffect, useRef, useState } from "react";
import { AudioSvg } from "@/components";
import { toDecimal } from "@/utils";
import ac from "@/utils/AudioController";
import resistorJpg from "./resistor.jpg";
import styles from "./index.module.css";
import type { ChangeEvent } from "react";

const ratio = window.devicePixelRatio || 1;
const canvasWidth = 400 * ratio;
const canvasHeight = 300 * ratio;

const speakerResistance = 1e4;
const selector = ["Band#1", "Band#2", "Multiplier"];
const ringData = [
  { name: "Black", color: "#000000", num: 0 },
  { name: "Brown", color: "#663231", num: 1 },
  { name: "Red", color: "#ff2600", num: 2 },
  { name: "Orange", color: "#ff6500", num: 3 },
  { name: "Yellow", color: "#fbfb00", num: 4 },
  { name: "Green", color: "#33ca20", num: 5 },
  { name: "Blue", color: "#6b62ff", num: 6 },
  { name: "Violet", color: "#ca63fa", num: 7 },
  { name: "Grey", color: "#949095", num: 8 },
  { name: "White", color: "#ffffff", num: 9 },
];
const bandOptions = ringData.map((v) => v.name);
const multiplierOptions = bandOptions.filter(
  (v) => !["Grey", "White"].includes(v)
);

const formatNumber = (num: number, n = 2) => {
  if (num >= 1e6) {
    return toDecimal(num / 1e6, n) + "M";
  }
  if (num > 1e3) {
    return toDecimal(num / 1e3, n) + "K";
  }

  return toDecimal(num, n);
};

const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  radius = 0
) => {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
};

const draw = (
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  ring: string[]
) => {
  const drawGrayLine = (x: number, y: number, w: number, h: number) =>
    drawRoundedRect(ctx, x * ratio, y * ratio, w * ratio, h * ratio, "#9e9e9e");

  drawGrayLine(46, 60, 272, 8);
  drawGrayLine(46, 232, 272, 8);
  drawGrayLine(46, 60, 8, 180);
  drawGrayLine(310, 60, 8, 180);

  drawRoundedRect(ctx, 0, 100 * ratio, 100 * ratio, 100 * ratio, "#000000");
  ctx.save();
  ctx.font = `${20 * ratio}px bold`;
  ctx.fillStyle = "#ffffff";
  const dacMetrics = ctx.measureText("DAC");
  ctx.fillText(
    "DAC",
    50 * ratio - dacMetrics.width / 2,
    150 * ratio + dacMetrics.actualBoundingBoxAscent / 2
  );
  ctx.restore();

  ctx.drawImage(image, 300 * ratio, 100 * ratio, 100 * ratio, 100 * ratio);

  drawRoundedRect(
    ctx,
    136 * ratio,
    48 * ratio,
    24 * ratio,
    32 * ratio,
    "#e5d8c2",
    8 * ratio
  );
  drawRoundedRect(
    ctx,
    160 * ratio,
    56 * ratio,
    36 * ratio,
    16 * ratio,
    "#e5d8c2"
  );
  drawRoundedRect(
    ctx,
    196 * ratio,
    48 * ratio,
    24 * ratio,
    32 * ratio,
    "#e5d8c2",
    8 * ratio
  );

  const ringColors = ring.map((v) => ringData.find((i) => i.name === v)!.color);
  ringColors.forEach((color, i) =>
    drawRoundedRect(
      ctx,
      (164 + i * 8) * ratio,
      56 * ratio,
      4 * ratio,
      16 * ratio,
      color
    )
  );
  drawRoundedRect(
    ctx,
    188 * ratio,
    56 * ratio,
    4 * ratio,
    16 * ratio,
    "#ce982d"
  );
};

// source: https://jsfiddle.net/xwuk7kh7
function Resistor() {
  const [, setKey] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const imageRef = useRef(new Image());
  const ringRef = useRef(["Black", "Black", "Black"]);

  const { voltage, resistance } = (() => {
    const data = ringRef.current.map(
      (v) => ringData.find((i) => i.name === v)!
    );
    const resistance =
      (data[0].num * 10 + data[1].num) * Math.pow(10, data[2].num);
    const voltage = (speakerResistance / (resistance + speakerResistance)) * 5;
    ac.setVolume((voltage * 20) >> 0);
    return { voltage, resistance };
  })();

  const handleChange = (evt: ChangeEvent<HTMLSelectElement>) => {
    const ctx = contextRef.current;
    if (!ctx) {
      return;
    }
    const { name, value } = evt.target;
    const index = selector.indexOf(name);
    ringRef.current[index] = value;
    setKey((k) => k + 1);
    draw(ctx, imageRef.current, ringRef.current);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const svg = svgRef.current;
    if (!canvas || !svg) {
      return;
    }

    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    contextRef.current = ctx;

    const svgUri = encodeURIComponent(
      new XMLSerializer().serializeToString(svg)
    );
    imageRef.current.src = `data:image/svg+xml; charset=utf8, ${svgUri}`;
    imageRef.current.onload = () => {
      draw(ctx, imageRef.current, ringRef.current);
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles["canvas-wrapper"]}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          width={canvasWidth}
          height={canvasHeight}
        />
        <div className={styles["dac-text"]}>
          V<span className={styles.sub}>out</span> : V
          <span className={styles.sub}>max</span> = 5V
        </div>
        <div className={styles["voltage-text"]}>
          <div>
            V<span className={styles.sub}>max</span> = {formatNumber(voltage)}V
          </div>
          <div>R = {formatNumber(speakerResistance, 0)}Ω</div>
        </div>
        <div className={styles["resistor-text"]}>
          R = {formatNumber(resistance)}Ω
        </div>
      </div>
      <div className={styles["selector-wrapper"]}>
        {selector.map((selectorName) => (
          <label key={selectorName}>
            <div>{selectorName}</div>
            <select name={selectorName} onChange={handleChange}>
              {(selectorName === "Multiplier"
                ? multiplierOptions
                : bandOptions
              ).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <img className={styles["resistor-image"]} src={resistorJpg} />
      <AudioSvg ref={svgRef} style={{ display: "none" }} />
    </div>
  );
}

export default Resistor;
