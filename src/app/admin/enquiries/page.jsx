import EnquiriesAdmin from "./EnquiriesAdmin";

// oxlint-disable-next-line react/only-export-components
export const metadata = {
  title: "Form Enquiries",
  robots: {
    index: false,
    follow: false,
  },
};

export default function EnquiriesAdminPage() {
  return <EnquiriesAdmin />;
}
