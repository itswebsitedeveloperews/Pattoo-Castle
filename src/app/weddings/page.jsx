import EventDetailsRoute, {
  generateMetadata as generateEventMetadata,
} from "../events/[slug]/page";

export const revalidate = 60;

function eventProps() {
  return { params: Promise.resolve({ slug: "weddings" }) };
}

export async function generateMetadata() {
  return generateEventMetadata(eventProps());
}

export default function WeddingsRoute() {
  return EventDetailsRoute(eventProps());
}
