const countries = [
  { code: "ng", name: "Nigeria" },
  { code: "gh", name: "Ghana" },
  { code: "zm", name: "Zambia" },
  { code: "qa", name: "Qatar" },
  { code: "cm", name: "Cameroon" },
  { code: "lr", name: "Liberia" },
  { code: "fr", name: "France" },
  { code: "ug", name: "Uganda" },
  { code: "za", name: "South Africa" },
  { code: "ci", name: "Côte d'Ivoire" },
  { code: "gn", name: "Guinea" },
  { code: "bj", name: "Benin Republic" },
  { code: "gm", name: "The Gambia" },
  { code: "rw", name: "Rwanda" },
  { code: "my", name: "Malaysia" },
];

import { CircleFlag } from "react-circle-flags";

export default function Countries() {
  return (
    <section className="countries">
      <div className="countries-track">
        {[...countries, ...countries].map((country, index) => (
          <div className="country-pill" key={index}>
            <div className="flag">
              <CircleFlag countryCode={country.code} height={18} />
            </div>
            <span>{country.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
