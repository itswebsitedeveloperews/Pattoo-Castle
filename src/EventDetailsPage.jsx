import {
  getContentfulAssetSrc,
  getFooterContent,
  getHeaderContent,
  richTextToPlainText,
  SiteFooter,
  SiteHeader,
} from "./App";
import EventUploadField from "./EventUploadField";

function getEventDetailsContent(entry) {
  const fields = entry?.fields || {};

  return {
    slug: fields.eventSlug || "",
    bannerImage: getContentfulAssetSrc(fields.eventBannerImage),
    heading: fields.eventHeading || "",
    content: richTextToPlainText(fields.eventContent),
    buttonText: fields.eventButtonText || "",
    buttonUrl: fields.eventButtonUrl || fields.eventButtonURL || "",
  };
}

export default function EventDetailsPage({
  eventDetailsEntry = null,
  footerEntry = null,
  headerEntry = null,
}) {
  const eventDetails = getEventDetailsContent(eventDetailsEntry);
  const footer = getFooterContent(footerEntry);
  const header = getHeaderContent(headerEntry);
  const hasButton = Boolean(eventDetails.buttonText && eventDetails.buttonUrl);
  const inquiryTitle = eventDetails.heading
    ? `${eventDetails.heading} Inquiry`
    : "Event Inquiry";

  return (
    <>
      <SiteHeader header={header} />
      <main>
      <section
        className="page-hero event-detail-hero"
        style={
          eventDetails.bannerImage
            ? {
                "--event-detail-banner-image": `url(${eventDetails.bannerImage})`,
              }
            : undefined
        }
        aria-labelledby={eventDetails.heading ? "event-detail-title" : undefined}
      >
        <div className="page-hero-content event-detail-hero-content">
          <p className="page-hero-eyebrow event-detail-hero-eyebrow">Event</p>
          {eventDetails.heading && (
            <h1 id="event-detail-title">{eventDetails.heading}</h1>
          )}
          {eventDetails.content && <p>{eventDetails.content}</p>}
          {hasButton && (
            <a
              className="button button--light page-hero-button event-detail-hero-button"
              href={eventDetails.buttonUrl}
            >
              {eventDetails.buttonText}
            </a>
          )}
        </div>
      </section>

      <section className="event-inquiry-section" aria-labelledby="event-inquiry-title">
        <div className="event-inquiry-header">
          <h2 id="event-inquiry-title">{inquiryTitle}</h2>
          <span aria-hidden="true" />
        </div>

        <form className="event-inquiry-form" id="event-inquiry-form">
          <fieldset className="event-inquiry-card">
            <div className="legend">
              <span className="event-inquiry-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M7 3.75v3" />
                  <path d="M17 3.75v3" />
                  <path d="M4.75 8.5h14.5" />
                  <path d="M6.25 5.25h11.5a1.75 1.75 0 0 1 1.75 1.75v10.75a1.75 1.75 0 0 1-1.75 1.75H6.25a1.75 1.75 0 0 1-1.75-1.75V7a1.75 1.75 0 0 1 1.75-1.75Z" />
                </svg>
              </span>
              Event Information
            </div>

            <div className="event-inquiry-grid">
              <label className="event-inquiry-field event-inquiry-field--full">
                <span>Event Type</span>
                <select name="eventType" defaultValue="">
                  <option value="" disabled>Select event type</option>
                  <option value="wedding">Wedding</option>
                  <option value="renewal">Vow Renewal</option>
                  <option value="celebration">Celebration</option>
                  <option value="corporate">Corporate Event</option>
                </select>
              </label>

              <label className="event-inquiry-field event-inquiry-field--half">
                <span>Estimated Number Of Attendees</span>
                <input
                  type="number"
                  name="attendees"
                  min="1"
                  placeholder="Enter number of attendees"
                />
              </label>

              <label className="event-inquiry-field event-inquiry-field--half">
                <span>Estimated Guest Room Count</span>
                <input
                  type="number"
                  name="guestRooms"
                  min="0"
                  placeholder="Enter number of guest rooms"
                />
              </label>

              <label className="event-inquiry-field">
                <span>Decision Date</span>
                <input type="date" name="decisionDate" />
              </label>

              <label className="event-inquiry-field">
                <span>Preferred Arrival Date</span>
                <input type="date" name="arrivalDate" />
              </label>

              <label className="event-inquiry-field">
                <span>Preferred Departure Date</span>
                <input type="date" name="departureDate" />
              </label>
            </div>

            <div className="event-inquiry-flexible">
              <p>Are your dates flexible?</p>
              <label>
                <input type="radio" name="datesFlexible" value="yes" defaultChecked />
                <span>Yes</span>
              </label>
              <label>
                <input type="radio" name="datesFlexible" value="no" />
                <span>No</span>
              </label>
            </div>
          </fieldset>

          <fieldset className="event-inquiry-card">
            <div className="legend">
              <span className="event-inquiry-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M12 12.25a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
                  <path d="M5.75 19.5a6.25 6.25 0 0 1 12.5 0" />
                </svg>
              </span>
              Contact Information
            </div>

            <div className="event-inquiry-grid event-inquiry-grid--contact">
              <label className="event-inquiry-field">
                <span>I am The</span>
                <select name="contactRole" defaultValue="">
                  <option value="" disabled>Select</option>
                  <option value="planner">Planner</option>
                  <option value="host">Host</option>
                  <option value="guest">Guest</option>
                </select>
              </label>

              <label className="event-inquiry-field">
                <span>Title</span>
                <select name="title" defaultValue="">
                  <option value="" disabled>Select</option>
                  <option value="mr">Mr.</option>
                  <option value="mrs">Mrs.</option>
                  <option value="ms">Ms.</option>
                  <option value="dr">Dr.</option>
                </select>
              </label>

              <label className="event-inquiry-field">
                <span>First Name</span>
                <input type="text" name="firstName" placeholder="Enter first name" />
              </label>

              <label className="event-inquiry-field">
                <span>Event Type</span>
                <input type="text" name="contactEventType" placeholder="Enter last name" />
              </label>

              <label className="event-inquiry-field event-inquiry-field--full">
                <span>Address</span>
                <input type="text" name="address" placeholder="Enter address" />
              </label>

              <label className="event-inquiry-field event-inquiry-field--half">
                <span>Address Line 2</span>
                <input type="text" name="addressLine2" placeholder="Enter address line 2" />
              </label>

              <label className="event-inquiry-field event-inquiry-field--half">
                <span>City</span>
                <input type="text" name="city" placeholder="Enter city" />
              </label>

              <label className="event-inquiry-field">
                <span>State</span>
                <select name="state" defaultValue="">
                  <option value="" disabled>Select state</option>
                  <option value="jamaica">Jamaica</option>
                  <option value="other">Other</option>
                </select>
              </label>

              <label className="event-inquiry-field">
                <span>Postal Code</span>
                <input type="text" name="postalCode" placeholder="Enter postal code" />
              </label>

              <label className="event-inquiry-field">
                <span>Email Address</span>
                <input type="email" name="email" placeholder="Enter email address" />
              </label>

              <label className="event-inquiry-field">
                <span>Phone</span>
                <input type="tel" name="phone" placeholder="Enter phone number" />
              </label>
            </div>
          </fieldset>

          <fieldset className="event-inquiry-card">
            <div className="legend">
              <span className="event-inquiry-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M7.25 3.75h6.75l3.75 3.75v12.75H7.25V3.75Z" />
                  <path d="M14 3.75V7.5h3.75" />
                </svg>
              </span>
              Event Detail
            </div>

            <p className="event-inquiry-note">
              If you have a pre-prepared Request for Proposal, please upload below.
            </p>

            <EventUploadField />
          </fieldset>
        </form>

        <button className="event-inquiry-submit" type="submit" form="event-inquiry-form">
          Submit Request
        </button>
      </section>

      </main>
      <SiteFooter footer={footer} />
    </>
  );
}
