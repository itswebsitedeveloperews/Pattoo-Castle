import EventDetailsRoute, {
  generateMetadata as generateEventMetadata,
} from "../events/[slug]/page";

export const revalidate = 60;

function eventProps() {
  return { params: Promise.resolve({ slug: "groups-events" }) };
}

export async function generateMetadata() {
  return generateEventMetadata(eventProps());
}

export default function GroupsEventsRoute() {
  return EventDetailsRoute(eventProps());
}
