var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  },
  data() {
    return {
      info: null
    }
  },
  mounted() {
    axios.get('https://localhost:9443/sentence-diagram-web/api/sentences')
      .then(response => this.info = response.data.originalSentence);
  },
  methods: {
    create: function () {
      var params = new URLSearchParams();
      params.append('text', document.getElementsByName('text')[0].value);
      axios.post('/sentence-diagram-web/api/sentences', params);
      document.getElementsByName('text')[0].value = '';
      axios.get('https://localhost:9443/sentence-diagram-web/api/sentences')
        .then(response => this.info = response.data.originalSentence);
    }
  }
});
