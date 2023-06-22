const axios = require('axios');
const { districtJakarta, axiosHeader } = require('../util/constants');
const Product = require('../models/Product');
const Excel = require('exceljs');
const path = require('path');
const { Category } = require('../models/Category');

const fetchProduct = async (text, page) => {
  return await axios.post('https://evermos.com/internal-api/v1/product-discovery/search', {
    "page": page,
    "size": 1,
    "orderBy": "",
    "navSource": "search_result",
    "brandId": null,
    "nextCursor": page,
    "minPrice": null,
    "maxPrice": null,
    "isCod": null,
    "isMarketplaceable": true,
    "isWarehouse": true,
    "districtIds": null,
    "isPo": false,
    "text": text,
    "tagIds": null,
    "brandLevelIds": null,
    "categoryId": null
  }, axiosHeader).then(res => res.data.data);
}

const getProduct = async (req, res) => {
  try {
    let allProducts = [];
    async function fetchAllProduct(cursor) {
      const page = await fetchProduct(req.query.text, cursor);
      page.products.map((item, i) => {
        axios.get(`https://evermos.com/internal-api/v3/product?modelSlug=${item.slug}`, axiosHeader)
          .then(async ({data}) => {
            data.data.variants
            await Product.updateOne({ id: data.data.id }, { $set: data.data }, { upsert: true });

            axios.get(`https://evermos.com/external-api/v3/product/warehouse?withEmptyStock=true&productId=${item.modelId}`, axiosHeader)
              .then(async ({data}) => {
                await Product.updateOne({ id: item.id }, { $set: {warehouse: data.data.warehouse} }, { upsert: true });
              });
          });
      })
      allProducts = [...new Set([...allProducts ,...page.products])]
      if (page.pagination.nextCursor) {
        await fetchAllProduct(page.pagination.nextCursor);
      }
    }
    await fetchAllProduct()
    res.send(allProducts)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const massUploadShopee = async (req, res) => {
  // let matchedCategory;
  // const category = await Category.findOne({ 'children.children.display_name': {
  //     $regex: 'Blouse', $options: 'i'
  //   }
  // });
  // const findCategory = (children) => {
  //   if (children.has_children && children.children.length > 0) {
  //     children.children.map(child => findCategory(child))
  //   }else{
  //     console.log(children.display_name)
  //     if (children.display_name.toLowerCase().includes('mandi'.toLowerCase())) {
  //       matchedCategory = children
  //       return children;
  //     }else{
  //       children.children.map(child => findCategory(child))
  //     }
  //   }
  // }
  // category.children.map(child => findCategory(child))
  // res.send(matchedCategory)
  const data = await Product.find({ id: '1b2eb66d-846c-4e93-9ddc-b832d7d833a5' }).limit(1)
  var workbook = new Excel.Workbook();
  workbook.xlsx.readFile(path.join(__dirname, '../template/shopee_template.xlsx'))
    .then(async () => {
      let newWorkbook = new Excel.Workbook();
      newWorkbook.xlsx.readFile(path.join(__dirname, '../template/shopee_template.xlsx'))
        .then(async () => {

          var targetWb = newWorkbook.worksheets[1];
          let initialRow = 7;

          // Iterate Product
          data.map((product, i) => {
            // Iterate Variants
            product.variants.map(variant => {
              // Iterate Sub Variant
              variant.subVariants.map(subVariant => {
                // Add Row per Sub Variant
                targetWb.getRow(7 + i).getCell(2).value = product.name;
                targetWb.getRow(7 + i).getCell(3).value = product.description.length >= 2800 ? product.description.substring(0, 2800) : product.description;
                targetWb.getRow(7 + i).getCell(6).value = product.id;
                targetWb.getRow(7 + i).getCell(7).value = product.labelVariant.length > 14 ? product.labelVariant.split(' ')[0] : product.labelVariant;
                targetWb.getRow(7 + i).getCell(8).value = variant.value > 20 ? variant.value.split[0] : variant.value;
                targetWb.getRow(7 + i).getCell(10).value = product.labelSubVariant.length > 14 ? product.labelSubVariant.split(' ')[0] : product.labelSubVariant;
                targetWb.getRow(7 + i).getCell(11).value = subVariant.value > 20 ? subVariant.value.split[0] : subVariant.value;
                targetWb.getRow(7 + i).getCell(12).value = subVariant.resellerPrice * 1.1 - 1; // Incerase Price 10%
                targetWb.getRow(7 + i).getCell(13).value = subVariant.totalStock;
                targetWb.getRow(7 + i).getCell(16).value = product.images[0];
                targetWb.getRow(7 + i).getCell(17).value = variant.images[1] ?? null;
                targetWb.getRow(7 + i).getCell(18).value = variant.images[2] ?? null;
                targetWb.getRow(7 + i).getCell(19).value = variant.images[3] ?? null;
                targetWb.getRow(7 + i).getCell(20).value = variant.images[4] ?? null;
                targetWb.getRow(7 + i).getCell(21).value = variant.images[5] ?? null;
                targetWb.getRow(7 + i).getCell(22).value = variant.images[6] ?? null;
                targetWb.getRow(7 + i).getCell(23).value = variant.images[7] ?? null;
                targetWb.getRow(7 + i).getCell(24).value = variant.images[8] ?? null;
                targetWb.getRow(7 + i).getCell(25).value = subVariant.weight;
                targetWb.getRow(7 + i).getCell(26).value = subVariant.length;
                targetWb.getRow(7 + i).getCell(27).value = subVariant.width;
                targetWb.getRow(7 + i).getCell(28).value = subVariant.height;
                targetWb.getRow(7 + i).getCell(29).value = 'Aktif';
                targetWb.getRow(7 + i).getCell(30).value = 'Tidak Aktif';

                initialRow++;
              })
            })
          })

          // await newWorkbook.commit();
          await newWorkbook.xlsx.writeFile('public/shopee/' + Date.now() + '.xlsx');
        });
    })
    res.send(data)

}

module.exports = {
  getProduct,
  massUploadShopee,
}