const mongoose = require("mongoose");

const childSchema = new mongoose.Schema({
  id: Number,
  name: String,
  display_name: String,
  parent_id: Number,
  has_active_children: Boolean,
  has_children: Boolean,
  children: [this],
  region_setting: {
    enable_size_chart: Boolean,
    low_stock_value: Number,
    dimension_mandatory: Boolean,
  },
  is_prohibit: Boolean,
});

// Define the schema for the top-level category
const categorySchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  id: Number,
  name: String,
  display_name: String,
  parent_id: Number,
  has_active_children: Boolean,
  has_children: Boolean,
  children: [childSchema],
  region_setting: {
    enable_size_chart: Boolean,
    low_stock_value: Number,
    dimension_mandatory: Boolean,
  },
  is_prohibit: Boolean,
}, {
  collection: 'categories'
});

const Category = mongoose.model('Category', categorySchema);
const ChildCategory = mongoose.model('ChildCategory', childSchema);

module.exports = {
  Category,
  ChildCategory,
}