const Plugin = {
  // Plugin metadata
  name: "Redirect 404",
  description: "Redirects to custom 404 page for non-existent URLs",
  version: "1.0.1",

  // Inject JavaScript into the page footer
  footer_script: () => {
    return `
      <script>
        document.addEventListener("DOMContentLoaded", function() {
          // Check for empty content or missing main element
          if (!document.querySelector("main") || document.querySelector("main").innerHTML.trim() === "") {
            window.location.replace("/page/not-found");
          } else {
            // Fallback: Check HTTP status via fetch
            fetch(window.location.href, { method: "HEAD" })
              .then(response => {
                if (response.status === 404) {
                  window.location.replace("/page/not-found");
                }
              })
              .catch(() => {
                // If fetch fails, rely on content check
                if (!document.querySelector("main") || document.querySelector("main").innerHTML.trim() === "") {
                  window.location.replace("/page/not-found");
                }
              });
          }
        });
      </script>
    `;
  },

  // Configuration workflow for plugin settings
  configuration_workflow: () => ({
    steps: [
      {
        name: "Configuration",
        form: () => ({
          fields: [
            {
              name: "not_found_page",
              label: "404 Page URL",
              type: "String",
              attributes: { default: "/page/not-found" },
              required: true,
            },
          ],
        }),
      },
    ],
  }),
};

// Export the plugin for Saltcorn
module.exports = Plugin;
