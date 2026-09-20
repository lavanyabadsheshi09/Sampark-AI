import {
  AlertTriangle,
  ArrowUpRight,
  BrainCircuit,
  CheckCircle2,
  MapPin,
  Package,
  Truck,
} from "lucide-react";

import { villageRequests } from "../data/villages";
import { rankVillages } from "../algorithms/PriorityEngine";

const rankedVillages = rankVillages(villageRequests);

function levelClass(level: string) {
  if (level === "Critical") return "priority-critical";
  if (level === "High") return "priority-high";
  if (level === "Moderate") return "priority-moderate";
  return "priority-low";
}

export default function SupplyPriority() {
  const topVillages = rankedVillages.slice(0, 2);

  return (
    <div className="priority-page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">AI DECISION ENGINE</div>

          <h1>Emergency Supply Priority</h1>

          <p>
            Who gets the supply first? SAMpark AI ranks emergency
            requests using an explainable priority model.
          </p>
        </div>

        <div className="prototype-label">
          <BrainCircuit size={17} />
          Prototype Explainable Decision Model
        </div>
      </div>

      {/* Formula */}
      <div className="formula-card">
        <div className="formula-icon">
          <BrainCircuit size={25} />
        </div>

        <div>
          <h3>Priority Score</h3>

          <p>
            Medical Urgency <b>30%</b> + Population <b>20%</b> +
            Stock Remaining <b>20%</b> + Accessibility <b>10%</b> +
            Weather Risk <b>15%</b> + Distance <b>5%</b>
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="priority-stats">
        <div className="priority-stat">
          <Package size={22} />
          <div>
            <span>Emergency Requests</span>
            <strong>{rankedVillages.length}</strong>
          </div>
        </div>

        <div className="priority-stat critical-stat">
          <AlertTriangle size={22} />
          <div>
            <span>Critical Requests</span>
            <strong>
              {
                rankedVillages.filter(
                  (v) => v.priorityLevel === "Critical"
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="priority-stat">
          <Truck size={22} />
          <div>
            <span>Vehicles Available</span>
            <strong>2</strong>
          </div>
        </div>

        <div className="priority-stat">
          <CheckCircle2 size={22} />
          <div>
            <span>Top Priority</span>
            <strong>{rankedVillages[0]?.name}</strong>
          </div>
        </div>
      </div>

      {/* Vehicle allocation */}
      <div className="allocation-card">
        <div className="allocation-header">
          <div>
            <h2>🚚 Recommended Vehicle Allocation</h2>
            <p>
              With only 2 vehicles available, SAMpark AI recommends
              serving the two highest-priority locations first.
            </p>
          </div>

          <span className="vehicle-badge">
            2 / 2 Vehicles
          </span>
        </div>

        <div className="allocation-grid">
          {topVillages.map((village) => (
            <div className="allocation-item" key={village.id}>
              <div className="allocation-rank">
                #{village.rank}
              </div>

              <div className="allocation-info">
                <h3>{village.name}</h3>

                <span>
                  <MapPin size={14} />
                  {village.state}
                </span>

                <p>
                  Priority score{" "}
                  <strong>{village.priorityScore}/100</strong>
                </p>
              </div>

              <div
                className={`priority-score ${levelClass(
                  village.priorityLevel
                )}`}
              >
                {village.priorityScore}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ranking table */}
      <div className="ranking-card">
        <div className="ranking-header">
          <div>
            <h2>Emergency Request Ranking</h2>
            <p>
              Requests are automatically ranked from highest to
              lowest priority.
            </p>
          </div>

          <span className="simulated-badge">
            Simulated Data
          </span>
        </div>

        <div className="table-wrapper">
          <table className="priority-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Location</th>
                <th>Medical</th>
                <th>Population</th>
                <th>Stock</th>
                <th>Access</th>
                <th>Weather</th>
                <th>Distance</th>
                <th>Priority</th>
              </tr>
            </thead>

            <tbody>
              {rankedVillages.map((village) => (
                <tr key={village.id}>
                  <td>
                    <span className="rank-number">
                      #{village.rank}
                    </span>
                  </td>

                  <td>
                    <div className="location-cell">
                      <strong>{village.name}</strong>
                      <small>{village.state}</small>
                    </div>
                  </td>

                  <td>
                    <span
                      className={`mini-badge ${village.medicalUrgency.toLowerCase()}`}
                    >
                      {village.medicalUrgency}
                    </span>
                  </td>

                  <td>
                    {village.population.toLocaleString()}
                  </td>

                  <td>
                    <span
                      className={
                        village.stockRemaining <= 20
                          ? "stock-danger"
                          : village.stockRemaining <= 40
                          ? "stock-warning"
                          : "stock-safe"
                      }
                    >
                      {village.stockRemaining}%
                    </span>
                  </td>

                  <td>{village.accessibility}</td>

                  <td>{village.weatherRisk}</td>

                  <td>{village.distanceKm} km</td>

                  <td>
                    <div className="score-cell">
                      <strong
                        className={`score-text ${levelClass(
                          village.priorityLevel
                        )}`}
                      >
                        {village.priorityScore}
                      </strong>

                      <span
                        className={`level-badge ${levelClass(
                          village.priorityLevel
                        )}`}
                      >
                        {village.priorityLevel}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Explanation */}
      <div className="explanation-card">
        <ArrowUpRight size={22} />

        <div>
          <strong>Why this ranking?</strong>

          <p>
            The model gives greater weight to medical urgency and
            critically low stock levels. Difficult access and severe
            weather increase priority, while population and distance
            provide additional context.
          </p>
        </div>
      </div>
    </div>
  );
}