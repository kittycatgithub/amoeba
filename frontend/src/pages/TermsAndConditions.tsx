import { useState } from "react";

const sections = [
  {
    id: 1,
    title: "Use of Platform",
    content:
      "PulsarProperties is a real estate portal that allows users to list, browse, and interact with property listings. Users must provide accurate and lawful information when using our services.",
  },
  {
    id: 2,
    title: "User Accounts",
    content: null,
    bullets: [
      "You are responsible for maintaining the confidentiality of your account credentials.",
      "Any activity under your account is your sole responsibility.",
      "We reserve the right to suspend accounts in case of suspicious or fraudulent activity.",
    ],
  },
  {
    id: 3,
    title: "Property Listings",
    content: null,
    bullets: [
      "Users posting properties must ensure all details are accurate and genuine.",
      "We do not guarantee the authenticity of listings but actively moderate content.",
    ],
  },
  {
    id: 4,
    title: "Payments & Transactions",
    content: null,
    bullets: [
      "Payments made on the platform (e.g., premium listings, featured ads, subscriptions) are processed securely via Razorpay.",
      "We are not responsible for payment failures due to bank or server issues.",
      "All payments are subject to verification.",
    ],
  },
  {
    id: 5,
    title: "Refund Policy",
    content: null,
    bullets: [
      "Payments once made are non-refundable, unless otherwise specified.",
      "Refunds, if applicable, will be processed within 5–10 working days.",
    ],
  },
  {
    id: 6,
    title: "Prohibited Activities",
    content: "Users must not engage in any of the following:",
    bullets: [
      "Post false or misleading property information",
      "Engage in fraud or illegal activities",
      "Attempt to hack or disrupt the platform",
    ],
  },
  {
    id: 7,
    title: "Intellectual Property",
    content:
      "All content on the website — including logos, design, and text — belongs exclusively to PulsarProperties and is protected under applicable intellectual property laws.",
  },
  {
    id: 8,
    title: "Limitation of Liability",
    content: "We are not liable for:",
    bullets: [
      "Property disputes between buyers and sellers",
      "Financial losses due to transactions",
      "Third-party actions or services",
    ],
  },
  {
    id: 9,
    title: "Termination",
    content:
      "We reserve the right to terminate accounts that violate these terms without prior notice.",
  },
  {
    id: 10,
    title: "Governing Law",
    content:
      "These terms are governed by and construed in accordance with the laws of India.",
  },
];

export default function TermsAndConditions() {
  const [activeSection, setActiveSection] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <p className="text-sm text-gray-500 mb-2">Legal Document</p>
          <h1 className="text-3xl font-semibold">Terms & Conditions</h1>
          <p className="text-sm text-gray-500 mt-2">
            Last Updated: January 2025 · PulsarProperties
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Intro */}
        <div className="bg-white border rounded-lg p-5 mb-6 text-sm leading-relaxed">
          Welcome to <span className="font-semibold">PulsarProperties</span>. By
          accessing or using our platform, you agree to comply with and be bound
          by the following terms and conditions. Please read them carefully
          before proceeding.
        </div>

        {/* Sections */}
        <div className="space-y-3">
          {sections.map((section) => (
            <div
              key={section.id}
              className="bg-white border rounded-lg"
            >
              <button
                onClick={() =>
                  setActiveSection(
                    activeSection === section.id ? null : section.id
                  )
                }
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-sm">
                    {section.id.toString().padStart(2, "0")}
                  </span>
                  <span className="font-medium">{section.title}</span>
                </div>

                <span className="text-gray-400">
                  {activeSection === section.id ? "−" : "+"}
                </span>
              </button>

              {activeSection === section.id && (
                <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">
                  {section.content && <p>{section.content}</p>}

                  {section.bullets && (
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      {section.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-sm text-gray-500">
          For questions regarding these terms, contact us at{" "}
          <span className="font-medium text-gray-700">
            support@pulsarproperties.com
          </span>
          <br />
          These terms are governed by the laws of{" "}
          <span className="font-medium text-gray-700">India</span>.
        </div>
      </div>
    </div>
  );
}