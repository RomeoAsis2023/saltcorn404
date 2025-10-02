const Plugin = {
  // Plugin metadata
  name: "Redirect 404",
  description: "Redirects to custom 404 page for non-existent URLs",
  version: "1.0.0",

  // Inject JavaScript into the page footer
  footer_script: () => {
    return `
      <script>
        // Run after DOM is fully loaded
        document.addEventListener("DOMContentLoaded", function() {
          // Check if the page is a 404 by looking for server-rendered status or content
          fetch(window.location.href, { method: "HEAD" })
            .then(response => {
              // If status is 404, redirect to custom 404 page
              if (response.status === 404) {
                window.location.replace("/page/not-found");
              }
              // Additional check: if page content is empty or lacks expected elements
              else if (!document.querySelector("main") || document.querySelector("main").innerHTML.trim() === "") {
                window.location.replace("/page/not-found");
              }
            })
            .catch(error => {
              // In case of network error or CORS issues, fallback to content check
              if (!document.querySelector("main") || document.querySelector("main").innerHTML.trim() === "") {
                window.location.replace("/page/not-found");
              }
            });
        });
      </script>
    `;
  },

  // Optional: Define plugin requirements or configuration
  configuration_workflow: () => {
    return {
      steps: [
        {
          name: "Configuration",
          form: () => ({
            fields: [
              {
                name: "not_found_page",
                label: "404 Page URL",
                type: "String",
                default: "/page/not-found",
                required: true,
              },
            ],
          }),
        },
      ],
    };
  },
};

// Export the plugin for Saltcorn
module.exports = Plugin;
