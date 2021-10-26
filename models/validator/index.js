function validatePayLoad(schema, payload) {
    try {
      const validationResult = schema.validate(payload, {abortEarly: false});
      if (validationResult.error) throw validationResult.error;
      return validationResult.value;
    } catch (e) {
      throw new Error(e.details.map((el) => el.message).join('\n'));
    }
  }
  
  module.exports = validatePayLoad;