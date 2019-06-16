export const mapObjectToFormData = object =>
  Object.keys(object).reduce((formData, key) => {
    formData.append(key, JSON.stringify(object[key]));
    return formData;
  }, new FormData());
