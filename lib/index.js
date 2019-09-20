/**
 * @fileoverview Prevent definition of unused component properties and methods
 * @author Berton Zhu
 */

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

module.exports = {
  rules: {
    'no-unused-class-property': require('./rules/no-unused-class-property'),
  },
};
