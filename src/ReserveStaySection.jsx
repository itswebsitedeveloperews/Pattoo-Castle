export default function ReserveStaySection({
  backgroundImage = "",
  buttonText = "",
  buttonUrl = "",
  content = "",
  logoSrc = "",
  title = "",
  images = "",
  videoSrc = "",
}) {
  const hasButton = Boolean(buttonText && buttonUrl);
  const reserveLogoSrc = logoSrc || images;

  return (
    <section
      className={`section reserve-stay-section${videoSrc ? " has-video" : ""}`}
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

        {reserveLogoSrc && (
          <img
            className="reserve-stay-logo"
            src={reserveLogoSrc}
            alt=""
            aria-hidden="true"
          />
        )}

        {title && <h2 id="reserve-stay-title">{title}</h2>}

        {content && <p>{content}</p>}

        {hasButton && (
          <a
            className="button button--brown reserve-stay-button"
            href={buttonUrl}
          >
            {buttonText}
          </a>
        )}
      </div>
    </section>
  );
}
