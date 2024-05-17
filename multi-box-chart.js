class MultiBoxChart extends HTMLElement {
  defaultWidth = 600;
  defaultDots = [150];
  borderWidth = 2;
  xvaluesWidth = 16;
  defaultYHeight = 20;
  logarithmicOffset = 3;
  precision = 3;

  constructor() {
    super();
  }

  connectedCallback() {
    this.recap = this.getAttribute("recap") === "true";
    try {
      this.boxes = JSON.parse(
        "[" + this.getAttribute("boxes")?.replaceAll(" ", "") + "]"
      );
    } catch (e) {
      this.boxes = null;
    }
    this.width = Number(this.getAttribute("width")) || this.defaultWidth;
    this.heightStep =
      Number(this.getAttribute("heightStep")) || this.defaultYHeight;
    this.lines =
      this.getAttribute("lines") === "true" || !this.getAttribute("lines");
    this.log = this.getAttribute("log") === "true";
    this.xvalues =
      this.getAttribute("xvalues")
        ?.replaceAll(" ", "")
        .split(",")
        .map(Number) || this.defaultDots;
    const box = this.getAttribute("box")
      ?.replaceAll(" ", "")
      .split(",")
      .map(Number);
    const range = this.getAttribute("range")
      ?.replaceAll(" ", "")
      .split(",")
      .map(Number);
    this.yvalues = this.getAttribute("yvalues")
      ?.replaceAll(/\s*(,)\s*/g, ",")
      .split(",");
    this.ydescription = this.getAttribute("ydescription")
      ?.match(/\[(.*?)\]/g)
      .map((a) => a.replaceAll(/\]|\[/g, ""));
    this.mediane = Number(this.getAttribute("mediane"));
    this.maxValue = Math.max(
      ...this.xvalues,
      ...(box ? box : []),
      ...(this.boxes ? this.boxes.map(([, end]) => end) : []),
      ...(range ? range : []),
      this.mediane || []
    );
    console.log(this.maxValue);
    this.distributedMediane = this.getPixelValue(this.mediane);
    this.distributedDots = this.xvalues.map((xvalue, i) =>
      this.getPixelValue(xvalue)
    );
    this.height = this.xvalues.length * this.heightStep;
    this.boxStart = box?.[0];
    this.boxEnd = box?.[1];
    this.distributedBoxStart = this.getPixelValue(this.boxStart);
    this.distributedBoxEnd = this.getPixelValue(this.boxEnd);
    this.rangeStart = Number(range?.[0]);
    this.rangeEnd = Number(range?.[1]);
    this.distributedrangeStart = this.getPixelValue(this.rangeStart);
    this.distributedrangeEnd = this.getPixelValue(this.rangeEnd);
    this.bottomStep = this.height / this.xvalues.length;
    this.render();
  }

  getPixelValue(value) {
    let val = value;
    let maxValue = this.maxValue;
    if (this.log && value > 0) {
      val = Math.log10(value) + this.logarithmicOffset;
      maxValue = Math.log10(maxValue) + this.logarithmicOffset;
    }
    return (val / maxValue) * 0.9 * this.width;
  }

  render() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
          font-size: 12px;
          --global-tb-margin: 60px;
          --xvalues-dim: ${this.xvaluesWidth}px;
          --axis-color: #014d4e;
          --range-color: #66a3a3;
          --box-color: lightgray;
          --xvalues-color: rgb(0, 52, 200, 0.6);
          --xvalues-color-warn: rgba(255, 100, 0, 0.6);
          --xvalues-color-alert: rgba(255, 0, 0, 0.6);
          --mediane-color: #ffe900;
          --last-outside: #ff0000;
          --last-inside: rgb(0, 52, 200);
          --last-close: rgb(255, 140, 0);
          --close: rgba(255, 140, 0, 80%);
        }

        p {
          margin: 0;
          padding: 0;
        }

        .axis {
          width: ${this.width}px;
          height: ${this.height + this.heightStep}px;
          border-bottom: ${this.borderWidth}px solid var(--axis-color);
          border-left: ${this.borderWidth}px solid var(--axis-color);
          padding-top: var(--global-top-margin);
          position: relative;
          margin: 0 auto;
        }

        .axis::after {
          position: absolute;
          content: " ";
          border-top: 5px solid transparent;
          border-bottom: 5px solid transparent;
          border-left: 8px solid var(--axis-color);
          right: -6px;
          bottom: -6px;
        }

        .axis::before {
          position: absolute;
          content: " ";
          border-top: 5px solid transparent;
          border-bottom: 5px solid transparent;
          border-left: 8px solid var(--axis-color);
          left: -5px;
          top: -6px;
          transform: rotate(-90deg);
        }

        .range,
        .range::after {
          display: ${this.rangeEnd ? "block" : "none"};
          width: 0;
          height: calc(${this.height}px + 24px);
          border-left: ${this.borderWidth}px solid var(--range-color);
          position: absolute;
          left: ${this.distributedrangeStart - this.borderWidth}px;
          bottom: -12px;
        }

        .range::after {
          content: "";
          display: block;
          left: ${
            this.distributedrangeEnd -
            this.distributedrangeStart -
            this.borderWidth
          }px;
          bottom: 0;
        }

        .mediane {
          content: "";
          display: ${this.mediane !== 0 ? "block" : "none"};
          width: ${this.borderWidth}px;
          height: ${this.height}px;
          position: absolute;
          left: ${this.distributedMediane - this.borderWidth}px;
          bottom: 0px;
          background-color: var(--mediane-color);
          z-index: 1;
        }

        .box {
          display: ${this.boxEnd ? "block" : "none"};
          width: ${
            this.distributedBoxEnd - this.distributedBoxStart + this.borderWidth
          }px;
          height: ${this.height}px;
          background: var(--box-color);
          position: absolute;
          bottom: 0;
          left: ${this.distributedBoxStart - this.borderWidth}px;
        }

        .x-label > span {
          position: absolute;
          bottom: -25px;
          transform: translateX(-50%);
        }

        .x-label >.x-label-mediane {
          display: ${this.mediane !== 0 ? "block" : "none"};
          left: ${this.distributedMediane - this.borderWidth}px;
        }

        .x-label >.x-label-range-start {
          display: ${this.rangeStart ? "block" : "none"};
          left: ${this.distributedrangeStart - this.borderWidth}px;
        }

        .x-label >.x-label-range-end {
          display: ${this.rangeEnd ? "block" : "none"};
          left: ${this.distributedrangeEnd - this.borderWidth}px;
        }

        .x-label >.x-label-box-start {
          display: ${this.boxStart ? "block" : "none"};
          left: ${this.distributedBoxStart - this.borderWidth}px;
        }

        .x-label > .x-label-box-end {
          display: ${this.boxEnd ? "block" : "none"};
          left: ${this.distributedBoxEnd - this.borderWidth}px;
        }

        .y-label > span, 
        .y-label > a {
          position: relative;
        }

        .y-label > a {
          color: inherit;
          text-decoration: none;
        }

        .y-label > a:hover {
          text-decoration: underline;
        }

        .y-label > span,
        .y-label > a {
          display: block;
          height: 10px;
          position: absolute;
          left: 0;
          bottom: -${this.borderWidth}px;
          transform: translateX(calc(-100% - 10px));
        }

        .y-line > span {
          display: block;
          width: ${this.width}px;
          border-bottom: ${this.borderWidth}px dashed gray;
          position: absolute;
          left: 0;
          bottom: 0;
          z-index: 1;
        }

        .xvalues > div {
          width: var(--xvalues-dim);
          height: var(--xvalues-dim);
          border-radius: 50%;
          background-color: var(--xvalues-color);
          position: absolute;
          z-index: 2;
        }

        .xvalues-label {
          position: absolute;
          left: 14px;
          top: 14px;
          font-size: 12px;
        }

        .inner-box {
          position: absolute;
          left: 0;
          bottom: 0;
          height: ${this.heightStep - 2}px;
          background-color: violet; /* violet if error */
          transform: translateY(calc(-50% - 1px));
          background: var(--box-color);
        }

        /* BOXES WHEN RECAP */
        ${
          this.boxes
            ? this.boxes
                ?.map((box, i) => {
                  return `.inner-box:nth-child(${i + 1}) {
                      left: ${this.getPixelValue(box[0])}px;
                      bottom: calc(${this.bottomStep * i}px);
                      width: ${
                        this.getPixelValue(box[1]) - this.getPixelValue(box[0])
                      }px;
                  }\n`;
                })
                .join("")
            : ""
        }
        
        /* DOTS POSITION AND BACKGROUND */
        ${this.distributedDots
          .map((xvalues, i) => {
            return `.xvalues > div:nth-child(${i + 1}) {
                    bottom: calc(${this.bottomStep * (i + 1)}px - 1px);
                    left: calc(${xvalues}px - 1px);
                    ${this.printBackground(i, xvalues)}
                    transform: translate(-50%, 50%);
                    position: absolute;
                  }\n`;
          })
          .join("")}

        /* LINES POSITION AND BACKGROUND */   
        ${this.distributedDots
          .map((xvalues, i) => {
            if (i === this.distributedDots.length - 1) {
              return;
            }
            const nextDot = this.distributedDots?.[i + 1];
            const x1 = xvalues;
            const y1 = this.bottomStep * (i + 1);
            const x2 = nextDot;
            const y2 = this.bottomStep * (i + 2);
            const angle = this.calculateAngle(x1, y1, x2, y2);
            const width = this.calculateDistance(x1, y1, x2, y2);
            return `.xvalues > div:nth-child(${i + 1}) > p {
                  position: absolute;
                  left: ${this.xvaluesWidth / 2}px;
                  bottom: ${this.xvaluesWidth / 2}px;
                  background-color: transparent;
                  height: 2px;
                  width: ${width}px;
                  transform-origin: 0% 0%; 
                  transform: rotate(-${angle}deg);
                  border-radius: 0;
                  ${this.printBackgroundGradient(i, xvalues, nextDot)}
                }\n`;
          })
          .join("")}

        /* Y LABELS BOTTOM */
        ${this.distributedDots
          .map((_, i) => {
            return `.y-label > span:nth-child(${i + 1}),
            .y-label > a:nth-child(${i + 1}) {
                      bottom: ${this.bottomStep * (i + 1) - this.borderWidth}px;
                    }\n`;
          })
          .join("")}


        /* Y LINE BOTTOM */
        ${this.distributedDots
          .map((_, i) => {
            return `.y-line > span:nth-child(${i + 1}) {
                      bottom: ${this.bottomStep * (i + 1) - this.borderWidth}px;
                    }\n`;
          })
          .join("")}
      </style>
      <div class="axis" id="axis">
        <div class="y-label">
          ${this.printElements(
            "a",
            this.distributedDots.length,
            (i) => this.yvalues?.[i] || `T${i + 1}`,
            (i) => this.ydescription?.[i]
          )}
        </div>
        <div class="y-line">
          ${this.printElements("span", this.distributedDots.length, (i) => "")}
        </div>

        <div class="box">
        </div>
        <div class="inner-box-container">
          ${
            this.recap &&
            this.boxes.map((box) => `<div class="inner-box"></div>`).join("")
          }
        </div>
        <div class="range"></div>
        <div class="mediane"></div>
        <div class="xvalues">${this.xvalues
          .map(
            (xvalues) =>
              `<div>${
                this.lines ? "<p></p>" : ""
              }<span class="xvalues-label">${xvalues.toFixed(
                this.precision
              )}</span></div>`
          )
          .join("")}</div>

        <div class="x-label">
          <span class="x-label-mediane">${this.mediane?.toFixed(
            this.precision
          )}</span>
          <span class="x-label-range-start">${this.rangeStart?.toFixed(
            2
          )}</span>
          <span class="x-label-range-end">${this.rangeEnd?.toFixed(
            this.precision
          )}</span>
          <span class="x-label-box-start">${this.boxStart?.toFixed(
            this.precision
          )}</span>
          <span class="x-label-box-end">${this.boxEnd?.toFixed(
            this.precision
          )}</span>
        </div>
      </div>
    `;
  }

  printElements(elementType, length, content, title = () => {}) {
    return Array.from({ length })
      .map((_, i) => {
        return `<${elementType} href="#${title(i)}" title="${title(
          i
        )}">${content(i)}</${elementType}>`;
      })
      .join("");
  }

  calculateDotPosition(start, end, xvalues, i, length) {
    const isLast = i === length;
    const isInside = start <= xvalues && end >= xvalues;

    const isClose =
      (start - 30 <= xvalues && start > xvalues) ||
      (end + 30 >= xvalues && end < xvalues);
    return [isLast, isInside, isClose];
  }

  printBackground(i, xvaluesXPosition) {
    const [isLast, isInside, isClose] = this.recap
      ? this.calculateDotPosition(
          this.getPixelValue(this.boxes[i][0]),
          this.getPixelValue(this.boxes[i][1]),
          xvaluesXPosition,
          i,
          0
        )
      : this.calculateDotPosition(
          this.distributedBoxStart,
          this.distributedBoxEnd,
          xvaluesXPosition,
          i,
          this.distributedDots.length - 1
        );

    if (isClose) {
      return isLast && !this.recap
        ? `background-color: var(--last-close);`
        : `background-color: var(--close);`;
    }

    return isLast && !this.recap
      ? `background-color: ${
          isInside ? "var(--last-inside)" : "var(--last-outside)"
        };`
      : ` background-color: ${
          isInside ? "var(--xvalues-color)" : "var(--xvalues-color-alert)"
        };`;
  }

  printBackgroundGradient(i, xvaluesXPosition, xvaluesXNextPosition) {
    const [isLast, isInside, isClose] = this.calculateDotPosition(
      this.distributedBoxStart,
      this.distributedBoxEnd,
      xvaluesXPosition,
      i,
      this.distributedDots.length - 1
    );

    const [isNextLast, isNextInside, isNextClose] = this.calculateDotPosition(
      this.distributedBoxStart,
      this.distributedBoxEnd,
      xvaluesXNextPosition,
      i + 1,
      this.distributedDots.length - 1
    );

    const blueToRed = `background: linear-gradient(90deg, var(--xvalues-color) 0%, var(--xvalues-color-alert) 100%);`;
    const redToBlue = `background: linear-gradient(90deg, var(--xvalues-color-alert) 0%, var(--xvalues-color) 100%);`;

    const blueToOrange = `background: linear-gradient(90deg, var(--xvalues-color) 0%, var(--xvalues-color-warn) 100%);`;
    const orangeToBlue = `background: linear-gradient(90deg, var(--xvalues-color-warn) 0%, var(--xvalues-color) 100%);`;

    const redToOrange = `background: linear-gradient(90deg, var(--xvalues-color-alert) 0%, var(--xvalues-color-warn) 100%);`;
    const orangeToRed = `background: linear-gradient(90deg,var(--xvalues-color-warn) 0%, var(--xvalues-color-alert)  100%);`;

    const blueToBlue = `background: linear-gradient(90deg,var(--xvalues-color) 0%, var(--xvalues-color)  100%);`;
    const redToRed = `background: linear-gradient(90deg,var(--xvalues-color-alert) 0%, var(--xvalues-color-alert) 100%);`;
    const orangeToOrange = `background: linear-gradient(90deg,var(--xvalues-color-warn) 0%, var(--xvalues-color-warn) 100%);`;

    if (isInside) {
      if (isNextInside) {
        return blueToBlue;
      }
      if (isNextClose) {
        return blueToOrange;
      }
      if (!isNextInside && !isNextClose) {
        return blueToRed;
      }
    }

    if (!isInside) {
      if (isNextClose) {
        return redToOrange;
      }
      if (isNextInside) {
        return redToBlue;
      }
      if (!isNextInside) {
        return redToRed;
      }
    }

    if (isClose) {
      if (isNextClose) {
        return orangeToOrange;
      }
      if (isNextInside) {
        return orangeToBlue;
      }
      if (!isNextInside) {
        return orangeToRed;
      }
    }

    return `background: var(--median-color);`;
  }

  calculateAngle(x1, y1, x2, y2) {
    // Calculate the slope of the line
    let m = (y2 - y1) / (x2 - x1);

    // Calculate the angle in radians
    let thetaRadians = Math.atan(m);

    // Convert the angle to degrees
    let thetaDegrees = thetaRadians * (180 / Math.PI);

    // Adjust the angle for lines in the 2nd and 3rd quadrants
    if (x2 < x1) {
      thetaDegrees += 180;
    }

    // Handle the special case of a vertical line
    if (x1 === x2) {
      thetaDegrees = y2 > y1 ? 90 : -90;
    }

    return thetaDegrees;
  }

  calculateDistance(x1, y1, x2, y2) {
    let dx = x2 - x1;
    let dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

customElements.define("multi-box-chart", MultiBoxChart);
