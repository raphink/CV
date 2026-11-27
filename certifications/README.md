# Credentials page

The page loads `credentials.json`. A GitHub Actions job refreshes that data once a day from the public badge feed behind the CertDirectory profile, follows all feed pages, omits Isovalent-issued credentials, deduplicates repeated badges, and includes badge artwork and verification links.

The browser cannot safely fetch the feed directly: Credly does not return cross-origin access headers for this endpoint. The scheduled job fetches it server-side and updates the data file used by the static page. Run **Sync public credentials** in GitHub Actions to refresh it immediately.
