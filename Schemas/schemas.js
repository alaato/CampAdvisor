const Basejoi = require('joi');
const sanitizeHTML = require('sanitize-html');

const extension = (joi) => ({
  type: 'string',
  base: joi.string(),
  messages: {
    'string.escapeHTML': '{{#label}} must not inculde HTML'
  },
  rules: {
    escapedHTML: {
      validate(value, helpers) {
        const clean = sanitizeHTML(value, {
          allowedTags: [],
          allowedAttributes: {},
        })
        if(clean !== value) {
          return helpers.error('string.escapeHTML', {value});
        }
        return clean;
      }
    }
  }
 })
 const joi = Basejoi.extend(extension)

module.exports.CampgroundSchema = joi.object({
    title: joi.string().required().escapedHTML(),
    price : joi.number().required().min(0),
    // image: joi.string().required(),
    description: joi.string().required().escapedHTML(),
    location: joi.string().required(),
    imagedelete: joi.array() 
  });

  module.exports.reviewSchema = joi.object({
    rating: joi.number().required().min(1).max(5),
    comment: joi.string().required().escapedHTML()
  });