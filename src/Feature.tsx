import { useState } from "react";
import { useSharedMilestones, type MeshConfig, type YRoom } from "@baditaflorin/mesh-common";

type Props = { room: YRoom | null; config: MeshConfig };

export function Feature({ room, config }: Props) {
  const shared = useSharedMilestones(room);
  const [label, setLabel] = useState("");
  const done = shared.milestones.filter((item) => item.complete).length;

  return (
    <main className="feature-placeholder">
      <h1>{config.appName}</h1>
      <p>Make a simple shared path, then check off progress together.</p>
      <p className="feature-status">
        {room ? `Connected · ${room.peerCount} peer(s)` : "Connecting…"}
      </p>
      <form
        className="entry-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (shared.add(label)) setLabel("");
        }}
      >
        <label htmlFor="milestone-label">Next milestone</label>
        <div>
          <input
            id="milestone-label"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            placeholder="e.g. Invite the team"
            maxLength={120}
          />
          <button type="submit">Add</button>
        </div>
      </form>
      <section className="panel" aria-live="polite">
        <h2>
          {done} of {shared.milestones.length} complete
        </h2>
        {shared.milestones.length ? (
          <ol>
            {shared.milestones.map((item) => (
              <li key={item.id}>
                <label className={item.complete ? "complete" : ""}>
                  <input
                    type="checkbox"
                    checked={item.complete}
                    onChange={() => shared.toggle(item.id)}
                  />{" "}
                  <span>{item.label}</span>
                </label>
              </li>
            ))}
          </ol>
        ) : (
          <p className="hint">Add the first step to create your map.</p>
        )}
      </section>
    </main>
  );
}
