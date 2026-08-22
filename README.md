# Milestone Map

Build a small shared path of milestones and mark progress together. The list is synchronized peer-to-peer with Yjs and has no app backend.

**Live:** https://baditaflorin.github.io/mesh-milestone-map/

## Use it

1. Open the app with teammates and choose the same room in Settings.
2. Add the steps in your plan.
3. Check each milestone as the room completes it.

## Development

`mesh-common` must be a sibling checkout because this app uses its local package.

```bash
npm install
npm run typecheck
npm run test:unit
npm run smoke
```

Pages publishes committed `docs/` from `main`. The root `.woodpecker.yml` runs the same checks in fleet CI. See [privacy details](docs/privacy.md).
