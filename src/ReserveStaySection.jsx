export default function ReserveStaySection({
  backgroundImage = "",
  buttonText = "",
  buttonUrl = "",
  content = "",
  logoSrc = "",
  title = "",
  videoSrc = "",
}) {
  const hasButton = Boolean(buttonText && buttonUrl);

  return (
    <section
      className={`reserve-stay-section${videoSrc ? " has-video" : ""}`}
      style={
        backgroundImage
          ? {
              "--reserve-stay-image": `url(${backgroundImage})`,
            }
          : undefined
      }
      aria-labelledby={title ? "reserve-stay-title" : undefined}
    >
      {videoSrc && (
        <video
          autoPlay
          className="reserve-stay-video"
          loop
          muted
          playsInline
          preload="auto"
          src={videoSrc}
        />
      )}

      <div className="reserve-stay-card">
        <span className="reserve-stay-pin" />
        <span className="reserve-stay-pin" />
        <span className="reserve-stay-pin" />

        {logoSrc && (
          <img
            className="reserve-stay-logo"
            src={logoSrc}
            alt=""
            aria-hidden="true"
          />
        )}

        {title && <h2 id="reserve-stay-title">{title}</h2>}

        {content && <p>{content}</p>}

        {hasButton && (
          <a className="button button--brown reserve-stay-button" href={buttonUrl}>
            {buttonText}
          </a>
        )}
      </div>
    </section>
  );
}
