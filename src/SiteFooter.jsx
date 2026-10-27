import { richTextToPlainText, richTextToReact } from "./App";

function getSocialLinkLabel(index) {
  return `Pattoo Castle social link ${index + 1}`;
}

export default function SiteFooter({ footer }) {
  const hasCopyright = Boolean(richTextToPlainText(footer.copyright).trim());
  const hasContact = Boolean(
    footer.location ||
      footer.phone ||
      footer.whatsappLink ||
      footer.email ||
      footer.socialLinks.length,
  );
  const hasFooter = Boolean(
    hasContact ||
      footer.menuItems.length ||
      hasCopyright ||
      footer.footerBarItems.length,
  );

  if (!hasFooter) {
    return null;
  }

  return (
    <footer className="site-footer">
      <div className="site-footer-inner container">
        {hasContact && (
          <div className="footer-contact-grid">
            {footer.location && (
              <div className="footer-contact-item">
                <strong>Location</strong>
                {footer.locationUrl ? (
                  <a href={footer.locationUrl} target="_blank" rel="noopener noreferrer">
                    {footer.location}
                  </a>
                ) : (
                  <p>{footer.location}</p>
                )}
              </div>
            )}
            {(footer.phone || footer.whatsappLink) && (
              <div className="footer-contact-item">
                {footer.phone && <strong>Tel</strong>}
                {footer.phone && (footer.phoneUrl ? (
                  <a href={footer.phoneUrl}>{footer.phone}</a>
                ) : (
                  <p>{footer.phone}</p>
                ))}
                {footer.whatsappLink && (
                  <a className="footer-whatsapp" href={footer.whatsappLink} target="_blank" rel="noopener noreferrer">
                    {footer.whatsapp || "Chat on WhatsApp"}
                  </a>
                )}
              </div>
            )}
            {footer.email && (
              <div className="footer-contact-item">
                <strong>Email</strong>
                {footer.emailUrl ? (
                  <a href={footer.emailUrl}>{footer.email}</a>
                ) : (
                  <p>{footer.email}</p>
                )}
              </div>
            )}
            {footer.socialLinks.length > 0 && (
              <div className="footer-contact-item footer-socials">
                <strong>Follow us on</strong>
                <div>
                  {footer.socialLinks.map((item, index) => (
                    <a
                      href={item.url || "#"}
                      key={`${item.url}-${index}`}
                      aria-label={item.label || getSocialLinkLabel(index)}
                    >
                      {item.icon?.src && (
                        <img
                          src={item.icon.src}
                          alt={
                            item.icon.alt ||
                            item.label ||
                            getSocialLinkLabel(index)
                          }
                        />
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {footer.menuItems.length > 0 && (
          <nav className="footer-nav" aria-label="Footer navigation">
            {footer.menuItems.map((item, index) => (
              <a href={item.url || "#"} key={`${item.name}-${index}`}>
                {item.name}
              </a>
            ))}
          </nav>
        )}

        {(hasCopyright || footer.footerBarItems.length > 0) && (
          <div className="footer-bottom">
            {hasCopyright && (
              <div className="footer-copyright">
                {richTextToReact(footer.copyright, "footer-copyright", true)}
              </div>
            )}
            {footer.footerBarItems.length > 0 && (
              <div>
                {footer.footerBarItems.map((item, index) => (
                  <a href={item.url || "#"} key={`${item.name}-${index}`}>
                    {item.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </footer>
  );
}
