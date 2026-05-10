import React from "react";

const refundSteps = [
  { step: "01", title: "Submit Request", desc: "Contact our support team with your order ID and reason for refund within the eligible window." },
  { step: "02", title: "Verification", desc: "Our team reviews your request and verifies eligibility based on service status and policy criteria." },
  { step: "03", title: "Approval", desc: "You receive a confirmation email once the refund is approved by our billing team." },
  { step: "04", title: "Processing", desc: "Refund is initiated via Razorpay back to your original payment method within 5–10 business days." },
];

const policies = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" />
      </svg>
    ),
    label: "Non-Refundable Cases",
    items: [
      "Services already activated and delivered",
      "Premium listing fees after the listing goes live",
      "Featured ad charges once the campaign has started",
      "Subscription fees for the current billing period",
    ],
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    label: "Eligible for Refund",
    items: [
      "Duplicate payments made for the same service",
      "Payment deducted but service not activated within 24 hrs",
      "Technical errors confirmed by our support team",
      "Cancellation before service processing begins",
    ],
  },
];

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">

      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <p className="text-sm text-gray-500 mb-2">Policy Document</p>
          <h1 className="text-3xl font-semibold">Refund & Cancellation</h1>
          <p className="text-sm text-gray-500 mt-2">
            Transparent policies for all transactions processed via Razorpay on PulsarProperties.
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Refund Process */}
        <h2 className="text-sm font-semibold text-gray-500 uppercase mb-4">
          Refund Process
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {refundSteps.map((s) => (
            <div key={s.step} className="bg-white border rounded-lg p-4">
              <p className="text-xs text-gray-400 mb-1">{s.step}</p>
              <h3 className="font-medium mb-1">{s.title}</h3>
              <p className="text-sm text-gray-600">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Refund Eligibility */}
        <h2 className="text-sm font-semibold text-gray-500 uppercase mb-4">
          Refund Eligibility
        </h2>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {policies.map((p, i) => (
            <div key={i} className="bg-white border rounded-lg p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-gray-600">{p.icon}</span>
                <h3 className="font-medium">{p.label}</h3>
              </div>
              <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                {p.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="bg-white border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-2">
          <span className="text-sm text-gray-600">
            Refund credited via original payment method (Razorpay)
          </span>
          <span className="font-medium">5–10 Business Days</span>
        </div>

        {/* Service Delivery */}
        <h2 className="text-sm font-semibold text-gray-500 uppercase mb-4">
          Service Delivery Policy
        </h2>

        <div className="bg-white border rounded-lg p-5">
          <h3 className="font-medium mb-2">Digital Delivery Only</h3>
          <p className="text-sm text-gray-600 mb-4">
            PulsarProperties is a fully digital platform. All services are delivered electronically — no physical shipping involved.
          </p>

          <div className="space-y-3 text-sm text-gray-600">
            <div>
              <p className="font-medium">⚡ Instant Activation</p>
              <p>Premium listings and featured ads go live within minutes of payment confirmation.</p>
            </div>

            <div>
              <p className="font-medium">📬 Within 24 Hours</p>
              <p>All other digital services are fully activated within 24 hours of successful payment.</p>
            </div>

            <div>
              <p className="font-medium">📦 No Physical Shipping</p>
              <p>We do not ship any physical products. All services exist entirely on our platform.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}