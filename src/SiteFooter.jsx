function richTextToReact(value, keyPrefix = "rich-text") {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item, index) => (
      <span key={`${keyPrefix}-${index}`}>
        {richTextToReact(item, `${keyPrefix}-${index}`)}
      </span>
    ));
  }

  if (typeof value !== "object") {
    return null;
  }

  if (typeof value.value === "string") {
    return value.value;
  }

  const children = richTextToReact(value.content, `${keyPrefix}-content`);

  if (value.nodeType === "hyperlink") {
    return (
      <a href={value.data?.uri || "#"} key={keyPrefix}>
        {children}
      </a>
    );
  }

  return children;
}

function getPhoneHref(phone) {
  const value = phone.replace(/[^\d+]/g, "");

  return value ? `tel:${value}` : "";
}

function getSocialLinkLabel(index) {
  return `Pattoo Castle social link ${index + 1}`;
}

export default function SiteFooter({ footer }) {
  const hasContact = Boolean(
    footer.location ||
      footer.phone ||
      footer.email ||
      footer.socialLinks.length,
  );
  const hasFooter = Boolean(
    footer.logo?.src ||
      hasContact ||
      footer.menuItems.length ||
      footer.copyright ||
      footer.designBy ||
      footer.footerBarMenu,
  );

  if (!hasFooter) {
    return null;
  }

  return (
    <footer className="site-footer">
      <div className="site-footer-inner container">
        {footer.logo?.src && (
          <a className="footer-brand" href="/" aria-label="Pattoo Castle home">
            <img
              src={footer.logo.src}
              alt={footer.logo.alt || "Pattoo Castle"}
            />
          </a>
        )}

        {hasContact && (
          <div className="footer-contact-grid">
            {footer.location && (
              <div className="footer-contact-item">
                <strong>Location</strong>
                <p>{footer.location}</p>
              </div>
            )}
            {footer.phone && (
              <div className="footer-contact-item">
                <strong>Tel</strong>
                <a href={getPhoneHref(footer.phone)}>{footer.phone}</a>
              </div>
            )}
            {footer.email && (
              <div className="footer-contact-item">
                <strong>Email</strong>
                <a href={`mailto:${footer.email}`}>{footer.email}</a>
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

        {(footer.copyright || footer.designBy || footer.footerBarMenu) && (
          <div className="footer-bottom">
            {footer.copyright && <p>{footer.copyright}</p>}
            {(footer.designBy || footer.footerBarMenu) && (
              <div>
                {footer.designBy && (
                  <span>{richTextToReact(footer.designByRichText)}</span>
                )}
                {footer.footerBarMenu && (
                  <a href={footer.footerBarUrl || "#"}>
                    {footer.footerBarMenu}
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </footer>
  );
}
