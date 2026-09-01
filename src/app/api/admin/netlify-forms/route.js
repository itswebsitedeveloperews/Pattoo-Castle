export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FORM_DEFINITIONS = [
  { key: "contact", name: "contact", label: "Contact" },
  { key: "eventInquiry", name: "event-inquiry", label: "Events Enquiry" },
  { key: "stayInquiry", name: "stay-inquiry", label: "Stay Enquiry" },
];

function json(body, status = 200) {
  return Response.json(body, { status });
}

function isAuthorized(password) {
  const configuredPassword = process.env.ADMIN_SUBMISSIONS_PASSWORD;

  return Boolean(configuredPassword && password === configuredPassword);
}

function normalizeSubmission(submission) {
  const data = submission?.data || {};
  const firstName = data.firstName || data.first_name || "";
  const lastName = data.lastName || data.last_name || "";
  const fallbackName = [firstName, lastName].filter(Boolean).join(" ").trim();

  return {
    id: submission.id,
    number: submission.number,
    name: submission.name || data.name || fallbackName,
    email: submission.email || data.email || "",
    phone: data.phone || "",
    summary: submission.summary || submission.body || "",
    createdAt: submission.created_at || "",
    data,
  };
}

async function netlifyFetch(path, token) {
  const response = await fetch(`https://api.netlify.com/api/v1${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Netlify API ${response.status}: ${text}`);
  }

  return response.json();
}

export async function POST(request) {
  let body = {};

  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  if (!isAuthorized(body.password)) {
    return json({ error: "Incorrect password." }, 401);
  }

  const siteId = process.env.NETLIFY_SITE_ID;
  const token = process.env.NETLIFY_API_TOKEN;

  if (!siteId || !token) {
    return json(
      {
        error:
          "Netlify submissions are not configured. Add NETLIFY_SITE_ID and NETLIFY_API_TOKEN.",
      },
      503,
    );
  }

  try {
    const forms = await netlifyFetch(
      `/sites/${encodeURIComponent(siteId)}/forms`,
      token,
    );

    const result = await Promise.all(
      FORM_DEFINITIONS.map(async (definition) => {
        const form = forms.find((item) => item.name === definition.name);

        if (!form) {
          return {
            ...definition,
            submissionCount: 0,
            fields: [],
            submissions: [],
          };
        }

        const submissions = await netlifyFetch(
          `/forms/${encodeURIComponent(form.id)}/submissions?per_page=100`,
          token,
        );

        return {
          ...definition,
          submissionCount: form.submission_count || submissions.length,
          fields: form.fields || [],
          submissions: submissions.map(normalizeSubmission),
        };
      }),
    );

    return json({
      forms: result,
      refreshedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Netlify submissions request failed:", error);

    return json(
      {
        error:
          "Could not load Netlify submissions. Check the site ID, token, and Netlify Forms access.",
      },
      502,
    );
  }
}
