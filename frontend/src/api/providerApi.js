// src/api/providerApi.js

export const submitProviderForm = async (formData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Mock Provider Submission:", formData);
      resolve({ status: "success", message: "Thank you! Your service has been submitted." });
    }, 1000); // Simulate delay
  });
};
