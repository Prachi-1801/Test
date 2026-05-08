import "./GradientBackground.css";

const GradientBackground = () => (
  <div className="gradient-container">
    <svg
      className="triangles"
      width="100%"
      height="100%"
      preserveAspectRatio="none"
    >
      {/* Responsive triangles */}
      <polygon
        className="triangle anim1"
        points="5%,0 10%,50% 15%,0"
        fill="rgba(255,255,255,0.15)"
      />
      <polygon
        className="triangle anim2"
        points="25%,0 30%,40% 35%,0"
        fill="rgba(255,255,255,0.12)"
      />
      <polygon
        className="triangle anim3"
        points="50%,0 55%,60% 60%,0"
        fill="rgba(255,255,255,0.1)"
      />
      <polygon
        className="triangle anim4"
        points="75%,0 80%,50% 85%,0"
        fill="rgba(255,255,255,0.08)"
      />
      <polygon
        className="triangle anim5"
        points="90%,0 95%,70% 100%,0"
        fill="rgba(255,255,255,0.06)"
      />
    </svg>
  </div>
);

export default GradientBackground;
