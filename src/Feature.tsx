import { useState } from "react";
import { useSharedMilestones, type MeshConfig, type YRoom } from "@baditaflorin/mesh-common";

type Props = { room: YRoom | null; config: MeshConfig };

export function Feature({ room, config }: Props) {
  const shared = useSharedMilestones(room);
  const [label, setLabel] = useState("");
  const done = shared.milestones.filter((item) => item.complete).length;
  const total = shared.milestones.length;
  const remaining = total - done;
  const progress = total ? Math.round((done / total) * 100) : 0;
  const canAdd = Boolean(room && label.trim());
  const productName = config.displayName ?? "Pathline";
  // Awareness counts are transport-dependent: BroadcastChannel peers can
  // merge milestones before numeric awareness catches up. Keep this state
  // useful without making an inaccurate claim about who is currently present.
  const roomCopy = room ? "Plan ready to share" : "Opening the shared plan…";

  function addMilestone() {
    if (shared.add(label)) setLabel("");
  }

  return (
    <main className="pathline" aria-labelledby="pathline-title">
      <header className="pathline-hero">
        <div className="pathline-hero-copy">
          <p className="pathline-eyebrow">Shared planning space</p>
          <h1 id="pathline-title">{productName}</h1>
          <p className="pathline-lede">
            Turn the next important move into a path the room can see, own, and finish together.
          </p>
        </div>

        <aside className="pathline-room-status" aria-live="polite">
          <span className={"pathline-live-dot" + (room ? "" : " is-pending")} aria-hidden="true" />
          <div>
            <span className="pathline-room-label">{room ? "Shared room" : "Preparing room"}</span>
            <strong>{roomCopy}</strong>
          </div>
          <code>{room?.roomId ?? "default"}</code>
        </aside>
      </header>

      <section className="pathline-planning-card" aria-labelledby="pathline-next-step">
        <div className="pathline-overview">
          <div>
            <p className="pathline-eyebrow">The path so far</p>
            <h2 id="pathline-next-step">
              {total ? `${done} of ${total} milestones complete` : "Name the next move."}
            </h2>
          </div>
          <div className="pathline-metric" aria-label={`${progress}% complete`}>
            <strong>{progress}%</strong>
            <span>complete</span>
          </div>
        </div>

        <div
          className="pathline-progress"
          role="progressbar"
          aria-label="Plan completion"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <span style={{ width: `${progress}%` }} />
        </div>

        <form
          className="pathline-entry-form"
          onSubmit={(event) => {
            event.preventDefault();
            addMilestone();
          }}
        >
          <label htmlFor="milestone-label">
            <span>Next milestone</span>
            <input
              id="milestone-label"
              value={label}
              onChange={(event) => setLabel(event.target.value)}
              placeholder="e.g. Invite the project partners"
              maxLength={120}
              autoComplete="off"
            />
          </label>
          <button type="submit" disabled={!canAdd}>
            {total ? "Add milestone" : "Create first milestone"}
          </button>
        </form>
      </section>

      <section className="pathline-timeline" aria-labelledby="pathline-timeline-heading">
        <header className="pathline-timeline-header">
          <div>
            <p className="pathline-eyebrow">Shared sequence</p>
            <h2 id="pathline-timeline-heading">The work, in order.</h2>
          </div>
          {total > 0 ? (
            <p className="pathline-remaining">
              {remaining === 0
                ? "Everything is complete"
                : `${remaining} step${remaining === 1 ? "" : "s"} to go`}
            </p>
          ) : null}
        </header>

        {total ? (
          <ol className="pathline-list" aria-live="polite">
            {shared.milestones.map((item, index) => (
              <li key={item.id} className={item.complete ? "is-complete" : ""}>
                <button
                  type="button"
                  className="pathline-milestone"
                  onClick={() => shared.toggle(item.id)}
                  aria-pressed={item.complete}
                  aria-label={`${item.complete ? "Reopen" : "Complete"} milestone: ${item.label}`}
                >
                  <span className="pathline-marker" aria-hidden="true">
                    {item.complete ? "✓" : String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="pathline-milestone-copy">
                    <strong>{item.label}</strong>
                    <span>
                      {item.complete
                        ? "Complete — tap to reopen"
                        : "In progress — tap when complete"}
                    </span>
                  </span>
                  <span className="pathline-toggle-label" aria-hidden="true">
                    {item.complete ? "Done" : "Mark done"}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        ) : (
          <div className="pathline-empty">
            <span aria-hidden="true">01</span>
            <div>
              <h3>Start where the work gets real.</h3>
              <p>
                Add the first milestone above. Every planner in this room will see the same
                sequence, in the same order.
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
