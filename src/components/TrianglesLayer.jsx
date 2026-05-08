import "./TrianglesLayer.css";

const TrianglesLayer = () => (
  <svg
    className="tri-layer"
    viewBox="0 0 700 520"
    preserveAspectRatio="xMidYMid slice"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <style>
        {`
          .to { fill: none; stroke: rgba(255,255,255,0.18); stroke-width: 1.5; }
          .tf { fill: rgba(255,255,255,0.07); }
          .f1 { animation: flt1 4s ease-in-out infinite alternate; }
          .f2 { animation: flt2 5s ease-in-out infinite alternate; }
          .f3 { animation: flt1 6.5s ease-in-out infinite alternate-reverse; }
          .f4 { animation: flt2 3s ease-in-out infinite alternate; }
          .f5 { animation: flt1 2.5s ease-in-out infinite alternate; }
          @keyframes flt1 { from{transform:translateY(0)} to{transform:translateY(-18px)} }
          @keyframes flt2 { from{transform:translateY(0)} to{transform:translateY(16px)} }
        `}
      </style>
    </defs>

    <g className="f1">
      <polygon className="to" points="-30,-20 200,-20 85,180" />
    </g>
    <g className="f2">
      <polygon className="tf" points="520,-10 720,-10 620,200" />
    </g>
    <g className="f3">
      <polygon className="to" points="580,20 760,20 670,210" />
    </g>
    <g className="f4">
      <polygon className="to" points="-40,320 200,320 80,530" />
    </g>
    <g className="f5">
      <polygon className="tf" points="500,330 740,330 620,530" />
    </g>
    <g style={{ transformOrigin: "80px 260px" }} className="f2">
      <polygon className="to" points="80,140 200,380 -40,380" />
    </g>
  </svg>
);

export default TrianglesLayer;
