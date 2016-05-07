
window.Helpers = {
    QueryString: {
        stringify(query) {
            return Object.keys(query)
               .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(query[key]))
               .join("&");
        }
    }
};
