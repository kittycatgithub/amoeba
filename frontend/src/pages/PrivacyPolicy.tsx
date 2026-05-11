const privacySections = [
  {
    icon: "📋",
    title: "Information We Collect",
    items: [
      { label: "Personal Details", desc: "Name, email address, and phone number provided during registration." },
      { label: "Property Information", desc: "Details about properties you list or inquire about on our platform." },
      { label: "Payment Details", desc: "Transactions processed securely via Razorpay — we never store card numbers or CVV." },
    ],
  },
  {
    icon: "🔧",
    title: "How We Use Your Information",
    items: [
      { label: "Service Delivery", desc: "To provide, maintain, and improve our real estate platform." },
      { label: "Payment Processing", desc: "To securely handle transactions through our payment partners." },
      { label: "Communications", desc: "To send updates, alerts, and relevant property offers." },
    ],
  },
  {
    icon: "🛡️",
    title: "Data Protection",
    items: [
      { label: "Security Measures", desc: "We implement industry-standard encryption and security protocols to protect your data." },
      { label: "Limitations", desc: "No system is 100% secure. We encourage strong passwords and safe browsing habits." },
    ],
  },
  {
    icon: "🤝",
    title: "Sharing of Information",
    items: [
      { label: "No Selling", desc: "We do not sell, rent, or trade your personal information to third parties." },
      { label: "Payment Gateways", desc: "We share necessary data with Razorpay to process your transactions securely." },
      { label: "Legal Authorities", desc: "We may disclose information when required by law or court order." },
    ],
  },
  {
    icon: "🍪",
    title: "Cookies",
    items: [
      { label: "Usage", desc: "We use cookies to enhance user experience, remember preferences, and analyze site traffic." },
      { label: "Control", desc: "You can manage cookie preferences through your browser settings at any time." },
    ],
  },
  {
    icon: "✋",
    title: "Your Rights",
    items: [
      { label: "Access", desc: "Request a copy of all personal data we hold about you." },
      { label: "Correction", desc: "Update or correct inaccurate personal information." },
      { label: "Deletion", desc: "Request deletion of your account and associated data." },
    ],
  },
  {
    icon: "🔗",
    title: "Third-Party Links",
    items: [
      { label: "External Sites", desc: "Our platform may contain links to third-party websites. We are not responsible for their privacy practices." },
    ],
  },
  {
    icon: "🔄",
    title: "Policy Updates",
    items: [
      { label: "Changes", desc: "We may update this policy periodically. Continued use of our platform constitutes acceptance of the updated policy." },
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">

      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <p className="text-sm text-gray-500 mb-2">Legal</p>
          <h1 className="text-3xl font-semibold">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mt-2">
            Last Updated: January 2025 · PulsarProperties
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Intro */}
        <div className="bg-white border rounded-lg p-5 mb-6 text-sm leading-relaxed">
          At <span className="font-semibold">PulsarProperties</span>, we value your privacy and are committed to protecting your personal information. This policy explains what we collect, how we use it, and the choices you have regarding your data.
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {privacySections.map((sec, idx) => (
            <div key={idx} className="bg-white border rounded-lg p-5">

              {/* Title */}
              <div className="flex items-center gap-2 mb-3">
                <span>{sec.icon}</span>
                <h2 className="font-medium">{sec.title}</h2>
              </div>

              {/* Items */}
              <div className="space-y-3">
                {sec.items.map((item, i) => (
                  <div key={i}>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      {item.label}
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-sm text-gray-500">
          Questions about your data?
          <br />
          Contact us at{" "}
          <span className="font-medium text-gray-700">
            support@pulsarproperties.com
          </span>
        </div>
      </div>
    </div>
  );
}