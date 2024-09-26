class ApiClient {
  // TODO: It must be configured by environment.
  baseURL = "http://localhost:3000/api/v1/"

  defaultHeaders() {
    const token = localStorage.getItem('token');
    const headers = {};
    headers["Content-Type"] = "application/json";
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers
  }

  async send(path, {method, body }) {
    const url = new URL(path, this.baseURL)
    const response = await fetch(url.href, {
      method,
      headers: this.defaultHeaders(),
      body: JSON.stringify(body)
    });
    // Prevent JSON parsing error on status 204 (No Content)
    const data = response.status === 204 ? {} : await response.json();
    const { status, statusText, responseOk = response.ok } = response;
    return {responseOk, data, status, statusText, response};
  }

  async get(path) {
    return this.send(path, {method: 'GET'})
  }

  async post(path, body) {
    return this.send(path, {method: 'POST', body})
  }

  async delete(path) {
    return this.send(path, {method: 'delete'})
  }

  async patch(path, body) {
    return this.send(path, {method: 'PATCH', body})
  }

  async login(email, password) {
    const response = await this.post('login', { email, password });
    const { data, responseOk } = response;
    if (responseOk) {
      localStorage.setItem('token', data.token);
      const { name } = (await this.getUserData()).data
      localStorage.setItem('userName', name);
    }
    return response;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
  }

  async getUserData() {
    return this.get('me');
  }

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  currentUser() {
    return localStorage.getItem('userName');
  }

  getProjects() {
    return this.get('projects');
  }

  createProject(body) {
    return this.post(`projects`, body);
  }

  updateProject(id, body) {
    return this.patch(`projects/${id}`, body);
  }

  deleteProject(id) {
    return this.delete(`projects/${id}`);
  }
}

export default new ApiClient()
