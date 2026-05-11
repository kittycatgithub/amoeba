import { useState, useEffect } from "react";

const services = [
  {
    id: 1,
    title: "Real Estate",
    description:
      "Browse, list, and discover properties with ease. From rentals to sales, find your perfect space with verified listings across all categories.",
    icon: '/icons/house.png',
  },
  {
    id: 2,
    title: "Jobs - Coming Soon",
    description:
      "Connect with top employers and opportunities in real estate, construction, and related industries. Your next career move starts here.",
    icon: '/icons/promotion.png',
  },
  {
    id: 3,
    title: "Hire Professionals - Coming Soon",
    description:
      "Find trusted architects, interior designers, contractors, and more. Get your space built or renovated by verified professionals.",
    icon: '/icons/interview.png',
  },
  {
    id: 4,
    title: "Link Website - Coming Soon",
    description:
      "Dealers can link their own website to 26Shelters and expand their reach. Get discovered by thousands of buyers and renters instantly.",
    icon: '/icons/application.png',
    forDealers: true,
  },
];

// function ArrowConnector() {
//   return (
//     <div
//       style={{
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         flexShrink: 0,
//         width: "40px",
//       }}
//     >
//       <svg width="36" height="20" viewBox="0 0 36 20" fill="none">
//         <path
//           d="M2 10 Q18 3 34 10"
//           stroke="#22c55e"
//           strokeWidth="2"
//           fill="none"
//           strokeLinecap="round"
//         />
//         <path
//           d="M29 7L34 10L29 13"
//           stroke="#22c55e"
//           strokeWidth="2"
//           fill="none"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         />
//       </svg>
//     </div>
//   );
// }

export default function ServicesSection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="px-4 py-12"
      style={{
        background: "#f8fafc",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        .service-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 28px 24px 32px;
          position: relative;
          overflow: hidden;
          flex: 1;
          min-width: 0;
          transition: box-shadow 0.2s, transform 0.2s;
          opacity: 0;
          transform: translateY(20px);
        }
        .service-card.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .service-card:hover {
          box-shadow: 0 8px 32px rgba(37, 99, 235, 0.1);
          transform: translateY(-4px);
        }
        .badge-num {
          position: absolute;
          top: 0;
          right: 0;
          width: 64px;
          height: 64px;
          background: #dbeafe;
          border-radius: 0 16px 0 64px;
          display: flex;
          align-items: flex-start;
          justify-content: flex-end;
          padding: 10px 12px 0 0;
        }
        .badge-num span {
          font-size: 22px;
          font-weight: 700;
          line-height: 1;
        }
        .coming-soon-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          color: #2563EB;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 20px;
          margin-bottom: 10px;
        }
        .coming-soon-badge::before {
          content: '';
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #2563EB;
          opacity: 0.5;
        }
        .dealers-tag {
          display: inline-block;
          background: #fefce8;
          border: 1px solid #fde68a;
          color: #92400e;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          padding: 3px 8px;
          border-radius: 20px;
          vertical-align: middle;
        }
        .arrow-row {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        @media (max-width: 900px) {
          .cards-row {
            flex-direction: column !important;
          }
          .arrow-row {
            transform: rotate(90deg);
            margin: 4px 0;
          }
        }
        @media (max-width: 600px) {
          .section-title {
            font-size: 26px !important;
          }
          .section-subtitle {
            font-size: 14px !important;
          }
        }
      `}</style>

      {/* Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "48px",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(-12px)",
          transition: "opacity 0.5s, transform 0.5s",
        }}
      >
        <h2
          className="section-title"
          style={{
            fontSize: "34px",
            fontWeight: "700",
            color: "#1e3a5f",
            margin: "0 0 14px",
            lineHeight: 1.2,
          }}
        >
          Services Offered By{" "}
          <span className="text-primary">26Shelters</span>
        </h2>
        <p
          className="section-subtitle"
          style={{
            fontSize: "15px",
            color: "#64748b",
            maxWidth: "520px",
            margin: "0 auto",
            lineHeight: 1.7,
          }}
        >
          Everything you need under one roof — from finding your dream property
          to connecting with the right professionals and opportunities.
        </p>
      </div>

      {/* Cards Row */}
      <div
        className="cards-row gap-4"
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {services.map((svc, i) => (
          <div
            key={svc.id}
            style={{ display: "flex", alignItems: "center", flex: i < services.length - 1 ? "1 1 0" : "1 1 0", minWidth: 0 }}
          >
            <div
              className={`service-card${visible ? " visible" : ""} min-h-72 bg-amber-50`}
              style={{
                transitionDelay: `${0.1 + i * 0.1}s`,
                flex: 1,
                minWidth: 0,
              }}
            >
              {/* Number badge */}
              <div className="badge-num text-primary">
                <span>{svc.id}</span>
              </div>

              {/* Icon */}
              <img src={svc.icon} alt="" className="mb-5 w-10"/>

              {/* Title */}
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#1e3a5f",
                  margin: "0 0 10px",
                  lineHeight: 1.3,
                  paddingRight: "32px",
                }}
              >
                {svc.title}
                {svc.forDealers && (
                  <span className="dealers-tag md:ml-2">For Dealers</span>
                )}
                {/* Coming soon badge */}
              </h3>

              {/* Description */}
              <p className="text-themegray"
              >
                {svc.description}
              </p>
            </div>

            {/* Arrow connector between cards */}
            {/* {i < services.length - 1 && (
              <div className="arrow-row hidden md:block" style={{ padding: "0 4px" }}>
                <ArrowConnector />
              </div>
            )} */}
          </div>
        ))}
      </div>
    </div>
  );
}