class ResponseError extends Error {
  constructor(response, data, ...params) {
    super(...params);
    this.name = 'ResponseError';
    this.response = response;
    this.data = data;
  }
}

export default ResponseError;
