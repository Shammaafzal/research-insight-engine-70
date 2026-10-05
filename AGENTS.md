<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture rules
- All ML backend calls go through `src/lib/api.ts` (ENDPOINTS map); components never build URLs — keeps FastAPI integration swappable.
- Config (API base URL, mock mode, limits) lives in `src/lib/config.ts` via VITE_* env vars — single source of runtime settings.
- Mock data lives only in `src/lib/mock.ts` and is used only when mock mode is on — the app must never fake AI results otherwise.
- App pages live under the `_app` pathless layout (sidebar shell); the landing page `/` is standalone.
- Data is fetched client-side with useQuery (no loaders) because the external backend may be unreachable during SSR.
