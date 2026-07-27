import {
  getContentfulAssetSrc,
  getFooterContent,
  getHeaderContent,
  richTextToPlainText,
} from "./App";
import EventUploadField from "./EventUploadField";
import AosInitializer from "./AosInitializer";
import MinTodayDateInput from "./MinTodayDateInput";
import NetlifyForm from "./NetlifyForm";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

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
      <AosInitializer />
      <SiteHeader header={header} />
      <main>
        <section
          className="section page-hero event-detail-hero"
          style={
            eventDetails.bannerImage
              ? {
                  "--event-detail-banner-image": `url(${eventDetails.bannerImage})`,
                }
              : undefined
          }
          aria-labelledby={
            eventDetails.heading ? "event-detail-title" : undefined
          }
        >
          <div className="wrap">
            <div className="page-hero-content event-detail-hero-content">
              <p
                className="eyebrow page-hero-eyebrow event-detail-hero-eyebrow"
                data-aos="fade-up"
                data-aos-delay="20"
              >
                Event
              </p>
              {eventDetails.heading && (
                <h1
                  id="event-detail-title"
                  data-aos="fade-up"
                  data-aos-delay="50"
                >
                  {eventDetails.heading}
                </h1>
              )}
              {eventDetails.content && (
                <p data-aos="fade-up" data-aos-delay="100">
                  {eventDetails.content}
                </p>
              )}
              {hasButton && (
                <a
                  className="button button--light page-hero-button event-detail-hero-button"
                  href={eventDetails.buttonUrl}
                  data-aos="fade-up"
                  data-aos-delay="150"
                >
                  {eventDetails.buttonText}
                </a>
              )}
            </div>
          </div>
        </section>

        <section
          className="section event-inquiry-section"
          aria-labelledby="event-inquiry-title"
        >
          <div className="wrap">
            <div
              className="event-inquiry-header"
              data-aos="fade-up"
              data-aos-delay="50"
            >
              <h2 id="event-inquiry-title">{inquiryTitle}</h2>
              <span aria-hidden="true" />
            </div>

            <NetlifyForm
              className="event-inquiry-form"
              id="event-inquiry-form"
              formName="event-inquiry"
              encType="multipart/form-data"
            >
              <fieldset
                className="event-inquiry-card"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <div className="legend">
                  <span className="event-inquiry-icon" aria-hidden="true">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17.4167 4.58398H4.58333C3.57081 4.58398 2.75 5.4048 2.75 6.41732V17.4173C2.75 18.4298 3.57081 19.2507 4.58333 19.2507H17.4167C18.4292 19.2507 19.25 18.4298 19.25 17.4173V6.41732C19.25 5.4048 18.4292 4.58398 17.4167 4.58398Z"
                        stroke="#B9802E"
                        strokeWidth="1.55833"
                      />
                      <path
                        d="M14.6667 2.75V6.41667M7.33333 2.75V6.41667M2.75 9.16667H19.25"
                        stroke="#B9802E"
                        strokeWidth="1.55833"
                      />
                    </svg>
                  </span>
                  Event Information
                </div>

                <div className="event-inquiry-grid">
                  <label className="event-inquiry-field event-inquiry-field--full">
                    <span>Event Type *</span>
                    <select name="eventType" required defaultValue="">
                      <option value="" disabled>
                        Select event type
                      </option>
                      <option value="wedding">Wedding</option>
                      <option value="renewal">Vow Renewal</option>
                      <option value="celebration">Celebration</option>
                      <option value="corporate">Corporate Event</option>
                    </select>
                  </label>

                  <label className="event-inquiry-field event-inquiry-field--half">
                    <span>Estimated Number Of Attendees *</span>
                    <input
                      type="number"
                      name="attendees"
                      required
                      min="1"
                      placeholder="Enter number of attendees"
                    />
                  </label>

                  <label className="event-inquiry-field event-inquiry-field--half">
                    <span>Estimated Guest Room Count *</span>
                    <input
                      type="number"
                      name="guestRooms"
                      required
                      min="0"
                      placeholder="Enter number of guest rooms"
                    />
                  </label>

                  <label className="event-inquiry-field">
                    <span>Decision Date *</span>
                    <MinTodayDateInput
                      name="decisionDate"
                      ariaLabel="Decision date"
                    />
                  </label>

                  <label className="event-inquiry-field">
                    <span>Preferred Arrival Date *</span>
                    <MinTodayDateInput
                      name="arrivalDate"
                      ariaLabel="Preferred arrival date"
                    />
                  </label>

                  <label className="event-inquiry-field">
                    <span>Preferred Departure Date *</span>
                    <MinTodayDateInput
                      name="departureDate"
                      ariaLabel="Preferred departure date"
                    />
                  </label>
                </div>

                <div className="event-inquiry-flexible">
                  <p>Are your dates flexible?</p>
                  <label>
                    <input
                      type="radio"
                      name="datesFlexible"
                      required
                      value="yes"
                      defaultChecked
                    />
                    <span>Yes</span>
                  </label>
                  <label>
                    <input type="radio" name="datesFlexible" value="no" />
                    <span>No</span>
                  </label>
                </div>
              </fieldset>

              <fieldset
                className="event-inquiry-card"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div className="legend">
                  <span className="event-inquiry-icon" aria-hidden="true">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.9987 10.0833C13.0237 10.0833 14.6654 8.44171 14.6654 6.41667C14.6654 4.39162 13.0237 2.75 10.9987 2.75C8.97365 2.75 7.33203 4.39162 7.33203 6.41667C7.33203 8.44171 8.97365 10.0833 10.9987 10.0833Z"
                        stroke="#B9802E"
                        strokeWidth="1.55833"
                      />
                      <path
                        d="M3.66797 19.2507V17.4173C3.66797 15.4724 4.44059 13.6071 5.81585 12.2319C7.19112 10.8566 9.05638 10.084 11.0013 10.084C12.9462 10.084 14.8115 10.8566 16.1868 12.2319C17.562 13.6071 18.3346 15.4724 18.3346 17.4173V19.2507"
                        stroke="#B9802E"
                        strokeWidth="1.55833"
                      />
                    </svg>
                  </span>
                  Contact Information
                </div>

                <div className="event-inquiry-grid event-inquiry-grid--contact">
                  <label className="event-inquiry-field">
                    <span>I am The *</span>
                    <select name="contactRole" required defaultValue="">
                      <option value="" disabled>
                        Select
                      </option>
                      <option value="planner">Planner</option>
                      <option value="host">Host</option>
                      <option value="guest">Guest</option>
                    </select>
                  </label>

                  <label className="event-inquiry-field">
                    <span>Title *</span>
                    <select name="title" required defaultValue="">
                      <option value="" disabled>
                        Select
                      </option>
                      <option value="mr">Mr.</option>
                      <option value="mrs">Mrs.</option>
                      <option value="ms">Ms.</option>
                      <option value="dr">Dr.</option>
                    </select>
                  </label>

                  <label className="event-inquiry-field">
                    <span>First Name *</span>
                    <input
                      type="text"
                      name="firstName"
                      required
                      placeholder="Enter first name"
                    />
                  </label>

                  <label className="event-inquiry-field">
                    <span>Last Name *</span>
                    <input
                      type="text"
                      name="lastName"
                      required
                      placeholder="Enter last name"
                    />
                  </label>

                  <label className="event-inquiry-field">
                    <span>Event Type *</span>
                    <input
                      type="text"
                      name="contactEventType"
                      required
                      placeholder="Enter event type"
                    />
                  </label>

                  <label className="event-inquiry-field event-inquiry-field--full">
                    <span>Address *</span>
                    <input
                      type="text"
                      name="address"
                      required
                      placeholder="Enter address"
                    />
                  </label>

                  <label className="event-inquiry-field event-inquiry-field--half">
                    <span>Address Line 2</span>
                    <input
                      type="text"
                      name="addressLine2"
                      placeholder="Enter address line 2"
                    />
                  </label>

                  <label className="event-inquiry-field event-inquiry-field--half">
                    <span>City *</span>
                    <input
                      type="text"
                      name="city"
                      required
                      placeholder="Enter city"
                    />
                  </label>

                  <label className="event-inquiry-field">
                    <span>State *</span>
                    <select name="state" required defaultValue="">
                      <option value="" disabled>
                        Select state
                      </option>
                      <option value="jamaica">Jamaica</option>
                      <option value="other">Other</option>
                    </select>
                  </label>

                  <label className="event-inquiry-field">
                    <span>Postal Code *</span>
                    <input
                      type="text"
                      name="postalCode"
                      required
                      placeholder="Enter postal code"
                    />
                  </label>

                  <label className="event-inquiry-field">
                    <span>Email Address *</span>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="Enter email address"
                    />
                  </label>

                  <label className="event-inquiry-field">
                    <span>Phone *</span>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="Enter phone number"
                    />
                  </label>
                </div>
              </fieldset>

              <fieldset
                className="event-inquiry-card"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <div className="legend">
                  <span className="event-inquiry-icon" aria-hidden="true">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.5 1.83398H13.75L18.3333 6.41732V20.1673H5.5V1.83398Z"
                        stroke="#B9802E"
                        strokeWidth="1.55833"
                      />
                      <path
                        d="M12.832 1.83398V7.33398H18.332"
                        stroke="#B9802E"
                        strokeWidth="1.55833"
                      />
                    </svg>
                  </span>
                  Event Detail
                </div>

                <p className="event-inquiry-note">
                  If you have a pre-prepared Request for Proposal, please upload
                  below.
                </p>

                <EventUploadField />
              </fieldset>
              <div className="text-center">
                <button
                  className="button event-inquiry-submit"
                  type="submit"
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  Submit Request
                </button>
              </div>
            </NetlifyForm>
          </div>
        </section>
      </main>
      <SiteFooter footer={footer} />
    </>
  );
}
