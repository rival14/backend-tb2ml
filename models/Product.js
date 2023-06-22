const mongoose = require("mongoose");

const Schema = mongoose.Schema;
let productSchema = new Schema({
  id: String,
  modelId: Number,
  name: String,
  slug: String,
  categoryId: Number,
  description: String,
  videoUrl: String,
  commissionPrice: Number,
  commissionLabel: String,
  retailPrice: Number,
  retailPriceLabel: String,
  customerPrice: Number,
  customerPriceLabel: String,
  discountPrice: Number,
  isCOD: Number,
  isCheapestPrice: Boolean,
  isShared: Number,
  isFlashSale: Number,
  isPO: Number,
  resellerPriceMax: Number,
  resellerPriceMaxLabel: String,
  resellerPriceMin: Number,
  resellerPriceMinLabel: String,
  weight: Number,
  weightLabel: String,
  stock: Number,
  tagIds: {
    type: [
      Number
    ]
  },
  totalStock: Number,
  labelVariant: String,
  labelSubVariant: String,
  point: Number,
  minPoint: Number,
  warehouseTitle: String,
  warehouseAddress: String,
  productModelParentId: Number,
  categoryName: String,
  categoryLevel2Name: String,
  categoryLevel1Name: String,
  brandId: Number,
  brandName: String,
  brandLevelId: Number,
  brandLogo: String,
  brandType: String,
  rating: Number,
  sold: Number,
  totalSold: Number,
  deliveryProgramId: String,
  images: {
    type: [
      String
    ]
  },
  variants: {
    type: [
      "Mixed"
    ]
  },
  warehouse: {
    type: [
      "Mixed"
    ]
  },
  vouchers: {
    type: [
      "Mixed"
    ]
  }
}, {
  collection: 'products'
});

module.exports = mongoose.model('Product', productSchema)